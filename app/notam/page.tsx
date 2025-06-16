'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Copy, CheckCircle2, AlertCircle, Download, Map, Eye, EyeOff } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { AdBanner } from '@/components/AdBanner';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MapControls } from './components/MapControls';
import { 
  Notam, 
  NotamLayer, 
  MapSettings
} from './types';
import Script from 'next/script';
import { Navigation } from "@/components/Navigation";

interface AirportCoordinates {
  [key: string]: { lat: number; lng: number };
}

const AIRPORTS = [
  'RKSI', 'RKSS', 'RKPK', 'RKPC', 'RKPP', 'RKPU', 'RKSM', 'RKTH',
  'RKPD', 'RKTL', 'RKNW', 'RKJK', 'RKJB', 'RKJY', 'RKJJ', 'RKTN',
  'RKTU', 'RKNY'
];

const AIRPORT_COORDINATES: AirportCoordinates = {
  'RKSI': { lat: 37.4692, lng: 126.4505 }, // 인천
  'RKSS': { lat: 37.5587, lng: 126.7945 }, // 김포
  'RKPK': { lat: 35.1795, lng: 128.9380 }, // 김해
  'RKPC': { lat: 33.5113, lng: 126.4930 }, // 제주
  'RKJB': { lat: 35.8714, lng: 127.1197 }, // 전주
  'RKJJ': { lat: 34.8414, lng: 127.6164 }, // 여수
  'RKTH': { lat: 35.9878, lng: 129.4204 }, // 포항
  'RKPD': { lat: 35.8797, lng: 128.6588 }, // 대구
  'RKTU': { lat: 36.7163, lng: 127.4986 }, // 청주
  'RKNY': { lat: 38.0614, lng: 128.6686 }, // 양양
  'RKJK': { lat: 35.9237, lng: 126.6152 }, // 군산
  'RKTN': { lat: 35.8941, lng: 128.6587 }, // 대구(K-2)
  'RKSM': { lat: 37.4458, lng: 127.1139 }, // 성남
  'RKPP': { lat: 35.1708, lng: 128.9364 }, // 김해(K-9)
  'RKTL': { lat: 37.9024, lng: 127.7217 }, // 원주
  'RKPU': { lat: 33.5113, lng: 126.4930 }, // 제주(제2)
  'RKNW': { lat: 37.7533, lng: 126.7764 }  // 수원
};

