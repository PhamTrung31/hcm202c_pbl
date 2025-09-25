import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { saveQuizResult, getQuizResults } from "./routes/quiz";
import { mongoService } from "./database/mongodb";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize MongoDB connection
  mongoService.connect().catch(console.error);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // Quiz routes
  app.post("/api/quiz/save-result", saveQuizResult);
  app.get("/api/quiz/results", getQuizResults);

  return app;
}
