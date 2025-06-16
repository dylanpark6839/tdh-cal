'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 2초 후에 스플래시 스크린 숨김

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#B3E0FF]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
        >
          <img
            src="/icons/icon-384x384.png"
            alt="Flight Planning Calculator"
            className="h-32 w-32 md:h-40 md:w-40"
          />
        </motion.div>
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-[#1a1a1a]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Flight Planning Calculator
        </motion.h1>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-4"
        >
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/30">
            <motion.div
              className="h-full bg-[#2E8B57]"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 