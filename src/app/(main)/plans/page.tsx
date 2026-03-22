"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { formatCurrency, formatPricePerDay } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  days: number;
  price: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(Array.isArray(data) ? data : Array.isArray(data?.plans) ? data.plans : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const popularPlan = plans[1] || plans[0];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-4">
            เลือก <span className="gradient-text">แพลน</span> ของคุณ
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            เลือกแพลนที่เหมาะกับความต้องการของคุณ ราคาพิเศษสำหรับ Canva Pro
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  variant={plan.id === popularPlan?.id ? "gradient" : "default"}
                  className={`h-full relative ${
                    plan.id === popularPlan?.id ? "border-violet-500/50" : ""
                  }`}
                >
                  {plan.id === popularPlan?.id && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        ยอดนิยม
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold gradient-text">
                        {formatCurrency(plan.price)}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-2">{plan.days} วัน</p>
                    <p className="text-sm text-cyan-400/90 mt-1 font-medium">
                      เฉลี่ย {formatPricePerDay(plan.price, plan.days)} บาท/วัน
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Canva Pro เต็มรูปแบบ
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Brand Kit
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Premium Templates
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ระยะเวลา {plan.days} วัน
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      สนับสนุน 24/7
                    </li>
                  </ul>

                  <Link href={`/order/${plan.id}`} className="block">
                    <GlassButton
                      className="w-full"
                      variant={plan.id === popularPlan?.id ? "primary" : "outline"}
                    >
                      เลือกแพลนนี้
                    </GlassButton>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            ต้องการแพลนที่กำหนดเอง?{" "}
            <a
              href="https://line.me/R/ti/p/@094tyojf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              ติดต่อเรา
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
