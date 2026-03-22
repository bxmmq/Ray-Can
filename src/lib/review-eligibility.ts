import type { OrderStatus } from "@prisma/client";

/**
 * สถานะคำสั่งซื้อที่ถือว่าเป็นผู้ใช้บริการแล้ว (มีสิทธิ์รีวิว)
 * ใช้ string literal ให้ตรง enum ใน schema — กันปัญหา bundle ทำให้ OrderStatus จาก runtime ผิดปกติ
 */
export const REVIEW_ELIGIBLE_STATUSES: OrderStatus[] = [
  "VERIFYING",
  "ACTIVE",
  "EXPIRED",
];
