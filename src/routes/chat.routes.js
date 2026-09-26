import express from "express";
import { sendMessage, getMessages } from "../controllers/chat.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const chatRouter = express.Router();

chatRouter.post("/send/:receiverId", isAuth, sendMessage);
chatRouter.get("/:receiverId", isAuth, getMessages);

export default chatRouter;
