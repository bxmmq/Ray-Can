"use client";

import { useEffect, useState } from "react";
import { formatRemainingDaysHoursLabel } from "@/lib/utils";

type Props = {
  endDate: string | null;
  status: string;
};

/**
 * แสดงเวลาที่เหลือจนหมดอายุแพลน — อัปเดตทุก 1 นาที (ไม่ใช้ Date.now() ตอน SSR เพื่อกัน hydration mismatch)
 */
export function OrderRemainingTime({ endDate, status }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  const needsTimer = (status === "ACTIVE" || status === "EXPIRED") && Boolean(endDate);

  useEffect(() => {
    if (status !== "ACTIVE" && status !== "EXPIRED") {
      setLabel("—");
      return;
    }
    if (!endDate) {
      setLabel("ยังไม่มีวันหมดอายุ");
      return;
    }
    const tick = () => setLabel(formatRemainingDaysHoursLabel(endDate));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [endDate, status]);

  if (status !== "ACTIVE" && status !== "EXPIRED") {
    return <span className="text-gray-600 text-sm">—</span>;
  }

  if (!endDate) {
    return <span className="text-amber-400/90 text-sm">ยังไม่มีวันหมดอายุ</span>;
  }

  if (label === null && needsTimer) {
    return <span className="text-gray-500 text-sm">กำลังคำนวณ…</span>;
  }

  const isExpiredLabel = label === "หมดอายุแล้ว";

  return (
    <span
      className={`text-sm ${isExpiredLabel ? "text-gray-500" : "text-cyan-300/90"}`}
    >
      {label}
    </span>
  );
}
