import { useEffect, useRef } from 'react';
import { Feature, FeatureCollection, Polygon } from 'geojson';
import { airspaceStyles } from '@/data/airspace';
import { toast } from 'sonner';

interface BaseAirspaceLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
  type: keyof typeof airspaceStyles;
  data: FeatureCollection<Polygon, any>;
}

export function BaseAirspaceLayer({ map, visible, type, data }: BaseAirspaceLayerProps) {
  const polygonsRef = useRef<google.maps.Polygon[]>([]);

  useEffect(() => {
    console.log(`BaseAirspaceLayer ${type} effect:`, { map, visible, polygonsCount: polygonsRef.current.length });
    
    if (!map) return;

    // 지도 bounds를 전국 단위로 fitBounds로 자동 조정 (진단용)
    if (data.features.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      data.features.forEach(feature => {
        feature.geometry.coordinates.forEach(ring => {
          ring.forEach(coord => {
            bounds.extend({ lat: coord[1], lng: coord[0] });
          });
        });
      });
      map.fitBounds(bounds);
    }

    // Create polygons if they don't exist
    if (polygonsRef.current.length === 0) {
      console.log(`Creating polygons for ${type}`);
      const style = airspaceStyles[type];

      // TMA 데이터 feature 개수 로그
      console.log(`TMA features count:`, data.features.length);

      // 전달된 TMA feature 개수와 이름 로그
      console.log('TMA features 전달 개수:', data.features.length, data.features.map(f => f.properties.name));

      data.features.forEach((feature, idx) => {
        // 모든 ring을 지원하도록 paths 구조로 변환
        const paths = feature.geometry.coordinates.map(ring =>
          ring.map(coord => ({
          lat: coord[1],
          lng: coord[0]
          }))
        );

        // 각 폴리곤의 이름과 첫 좌표 로그 (raw/converted)
        console.log(
          `TMA[${idx}] ${feature.properties.name}`,
          'raw:', feature.geometry.coordinates[0][0],
          'converted:', paths[0][0]
        );

        const polygon = new google.maps.Polygon({
          paths,
          strokeColor: '#FF0000',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#FF0000',
          fillOpacity: 0.5,
          map: visible ? map : null,
          clickable: true,
          zIndex: 1000
        });

        // 첫 좌표에 마커 추가 (진단용)
        const marker = new google.maps.Marker({
          position: paths[0][0],
          map: visible ? map : null,
          title: feature.properties.name,
        });

        // 마우스 오버 이벤트
        polygon.addListener('mouseover', () => {
          polygon.setOptions({ fillOpacity: 0.35 });
        });

        // 마우스 아웃 이벤트
        polygon.addListener('mouseout', () => {
          polygon.setOptions({ fillOpacity: 0.15 });
        });

        // 클릭 이벤트
        polygon.addListener('click', () => {
            toast('공역 정보', {
              description: (
                <div className="flex flex-col gap-1">
                  <div>이름: {feature.properties.name}</div>
                  <div>내용: {feature.properties.description}</div>
                </div>
              ),
              duration: 3000,
            });
        });

        polygonsRef.current.push(polygon);
      });
      console.log(`Created ${polygonsRef.current.length} polygons for ${type}`);
    }

    // Update visibility
    console.log(`Updating visibility for ${type} to ${visible}`);
    polygonsRef.current.forEach(polygon => {
      polygon.setMap(visible ? map : null);
    });

    return () => {
      console.log(`Cleaning up ${type} layer`);
      polygonsRef.current.forEach(polygon => {
        polygon.setMap(null);
      });
      polygonsRef.current = [];
    };
  }, [map, visible, type, data]);

  return null;
} 