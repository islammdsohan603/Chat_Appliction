import express from "express";
import {
  streamAiChat,
  saveAiMessage,
  getAiHistory,
  clearAiHistory,
} from "../controllers/ai.controllers.js";
import { optionalAuth } from "../middlewares/isAuth.js";

const aiRouter = express.Router();

// SSE Streaming chat endpoint (with concurrent database persistence)
aiRouter.post("/chat/stream", optionalAuth, streamAiChat);

// Explicit message save endpoint
aiRouter.post("/message", optionalAuth, saveAiMessage);

// Conversation history retrieval & clearing endpoints
aiRouter.get("/history", optionalAuth, getAiHistory);
aiRouter.delete("/history", optionalAuth, clearAiHistory);

export default aiRouter;
