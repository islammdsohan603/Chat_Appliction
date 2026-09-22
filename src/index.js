import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Chat Application Backend is Running");
});

// Start server
app.listen(port, () => {
  connectDB();
  console.log(`Server started on port ${port}`);
});
