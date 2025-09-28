import { RequestHandler } from "express";
import { readFileSync } from "fs";
import { join } from "path";

export const getChatbotResponse: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        response: 'Tin nhắn không hợp lệ'
      });
    }

    // Đọc knowledge base
    const knowledgeBasePath = join(process.cwd(), 'data', 'knowledge-base.md');
    let knowledgeBase = '';
    
    try {
      knowledgeBase = readFileSync(knowledgeBasePath, 'utf-8');
    } catch (error) {
      console.error('Không thể đọc knowledge base:', error);
    }

    // Kiểm tra API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.log('Không có GEMINI_API_KEY, sử dụng fallback response');
      const fallbackResponse = generateFallbackResponse(message);
      return res.json({
        success: true,
        response: fallbackResponse + " (Powered by fallback system)"
      });
    }

    console.log('Attempting to use Gemini API...');
    
    const prompt = `
Bạn là trợ lý AI chuyên về lịch sử Việt Nam, đặc biệt là cuộc đời và sự nghiệp cách mạng của Chủ tịch Hồ Chí Minh. 

Dựa vào thông tin trong knowledge base sau để trả lời câu hỏi của người dùng:

${knowledgeBase.substring(0, 8000)} // Giới hạn độ dài để tránh lỗi

Hướng dẫn trả lời:
1. Trả lời chính xác, súc tích và dễ hiểu
2. Ưu tiên thông tin có trong knowledge base
3. Nếu không có thông tin cụ thể, hãy trả lời một cách lịch sự và gợi ý câu hỏi khác
4. Sử dụng giọng điệu thân thiện, như một người hướng dẫn viên
5. Trả lời bằng tiếng Việt
6. Độ dài khoảng 2-3 câu, không quá dài

Câu hỏi của người dùng: "${message}"

Trả lời:`;

    // Thử với các models Gemini 2.0 mới nhất trước
    let response;
    const modelsToTry = [
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash', 
    ];
    
    let lastError = '';
    let usedModel = '';
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying Gemini model: ${model}`);
        
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });

        if (response.ok) {
          usedModel = model;
          console.log(`Successfully using model: ${model}`);
          break;
        } else {
          const errorText = await response.text();
          lastError = `${model}: ${response.status} - ${errorText}`;
          console.log(`Model ${model} failed:`, lastError);
        }
      } catch (error) {
        lastError = `${model}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.log(`Model ${model} error:`, error);
      }
    }

    console.log(`Gemini API Response Status: ${response?.status}, Model used: ${usedModel}`);

    if (!response || !response.ok) {
      console.error('All Gemini models failed. Last error:', lastError);
      
      // Sử dụng fallback khi tất cả API đều lỗi
      const fallbackResponse = generateFallbackResponse(message);
      return res.json({
        success: true,
        response: fallbackResponse + " (API tạm thời không khả dụng, sử dụng hệ thống dự phòng)"
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi không thể tạo câu trả lời lúc này.';

    console.log(`Gemini API Success with model: ${usedModel}`);
    
    res.json({
      success: true,
      response: aiResponse.trim()
    });

  } catch (error) {
    console.error('Lỗi chatbot:', error);
    
    // Fallback với rules cũ nếu có lỗi
    const fallbackResponse = generateFallbackResponse(req.body.message);
    
    res.json({
      success: true,
      response: fallbackResponse + " (Hệ thống gặp lỗi, đang sử dụng chế độ dự phòng)"
    });
  }
};

// Hàm fallback với rules cập nhật từ knowledge base
function generateFallbackResponse(message: string): string {
  const RULES: { test: (s: string) => boolean; resp: string }[] = [
    { 
      test: (s) => /xin chào|chào|hello|hi/i.test(s), 
      resp: "Xin chào! Tôi là trợ lý AI chuyên về lịch sử Việt Nam và cuộc đời Chủ tịch Hồ Chí Minh. Bạn có thể hỏi tôi về hành trình cách mạng của Người nhé!" 
    },
    { 
      test: (s) => /hồ chí minh|bác hồ|chủ tịch hồ chí minh|nguyễn ái quốc|nguyễn tất thành/i.test(s), 
      resp: "Chủ tịch Hồ Chí Minh (1890-1969) là lãnh tụ vĩ đại của dân tộc Việt Nam. Người đã bôn ba 30 năm tìm đường cứu nước và lãnh đạo dân tộc giành độc lập." 
    },
    { 
      test: (s) => /1911|nhà rồng|ra đi|khởi đầu/i.test(s), 
      resp: "Ngày 5/6/1911, từ bến Nhà Rồng (Sài Gòn), chàng trai trẻ Nguyễn Tất Thành lên tàu Amiral Latouche-Tréville với mong muốn tìm đường cứu nước." 
    },
    { 
      test: (s) => /1930|đảng cộng sản|thành lập đảng/i.test(s), 
      resp: "Ngày 3/2/1930, tại Hương Cảng, Nguyễn Ái Quốc chủ trì hội nghị hợp nhất 3 tổ chức cộng sản, thành lập Đảng Cộng sản Việt Nam." 
    },
    { 
      test: (s) => /1941|pác bó|trở về/i.test(s), 
      resp: "28/1/1941, sau 30 năm bôn ba, Nguyễn Ái Quốc trở về Pác Bó (Cao Bằng) để trực tiếp lãnh đạo cách mạng Việt Nam." 
    },
    { 
      test: (s) => /1945|độc lập|ba đình|tuyên ngôn/i.test(s), 
      resp: "2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa." 
    },
    { 
      test: (s) => /pháp|paris|versailles|yêu sách/i.test(s), 
      resp: "Tại Pháp (1917-1923), Nguyễn Ái Quốc hoạt động chính trị sôi nổi, gửi 'Yêu sách 8 điểm' đến Hội nghị Versailles năm 1919, tiếng nói đầu tiên của dân tộc Việt Nam trên trường quốc tế." 
    },
    { 
      test: (s) => /liên xô|moscow|lênin|mác/i.test(s), 
      resp: "Tại Liên Xô (1923-1924, 1933-1938), Người học tập chủ nghĩa Mác-Lênin, tham gia hoạt động Quốc tế Cộng sản. Người từng nói: 'Thế là tôi không được gặp Lênin rồi, đây là nỗi đau lớn nhất trong đời tôi'." 
    },
    { 
      test: (s) => /trung quốc|quảng châu|thanh niên|hội thanh niên/i.test(s), 
      resp: "Tại Trung Quốc (1925-1927), Người thành lập Hội Việt Nam Cách mạng Thanh niên, đào tạo cán bộ cách mạng và xuất bản 'Đường Kách mệnh'." 
    },
    { 
      test: (s) => /thái lan|xiêm|1928|1929|việt kiều/i.test(s), 
      resp: "Tháng 7/1928, Nguyễn Ái Quốc đến Xiêm (Thái Lan) tổ chức vận động Việt kiều, lập làng cách mạng, mở lớp dạy chữ quốc ngữ, đào tạo cán bộ, xây dựng đoàn kết Việt-Lào-Thái, sống giản dị cùng nhân dân." 
    },
    { 
      test: (s) => /hồng kông|tống văn sơ|1931|1932|tù/i.test(s), 
      resp: "Từ 6/6/1931-22/1/1933, Nguyễn Ái Quốc bị bắt giam tại Hồng Kông dưới tên giả Tống Văn Sơ. Nhờ luật sư Francis Henry Loseby và Quốc tế Cộng sản can thiệp, Người được thả tự do." 
    },
    { 
      test: (s) => /anh|london|carlton|drayton|1913|1917/i.test(s), 
      resp: "Tại London (1913-1917), Người làm phụ bếp tại khách sạn Carlton và Drayton Court, tự học tiếng Anh và nghiên cứu tại thư viện công cộng để tìm hiểu về chủ nghĩa Mác-Lênin." 
    },
    { 
      test: (s) => /mỹ|america|boston|new york|harlem|1912|1913/i.test(s), 
      resp: "Tại Mỹ (1912-1913), Người làm việc ở Harlem (New York) và khách sạn Omni Parker House (Boston), chứng kiến phân biệt chủng tộc và nhận ra đấu tranh giải phóng dân tộc phải gắn với giải phóng con người." 
    },
    { 
      test: (s) => /việt minh|mặt trận|khuổi nậm/i.test(s), 
      resp: "Tháng 5/1941, tại Khuổi Nậm (Pác Bó), Hồ Chí Minh chủ trì Hội nghị Trung ương VIII, thành lập Mặt trận Việt Minh để tập hợp toàn dân kháng chiến." 
    },
    { 
      test: (s) => /nhật ký trong tù|thơ|lục bát|quảng tây|1942|1943/i.test(s), 
      resp: "Trong tù Quảng Tây (1942-1943), Người sáng tác 'Nhật ký trong tù' với những câu thơ bất hủ: 'Thân thể ở trong lao, Tinh thần ở ngoài lao. Muốn nên sự nghiệp lớn, Tinh thần càng phải cao.'" 
    },
    { 
      test: (s) => /câu nói|danh ngôn|lời dạy/i.test(s), 
      resp: "Một số câu nói nổi tiếng của Bác: 'Muốn cứu nước và giải phóng dân tộc, không có con đường nào khác con đường cách mạng vô sản', 'Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao'." 
    },
    { 
      test: (s) => /30 năm|hành trình|bôn ba|tìm đường/i.test(s), 
      resp: "Chủ tịch Hồ Chí Minh đã bôn ba 30 năm (1911-1941) qua nhiều nước: Pháp, Anh, Mỹ, Liên Xô, Trung Quốc, Thái Lan, Hồng Kông... để tìm đường cứu nước và học hỏi kinh nghiệm cách mạng." 
    }
  ];

  const rule = RULES.find((r) => r.test(message));
  return rule?.resp || "Tôi chưa có thông tin chi tiết về câu hỏi này. Bạn có thể hỏi về các giai đoạn trong cuộc đời Chủ tịch Hồ Chí Minh như: thời gian ở Pháp, Liên Xô, Trung Quốc, Thái Lan, việc thành lập Đảng, trở về Pác Bó, hay Tuyên ngôn Độc lập nhé!";
}