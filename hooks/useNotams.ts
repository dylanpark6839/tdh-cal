import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface NotamData {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  series: 'A' | 'C' | 'D' | 'E' | 'G' | 'Z' | 'SNOWTAM';
  elevation?: number;
  lowerFL?: number;
  upperFL?: number;
  text: string;
  validFrom: string;
  validTo: string;
  airport?: string;
  radius?: number; // 영향 반경 (해리 단위)
  radiusUnit?: 'NM' | 'KM'; // 반경 단위
}

export function useNotams() {
  const [notams, setNotams] = useState<NotamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotams = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching NOTAMs...');

      // API 엔드포인트로 요청
      const response = await fetch('/api/notams');
      if (!response.ok) {
        throw new Error('Failed to fetch NOTAMs');
      }

      const data = await response.json();
      console.log('Received NOTAM data:', data);
      
      // 현재 시간에 유효한 NOTAM만 필터링
      const now = new Date();
      const validNotams = data.filter((notam: NotamData) => {
        const validFrom = new Date(notam.validFrom);
        const validTo = new Date(notam.validTo);
        const isValid = validFrom <= now && now <= validTo;
        if (!isValid) {
          console.log(`NOTAM ${notam.id} is not valid:`, {
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            now: now.toISOString()
          });
        }
        return isValid;
      });

      console.log('Valid NOTAMs:', validNotams);
      setNotams(validNotams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NOTAMs';
      console.error('Error fetching NOTAMs:', err);
      setError(errorMessage);
      toast.error('NOTAM 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 5분마다 NOTAM 정보 갱신
  useEffect(() => {
    fetchNotams();
    const interval = setInterval(fetchNotams, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { notams, loading, error, refetch: fetchNotams };
} 