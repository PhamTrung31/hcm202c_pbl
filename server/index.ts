import "dotenv/config";
import express from "express";
import cors from "cors";
import { mongoService } from "./database/mongodb";
import { handleDemo } from "./routes/demo";
import { getQuizQuestions, getQuizStats } from "./routes/quiz-questions";
import { getPlayerRank, getQuizResults, saveQuizResult } from "./routes/quiz";
import { getHistorySummary } from "./routes/history";
import { getChatbotResponse } from "./routes/chatbot";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true, // Allow all origins in production or specify your domain
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Initialize MongoDB connection
  mongoService.connect().catch(console.error);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
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

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      mongodb: mongoService.isConnected ? "connected" : "disconnected",
    });
  });

  return app;
}

// Export for Vercel serverless
export default createServer();

// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import { handleDemo } from "./routes/demo";
// import { saveQuizResult, getQuizResults, getPlayerRank } from "./routes/quiz";
// import { getQuizQuestions, getQuizStats } from "./routes/quiz-questions";
// import { getHistorySummary } from "./routes/history";
// import { getChatbotResponse } from "./routes/chatbot";
// import { mongoService } from "./database/mongodb";

// export function createServer() {
//   const app = express();

//   // Middleware - CORS cho production
//   app.use(
//     cors({
//       origin:
//         process.env.NODE_ENV === "production"
//           ? ["https://hcm202c-pbl.vercel.app", /\.vercel\.app$/]
//           : "*",
//       credentials: true,
//       methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//       allowedHeaders: ["Content-Type", "Authorization"],
//     }),
//   );

//   // Add explicit OPTIONS handling
//   app.use(cors());

//   app.use(express.json({ limit: "10mb" }));
//   app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//   // MongoDB connection - chỉ connect một lần
//   if (!mongoService.isConnected) {
//     mongoService.connect().catch((err) => {
//       console.error("MongoDB connection failed:", err);
//     });
//   }

//   // Health check
//   app.get("/api/health", (_req, res) => {
//     res.json({
//       status: "ok",
//       timestamp: new Date().toISOString(),
//       mongodb: mongoService.isConnected ? "connected" : "disconnected",
//     });
//   });

//   // Ping endpoint
//   app.get("/api/ping", (_req, res) => {
//     const ping = process.env.PING_MESSAGE ?? "ping";
//     res.json({ message: ping });
//   });

//   // Demo
//   app.get("/api/demo", handleDemo);

//   // Quiz routes
//   app.get("/api/quiz/questions", getQuizQuestions);
//   app.get("/api/quiz/stats", getQuizStats);
//   app.post("/api/quiz/save-result", saveQuizResult);
//   app.post("/api/quiz/rank", getPlayerRank);
//   app.get("/api/quiz/results", getQuizResults);

//   // History routes
//   app.get("/api/history/summary", getHistorySummary);

//   // Chatbot routes
//   app.post("/api/chatbot/message", getChatbotResponse);

//   // 404 handler cho API routes
//   app.use("/api/:path(*)", (_req, res) => {
//     res.status(404).json({
//       success: false,
//       message: "API endpoint not found",
//     });
//   });

//   return app;
// }
