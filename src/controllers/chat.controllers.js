import Chat from "../models/chat.models.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId || req.body.receiverId;
    const message = req.body.message ?? req.body.text;
    const attachments = req.body.attachments || [];

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    if ((!message || !message.trim()) && attachments.length === 0) {
      return res.status(400).json({
        message: "Message content or attachment is required",
      });
    }

    const newChat = new Chat({
      senderId,
      receiverId,
      message: message ? message.trim() : "",
      attachments,
    });

    await newChat.save();

    return res.status(201).json({
      message: "Message sent successfully",
      chat: newChat,
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({
      message: "Server error while sending message",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    return res.status(500).json({
      message: "Server error while fetching messages",
    });
  }
};
