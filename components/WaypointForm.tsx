import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toPoint, forward } from 'mgrs';
import { Waypoint } from '@/types/flight';

interface WaypointFormProps {
  onSubmit: (waypoint: Waypoint) => void;
}

export function WaypointForm({ onSubmit }: WaypointFormProps) {
  const [name, setName] = useState('');
  const [coordinateType, setCoordinateType] = useState<'MGRS' | 'LatLng'>('LatLng');
  const [coordinateInput, setCoordinateInput] = useState('');
  const [error, setError] = useState('');

  const parseCoordinates = (input: string, type: 'MGRS' | 'LatLng'): { lat: number; lng: number } | null => {
    try {
      if (type === 'MGRS') {
        const point = toPoint(input);
        return { lat: point[1], lng: point[0] };
      } else {
        // LatLng format: "37.5665, 126.9780" or "37.5665,126.9780"
        const [lat, lng] = input.split(/,\s*/).map(Number);
        if (isNaN(lat) || isNaN(lng)) throw new Error('Invalid format');
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) throw new Error('Coordinates out of range');
        return { lat, lng };
      }
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('웨이포인트 이름을 입력해주세요.');
      return;
    }

    if (!coordinateInput.trim()) {
      setError('좌표를 입력해주세요.');
      return;
    }

    const coordinates = parseCoordinates(coordinateInput, coordinateType);
    if (!coordinates) {
      setError('올바른 좌표 형식이 아닙니다.');
      return;
    }

    const waypoint: Waypoint = {
      name: name.trim(),
      coordinates,
      coordinateType,
      originalInput: coordinateInput.trim()
    };

    onSubmit(waypoint);
    setName('');
    setCoordinateInput('');
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">웨이포인트 이름</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="웨이포인트 이름을 입력하세요"
          />
        </div>

        <div className="space-y-2">
          <Label>좌표 형식</Label>
          <RadioGroup
              value={coordinateType}
            onValueChange={(value: 'MGRS' | 'LatLng') => setCoordinateType(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LatLng" id="latlng" />
              <Label htmlFor="latlng">위/경도</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MGRS" id="mgrs" />
              <Label htmlFor="mgrs">MGRS</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordinates">좌표</Label>
          <Input
            id="coordinates"
            value={coordinateInput}
            onChange={(e) => setCoordinateInput(e.target.value)}
            placeholder={coordinateType === 'LatLng' ? "37.5665, 126.9780" : "15S YD 0000 0000"}
              />
          {coordinateType === 'LatLng' && (
            <p className="text-sm text-gray-500">위도, 경도 형식으로 입력 (예: 37.5665, 126.9780)</p>
          )}
          {coordinateType === 'MGRS' && (
            <p className="text-sm text-gray-500">MGRS 형식으로 입력 (예: 15S YD 0000 0000)</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">웨이포인트 추가</Button>
        </form>
    </Card>
  );
} 