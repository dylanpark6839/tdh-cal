import { NextResponse } from 'next/server';
import type { NotamData } from '@/hooks/useNotams';

// 공항 좌표 정보
const AIRPORT_COORDINATES = {
  'RKSI': { lat: 37.4691, lng: 126.4505 }, // 인천
  'RKSS': { lat: 37.5585, lng: 126.7964 }, // 김포
  'RKPC': { lat: 33.5113, lng: 126.4927 }, // 제주
  'RKPK': { lat: 35.1795, lng: 128.9381 }, // 김해
  'RKTU': { lat: 35.5375, lng: 129.3556 }, // 울산
  'RKTN': { lat: 35.8941, lng: 128.6586 }, // 대구
  'RKJJ': { lat: 35.1264, lng: 126.8097 }, // 광주
  'RKJB': { lat: 35.8714, lng: 127.1197 }, // 전주
  'RKTH': { lat: 34.9914, lng: 127.5205 }, // 여수
  'RKPS': { lat: 34.8424, lng: 128.6011 }, // 사천
  'RKPU': { lat: 33.5113, lng: 126.4927 }, // 울진
};

export async function GET() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockNotams: NotamData[] = [
      // A-시리즈: 공항 시설 및 서비스
      {
        id: "A0123/24",
        location: AIRPORT_COORDINATES['RKSI'],
        series: 'A',
        elevation: 23,
        lowerFL: 0,
        upperFL: 100,
        text: "RWY 15L/33R CLSD DUE TO MAINTENANCE",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKSI',
        radius: 5,
        radiusUnit: 'NM'
      },
      {
        id: "A0124/24",
        location: AIRPORT_COORDINATES['RKTH'],
        series: 'A',
        elevation: 15,
        text: "TWY B CLSD DUE TO MARKING",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKTH',
        radius: 3,
        radiusUnit: 'NM'
      },
      {
        id: "A0125/24",
        location: AIRPORT_COORDINATES['RKTN'],
        series: 'A',
        elevation: 25,
        text: "APRON B CLSD FOR RECONSTRUCTION",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKTN',
        radius: 2,
        radiusUnit: 'NM'
      },
      // C-시리즈: 항행시설
      {
        id: "C0456/24",
        location: AIRPORT_COORDINATES['RKSS'],
        series: 'C',
        elevation: 18,
        lowerFL: 0,
        upperFL: 50,
        text: "ILS RWY 14R CAT II/III OTS",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKSS',
        radius: 10,
        radiusUnit: 'NM'
      },
      {
        id: "C0457/24",
        location: AIRPORT_COORDINATES['RKPS'],
        series: 'C',
        elevation: 28,
        text: "VOR/DME SAC U/S",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPS',
        radius: 15,
        radiusUnit: 'NM'
      },
      {
        id: "C0458/24",
        location: AIRPORT_COORDINATES['RKPC'],
        series: 'C',
        elevation: 118,
        text: "DVOR/DME CJU LIMITED SERVICE DUE TO MAINTENANCE",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPC',
        radius: 20,
        radiusUnit: 'NM'
      },
      // D-시리즈: 공항 제한사항
      {
        id: "D0789/24",
        location: AIRPORT_COORDINATES['RKPC'],
        series: 'D',
        elevation: 118,
        text: "BIRD ACTIVITY INCREASED IN VICINITY OF AD",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPC',
        radius: 3,
        radiusUnit: 'NM'
      },
      {
        id: "D0790/24",
        location: AIRPORT_COORDINATES['RKPU'],
        series: 'D',
        elevation: 50,
        text: "CRANE ERECTED 1NM EAST OF RWY 18, HGT 150FT AGL",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPU',
        radius: 2,
        radiusUnit: 'NM'
      },
      {
        id: "D0791/24",
        location: AIRPORT_COORDINATES['RKJJ'],
        series: 'D',
        elevation: 35,
        text: "TWR VISIBILITY REDUCED DUE TO FOG",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKJJ',
        radius: 5,
        radiusUnit: 'NM'
      },
      // E-시리즈: 항공교통관제
      {
        id: "E0234/24",
        location: AIRPORT_COORDINATES['RKPK'],
        series: 'E',
        elevation: 12,
        lowerFL: 0,
        upperFL: 150,
        text: "CTR SECTOR 2 RADAR SERVICE LIMITED DUE TO MAINTENANCE",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPK',
        radius: 25,
        radiusUnit: 'NM'
      },
      {
        id: "E0235/24",
        location: AIRPORT_COORDINATES['RKSI'],
        series: 'E',
        elevation: 23,
        lowerFL: 50,
        upperFL: 200,
        text: "ATS ROUTE B576 CLSD BTN AGAVO AND KADIS",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKSI',
        radius: 40,
        radiusUnit: 'NM'
      },
      {
        id: "E0236/24",
        location: AIRPORT_COORDINATES['RKSS'],
        series: 'E',
        elevation: 18,
        lowerFL: 0,
        upperFL: 100,
        text: "APPROACH CONTROL SERVICE HOURS CHANGED TO 0600-2200",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKSS',
        radius: 30,
        radiusUnit: 'NM'
      },
      // G-시리즈: 항공정보
      {
        id: "G0567/24",
        location: AIRPORT_COORDINATES['RKTU'],
        series: 'G',
        elevation: 45,
        text: "NEW APRON LIGHTING SYSTEM OPERATIONAL",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKTU',
        radius: 2,
        radiusUnit: 'NM'
      },
      {
        id: "G0568/24",
        location: AIRPORT_COORDINATES['RKJB'],
        series: 'G',
        elevation: 30,
        text: "NEW TAXIWAY GUIDANCE SIGNS INSTALLED",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKJB',
        radius: 3,
        radiusUnit: 'NM'
      },
      {
        id: "G0569/24",
        location: AIRPORT_COORDINATES['RKTH'],
        series: 'G',
        elevation: 15,
        text: "UPDATED AIRPORT CHARTS PUBLISHED",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKTH',
        radius: 5,
        radiusUnit: 'NM'
      },
      // Z-시리즈: 군사작전
      {
        id: "Z0890/24",
        location: AIRPORT_COORDINATES['RKJJ'],
        series: 'Z',
        elevation: 35,
        lowerFL: 0,
        upperFL: 200,
        text: "MIL ACFT INTENSIVE ACTIVITY",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKJJ',
        radius: 30,
        radiusUnit: 'NM'
      },
      {
        id: "Z0891/24",
        location: AIRPORT_COORDINATES['RKPS'],
        series: 'Z',
        elevation: 28,
        lowerFL: 100,
        upperFL: 250,
        text: "MILITARY EXERCISE IN PROGRESS",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPS',
        radius: 40,
        radiusUnit: 'NM'
      },
      {
        id: "Z0892/24",
        location: AIRPORT_COORDINATES['RKJB'],
        series: 'Z',
        elevation: 30,
        lowerFL: 0,
        upperFL: 150,
        text: "RESTRICTED AREA R123 ACTIVATED",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKJB',
        radius: 25,
        radiusUnit: 'NM'
      },
      // SNOWTAM: 활주로 상태
      {
        id: "SNOW0123/24",
        location: AIRPORT_COORDINATES['RKTN'],
        series: 'SNOWTAM',
        elevation: 25,
        text: "RWY 18/36 COVERED WITH 2CM SNOW, BRAKING ACTION GOOD",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKTN',
        radius: 1,
        radiusUnit: 'NM'
      },
      {
        id: "SNOW0124/24",
        location: AIRPORT_COORDINATES['RKPK'],
        series: 'SNOWTAM',
        elevation: 12,
        text: "RWY 18R/36L CLEARED OF SNOW, TREATED WITH DE-ICING CHEMICAL",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKPK',
        radius: 1,
        radiusUnit: 'NM'
      },
      {
        id: "SNOW0125/24",
        location: AIRPORT_COORDINATES['RKTU'],
        series: 'SNOWTAM',
        elevation: 45,
        text: "TWY A, B, C CONTAMINATED WITH SLUSH, CLEARING IN PROGRESS",
        validFrom: now.toISOString(),
        validTo: tomorrow.toISOString(),
        airport: 'RKTU',
        radius: 1,
        radiusUnit: 'NM'
      }
    ];

    console.log('Sending NOTAMs:', mockNotams);
    return NextResponse.json(mockNotams);
  } catch (error) {
    console.error('Error in NOTAM API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NOTAMs' },
      { status: 500 }
    );
  }
} 