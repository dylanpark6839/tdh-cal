import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import ctrLayer from '@/data/airspace/ctr.json';

interface CTRLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function CTRLayer({ map, visible }: CTRLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="CTR"
      data={ctrLayer}
    />
  );
} 