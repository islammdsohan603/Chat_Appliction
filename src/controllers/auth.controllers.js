import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.models.js";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const checkUserByUserName = await User.findOne({ userName });

    if (checkUserByUserName) {
      return res.status(400).json({
        message: "user Name already exist!",
      });
    }

    const checkUserbyEmail = await User.findOne({ email });

    if (checkUserbyEmail) {
      return res.status(400).json({
        message: "user Email already exist!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be at least 6 characters!",
      });
    }

    const hassPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hassPassword,
    });
  } catch (error) {}
};
