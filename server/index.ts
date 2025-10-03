import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { saveQuizResult, getQuizResults, getPlayerRank } from "./routes/quiz";
import { getQuizQuestions, getQuizStats } from "./routes/quiz-questions";
import { getHistorySummary } from "./routes/history";
import { getChatbotResponse } from "./routes/chatbot";
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

  // Health check for hosting providers (Render, Heroku, etc.)
  // Responds 200 so platform port scanners can verify the service is up.
  app.get("/health", (_req, res) => {
    res.sendStatus(200);
  });

  app.get("/api/demo", handleDemo);
  
  // Quiz routes
  app.get("/api/quiz/questions", getQuizQuestions);
  app.get("/api/quiz/stats", getQuizStats);
  app.post("/api/quiz/save-result", saveQuizResult);
  app.post("/api/quiz/rank", getPlayerRank);
  app.get("/api/quiz/results", getQuizResults);

  // History routes
  app.get("/api/history/summary", getHistorySummary);

  // Chatbot routes
  app.post("/api/chatbot/message", getChatbotResponse);

  return app;
}
