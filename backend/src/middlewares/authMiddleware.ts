import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const SECRET_KEY = process.env.JWT_SECRET!;

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token Payload:", decoded);
    req.user = decoded as jwt.JwtPayload;
    next();
  } catch (err: any) {
    console.error("Invalid token:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assuming req.user is populated from the JWT
    if (user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
