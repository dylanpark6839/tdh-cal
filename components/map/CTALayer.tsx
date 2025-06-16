import { useEffect } from 'react';
import ctaLayer from '@/data/airspace/cta.json';

interface CTALayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function CTALayer({ map, visible }: CTALayerProps) {
  useEffect(() => {
    if (!map) return;

    const polygons: google.maps.Polygon[] = [];

    if (visible) {
      ctaLayer.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates[0].map(coord => ({
          lat: coord[1],
          lng: coord[0]
        }));

        const polygon = new google.maps.Polygon({
          paths: coordinates,
          strokeColor: '#00FF00',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FF00',
          fillOpacity: 0.15,
          map: map
        });

        // 정보창 생성
        const infoWindow = new google.maps.InfoWindow();

        // 마우스 오버 이벤트
        polygon.addListener('mouseover', (e: google.maps.PolyMouseEvent) => {
          polygon.setOptions({ fillOpacity: 0.35 });
          
          if (e.latLng) {
            infoWindow.setContent(`
              <div style="padding: 8px;">
                <strong>${feature.properties.name}</strong><br/>
                ${feature.properties.description}
              </div>
            `);
            infoWindow.setPosition(e.latLng);
            infoWindow.open(map);
          }
        });

        // 마우스 아웃 이벤트
        polygon.addListener('mouseout', () => {
          polygon.setOptions({ fillOpacity: 0.15 });
          infoWindow.close();
        });

        polygons.push(polygon);
      });
    }

    return () => {
      polygons.forEach(polygon => {
        polygon.setMap(null);
      });
    };
  }, [map, visible]);

  return null;
} 