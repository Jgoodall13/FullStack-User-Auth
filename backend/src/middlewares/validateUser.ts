import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateUser = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email"),
  check("age").isInt({ min: 0 }).withMessage("Age must be a positive number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
