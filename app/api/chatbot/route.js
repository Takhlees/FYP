import { connectToDB } from "@utils/database";
import chatbot from "@/models/chatbot";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

export async function POST(req) {
   const { question } = await req.json();
  await connectToDB();

  const allQuestions = await chatbot.find({});

  const questionList = allQuestions.map((q) => q.question);

  // Find best match
  const { bestMatch } = stringSimilarity.findBestMatch(question, questionList);

  if (bestMatch.rating > 0.5) {
    const matched = allQuestions.find(q => q.question === bestMatch.target);
    return NextResponse.json({ answer: matched.answer });
  }


  // Step 2: If not found → Ask OpenAI
  const systemMessage = `
You are a helpful assistant for a university admin document management system.
It allows admins to upload or scan PDF files, categorize them under departments and categories, filter/search them, track overdue mails, and manage data.
Only admins use this system. Don’t answer irrelevant questions.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: question },
      ],
      max_tokens: 100,
    }),
    
  });
const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;
 console.log("OpenAI Response:", JSON.stringify(data)); 
  return NextResponse.json({ answer: reply });
  

  //   const response = await openai.completions.create({
  //     model: "gpt-3.5-turbo-instruct",
  //     messages: [
  //       { role: "system", content: systemMessage },
  //       { role: "user", content: question },
  //     ],
  //   });

  //   return Response.json({ answer: response.choices[0].message.content });
}
