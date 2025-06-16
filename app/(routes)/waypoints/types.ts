export interface Airport {
  id: string;           // 공항 ID (ICAO 코드)
  name: string;          // 공항 명칭
  type: 'military' | 'civilian' | 'army' | 'navy' | 'airforce' | 'us_military';  // 공항 유형
  description: string;   // 공항 설명
  frequencies: {
    atis?: string;      // ATIS 주파수
    approach?: string;  // APP 주파수
    tower?: string;     // TWR 주파수
    ground?: string;    // GND 주파수
    departure?: string; // DEP 주파수
    clearance?: string; // CLR 주파수
    emergency?: string; // EMG 주파수
    arrival?: string;   // ARR 주파수
    apron?: string;    // APR 주파수
  };
  elevation?: number;    // 표고
  runways?: {
    direction: string;   // 활주로 방향
    length?: number;    // 활주로 길이 (미터)
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  aip_link?: string;    // AIP PDF 링크
} 