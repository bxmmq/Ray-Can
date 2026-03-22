"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, getStatusBgColor } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalReferrals: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session?.user?.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
          setChartData(data.chartData || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.role]);

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
            <span className="gradient-text">Admin</span> Dashboard
          </h1>
          <p className="text-gray-400">จัดการระบบและดูสถิติ</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: "คำสั่งซื้อทั้งหมด", value: stats.totalOrders, color: "violet" },
            { label: "ใช้งานอยู่", value: stats.activeOrders, color: "green" },
            { label: "รอตรวจสอบ", value: stats.pendingOrders, color: "yellow" },
            { label: "รายได้ทั้งหมด", value: formatCurrency(stats.totalRevenue), color: "gradient" },
            { label: "ผู้ใช้ทั้งหมด", value: stats.totalUsers, color: "pink" },
            { label: "การแนะนำทั้งหมด", value: stats.totalReferrals, color: "purple" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <GlassCard>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color === "gradient" ? "gradient-text" : "text-white"}`}>
                  {stat.value}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">รายได้รายวัน</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">คำสั่งซื้อล่าสุด</h2>
                <Link href="/admin/orders">
                  <GlassButton variant="ghost" size="sm">ดูทั้งหมด</GlassButton>
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{order.user?.email}</p>
                      <p className="text-gray-500 text-sm">{order.plan?.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBgColor(order.status)}>{order.status}</Badge>
                      <p className="text-gray-500 text-sm mt-1">{formatCurrency(order.plan?.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6">ลิงก์ด่วน</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: "/admin/orders", label: "คำสั่งซื้อ", color: "violet" },
                { href: "/admin/plans", label: "แพลน", color: "cyan" },
                { href: "/admin/users", label: "ผู้ใช้", color: "green" },
                { href: "/admin/analytics", label: "สถิติ", color: "yellow" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-center">
                    <p className="text-white font-medium">{link.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
