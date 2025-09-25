# Quiz App với MongoDB

Ứng dụng Quiz được tích hợp với MongoDB để lưu trữ kết quả người chơi.

## Tính năng

✅ **Nhập tên người chơi** - Người chơi phải nhập tên trước khi bắt đầu quiz
✅ **Tính thời gian** - Tự động tính thời gian làm bài từ khi bắt đầu đến khi hoàn thành
✅ **Lưu kết quả vào MongoDB** - Tự động lưu kết quả sau khi hoàn thành quiz
✅ **Bảng xếp hạng** - Hiển thị top 10 kết quả gần nhất
✅ **Giao diện đẹp** - UI/UX hiện đại với TailwindCSS

## Cấu trúc Database

### Collection: `quiz_results`

```javascript
{
  _id: ObjectId,
  name: String,           // Tên người chơi
  score: Number,          // Số câu trả lời đúng
  totalQuestions: Number, // Tổng số câu hỏi
  duration: Number,       // Thời gian làm bài (giây)
  completedAt: Date       // Thời gian hoàn thành
}
```

## API Endpoints

### POST /api/quiz/save-result
Lưu kết quả quiz của người chơi

**Body:**
```json
{
  "name": "Tên người chơi",
  "score": 2,
  "totalQuestions": 3,
  "duration": 45
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kết quả quiz đã được lưu thành công",
  "result": {
    "_id": "...",
    "name": "Tên người chơi",
    "score": 2,
    "totalQuestions": 3,
    "duration": 45,
    "completedAt": "2025-09-25T..."
  }
}
```

### GET /api/quiz/results
Lấy danh sách 10 kết quả gần nhất

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Tên người chơi",
      "score": 2,
      "totalQuestions": 3,
      "duration": 45,
      "completedAt": "2025-09-25T..."
    }
  ]
}
```

## Cài đặt và Chạy

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Cấu hình MongoDB:**
Đảm bảo file `.env` có connection string:
```env
MONGODB_CONNECTION_STRING="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
```

3. **Chạy ứng dụng:**
```bash
npm run dev
```

4. **Truy cập:** http://localhost:8080

## Cách sử dụng

1. **Nhập tên:** Nhập tên của bạn vào ô input
2. **Bắt đầu Quiz:** Click "Bắt đầu Quiz" để bắt đầu
3. **Trả lời câu hỏi:** Click vào đáp án bạn cho là đúng
4. **Xem kết quả:** Sau khi hoàn thành, kết quả sẽ được hiển thị và tự động lưu
5. **Xem bảng xếp hạng:** Click "🏆 Bảng xếp hạng" để xem top players

## Thư viện đã sử dụng

- **MongoDB Driver:** `mongodb` - Kết nối và thao tác với MongoDB
- **Types:** `@types/mongodb` - TypeScript types cho MongoDB
- **Environment:** `dotenv` - Đọc biến môi trường từ file .env
- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Express.js, Node.js

## Database Schema

Database sẽ tự động tạo collection `quiz_results` khi có dữ liệu đầu tiên được lưu.

### Indexes (tùy chọn)

Để tối ưu hiệu suất, bạn có thể tạo index:

```javascript
// Index cho việc sắp xếp theo thời gian
db.quiz_results.createIndex({ "completedAt": -1 })

// Index cho tìm kiếm theo tên
db.quiz_results.createIndex({ "name": 1 })
```

## Lưu ý

- Ứng dụng tự động kết nối MongoDB khi khởi động server
- Kết quả được lưu tự động sau khi hoàn thành quiz
- Bảng xếp hạng hiển thị 10 kết quả gần nhất (có thể thay đổi trong code)
- Thời gian được tính bằng giây và hiển thị dạng MM:SS