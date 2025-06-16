import React, { useEffect } from 'react';
import { Polygon } from '@react-google-maps/api';
import { AirspaceType } from '@/components/MapControls';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import { AIRSPACE_AREAS } from './airspaces';

interface Coordinates {
  lat: number;
  lng: number;
}

interface AirspaceArea {
  name: string;
  coordinates: Coordinates[];
  description?: string;
  type?: 'polygon' | 'line';
}

interface AirspaceLayersProps {
  showAirspaces: AirspaceType[];
}

// CTR 상세 정보 매핑
const CTR_INFO: Record<string, string> = {
  "OSAN CONTROL ZONE": `A circle 5 NM radius centered at 370526N 1270147E\n(Excluding the area that overlap with the Suwon control zone)\nSFC - 2 200 ft AGL\nClass D\nOsan Tower\nOsan Tower\nEnglish\nH24\n132.125, 272.70/ATIS\n122.10, 308.80/TWR\n132.45, 253.70/GND\n121.50, 243.00/EMERG\nUSAF`,
  "MOKPO CONTROL ZONE": `A circle 5 NM radius centered at 344532N 1262252E\nSFC - 3 000 ft AGL\nClass D\nMokpo Tower\nMokpo Tower\nEnglish/Korean\nH24\n134.4, 235.1/TWR\n134.4, 235.1/GND\n121.50, 243.00/EMERG\nROKN`,
  "JINHAE CONTROL ZONE": `A circle 5 NM radius centered at 350841N 1284139E\nSFC - 3 000 ft AGL\nClass D\nJinhae Tower\nJinhae Tower\nEnglish/Korean\nH24\n126.2, 236.6, 350.0/TWR\n120.2, 275.8/GND\n121.50, 243.00/EMERG\nROKN`,
  "PYEONGTAEK CONTROL ZONE": `A circle 5 NM radius centered at 365736N 1270200E\nSFC - 3 000 ft AGL\nClass D\nPyeongtaek Tower\nPyeongtaek Tower\nEnglish\nH24\n121.575/ATIS\n122.5, 257.8/TWR\n119.5, 227.9/GND\n121.50, 243.00/EMERG\nUSArmy`,
  "NONSAN CONTROL ZONE": `A circle 5 NM radius centered at 361610N 1270650E\nSFC - 2 000 ft AGL\nClass D\nNonsan Tower\nNonsan Tower\nEnglish/Korean\n2300-0800Z on MON-FRI\nCLSD SAT, SUN and HOL\n133.350/TWR\n346.650/GND\n121.50, 243.00/EMERG\nROKA`,
  "ICHEON CONTROL ZONE": `A circle 5 NM radius centered at 371204N 1272819E\nSFC - 3 000 ft AGL\nClass D\nIcheon Tower\nIcheon Tower\nEnglish/Korean\n2310-0830Z on MON-THU,\n2310-0650Z on FRI,\nCLSD SAT, SUN and HOL\n124.9, 346.7/TWR\n127.8/GND\n121.50, 243.00/EMERG\nROKA`,
  "SUWON CONTROL ZONE": `A circle 5 NM radius centered at 371422N 1270025E\nSFC - 4 000 ft AGL\nClass D\nSuwon Tower\nSuwon Tower\nEnglish/Korean\nH24\n126.425, 225.675/ATIS\n126.2, 236.6, 244.4/TWR\n275.8/GND\n121.50, 243.00/EMERG\nROKAF\nATIS OPS.\n2100-1300Z`,
  "GANGNEUNG CONTROL ZONE": `A circle 5 NM radius centered at 374514N 1285642E\nSFC - 4 000 ft AGL\nClass C\nGangneung Tower\nGangneung Tower\nEnglish/Korean\nH24\n126.675, 226.175/ATIS\n126.2, 236.6, 238.0/TWR\n275.8/GND\n121.50, 243.00/EMERG\nROKAF\nATIS OPS.\n2200-1200Z`,
  "HAEMI CONTROL ZONE": `A circle 5 NM radius centered at 364216N 1262910E\nSFC - 4 000 ft AGL\nClass C\nHaemi Tower\nHaemi Tower\nEnglish/Korean\nH24\n127.225 226.375/ATIS\n126.2, 236.6, 284.3/TWR\n275.8/GND\n121.50, 243.00/EMERG\nROKAF\nATIS OPR.\n2100-1300Z`,
  "JUNGWON CONTROL ZONE": `A circle 5 NM radius centered at 370149N 1275309E\nSFC - 4 000 ft AGL\nClass C\nJungwon Tower\nJungwon Tower\nEnglish/Korean\nH24\n126.875, 226.275/ATIS\n126.2, 230.15, 236.6/TWR\n275.8/GND\n121.50, 243.00/EMERG\nROKAF\nATIS OPS.\n2200-1300Z`,
  "SEONGMU CONTROL ZONE": `A circle 5 NM radius centered at 363405N 1273000E\n(Excluding the area that overlap with the Cheongju control zone)\nSFC - 4 000 ft AGL\nClass D\nSeongmu Tower\nSeongmu Tower\nEnglish/Korean\n2320-0820Z on MON-FRI\nCLSD SAT, SUN and HOL\n131.3, 126.2, 236.6, 363.9/TWR\n134.55/GND\n121.50, 243.00/EMERG\nROKAF`,
  "YECHEON CONTROL ZONE": `A circle 5 NM radius centered at 363754N 1282118E\nSFC - 4 000 ft AGL\nClass C\nYecheon Tower\nYecheon Tower\nEnglish/Korean\nH24\n126.625, 226.075/ATIS\n126.2, 236.6, 269.5/TWR\n275.8/GND\n121.50, 243.00/EMERG\nROKAF\nATIS OPS.\n2100-1300Z`,
  "SOKCHO CONTROL ZONE": `A circle 5 NM radius centered at 380839N 1283610E\nSFC - 2 500 ft AGL\nExcluding(the overlapping area of) P518 and Yangyang control zone\nClass D\nSokcho Tower\nSokcho Tower\nEnglish/Korean\n2300-0800Z on MON-FRI\nCLSD SAT, SUN and HOL\n125.450, 346.775/TWR\n36.60/GND\n121.50, 243.00/EMERG\nROKA`,
};

