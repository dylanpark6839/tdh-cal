import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { moaLayer } from '@/data/airspace/moa';

interface MOALayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function MOALayer({ map, visible }: MOALayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="MOA"
      data={moaLayer}
    />
  );
} 