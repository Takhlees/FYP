
"use client";
import Home from '@components/Home'
import ChatBot from "@/components/ChatBot";

export default function home() {

  return (
    <>
            <Home/>
             <ChatBot />
             {/* <button
  onClick={() =>
    fetch("/api/chatbot/seed", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
  }
>
  Seed Chatbot Data
</button> */}
    </>
  )
}