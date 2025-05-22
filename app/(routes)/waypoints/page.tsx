'use client';

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
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toPoint } from 'mgrs';
import { bearing, distance } from '@turf/turf';
import { FlightPlan, FlightSettings, RouteSegment } from '@/types/flight';

interface WaypointInput {
  name: string;
  coordinates: string;
  coordinateType: "MGRS" | "LatLng";
  speed: string;
  speedUnit: "KTS" | "KPH";
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function WaypointsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<WaypointInput>({
    name: "",
    coordinates: "",
    coordinateType: "MGRS",
    speed: "",
    speedUnit: "KTS",
  });

  const [waypoints, setWaypoints] = useState<WaypointInput[]>([]);
  const [selectedCoordType, setSelectedCoordType] = useState<"MGRS" | "LatLng">("MGRS");
  const [selectedSpeedUnit, setSelectedSpeedUnit] = useState<"KTS" | "KPH">("KTS");

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
      coordinates: "" // Reset coordinates when type changes
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

  const handleAddWaypoint = () => {
    if (!formData.name || !formData.coordinates || !formData.speed) {
      alert("Please fill in all fields");
      return;
    }

    const coordinates = parseCoordinates(formData.coordinates, formData.coordinateType);
    if (!coordinates) {
      alert("Invalid coordinates format");
      return;
    }

    setWaypoints(prev => [...prev, formData]);
    
    // Reset form
    setFormData({
      name: "",
      coordinates: "",
      coordinateType: formData.coordinateType,
      speed: "",
      speedUnit: formData.speedUnit,
    });
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

      const heading = bearing(
        [from.coordinates.lng, from.coordinates.lat],
        [to.coordinates.lng, to.coordinates.lat]
      );

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
      totalTime
    };

    const planData = encodeURIComponent(JSON.stringify(flightPlan));
    router.push(`/route?plan=${planData}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen flex flex-col pb-24">
      <AdBanner />
      <div className="flex items-center mb-4 md:mb-6">
        <BackButton />
        <h1 className="text-xl md:text-2xl font-bold">Flight Plan - Waypoints</h1>
      </div>
      
      <Card className="p-4 md:p-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Waypoint Name</label>
              <Input 
                placeholder="Enter waypoint name" 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Coordinate Type</label>
              <Select 
                value={selectedCoordType}
                onValueChange={handleCoordinateTypeChange}
              >
                <SelectTrigger className="w-full">
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
            
            <div>
              <label className="block text-sm font-medium mb-1">Coordinates</label>
              <Input 
                placeholder={selectedCoordType === "MGRS" ? 
                  "Enter MGRS coordinates (e.g. 52SBE7410034100)" : 
                  "Enter Lat/Long coordinates (e.g. 37.5665, 126.9780)"}
                value={formData.coordinates}
                onChange={(e) => handleInputChange("coordinates", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Speed</label>
                <Input 
                  type="number" 
                  placeholder="Enter speed"
                  value={formData.speed}
                  onChange={(e) => handleInputChange("speed", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <Select
                  value={selectedSpeedUnit}
                  onValueChange={handleSpeedUnitChange}
                >
                  <SelectTrigger className="w-full">
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

          {waypoints.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Added Waypoints</h3>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto border rounded-md p-2">
                {waypoints.map((waypoint, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                      <div>
                        <span className="font-medium">{waypoint.name}</span>
                        <span className="text-sm text-gray-500 block md:inline md:ml-2">
                          ({waypoint.coordinateType}: {waypoint.coordinates})
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {waypoint.speed} {waypoint.speedUnit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2 pt-4 sticky bottom-0 bg-white">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 order-2 md:order-1"
              onClick={handleAddWaypoint}
            >
              <Plus className="w-4 h-4" />
              Add Waypoint
            </Button>
            
            <Button 
              className="order-1 md:order-2"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 