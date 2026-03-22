"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  referralCount: number;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics?type=users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-wider mb-2">
            <span className="gradient-text">จัดการ</span> ผู้ใช้
          </h1>
          <p className="text-gray-400">ดูรายชื่อผู้ใช้ทั้งหมด</p>
        </motion.div>

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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">บทบาท</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">คำสั่งซื้อ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">การแนะนำ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">เข้าร่วม</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={null} fallback={user.name || user.email} size="sm" />
                          <div>
                            <p className="text-white font-medium">{user.name || "ไม่มีชื่อ"}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === "ADMIN" ? "warning" : "default"}>
                          {user.role === "ADMIN" ? "แอดมิน" : "ผู้ใช้"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user._count.orders}</td>
                      <td className="px-6 py-4 text-gray-300">{user.referralCount}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
