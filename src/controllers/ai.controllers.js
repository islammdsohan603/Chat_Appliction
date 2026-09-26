import { GoogleGenAI } from "@google/genai";

/**
 * Initializes GoogleGenAI client using server environment variable
 */
const getAIClient = () => {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGEL_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured on the server");
  }
  return new GoogleGenAI({ apiKey });
};

const extractErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred";
  if (typeof error === "string") return error;
  if (error.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error?.message) {
        try {
          const nested = JSON.parse(parsed.error.message);
          if (nested.error?.message) return nested.error.message;
        } catch {
          return parsed.error.message;
        }
      }
    } catch {
      return error.message;
    }
    return error.message;
  }
  return String(error);
};

/**
 * Stream AI Chat controller via Server-Sent Events (SSE)
 * POST /api/ai/chat/stream
 * Body: { prompt?: string, messages?: Array<{ role: string, content?: string, text?: string }>, model?: string, systemInstruction?: string }
 */
export const streamAiChat = async (req, res) => {
  try {
    const { prompt, messages, model, systemInstruction } = req.body;

    if (!prompt && (!Array.isArray(messages) || messages.length === 0)) {
      return res.status(400).json({ error: "A prompt or messages array is required" });
    }

    const ai = getAIClient();

    // Support both single prompt and multi-turn conversation history
    let contents;
    if (Array.isArray(messages) && messages.length > 0) {
      contents = messages.map((m) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.content || m.text || "" }],
      }));
    } else {
      contents = prompt;
    }

    // Set Server-Sent Events (SSE) headers
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // Model fallback chain: user-requested / gemini-2.5-flash -> gemini-3.5-flash-lite -> gemini-flash-latest -> gemini-3.8-flash
    const candidateModels = [
      model || "gemini-2.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash",
    ].filter(Boolean);

    let stream = null;
    for (const targetModel of candidateModels) {
      try {
        stream = await ai.models.generateContentStream({
          model: targetModel,
          contents,
          config: systemInstruction ? { systemInstruction } : undefined,
        });
        break;
      } catch (modelErr) {
        if (targetModel !== candidateModels[candidateModels.length - 1]) {
          continue;
        }
        throw modelErr;
      }
    }

    let isConnected = true;
    req.on("close", () => {
      isConnected = false;
    });

    for await (const chunk of stream) {
      if (!isConnected) break;
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    if (isConnected) {
      res.write("data: [DONE]\n\n");
      res.end();
    }
  } catch (error) {
    const cleanError = extractErrorMessage(error);
    console.error("AI Streaming Error:", cleanError);

    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: cleanError })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }
    return res.status(500).json({ error: cleanError });
  }
};
