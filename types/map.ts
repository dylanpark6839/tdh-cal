export interface ADIZProperties {
  name: string;
  description: string;
  gfid: string;
  identTxt: string;
  distVertUpperCode: string;
  distVertLowerCode: string;
  typeCode: string;
  globalId: string;
}

export interface ADIZFeature {
  type: "Feature";
  properties: ADIZProperties;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface ADIZData {
  type: "FeatureCollection";
  features: ADIZFeature[];
} 