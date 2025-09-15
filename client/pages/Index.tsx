import { useMemo, useState } from "react";
import MapView, { MapPoint } from "@/components/MapView";
import FullscreenContent from "@/components/FullscreenContent";
import CategorySwitcher, { Category } from "@/components/CategorySwitcher";
import ChatbotPanel from "@/components/ChatbotPanel";
import QuizPanel from "@/components/QuizPanel";

export default function Index() {
  const [active, setActive] = useState<MapPoint | null>(null);
  const [category, setCategory] = useState<Category>("map");

  const points = useMemo<MapPoint[]>(
    () => [
      {
        id: "hn",
        name: "Hà Nội, Việt Nam",
        latitude: 21.028511,
        longitude: 105.804817,
        summary:
          "Thủ đô hơn nghìn năm lịch sử với văn hóa, ẩm thực và nhịp sống độc đáo.",
        sections: [
          {
            id: "hn-1",
            title: "Hồ Hoàn Kiếm",
            body:
              "Trái tim của Hà Nội, nơi gắn liền với truyền thuyết Rùa Vàng và là không gian xanh giữa lòng phố cổ.",
            imageUrl:
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1600&auto=format&fit=crop",
          },
          {
            id: "hn-2",
            title: "Phố Cổ",
            body:
              "Những con phố nhỏ, nhà ống san sát với nhịp sống vừa cổ kính vừa hiện đại.",
            imageUrl:
              "https://images.unsplash.com/photo-1563098110-0b23faeb9cfe?q=80&w=1600&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "tokyo",
        name: "Tokyo, Nhật Bản",
        latitude: 35.652832,
        longitude: 139.839478,
        summary:
          "Siêu đô thị kết hợp truyền thống và công nghệ tiên tiến cùng văn hóa pop đa sắc màu.",
        sections: [
          {
            id: "tk-1",
            title: "Shibuya Crossing",
            body:
              "Giao lộ đông đúc nổi tiếng thế giới - biểu tượng của nhịp sống hiện đại.",
            imageUrl:
              "https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?q=80&w=1600&auto=format&fit=crop",
          },
          {
            id: "tk-2",
            title: "Đền Asakusa",
            body:
              "Không gian linh thiêng giữa lòng thành phố, lưu giữ dấu ấn lịch sử.",
            imageUrl:
              "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?q=80&w=1600&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "paris",
        name: "Paris, Pháp",
        latitude: 48.864716,
        longitude: 2.349014,
        summary:
          "Kinh đô ánh sáng với nghệ thuật, thời trang và ẩm thực tinh tế.",
        sections: [
          {
            id: "pa-1",
            title: "Tháp Eiffel",
            body:
              "Biểu tượng bất hủ của Paris, điểm đến mơ ước của hàng triệu du khách.",
            imageUrl:
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
          },
          {
            id: "pa-2",
            title: "Bảo tàng Louvre",
            body:
              "Kho tàng nghệ thuật nổi tiếng bậc nhất thế giới với kiệt tác Mona Lisa.",
            imageUrl:
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop#louvre",
          },
        ],
      },
      // Vietnamese islands: Hoàng Sa (Paracel), Trường Sa (Spratly), Phú Quốc
      {
        id: "hoangsa",
        name: "Quần đảo Hoàng Sa",
        latitude: 16.5,
        longitude: 112.0,
        summary: "Quần đảo Hoàng Sa (Paracel Islands).",
        sections: [
          {
            id: "hs-1",
            title: "Hoàng Sa",
            body: "Quần đảo trên biển Đông thuộc vùng biển Việt Nam.",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "truongsa",
        name: "Quần đảo Trường Sa",
        latitude: 8.5,
        longitude: 115.5,
        summary: "Quần đảo Trường Sa (Spratly Islands).",
        sections: [
          {
            id: "ts-1",
            title: "Trường Sa",
            body: "Chuỗi đảo san hô nằm ở vùng biển phía nam Việt Nam.",
            imageUrl: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "phuquoc",
        name: "Phú Quốc",
        latitude: 10.291,
        longitude: 103.984,
        summary: "Đảo Phú Quốc, điểm du lịch nổi tiếng của Việt Nam.",
        sections: [
          {
            id: "pq-1",
            title: "Phú Quốc",
            body: "Đảo lớn nhất Việt Nam với bãi biển, rừng và ẩm thực đặc sắc.",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
          },
        ],
      },
    ],
    [],
  );

  return (
    <div className="relative min-h-screen">
      {/* Category switcher */}
      <div className="fixed left-1/2 top-4 z-[200000] -translate-x-1/2">
        <CategorySwitcher value={category} onChange={(v) => { setCategory(v); if (v !== "map") setActive(null); }} />
      </div>

      {category === "map" && <MapView points={points} onSelect={(p) => setActive(p)} />}
      {category === "chatbot" && <ChatbotPanel />}
      {category === "quiz" && <QuizPanel />}

      {active && category === "map" ? (
        <FullscreenContent point={active} onExit={() => setActive(null)} />
      ) : null}
    </div>
  );
}
