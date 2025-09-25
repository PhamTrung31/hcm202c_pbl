/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Quiz result types
 */
export interface QuizResult {
  _id?: string;
  name: string;
  score: number;
  totalQuestions: number;
  duration: number; // thời gian làm bài tính bằng giây
  completedAt: Date;
}

export interface SaveQuizResultRequest {
  name: string;
  score: number;
  totalQuestions: number;
  duration: number;
}

export interface SaveQuizResultResponse {
  success: boolean;
  message: string;
  result?: QuizResult;
}
