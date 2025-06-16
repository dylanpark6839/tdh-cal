import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { dangerLayer } from '@/data/airspace/danger';

interface DangerLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function DangerLayer({ map, visible }: DangerLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="DANGER"
      data={dangerLayer}
    />
  );
} 