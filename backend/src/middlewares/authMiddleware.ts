import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    console.log("Decoded Token:", decoded);
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
