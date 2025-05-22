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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>구간</TableHead>
              <TableHead>거리</TableHead>
              <TableHead>방위각</TableHead>
              <TableHead className="text-right">소요시간</TableHead>
              <TableHead className="text-right">누적시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              let cumulativeMinutes = 0;
              return flightPlan.segments.map((segment, index) => {
                const timeInMinutes = (segment.distance / flightPlan.settings.speed) * 60;
                cumulativeMinutes += timeInMinutes;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {segment.from.name} → {segment.to.name}
                    </TableCell>
                    <TableCell>
                      {segment.distance.toFixed(1)} NM ({nmToKm(segment.distance).toFixed(1)} km)
                    </TableCell>
                    <TableCell>{formatBearing(segment.heading)}</TableCell>
                    <TableCell className="text-right">{formatTime(timeInMinutes)}</TableCell>
                    <TableCell className="text-right">{formatTime(cumulativeMinutes)}</TableCell>
                  </TableRow>
                );
              });
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 