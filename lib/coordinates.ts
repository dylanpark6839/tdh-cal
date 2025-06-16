interface Coordinates {
  lat: number;
  lng: number;
}

export function parseCoordinates(input: string): Coordinates | null {
  try {
    // 위도,경도 형식 (예: "37.4691,126.4505")
    const [lat, lng] = input.split(',').map(s => parseFloat(s.trim()));
    if (isNaN(lat) || isNaN(lng)) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
  } catch (e) {
    return null;
  }
} 