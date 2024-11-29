import express from "express";
import cors from "cors";
import morgan from "morgan";
import { stream } from "./utils/logger";
import userRoutes from "./routes/users";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("combined", { stream }));
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);

// Default route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

export default app;
