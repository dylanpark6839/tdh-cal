'use client';

import { useState } from 'react';
import { WaypointForm } from '@/components/WaypointForm';
import { FlightSettings } from '@/components/FlightSettings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlightPlan, FlightSettings as FlightSettingsType, RouteSegment, Waypoint } from '@/types/flight';
import { bearing, distance } from '@turf/turf';
import { useRouter } from 'next/navigation';
import { MapPin, Route } from "lucide-react";
import Link from "next/link";
import { AdBanner } from '@/components/AdBanner';

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
    <div className="container mx-auto p-6">
      <AdBanner />
      <h1 className="text-3xl font-bold text-center mb-8">Flight Planning Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/waypoints">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center space-y-4">
              <MapPin className="w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Waypoint Input</h2>
                <p className="text-gray-600">Enter waypoints, coordinates, and speed information</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/route">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center space-y-4">
              <Route className="w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Route View</h2>
                <p className="text-gray-600">View route on map and export flight plan</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
