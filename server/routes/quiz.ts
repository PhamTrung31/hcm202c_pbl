import { RequestHandler } from "express";
import { SaveQuizResultRequest, SaveQuizResultResponse, QuizResult } from "@shared/api";
import { getQuizResultsCollection, mongoService } from "../database/mongodb";

export const saveQuizResult: RequestHandler = async (req, res) => {
  try {
    // Đảm bảo database đã kết nối
    if (!mongoService.isConnected) {
      await mongoService.connect();
    }

    const { name, score, totalQuestions, duration }: SaveQuizResultRequest = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const response: SaveQuizResultResponse = {
        success: false,
        message: 'Tên không được để trống'
      };
      return res.status(400).json(response);
    }

    if (typeof score !== 'number' || typeof totalQuestions !== 'number' || typeof duration !== 'number') {
      const response: SaveQuizResultResponse = {
        success: false,
        message: 'Dữ liệu không hợp lệ'
      };
      return res.status(400).json(response);
    }

    // Tạo quiz result object
    const quizResult: Omit<QuizResult, '_id'> = {
      name: name.trim(),
      score,
      totalQuestions,
      duration,
      completedAt: new Date()
    };

    // Lưu vào database
    const collection = getQuizResultsCollection();
    const insertResult = await collection.insertOne(quizResult);

    // Lấy document vừa tạo để trả về
    const savedResult = await collection.findOne({ _id: insertResult.insertedId });

    const response: SaveQuizResultResponse = {
      success: true,
      message: 'Kết quả quiz đã được lưu thành công',
      result: savedResult || undefined
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Lỗi khi lưu kết quả quiz:', error);
    
    const response: SaveQuizResultResponse = {
      success: false,
      message: 'Có lỗi xảy ra khi lưu kết quả quiz'
    };
    
    res.status(500).json(response);
  }
};

export const getQuizResults: RequestHandler = async (req, res) => {
  try {
    // Đảm bảo database đã kết nối
    if (!mongoService.isConnected) {
      await mongoService.connect();
    }

    const collection = getQuizResultsCollection();
    
    // Lấy 10 kết quả gần nhất, sắp xếp theo thời gian hoàn thành
    const results = await collection
      .find({})
      .sort({ completedAt: -1 })
      .limit(10)
      .toArray();

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Lỗi khi lấy kết quả quiz:', error);
    
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy kết quả quiz'
    });
  }
};