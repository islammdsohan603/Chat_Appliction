import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// route

app.use("/api/auth", authRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Chat Application Backend is Running");
});

// Start server
app.listen(port, () => {
  connectDB();
  console.log(`Server started on port ${port}`);
});
