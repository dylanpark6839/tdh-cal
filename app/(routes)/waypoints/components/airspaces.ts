import { AirspaceType } from '@/components/MapControls';
import tma from '@/data/airspace/TMA.json';
import ctrLayer from '@/data/airspace/ctr.json';
import atzLayer from '@/data/airspace/atz.json';
import prohibitedLayer from '@/data/airspace/p.json';
import restrictedLayer from '@/data/airspace/r.json';
import dangerLayer from '@/data/airspace/d.json';
import alertLayer from '@/data/airspace/alert.json';
import moaLayer from '@/data/airspace/MOA.json';
import cataLayer from '@/data/airspace/cata.json';
import uaLayer from '@/data/airspace/ua.json';
import adizLayer from '@/data/airspace/adiz.json';
import firLayer from '@/data/airspace/fir.json';
import ctaLayer from '@/data/airspace/cta.json';
console.log('atzLayer:', atzLayer);

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

// TMA 데이터가 제대로 매핑되는지 확인하기 위한 로그
console.log('Raw TMA Layer:', JSON.stringify(tma, null, 2));

// TMA 데이터 매핑
const mappedTMA = tma.features.map((feature: any) => ({
    name: feature.properties.name,
    description: feature.properties.description,
  coordinates: feature.geometry.coordinates[0].map(
    ([lng, lat]: [number, number]) => ({ lat, lng })
  ),
  type: 'polygon' as 'polygon',
}));

console.log('All mapped TMA areas:', JSON.stringify(mappedTMA, null, 2));

// 폴리곤 면적 계산 함수 (Shoelace formula)
function getPolygonArea(coords: { lat: number; lng: number }[]): number {
  let area = 0;
  for (let i = 0, len = coords.length; i < len; i++) {
    const { lat: x1, lng: y1 } = coords[i];
    const { lat: x2, lng: y2 } = coords[(i + 1) % len];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

const mappedCTR = ctrLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        })
      )
    }));
  }
  return [];
});

// 공역별(name별)로 그룹핑 후, 각 그룹 내에서 면적 오름차순 정렬
const grouped: Record<string, typeof mappedCTR> = {};
mappedCTR.forEach(area => {
  if (!grouped[area.name]) grouped[area.name] = [];
  grouped[area.name].push(area);
});

const specialCtrNames = [
  'Incheon CTR', 'Gimpo CTR', 'Cheongju CTR', 'Wonju CTR', 'Seosan CTR', 'Gangneung CTR',
  'Yecheon CTR', 'Gunsan CTR', 'Daegu CTR', 'Pohang CTR', 'Gimhae CTR', 'Sacheon CTR', 'Gwangju CTR'
];

Object.keys(grouped).forEach(name => {
  if (specialCtrNames.includes(name)) {
    // area C > area B > area A 순서로 정렬
    grouped[name].sort((a, b) => {
      const getAreaOrder = (n: string) => {
        if (/area a/i.test(n)) return 0;
        if (/area b/i.test(n)) return 1;
        if (/area c/i.test(n)) return 2;
        return 3;
      };
      return getAreaOrder(a.name) - getAreaOrder(b.name);
    });
  } else {
    // 나머지는 면적 오름차순
    grouped[name].sort((a, b) => getPolygonArea(a.coordinates) - getPolygonArea(b.coordinates));
  }
});

const sortedCTR = Object.values(grouped).flat();

console.log('ATZ features count:', atzLayer.features.length);
console.log('ATZ first feature:', atzLayer.features[0]);

// ATZ 데이터가 제대로 매핑되는지 확인하기 위한 로그
console.log('Raw ATZ Layer:', JSON.stringify(atzLayer, null, 2));

// ATZ 데이터 매핑
const mappedATZ = atzLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        })
      )
    }));
  }
  return [];
});

// PROHIBITED 데이터 매핑
const mappedPROHIBITED = prohibitedLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// RESTRICTED 데이터 매핑
const mappedRESTRICTED = restrictedLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// DANGER 데이터 매핑
const mappedDANGER = dangerLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// ALERT 데이터 매핑
const mappedALERT = alertLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// MOA 데이터 매핑
const mappedMOA = moaLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// CATA 데이터 매핑
const mappedCATA = cataLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// UA 데이터 매핑
const mappedUA = uaLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      )
    }));
  }
  return [];
});

// ADIZ 데이터 매핑
const mappedADIZ = adizLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      ),
      type: 'polygon' as const
    } as AirspaceArea];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      ),
      type: 'polygon' as const
    } as AirspaceArea));
  }
  return [];
});

// FIR 데이터 매핑
const mappedFIR = firLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      ),
      type: 'polygon' as const
    } as AirspaceArea];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) => ({
      name: feature.properties.name,
      description: feature.properties.description,
      coordinates: (polygon[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      ),
      type: 'polygon' as const
    } as AirspaceArea));
  }
  return [];
});

// CTA 데이터 매핑
const mappedCTA = (ctaLayer.features.flatMap((feature: any) => {
  if (feature.geometry.type === 'Polygon') {
    return [{
      name: feature.properties.name,
      description: feature.properties.description ?? '',
      coordinates: (feature.geometry.coordinates[0] as [number, number][]).map(
        (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
      ),
      type: 'polygon' as 'polygon'
    }];
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((polygon: [number, number][][]) =>
      ({
        name: feature.properties.name,
        description: feature.properties.description ?? '',
        coordinates: (polygon[0] as [number, number][]).map(
          (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
        ),
        type: 'polygon' as 'polygon'
      })
    );
  }
  return [];
}) as any) as AirspaceArea[];

export const AIRSPACE_AREAS: Record<AirspaceType, AirspaceArea[]> = {
  ADIZ: mappedADIZ,
  FIR: mappedFIR,
  CTA: mappedCTA,
  TMA: mappedTMA,
  CTR: sortedCTR,
  ATZ: mappedATZ,
  PROHIBITED: mappedPROHIBITED,
  RESTRICTED: mappedRESTRICTED,
  DANGER: mappedDANGER,
  ALERT: mappedALERT,
  MOA: mappedMOA,
  UA: mappedUA,
  CATA: mappedCATA
}; 