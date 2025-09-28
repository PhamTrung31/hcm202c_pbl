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

/**
 * History summary types
 */
export interface HistoryKeyPeriod {
  period: string;
  description: string;
  significance: string;
}

export interface HistoryImportantEvent {
  date: string;
  event: string;
  location: string;
  importance: string;
}

export interface HistoryKeyQuote {
  quote: string;
  context: string;
  period: string;
}

export interface HistoryCountry {
  country: string;
  period: string;
  activities: string;
  significance: string;
}

export interface HistoryTimelineItem {
  year: string;
  event: string;
  significance: string;
}

export interface HistorySummaryData {
  overview: string;
  keyPeriods: HistoryKeyPeriod[];
  importantEvents: HistoryImportantEvent[];
  keyQuotes: HistoryKeyQuote[];
  countries: HistoryCountry[];
  timeline: HistoryTimelineItem[];
}

export interface HistorySummaryResponse {
  success: boolean;
  data?: HistorySummaryData;
  message?: string;
}

/**
 * Chatbot types
 */
export interface ChatbotMessageRequest {
  message: string;
}

export interface ChatbotMessageResponse {
  success: boolean;
  response: string;
  message?: string;
}
