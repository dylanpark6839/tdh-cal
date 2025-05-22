'use client';

import { Home, MapPin, Route, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/waypoints",
      icon: MapPin,
      label: "Waypoints",
    },
    {
      href: "/route",
      icon: Route,
      label: "Route",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className="flex-1"
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-16 flex flex-col items-center justify-center gap-1 rounded-none",
                  isActive && "text-primary bg-transparent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 