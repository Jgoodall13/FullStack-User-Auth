import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { log } from "console";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const getAllUsersDuplicate = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role = "admin" } = req.body; //admin or user

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Save the user (pre('save') hook will handle password hashing)
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { name, email, role },
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info("in the login controller ", req.body);

  try {
    const user: any | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate Tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Save the refresh token in the database
    user.refreshToken = refreshToken; // For single token setup
    // user.refreshTokens.push(refreshToken); // For multiple tokens setup
    const mongoreturn = await user.save();
    const mongoId = mongoreturn._id;
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      mongoId,
    });
  } catch (err: any) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Refresh token is required" });

  try {
    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    user.refreshToken = null; // For single refresh token setup
    // user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken); // For multiple tokens setup
    await user.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (err: any) {
    console.error("Error during logout:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const userInfo = async (req: Request, res: Response) => {
  try {
    // The user ID is extracted from the token by the `authenticateToken` middleware.
    const userId = req.user.id;
    console.log("Logged-in user ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the specific user info
    res.status(200).json({
      name: user.name,
      email: user.email,
      about: user.about || "No about info provided",
      hobbies: user.hobbies || [],
    });
  } catch (err: any) {
    console.error("Error fetching user info:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
