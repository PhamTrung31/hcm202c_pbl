import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getQuizResults } from '../routes/quiz';
import { mongoService } from '../database/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize MongoDB connection if not connected
    if (!mongoService.isConnected) {
      await mongoService.connect();
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Call the existing handler function with next function
    await getQuizResults(req as any, res as any, () => {});
  } catch (error) {
    console.error('Quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}