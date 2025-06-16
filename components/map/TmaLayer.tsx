import { BaseAirspaceLayer } from './BaseAirspaceLayer';
import tma from '../../data/airspace/TMA.json';
import { FeatureCollection, Polygon } from 'geojson';

interface TmaLayerProps {
  map: google.maps.Map | null;
  visible: boolean;
}

export default function TmaLayer({ map, visible }: TmaLayerProps) {
  return (
    <BaseAirspaceLayer
      map={map}
      visible={visible}
      type="TMA"
      data={tma as FeatureCollection<Polygon, any>}
    />
  );
} 