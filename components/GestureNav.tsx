'use client';

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

interface GestureNavProps {
  children: ReactNode;
}

export function GestureNav({ children }: GestureNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100; // 스와이프 감지 임계값
    
    // 오른쪽으로 스와이프하면 뒤로가기
    if (info.offset.x > swipeThreshold) {
      router.back();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: 0, right: 100 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 