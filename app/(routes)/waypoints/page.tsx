'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/BackButton";
import { AdBanner } from "@/components/AdBanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, MapPin, Route, Trash2, Download, Navigation, Compass, Ruler, Gauge, PinOff, Globe, MapPlus, PenSquare, Maximize2, Minimize2, Crosshair, PanelLeftClose, PanelLeftOpen, Home as HomeIcon, Mail, AlertTriangle, Layers, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toPoint } from 'mgrs';
import bearing from '@turf/bearing';
import distance from '@turf/distance';
import { FlightPlan, FlightSettings, RouteSegment } from '@/types/flight';
import { MapPicker } from '@/components/MapPicker';
import { GoogleMap, Marker, Polyline, Polygon, Circle } from '@react-google-maps/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { jsPDF } from 'jspdf';
import tokml from '@maphubs/tokml';
import { MapControls, MapSettings, AirspaceType, DEFAULT_SETTINGS } from '@/components/MapControls';
import Script from 'next/script';
import { toast } from 'sonner';
import Link from 'next/link';
import { Navigation as NavigationComponent } from '@/components/Navigation';
import { useNotams } from '@/hooks/useNotams';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { parseCoordinates } from '@/lib/coordinates';
import { AirportInfoCard } from './components/AirportInfoCard';
import { Airport } from './types';
import { AIRPORTS as AIRPORT_DATA } from './data/airports';
import { AirspaceLayers } from './components/AirspaceLayers';
import { BottomNav } from "@/components/BottomNav";
import tma from '@/data/airspace/TMA.json';
import ctrLayer from '@/data/airspace/ctr.json';
import { AIRSPACE_AREAS } from './components/airspaces';
import { HelpFAB } from "@/components/ui/help-fab";

