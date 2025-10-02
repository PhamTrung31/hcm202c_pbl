import type { NextApiRequest, NextApiResponse } from "next";
import { getChatbotResponse } from "server/routes/chatbot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
  // Dùng lại logic Express (ép kiểu)
  return (getChatbotResponse as any)(req as any, res as any);
}
