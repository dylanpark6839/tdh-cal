import ctrAtzData from '@/data/airspace/ctr-atz.json';

export interface Coordinate {
  lon: number;
  lat: number;
}

export interface AirspaceFeature {
  type: string;
  name: string;
  coordinates: Coordinate[];
  description?: string;
}

export const getCtrAtzData = (): AirspaceFeature[] => {
  return ctrAtzData;
}; 