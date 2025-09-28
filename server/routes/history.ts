import { RequestHandler } from "express";
import { readFileSync } from "fs";
import { join } from "path";
import { HistorySummaryResponse } from "@shared/api";

export const getHistorySummary: RequestHandler = async (req, res) => {
  try {
    // Đọc nội dung knowledge base
    const knowledgeBasePath = join(process.cwd(), 'data', 'knowledge-base.md');
    const knowledgeBase = readFileSync(knowledgeBasePath, 'utf-8');

    // Tạo tóm tắt dựa trên nội dung knowledge base
    const response: HistorySummaryResponse = {
      success: true,
      data: {
        overview: "Cuộc đời và sự nghiệp cách mạng của Chủ tịch Hồ Chí Minh là một hành trình phi thường của một nhà cách mạng vĩ đại. Từ năm 1911, với ước mơ tìm đường cứu nước, Người đã bôn ba khắp năm châu suốt 30 năm để học hỏi, trưởng thành và tìm ra con đường giải phóng dân tộc. Hành trình này đã rèn luyện Người trở thành một lãnh tụ kiệt xuất, người đã dẫn dắt dân tộc Việt Nam giành được độc lập vào năm 1945.",

        keyPeriods: [
          {
            period: "1911-1923: Hành trình tìm đường cứu nước",
            description: "Thời kỳ Người rời Việt Nam, đi qua nhiều nước để quan sát, học hỏi và tìm hiểu về chủ nghĩa thực dân",
            significance: "Giai đoạn hình thành tư tưởng cách mạng và nhận thức về bản chất của chủ nghĩa đế quốc"
          },
          {
            period: "1923-1930: Tiếp cận chủ nghĩa Mác-Lênin",
            description: "Học tập tại Liên Xô, tham gia hoạt động Quốc tế Cộng sản, chuẩn bị thành lập Đảng",
            significance: "Xác định con đường cách mạng vô sản cho Việt Nam và chuẩn bị lực lượng"
          },
          {
            period: "1930-1941: Thành lập Đảng và chuẩn bị về nước",
            description: "Thành lập Đảng Cộng sản Việt Nam, trải qua gian khổ trong tù, tiếp tục hoạt động cách mạng",
            significance: "Tạo ra tổ chức lãnh đạo cho cách mạng Việt Nam và chuẩn bị điều kiện về nước"
          },
          {
            period: "1941-1945: Trở về và lãnh đạo cách mạng",
            description: "Trở về Pác Bó, thành lập Việt Minh, lãnh đạo Tổng khởi nghĩa",
            significance: "Trực tiếp lãnh đạo dân tộc giành độc lập và thành lập nước Việt Nam Dân chủ Cộng hòa"
          }
        ],

        importantEvents: [
          {
            date: "5/6/1911",
            event: "Rời bến cảng Nhà Rồng trên tàu Amiral Latouche-Tréville",
            location: "Sài Gòn, Việt Nam",
            importance: "Mốc khởi đầu cuộc hành trình 30 năm tìm đường cứu nước"
          },
          {
            date: "1919",
            event: "Gửi Bản yêu sách 8 điểm đến Hội nghị Versailles",
            location: "Paris, Pháp",
            importance: "Lần đầu tiên tiếng nói của dân tộc Việt Nam vang lên trên trường quốc tế"
          },
          {
            date: "Tháng 12/1920",
            event: "Tham gia thành lập Đảng Cộng sản Pháp",
            location: "Paris, Pháp",
            importance: "Chuyển từ một người yêu nước thành một người cộng sản"
          },
          {
            date: "3/2/1930",
            event: "Thành lập Đảng Cộng sản Việt Nam",
            location: "Hương Cảng (Hồng Kông)",
            importance: "Tạo ra tổ chức lãnh đạo thống nhất cho cách mạng Việt Nam"
          },
          {
            date: "28/1/1941",
            event: "Trở về Pác Bó sau 30 năm bôn ba",
            location: "Cao Bằng, Việt Nam",
            importance: "Kết thúc hành trình tìm đường cứu nước, bắt đầu trực tiếp lãnh đạo cách mạng"
          },
          {
            date: "2/9/1945",
            event: "Đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình",
            location: "Hà Nội, Việt Nam",
            importance: "Khai sinh nước Việt Nam Dân chủ Cộng hòa"
          }
        ],

        keyQuotes: [
          {
            quote: "Tôi muốn ra nước ngoài, xem xét những nước đã áp bức dân ta. Sau khi xem xét họ làm ăn thế nào, tôi sẽ trở về giúp đồng bào.",
            context: "Chia sẻ với bạn đồng hành trước khi rời Việt Nam",
            period: "1911"
          },
          {
            quote: "Muốn cứu nước và giải phóng dân tộc, không có con đường nào khác con đường cách mạng vô sản",
            context: "Sau khi gia nhập Đảng Cộng sản Pháp",
            period: "1920"
          },
          {
            quote: "Hỡi những người bị áp bức! Hãy hợp sức lại, chúng ta không có gì để mất ngoài xiềng xích!",
            context: "Trong các bài viết trên báo Le Paria",
            period: "1922-1923"
          },
          {
            quote: "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao",
            context: "Trong Hội nghị thành lập Đảng Cộng sản Việt Nam",
            period: "1930"
          },
          {
            quote: "Uống nước suối Lênin, ăn cá suối, rau rừng, bàn việc lớn",
            context: "Tại Pác Bó khi trở về Việt Nam",
            period: "1941"
          }
        ],

        countries: [
          {
            country: "Pháp",
            period: "1911-1919, 1917-1923",
            activities: "Làm thuê, viết báo, tham gia phong trào công nhân, gửi yêu sách đến Hội nghị Versailles",
            significance: "Hình thành tư tưởng cách mạng, tìm hiểu bản chất thực dân"
          },
          {
            country: "Anh",
            period: "1913-1917",
            activities: "Làm phụ bếp, tự học tiếng Anh, nghiên cứu tại thư viện",
            significance: "Quan sát xã hội tư bản, hiểu mâu thuẫn giai cấp"
          },
          {
            country: "Mỹ",
            period: "1912-1913",
            activities: "Lao động tại New York và Boston, quan sát phân biệt chủng tộc",
            significance: "Nhận thức về dân chủ tư sản và bất bình đẳng xã hội"
          },
          {
            country: "Liên Xô",
            period: "1923-1924, 1933-1938",
            activities: "Học tập lý luận, tham gia Quốc tế Cộng sản",
            significance: "Tiếp thu chủ nghĩa Mác-Lênin, xác định đường lối cách mạng"
          },
          {
            country: "Trung Quốc",
            period: "1924-1927, 1938-1943",
            activities: "Thành lập Hội Việt Nam Cách mạng Thanh niên, đào tạo cán bộ",
            significance: "Chuẩn bị lực lượng và cán bộ cho cách mạng Việt Nam"
          },
          {
            country: "Thái Lan",
            period: "1928-1929",
            activities: "Tổ chức vận động Việt kiều, xây dựng đoàn kết Việt-Lào-Thái",
            significance: "Mở rộng phong trào cách mạng ra cộng đồng Việt kiều"
          }
        ],

        timeline: [
          { year: "1911", event: "Rời Việt Nam tìm đường cứu nước", significance: "Khởi đầu hành trình cách mạng" },
          { year: "1919", event: "Gửi Bản yêu sách 8 điểm", significance: "Tiếng nói đầu tiên của dân tộc Việt Nam trên trường quốc tế" },
          { year: "1920", event: "Gia nhập Đảng Cộng sản Pháp", significance: "Chuyển từ yêu nước sang cộng sản" },
          { year: "1925", event: "Thành lập Hội Việt Nam Cách mạng Thanh niên", significance: "Chuẩn bị lực lượng cho Đảng" },
          { year: "1930", event: "Thành lập Đảng Cộng sản Việt Nam", significance: "Tạo ra tổ chức lãnh đạo thống nhất" },
          { year: "1941", event: "Trở về Pác Bó", significance: "Bắt đầu trực tiếp lãnh đạo cách mạng" },
          { year: "1941", event: "Thành lập Mặt trận Việt Minh", significance: "Tập hợp toàn dân kháng chiến" },
          { year: "1945", event: "Tổng khởi nghĩa và Tuyên ngôn Độc lập", significance: "Giành độc lập, thành lập nước VNDCCH" }
        ]
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Lỗi khi tạo tóm tắt lịch sử:', error);
    
    const response: HistorySummaryResponse = {
      success: false,
      message: 'Có lỗi xảy ra khi tạo tóm tắt lịch sử'
    };
    
    res.status(500).json(response);
  }
};