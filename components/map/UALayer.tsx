import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { uaLayer } from '@/data/airspace/ua';

interface UALayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function UALayer({ map, visible }: UALayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="UA"
      data={uaLayer}
    />
  );
} 