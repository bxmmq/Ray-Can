"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: "bg-green-500/20 border-green-500 text-green-500",
    error: "bg-red-500/20 border-red-500 text-red-500",
    info: "bg-blue-500/20 border-blue-500 text-blue-500",
    warning: "bg-yellow-500/20 border-yellow-500 text-yellow-500",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.3 }}
          className={cn(
            "fixed bottom-4 right-4 px-6 py-3 rounded-xl border backdrop-blur-xl z-50",
            types[type]
          )}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
