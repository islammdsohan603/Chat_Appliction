import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.models.js";
import genToken from "../config/token.js";

// user SignUp

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

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "signUp error",
    });
  }
};

// user  lgoIn

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user does not exist!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "incorrect password",
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "login error",
    });
  }
};

// user logOut

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "log out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "LogOut error",
    });
  }
};
