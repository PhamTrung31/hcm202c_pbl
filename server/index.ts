import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { mongoService } from "./database/mongodb.js";

import { handleDemo } from "./routes/demo.js";
import { getQuizQuestions, getQuizStats } from "./routes/quiz-questions.js";
import {
  getPlayerRank,
  getQuizResults,
  saveQuizResult,
} from "./routes/quiz.js";
import { getHistorySummary } from "./routes/history.js";
import { getChatbotResponse } from "./routes/chatbot.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true, // bạn có thể set thành domain của frontend nếu muốn an toàn hơn
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // MongoDB
  mongoService.connect().catch(console.error);

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/quiz/questions", getQuizQuestions);
  app.get("/api/quiz/stats", getQuizStats);
  app.post("/api/quiz/save-result", saveQuizResult);
  app.post("/api/quiz/rank", getPlayerRank);
  app.get("/api/quiz/results", getQuizResults);

  app.get("/api/history/summary", getHistorySummary);
  app.post("/api/chatbot/message", getChatbotResponse);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      mongodb: mongoService.isConnected ? "connected" : "disconnected",
    });
  });

  // 👉 Serve frontend React build
  const frontendPath = path.join(__dirname, "../client-dist");
  app.use(express.static(frontendPath));

  // Catch-all: cho React Router
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  return app;
}

// Nếu chạy local: start server
if (require.main === module) {
  const app = createServer();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
}

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