interface WaypointInput {
  name: string;
  coordinates: string;
  latitude?: string;
  longitude?: string;
  coordinateType: "MGRS" | "LatLng";
  speed: string;
  speedUnit: "KTS" | "KPH";
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface NotamData {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  series: 'A' | 'C' | 'D' | 'E' | 'G' | 'Z' | 'SNOWTAM';
  elevation?: number;
  lowerFL?: number;
  upperFL?: number;
  text: string;
  validFrom: string;
  validTo: string;
  radius?: number;
  radiusUnit?: 'NM' | 'KM';
  airport?: string;
}

type DisplayAirspaceType = 'PROHIBITED' | 'RESTRICTED' | 'DANGER' | 'ALERT' | 'MOA' | 'UA' | 'ADIZ' | 'FIR';

interface AirspaceArea {
  name: string;
  coordinates: Coordinates[];
  description?: string;
  type?: 'polygon' | 'line';  // Add type to distinguish between polygons and lines
}

// Example control area data
const CONTROL_AREAS = [
  {
    name: "인천국제공항 관제공역",
    coordinates: [
      { lat: 37.4789, lng: 126.4375 },
      { lat: 37.5789, lng: 126.4375 },
      { lat: 37.5789, lng: 126.5375 },
      { lat: 37.4789, lng: 126.5375 },
      { lat: 37.4789, lng: 126.4375 }
    ]
  },
  {
    name: "김포국제공항 관제공역",
    coordinates: [
      { lat: 37.5500, lng: 126.7800 },
      { lat: 37.6500, lng: 126.7800 },
      { lat: 37.6500, lng: 126.8800 },
      { lat: 37.5500, lng: 126.8800 },
      { lat: 37.5500, lng: 126.7800 }
    ]
  }
];

// Example NOTAM data
const EXAMPLE_NOTAMS: NotamData[] = [
  {
    id: "A0123/23",
    location: { lat: 37.4691, lng: 126.4505 }, // RKSI (인천)
    series: 'A',
    elevation: 23,
    lowerFL: 0,
    upperFL: 100,
    text: "RWY 15L/33R CLSD DUE TO MAINTENANCE",
    validFrom: "2024-03-10T00:00:00Z",
    validTo: "2024-03-15T23:59:59Z"
  },
  {
    id: "C0456/23",
    location: { lat: 37.5585, lng: 126.7964 }, // RKSS (김포)
    series: 'C',
    elevation: 18,
    lowerFL: 0,
    upperFL: 50,
    text: "TWY A CLSD DUE TO CONSTRUCTION",
    validFrom: "2024-03-08T00:00:00Z",
    validTo: "2024-03-20T23:59:59Z"
  }
];



// Function to get NOTAM circle options based on series
const getNotamCircleOptions = (series: NotamData['series'], radius: number = 1) => {
  const colors = {
    'A': '#FF0000', // Red
    'C': '#FFA500', // Orange
    'D': '#FFFF00', // Yellow
    'E': '#008000', // Green
    'G': '#0000FF', // Blue
    'Z': '#800080', // Purple
    'SNOWTAM': '#FFFFFF' // White
  };

  // 반경이 클수록 낮은 z-index를 가지도록 설정
  const zIndex = 40 - Math.min(radius, 40);

  return {
    strokeColor: colors[series],
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: colors[series],
    fillOpacity: 0.15,
    zIndex: zIndex
  };
};

// NOTAM 정보를 표시하는 함수
const showNotamInfo = (notam: NotamData) => {
  toast(
    <div className="space-y-2 max-w-md">
      <div className="flex items-center gap-2 border-b pb-2">
        <Info className="h-5 w-5 text-blue-500" />
        <div>
          <p className="font-bold text-lg">{notam.id}</p>
          {notam.airport && (
            <p className="text-sm font-medium text-gray-600">{notam.airport}</p>
          )}
        </div>
      </div>
      <div className="py-2">
        <p className="text-sm">{notam.text}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t pt-2">
        <div>
          <p className="font-medium">유효기간</p>
          <p>{new Date(notam.validFrom).toLocaleString()}</p>
          <p>{new Date(notam.validTo).toLocaleString()}</p>
        </div>
        <div>
          {notam.elevation && (
            <div className="mb-1">
              <p className="font-medium">고도</p>
              <p>{notam.elevation}ft</p>
            </div>
          )}
          {(notam.lowerFL !== undefined && notam.upperFL !== undefined) && (
            <div className="mb-1">
              <p className="font-medium">비행고도</p>
              <p>FL{notam.lowerFL} - FL{notam.upperFL}</p>
            </div>
          )}
          {notam.radius && (
            <div>
              <p className="font-medium">영향 반경</p>
              <p>{notam.radius} {notam.radiusUnit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// NOTAM 시리즈별 정보를 표시하는 함수
const showNotamSeriesInfo = (series: NotamData['series'], currentNotams: NotamData[]) => {
  const seriesNotams = currentNotams.filter((notam: NotamData) => notam.series === series);
  if (seriesNotams.length === 0) {
    toast.info(`현재 ${series}-시리즈 NOTAM이 없습니다.`);
    return;
  }

  const seriesNames = {
    'A': '공항 시설 및 서비스',
    'C': '항행시설',
    'D': '공항 제한사항',
    'E': '항공교통관제',
    'G': '일반 항공정보',
    'Z': '군사작전',
    'SNOWTAM': '활주로 눈/얼음 상태'
  };

  toast.info(
    <div className="space-y-4 max-w-md">
      <div className="flex items-center gap-2 border-b pb-2">
        <Info className="h-5 w-5 text-blue-500" />
        <div>
          <p className="font-bold text-lg">{series}-시리즈 NOTAM</p>
          <p className="text-sm text-gray-600">{seriesNames[series]}</p>
        </div>
      </div>
      <div className="space-y-3">
        {seriesNotams.map(notam => (
          <div key={notam.id} className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-sm">{notam.id}</p>
            {notam.airport && (
              <p className="text-xs text-gray-600 mb-1">{notam.airport}</p>
            )}
            <p className="text-sm">{notam.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to convert DMS coordinates to circle coordinates
function convertDMStoLatLng(dmsStr: string, radiusKm: number): Coordinates[] {
  // Parse DMS string (format: DDMMSSN/EDDDMMSSE)
  const matches = dmsStr.match(/(\d{2})(\d{2})(\d{2})([NS])(\d{3})(\d{2})(\d{2})([EW])/);
  if (!matches) return [];
  
  const [_, latD, latM, latS, latDir, lonD, lonM, lonS, lonDir] = matches;
  
  let lat = parseInt(latD) + parseInt(latM) / 60 + parseInt(latS) / 3600;
  let lng = parseInt(lonD) + parseInt(lonM) / 60 + parseInt(lonS) / 3600;
  
  if (latDir === 'S') lat = -lat;
  if (lonDir === 'W') lng = -lng;

  // Generate circle points
  const points: Coordinates[] = [];
  const numPoints = 32; // Number of points to approximate circle
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const latOffset = (radiusKm / 111.32) * Math.cos(angle);
    const lngOffset = (radiusKm / (111.32 * Math.cos(lat * Math.PI / 180))) * Math.sin(angle);
    points.push({
      lat: lat + latOffset,
      lng: lng + lngOffset
    });
  }
  return points;
}

// 공항 데이터
const AIRPORTS = [
  'RKSI', // 인천
  'RKSS', // 김포
  'RKPC', // 제주
  'RKPK', // 김해
  'RKTU', // 청주
  'RKTN', // 대구
  'RKTH', // 포항
  'RKJJ', // 광주
  'RKJB', // 무안
  'RKPS', // 사천
  'RKPU'  // 울산
] as const;

const AIRPORT_COORDINATES: Record<typeof AIRPORTS[number], Coordinates> = {
  'RKSI': { lat: 37.4691, lng: 126.4505 }, // 인천
  'RKSS': { lat: 37.5585, lng: 126.7964 }, // 김포
  'RKPC': { lat: 33.5113, lng: 126.4927 }, // 제주
  'RKPK': { lat: 35.1795, lng: 128.9380 }, // 김해
  'RKTU': { lat: 36.7166, lng: 127.4991 }, // 청주
  'RKTN': { lat: 35.8941, lng: 128.6589 }, // 대구
  'RKTH': { lat: 35.9877, lng: 129.4201 }, // 포항
  'RKJJ': { lat: 35.1264, lng: 126.8097 }, // 광주
  'RKJB': { lat: 34.9913, lng: 126.3816 }, // 무안
  'RKPS': { lat: 35.0886, lng: 128.0703 }, // 사천
  'RKPU': { lat: 35.5933, lng: 129.3517 }  // 울산
};

interface Segment {
  distance: number;
  heading: number;
  timeInMinutes: number;
  cumulativeMinutes: number;
}

const nmToKm = (nm: number): number => nm * 1.852;

const formatBearing = (degrees: number): string => {
  return `${Math.round((degrees + 360) % 360)}°`;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.round((minutes % 1) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 공항 마커 클릭 시 정보 표시
const showAirportInfo = (airport: Airport) => {
  toast(
    <AirportInfoCard airport={airport} />,
    {
      duration: 10000,
      className: "p-0 bg-transparent border-none shadow-none",
    }
  );
};

const getAirportIcon = (type: Airport['type']) => {
  // 비행기 아이콘 SVG 경로
  const path = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";
  
  return {
    path,
    fillColor: type === 'army' ? "#4CAF50" : "#2196F3",  // 육군 기지는 초록색, 나머지는 파란색
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#FFFFFF",
    scale: 1,
    anchor: new google.maps.Point(12, 12),
    rotation: 45  // 비행기 아이콘을 45도 회전
  };
};

export default function WaypointsPage() {
  const router = useRouter();
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLayerControlVisible, setIsLayerControlVisible] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  const [mapSettings, setMapSettings] = useState<MapSettings>(DEFAULT_SETTINGS);

  const [formData, setFormData] = useState<WaypointInput>({
    name: "",
    coordinates: "",
    latitude: "",
    longitude: "",
    coordinateType: "MGRS",
    speed: "",
    speedUnit: "KTS",
  });

  const [mgrsData, setMgrsData] = useState({
    gridZone: "",
    gridCoords: ""
  });

  const [waypoints, setWaypoints] = useState<WaypointInput[]>([]);
  const [selectedCoordType, setSelectedCoordType] = useState<"MGRS" | "LatLng">("MGRS");
  const [selectedSpeedUnit, setSelectedSpeedUnit] = useState<"KTS" | "KPH">("KTS");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { notams, loading: notamsLoading } = useNotams();

  // Circle과 Marker에 대한 ref 관리
  const circleRefs = useRef<{ [key: string]: google.maps.Circle }>({});
  const markerRefs = useRef<{ [key: string]: google.maps.Marker }>({});

  // NOTAM Circle과 Marker refs 관리
  const clearNotamRefs = useCallback(() => {
    Object.values(circleRefs.current).forEach(circle => {
      if (circle) {
        google.maps.event.clearListeners(circle, 'click');
        circle.setMap(null);
      }
    });
    Object.values(markerRefs.current).forEach(marker => {
      if (marker) {
        google.maps.event.clearListeners(marker, 'click');
        marker.setMap(null);
      }
    });
    circleRefs.current = {};
    markerRefs.current = {};
  }, []);

  // NOTAM 표시 함수
  const displayNotams = useCallback(() => {
    if (!map || !mapSettings.showNotams) return;

    notams.forEach(notam => {
      if (notam.radius) {
        // 기존 Circle이 있다면 제거
        if (circleRefs.current[notam.id]) {
          circleRefs.current[notam.id].setMap(null);
          delete circleRefs.current[notam.id];
        }

        // 새로운 Circle 생성
        const circle = new google.maps.Circle({
          center: notam.location,
          radius: notam.radius * (notam.radiusUnit === 'NM' ? 1852 : 1000),
          map: map,
          ...getNotamCircleOptions(notam.series, notam.radius)
        });

        circle.addListener('click', () => {
          showNotamInfo(notam);
        });

        circleRefs.current[notam.id] = circle;
      }
    });
  }, [map, mapSettings.showNotams, notams]);

  // mapSettings 변경 시 NOTAM 업데이트
  useEffect(() => {
    if (!mapSettings.showNotams) {
      clearNotamRefs();
    } else {
      displayNotams();
    }
  }, [mapSettings.showNotams, displayNotams, clearNotamRefs]);

  // map 객체가 변경될 때 NOTAM 업데이트
  useEffect(() => {
    if (map && mapSettings.showNotams) {
      displayNotams();
    }
  }, [map, displayNotams]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearNotamRefs();
    };
  }, [clearNotamRefs]);

  useEffect(() => {
    if (formData.coordinateType === "MGRS") {
      setFormData(prev => ({
        ...prev,
        coordinates: mgrsData.gridZone + mgrsData.gridCoords
      }));
    }
  }, [mgrsData]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsMapReady(true);
      setIsMapScriptLoaded(true);
    }
  }, []);

  const parseCoordinates = (input: string, type: "MGRS" | "LatLng"): Coordinates | null => {
    try {
      if (type === "MGRS") {
        const point = toPoint(input);
        return { lat: point[1], lng: point[0] };
      } else {
        const [lat, lng] = input.split(/,\s*/).map(Number);
        if (isNaN(lat) || isNaN(lng)) throw new Error('Invalid format');
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) throw new Error('Coordinates out of range');
        return { lat, lng };
      }
    } catch (e) {
      return null;
    }
  };

  const handleCoordinateTypeChange = (value: "MGRS" | "LatLng") => {
    setSelectedCoordType(value);
    setFormData(prev => ({
      ...prev,
      coordinateType: value,
      coordinates: "",
      latitude: "",
      longitude: ""
    }));
  };

  const handleSpeedUnitChange = (value: "KTS" | "KPH") => {
    setSelectedSpeedUnit(value);
    setFormData(prev => ({
      ...prev,
      speedUnit: value
    }));
  };

  const handleInputChange = (field: keyof WaypointInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditWaypoint = (index: number) => {
    const waypoint = waypoints[index];
    setFormData({
      ...waypoint,
      latitude: waypoint.coordinateType === "LatLng" ? waypoint.coordinates.split(",")[0] : "",
      longitude: waypoint.coordinateType === "LatLng" ? waypoint.coordinates.split(",")[1] : "",
    });
    setSelectedCoordType(waypoint.coordinateType);
    setSelectedSpeedUnit(waypoint.speedUnit);
    setEditingIndex(index);
  };

  const nameInputRef = useRef<HTMLInputElement>(null);
  const gridZoneInputRef = useRef<HTMLInputElement>(null);
  const gridSquareInputRef = useRef<HTMLInputElement>(null);
  const eastingInputRef = useRef<HTMLInputElement>(null);
  const northingInputRef = useRef<HTMLInputElement>(null);
  const latitudeInputRef = useRef<HTMLInputElement>(null);
  const longitudeInputRef = useRef<HTMLInputElement>(null);
  const speedInputRef = useRef<HTMLInputElement>(null);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const focusNext = (currentField: string) => {
        switch (currentField) {
          case 'name':
            if (selectedCoordType === 'MGRS') {
              gridZoneInputRef.current?.focus();
            } else {
              latitudeInputRef.current?.focus();
            }
            break;
          case 'gridZone':
            gridSquareInputRef.current?.focus();
            break;
          case 'gridSquare':
            eastingInputRef.current?.focus();
            break;
          case 'easting':
            northingInputRef.current?.focus();
            break;
          case 'northing':
            speedInputRef.current?.focus();
            break;
          case 'latitude':
            longitudeInputRef.current?.focus();
            break;
          case 'longitude':
            speedInputRef.current?.focus();
            break;
          case 'speed':
            handleAddWaypoint();
            break;
        }
      };

      focusNext(field);
    }
  };

  const handleAddWaypoint = () => {
    if (!formData.name || !formData.speed) {
      alert("Please fill in all fields");
      return;
    }

    let coordinates: Coordinates | null = null;
    if (formData.coordinateType === "MGRS") {
      if (!formData.coordinates) {
        alert("Please enter MGRS coordinates");
        return;
      }
      coordinates = parseCoordinates(formData.coordinates, "MGRS");
    } else {
      if (!formData.latitude || !formData.longitude) {
        alert("Please enter both latitude and longitude");
        return;
      }
      coordinates = parseCoordinates(`${formData.latitude},${formData.longitude}`, "LatLng");
    }

    if (!coordinates) {
      alert("Invalid coordinates format");
      return;
    }

    const waypointToAdd = {
      ...formData,
      coordinates: formData.coordinateType === "MGRS" 
        ? formData.coordinates 
        : `${formData.latitude},${formData.longitude}`
    };

    if (editingIndex !== null) {
      // 수정 모드: 기존 웨이포인트 업데이트
      const updatedWaypoints = [...waypoints];
      updatedWaypoints[editingIndex] = waypointToAdd;
      setWaypoints(updatedWaypoints);
      setEditingIndex(null);
      toast.success("웨이포인트가 수정되었습니다.");
    } else {
      // 추가 모드: 새 웨이포인트 추가
      setWaypoints(prev => [...prev, waypointToAdd]);
      toast.success("웨이포인트가 추가되었습니다.");
    }
    
    // Reset form
    setFormData({
      name: "",
      coordinates: "",
      latitude: "",
      longitude: "",
      coordinateType: formData.coordinateType,
      speed: "",
      speedUnit: formData.speedUnit,
    });
  };

  const handleDeleteWaypoint = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(updatedWaypoints);
    
    // If deleting the waypoint being edited, reset the form
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({
        name: "",
        coordinates: "",
        latitude: "",
        longitude: "",
        coordinateType: selectedCoordType,
        speed: "",
        speedUnit: selectedSpeedUnit,
      });
    } else if (editingIndex !== null && index < editingIndex) {
      // Adjust editingIndex if deleting a waypoint before it
      setEditingIndex(editingIndex - 1);
    }
  };

  const calculateRoute = () => {
    if (waypoints.length < 2) {
      alert("Please add at least 2 waypoints");
      return;
    }

    const processedWaypoints = waypoints.map(wp => {
      const coords = parseCoordinates(wp.coordinates, wp.coordinateType)!;
      return {
        name: wp.name,
        coordinates: coords,
        coordinateType: wp.coordinateType,
        originalInput: wp.coordinates
      };
    });

    const segments: RouteSegment[] = [];
    let totalDist = 0;
    let totalTimeMinutes = 0;

    for (let i = 0; i < processedWaypoints.length - 1; i++) {
      const from = processedWaypoints[i];
      const to = processedWaypoints[i + 1];
      const speed = parseFloat(waypoints[i].speed);
      
      const dist = distance(
        [from.coordinates.lng, from.coordinates.lat],
        [to.coordinates.lng, to.coordinates.lat],
        { units: 'nauticalmiles' }
      );

      let heading = bearing(
        [from.coordinates.lng, from.coordinates.lat],
        [to.coordinates.lng, to.coordinates.lat]
      );
      
      // Convert to 360-degree system
      heading = (heading + 360) % 360;

      const timeMinutes = (dist / speed) * 60;
      totalDist += dist;
      totalTimeMinutes += timeMinutes;

      segments.push({
        from,
        to,
        distance: dist,
        heading,
        eta: `${Math.round(timeMinutes)}분`
      });
    }

    const hours = Math.floor(totalTimeMinutes / 60);
    const minutes = Math.round(totalTimeMinutes % 60);
    const totalTime = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;

    const flightPlan: FlightPlan = {
      waypoints: processedWaypoints,
      settings: {
        speed: parseFloat(waypoints[0].speed),
        speedUnit: waypoints[0].speedUnit === "KTS" ? "kt" : "km/h",
        distanceUnit: "NM"
      },
      segments,
      totalDistance: totalDist,
      totalTime: `${hours}:${minutes.toString().padStart(2, '0')}`
    };

    const planData = encodeURIComponent(JSON.stringify(flightPlan));
    router.push(`/route?plan=${planData}`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.text('Flight Plan Summary', pageWidth/2, 20, { align: 'center' });
    
    // Summary
    doc.setFontSize(12);
    let y = 40;
    
    let totalDist = 0;
    let totalMinutes = 0;
    
    // Calculate totals
    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const fromCoords = from.coordinateType === "MGRS"
        ? parseCoordinates(from.coordinates, "MGRS")
        : parseCoordinates(from.coordinates, "LatLng");
      const toCoords = to.coordinateType === "MGRS"
        ? parseCoordinates(to.coordinates, "MGRS")
        : parseCoordinates(to.coordinates, "LatLng");

      if (fromCoords && toCoords) {
        const dist = distance(
          [fromCoords.lng, fromCoords.lat],
          [toCoords.lng, toCoords.lat],
          { units: 'nauticalmiles' }
        );
        totalDist += dist;
        const speed = parseFloat(from.speed);
        totalMinutes += (dist / speed) * 60;
      }
    }

    // Write summary
    const totalDistNM = Math.round(totalDist * 10) / 10;
    const totalDistKM = Math.round(totalDist * 1.852 * 10) / 10;
    doc.text(`Total Distance: ${totalDistNM}NM(${totalDistKM}km)`, 20, y);
    y += 10;
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins = Math.floor(totalMinutes % 60);
    const totalSecs = Math.round((totalMinutes % 1) * 60);
    doc.text(`Total Time: ${totalHours}:${totalMins.toString().padStart(2, '0')}:${totalSecs.toString().padStart(2, '0')}`, 20, y);
    y += 20;

    // Route segments
    doc.setFontSize(16);
    doc.text('Route Segments', pageWidth/2, y, { align: 'center' });
    y += 10;

    // Table headers
    doc.setFontSize(12);
    doc.text('Segment', 20, y);
    doc.text('Distance', 70, y);
    doc.text('Heading', 120, y);
    doc.text('Time', 170, y);
    y += 10;

    // Draw line under headers
    doc.line(20, y-5, pageWidth-20, y-5);

    // Table content
    waypoints.forEach((waypoint, index) => {
      if (index === waypoints.length - 1) return;

      const from = waypoint;
      const to = waypoints[index + 1];
      const fromCoords = from.coordinateType === "MGRS"
        ? parseCoordinates(from.coordinates, "MGRS")
        : parseCoordinates(from.coordinates, "LatLng");
      const toCoords = to.coordinateType === "MGRS"
        ? parseCoordinates(to.coordinates, "MGRS")
        : parseCoordinates(to.coordinates, "LatLng");

      if (!fromCoords || !toCoords) return;

      const dist = distance(
        [fromCoords.lng, fromCoords.lat],
        [toCoords.lng, toCoords.lat],
        { units: 'nauticalmiles' }
      );

      const head = bearing(
        [fromCoords.lng, fromCoords.lat],
        [toCoords.lng, toCoords.lat]
      );

      const speed = parseFloat(from.speed);
      const timeMinutes = (dist / speed) * 60;
      const segmentHours = Math.floor(timeMinutes / 60);
      const segmentMinutes = Math.floor(timeMinutes % 60);
      const segmentSeconds = Math.round((timeMinutes % 1) * 60);
      const distNM = Math.round(dist * 10) / 10;
      const distKM = Math.round(dist * 1.852 * 10) / 10;

      doc.text(`${from.name} to ${to.name}`, 20, y);
      doc.text(`${distNM}NM(${distKM}km)`, 70, y);
      doc.text(`${Math.round((head + 360) % 360)}°`, 120, y);
      doc.text(`${segmentHours}:${segmentMinutes.toString().padStart(2, '0')}:${segmentSeconds.toString().padStart(2, '0')}`, 170, y);
      y += 10;

      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('flight-plan.pdf');
  };

  const handleExportKML = () => {
    if (waypoints.length < 2) {
      toast.error('최소 2개의 웨이포인트가 필요합니다.');
      return;
    }

    // Process waypoints to get valid coordinates
    const validWaypoints = waypoints.map(waypoint => {
      const coords = waypoint.coordinateType === "MGRS"
        ? parseCoordinates(waypoint.coordinates, "MGRS")
        : parseCoordinates(waypoint.coordinates, "LatLng");
      return coords ? { ...waypoint, validCoords: coords } : null;
    }).filter(wp => wp !== null);

    if (validWaypoints.length < 2) {
      toast.error('유효한 좌표가 없습니다.');
      return;
    }

    try {
    const geojson = {
      type: 'FeatureCollection',
      features: [
          // Route line
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
              coordinates: validWaypoints.map(wp => [wp.validCoords.lng, wp.validCoords.lat])
          },
          properties: {
              name: '비행 경로',
              description: `총 거리: ${calculateTotalDistance(validWaypoints).toFixed(1)} NM`
          }
        },
          // Waypoint markers
          ...validWaypoints.map(wp => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [wp.validCoords.lng, wp.validCoords.lat]
            },
            properties: {
              name: wp.name,
              description: `속도: ${wp.speed} ${wp.speedUnit}`
            }
          }))
      ]
    };

    const kml = tokml(geojson);
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flight-route.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
      toast.success('KML 파일이 생성되었습니다.');
    } catch (error) {
      console.error('KML export error:', error);
      toast.error('KML 생성 중 오류가 발생했습니다.');
    }
  };

  // Helper function to calculate total distance
  const calculateTotalDistance = (waypoints: Array<{
    validCoords: {
      lat: number;
      lng: number;
    };
  }>) => {
    let totalDist = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const dist = distance(
        [from.validCoords.lng, from.validCoords.lat],
        [to.validCoords.lng, to.validCoords.lat],
        { units: 'nauticalmiles' }
      );
      totalDist += dist;
    }
    return totalDist;
  };

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleCurrentLocation = useCallback(() => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);
          map.setZoom(12);

