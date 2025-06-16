import { AirspaceType } from '@/components/MapControls';
import tma from '@/data/airspace/TMA.json';
import ctrLayer from '@/data/airspace/ctr.json';

interface Coordinates {
  lat: number;
  lng: number;
}

interface AirspaceArea {
  name: string;
  coordinates: Coordinates[];
  description?: string;
  type?: 'polygon' | 'line';
}

export const AIRSPACE_AREAS: Record<AirspaceType, AirspaceArea[]> = {
  ADIZ: [],
  FIR: [],
  CTA: [],
  TMA: tma.features.map((feature: any) => {
    if (feature.properties.name === 'Yecheon TMA T-36') {
      return {
        name: feature.properties.name,
        description: feature.properties.description,
        coordinates: [
          { lat: 37.0710, lng: 128.4052 },
          { lat: 37.0710, lng: 129.1604 },
          { lat: 36.5631, lng: 129.1604 },
          { lat: 36.3530, lng: 129.2607 },
          { lat: 36.2011, lng: 129.2607 },
          { lat: 36.2011, lng: 128.3952 },
          { lat: 36.2911, lng: 128.2352 },
          { lat: 36.2911, lng: 128.0952 },
          { lat: 36.5010, lng: 128.0952 },
          { lat: 36.4540, lng: 128.1752 },
          { lat: 36.4810, lng: 128.2752 },
          { lat: 36.5710, lng: 128.4052 },
          { lat: 37.0710, lng: 128.4052 }
        ]
      };
    }
    if (feature.properties.name === 'Haemi TMA T-37') {
      return {
        name: feature.properties.name,
        description: feature.properties.description,
        coordinates: [
          { lat: 36.5652, lng: 125.4823 },
          { lat: 37.0050, lng: 126.1652 },
          { lat: 36.5850, lng: 126.2553 },
          { lat: 36.5140, lng: 126.2757 },
          { lat: 36.5246, lng: 126.3504 },
          { lat: 36.4427, lng: 126.4435 },
          { lat: 36.3804, lng: 126.5311 },
          { lat: 36.3458, lng: 126.5516 },
          { lat: 36.2310, lng: 126.5247 },
          { lat: 36.2310, lng: 125.4853 },
          { lat: 36.5652, lng: 125.4823 }
        ]
      };
    }
    // 나머지는 기존대로
    return {
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map((coord: [number, number]) => ({
        lat: coord[1],
        lng: coord[0]
      }))
    };
  }),
  CTR: ctrLayer.features.map((feature: any) => ({
    name: feature.properties.name,
    description: feature.properties.description,
    coordinates: (feature.geometry.coordinates[0] as [number, number][]).map((coord: [number, number]) => ({
      lat: coord[1],
      lng: coord[0]
    }))
  })),
  ATZ: [],
  PROHIBITED: [],
  RESTRICTED: [],
  DANGER: [],
  ALERT: [],
  MOA: [],
  UA: [],
  CATA: []
}; 