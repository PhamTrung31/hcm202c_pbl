import { useMemo, useState } from "react";
import { JourneyLeg, MapPoint, MapView } from "@/components/MapView";
import FullscreenContent from "@/components/FullscreenContent";
import CategorySwitcher, { Category } from "@/components/CategorySwitcher";
import ChatbotPanel from "@/components/ChatbotPanel";
import QuizPanel from "@/components/QuizPanel";
import { id } from "date-fns/locale";

export default function Index() {
  const [active, setActive] = useState<MapPoint | null>(null);
  const [category, setCategory] = useState<Category>("map");

  // tất cả điểm
  const points = useMemo<MapPoint[]>(
    () => [
      {
        id: "VietNam-1",
        name: "Bến Nhà Rồng",
        latitude: 10.7684,
        longitude: 106.7068,
        sections: [
          {
            id: "VietNam-1",
            imageUrl: "https://i.postimg.cc/g2t7CC81/5-6-1911-SG-Phap.png",
          },
        ],
        summary: "",
      },
      {
        id: "Singapore",
        name: "Cảng Keppel",
        latitude: 1.2706,
        longitude: 103.8302,
        sections: [],
        summary: "",
      },
      {
        id: "Sri-Lanka",
        name: "Cảng Ceylon (nay là Colombo)",
        latitude: 6.9406,
        longitude: 79.8463,
        sections: [],
        summary: "",
      },
      {
        id: "Yemen",
        name: "Cảng Aden - Yemen",
        latitude: 12.7922,
        longitude: 44.9855,
        sections: [],
        summary: "",
      },
      {
        id: "Egypt",
        name: "Cảng Port Said",
        latitude: 31.27,
        longitude: 32.2994,
        sections: [],
        summary: "",
      },
      {
        id: "France-1",
        name: "Cảng Marseille",
        latitude: 43.2962,
        longitude: 5.3633,
        sections: [],
        summary: "",
      },
      {
        id: "Portugal",
        name: "Cảng Lisbon",
        latitude: 38.9534,
        longitude: -9.1566,
        sections: [],
        summary: "",
      },
      {
        id: "France-2",
        name: "Cảng Le Havre",
        latitude: 49.4852,
        longitude: 0.1167,
        sections: [],
        summary: "",
      },
      {
        id: "USA-1",
        name: "Harlem, New York",
        latitude: 40.8123,
        longitude: -73.9451,
        sections: [
          {
            id: "Harlem-1",
            imageUrl: "https://i.postimg.cc/8CDFVYGT/1912-Harlem.png",
          },
          {
            id: "Harlem-2",
            imageUrl: "https://i.postimg.cc/zfXggQQz/Harlem-2.png",
          },
        ],
        summary: "",
      },
      {
        id: "USA-2",
        name: "Khách sạn Parker House - Boston",
        latitude: 42.3578,
        longitude: -71.0601,
        sections: [
          {
            id: "Boston-1",
            imageUrl: "https://i.postimg.cc/hG5f7txr/Boston.png",
          },
          {
            id: "Boston-2",
            imageUrl: "https://i.postimg.cc/Wz6NSNDH/Boston2.png",
          },
        ],
        summary: "",
      },
      {
        id: "UK",
        name: "London, Vương quốc Anh",
        latitude: 51.5092,
        longitude: -0.1215,
        sections: [
          {
            id: "Anh-1",
            imageUrl: "https://i.postimg.cc/SRqqnBZV/Anh.png",
          },
          {
            id: "Anh-2",
            imageUrl: "https://i.postimg.cc/SQrbZt1m/Anh-2.png",
          },
        ],
        summary: "",
      },
      {
        id: "France-3",
        name: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        sections: [
          {
            id: "Paris-1",
            imageUrl: "https://i.postimg.cc/C5ZCf2zZ/1917-Phap.png",
          },
          {
            id: "Paris-2",
            imageUrl: "https://i.postimg.cc/zvWjcM5w/1920-Phap.png",
          },
          {
            id: "Paris-3",
            imageUrl:
              "https://i.postimg.cc/MT1f28Mr/1923-nh-n-gi-y-m-i-t-i-Li-n-X.png",
          },
        ],
        summary: "",
      },
      {
        id: "Russia-1",
        name: "Moscow - Nga",
        latitude: 55.7642,
        longitude: 37.5279,
        sections: [],
        summary: "",
        small: true,
      },
      {
        id: "China-1",
        name: "Quảng Châu - Trung Quốc",
        latitude: 23.1479,
        longitude: 113.2827,
        sections: [],
        summary: "",
        small: true,
      },
      {
        id: "Russia-2",
        name: "Nga",
        latitude: 55.5701,
        longitude: 40.6291,
        sections: [],
        summary: "",
        small: true,
      },
      {
        id: "Belgium",
        name: "Brussels - Bỉ",
        latitude: 50.8479,
        longitude: 4.3585,
        sections: [],
        summary: "",
      },
      {
        id: "ThaiLand",
        name: "Bangkok - Thái Lan",
        latitude: 13.7778,
        longitude: 100.5216,
        sections: [],
        summary: "",
      },
      {
        id: "China-2",
        name: "Cửu Long - Hồng Kông",
        latitude: 22.2939,
        longitude: 114.1713,
        sections: [],
        summary: "",
        small: true,
      },
      {
        id: "Russia-3",
        name: "Nga",
        latitude: 54.8438,
        longitude: 37.3182,
        sections: [],
        summary: "",
        small: true,
      },
      {
        id: "China-3",
        name: "Quế Lâm - Trung Quốc",
        latitude: 25.2796,
        longitude: 110.2917,
        sections: [],
        summary: "",
      },
      {
        id: "VietNam-2",
        name: "Việt Nam",
        latitude: 22.9794,
        longitude: 106.0533,
        sections: [],
        summary: "",
      },
    ],
    [],
  );

  //lộ trình
  const journeyPath: JourneyLeg[] = [
    { startId: "VietNam-1", endId: "Singapore" },
    {
      startId: "Singapore",
      endId: "Sri-Lanka",
      controlPoints: [
        [18.016273184785604, 84.62810371038708],
        [-1.2558155660377337, 87.54906224094749],
      ],
    },
    { startId: "Sri-Lanka", endId: "Yemen" },
    { startId: "Yemen", endId: "Egypt" },
    {
      startId: "Egypt",
      endId: "France-1",
      controlPoints: [
        [34.19245725303832, 24.08876306363684],
        [35.85371298059674, 6.23007487798341],
      ],
    },
    {
      startId: "France-1",
      endId: "Portugal",
      controlPoints: [[30.951424734820534, -2.2447128287603095]],
    },
    {
      startId: "Portugal",
      endId: "France-2",
      controlPoints: [[45.536364381584725, -11.180643275051395]],
    },
    { startId: "France-2", endId: "USA-1", lineType: "straight" },
    { startId: "USA-1", endId: "USA-2" },
    { startId: "USA-2", endId: "UK", lineType: "straight" },
    {
      startId: "UK",
      endId: "France-3",
      controlPoints: [[50.60008549433055, 3.3958192245815546]],
    },
    { startId: "France-3", endId: "Russia-1" },
    { startId: "Russia-1", endId: "China-1", controlPoints: [[40, 110]] },
    { startId: "China-1", endId: "Russia-2", controlPoints: [[45, 125]] },
    { startId: "Russia-2", endId: "Belgium", controlPoints: [[60, 20]] },
    { startId: "Belgium", endId: "ThaiLand" },
    { startId: "ThaiLand", endId: "China-2" },
    { startId: "China-2", endId: "Russia-3", controlPoints: [[40, 45]] },
    { startId: "Russia-3", endId: "China-3" },
    { startId: "China-3", endId: "VietNam-2" },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed left-1/2 top-4 z-[200000] -translate-x-1/2">
        <CategorySwitcher
          value={category}
          onChange={(v) => {
            setCategory(v);
            if (v !== "map") setActive(null);
          }}
        />
      </div>

      {category === "map" && (
        <MapView
          points={points}
          journeyPath={journeyPath}
          onSelect={(p) => setActive(p)}
        />
      )}

      {category === "chatbot" && <ChatbotPanel />}
      {category === "quiz" && <QuizPanel />}

      {active && category === "map" ? (
        <FullscreenContent point={active} onExit={() => setActive(null)} />
      ) : null}
    </div>
  );
}
