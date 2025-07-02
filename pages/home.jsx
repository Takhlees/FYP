
"use client";
import Home from '@components/Home'

export default function home() {

  return (
    <>
            <Home/>
            
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
</button>  */}
    </>
  )
}