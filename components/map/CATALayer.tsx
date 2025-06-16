import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { cataLayer } from '@/data/airspace/cata';

interface CATALayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function CATALayer({ map, visible }: CATALayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="CATA"
      data={cataLayer}
    />
  );
} 