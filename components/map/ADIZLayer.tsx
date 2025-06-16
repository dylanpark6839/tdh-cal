import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import { adizLayer } from '@/data/airspace/adiz';

interface ADIZLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export function ADIZLayer({ map, visible }: ADIZLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="ADIZ"
      data={adizLayer}
    />
  );
} 