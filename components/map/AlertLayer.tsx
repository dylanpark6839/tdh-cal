import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { alertLayer } from '@/data/airspace/alert';

interface AlertLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function AlertLayer({ map, visible }: AlertLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="ALERT"
      data={alertLayer}
    />
  );
} 