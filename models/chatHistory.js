import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    base64Image: {
      type: String,
      default: null, // This will store the actual image content
    },
  },
  { timestamps: true }
);

const ChatHistory = mongoose.models.ChatHistory || mongoose.model("ChatHistory", ChatHistorySchema);

export default ChatHistory;
