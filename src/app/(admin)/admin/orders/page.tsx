"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, getStatusBgColor } from "@/lib/utils";
import { OrderRemainingTime } from "@/components/admin/order-remaining-time";

interface Order {
  id: string;
  canvaEmail: string;
  status: string;
  slipUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  plan: { name: string; price: number };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [slipModalUrl, setSlipModalUrl] = useState<string | null>(null);

  const closeSlipModal = useCallback(() => setSlipModalUrl(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSlipModal();
    };
    if (slipModalUrl) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [slipModalUrl, closeSlipModal]);

  useEffect(() => {
    fetch("/api/analytics?type=orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch("/api/orders/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-wider mb-2">
            <span className="gradient-text">จัดการ</span> คำสั่งซื้อ
          </h1>
          <p className="text-gray-400">ดูและจัดการคำสั่งซื้อทั้งหมด</p>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["ALL", "PENDING", "VERIFYING", "ACTIVE", "EXPIRED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status ? "bg-violet-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {status === "ALL" ? "ทั้งหมด" : status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <GlassCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ผู้ใช้</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">แพลน</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">อีเมล Canva</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">สถานะ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">เหลือเวลา</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">วันที่</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{order.user.email}</p>
                        <p className="text-gray-500 text-sm">{order.user.name || "ไม่มีชื่อ"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{order.plan.name}</p>
                        <p className="text-gray-500 text-sm">{formatCurrency(order.plan.price)}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{order.canvaEmail}</td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusBgColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <OrderRemainingTime endDate={order.endDate} status={order.status} />
                        {order.endDate && (
                          <p className="text-gray-600 text-xs mt-1">
                            หมดอายุ: {formatDateTime(order.endDate)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{formatDateTime(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          {order.slipUrl && (
                            <GlassButton
                              size="sm"
                              variant="outline"
                              type="button"
                              className="shrink-0"
                              onClick={() => setSlipModalUrl(order.slipUrl)}
                            >
                              <ImageIcon className="h-4 w-4" aria-hidden />
                              ดูสลิป
                            </GlassButton>
                          )}
                          {order.status === "PENDING" && (
                            <>
                              <GlassButton size="sm" onClick={() => updateOrderStatus(order.id, "VERIFYING")}>
                                ตรวจสอบ
                              </GlassButton>
                              <GlassButton size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "CANCELLED")}>
                                ยกเลิก
                              </GlassButton>
                            </>
                          )}
                          {order.status === "VERIFYING" && (
                            <>
                              <GlassButton size="sm" onClick={() => updateOrderStatus(order.id, "ACTIVE")}>
                                อนุมัติ
                              </GlassButton>
                              <GlassButton size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "CANCELLED")}>
                                ปฏิเสธ
                              </GlassButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>

      <AnimatePresence>
        {slipModalUrl && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="ดูรูปสลิปการชำระเงิน"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSlipModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative max-h-[90vh] w-full max-w-3xl rounded-2xl border border-white/15 bg-zinc-900/95 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">สลิปการชำระเงิน</p>
                <div className="flex items-center gap-2">
                  <a
                    href={slipModalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-violet-300 hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" />
                    เปิดในแท็บใหม่
                  </a>
                  <button
                    type="button"
                    onClick={closeSlipModal}
                    className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                    aria-label="ปิด"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[calc(90vh-5rem)] overflow-auto rounded-xl bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element -- remote UploadThing URL */}
                <img
                  src={slipModalUrl}
                  alt="สลิปการชำระเงิน"
                  className="mx-auto h-auto w-full max-w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
