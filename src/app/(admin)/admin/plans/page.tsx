"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { formatCurrency, formatPricePerDay } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อแพลน"),
  days: z.coerce.number().min(1, "กรุณากรอกจำนวนวัน"),
  price: z.coerce.number().min(0, "กรุณากรอกราคา"),
});

type PlanForm = z.infer<typeof planSchema>;

interface Plan {
  id: string;
  name: string;
  days: number;
  price: number;
  isActive: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  /** แสดงแพลนที่ปิดแล้ว (soft delete เมื่อมีออเดอร์อ้างอิง) */
  const [showInactive, setShowInactive] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
  });

  useEffect(() => {
    fetchPlans();
  }, [showInactive]);

  const fetchPlans = () => {
    setLoading(true);
    const q = showInactive ? "?includeInactive=true" : "";
    fetch(`/api/plans${q}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setPlans(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const onSubmit = async (data: PlanForm) => {
    try {
      if (editingPlan) {
        const res = await fetch(`/api/plans/${editingPlan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert((err as { error?: string }).error || "บันทึกไม่สำเร็จ");
          return;
        }
      } else {
        const res = await fetch("/api/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...data, isActive: true }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert((err as { error?: string }).error || "เพิ่มแพลนไม่สำเร็จ");
          return;
        }
      }
      reset();
      setEditingPlan(null);
      await fetchPlans();
    } catch {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const togglePlanStatus = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/plans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert((err as { error?: string }).error || "อัปเดตสถานะไม่สำเร็จ");
      return;
    }
    fetchPlans();
  };

  const deletePlan = async (id: string) => {
    if (!confirm("ต้องการลบแพลนนี้? (ถ้ามีออเดอร์ที่อ้างอิง ระบบจะปิดใช้งานแทนการลบจริง)")) return;

    const res = await fetch(`/api/plans/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert((err as { error?: string }).error || "ลบไม่สำเร็จ");
      return;
    }

    const body = await res.json().catch(() => ({}));
    if (body.mode === "archived") {
      alert("แพลนนี้มีประวัติออเดอร์ — ระบบปิดใช้งานแทนการลบ (เปิด 'แสดงแพลนที่ปิดแล้ว' เพื่อดู)");
    }

    setEditingPlan((e) => (e?.id === id ? null : e));
    await fetchPlans();
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-wider mb-2">
            <span className="gradient-text">จัดการ</span> แพลน
          </h1>
          <p className="text-gray-400">เพิ่ม แก้ไข หรือลบแพลน</p>
          <label className="mt-4 flex items-center gap-2 cursor-pointer text-sm text-gray-400 select-none">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
            />
            แสดงแพลนที่ปิดแล้ว / เก็บถาวร (สำหรับกู้คืน)
          </label>
        </motion.div>

        <GlassCard className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {editingPlan ? "แก้ไขแพลน" : "เพิ่มแพลนใหม่"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <GlassInput
                label="ชื่อแพลน"
                placeholder="เช่น Canva Pro 30 วัน"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
            <div className="w-32">
              <GlassInput
                label="จำนวนวัน"
                type="number"
                placeholder="30"
                error={errors.days?.message}
                {...register("days")}
              />
            </div>
            <div className="w-40">
              <GlassInput
                label="ราคา (บาท)"
                type="number"
                placeholder="299"
                error={errors.price?.message}
                {...register("price")}
              />
            </div>
            <div className="flex items-end gap-2">
              <GlassButton type="submit">
                {editingPlan ? "บันทึก" : "เพิ่ม"}
              </GlassButton>
              {editingPlan && (
                <GlassButton type="button" variant="ghost" onClick={() => { setEditingPlan(null); reset(); }}>
                  ยกเลิก
                </GlassButton>
              )}
            </div>
          </form>
        </GlassCard>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className={`${!plan.isActive ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${plan.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {plan.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </span>
                  </div>
                  <p className="text-3xl font-bold gradient-text mb-2">{formatCurrency(plan.price)}</p>
                  <p className="text-gray-500">{plan.days} วัน</p>
                  <p className="text-sm text-cyan-400/80 mb-4 mt-1">
                    เฉลี่ย {formatPricePerDay(plan.price, plan.days)} บาท/วัน
                  </p>
                  <div className="flex gap-2">
                    <GlassButton size="sm" onClick={() => { setEditingPlan(plan); reset(plan); }}>
                      แก้ไข
                    </GlassButton>
                    <GlassButton size="sm" variant="ghost" onClick={() => togglePlanStatus(plan.id, plan.isActive)}>
                      {plan.isActive ? "ปิด" : "เปิด"}
                    </GlassButton>
                    <GlassButton size="sm" variant="ghost" className="text-red-400" onClick={() => deletePlan(plan.id)}>
                      ลบ
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
