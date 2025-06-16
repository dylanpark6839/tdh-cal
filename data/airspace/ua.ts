import { Feature, FeatureCollection, Polygon } from 'geojson';
import { AirspaceData } from '@/lib/airspace';

interface UAProperties {
  name: string;
  description: string;
  gfid: string;
  ident_txt: string;
  type_code: string;
  remarks_txt?: string;
  dist_vert_upper_val?: number;
  dist_vert_upper_uom?: string;
  dist_vert_upper_code?: string;
  dist_vert_lower_val?: number;
  dist_vert_lower_uom?: string;
  dist_vert_lower_code?: string;
  global_id: string;
}

type UAFeature = Feature<Polygon, UAProperties>;

// GeoJSON 파일을 직접 import
export const uaLayer: AirspaceData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'UA-1',
        description: '초경량비행장치구역 1'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [126.5000, 37.5000], // 373000N1263000E
          [127.0000, 37.5000], // 373000N1270000E
          [127.0000, 37.0000], // 370000N1270000E
          [126.5000, 37.0000], // 370000N1263000E
          [126.5000, 37.5000]  // 373000N1263000E
        ]]
      }
    }
  ]
}; 