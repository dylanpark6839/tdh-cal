export interface Notam {
  text: string;
  issueTime?: string;
  location?: string;
  notamNo?: string;
  qcode?: string;
  startTime?: string;
  endTime?: string;
  fullText?: string;
}

export interface NotamLayer {
  id: string;
  visible: boolean;
  notam: Notam;
  marker?: google.maps.Marker;
  circle?: google.maps.Circle;
}

export type FixType = 'SIGN-POINT' | 'VORTAC' | 'VOR/DME' | 'TACAN';
export type RouteType = 'INTL' | 'DOM' | 'BOTH' | 'RNAV';
export type RestrictedType = 'P' | 'R' | 'D' | 'A' | 'M';

declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
}

export interface MapSettings {
  showAirports: boolean;
  showFixes: FixType[];
  showRoutes: RouteType[];
  showNavaid: boolean;
  showRestricted: RestrictedType[];
} 