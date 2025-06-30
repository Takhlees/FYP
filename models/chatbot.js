import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export default mongoose.models.chatbot || mongoose.model("chatbot", chatbotSchema);