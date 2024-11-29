import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  console.log("Received Refresh Token:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    // Find the user with the provided refresh token
    const user = await User.findOne({ refreshToken }); // For single token setup
    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;
    console.log("Decoded Refresh Token:", decoded);

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Update the database with the new refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    console.log("Generated New Refresh Token:", newRefreshToken);

    console.log("Generated New Access Token:", newAccessToken);
    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    console.error("Invalid refresh token:", err.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
