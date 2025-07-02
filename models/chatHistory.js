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
  },
  { timestamps: true }
);

const ChatHistory = mongoose.models.ChatHistory || mongoose.model("ChatHistory", ChatHistorySchema);

export default ChatHistory;
