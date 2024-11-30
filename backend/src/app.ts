import express from "express";
import { setupMiddlewares } from "./middlewares/setupMiddlewares";
import userRoutes from "./routes/users";
import friendRoutes from "./routes/friends";
import errorHandler from "./middlewares/errorHandler";
import logger from "./utils/logger";

const app = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/friends", friendRoutes);

// Default route for API information
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Jacob's Social Network API",
    routes: {
      users: "/api/v1/users",
      friends: "/api/v1/friends",
    },
  });
});

// Default route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Route not found :-(" });
});

// Error handling middleware
app.use(errorHandler);

export default app;
