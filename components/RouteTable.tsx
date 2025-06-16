import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlightPlan } from "@/types/flight";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RouteTableProps {
  flightPlan: FlightPlan;
}

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

const formatBearing = (bearing: number): string => {
  // 방위각을 0-360 범위로 정규화
  const normalizedBearing = ((bearing % 360) + 360) % 360;
  return `${normalizedBearing.toFixed(0)}°`;
};

const nmToKm = (nm: number): number => {
  return nm * 1.852;
};

export function RouteTable({ flightPlan }: RouteTableProps) {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
      setShowScrollHint(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">비행 계획 요약</h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">총 거리</TableCell>
              <TableCell className="text-right">
                {flightPlan.totalDistance.toFixed(1)} NM ({nmToKm(flightPlan.totalDistance).toFixed(1)} km)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">총 소요 시간</TableCell>
              <TableCell className="text-right">{flightPlan.totalTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">구간 정보</h2>
        <div className="relative rounded-lg border border-gray-200">
          {showScrollHint && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-scroll-hint" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
                <MoveHorizontal className="h-5 w-5 text-blue-500 animate-bounce" />
                <span className="text-sm text-gray-600 whitespace-nowrap">옆으로 스크롤하여 더 보기</span>
              </div>
            </div>
          )}

          <div 
            ref={scrollContainerRef}
            className="overflow-x-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
            onScroll={handleScroll}
          >
            <div className="min-w-[800px] p-1">
        <Table>
          <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-[200px] whitespace-nowrap font-semibold">구간</TableHead>
                    <TableHead className="w-[200px] whitespace-nowrap font-semibold">거리</TableHead>
                    <TableHead className="w-[150px] whitespace-nowrap font-semibold">방위각</TableHead>
                    <TableHead className="w-[150px] text-right whitespace-nowrap font-semibold">소요시간</TableHead>
                    <TableHead className="w-[150px] text-right whitespace-nowrap font-semibold">누적시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              let cumulativeMinutes = 0;
              return flightPlan.segments.map((segment, index) => {
                const timeInMinutes = (segment.distance / flightPlan.settings.speed) * 60;
                cumulativeMinutes += timeInMinutes;
                
                return (
                        <TableRow 
                          key={index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="w-[200px] font-medium whitespace-nowrap">
                      {segment.from.name} → {segment.to.name}
                    </TableCell>
                          <TableCell className="w-[200px] whitespace-nowrap">
                      {segment.distance.toFixed(1)} NM ({nmToKm(segment.distance).toFixed(1)} km)
                    </TableCell>
                          <TableCell className="w-[150px] whitespace-nowrap">{formatBearing(segment.heading)}</TableCell>
                          <TableCell className="w-[150px] text-right whitespace-nowrap">{formatTime(timeInMinutes)}</TableCell>
                          <TableCell className="w-[150px] text-right whitespace-nowrap">{formatTime(cumulativeMinutes)}</TableCell>
                  </TableRow>
                );
              });
            })()}
                  {flightPlan.segments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                        구간 정보가 없습니다
                      </TableCell>
                    </TableRow>
                  )}
          </TableBody>
        </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 