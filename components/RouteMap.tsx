import { useEffect, useRef } from 'react';
import { Waypoint } from '@/types/flight';

interface RouteMapProps {
  waypoints: Waypoint[];
}

declare global {
  interface Window {
    google: any;
  }
}

export function RouteMap({ waypoints }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // 지도 생성
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 8,
      center: { lat: waypoints[0]?.coordinates.lat || 37.5665, lng: waypoints[0]?.coordinates.lng || 126.9780 },
      mapTypeId: 'terrain'
    });

    mapInstanceRef.current = map;

    if (waypoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      // 경로 그리기
  const path = waypoints.map(wp => ({
    lat: wp.coordinates.lat,
    lng: wp.coordinates.lng
  }));

      const flightPath = new window.google.maps.Polyline({
        path,
        geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
      });

      flightPath.setMap(map);

      // 마커 추가
      waypoints.forEach((wp, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: wp.coordinates.lat, lng: wp.coordinates.lng },
          map,
          title: wp.name,
          label: (index + 1).toString()
        });

        bounds.extend(marker.getPosition()!);
      });

      // 모든 마커가 보이도록 지도 조정
      map.fitBounds(bounds);
    }
  }, [waypoints]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '500px', borderRadius: '8px' }} />
  );
} 