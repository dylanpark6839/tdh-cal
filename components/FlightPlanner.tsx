"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaypointInput } from "./WaypointInput";
import { RouteDisplay } from "./RouteDisplay";
import { Button } from "./ui/button";
import { Download, PlaneLanding, PlaneTakeoff, Trash2 } from "lucide-react";

interface Waypoint {
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
}

export function FlightPlanner() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [coordinateSystem, setCoordinateSystem] = useState<"latLng" | "mgrs">("latLng");

  const addWaypoint = (waypoint: Waypoint) => {
    setWaypoints([...waypoints, waypoint]);
  };

  const resetWaypoints = () => {
    setWaypoints([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 rounded-xl bg-sky-50 dark:bg-gray-800/50 p-1">
          <TabsTrigger 
            value="input" 
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all"
          >
            <PlaneTakeoff className="w-4 h-4 mr-2" />
            경로 입력
          </TabsTrigger>
          <TabsTrigger 
            value="output"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all"
          >
            <PlaneLanding className="w-4 h-4 mr-2" />
            경로 확인
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <Card className="border-2 border-sky-100 dark:border-gray-700">
            <div className="p-6">
              <WaypointInput
                onAdd={addWaypoint}
                coordinateSystem={coordinateSystem}
                onCoordinateSystemChange={setCoordinateSystem}
              />
              <div className="mt-4">
                <Button 
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={resetWaypoints}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  경로 초기화
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="output">
          <Card className="border-2 border-sky-100 dark:border-gray-700">
            <div className="p-6">
              <RouteDisplay waypoints={waypoints} />
              <div className="flex gap-3 mt-6">
                <Button 
                  className="flex-1 bg-sky-500 hover:bg-sky-600"
                  onClick={() => {/* PDF 생성 및 다운로드 */}}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF 다운로드
                </Button>
                <Button 
                  className="flex-1 bg-sky-500 hover:bg-sky-600"
                  onClick={() => {/* KML 생성 및 다운로드 */}}
                >
                  <Download className="mr-2 h-4 w-4" />
                  KML 다운로드
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 