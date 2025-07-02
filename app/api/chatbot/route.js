
import { connectToDB } from "@utils/database";
import ChatHistory from "@/models/chatHistory";
import chatbot from "@/models/chatbot";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import stringSimilarity from "string-similarity";

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
    const previousChats = await ChatHistory.find({ user: userId }, "role text").lean();
    const historyParts = previousChats.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Check similarity with DB questions
    const allQuestions = await chatbot.find({});
    const questionList = allQuestions.map((q) => q.question);
    const { bestMatch } = stringSimilarity.findBestMatch(textInput, questionList);

    if (bestMatch.rating > 0.6) {
     const matched = allQuestions.find(
  (q) => q.question.trim().toLowerCase() === bestMatch.target.trim().toLowerCase()
);
      return NextResponse.json({ response: matched.answer });
    }

    // Prepare Gemini prompt
    const systemContext = {
      role: "user",
      parts: [
        {
          text: `You are DocuLess AI, a smart assistant for a university file/document management system. Only admins use this system. Respond only to queries about:
- Uploading, scanning, filtering, and categorizing PDF files.
- Department/category assignment.
- Overdue mail tracking and notifications.
- Search/filter and document storage/retrieval.
Do not respond to irrelevant topics. Always maintain professional tone.`,
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
  return NextResponse.json({ response: "AI could not process your request." });
}

if (
  !data?.candidates ||
  !data?.candidates[0]?.content?.parts?.[0]?.text
) {
  console.error("Gemini malformed response:", JSON.stringify(data, null, 2));
  return NextResponse.json({ response: "Sorry, I couldn't understand your question." });
}

if (data.error) {
  console.error("Gemini API Error:", data.error);
  return NextResponse.json({ response: "There was an issue with AI response." });
}

const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text

    // Save chat history
    await ChatHistory.create({ user: userId, role: "user", text: textInput, image: image?.name || null });
    await ChatHistory.create({ user: userId, role: "model", text: answer });

    return NextResponse.json({ response: answer });


  } catch (err) {
    console.error("Chat Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
