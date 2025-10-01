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
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/c%E1%BA%A3ng%20Nh%C3%A0%20R%E1%BB%93ng,%20S%C3%A0i%20G%C3%B2n,%20Vi%E1%BB%87t%20Nam%205.6.1911.png?updatedAt=1759337910832",
          },
        ],
        summary: "",
      },
      {
        id: "Singapore",
        name: "Cảng Keppel",
        latitude: 1.2706,
        longitude: 103.8302,
        sections: [
          {
            id: "Singapore-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/C%E1%BA%A3ng%20Keppel%20-%208.6.1911.png?updatedAt=1759337911189",
          },
        ],
        summary: "",
      },
      {
        id: "Sri-Lanka",
        name: "Cảng Ceylon (nay là Colombo)",
        latitude: 6.9406,
        longitude: 79.8463,
        sections: [
          {
            id: "Sri-Lanka-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/c%E1%BA%A3ng%20colombo.png?updatedAt=1759337911633",
          },
        ],
        summary: "",
      },
      {
        id: "Yemen",
        name: "Cảng Aden - Yemen",
        latitude: 12.7922,
        longitude: 44.9855,
        sections: [
          {
            id: "Yemen-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/c%E1%BA%A3ng%20aden.png?updatedAt=1759337910523",
          },
        ],
        summary: "",
      },
      {
        id: "Egypt",
        name: "Cảng Port Said",
        latitude: 31.27,
        longitude: 32.2994,
        sections: [
          {
            id: "Egypt-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/c%E1%BA%A3ng%20portsaid%20ai%20c%E1%BA%ADp.png?updatedAt=1759337911361",
          },
        ],
        summary: "",
      },
      {
        id: "France-1",
        name: "Cảng Marseille",
        latitude: 43.2962,
        longitude: 5.3633,
        sections: [
          {
            id: "France-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/c%E1%BA%A3ng%20marseille.png?updatedAt=1759337910763",
          },
        ],
        summary: "",
      },
      {
        id: "Portugal",
        name: "Cảng Lisbon",
        latitude: 38.9534,
        longitude: -9.1566,
        sections: [
          {
            id: "Portugal-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/c%E1%BA%A3ng%20lisbon.png?updatedAt=1759337911203",
          },
        ],
        summary: "",
      },
      {
        id: "France-2",
        name: "Cảng Le Havre",
        latitude: 49.4852,
        longitude: 0.1167,
        sections: [
          {
            id: "France-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/C%E1%BA%A3ng%20Le%20Havre.png?updatedAt=1759337910885",
          },
        ],
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
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Harlem%201912%20%E1%BA%A3nh%20s%E1%BB%91%201.png?updatedAt=1759337910823",
          },
          {
            id: "Harlem-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Harlem%201912%20%E1%BA%A3nh%20s%E1%BB%91%202.png?updatedAt=1759337910881",
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
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Boston%20tr%C6%B0%E1%BB%9Bc%201913%20%E1%BA%A3nh%20s%E1%BB%91%201.png?updatedAt=1759337910556",
          },
          {
            id: "Boston-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Boston%20tr%C6%B0%E1%BB%9Bc%201913%20%E1%BA%A3nh%20s%E1%BB%91%202.png?updatedAt=1759337910093",
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
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Anh%20%C4%91%E1%BA%A7u1913.png?updatedAt=1759337909996",
          },
          {
            id: "Anh-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Anh%201913.png?updatedAt=1759337911707",
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
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Ph%C3%A1p%201917.png?updatedAt=1759337911197",
          },
          {
            id: "Paris-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Phap%201920%20.png?updatedAt=1759337910297",
          },
        ],
        summary: "",
      },
      {
        id: "Russia-1",
        name: "Moscow - Nga",
        latitude: 55.7642,
        longitude: 37.5279,
        sections: [
          {
            id: "Russia-1-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Ph%C3%A1p%201923%20.png?updatedAt=1759337909849",
          },
          {
            id: "Russia-1-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/21.1.1924%20Lenin%20qua%20%C4%91%E1%BB%9Di%20%E1%BB%9F%20Li%C3%AAn%20X%C3%B4.png?updatedAt=1759337958478",
          },
          {
            id: "Russia-1-3",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Li%C3%AAn%20X%C3%B4%20sau%20h%C3%ACnh%2027.6.1923.png?updatedAt=1759337958586",
          },
        ],
        summary: "",
        small: true,
      },
      {
        id: "China-1",
        name: "Quảng Châu - Trung Quốc",
        latitude: 23.1479,
        longitude: 113.2827,
        sections: [
          {
            id: "China-1-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%2011.11.1924.png?updatedAt=1759338067450",
          },
          {
            id: "China-1-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/sau%20khi%20%C4%91%E1%BA%BFn%20Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c,%20tr%C6%B0%E1%BB%9Bc%20th%C3%A1ng%202.1925.png?updatedAt=1759338067909",
          },
          {
            id: "China-1-3",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%202.1925.png?updatedAt=1759338067903",
          },
          {
            id: "China-1-4",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%206.1925.png?updatedAt=1759338067653",
          },
          {
            id: "China-1-5",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%2021.6.1925.png?updatedAt=1759338067402",
          },
          {
            id: "China-1-6",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%201925-4.1927.png?updatedAt=1759338067754",
          },
          {
            id: "China-1-7",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%201925-1927.png?updatedAt=1759338067776",
          },
        ],
        summary: "",
        small: true,
      },
      {
        id: "Russia-2",
        name: "Nga",
        latitude: 55.5701,
        longitude: 40.6291,
        sections: [
          {
            id: "Russia-2-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Qu%E1%BA%A3ng%20Ch%C3%A2u,%20Trung%20Qu%E1%BB%91c%207.1927.png?updatedAt=1759337969821",
          },
        ],
        summary: "",
        small: true,
      },
      {
        id: "Belgium",
        name: "Brussels - Bỉ",
        latitude: 50.8479,
        longitude: 4.3585,
        sections: [
          {
            id: "Belgium-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/1927,%20%E1%BB%9F%20Brussels%20(B%E1%BB%89),.png?updatedAt=1759337946154",
          },
        ],
        summary: "",
      },
      {
        id: "ThaiLand",
        name: "Bangkok - Thái Lan",
        latitude: 13.7778,
        longitude: 100.5216,
        sections: [
          {
            id: "ThaiLand-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/xi%C3%AAm%201928%20%E1%BA%A3nh%201.png?updatedAt=1759338029305",
          },
          {
            id: "ThaiLand-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%202.png?updatedAt=1759338028748",
          },
          {
            id: "ThaiLand-3",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%203.png?updatedAt=1759338029389",
          },
          {
            id: "ThaiLand-4",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%204.png?updatedAt=1759338029040",
          },
          {
            id: "ThaiLand-5",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%205.png?updatedAt=1759338029203",
          },
          {
            id: "ThaiLand-6",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%206.png?updatedAt=1759338029103",
          },
          {
            id: "ThaiLand-7",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%207.png?updatedAt=1759338028960",
          },
          {
            id: "ThaiLand-8",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%208.png?updatedAt=1759338029220",
          },
          {
            id: "ThaiLand-9",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%209.png?updatedAt=1759338029356",
          },
          {
            id: "ThaiLand-10",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Xi%C3%AAm%20h%C3%ACnh%20s%E1%BB%91%2010.png?updatedAt=1759338029208",
          },
        ],
        summary: "",
      },
      {
        id: "China-2",
        name: "Cửu Long - Hồng Kông",
        latitude: 22.2939,
        longitude: 114.1713,
        sections: [
          {
            id: "China-2-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/C%E1%BB%ADu%20Long,%20H%C6%B0%C6%A1ng%20C%E1%BA%A3ng,%20Trung%20Qu%E1%BB%91c%206.1-7.2.1930.png?updatedAt=1759338081805",
          },
          {
            id: "China-2-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/H%E1%BB%93ng%20C%C3%B4ng,%20Trung%20Qu%E1%BB%91c%201931.png?updatedAt=1759338081980",
          },
        ],
        summary: "",
        small: true,
      },
      {
        id: "Russia-3",
        name: "Nga",
        latitude: 54.8438,
        longitude: 37.3182,
        sections: [
          {
            id: "Russia-3-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Moskva,%20Li%C3%AAn%20X%C3%B4,%20Vi%E1%BB%87t%20Nam%206.1933.png?updatedAt=1759337980422",
          },
          {
            id: "Russia-3-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Li%C3%AAn%20X%C3%B4%201935.png?updatedAt=1759337980349",
          },
        ],
        summary: "",
        small: true,
      },
      {
        id: "China-3",
        name: "Quế Lâm - Trung Quốc",
        latitude: 25.2796,
        longitude: 110.2917,
        sections: [
          {
            id: "China-3-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Trung%20Qu%E1%BB%91c%201938.png?updatedAt=1759338101739",
          },
          {
            id: "China-3-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/ph%E1%BB%91%20T%C3%BAc%20Vinh,%20Trung%20Qu%E1%BB%91c%201942.png?updatedAt=1759338115773",
          },
          {
            id: "China-3-3",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Trung%20Qu%E1%BB%91c%201942-1943.png?updatedAt=1759338115583",
          },
        ],
        summary: "",
      },
      {
        id: "VietNam-2",
        name: "Việt Nam",
        latitude: 22.9794,
        longitude: 106.0533,
        sections: [
          {
            id: "VietNam-2-1",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/P%C3%A1c%20B%C3%B3,%20Cao%20B%E1%BA%B1ng,%20Vi%E1%BB%87t%20Nam%2028.1.1941.png?updatedAt=1759338127717",
          },
          {
            id: "VietNam-2-2",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/P%C3%A1c%20B%C3%B3,%20Cao%20B%E1%BA%B1ng,%20Vi%E1%BB%87t%20Nam%205.1941.png?updatedAt=1759338127097",
          },
          {
            id: "VietNam-2-3",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/P%C3%A1c%20B%C3%B3,%20Cao%20B%E1%BA%B1ng,%20Vi%E1%BB%87t%20Nam%209.8.1944.png?updatedAt=1759338140787",
          },
          {
            id: "VietNam-2-4",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/P%C3%A1c%20B%C3%B3,%20Cao%20B%E1%BA%B1ng,%20Vi%E1%BB%87t%20Nam%209.8.1944.png?updatedAt=1759338140787",
          },
          {
            id: "VietNam-2-5",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/Ba%20%C4%90%C3%ACnh,%20H%C3%A0%20N%E1%BB%99i,%20Vi%E1%BB%87t%20Nam%202.9.1945.png?updatedAt=1759338140372",
          },
          {
            id: "VietNam-2-6",
            imageUrl:
              "https://ik.imagekit.io/g3v69v09c/H%C3%A0%20N%E1%BB%99i,%20Vi%E1%BB%87t%20Nam%2019.8.1945.png?updatedAt=1759338140183",
          },
        ],
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
      <img
        src="https://ik.imagekit.io/g3v69v09c/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_FPT.svg.png?updatedAt=1759344158282"
        alt="Logo ứng dụng"
        className="absolute top-4 right-4 z-[1000] h-12 w-auto"
      />
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
