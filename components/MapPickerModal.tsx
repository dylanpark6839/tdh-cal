"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number) => void;
}

export function MapPickerModal({ isOpen, onClose, onSelectLocation }: MapPickerModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = {
    lat: 36.5,
    lng: 127.5
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  }, []);

  const handleConfirm = () => {
    if (selectedPosition) {
      onSelectLocation(selectedPosition.lat, selectedPosition.lng);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            지도에서 위치 선택
          </DialogTitle>
        </DialogHeader>
        <div className="h-[500px] w-full relative">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={7}
            onClick={onMapClick}
            onLoad={setMap}
            options={{
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
            }}
          >
            {selectedPosition && (
              <Marker
                position={selectedPosition}
                animation={google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedPosition}>
            선택 완료
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 