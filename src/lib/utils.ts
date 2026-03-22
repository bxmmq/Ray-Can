import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

/** ราคาเฉลี่ยต่อวัน (บาท) — ไม่มีสัญลักษณ์ ฿ เพื่อนำไปต่อท้าย "บาท/วัน" */
export function formatPricePerDay(price: number, days: number): string {
  if (!days || days <= 0) return "—";
  const perDay = price / days;
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: perDay >= 100 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(perDay);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calculateEndDate(startDate: Date, days: number): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  return endDate;
}

export function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** เหลือเวลาจนถึง endDate — ใช้กับนับถอยหลังแบบ วัน:ชม.:นาที:วินาที */
export function getCountdownFromEnd(endDate: Date | string): {
  done: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const end = new Date(endDate).getTime();
  const diff = end - Date.now();
  if (diff <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSec = Math.floor(diff / 1000);
  const seconds = totalSec % 60;
  const minutes = Math.floor(totalSec / 60) % 60;
  const hours = Math.floor(totalSec / 3600) % 24;
  const days = Math.floor(totalSec / 86400);
  return { done: false, days, hours, minutes, seconds };
}

/** ข้อความเหลือเวลาแบบ วัน + ชม. (แอดมิน / รายการออเดอร์) */
export function formatRemainingDaysHoursLabel(endDate: Date | string): string {
  const c = getCountdownFromEnd(endDate);
  if (c.done) return "หมดอายุแล้ว";
  if (c.days === 0 && c.hours === 0) {
    if (c.minutes <= 0) return "น้อยกว่า 1 นาที";
    return `เหลือ ${c.minutes} นาที`;
  }
  return `เหลือ ${c.days} วัน ${c.hours} ชม.`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "text-yellow-500",
    VERIFYING: "text-blue-500",
    ACTIVE: "text-green-500",
    EXPIRED: "text-gray-500",
    CANCELLED: "text-red-500",
  };
  return colors[status] || "text-gray-500";
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500",
    VERIFYING: "bg-blue-500/10 text-blue-500",
    ACTIVE: "bg-green-500/10 text-green-500",
    EXPIRED: "bg-gray-500/10 text-gray-500",
    CANCELLED: "bg-red-500/10 text-red-500",
  };
  return colors[status] || "bg-gray-500/10 text-gray-500";
}