          new google.maps.Marker({
            position: pos,
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
        },
        () => {
          alert("위치 정보를 가져올 수 없습니다.");
        }
      );
    } else {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
    }
  }, [map]);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
    setIsMapReady(true);
  };

  const handleMapSettingsChange = (newSettings: MapSettings) => {
    if (!newSettings.showNotams && mapSettings.showNotams) {
      clearAllNotamCircles();
    }
    setMapSettings(newSettings);
  };

  // NOTAM Circle 관리
  const clearAllNotamCircles = useCallback(() => {
    Object.values(circleRefs.current).forEach(circle => {
      if (circle) {
        google.maps.event.clearListeners(circle, 'click');
        circle.setMap(null);
      }
    });
    circleRefs.current = {};
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearAllNotamCircles();
    };
  }, [clearAllNotamCircles]);

  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    if (waypoints.length < 2) {
      setSegments([]);
      return;
    }

    const newSegments: Segment[] = [];
    let cumulativeMinutes = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const fromCoords = from.coordinateType === "MGRS"
        ? parseCoordinates(from.coordinates, "MGRS")
        : parseCoordinates(from.coordinates, "LatLng");
      const toCoords = to.coordinateType === "MGRS"
        ? parseCoordinates(to.coordinates, "MGRS")
        : parseCoordinates(to.coordinates, "LatLng");

      if (!fromCoords || !toCoords) continue;

      const dist = distance(
        [fromCoords.lng, fromCoords.lat],
        [toCoords.lng, toCoords.lat],
        { units: 'nauticalmiles' }
      );

      const head = bearing(
        [fromCoords.lng, fromCoords.lat],
        [toCoords.lng, toCoords.lat]
      );

      const speed = parseFloat(from.speed);
      const timeInMinutes = (dist / speed) * 60;
      cumulativeMinutes += timeInMinutes;

      newSegments.push({
        distance: dist,
        heading: head,
        timeInMinutes,
        cumulativeMinutes
      });
  }

    setSegments(newSegments);
  }, [waypoints]);

  return (
    <>
      <div className={cn(
        "relative",
        isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"
      )}>
        <div className={cn(
          "container mx-auto p-4 md:p-6 flex flex-col",
          isFullscreen ? "h-screen" : "min-h-[calc(100vh-4rem)]"
        )}>
      {!isMapScriptLoaded && (
        <Script
          id="google-maps"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          onLoad={() => {
            setIsMapScriptLoaded(true);
            setIsMapReady(true);
          }}
          onError={() => {
            console.error('Google Maps script failed to load');
            toast.error('지도를 불러오는데 실패했습니다.');
          }}
        />
      )}
          {!isFullscreen && <AdBanner />}
          {!isFullscreen && (
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg -mx-4 px-4 py-3 md:-mx-6 md:px-6">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            TDH Card
          </h1>
        </div>
      </div>
          )}

      <Tabs defaultValue="input" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 h-14 rounded-xl bg-slate-100/80 dark:bg-gray-800/50 p-1">
          <TabsTrigger 
            value="input" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800 transition-all"
          >
            <MapPin className="w-4 h-4 mr-2" />
            경로 입력
          </TabsTrigger>
          <TabsTrigger 
            value="view"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800 transition-all"
          >
            <Route className="w-4 h-4 mr-2" />
            경로 확인
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          <Card className="p-6 border-none shadow-lg bg-white/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> 웨이포인트 이름
                  </label>
                  <Input 
                    ref={nameInputRef}
                    placeholder="예: RKPC" 
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onKeyDown={(e) => handleInputKeyDown(e, "name")}
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                    <Navigation className="w-4 h-4" /> 좌표 시스템
                  </label>
                  <Select 
                    value={selectedCoordType}
                    onValueChange={handleCoordinateTypeChange}
                  >
                    <SelectTrigger className="w-full border-gray-200 focus:border-blue-500">
                      <SelectValue>
                        {selectedCoordType === "MGRS" ? "MGRS" : "Latitude/Longitude"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MGRS">MGRS</SelectItem>
                      <SelectItem value="LatLng">Latitude/Longitude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="rounded-xl bg-sky-50/70 p-4 space-y-4">
                  {selectedCoordType === "MGRS" ? (
                    <>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <label className="block text-sm font-medium mb-2 text-gray-700">MGRS 좌표 입력</label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <Input 
                              ref={gridZoneInputRef}
                              placeholder="예: 52S"
                              value={mgrsData.gridZone}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                if (/^[0-9]{0,2}[A-Z]?$/.test(value)) {
                                  setMgrsData(prev => ({
                                    ...prev,
                                    gridZone: value
                                  }));
                                }
                              }}
                              onKeyDown={(e) => handleInputKeyDown(e, "gridZone")}
                              className="border-gray-200 focus:border-blue-500 text-center uppercase"
                              maxLength={3}
                            />
                            <p className="text-xs text-gray-500 mt-1 text-center">Grid Zone</p>
                          </div>
                          <div className="col-span-2">
                            <Input 
                              ref={gridSquareInputRef}
                              placeholder="예: CG1234567890"
                              value={mgrsData.gridCoords}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                if (/^[A-Z]{0,2}[0-9]*$/.test(value)) {
                                  setMgrsData(prev => ({
                                    ...prev,
                                    gridCoords: value
                                  }));
                                }
                              }}
                              className="border-gray-200 focus:border-blue-500 uppercase"
                              maxLength={12}
                            />
                            <p className="text-xs text-gray-500 mt-1 text-center">Grid Coordinates</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <MapPicker
                          mode="MGRS"
                          onLocationSelect={(coords) => {
                            if (coords.mgrs) {
                              // MGRS 좌표를 Grid Zone과 Grid Coordinates로 분리
                              const match = coords.mgrs.match(/^(\d{1,2}[A-Z])([A-Z]{2}\d+)$/);
                              if (match) {
                                const [_, gridZone, gridCoords] = match;
                                setMgrsData({
                                  gridZone,
                                  gridCoords
                                });
                              setFormData({
                                ...formData,
                                coordinates: coords.mgrs,
                                latitude: "",
                                longitude: ""
                              });
                              }
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <Globe className="w-4 h-4" /> Latitude
                            </label>
                            <Input 
                              ref={latitudeInputRef}
                              type="number"
                              step="any"
                              placeholder="예: 37.5665 (북위)"
                              value={formData.latitude}
                              onChange={(e) => handleInputChange("latitude", e.target.value)}
                              onKeyDown={(e) => handleInputKeyDown(e, "latitude")}
                              className="border-gray-200 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <Globe className="w-4 h-4" /> Longitude
                            </label>
                            <Input 
                              ref={longitudeInputRef}
                              type="number"
                              step="any"
                              placeholder="예: 126.9780 (동경)"
                              value={formData.longitude}
                              onChange={(e) => handleInputChange("longitude", e.target.value)}
                              onKeyDown={(e) => handleInputKeyDown(e, "longitude")}
                              className="border-gray-200 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <MapPicker
                          mode="LatLng"
                          onLocationSelect={(coords) => {
                            if (typeof coords.lat === 'number' && typeof coords.lng === 'number') {
                              setFormData({
                                ...formData,
                                coordinates: "",
                                latitude: coords.lat.toFixed(6),
                                longitude: coords.lng.toFixed(6)
                              });
                            }
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                      <Gauge className="w-4 h-4" /> Speed
                    </label>
                    <Input 
                      ref={speedInputRef}
                      type="number" 
                      placeholder="Enter speed"
                      value={formData.speed}
                      onChange={(e) => handleInputChange("speed", e.target.value)}
                      onKeyDown={(e) => handleInputKeyDown(e, "speed")}
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                      <Ruler className="w-4 h-4" /> Unit
                    </label>
                    <Select
                      value={selectedSpeedUnit}
                      onValueChange={handleSpeedUnitChange}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-blue-500">
                        <SelectValue>
                          {selectedSpeedUnit}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KTS">Knots</SelectItem>
                        <SelectItem value="KPH">KPH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className={cn(
                  "w-full flex items-center justify-center gap-2 h-12 text-base",
                  "border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
                  "transition-colors duration-200"
                )}
                onClick={handleAddWaypoint}
              >
                <Plus className="w-5 h-5" />
                {editingIndex !== null ? "Update Waypoint" : "Add Waypoint"}
              </Button>

              {waypoints.length > 0 && (
                <div className="mt-8 space-y-3">
                  <h3 className="font-medium text-lg text-gray-800">Added Waypoints</h3>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto border rounded-xl p-3 bg-gray-50/50">
                    {waypoints.map((waypoint, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <span className="font-medium text-gray-800">{waypoint.name}</span>
                            <span className="text-sm text-gray-500 block md:inline md:ml-2">
                              ({waypoint.coordinateType}: {
                                waypoint.coordinateType === "MGRS" 
                                  ? waypoint.coordinates
                                  : waypoint.coordinates.split(',').map(coord => 
                                      parseFloat(coord).toFixed(4)
                                    ).join(', ')
                              })
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">
                              {waypoint.speed} {waypoint.speedUnit}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => handleEditWaypoint(index)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDeleteWaypoint(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="mt-6">
          <div className="space-y-6">
            <Card className={cn(
              "border-none shadow-lg overflow-hidden transition-all duration-300",
              isFullscreen && "fixed inset-0 z-50 rounded-none"
            )}>
              <div className={cn(
                "relative flex",
                isFullscreen ? "h-screen" : "h-[600px]"
              )}>
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={handleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={handleCurrentLocation}
                  >
                    <Crosshair className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "bg-white/80 backdrop-blur-sm hover:bg-white",
                      isLayerControlVisible && "bg-muted"
                    )}
                    onClick={() => setIsLayerControlVisible(!isLayerControlVisible)}
                  >
                    {isLayerControlVisible ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className={cn(
                  "absolute top-2 right-14 z-10 transition-transform duration-300",
                  isLayerControlVisible ? "translate-x-0" : "translate-x-full opacity-0 pointer-events-none"
                )}>
                  <MapControls
                    settings={mapSettings}
                    onSettingsChange={handleMapSettingsChange}
                  />
                </div>
                <div className="flex-1 relative">
                  {isMapReady && (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={{ lat: 36.5, lng: 127.5 }}
                      zoom={7}
                      options={{
                        mapTypeId: 'terrain',
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                          position: google.maps.ControlPosition.TOP_LEFT,
                        },
                        zoomControl: false,
                        scaleControl: true,
                        streetViewControl: false,
                        fullscreenControl: false,
                      }}
                      onLoad={onMapLoad}
                    >
                          <AirspaceLayers 
                            showAirspaces={mapSettings.showAirspaces} 
                            airspaceAreas={AIRSPACE_AREAS}
                          />

                      {waypoints.map((waypoint, index) => {
                        const coords = waypoint.coordinateType === "MGRS"
                          ? parseCoordinates(waypoint.coordinates, "MGRS")
                          : parseCoordinates(waypoint.coordinates, "LatLng");
                        
                        if (!coords) return null;
                        
                        return (
                          <Marker
                            key={index}
                            position={coords}
                            label={{
                              text: (index + 1).toString(),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        );
                      })}

                      {waypoints.length > 1 && (
                        <Polyline
                          path={waypoints.map(waypoint => {
                            const coords = waypoint.coordinateType === "MGRS"
                              ? parseCoordinates(waypoint.coordinates, "MGRS")
                              : parseCoordinates(waypoint.coordinates, "LatLng");
                            return coords || null;
                          }).filter((coords): coords is Coordinates => coords !== null)}
                          options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                          }}
                        />
                      )}

                      {/* Control Areas */}
                      {mapSettings.showAirspaceReservation && CONTROL_AREAS.map((area, index) => (
                        <Polygon
                          key={index}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#0000FF",
                            fillOpacity: 0.25,
                            strokeColor: "#0000FF",
                            strokeOpacity: 1,
                            strokeWeight: 2,
                          }}
                        />
                      ))}

                      {/* NOTAM Circles */}
                      {notams && notams.length > 0 && mapSettings.showNotams && notams.map((notam) => (
                        <React.Fragment key={notam.id}>
                          {notam.radius && (
                            <Circle
                              center={notam.location}
                              radius={notam.radius * (notam.radiusUnit === 'NM' ? 1852 : 1000)}
                              options={{
                                ...getNotamCircleOptions(notam.series, notam.radius),
                                clickable: true,
                                visible: true
                              }}
                              onLoad={(circle) => {
                                circleRefs.current[notam.id] = circle;
                              }}
                              onUnmount={() => {
                                if (circleRefs.current[notam.id]) {
                                  circleRefs.current[notam.id].setMap(null);
                                  delete circleRefs.current[notam.id];
                                }
                              }}
                              onClick={(e) => {
                                showNotamInfo(notam);
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}

                      {/* Airspace Areas */}
                      {AIRSPACE_AREAS.RESTRICTED.map((area, index) => {
                        const isVisible = mapSettings.showAirspaces.includes('RESTRICTED');
                        
                        if (area.type === 'line') {
                          return (
                            <Polyline
                              key={`restricted-line-${index}`}
                              path={area.coordinates}
                              options={{
                                strokeColor: "#FFA500", // Orange
                                strokeOpacity: isVisible ? 1 : 0,
                                strokeWeight: 1,
                                clickable: isVisible,
                                visible: isVisible
                              }}
                              onClick={() => {
                                if (!isVisible) return;
                                toast.info(
                                  <div className="space-y-2">
                                    <div className="font-bold text-lg">{area.name}</div>
                                    <div className="text-sm">{area.description}</div>
                                  </div>
                                );
                              }}
                            />
                          );
                        }
                        
                        return (
                          <Polygon
                            key={`restricted-${index}`}
                            paths={area.coordinates}
                            options={{
                              fillColor: "#FFA500", // Orange
                              fillOpacity: isVisible ? 0.2 : 0,
                              strokeColor: "#FFA500",
                              strokeOpacity: isVisible ? 1 : 0,
                              strokeWeight: 1,
                              clickable: isVisible,
                              visible: isVisible
                            }}
                            onClick={() => {
                              if (!isVisible) return;
                              toast.info(
                                <div className="space-y-2">
                                  <div className="font-bold text-lg">{area.name}</div>
                                  <div className="text-sm">{area.description}</div>
                                </div>
                              );
                            }}
                          />
                        );
                      })}

                      {mapSettings.showAirspaces.includes('DANGER') && AIRSPACE_AREAS.DANGER.map((area, index) => (
                        <Polygon
                          key={`danger-${index}`}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#FFFF00", // Yellow
                            fillOpacity: 0.2,
                            strokeColor: "#FFFF00",
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            clickable: true
                          }}
                          onClick={() => {
                            toast.info(`Danger Area: ${area.name}`);
                          }}
                        />
                      ))}

                      {mapSettings.showAirspaces.includes('ALERT') && AIRSPACE_AREAS.ALERT.map((area, index) => (
                        <Polygon
                          key={`alert-${index}`}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#00FF00", // Green
                            fillOpacity: 0.2,
                            strokeColor: "#00FF00",
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            clickable: true
                          }}
                          onClick={() => {
                            toast.info(`Alert Area: ${area.name}`);
                          }}
                        />
                      ))}

                      {mapSettings.showAirspaces.includes('MOA') && AIRSPACE_AREAS.MOA.map((area, index) => (
                        <Polygon
                          key={`moa-${index}`}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#0000FF", // Blue
                            fillOpacity: 0.2,
                            strokeColor: "#0000FF",
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            clickable: true
                          }}
                          onClick={() => {
                            toast.info(`Military Operations Area: ${area.name}`);
                          }}
                        />
                      ))}

                      {mapSettings.showAirspaces.includes('UA') && AIRSPACE_AREAS.UA.map((area, index) => (
                        <Polygon
                          key={`ua-${index}`}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#800080", // Purple
                            fillOpacity: 0.2,
                            strokeColor: "#800080",
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            clickable: true
                          }}
                          onClick={() => {
                            toast.info(`UA Area: ${area.name}`);
                          }}
                        />
                      ))}

                      {mapSettings.showAirspaces.includes('ADIZ') && AIRSPACE_AREAS.ADIZ.map((area, index) => (
                        <Polygon
                          key={`adiz-${index}`}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#00FFFF", // Cyan
                            fillOpacity: 0.2,
                            strokeColor: "#00FFFF",
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            clickable: true
                          }}
                          onClick={() => {
                            toast.info(`ADIZ: ${area.name}`);
                          }}
                        />
                      ))}

                      {mapSettings.showAirspaces.includes('FIR') && AIRSPACE_AREAS.FIR.map((area, index) => (
                        <Polygon
                          key={`fir-${index}`}
                          paths={area.coordinates}
                          options={{
                            fillColor: "#FF00FF", // Magenta
                            fillOpacity: 0.2,
                            strokeColor: "#FF00FF",
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            clickable: true
                          }}
                          onClick={() => {
                            toast.info(`FIR: ${area.name}`);
                          }}
                        />
                      ))}

                      {/* Loading indicator for NOTAMs */}
                      {mapSettings.showNotams && notamsLoading && (
                        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                            <span className="text-sm">Loading NOTAMs...</span>
                          </div>
                        </div>
                      )}

                      {/* Airports */}
                          {mapSettings.showAirports && AIRPORT_DATA.map((airport, idx) => (
                        <Marker
                          key={`airport-${airport.id}-${idx}`}
                              position={airport.coordinates}
                              icon={getAirportIcon(airport.type)}
                              onClick={() => showAirportInfo(airport)}
                        />
                      ))}
                    </GoogleMap>
                  )}
                </div>
              </div>
            </Card>

            {/* NOTAM 레이어 설명 */}
                <Accordion type="single" collapsible className="mb-4">
              <AccordionItem value="notam-legend" className="border-none">
                <Card className="overflow-hidden border-none shadow-lg bg-white/50 backdrop-blur-sm rounded-lg">
                      <AccordionTrigger className="px-4 py-2 hover:no-underline">
                        <h3 className="font-medium text-sm text-gray-800">NOTAM 레이어 범례</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <button
                          onClick={() => showNotamSeriesInfo('A', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">A-시리즈</p>
                                <p className="text-xs text-gray-600">공항 시설 및 서비스 관련</p>
                          </div>
                        </button>
                        <button
                          onClick={() => showNotamSeriesInfo('C', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">C-시리즈</p>
                                <p className="text-xs text-gray-600">항행시설 관련</p>
                          </div>
                        </button>
                        <button
                          onClick={() => showNotamSeriesInfo('D', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">D-시리즈</p>
                                <p className="text-xs text-gray-600">공항 제한사항</p>
                          </div>
                        </button>
                        <button
                          onClick={() => showNotamSeriesInfo('E', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-green-600"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">E-시리즈</p>
                                <p className="text-xs text-gray-600">항공교통관제 관련</p>
                          </div>
                        </button>
                        <button
                          onClick={() => showNotamSeriesInfo('G', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">G-시리즈</p>
                                <p className="text-xs text-gray-600">일반 항공정보</p>
                          </div>
                        </button>
                        <button
                          onClick={() => showNotamSeriesInfo('Z', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">Z-시리즈</p>
                                <p className="text-xs text-gray-600">군사작전 관련</p>
                          </div>
                        </button>
                        <button
                          onClick={() => showNotamSeriesInfo('SNOWTAM', notams)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                              <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">SNOWTAM</p>
                                <p className="text-xs text-gray-600">활주로 눈/얼음 상태</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* 공역 레이어 설명 */}
                <Accordion type="single" collapsible className="mb-4">
              <AccordionItem value="airspace-legend" className="border-none">
                <Card className="overflow-hidden border-none shadow-lg bg-white/50 backdrop-blur-sm rounded-lg">
                      <AccordionTrigger className="px-4 py-2 hover:no-underline">
                        <h3 className="font-medium text-sm text-gray-800">공역 레이어 범례</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#800080' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">방공식별구역</p>
                            <p className="text-xs text-gray-600">Air Defense Identification Zone (ADIZ)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#008080' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">비행정보구역</p>
                            <p className="text-xs text-gray-600">Flight Information Region (FIR)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#483D8B' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">관제구</p>
                            <p className="text-xs text-gray-600">Control Area (CTA)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#4B0082' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">접근관제구역</p>
                            <p className="text-xs text-gray-600">Terminal Control Area (TMA)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#8B4513' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">관제권</p>
                            <p className="text-xs text-gray-600">Control Zone (CTR)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#2F4F4F' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">비행장교통구역</p>
                            <p className="text-xs text-gray-600">Aerodrome Traffic Zone (ATZ)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#FF0000' }}></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">금지구역</p>
                                <p className="text-xs text-gray-600">Prohibited Area (P)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#FFA500' }}></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">제한구역</p>
                                <p className="text-xs text-gray-600">Restricted Area (R)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#FF4500' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">위험구역</p>
                            <p className="text-xs text-gray-600">Danger Area (D)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#FFD700' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">경계구역</p>
                            <p className="text-xs text-gray-600">Alert Area (A)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#4169E1' }}></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">군작전구역</p>
                            <p className="text-xs text-gray-600">Military Operations Area (MOA)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#556B2F' }}></div>
                          <div className="text-left">
                            <p className="text-xs font-medium">민간항공훈련구역</p>
                            <p className="text-xs text-gray-600">Civil Aviation Training Area (CATA)</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ background: '#32CD32' }}></div>
                          <div className="text-left">
                                <p className="text-xs font-medium">초경량비행장치구역</p>
                            <p className="text-xs text-gray-600">Ultralight Aircraft Area (UA)</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            <div className="grid gap-6">
              <div className="overflow-hidden border-none shadow-lg bg-white/50 backdrop-blur-sm rounded-lg">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-gray-800">비행계획 요약</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleExportPDF}
                    >
                      <Download className="h-4 w-4" />
                      PDF 내보내기
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div className="text-gray-600 font-medium">총 거리</div>
                    <div className="text-right font-medium text-gray-800">
                      {(() => {
                        let totalDist = 0;
                        for (let i = 0; i < waypoints.length - 1; i++) {
                          const from = waypoints[i];
                          const to = waypoints[i + 1];
                          const fromCoords = from.coordinateType === "MGRS"
                            ? parseCoordinates(from.coordinates, "MGRS")
                            : parseCoordinates(from.coordinates, "LatLng");
                          const toCoords = to.coordinateType === "MGRS"
                            ? parseCoordinates(to.coordinates, "MGRS")
                            : parseCoordinates(to.coordinates, "LatLng");

                          if (fromCoords && toCoords) {
                            totalDist += distance(
                              [fromCoords.lng, fromCoords.lat],
                              [toCoords.lng, toCoords.lat],
                              { units: 'nauticalmiles' }
                            );
                          }
                        }
                        return `${Math.round(totalDist * 10) / 10} NM (${Math.round(totalDist * 1.852 * 10) / 10} km)`;
                      })()}
                    </div>
                    <div className="text-gray-600 font-medium">총 소요 시간</div>
                    <div className="text-right font-medium text-gray-800">
                      {(() => {
                        let totalMinutes = 0;
                        for (let i = 0; i < waypoints.length - 1; i++) {
                          const from = waypoints[i];
                          const to = waypoints[i + 1];
                          const fromCoords = from.coordinateType === "MGRS"
                            ? parseCoordinates(from.coordinates, "MGRS")
                            : parseCoordinates(from.coordinates, "LatLng");
                          const toCoords = to.coordinateType === "MGRS"
                            ? parseCoordinates(to.coordinates, "MGRS")
                            : parseCoordinates(to.coordinates, "LatLng");

                          if (fromCoords && toCoords) {
                            const dist = distance(
                              [fromCoords.lng, fromCoords.lat],
                              [toCoords.lng, toCoords.lat],
                              { units: 'nauticalmiles' }
                            );
                            const speed = parseFloat(from.speed);
                            totalMinutes += (dist / speed) * 60;
                          }
                        }
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = Math.floor(totalMinutes % 60);
                        const seconds = Math.round((totalMinutes % 1) * 60);
                        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden border-none shadow-lg bg-white/50 backdrop-blur-sm rounded-lg">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-gray-800">구간 정보</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleExportKML}
                    >
                      <Download className="h-4 w-4" />
                      KML 내보내기
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto border-t border-gray-100">
                  <div className="min-w-[800px]">
                    <table className="w-full divide-y divide-gray-100 text-sm">
                      <thead>
                        <tr className="text-left bg-gray-50/50">
                          <th className="sticky left-0 py-3 px-6 font-medium text-gray-500 bg-gray-50/50 backdrop-blur-sm z-10">구간</th>
                          <th className="py-3 px-6 font-medium text-gray-500">거리</th>
                          <th className="py-3 px-6 font-medium text-gray-500">방위각</th>
                          <th className="py-3 px-6 font-medium text-gray-500">소요시간</th>
                          <th className="py-3 px-6 font-medium text-gray-500">누적시간</th>
                        </tr>
                      </thead>
                      <tbody>
                        {segments.map((segment: Segment, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <td className="sticky left-0 py-3 px-6 font-medium text-gray-800 bg-white/95 backdrop-blur-sm z-10">
                              {waypoints[index] && waypoints[index + 1] ? 
                                `${waypoints[index].name} → ${waypoints[index + 1].name}` :
                                `구간 ${index + 1}`
                              }
                            </td>
                            <td className="py-3 px-6 text-gray-600">{`${Math.round(segment.distance * 10) / 10} NM (${Math.round(nmToKm(segment.distance) * 10) / 10} km)`}</td>
                            <td className="py-3 px-6 text-gray-600">{formatBearing(segment.heading)}</td>
                            <td className="py-3 px-6 text-gray-600">{formatTime(segment.timeInMinutes)}</td>
                            <td className="py-3 px-6 text-gray-600">{formatTime(segment.cumulativeMinutes)}</td>
                            </tr>
                        ))}
                        {segments.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500">
                              구간 정보가 없습니다
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
      </div>
      {!isFullscreen && <BottomNav />}
      {isFullscreen ? null : <HelpFAB guide={
        <div>
          <b>TDH Calculator 사용법</b>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>웨이포인트 이름, 좌표(MGRS/위경도), 속도를 입력하세요.</li>
            <li>자동으로 거리, ETA, 방위각이 계산됩니다.</li>
            <li>2개 이상 웨이포인트 입력 시 구간별 정보가 표시됩니다.</li>
            <li>지도에서 경로를 시각화할 수 있습니다.</li>
          </ul>
        </div>
      } />}
    </>
  );
} 