import express from "express";
import { streamAiChat } from "../controllers/ai.controllers.js";

const aiRouter = express.Router();

// SSE Streaming chat endpoint
aiRouter.post("/chat/stream", streamAiChat);

export default aiRouter;
