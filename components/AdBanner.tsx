'use client';

import { useEffect, useState, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // AdSense가 아직 준비되지 않았다면 광고를 로드하지 않음
    if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
      return;
    }

    const isVisible = adContainerRef.current?.offsetParent !== null;

    if (isVisible && !isLoaded) {
      try {
        // 기존 광고 슬롯 초기화
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = '';

          // 새로운 광고 슬롯 생성
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.style.width = '100%';
          adElement.style.height = '100px';
          adElement.dataset.adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
          adElement.dataset.adSlot = '1234567890'; // 실제 광고 슬롯 ID로 교체 필요
          adElement.dataset.adFormat = 'auto';
          adElement.dataset.fullWidthResponsive = 'true';

          adContainerRef.current.appendChild(adElement);

          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          } catch (pushError) {
            console.error('AdSense push error:', pushError);
          }
        }

        setIsLoaded(true);
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [isLoaded]);

  // AdSense ID가 없으면 광고를 표시하지 않음
  if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
    return null;
  }

  return (
    <div ref={adContainerRef} className={`w-full h-[100px] bg-gray-100/50 ${className || ''}`} />
  );
} 