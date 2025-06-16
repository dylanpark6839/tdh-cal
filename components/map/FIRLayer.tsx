import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { firLayer } from '@/data/airspace/fir';

interface FIRLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function FIRLayer({ map, visible }: FIRLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="FIR"
      data={firLayer}
    />
  );
} 