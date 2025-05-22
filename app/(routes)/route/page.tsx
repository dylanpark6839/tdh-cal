'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RouteMap } from '@/components/RouteMap';
import { RouteTable } from '@/components/RouteTable';
import { BackButton } from '@/components/BackButton';
import { AdBanner } from '@/components/AdBanner';
import { Download, FileDown } from 'lucide-react';
import { FlightPlan } from '@/types/flight';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RouteInfo {
  distance: string;
  bearing: string;
  time: string;
}

interface Waypoint {
  name: string;
  coordinates: string;
}

export default function RoutePage() {
  const [flightPlan, setFlightPlan] = useState<FlightPlan | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const planData = searchParams.get('plan');
    if (planData) {
      try {
        setFlightPlan(JSON.parse(decodeURIComponent(planData)));
      } catch (e) {
        console.error('Failed to parse flight plan:', e);
      }
    }
  }, [searchParams]);

  if (!flightPlan) {
    return <div>Loading...</div>;
  }

  const exportKML = () => {
    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>비행 계획</name>
    <description>
      총 거리: ${flightPlan.totalDistance.toFixed(1)} ${flightPlan.settings.distanceUnit}
      총 소요시간: ${flightPlan.totalTime}
    </description>
    <Style id="routeStyle">
      <LineStyle>
        <color>ff0000ff</color>
        <width>4</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>비행 경로</name>
      <styleUrl>#routeStyle</styleUrl>
      <LineString>
        <coordinates>
          ${flightPlan.waypoints.map(wp => `${wp.coordinates.lng},${wp.coordinates.lat},0`).join(' ')}
        </coordinates>
      </LineString>
    </Placemark>
    ${flightPlan.waypoints.map((wp, index) => `
    <Placemark>
      <name>${wp.name}</name>
      <description>
        웨이포인트 #${index + 1}
        ${wp.coordinateType === 'MGRS' ? `MGRS: ${wp.originalInput}` : `
        위도: ${wp.coordinates.lat}
        경도: ${wp.coordinates.lng}`}
      </description>
      <Point>
        <coordinates>${wp.coordinates.lng},${wp.coordinates.lat},0</coordinates>
      </Point>
    </Placemark>`).join('')}
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flight-plan.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // 제목
    doc.setFontSize(20);
    doc.text('비행 계획서', 105, 20, { align: 'center' });
    
    // 총 정보
    doc.setFontSize(12);
    doc.text(`총 거리: ${flightPlan.totalDistance.toFixed(1)} ${flightPlan.settings.distanceUnit}`, 20, 40);
    doc.text(`총 소요시간: ${flightPlan.totalTime}`, 20, 50);
    doc.text(`비행 속도: ${flightPlan.settings.speed} ${flightPlan.settings.speedUnit}`, 20, 60);

    // 웨이포인트 테이블
    const waypointHeaders = [['#', '이름', '좌표 형식', '좌표']];
    const waypointData = flightPlan.waypoints.map((wp, index) => [
      (index + 1).toString(),
      wp.name,
      wp.coordinateType,
      wp.coordinateType === 'MGRS' ? 
        wp.originalInput : 
        `${wp.coordinates.lat.toFixed(4)}, ${wp.coordinates.lng.toFixed(4)}`
    ]);

    autoTable(doc, {
      head: waypointHeaders,
      body: waypointData,
      startY: 70,
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
      margin: { top: 70 }
    });

    // 구간 정보 테이블
    const segmentHeaders = [['구간', '출발', '도착', '거리', '방위각', '소요시간']];
    const segmentData = flightPlan.segments.map((segment, index) => [
      (index + 1).toString(),
      segment.from.name,
      segment.to.name,
      `${segment.distance.toFixed(1)} ${flightPlan.settings.distanceUnit}`,
      `${Math.round(segment.heading)}°`,
      segment.eta
    ]);

    const firstTableHeight = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      head: segmentHeaders,
      body: segmentData,
      startY: firstTableHeight + 20,
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    // 파일 저장
    doc.save('flight-plan.pdf');
  };

  return (
    <div className="container mx-auto p-6">
      <AdBanner />
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold">Flight Plan - Route</h1>
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

          <div className="flex gap-2">
            <Button 
              className="flex-1 flex items-center gap-2"
              onClick={exportPDF}
            >
              <FileDown className="w-4 h-4" />
              Export PDF
            </Button>
            <Button 
              className="flex-1 flex items-center gap-2" 
              variant="outline"
              onClick={exportKML}
            >
              <Download className="w-4 h-4" />
              Export KML
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 