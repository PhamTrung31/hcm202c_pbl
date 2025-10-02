import type { VercelRequest, VercelResponse } from "@vercel/node";
import { mongoService } from "./database/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      mongodb: mongoService.isConnected ? "connected" : "disconnected",
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
