import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { FlightSettings as FlightSettingsType } from '@/types/flight';

interface FlightSettingsProps {
  onSubmit: (settings: FlightSettingsType) => void;
  initialSettings?: FlightSettingsType;
}

export function FlightSettings({ onSubmit, initialSettings }: FlightSettingsProps) {
  const [speed, setSpeed] = useState(initialSettings?.speed || 0);
  const [speedUnit, setSpeedUnit] = useState<'kt' | 'km/h'>(initialSettings?.speedUnit || 'kt');
  const [distanceUnit, setDistanceUnit] = useState<'NM' | 'km'>(initialSettings?.distanceUnit || 'NM');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (speed <= 0) {
      setError('속도는 0보다 커야 합니다.');
      return;
    }

    onSubmit({
      speed,
      speedUnit,
      distanceUnit
    });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="speed">속도</Label>
          <Input
            id="speed"
            type="number"
            min="0"
            step="any"
            value={speed || ''}
            onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
            placeholder="속도를 입력하세요"
          />
        </div>

        <div className="space-y-2">
          <Label>속도 단위</Label>
          <RadioGroup
            value={speedUnit}
            onValueChange={(value: 'kt' | 'km/h') => setSpeedUnit(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kt" id="kt" />
              <Label htmlFor="kt">노트 (kt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="km/h" id="kmh" />
              <Label htmlFor="kmh">킬로미터/시 (km/h)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>거리 단위</Label>
          <RadioGroup
            value={distanceUnit}
            onValueChange={(value: 'NM' | 'km') => setDistanceUnit(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NM" id="nm" />
              <Label htmlFor="nm">해리 (NM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="km" id="km" />
              <Label htmlFor="km">킬로미터 (km)</Label>
            </div>
          </RadioGroup>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">설정 저장</Button>
        </form>
    </Card>
  );
} 