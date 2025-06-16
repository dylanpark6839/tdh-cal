import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 이미 로드되었는지 확인
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // 이미 스크립트가 추가되어 있는지 확인
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;

    // 콜백 함수 정의
    window.initMap = () => {
      setIsLoaded(true);
    };

    // 스크립트 추가
    document.head.appendChild(script);

    return () => {
      // cleanup
      window.initMap = () => {};
    };
  }, []);

  return isLoaded;
} 