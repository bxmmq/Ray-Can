"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore, type Toast } from "@/stores/toast-store";
import { toastTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: "text-green-400",
    progress: "bg-green-500",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "text-red-400",
    progress: "bg-red-500",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: "text-yellow-400",
    progress: "bg-yellow-500",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-400",
    progress: "bg-blue-500",
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = icons[toast.type];
  const color = colors[toast.type];
  const duration = toast.duration ?? 5000;

  return (
    <motion.div
      variants={toastTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "relative w-80 overflow-hidden rounded-xl border backdrop-blur-xl",
        color.bg,
        color.border
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", color.icon)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-xs text-gray-400">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="shrink-0 text-gray-500 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <motion.div
        className={cn("h-1", color.progress)}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
