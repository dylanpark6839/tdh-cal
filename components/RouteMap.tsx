import { useEffect, useRef, useState } from 'react';
import { Waypoint } from '@/types/flight';
import { Button } from './ui/button';
import { LayersIcon } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { AirspaceLayers } from '@/app/(routes)/waypoints/components/AirspaceLayers';
import { AIRSPACE_AREAS } from '@/app/(routes)/waypoints/components/airspaces';
import { AirspaceType, MapControls, MapSettings, DEFAULT_SETTINGS } from './MapControls';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';

interface RouteMapProps {
  waypoints: Waypoint[];
}

export function RouteMap({ waypoints }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [settings, setSettings] = useState<MapSettings>(DEFAULT_SETTINGS);
  const isGoogleMapsLoaded = useGoogleMaps();

  // TMA 데이터가 로드되었는지 확인
  useEffect(() => {
    console.log('TMA Data:', AIRSPACE_AREAS.TMA);
  }, []);

  const onMapLoad = (map: google.maps.Map) => {
    mapInstanceRef.current = map;
    console.log('Map initialized:', map);

    // 초기 뷰포트 설정
    const bounds = new window.google.maps.LatLngBounds();

    // 경로가 있는 경우 경로를 기준으로 뷰포트 설정
    if (waypoints.length > 0) {
      const path = waypoints.map(wp => ({
        lat: wp.coordinates.lat,
        lng: wp.coordinates.lng
      }));

      // 경로 그리기
      new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
      });

      // 마커 추가
      waypoints.forEach((wp, index) => {
        const position = { lat: wp.coordinates.lat, lng: wp.coordinates.lng };
        new window.google.maps.Marker({
          position,
          map,
          title: wp.name,
          label: (index + 1).toString()
        });
        bounds.extend(position);
      });
    } else {
      // 경로가 없는 경우 한반도 중심으로 뷰포트 설정
      bounds.extend({ lat: 35.5, lng: 127.5 });
      bounds.extend({ lat: 38.5, lng: 129.5 });
    }

    // 뷰포트 적용
    map.fitBounds(bounds);
  };

  // settings 상태가 변경될 때마다 실행
  useEffect(() => {
    console.log('Current settings:', settings);
    if (settings.showAirspaces.includes('TMA')) {
      console.log('TMA areas to be rendered:', AIRSPACE_AREAS.TMA);
    }
  }, [settings]);

  // 초기 중심점 설정
  const initialCenter = waypoints.length > 0
    ? { lat: waypoints[0].coordinates.lat, lng: waypoints[0].coordinates.lng }
    : { lat: 37.5665, lng: 126.9780 }; // 서울 중심점

  return (
    <div className="relative w-full h-[500px]">
      {isGoogleMapsLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={initialCenter}
          zoom={7}
          options={{
            mapTypeId: 'terrain',
            mapTypeControl: true,
            mapTypeControlOptions: {
              position: google.maps.ControlPosition.TOP_LEFT,
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
            },
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scaleControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: google.maps.ControlPosition.RIGHT_TOP
            }
          }}
          onLoad={onMapLoad}
        >
          {settings.showAirspaces.length > 0 && (
            <AirspaceLayers
              key={settings.showAirspaces.join(',')} // 공역 선택이 변경될 때마다 컴포넌트 리렌더링
              showAirspaces={settings.showAirspaces}
              airspaceAreas={AIRSPACE_AREAS}
            />
          )}
        </GoogleMap>
      )}
      <div className="absolute top-4 right-4 z-10">
        <MapControls
          settings={settings}
          onSettingsChange={setSettings}
        />
      </div>
    </div>
  );
} 