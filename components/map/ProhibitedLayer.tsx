import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { prohibitedLayer } from '@/data/airspace/prohibited';

interface ProhibitedLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function ProhibitedLayer({ map, visible }: ProhibitedLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="PROHIBITED"
      data={prohibitedLayer}
    />
  );
} 