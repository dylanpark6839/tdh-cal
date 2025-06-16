'use client';

import { Airport } from '../types';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AirportInfoCardProps {
  airport: Airport;
}

export function AirportInfoCard({ airport }: AirportInfoCardProps) {
  const getAirportTypeText = (type: Airport['type']) => {
    const types = {
      military: '군용',
      civilian: '민간',
      army: '육군',
      navy: '해군',
      airforce: '공군',
      us_military: '미군'
    };
    return types[type];
  };

  return (
    <Card className="w-[280px] sm:w-[320px] md:w-[360px] bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="p-3 sm:p-4 space-y-3">
        {/* 공항 기본 정보 */}
        <div className="border-b pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">{airport.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{airport.icao}</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {getAirportTypeText(airport.type)}
            </span>
          </div>
        </div>

        {/* 관제 주파수 정보 */}
        {airport.frequencies && (
          <div className="space-y-1.5">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700">관제 주파수</h4>
            <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
              {airport.frequencies.atis && (
                <div className="space-y-0.5">
                  <p className="text-gray-600">ATIS</p>
                  <p className="font-mono">{airport.frequencies.atis}</p>
                </div>
              )}
              {airport.frequencies.approach && (
                <div className="space-y-0.5">
                  <p className="text-gray-600">APP</p>
                  <p className="font-mono">{airport.frequencies.approach}</p>
                </div>
              )}
              {airport.frequencies.tower && (
                <div className="space-y-0.5">
                  <p className="text-gray-600">TWR</p>
                  <p className="font-mono">{airport.frequencies.tower}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 표고 정보 */}
        {airport.elevation && (
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700">표고</h4>
            <p className="text-xs sm:text-sm font-mono">{airport.elevation} ft</p>
          </div>
        )}

        {/* 활주로 정보 */}
        {airport.runways && airport.runways.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700">활주로</h4>
            <div className="grid grid-cols-2 gap-2">
              {airport.runways.map((runway, index) => (
                <div key={`${airport.icao}-runway-${index}-${runway.direction}`} className="text-xs sm:text-sm space-y-0.5">
                  <p className="font-mono">{runway.direction}</p>
                  {runway.length && (
                    <p className="text-gray-600">{runway.length}m</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AIP 링크 */}
        {airport.aip_link && (
          <div className="pt-1.5">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs sm:text-sm h-8"
              onClick={() => window.open(airport.aip_link, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              AIP 보기
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 