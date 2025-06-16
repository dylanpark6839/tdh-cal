'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Plane, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export type AirspaceType =
  | 'ADIZ'        // Air Defense Identification Zone
  | 'FIR'         // Flight Information Region
  | 'CTA'         // Control Area
  | 'TMA'         // Terminal Control Area
  | 'CTR'         // Control Zone
  | 'ATZ'         // Aerodrome Traffic Zone
  | 'PROHIBITED'  // P-73 등
  | 'RESTRICTED'  // R-75 등
  | 'DANGER'      // D-xx
  | 'ALERT'       // A-xx
  | 'MOA'         // Military Operations Area
  | 'CATA'        // Civil Air Training Area
  | 'UA';         // Unmanned Aircraft Area

export interface MapSettings {
  showAirports: boolean;
  showAirspaces: AirspaceType[];
  showNotams: boolean;
  showAirspaceReservation?: boolean;
}

export const DEFAULT_SETTINGS: MapSettings = {
  showAirports: true,
  showAirspaces: [],
  showNotams: false,
  showAirspaceReservation: false,
};

interface MapControlsProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
}

export function MapControls({
  settings,
  onSettingsChange,
}: MapControlsProps) {
  const [openSections, setOpenSections] = useState<string[]>(['airspace']);

  const toggleAirspace = (type: AirspaceType) => {
    console.log('Toggling airspace:', type);
    const newAirspaces = settings.showAirspaces.includes(type)
      ? settings.showAirspaces.filter(t => t !== type)
      : [...settings.showAirspaces, type];
    console.log('New airspaces:', newAirspaces);
    onSettingsChange({ ...settings, showAirspaces: newAirspaces });
  };

  const airspaceTypes = [
    { type: 'ADIZ', label: 'ADIZ' },
    { type: 'FIR', label: 'FIR' },
    { type: 'CTA', label: 'CTA' },
    { type: 'TMA', label: 'TMA' },
    { type: 'CTR', label: 'CTR' },
    { type: 'ATZ', label: 'ATZ' },
    { type: 'PROHIBITED', label: '금지구역(P)' },
    { type: 'RESTRICTED', label: '제한구역(R)' },
    { type: 'DANGER', label: '위험구역(D)' },
    { type: 'ALERT', label: '경계구역(A)' },
    { type: 'MOA', label: '군작전구역(MOA)' },
    { type: 'CATA', label: '훈련구역(CATA)' },
    { type: 'UA', label: '초경량비행장치구역(UA)' }
  ] as const;

  // 설정이 변경될 때마다 로그
  useEffect(() => {
    console.log('Map settings changed:', settings);
  }, [settings]);

  return (
    <Card className="w-52 bg-white/80 backdrop-blur-sm border-none shadow-lg">
      <CardContent className="p-2 max-h-[40vh] overflow-y-auto">
        <div className="space-y-1">
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="w-full"
          >
            {/* NOTAM - 비활성화 */}
            <AccordionItem value="notam" className="border-none">
              <AccordionTrigger className="text-xs py-1.5 hover:no-underline opacity-50">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  NOTAM
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1.5 pl-4">
                  <div className="flex items-center">
                    <Checkbox
                      disabled
                      checked={false}
                      onCheckedChange={() => {}}
                    />
                    <label className="ml-2 text-xs text-muted-foreground">NOTAM 표시</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 공항 */}
            <AccordionItem value="airport" className="border-none">
              <AccordionTrigger className="text-xs py-1.5 hover:no-underline">
                <div className="flex items-center gap-1">
                  <Plane className="h-3 w-3" />
                  공항
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4">
                  <div className="flex items-center">
                    <Checkbox
                      checked={settings.showAirports}
                      onCheckedChange={(checked) => 
                        onSettingsChange({ ...settings, showAirports: checked as boolean })}
                    />
                    <label className="ml-2 text-xs">공항 표시</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 공역 */}
            <AccordionItem value="airspace" className="border-none">
              <AccordionTrigger className="text-xs py-1.5 hover:no-underline">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  공역
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1.5 pl-4">
                  {airspaceTypes.map(({ type, label }) => (
                    <div key={type} className="flex items-center">
                        <Checkbox
                        id={type}
                        checked={settings.showAirspaces.includes(type as AirspaceType)}
                        onCheckedChange={() => toggleAirspace(type as AirspaceType)}
                        />
                      <label htmlFor={type} className="ml-2 text-xs">{label}</label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
} 