// CTA 상세 정보 매핑
const CTA_INFO: Record<string, string> = {
  "WEST-SEA HIGH SECTOR": `FL 600 / FL 295\nClass A, B, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n132.80, 290.60/PRIMARY\n120.525, 335.45/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "WEST-SEA LOW SECTOR": `FL 295 / 1 000 ft AGL\nClass A, C, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n128.70, 270.50/PRIMARY\n118.925, 263.60/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "EAST-SEA LOW SECTOR": `FL 295 / 1 000 ft AGL\nClass A, C, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n134.175, 272.40/PRIMARY\n123.65, 233.60/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "EAST-SEA SECTOR": `FL 600 / 1 000 ft AGL\nClass A, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n122.250, 263.350/PRIMARY\n125.925, 263.85/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "DAEGU SECTOR": `FL 600 / 1 000 ft AGL\nClass A, C, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n125.375, 234.15/PRIMARY\n125.775, 124.575, 317.35, 335.50/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "POHANG SECTOR": `FL 600 / 1 000 ft AGL\nClass A, C, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n120.575, 254.70/PRIMARY\n119.375, 119.325, 134.375, 254.7, 335.75/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SOUTH-SEA SECTOR": `FL 600 / 1 000 ft AGL\nClass A, C, D, E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n128.175, 335.50/PRIMARY\n128.325, 275.20/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "GUNSAN LOW SECTOR": `FL 255 / 1 000 ft AGL\nClass A, C, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n126.175, 317.85/PRIMARY\n134.375, 335.55/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`,
  "GUNSAN HIGH SECTOR": `FL 600 / FL 255\nClass A, C, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n132.15, 263.15/PRIMARY\n123.55, 272.60/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`,
  "GWANGJU LOW SECTOR": `FL 255 / 1 000 ft AGL\nClass A, C, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n120.725, 263.90/PRIMARY\n128.30, 272.75/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`,
  "GWANGJU HIGH SECTOR": `FL 600 / FL 255\nClass A, C, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n123.725, 239.25/PRIMARY\n124.50, 275.40/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`,
  "JEJU NORTH SECTOR": `FL 600 / 1 000 ft AGL\nClass A, B, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n124.525, 255.40/PRIMARY\n132.425, 233.50, 348.10/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`,
  "JEJU SOUTH HIGH SECTOR": `FL 600 / FL 335\nClass A, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n133.425, 234.35/PRIMARY\n134.15, 234.65/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`,
  "JEJU SOUTH LOW SECTOR": `FL 335 / 1 000 ft AGL\nClass A, D, E\nIncheon ACC\nIncheon Control\nEnglish\nH24\n125.725, 232.95/PRIMARY\n132.825, 128.375, 233.15/SECONDARY\n132.20, 355.50/COMMON\n121.50, 243.00/EMERG`
};

