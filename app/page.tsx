'use client';

import { useState } from 'react';
import { WaypointForm } from '@/components/WaypointForm';
import { FlightSettings } from '@/components/FlightSettings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlightPlan, FlightSettings as FlightSettingsType, RouteSegment, Waypoint } from '@/types/flight';
import bearing from '@turf/bearing';
import distance from '@turf/distance';
import { useRouter } from 'next/navigation';
import { MapPin, Route, AlertCircle, Cloud } from "lucide-react";
import Link from "next/link";
import { AdBanner } from '@/components/AdBanner';
import { Navigation } from '@/components/Navigation';

export default function HomePage() {
  const router = useRouter();
  const [flightPlan, setFlightPlan] = useState<FlightPlan>({
    waypoints: [],
    settings: {
    speed: 0,
    speedUnit: 'kt',
      distanceUnit: 'NM'
    },
    totalDistance: 0,
    totalTime: '0분',
    segments: []
  });

  const calculateRoute = (waypoints: Waypoint[], settings: FlightSettingsType) => {
    const segments: RouteSegment[] = [];
    let totalDist = 0;
    let totalTimeMinutes = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      
      const dist = distance(
        [from.coordinates.lng, from.coordinates.lat],
        [to.coordinates.lng, to.coordinates.lat],
        { units: settings.distanceUnit === 'NM' ? 'nauticalmiles' : 'kilometers' }
      );

      const heading = bearing(
        [from.coordinates.lng, from.coordinates.lat],
        [to.coordinates.lng, to.coordinates.lat]
      );

      const timeMinutes = settings.speed > 0 ? (dist / settings.speed) * 60 : 0;
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

    return {
      segments,
      totalDistance: totalDist,
      totalTime
    };
  };

  const handleWaypointSubmit = (waypoint: Waypoint) => {
    const newWaypoints = [...flightPlan.waypoints, waypoint];
    const { segments, totalDistance, totalTime } = calculateRoute(newWaypoints, flightPlan.settings);
    
    setFlightPlan({
      ...flightPlan,
      waypoints: newWaypoints,
      segments,
      totalDistance,
      totalTime
    });
  };

  const handleSettingsSubmit = (settings: FlightSettingsType) => {
    const { segments, totalDistance, totalTime } = calculateRoute(flightPlan.waypoints, settings);
    
    setFlightPlan({
      ...flightPlan,
      settings,
      segments,
      totalDistance,
      totalTime
    });
  };

  const handleCalculate = () => {
    if (flightPlan.waypoints.length < 2) {
      alert('최소 2개의 웨이포인트가 필요합니다.');
      return;
    }

    if (flightPlan.settings.speed <= 0) {
      alert('속도를 입력해주세요.');
      return;
    }

    const planData = encodeURIComponent(JSON.stringify(flightPlan));
    router.push(`/route?plan=${planData}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 flex flex-col min-h-[calc(100vh-2rem)]">
      <AdBanner />
      <div className="flex-1 container mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Flight Planning Tool
        </h1>
      
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          <Link href="/waypoints">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all hover:border-blue-500 hover:shadow-lg shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors shadow-inner">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">TDH Calculator</h2>
                    <p className="mt-2 text-gray-600">-Time, Distance, Heading-</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/weather">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all hover:border-blue-500 hover:shadow-lg shadow-md cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors shadow-inner">
                    <Cloud className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800 group-hover:text-blue-600 transition-colors">기상 확인</h2>
                    <p className="mt-2 text-blue-600">-METAR/TAF Information-</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all hover:border-blue-500 hover:shadow-lg shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors shadow-inner">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-400">NOTAM 확인</h2>
                  <p className="mt-2 text-gray-400">-Notice To Air Missions-</p>
                  <p className="mt-2 text-sm text-gray-400">(서비스 준비중)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
