import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { BottomNav } from "@/components/BottomNav";
import { GestureNav } from "@/components/GestureNav";
import { SplashScreen } from "@/components/SplashScreen";

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
  title: "비행 계획 도구",
  description: "비행 계획을 수립하고 관리하는 도구",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Flight Plan",
  },
  other: {
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
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
        
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          strategy="lazyOnload"
          async
          defer
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-y-scroll pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 pt-[env(safe-area-inset-top)] bg-background`}
      >
        <SplashScreen />
        <GestureNav>
          <main className="min-h-[calc(100vh-4rem-env(safe-area-inset-bottom))] px-4 md:px-6 mx-auto max-w-7xl">
            {children}
          </main>
        </GestureNav>
        <BottomNav />
      </body>
    </html>
  );
}
