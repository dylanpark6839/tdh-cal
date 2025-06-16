import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlertTriangle, Info, Calculator, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

interface NavigationProps {
  isFullscreen?: boolean;
}

type NavIcon = LucideIcon | FC;

interface NavItem {
  href: string;
  icon: NavIcon;
  label: string;
  isActive: (path: string) => boolean;
  disabled: boolean;
}

export function Navigation({ isFullscreen = false }: NavigationProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      isActive: (path: string) => path === '/',
      disabled: false
    },
    {
      href: '/waypoints',
      icon: Calculator,
      label: 'TDH Cal',
      isActive: (path: string) => path === '/waypoints',
      disabled: false
    },
    {
      href: '/weather',
      icon: Cloud,
      label: '기상확인',
      isActive: (path: string) => path === '/weather',
      disabled: false
    },
    {
      href: '/notam',
      icon: AlertTriangle,
      label: 'NOTAM',
      isActive: (path: string) => path === '/notam',
      disabled: true
    },
    {
      href: '/about',
      icon: Info,
      label: 'About',
      isActive: (path: string) => path === '/about',
      disabled: false
    }
  ];

  if (isFullscreen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-4">
      {navItems.map((item) => {
        const isActive = item.isActive(pathname);
        const Icon = item.icon;
        return (
          <Link 
            key={item.href} 
            href={item.disabled ? '#' : item.href}
            className={cn(
              "flex flex-col items-center",
              item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <Icon 
              className={cn(
                "h-6 w-6",
                isActive ? "text-blue-500" : "text-gray-500"
              )} 
            />
            <span 
              className={cn(
                "text-xs mt-1",
                isActive ? "text-blue-500" : "text-gray-500"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
} 