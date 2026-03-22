"use client";

import { useEffect, useState } from "react";
import { getCountdownFromEnd } from "@/lib/utils";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

type Props = {
  endDate: string;
};

/**
 * นับถอยหลังจนถึงวันหมดอายุแพลน (หลัง admin อนุมัติ — ใช้ order.endDate)
 */
export function SubscriptionCountdown({ endDate }: Props) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const c = getCountdownFromEnd(endDate);

  if (c.done) {
    return (
      <p className="text-amber-400/90 text-sm font-medium mt-2">หมดเวลาใช้งานแล้ว — รอระบบอัปเดตสถานะ</p>
    );
  }

  const blocks = [
    { value: String(c.days), label: "วัน" },
    { value: pad(c.hours), label: "ชม." },
    { value: pad(c.minutes), label: "นาที" },
    { value: pad(c.seconds), label: "วินาที" },
  ];

  return (
    <div className="mt-3">
      <p className="text-gray-500 text-xs mb-2">เหลือเวลาใช้งาน</p>
      <div className="grid grid-cols-4 gap-2 max-w-xs sm:max-w-sm">
        {blocks.map((b) => (
          <div
            key={b.label}
            className="rounded-lg bg-white/5 border border-white/10 px-1.5 py-2 text-center"
          >
            <span className="text-lg font-semibold tabular-nums text-white block">{b.value}</span>
            <span className="text-[10px] text-gray-500">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
