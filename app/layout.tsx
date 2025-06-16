import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { SplashScreen } from "@/components/SplashScreen";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: 'TDH Cal',
  description: 'TDH Cal',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Flight Plan",
  },
  other: {
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  icons: {
    icon: [
      {
        url: '/icons/icon.svg',
        type: 'image/svg+xml',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P0NT5BFQJ9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P0NT5BFQJ9');
          `}
        </Script>
        
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-1733830202388355"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Flight Planning Tool" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Flight Plan" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* iPhone SE */}
        <link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="/splash/iphone5_splash.png" />
        {/* iPhone 8, 7, 6s, 6 */}
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/splash/iphone6_splash.png" />
        {/* iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus */}
        <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphoneplus_splash.png" />
        {/* iPhone X, XS */}
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphonex_splash.png" />
        {/* iPhone XR, 11 */}
        <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/splash/iphonexr_splash.png" />
        {/* iPhone XS Max, 11 Pro Max */}
        <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphonexsmax_splash.png" />
        {/* iPhone 12, 12 Pro */}
        <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphone12_splash.png" />
        {/* iPhone 12 mini */}
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphone12mini_splash.png" />
        {/* iPhone 12 Pro Max */}
        <link rel="apple-touch-startup-image" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphone12promax_splash.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background`}>
        <SplashScreen />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 px-4 md:px-6 mx-auto w-full max-w-7xl overflow-y-auto overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