// TMA 상세 정보 매핑
const TMA_INFO: Record<string, string> = {
  "SEOUL TMA S1": `6 000 ft AMSL / 1 600 ft AMSL\nClass B, E\nRestriction: Controlled IFR aircraft by Seoul Approach can only use this area. VFR aircraft do not use this area.`,
  "OSAN TMA T-11": `6 500 ft AMSL / 1 000 ft AGL\nClass D, E\nOsan APP\nOsan APP\nEnglish\nH24\n127.90, 363.10/PRIMARY\n121.50, 243.00/EMERG\nClass D: Osan 5 NM radius of 370526N 1270147E 2 200 ft AMSL / SFC\nSuwon 5 NM radius of 371422N 1270025E 4 000 ft AGL / GND\nIcheon 5 NM radius of 371204N 1272819E 3 000 ft AGL / GND\nPyeongtaek 5 NM radius of 365736N 1270200E 3 000 ft AGL / GND`,
  "OSAN TMA T-12": `6 500 ft AMSL / 4 500 ft AMSL\nClass D, E\nOsan APP\nOsan APP\nEnglish\nH24`,
  "OSAN TMA T-13": `9 500 ft AMSL / 4 500 ft AMSL\nClass D, E\nOsan APP\nOsan APP\nEnglish\nH24`,
  "OSAN TMA T-14": `11 500 ft AMSL / 4 500 ft AMSL\nClass E\nOsan APP\nOsan APP\nEnglish\nH24`,
  "OSAN TMA T-15": `11 500 ft AMSL / 1 000 ft AGL\nClass D, E\nOsan APP\nOsan APP\nEnglish\nH24`,
  "OSAN TMA T-16": `FL 145 / 1 000 ft AGL\nClass D, E\nOsan APP\nOsan APP\nEnglish\nH24`,
  "OSAN TMA T-17": `FL 145 / 6 500 ft AMSL\nClass D, E\nOsan APP\nOsan APP\nEnglish\nH24`,
  "JUNGWON TMA T-18": `FL 175 / 1 000 ft AGL\nClass C, E\nJungwon APP\nJungwon Approach\nEnglish\nH24\n132.55, 306.70/PRIMARY\n121.50, 243.00/EMERG\nClass C: Jungwon 5 NM radius of 370149N 1275309E 5 000 ft AGL / GND\n5-10 NM radius of 370149N 1275309E 5 000 ft AGL / 1 000 ft AGL (including areas extended southbound)\nClass D: Seongmu 5 NM radius of 363405N 1273000E (excluding overlap with Cheongju Class D) 4 000 ft AGL / GND\nCheongju 5 NM radius of 364259N 1272957E (including areas extended NE/SW) 5 000 ft AGL / GND`,
  "JUNGWON TMA T-19": `FL 145 / 1 000 ft AGL\nClass D, E\nJungwon APP\nJungwon Approach\nEnglish\nH24`,
  "JUNGWON TMA T-20": `FL 145 / 5 500 ft AMSL\nClass D, E\nJungwon APP\nJungwon Approach\nEnglish\nH24`,
  "JUNGWON TMA T-21": `3 500 ft AMSL / 1 000 ft AGL\nClass C, E\nJungwon APP\nJungwon Approach\nEnglish\nH24`,
  "JUNGWON TMA T-22": `FL 175 / 9 500 ft AMSL\nClass E\nJungwon APP\nJungwon Approach\nEnglish\nH24`,
  "SEOUL TMA T-01": `FL 185 / 1 000 ft AGL\nClass B, D, E\nSeoul APP\nSeoul Approach\nEnglish\nH24\n119.05, 119.10, 119.75, 124.70, 120.80, 121.35, 121.40, 123.25, 123.80, 124.20, 124.80, 125.15, 293.30, 305.70, 353.20, 363.80/PRIMARY\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-02": `FL 185 / FL 175\nClass D\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-03": `FL 185 / 4 500 ft AMSL\nClass B, D, E\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-04": `FL 185 / 6 500 ft AMSL\nClass D, E\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-05": `FL 185 / 7 500 ft AMSL\nClass D, E\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-06": `FL 185 / 9 500 ft AMSL\nClass D, E\nSeoul APP\nSeoul Approach\nEnglish\nH24\nClass D: Airspace from above 10 000 ft AMSL to FL200 within Seoul TMA, excluding Class B.\nSeoul 5 NM radius of 372644N 1270647E 4 000 ft AGL / GND\nIcheon 5 NM radius of 371204N 1272819E 3 000 ft AGL / GND\nPyeongtaek 5 NM radius of 365736N 1270200E 3 000 ft AGL / GND`,
  "SEOUL TMA T-07": `FL 185 / 11 500 ft AMSL\nClass D\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-08": `FL 185 / 11 500 ft AMSL\nClass D\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-09": `FL 185 / FL 145\nClass D\nSeoul APP\nSeoul Approach\nEnglish\nH24`,
  "SEOUL TMA T-10": `FL 185 / 15 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-11": `FL 185 / 17 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-12": `FL 185 / 19 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-13": `FL 185 / 21 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-14": `FL 185 / 23 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-15": `FL 185 / 25 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-16": `FL 185 / 27 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-17": `FL 185 / 29 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-18": `FL 185 / 31 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-19": `FL 185 / 33 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-20": `FL 185 / 35 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-21": `FL 185 / 37 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-22": `FL 185 / 39 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-23": `FL 185 / 41 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-24": `FL 185 / 43 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-25": `FL 185 / 45 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-26": `FL 185 / 47 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-27": `FL 185 / 49 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-28": `FL 185 / 51 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-29": `FL 185 / 53 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-30": `FL 185 / 55 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-31": `FL 185 / 57 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-32": `FL 185 / 59 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-33": `FL 185 / 61 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-34": `FL 185 / 63 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "SEOUL TMA T-35": `FL 185 / 65 500 ft AMSL\nClass D\nSeoul ACC\nSeoul Control\nEnglish\nH24\n126.2, 236.6, 244.4/PRIMARY\n126.2, 236.6, 244.4/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "YECHEON TMA T-36": `FL 225 / 1 000 ft AGL\nClass C, E`,
  "YECHEON TMA T-42": `FL 225 / 9 500 ft AMSL\nClass E`,
  "YECHEON TMA T-22": `9 500 ft AMSL / 1 000 ft AGL\nClass C, E`,
  "YECHEON TMA T-20": `5 500 ft AMSL / 1 000 ft AGL\nClass C, E\nYecheon APP\nYecheon Approach\nEnglish\nH24\n134.50, 229.35/PRIMARY\n121.50, 243.00/EMERG`,
  "HAEMI TMA T-37": `FL 145 / 1 000 ft AGL\nClass C, E`,
  "HAEMI TMA T-38": `11 500 ft AMSL / 1 000 ft AGL\nClass C, E`,
  "HAEMI TMA T-39": `4 500 ft AMSL / 1 000 ft AGL\nClass E`,
  "HAEMI TMA T-14": `4 500 ft AMSL / 1 000 ft AGL\nClass E\nHaemi APP\nHaemi Approach\nEnglish\nH24\n124.60, 229.25, 253.95/PRIMARY\n121.50, 243.00/EMERG`,
  "TMA T-38": `정보 없음\nClass E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n126.2, 236.6/PRIMARY\n126.2, 236.6/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "TMA T-39": `정보 없음\nClass E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n126.2, 236.6/PRIMARY\n126.2, 236.6/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "TMA T-40": `정보 없음\nClass E\nDaegu ACC\nDaegu Control\nEnglish\nH24\n126.2, 236.6/PRIMARY\n126.2, 236.6/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "WONJU TMA T-41": `FL 175 / 1 000 ft AGL\nClass C, D, E\nWonju ACC\nWonju Control\nEnglish\nH24\n126.2, 236.6/PRIMARY\n126.2, 236.6/SECONDARY\n122.75, 262.75/COMMON\n121.50, 243.00/EMERG`,
  "JEJU TMA T-23": `FL 165 / 1 000 ft AGL\nClass B, D, E`,
  "JEJU TMA T-43": `FL 165 / 6 000 ft AMSL\nClass E\nJeju APP\nJeju Approach\nEnglish\nH24\n120.425, 121.20, 124.05, 317.70, 279.80/PRIMARY\n121.50, 243.00/EMERG`,
  "GANGNEUNG TMA T-24": `FL 225 / 1 000 ft AGL\nClass C, D, E`,
  "GANGNEUNG TMA T-25": `FL 145 / 1 000 ft AGL\nClass D, E\nGangneung APP\nGangneung Approach\nEnglish\nH24\n124.60, 304.00/PRIMARY\n121.50, 243.00/EMERG`,
  "GIMHAE TMA T-26": `FL 225 / 1 000 ft AGL\nClass C, D, E\nGimhae APP\nGimhae Approach\nEnglish\nH24\n119.20, 125.50, 134.40, 135.70, 225.10, 230.10, 253.80, 363.80/PRIMARY\n121.50, 243.00/EMERG`,
  "GUNSAN TMA T-27": `FL 225 / 1 000 ft AGL\nClass C, E`,
  "GUNSAN TMA T-28": `FL 145 / 1 000 ft AGL\nClass C, D, E\nGunsan APP\nGunsan Approach\nEnglish\nH24\n124.10, 292.65/PRIMARY\n121.50, 243.00/EMERG`,
  "GWANGJU TMA T-29": `FL 225 / 1 000 ft AGL\nClass C, D, E`,
  "GWANGJU TMA T-30": `FL 225 / 13 500 ft AMSL\nClass E\nGwangju APP\nGwangju Approach\nEnglish\nH24\n130.00, 228.90/PRIMARY\n121.50, 243.00/EMERG`,
  "SACHEON TMA T-31": `FL 195 / 1 000 ft AGL\nClass C, D, E`,
  "SACHEON TMA T-30": `13 500 ft AMSL / 1 000 ft AGL\nClass E\nSacheon APP\nSacheon Approach\nEnglish\nH24\n135.40, 344.70/PRIMARY\n121.50, 243.00/EMERG`,
  "POHANG TMA T-32": `10 500 ft AMSL / 1 000 ft AGL\nClass C, E`,
  "POHANG TMA T-33": `10 500 ft AMSL / 1 000 ft AGL\nClass C, D, E`,
  "POHANG TMA T-34": `7 500 ft AMSL / 1 000 ft AGL\nClass C, E\nPohang APP\nPohang Approach\nEnglish\nH24\n120.20, 232.40, 124.25/PRIMARY\n121.50, 243.00/EMERG`,
  "POHANG TMA T-42": `9 500 ft AMSL / 1 000 ft AGL\nClass C, D, E\nPohang APP\nPohang Approach\nEnglish\nH24\n120.20, 232.40, 124.25/PRIMARY\n121.50, 243.00/EMERG`,
  "DAEGU TMA T-35": `FL 225 / 1 000 ft AGL\nClass C, E\nDaegu APP\nDaegu Approach\nEnglish\nH24\n135.90, 346.30/PRIMARY\n121.50, 243.00/EMERG`,
  "DAEGU TMA T-33": `FL 225 / 10 500 ft AMSL\nClass E\nDaegu APP\nDaegu Approach\nEnglish\nH24\n135.90, 346.30/PRIMARY\n121.50, 243.00/EMERG`,
  "DAEGU TMA T-34": `FL 225 / 7 500 ft AMSL\nClass E\nDaegu APP\nDaegu Approach\nEnglish\nH24\n135.90, 346.30/PRIMARY\n121.50, 243.00/EMERG`,
  "WONJU TMA T-02": `FL 175 / 1 000 ft AGL\nClass C, E`,
  "WONJU TMA T-40": `FL 175 / 3 600 ft AGL\nClass E`,
  "WONJU TMA T-41": `FL 175 / 1 000 ft AGL\nClass C, D, E\nWonju APP\nWonju Approach\nEnglish\nH24\n135.725, 234.40, 130.2/PRIMARY\n121.50, 243.00/EMERG`,
};

const getAirspaceStyle = (type: AirspaceType): google.maps.PolygonOptions => {
  const baseStyle = {
    strokeWeight: 2,
    strokeOpacity: 0.8,
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
    geodesic: true
  };

  switch (type) {
    case 'TMA':
      return {
        ...baseStyle,
        strokeColor: '#4B0082',
        fillColor: '#4B0082',
      };
    case 'PROHIBITED':
      return {
        ...baseStyle,
        strokeColor: '#FF0000',
        fillColor: '#FF0000',
      };
    case 'RESTRICTED':
      return {
        ...baseStyle,
        strokeColor: '#FFA500',
        fillColor: '#FFA500',
      };
    case 'DANGER':
      return {
        ...baseStyle,
        strokeColor: '#FF4500',
        fillColor: '#FF4500',
      };
    case 'ALERT':
      return {
        ...baseStyle,
        strokeColor: '#FFD700',
        fillColor: '#FFD700',
      };
    case 'MOA':
      return {
        ...baseStyle,
        strokeColor: '#4169E1',
        fillColor: '#4169E1',
      };
    case 'UA':
      return {
        ...baseStyle,
        strokeColor: '#32CD32',
        fillColor: '#32CD32',
      };
    case 'ADIZ':
      return {
        ...baseStyle,
        strokeColor: '#800080',
        fillColor: '#800080',
      };
    case 'FIR':
      return {
        ...baseStyle,
        strokeColor: '#008080',
        fillColor: '#008080',
      };
    case 'CTA':
      return {
        ...baseStyle,
        strokeColor: '#483D8B',
        fillColor: '#483D8B',
      };
    case 'CTR':
      return {
        ...baseStyle,
        strokeColor: '#8B4513',
        fillColor: '#8B4513',
      };
    case 'ATZ':
      return {
        ...baseStyle,
        strokeColor: '#2F4F4F',
        fillColor: '#2F4F4F',
      };
    case 'CATA':
      return {
        ...baseStyle,
        strokeColor: '#556B2F',
        fillColor: '#556B2F',
      };
    default:
      return {
        ...baseStyle,
        strokeColor: '#808080',
        fillColor: '#808080',
      };
  }
};

const getAirspaceTypeLabel = (type: AirspaceType): string => {
  switch (type) {
    case 'PROHIBITED': return '금지구역';
    case 'RESTRICTED': return '제한구역';
    case 'DANGER': return '위험구역';
    case 'ALERT': return '경계구역';
    case 'MOA': return '군작전구역';
    case 'UA': return '초경량비행장치구역';
    case 'ADIZ': return '방공식별구역';
    case 'FIR': return '비행정보구역';
    case 'CTA': return '관제구';
    case 'TMA': return '접근관제구역';
    case 'CTR': return '관제권';
    case 'ATZ': return '비행장교통구역';
    case 'CATA': return '민간항공훈련구역';
    default: return type;
  }
};

export const AirspaceLayers: React.FC<AirspaceLayersProps> = ({ showAirspaces }) => {
  useEffect(() => {
    console.log('AirspaceLayers rendered with:', {
      showAirspaces,
      availableAreas: Object.keys(AIRSPACE_AREAS).reduce((acc, key) => {
        acc[key] = AIRSPACE_AREAS[key as AirspaceType]?.length || 0;
        return acc;
      }, {} as Record<string, number>)
    });
  }, [showAirspaces]);

  const handleClick = (area: AirspaceArea, type: AirspaceType) => {
    let info = area.description;
    if (type === 'CTR' && CTR_INFO[area.name.toUpperCase()]) {
      info = CTR_INFO[area.name.toUpperCase()];
    } else if (type === 'CTA' && CTA_INFO[area.name.toUpperCase()]) {
      info = CTA_INFO[area.name.toUpperCase()];
    } else if (type === 'TMA' && TMA_INFO[area.name.toUpperCase()]) {
      info = TMA_INFO[area.name.toUpperCase()];
    }
    toast(
      <div className="space-y-2">
        <div className="flex items-center gap-2 border-b pb-2">
          <Info className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <p className="font-bold text-lg">{area.name}</p>
            <p className="text-sm text-gray-600">{getAirspaceTypeLabel(type)}</p>
          </div>
        </div>
        {info && (
          <div className="py-2">
            <p className="text-sm whitespace-pre-line">{info}</p>
          </div>
        )}
      </div>,
      {
        duration: 5000,
        position: "bottom-right",
        className: "bg-white/90 backdrop-blur-sm shadow-lg rounded-lg"
      }
    );
  };

  return (
    <>
      {showAirspaces.map((airspaceType) => {
        if (!AIRSPACE_AREAS[airspaceType]) {
          console.warn(`No areas found for ${airspaceType}`);
          return null;
        }

        return AIRSPACE_AREAS[airspaceType].map((area, index) => {
          // ATZ 좌표 및 개수 콘솔 출력
          if (airspaceType === 'ATZ') {
            console.log('ATZ area:', area.name, area.coordinates[0]);
          }
          // ATZ 스타일을 진한 핑크 계열로 변경
          const style = airspaceType === 'CTR'
            ? {
                ...getAirspaceStyle(airspaceType),
                strokeColor: '#00BFFF',
                fillColor: '#B0E0E6',
                fillOpacity: 0.22,
                zIndex: 1000
              }
            : airspaceType === 'ATZ'
            ? {
                ...getAirspaceStyle(airspaceType),
                strokeColor: '#FF00FF', // 진한 핑크
                fillColor: '#FFD1FF',   // 연한 핑크
                fillOpacity: 0.7,
                zIndex: 2000
              }
            : getAirspaceStyle(airspaceType);

          // 좌표 데이터 로깅
          console.log(`Rendering ${airspaceType} area:`, {
            name: area.name,
            coordinates: area.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }))
          });

          if (area.type === 'line') {
            return null; // 라인 타입은 렌더링하지 않음
          }

          return (
            <Polygon
              key={`${airspaceType}-${area.name}-${index}`}
              paths={area.coordinates}
              options={style}
              onClick={() => handleClick(area, airspaceType)}
            />
          );
        });
      })}
    </>
  );
};
