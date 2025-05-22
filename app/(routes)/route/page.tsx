'use client';

import { Suspense, useEffect, useState } from "react";
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
import { FlightPlan } from '@/types/flight';
import { toast } from "sonner";

// 한글 폰트 정의
const koreanFont = {
  normal: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2107@1.1/Pretendard-Regular.woff',
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.round((minutes % 1) * 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
};

function RouteContent() {
  const [flightPlan, setFlightPlan] = useState<FlightPlan | null>(null);
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const routeData = searchParams.get('plan');
    if (routeData) {
      try {
        const decodedData = decodeURIComponent(routeData);
        setFlightPlan(JSON.parse(decodedData));
      } catch (error) {
        console.error('Error parsing flight plan:', error);
        toast.error('경로 정보를 불러오는데 실패했습니다.');
      }
    }
  }, [searchParams]);

  if (!flightPlan) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">경로 정보가 없습니다.</p>
      </div>
    );
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const doc = new jsPDF();
      
      // 기본 설정
      doc.setFont('helvetica');
      doc.setFontSize(20);
      
      // 제목
      doc.text('Flight Plan', 105, 15, { align: 'center' });
      
      // 비행계획 요약
      doc.setFontSize(14);
      doc.text('Summary', 14, 30);
      
      const summaryData = [
        ['Total Distance', `${flightPlan.totalDistance.toFixed(1)} NM`],
        ['Total Time', flightPlan.totalTime],
      ];
      
      autoTable(doc, {
        body: summaryData,
        startY: 35,
        theme: 'plain',
        styles: { fontSize: 12 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 60 }
        }
      });

      // Get the Y position after the summary table
      const lastY = (doc as any).lastAutoTable.finalY + 20;

      // 구간 정보
      doc.setFontSize(14);
      doc.text('Route Details', 14, lastY);

      let cumulativeMinutes = 0;
      const segmentData = flightPlan.segments.map((segment) => {
        const timeInMinutes = (segment.distance / flightPlan.settings.speed) * 60;
        cumulativeMinutes += timeInMinutes;

        return [
          `${segment.from.name} → ${segment.to.name}`,
          `${segment.distance.toFixed(1)} NM`,
          `${segment.heading.toFixed(0)}°`,
          formatTime(timeInMinutes),
          formatTime(cumulativeMinutes)
        ];
      });

      autoTable(doc, {
        head: [['Segment', 'Distance', 'Heading', 'Time', 'Total Time']],
        body: segmentData,
        startY: lastY + 5,
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 }
        }
      });
      
      // PDF 저장
      doc.save('flight-plan.pdf');
      toast.success('PDF 파일이 생성되었습니다.');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
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
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={isExporting || !flightPlan}
          >
            {isExporting ? 'PDF 생성 중...' : 'PDF 내보내기'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportKML}
            disabled={!flightPlan}
          >
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