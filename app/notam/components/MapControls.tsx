import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  FixType, 
  RouteType, 
  MapSettings,
  RestrictedType
} from '../types';
import { 
  Plane, 
  Navigation, 
  Route,
  AlertTriangle
} from 'lucide-react';

interface MapControlsProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
}

export function MapControls({
  settings,
  onSettingsChange,
}: MapControlsProps) {
  const toggleFix = (type: FixType) => {
    const newFixes = settings.showFixes.includes(type)
      ? settings.showFixes.filter(t => t !== type)
      : [...settings.showFixes, type];
    onSettingsChange({ ...settings, showFixes: newFixes });
  };

  const toggleRoute = (type: RouteType) => {
    const newRoutes = settings.showRoutes.includes(type)
      ? settings.showRoutes.filter(t => t !== type)
      : [...settings.showRoutes, type];
    onSettingsChange({ ...settings, showRoutes: newRoutes });
  };

  const toggleRestricted = (type: RestrictedType) => {
    const newRestricted = settings.showRestricted.includes(type)
      ? settings.showRestricted.filter(t => t !== type)
      : [...settings.showRestricted, type];
    onSettingsChange({ ...settings, showRestricted: newRestricted });
  };

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          <Accordion type="single" collapsible className="w-full">
            {/* 공항 */}
            <AccordionItem value="airport">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  공항
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6">
                  <Checkbox
                    checked={settings.showAirports}
                    onCheckedChange={(checked) => 
                      onSettingsChange({ ...settings, showAirports: checked as boolean })}
                  />
                  <label className="ml-2">공항 표시</label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 금지/제한/주의 구역 */}
            <AccordionItem value="restricted">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  금지/제한/주의 구역
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-6">
                  {[
                    { value: 'P', label: '금지구역' },
                    { value: 'R', label: '제한구역' },
                    { value: 'D', label: '위험구역' },
                    { value: 'A', label: '주의구역' },
                    { value: 'M', label: '기타' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center">
                      <Checkbox
                        checked={settings.showRestricted.includes(value as RestrictedType)}
                        onCheckedChange={() => toggleRestricted(value as RestrictedType)}
                      />
                      <label className="ml-2">{label}</label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* FIX */}
            <AccordionItem value="fix">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  FIX
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-6">
                  {['SIGN-POINT', 'VORTAC', 'VOR/DME', 'TACAN'].map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        checked={settings.showFixes.includes(type as FixType)}
                        onCheckedChange={() => toggleFix(type as FixType)}
                      />
                      <label className="ml-2">{type}</label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ROUTE */}
            <AccordionItem value="route">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  ROUTE
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-6">
                  {['INTL', 'DOM', 'BOTH', 'RNAV'].map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        checked={settings.showRoutes.includes(type as RouteType)}
                        onCheckedChange={() => toggleRoute(type as RouteType)}
                      />
                      <label className="ml-2">{type}</label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* NAVAID */}
            <AccordionItem value="navaid">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  NAVAID
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6">
                  <Checkbox
                    checked={settings.showNavaid}
                    onCheckedChange={(checked) => 
                      onSettingsChange({ ...settings, showNavaid: checked as boolean })}
                  />
                  <label className="ml-2">NAVAID 표시</label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
} 