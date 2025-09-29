import { RequestHandler } from "express";
import { GetQuizQuestionsRequest, GetQuizQuestionsResponse, QuizQuestion, QuizData } from "@shared/api";
import fs from 'fs';
import path from 'path';

let quizData: QuizData | null = null;

function loadQuizData(): QuizData | null {
  if (!quizData) {
    try {
      const quizDataPath = path.join(process.cwd(), 'data/quiz-data.json');
      const data = fs.readFileSync(quizDataPath, 'utf-8');
      quizData = JSON.parse(data);
    } catch (error) {
      console.error('Error loading quiz data:', error);
      return null;
    }
  }
  return quizData;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const getQuizQuestions: RequestHandler = async (req, res) => {
  try {
    const data = loadQuizData();
    
    if (!data) {
      const response: GetQuizQuestionsResponse = {
        success: false,
        message: 'Không thể tải dữ liệu câu hỏi'
      };
      return res.status(500).json(response);
    }
    
    const { count = 10, category, difficulty, random = true } = req.query as {
      count?: string;
      category?: string;
      difficulty?: string;
      random?: string;
    };
    
    let questions = [...data.questions];
    
    // Filter by category if specified
    if (category && category !== 'all') {
      questions = questions.filter(q => q.category === category);
    }
    
    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    // Shuffle questions if random is requested
    if (random === 'true' || random === true) {
      questions = shuffleArray(questions);
    }
    
    // Limit number of questions
    const requestedCount = parseInt(count as string, 10);
    if (requestedCount > 0) {
      questions = questions.slice(0, requestedCount);
    }
    
    const response: GetQuizQuestionsResponse = {
      success: true,
      data: questions
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    
    const response: GetQuizQuestionsResponse = {
      success: false,
      message: 'Có lỗi xảy ra khi lấy câu hỏi'
    };
    
    res.status(500).json(response);
  }
};

export const getQuizStats: RequestHandler = async (req, res) => {
  try {
    const data = loadQuizData();
    
    if (!data) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tải dữ liệu câu hỏi'
      });
    }
    
    // Calculate statistics
    const stats = {
      totalQuestions: data.totalQuestions,
      categories: [...new Set(data.questions.map(q => q.category))],
      difficulties: [...new Set(data.questions.map(q => q.difficulty))],
      questionsByCategory: data.questions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      questionsByDifficulty: data.questions.reduce((acc, q) => {
        const difficulty = q.difficulty || 'medium';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thống kê'
    });
  }
};