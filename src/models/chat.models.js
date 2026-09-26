import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        id: String,
        name: String,
        size: String,
        type: { type: String },
        previewUrl: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
