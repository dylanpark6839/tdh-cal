import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 relative overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div ref={adRef} className="w-full">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot="YOUR_AD_SLOT_ID"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </Card>
  );
} 