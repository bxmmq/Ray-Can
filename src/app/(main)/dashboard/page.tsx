"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusBgColor } from "@/lib/utils";
import Link from "next/link";
import { SubscriptionCountdown } from "@/components/dashboard/subscription-countdown";
import { ReviewForm } from "@/components/reviews/review-form";

interface Order {
  id: string;
  canvaEmail: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  plan: {
    name: string;
    days: number;
    price: number;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        fetch("/api/orders").then((res) => res.json()),
        fetch("/api/notifications").then((res) => res.json()),
      ]).then(([ordersData, notificationsData]) => {
        setOrders(ordersData);
        setNotifications(notificationsData);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  const activeOrder = orders.find((o) => o.status === "ACTIVE");

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-wider mb-2">
            สวัสดี, <span className="gradient-text">{session?.user?.name}</span>
          </h1>
          <p className="text-gray-400">ยินดีต้อนรับกลับมาสู่ Raycast</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">สถานะ</p>
                  <p className="text-xl font-bold text-white">
                    {activeOrder ? "ใช้งานอยู่" : "ไม่มีการใช้งาน"}
                  </p>
                </div>
              </div>
              {activeOrder && activeOrder.endDate && (
                <SubscriptionCountdown endDate={activeOrder.endDate} />
              )}
              {activeOrder && !activeOrder.endDate && (
                <p className="text-gray-500 text-sm mt-2">กำลังใช้งาน — รออัปเดตวันหมดอายุ</p>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">คำสั่งซื้อทั้งหมด</p>
                  <p className="text-xl font-bold text-white">{orders.length}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">การแจ้งเตือน</p>
                  <p className="text-xl font-bold text-white">
                    {notifications.filter((n) => !n.isRead).length}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-1">รีวิวของคุณ</h2>
            <p className="text-gray-500 text-sm mb-6">
              แต่ละคำสั่งซื้อรีวิวได้ 1 ครั้ง — เลือกรายการด้านล่าง รีวิวจะแสดงในหน้าแรกเมื่อบันทึกแล้ว
            </p>
            <ReviewForm />
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">คำสั่งซื้อล่าสุด</h2>
                <Link href="/plans">
                  <GlassButton size="sm">ซื้อแพลนใหม่</GlassButton>
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">ยังไม่มีคำสั่งซื้อ</p>
                  <Link href="/plans">
                    <GlassButton variant="outline" size="sm">เลือกแพลนแรกของคุณ</GlassButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    >
                      <div>
                        <p className="text-white font-medium">{order.plan.name}</p>
                        <p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBgColor(order.status)}>
                          {order.status === "PENDING" && "รอชำระเงิน"}
                          {order.status === "VERIFYING" && "กำลังตรวจสอบ"}
                          {order.status === "ACTIVE" && "ใช้งานอยู่"}
                          {order.status === "EXPIRED" && "หมดอายุ"}
                          {order.status === "CANCELLED" && "ยกเลิก"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">การแจ้งเตือน</h2>

              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">ไม่มีการแจ้งเตือน</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl ${
                        notification.isRead ? "bg-white/5" : "bg-violet-500/10 border border-violet-500/20"
                      }`}
                    >
                      <p className="text-white font-medium">{notification.title}</p>
                      <p className="text-gray-500 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-600 text-xs mt-2">{formatDate(notification.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
