export type Coordinates = {
  lat: number;
  lng: number;
};

export type Waypoint = {
  name: string;
  coordinates: Coordinates;
  coordinateType: 'MGRS' | 'LatLng';
  originalInput: string; // MGRS 또는 LatLng 원본 입력값
};

export type SpeedUnit = 'kt' | 'km/h';
export type DistanceUnit = 'NM' | 'km';

export type FlightSettings = {
  speed: number;
  speedUnit: SpeedUnit;
  distanceUnit: DistanceUnit;
};

export type RouteSegment = {
  from: Waypoint;
  to: Waypoint;
  distance: number;
  heading: number;
  eta: string;
};

export type FlightPlan = {
  waypoints: Waypoint[];
  settings: FlightSettings;
  totalDistance: number;
  totalTime: string;
  segments: RouteSegment[];
}; 