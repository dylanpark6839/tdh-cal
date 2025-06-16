'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calculator, AlertTriangle, Info, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      active: pathname === '/',
      disabled: false
    },
    {
      href: '/waypoints',
      label: 'TDH Cal',
      icon: Calculator,
      active: pathname === '/waypoints',
      disabled: false
    },
    {
      href: '/weather',
      label: '기상확인',
      icon: Cloud,
      active: pathname === '/weather',
      disabled: false
    },
    {
      href: '/notam',
      label: 'NOTAM',
      icon: AlertTriangle,
      active: pathname === '/notam',
      disabled: true
    },
    {
      href: '/about',
      label: 'About',
      icon: Info,
      active: pathname === '/about',
      disabled: false
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-t">
      <div className="flex justify-around items-center min-h-[4rem]">
        {links.map(({ href, label, icon: Icon, active, disabled }) => (
          <Link
            key={href}
            href={disabled ? '#' : href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2",
              active ? "text-blue-600" : "text-gray-600",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white/80" />
    </nav>
  );
} 