import { connectToDB } from "@utils/database";
import ChatHistory from "@/models/chatHistory";
import chatbot from "@/models/chatbot";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import stringSimilarity from "string-similarity";
import { formatMessage } from "@/utils/formatChatResponse";

export async function POST(req) {
  try {
    await connectToDB();

    // Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get text and image from form
    const formData = await req.formData();
    const textInput = formData.get("text");
    const image = formData.get("image");

    // Convert image to base64 if exists
    let imageData = null;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      if (arrayBuffer) {
        const buffer = Buffer.from(arrayBuffer);
        imageData = buffer.toString("base64");
      }
    }

    // Get previous chats
    const previousChats = await ChatHistory.find(
      { user: userId },
      "role text"
    ).lean();
    const historyParts = previousChats.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Check similarity with DB questions
    const allQuestions = await chatbot.find({});
    const questionList = allQuestions.map((q) => q.question);
    const { bestMatch } = stringSimilarity.findBestMatch(
      textInput,
      questionList
    );

    if (bestMatch.rating > 0.6) {
      const matched = allQuestions.find(
        (q) =>
          q.question.trim().toLowerCase() ===
          bestMatch.target.trim().toLowerCase()
      );
      return NextResponse.json({ response: matched.answer });
    }

    // Prepare Gemini prompt
    const systemContext = {
      role: "user",
      parts: [
        {
          text: `You are Doculus AI, a smart assistant integrated into a university document management system website built using MongoDB as the backend database.

Your purpose is strictly limited to assisting with the functionalities described below. You must not answer or respond to any personal, unrelated, or general queries, nor should you respond to any images or text that are not directly related to this project.

🔒 Scope of Allowed Interactions:
You are allowed to respond only to queries related to the following functionalities and modules of the website:

🔐 Authentication:

Sign-in using provided email and password.
Forgot password and Change password functionalities.
🏠 Home Page Features:

Scan: Allows users to scan documents using a mobile device. These are converted to PDF and uploaded.
Upload: Allows users to upload PDF documents.
Upon upload/scan, the system extracts the subject automatically; users manually enter diary number, department, category, type, and status.
🏢 Department & Admin Pages:

Both Department and Admin pages are similar.
Admin page is for managing admin departments; Department page is for university departments.
Add, edit, or delete departments based on type (e.g., University or Admin).
Click on a department to view its categories.
Selecting “All” shows all files under that department.
Selecting a specific category filters files accordingly.
🔎 File Search & Actions:

Search by diary number, subject, or date.
View, download, edit, or delete documents.
📬 Overdue Mails:

Display all mails with “open” status.
Allow updating the status.
Once status is updated, the mail is removed from the Overdue Mails page.
📂 Recent Files:

Display the three most recently added, opened, or edited files.
📞 Contact Form:

Allow the admin to send a message with email and username via a contact form.
The message is received by the system administrator.
📃 About Page:

Contains explanation of all above features and purpose of the website.
🧠 ChatBot Behavior (Text + Image Handling Rules):
✅ Allowed Text Inputs:

Questions strictly related to the above functionalities.
Queries about uploading, scanning, managing files, departments, categories, mail status, and searching.
❌ Disallowed Text Inputs:

Do not respond to personal, unrelated, or general questions (e.g., life advice, jokes, programming questions, etc.).
✅ Allowed Image Inputs:

Only respond to screenshots of the website or its pages (e.g., home page, scan/upload interface, dashboard).
Only respond to project-related diagrams (e.g., sequence diagrams, data flow diagrams).
❌ Disallowed Image Inputs:

Do not respond to any non-project-related images (e.g., selfies, scenery, unrelated documents, social media screenshots).
If an image is not related to the project, reply:
“This image is not related to the Doculus document system. Please upload a valid screenshot or diagram from the project.”

🔐 Strict Boundaries:
Never answer personal, philosophical, irrelevant, or general knowledge questions.
Never assist with any unrelated task or topic.
You are a purpose-built assistant for the Doculus university document system only.
Please format all your answers clearly using bullet points or bold text for section titles. Avoid raw markdown symbols like asterisks or backslashes in the output.
`,
        },
      ],
    };

    const currentInput = {
      role: "user",
      parts: [{ text: textInput }],
    };

    if (imageData) {
      currentInput.parts.push({
        inline_data: {
          mime_type: image?.type || "image/jpeg", // Use fallback or null check
          data: imageData,
        },
      });
    }

    const payload = {
      contents: [systemContext, ...historyParts, currentInput],
    };

    // Gemini API call
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();

    if (data?.error) {
      console.error("Gemini Error:", data.error);
      return NextResponse.json({
        response: "AI could not process your request.",
      });
    }

    if (!data?.candidates || !data?.candidates[0]?.content?.parts?.[0]?.text) {
      console.error(
        "Gemini malformed response:",
        JSON.stringify(data, null, 2)
      );
      return NextResponse.json({
        response: "Sorry, I couldn't understand your question.",
      });
    }

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return NextResponse.json({
        response: "There was an issue with AI response.",
      });
    }

    const rawAnswer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const answer = formatMessage(rawAnswer);


    // Save chat history
    await ChatHistory.create({
      user: userId,
      role: "user",
      text: textInput,
      image: image?.name || null,
      base64Image: imageData || null,
    });
    await ChatHistory.create({ user: userId, role: "model", text: answer });

    return NextResponse.json({ response: answer });
  } catch (err) {
    console.error("Chat Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const chats = await ChatHistory.find(
      { user: userId },
      "role text image base64Image"
    )
      .sort({ createdAt: 1 })
      .lean();
    const formattedChats = chats.map((chat) => ({
      from: chat.role === "user" ? "user" : "model",
      text: chat.text,
      image: chat.base64Image
        ? `data:image/jpeg;base64,${chat.base64Image}`
        : null,
    }));

    return NextResponse.json({ chats: formattedChats });
  } catch (err) {
    console.error("Error loading chat history:", err);
    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 }
    );
  }
}
