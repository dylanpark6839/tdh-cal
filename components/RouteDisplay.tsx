"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as turf from "@turf/turf";
import { Clock, Navigation2, Route } from "lucide-react";
import mgrs from "mgrs";

interface RouteDisplayProps {
  waypoints: Array<{
    name: string;
    coordinates: {
      lat?: number;
      lng?: number;
      mgrs?: string;
    };
    speed: {
      value: number;
      unit: "kt" | "kmh";
    };
  }>;
}

interface RouteSegment {
  from: string;
  to: string;
  distance: number;
  heading: number;
  eta: string;
}

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.75rem",
};

const center = {
  lat: 36.5,
  lng: 127.5,
};

const mapOptions = {
  styles: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
    },
  ],
};

export function RouteDisplay({ waypoints }: RouteDisplayProps) {
  const [segments, setSegments] = useState<RouteSegment[]>([]);
  const [totalTime, setTotalTime] = useState<string>("00:00");
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [mapError, setMapError] = useState<string | null>(null);

  const mgrsToLatLng = (mgrsString: string): { lat: number; lng: number } | null => {
    if (!mgrsString) return null;
    
    try {
      // MGRS 문자열에서 공백 제거
      const cleanMgrs = mgrsString.replace(/\s+/g, '');
      const [lng, lat] = mgrs.toPoint(cleanMgrs);
      return { lat, lng };
    } catch (error) {
      console.error("MGRS conversion error:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Received waypoints:", waypoints);

    if (waypoints.length < 2) {
      setSegments([]);
      setTotalTime("00:00");
      setTotalDistance(0);
      return;
    }

    try {
      const newSegments: RouteSegment[] = [];
      let totalTimeMinutes = 0;
      let totalDist = 0;

      for (let i = 0; i < waypoints.length - 1; i++) {
        const from = waypoints[i];
        const to = waypoints[i + 1];

        console.log(`Processing segment ${i}:`, { from, to });

        let fromCoords = from.coordinates.lat && from.coordinates.lng
          ? { lat: from.coordinates.lat, lng: from.coordinates.lng }
          : from.coordinates.mgrs
          ? mgrsToLatLng(from.coordinates.mgrs)
          : null;

        let toCoords = to.coordinates.lat && to.coordinates.lng
          ? { lat: to.coordinates.lat, lng: to.coordinates.lng }
          : to.coordinates.mgrs
          ? mgrsToLatLng(to.coordinates.mgrs)
          : null;

        if (!fromCoords || !toCoords) {
          console.error("Invalid coordinates:", { from: from.coordinates, to: to.coordinates });
          continue;
        }

        console.log("Valid coordinates:", { fromCoords, toCoords });

        // Create Turf points for calculations
        const fromPoint = turf.point([fromCoords.lng, fromCoords.lat]);
        const toPoint = turf.point([toCoords.lng, toCoords.lat]);
        
        // Calculate distance in kilometers
        const distance = turf.distance(fromPoint, toPoint);
        
        // Calculate bearing (initial heading)
        const bearing = turf.bearing(fromPoint, toPoint);
        
        // Convert speed to km/h if needed
        const speedKmh = from.speed.unit === "kt" 
          ? from.speed.value * 1.852  // Convert knots to km/h
          : from.speed.value;

        if (speedKmh > 0) {
          const timeHours = distance / speedKmh;
          const timeMinutes = timeHours * 60;
          
          totalTimeMinutes += timeMinutes;
          totalDist += distance;
          
          newSegments.push({
            from: from.name,
            to: to.name,
            distance: Math.round(distance * 10) / 10,
            heading: Math.round(bearing),
            eta: formatTime(timeMinutes),
          });
        }
      }

      setSegments(newSegments);
      setTotalTime(formatTime(totalTimeMinutes));
      setTotalDistance(Math.round(totalDist * 10) / 10);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [waypoints]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const path = waypoints
    .filter((wp) => {
      const coords = wp.coordinates.lat && wp.coordinates.lng
        ? { lat: wp.coordinates.lat, lng: wp.coordinates.lng }
        : wp.coordinates.mgrs
        ? mgrsToLatLng(wp.coordinates.mgrs)
        : null;
      return coords !== null;
    })
    .map((wp) => {
      if (wp.coordinates.lat && wp.coordinates.lng) {
        return { lat: wp.coordinates.lat, lng: wp.coordinates.lng };
      }
      const coords = mgrsToLatLng(wp.coordinates.mgrs!);
      return coords!;
    });

  const mapCenter = path.length > 0 
    ? {
        lat: path.reduce((sum, pos) => sum + pos.lat, 0) / path.length,
        lng: path.reduce((sum, pos) => sum + pos.lng, 0) / path.length,
      }
    : { lat: 36.5, lng: 127.5 };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-center">
        <p>Google Maps API 키가 설정되지 않았습니다.</p>
        <p className="text-sm mt-2">환경 변수 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 .env.local 파일에 설정해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border-2 border-sky-100 dark:border-gray-700">
        <LoadScript 
          googleMapsApiKey={googleMapsApiKey}
          onError={(error: Error) => {
            console.error("Google Maps API 로드 오류:", error);
            setMapError("Google Maps API 키가 유효하지 않거나 API 사용량이 초과되었습니다.");
          }}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={path.length > 0 ? 7 : 7}
            options={mapOptions}
            onLoad={() => {
              console.log("Google Maps 로드 완료");
            }}
          >
            {path.map((position, index) => (
              <Marker
                key={index}
                position={position}
                label={{
                  text: (index + 1).toString(),
                  className: "font-bold",
                }}
              />
            ))}
            {path.length > 1 && (
              <Polyline
                path={path}
                options={{
                  strokeColor: "#0EA5E9",
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {mapError && (
        <div className="text-red-500 text-center p-2">
          {mapError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-sky-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
          <Route className="w-5 h-5 text-sky-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">총 거리</div>
            <div className="font-semibold">
              {totalDistance} km
            </div>
          </div>
        </div>
        <div className="p-4 bg-sky-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
          <Navigation2 className="w-5 h-5 text-sky-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">웨이포인트</div>
            <div className="font-semibold">{waypoints.length} 개</div>
          </div>
        </div>
        <div className="p-4 bg-sky-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-sky-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">총 비행시간</div>
            <div className="font-semibold">{totalTime}</div>
          </div>
        </div>
      </div>

      {segments.length > 0 && (
        <div className="rounded-lg border-2 border-sky-100 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-sky-50 dark:bg-gray-800/50">
                <TableHead>출발</TableHead>
                <TableHead>도착</TableHead>
                <TableHead>거리 (km)</TableHead>
                <TableHead>방위각</TableHead>
                <TableHead>소요시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{segment.from}</TableCell>
                  <TableCell className="font-medium">{segment.to}</TableCell>
                  <TableCell>{segment.distance}</TableCell>
                  <TableCell>{segment.heading}°</TableCell>
                  <TableCell>{segment.eta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 