import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./db/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Chat Application Backend is Running");
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

startServer();
