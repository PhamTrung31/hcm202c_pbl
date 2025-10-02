import { RequestHandler } from "express";
import {
  SaveQuizResultRequest,
  SaveQuizResultResponse,
  QuizResult,
  GetPlayerRankRequest,
  GetPlayerRankResponse,
  PlayerRank,
} from "@shared/api";
import { getQuizResultsCollection, mongoService } from "../database/mongodb.js";

// Helper function to calculate player rank
async function calculatePlayerRank(
  request: GetPlayerRankRequest,
): Promise<PlayerRank | null> {
  try {
    const collection = getQuizResultsCollection();

    // Lấy tất cả kết quả để tính hạng
    const allResults = await collection.find({}).toArray();

    if (allResults.length === 0) {
      return null;
    }

    // Tính điểm chuẩn hóa (score percentage + time bonus)
    const calculateNormalizedScore = (result: QuizResult) => {
      const scorePercentage = (result.score / result.totalQuestions) * 100;
      const timeBonus = Math.max(0, (300 - result.duration) / 300) * 10; // Bonus tối đa 10 điểm cho thời gian nhanh
      return scorePercentage + timeBonus;
    };

    const currentScore = calculateNormalizedScore({
      name: request.name,
      score: request.score,
      totalQuestions: request.totalQuestions,
      duration: request.duration,
      completedAt: new Date(),
    });

    // Sắp xếp theo điểm chuẩn hóa
    const sortedResults = allResults
      .map((result) => ({
        ...result,
        normalizedScore: calculateNormalizedScore(result),
      }))
      .sort((a, b) => {
        // Sắp xếp theo điểm cao nhất trước, thời gian nhanh nhất trước nếu điểm bằng nhau
        if (b.normalizedScore !== a.normalizedScore) {
          return b.normalizedScore - a.normalizedScore;
        }
        return a.duration - b.duration;
      });

    // Tìm vị trí của điểm hiện tại
    const betterCount = sortedResults.filter(
      (result) => result.normalizedScore > currentScore,
    ).length;

    const currentRank = betterCount + 1;
    const totalPlayers = allResults.length + 1; // +1 cho kết quả hiện tại
    const percentile = Math.round(
      ((totalPlayers - currentRank) / totalPlayers) * 100,
    );

    // Xác định hạng dựa trên percentile
    let rankCategory: PlayerRank["rankCategory"];
    if (percentile >= 90) rankCategory = "Xuất sắc";
    else if (percentile >= 75) rankCategory = "Giỏi";
    else if (percentile >= 50) rankCategory = "Khá";
    else if (percentile >= 25) rankCategory = "Trung bình";
    else rankCategory = "Yếu";

    // Kiểm tra xem có phải điểm cao nhất cá nhân không
    const playerResults = allResults.filter(
      (result) => result.name.toLowerCase() === request.name.toLowerCase(),
    );

    const personalBestScore =
      playerResults.length > 0
        ? Math.max(...playerResults.map(calculateNormalizedScore))
        : 0;

    const isPersonalBest = currentScore > personalBestScore;

    return {
      currentRank,
      totalPlayers,
      percentile,
      rankCategory,
      isPersonalBest,
    };
  } catch (error) {
    console.error("Lỗi khi tính hạng:", error);
    return null;
  }
}

export const saveQuizResult: RequestHandler = async (req, res) => {
  try {
    // Đảm bảo database đã kết nối
    if (!mongoService.isConnected) {
      await mongoService.connect();
    }

    const { name, score, totalQuestions, duration }: SaveQuizResultRequest =
      req.body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const response: SaveQuizResultResponse = {
        success: false,
        message: "Tên không được để trống",
      };
      return res.status(400).json(response);
    }

    if (
      typeof score !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof duration !== "number"
    ) {
      const response: SaveQuizResultResponse = {
        success: false,
        message: "Dữ liệu không hợp lệ",
      };
      return res.status(400).json(response);
    }

    // Tạo quiz result object
    const quizResult: Omit<QuizResult, "_id"> = {
      name: name.trim(),
      score,
      totalQuestions,
      duration,
      completedAt: new Date(),
    };

    // Lưu vào database
    const collection = getQuizResultsCollection();
    const insertResult = await collection.insertOne(quizResult);

    // Lấy document vừa tạo để trả về
    const savedResult = await collection.findOne({
      _id: insertResult.insertedId,
    });

    // Tính hạng của người chơi
    const rank = await calculatePlayerRank({
      name: name.trim(),
      score,
      totalQuestions,
      duration,
    });

    const response: SaveQuizResultResponse = {
      success: true,
      message: "Kết quả quiz đã được lưu thành công",
      result: savedResult || undefined,
      rank: rank || undefined,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Lỗi khi lưu kết quả quiz:", error);

    const response: SaveQuizResultResponse = {
      success: false,
      message: "Có lỗi xảy ra khi lưu kết quả quiz",
    };

    res.status(500).json(response);
  }
};

export const getQuizResults: RequestHandler = async (req, res) => {
  try {
    if (!mongoService.isConnected) {
      await mongoService.connect();
    }

    const collection = getQuizResultsCollection();

    // Lấy 10 kết quả cao nhất, sắp xếp theo:
    // 1. Số câu trả lời đúng (score) - giảm dần
    // 2. Thời gian hoàn thành (duration) - tăng dần (nhanh nhất lên đầu)
    const results = await collection
      .find({})
      .sort({
        score: -1,
        duration: 1,
      })
      .limit(10)
      .toArray();

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Lỗi khi lấy kết quả quiz:", error);

    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy kết quả quiz",
    });
  }
};

export const getPlayerRank: RequestHandler = async (req, res) => {
  try {
    if (!mongoService.isConnected) {
      await mongoService.connect();
    }

    const { name, score, totalQuestions, duration } =
      req.body as GetPlayerRankRequest;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const response: GetPlayerRankResponse = {
        success: false,
        message: "Tên không được để trống",
      };
      return res.status(400).json(response);
    }

    if (
      typeof score !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof duration !== "number"
    ) {
      const response: GetPlayerRankResponse = {
        success: false,
        message: "Dữ liệu không hợp lệ",
      };
      return res.status(400).json(response);
    }

    const rank = await calculatePlayerRank({
      name,
      score,
      totalQuestions,
      duration,
    });

    if (!rank) {
      const response: GetPlayerRankResponse = {
        success: false,
        message: "Không thể tính hạng",
      };
      return res.status(500).json(response);
    }

    const response: GetPlayerRankResponse = {
      success: true,
      data: rank,
    };

    res.json(response);
  } catch (error) {
    console.error("Lỗi khi lấy hạng người chơi:", error);

    const response: GetPlayerRankResponse = {
      success: false,
      message: "Có lỗi xảy ra khi lấy hạng người chơi",
    };

    res.status(500).json(response);
  }
};
