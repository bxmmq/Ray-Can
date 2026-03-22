"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  className?: string;
};

const iconClass = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export function StarRating({
  value,
  onChange,
  size = "md",
  readOnly = false,
  className,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role={readOnly ? undefined : "radiogroup"}
      aria-label={readOnly ? undefined : "ให้คะแนนดาว"}
      onMouseLeave={() => !readOnly && setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} ดาว`}
            className={cn(
              "rounded p-0.5 transition-transform disabled:cursor-default",
              !readOnly && "hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            )}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
          >
            <svg
              className={cn(iconClass[size], filled ? "text-yellow-400" : "text-yellow-400/30")}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
