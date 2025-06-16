import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { restrictedLayer } from '@/data/airspace/restricted';

interface RestrictedLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function RestrictedLayer({ map, visible }: RestrictedLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="RESTRICTED"
      data={restrictedLayer}
    />
  );
} 