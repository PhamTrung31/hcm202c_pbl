import { MongoClient, Db, Collection } from 'mongodb';
import { QuizResult } from '@shared/api';

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      if (this.client) {
        return; // Already connected
      }

      const connectionString = process.env.MONGODB_CONNECTION_STRING;
      if (!connectionString) {
        throw new Error('MONGODB_CONNECTION_STRING không được tìm thấy trong biến môi trường');
      }

      this.client = new MongoClient(connectionString);
      await this.client.connect();
      this.db = this.client.db('hcm202_quiz_db'); // Tên database
      
    } catch (error) {
      console.error('❌ Lỗi kết nối MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('🔌 Đã ngắt kết nối MongoDB');
    }
  }

  getCollection<T = any>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database chưa được kết nối');
    }
    return this.db.collection<T>(name);
  }

  get isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }
}

// Singleton instance
export const mongoService = new MongoDBService();

// Collection helpers
export const getQuizResultsCollection = (): Collection<QuizResult> => {
  return mongoService.getCollection<QuizResult>('quiz_results');
};