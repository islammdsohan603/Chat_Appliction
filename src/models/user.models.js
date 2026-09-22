import mongoose from "mongoose";

const useSchema = new mongoose.Schema(
  {
    name: { type: String },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);