export default function NotamPage() {
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);
  const [notams, setNotams] = useState<Notam[]>([]);
  const [notamLayers, setNotamLayers] = useState<NotamLayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    showAirports: true,
    showAirspaces: [],
    showFixes: [],
    showRoutes: [],
    showNavaid: false,
    isInternational: true,
    isDomestic: true,
  });

  const [searchParams, setSearchParams] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '0000',
    endTime: '2359',
    series: [] as string[],
    lower: '',
    upper: '',
  });

  const handleSearch = async () => {
    if (selectedAirports.length === 0) {
      setError('하나 이상의 공항을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setNotams([]);

    try {
      // 선택된 모든 공항에 대해 NOTAM 정보를 가져옴
      const notamPromises = selectedAirports.map(airport =>
        fetch(`/api/notam?icao=${airport}`).then(res => res.json())
      );

      const results = await Promise.all(notamPromises);
      const allNotams = results.flatMap(result => {
        if (result.message) {
          // 에러 메시지가 있는 경우 건너뜀
          return [];
        }
        return result.notams || [];
      });

      setNotams(allNotams);
      if (allNotams.length === 0) {
        setError('선택한 공항들의 NOTAM 정보가 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAirportToggle = (airport: string) => {
    setSelectedAirports(prev =>
      prev.includes(airport)
        ? prev.filter(a => a !== airport)
        : [...prev, airport]
    );
  };

  const handleSelectAllAirports = () => {
    setSelectedAirports(AIRPORTS);
  };

  const handleClearSelection = () => {
    setSelectedAirports([]);
    setNotams([]);
    setError('');
  };

  const handleSeriesToggle = (series: string) => {
    setSearchParams(prev => ({
      ...prev,
      series: prev.series.includes(series)
        ? prev.series.filter(s => s !== series)
        : [...prev.series, series]
    }));
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('NOTAM이 클립보드에 복사되었습니다.');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error('클립보드 복사에 실패했습니다.');
    }
  };

  // NOTAM 텍스트 포맷팅
  const formatNotamContent = (notam: Notam) => {
    const rows = [
      { label: 'NOTAM번호', value: notam.notamNo || '-' },
      { label: '비행정보구역', value: '인천비행정보구역(RKRR)' },
      { label: 'QCODE', value: notam.qcode || '-' },
      { label: '비행형식', value: '계기비행(IFR)' },
      { label: '목적', value: '목적수의필요, PBN포함, 항공기운항' },
      { label: '적용범위', value: '비행장' },
    ];

    return `
      <div style="font-family: sans-serif; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="padding: 8px 12px; background: #1e40af; color: white; font-weight: bold; border-top-left-radius: 4px; border-top-right-radius: 4px;">
          ${notam.location}
        </div>
        <div style="padding: 12px;">
          <div style="margin-bottom: 12px; font-family: monospace; white-space: pre-wrap; font-size: 12px; color: #374151;">
            ${notam.text || '-'}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            ${rows.map(row => `
              <tr>
                <td style="padding: 4px 8px; background: #f3f4f6; border: 1px solid #e5e7eb; font-weight: 500; width: 100px;">
                  ${row.label}
                </td>
                <td style="padding: 4px 8px; border: 1px solid #e5e7eb;">
                  ${row.value}
                </td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>
    `;
  };

  const handleExcelDownload = () => {
    try {
      // 엑셀 데이터 준비
      const excelData = notams.map(notam => ({
        'Issue Time': notam.issueTime || '',
        'Location': notam.location || '',
        'NOTAM No': notam.notamNo || '',
        'Q-Code': notam.qcode || '',
        'Start Time': notam.startTime || '',
        'End Time': notam.endTime || '',
        'Full Text': notam.text || ''
      }));

      // 워크북 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // 열 너비 설정
      const colWidths = [
        { wch: 15 }, // Issue Time
        { wch: 10 }, // Location
        { wch: 15 }, // NOTAM No
        { wch: 10 }, // Q-Code
        { wch: 15 }, // Start Time
        { wch: 15 }, // End Time
        { wch: 100 }, // Full Text
      ];
      ws['!cols'] = colWidths;

      // 워크북에 시트 추가
      XLSX.utils.book_append_sheet(wb, ws, 'NOTAM Data');

      // 파일 저장
      const fileName = `NOTAM_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('엑셀 파일이 다운로드되었습니다.');
    } catch (error) {
      toast.error('엑셀 파일 생성 중 오류가 발생했습니다.');
      console.error('Excel download error:', error);
    }
  };

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!isMapScriptLoaded) return;
    if (map) return;

    try {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map element not found');
        return;
      }

      const newMap = new google.maps.Map(mapElement, {
        center: { lat: 36.5, lng: 127.5 },
        zoom: 7,
        mapTypeId: 'terrain',
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        scaleControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(newMap);

      // NOTAM 레이어 생성
      notamLayers.forEach(layer => {
        if (layer.visible && layer.notam.location) {
          const coords = AIRPORT_COORDINATES[layer.notam.location];
          if (coords) {
            const marker = new google.maps.Marker({
              position: coords,
              map: newMap,
              title: layer.notam.location,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }
            });

            const circle = new google.maps.Circle({
              map: newMap,
              center: coords,
              radius: 5000,
              fillColor: '#FF0000',
              fillOpacity: 0.2,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            });

            const infoWindow = new google.maps.InfoWindow({
              content: formatNotamContent(layer.notam),
              maxWidth: 400
            });

            marker.addListener('click', () => {
              infoWindow.open(newMap, marker);
            });

            const layerIndex = notamLayers.findIndex(l => l.id === layer.id);
            if (layerIndex !== -1) {
              setNotamLayers(prev => {
                const updated = [...prev];
                updated[layerIndex] = {
                  ...layer,
                  marker,
                  circle,
                };
                return updated;
              });
            }
          }
        }
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      toast.error('지도를 초기화하는 중 오류가 발생했습니다.');
    }
  }, [isMapScriptLoaded, notamLayers, map]);

  // 지도 스크립트 로드 완료 시 초기화
  useEffect(() => {
    if (isMapScriptLoaded && isMapOpen) {
      // 약간의 지연을 주어 DOM이 완전히 준비되도록 함
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMapScriptLoaded, isMapOpen, initializeMap]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (map) {
        notamLayers.forEach(layer => {
          if (layer.marker) layer.marker.setMap(null);
          if (layer.circle) layer.circle.setMap(null);
        });
        setMap(null);
      }
    };
  }, [map, notamLayers]);

  // 검색 결과를 받았을 때 자동으로 레이어 생성
  useEffect(() => {
    if (notams.length > 0) {
      const layers = notams.map((notam, index) => ({
        id: `${notam.location}-${index}`,
        visible: true,
        notam,
      }));
      setNotamLayers(layers);
    } else {
      setNotamLayers([]);
    }
  }, [notams]);

  const handleMapOpen = () => {
    setIsMapOpen(true);
  };

  return (
    <>
      <Script
        id="google-maps"
        strategy="lazyOnload"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        onLoad={() => setIsMapScriptLoaded(true)}
        onError={() => {
          console.error('Google Maps script failed to load');
          toast.error('지도를 불러오는데 실패했습니다.');
        }}
      />
      <div className="container mx-auto p-4 md:p-6 flex flex-col min-h-[calc(100vh-2rem)]">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg -mx-4 px-4 py-3 md:-mx-6 md:px-6">
          <div className="flex items-center">
            <BackButton />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              항공고시보 검색
            </h1>
          </div>
        </div>

        <Card className="p-6 border-none shadow-lg bg-white/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">공항 선택 (0개 선택됨)</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllAirports}
                  >
                    전체선택
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAirports([])}
                  >
                    선택 초기화
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {AIRPORTS.map((airport) => (
                  <Button
                    key={airport}
                    variant={selectedAirports.includes(airport) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAirportToggle(airport)}
                  >
                    {airport}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">발행 시작일자</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
                    placeholder="YYYY. MM. DD."
                  />
                  <Input
                    type="text"
                    value={searchParams.startTime}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, startTime: e.target.value }))}
                    placeholder="HHMM"
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">발행 종료일자</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
                    placeholder="YYYY. MM. DD."
                  />
                  <Input
                    type="text"
                    value={searchParams.endTime}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, endTime: e.target.value }))}
                    placeholder="HHMM"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">SERIES</h2>
              <div className="flex flex-wrap gap-2">
                {['A', 'C', 'D', 'E', 'G', 'Z', 'SNOWTAM'].map((series) => (
                  <Button
                    key={series}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeriesToggle(series)}
                  >
                    {series}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">LOWER</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={searchParams.lower}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, lower: e.target.value }))}
                    placeholder="000"
                    maxLength={3}
                  />
                  <span className="text-sm font-medium">FL</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">UPPER</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={searchParams.upper}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, upper: e.target.value }))}
                    placeholder="999"
                    maxLength={3}
                  />
                  <span className="text-sm font-medium">FL</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg"
              onClick={handleSearch}
              disabled={loading || selectedAirports.length === 0}
            >
              <Search className="w-5 h-5 mr-2" />
              검색
            </Button>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </Card>

        {/* NOTAM 결과 테이블 */}
        {notams.length > 0 && (
          <Card className="p-4">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExcelDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                엑셀 다운로드
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMapOpen}
              >
                <Map className="h-4 w-4 mr-2" />
                지도보기
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ISSUE TIME</TableHead>
                  <TableHead className="w-[80px]">LOCATION</TableHead>
                  <TableHead className="w-[100px]">NOTAM NO</TableHead>
                  <TableHead className="w-[80px]">QCODE</TableHead>
                  <TableHead className="w-[100px]">START TIME</TableHead>
                  <TableHead className="w-[100px]">END TIME</TableHead>
                  <TableHead>FULL TEXT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notams.map((notam, index) => (
                  <TableRow key={index}>
                    <TableCell>{notam.issueTime || '-'}</TableCell>
                    <TableCell>{notam.location || '-'}</TableCell>
                    <TableCell>{notam.notamNo || '-'}</TableCell>
                    <TableCell>{notam.qcode || '-'}</TableCell>
                    <TableCell>{notam.startTime || '-'}</TableCell>
                    <TableCell>{notam.endTime || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {notam.text}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* 지도 모달 */}
        <Dialog open={isMapOpen} onOpenChange={(open) => {
          setIsMapOpen(open);
          if (!open) {
            setMap(null);
          }
        }}>
          <DialogContent className="max-w-7xl">
            <DialogHeader>
              <DialogTitle>NOTAM 지도</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 h-[800px]">
              <MapControls
                settings={mapSettings}
                onSettingsChange={setMapSettings}
              />
              <div className="flex-1">
                <div id="map" className="w-full h-full rounded-lg" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Navigation />
      </div>
      <AdBanner />
    </>
  );
} 