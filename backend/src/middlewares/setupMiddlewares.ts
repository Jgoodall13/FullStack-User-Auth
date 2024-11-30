import cors from "cors";
import morgan from "morgan";
import express from "express";
import { stream } from "../utils/logger";

export const setupMiddlewares = (app: express.Application) => {
  app.use(cors());
  app.use(morgan("combined", { stream }));
  app.use(express.json());
};
