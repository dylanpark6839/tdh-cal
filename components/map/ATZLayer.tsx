import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import atzLayer from '@/data/airspace/atz.json';

interface ATZLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function ATZLayer({ map, visible }: ATZLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="ATZ"
      data={atzLayer}
    />
  );
} 