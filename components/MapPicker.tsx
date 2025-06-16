import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { MapPlus, Maximize2, Minimize2 } from 'lucide-react';
const mgrs = require('mgrs');
import { cn } from '@/lib/utils';

interface MapPickerProps {
  onLocationSelect: (coordinates: { lat?: number; lng?: number; mgrs?: string }) => void;
  mode: "MGRS" | "LatLng";
  onCoordinateInput?: (value: string) => void;
}

const defaultCenter = {
  lat: 36.5,
  lng: 127.5
};

export function MapPicker({ onLocationSelect, mode, onCoordinateInput }: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkGoogleMapsLoaded = useCallback(() => {
    return window.google && window.google.maps;
  }, []);

  const loadGoogleMaps = useCallback(async () => {
    if (checkGoogleMapsLoaded()) {
      setIsMapReady(true);
      return;
    }

    setIsLoading(true);
    try {
      // Google Maps 스크립트가 이미 로드되어 있는지 확인
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (!existingScript) {
        // 스크립트 로드
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            setIsMapReady(true);
            resolve();
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      } else {
        setIsMapReady(true);
      }
    } catch (error) {
      console.error('Failed to load Google Maps:', error);
      alert('Google Maps 로드에 실패했습니다. 페이지를 새로고침 해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleButtonClick = async () => {
    if (!isMapReady) {
      await loadGoogleMaps();
    }
    setIsMapVisible(!isMapVisible);
    setIsFullscreen(true);
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });

      // 선택한 위치의 좌표를 입력 필드에 자동으로 입력
      if (onCoordinateInput) {
        if (mode === "MGRS") {
          try {
            const mgrsString = mgrs.forward([lng, lat]);
            onCoordinateInput(mgrsString);
          } catch (error) {
            console.error('MGRS conversion error:', error);
          }
        } else {
          onCoordinateInput(`${lat}, ${lng}`);
        }
      }
    }
  }, [mode, onCoordinateInput]);

  const convertToMGRS = (lat: number, lng: number): string => {
    try {
      // 좌표 범위 체크
      if (lat < -80 || lat > 84) {
        throw new Error('위도는 -80도에서 84도 사이여야 합니다.');
      }
      if (lng < -180 || lng > 180) {
        throw new Error('경도는 -180도에서 180도 사이여야 합니다.');
      }

      console.log('Converting coordinates:', { lat, lng }); // 디버깅용

      // MGRS 변환
      const mgrsString = mgrs.forward([lng, lat]);
      console.log('MGRS result:', mgrsString); // 디버깅용

      if (!mgrsString || typeof mgrsString !== 'string') {
        throw new Error('MGRS 변환 결과가 유효하지 않습니다.');
      }

      return mgrsString;

    } catch (error) {
      console.error('MGRS conversion error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('MGRS 좌표 변환에 실패했습니다. 다른 위치를 선택해주세요.');
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      if (mode === "MGRS") {
        try {
          console.log('Selected location:', selectedLocation); // 디버깅용
          const mgrsString = convertToMGRS(selectedLocation.lat, selectedLocation.lng);
          console.log('Converted MGRS:', mgrsString); // 디버깅용
          onLocationSelect({ mgrs: mgrsString });
          setIsMapVisible(false);
          setIsFullscreen(false);
        } catch (error) {
          console.error('MGRS conversion error in handler:', error);
          if (error instanceof Error) {
            alert(error.message);
          } else {
          alert('MGRS 좌표 변환에 실패했습니다. 다른 위치를 선택해주세요.');
          }
        }
      } else {
        onLocationSelect({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        });
        setIsMapVisible(false);
        setIsFullscreen(false);
      }
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-9"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
            지도 로딩중...
          </div>
        ) : (
          <>
        <MapPlus className="w-4 h-4" />
            지도에서 위치 선택
          </>
        )}
      </Button>

      {isMapVisible && isMapReady && (
        <div className={cn(
          "mt-2",
          isFullscreen && "fixed inset-0 z-50 bg-background"
        )}>
          <div className="relative h-full">
            <GoogleMap
              mapContainerClassName={cn(
                "w-full rounded-lg",
                isFullscreen ? "h-screen" : "h-[300px]"
              )}
              center={selectedLocation || defaultCenter}
              zoom={7}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: true,
                mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: google.maps.ControlPosition.TOP_RIGHT,
                  mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.HYBRID,
                    google.maps.MapTypeId.TERRAIN
                  ]
                },
                fullscreenControl: false,
              }}
            >
              {selectedLocation && (
                <Marker position={selectedLocation} />
              )}
            </GoogleMap>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
            <Button
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
            >
              위치 선택 완료
            </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={handleToggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 