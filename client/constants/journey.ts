import { MapPoint } from "@/components/MapView";

const allPoints: MapPoint[] = [
  { id: "HCM", name: "Ben Nha Rong", latitude: 10.76839198801335, longitude: 106.70687571207475, ... }, 
  { id: "tokyo", name: "Tokyo", latitude: 35.65, longitude: 139.83, ... },
  { id: "paris", name: "Paris", latitude: 48.86, longitude: 2.34, ... },
];

const journey = [
    //Bến Nhà Rồng -> Pháp
    { startId: 'HCM', endId: 'France', waypoints: [
      { lat: 10, lng: 110 }
      { lat: 28, lng: 45 }
    ] },
  
  // Chặng 2: Tokyo -> Paris (đường cong phức tạp với 2 điểm nối)
  {
    startId: 'tokyo',
    endId: 'paris',
    waypoints: [, 
      { lat: 1.2706634385176643, lng: 103.83027779240004 }, // Điểm nối ở Biển Đông
      { lat: 28, lng: 45 }  // Điểm nối ở Trung Đông
    ]
  },
  // Bạn có thể thêm các chặng tiếp theo ở đây
  // { startId: 'paris', endId: 'newyork', waypoints: [...] }
];