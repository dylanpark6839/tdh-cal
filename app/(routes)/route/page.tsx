'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RouteMap } from "@/components/RouteMap";
import { RouteTable } from "@/components/RouteTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { AdBanner } from '@/components/AdBanner';
import { saveAs } from 'file-saver';
import { tokml } from '@maphubs/tokml';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';

interface FlightPlan {
  waypoints: Array<{
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
  settings: {
    speed: number;
    unit: string;
  };
}

function RouteContent() {
  const [flightPlan, setFlightPlan] = useState<FlightPlan | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const routeData = searchParams.get('route');
    if (routeData) {
      setFlightPlan(JSON.parse(routeData));
    }
  }, [searchParams]);

  if (!flightPlan) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">경로 정보가 없습니다.</p>
      </div>
    );
  }

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // 제목 추가
    doc.setFontSize(20);
    doc.text('비행 계획서', 105, 15, { align: 'center' });
    
    // 경로 정보 테이블
    const tableData = flightPlan.waypoints.map((wp, index) => [
      wp.name,
      `${wp.coordinates.lat.toFixed(6)}, ${wp.coordinates.lng.toFixed(6)}`,
    ]);
    
    autoTable(doc, {
      head: [['Waypoint', 'Coordinates']],
      body: tableData,
      startY: 25,
    });
    
    // PDF 저장
    doc.save('flight-plan.pdf');
  };

  const handleExportKML = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: flightPlan.waypoints.map(wp => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [wp.coordinates.lng, wp.coordinates.lat]
        },
        properties: {
          name: wp.name
        }
      }))
    };

    const kml = tokml(geojson);
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    saveAs(blob, 'flight-plan.kml');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            PDF 내보내기
          </Button>
          <Button variant="outline" onClick={handleExportKML}>
            KML 내보내기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <RouteMap waypoints={flightPlan.waypoints} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <RouteTable flightPlan={flightPlan} />
          </Card>
        </div>
      </div>

      <AdBanner />
    </div>
  );
}

export default function RoutePage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">경로 정보를 불러오는 중...</p>
        </div>
      }>
        <RouteContent />
      </Suspense>
    </div>
  );
} 