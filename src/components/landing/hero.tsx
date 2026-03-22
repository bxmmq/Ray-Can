"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";

function useCountUp(
  target: number,
  active: boolean,
  options: { duration?: number; decimals?: number } = {}
) {
  const { duration = 2000, decimals = 0 } = options;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let startTime: number | null = null;
    let frame = 0;

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(t);
      const raw = target * eased;

      if (decimals > 0) {
        setValue(t >= 1 ? target : Math.round(raw * 10 ** decimals) / 10 ** decimals);
      } else {
        setValue(t >= 1 ? target : Math.floor(raw));
      }

      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, decimals]);

  return value;
}

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });

  const users = useCountUp(500, statsInView);
  const uptime = useCountUp(99.9, statsInView, { decimals: 1 });
  const supportHours = useCountUp(24, statsInView);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[128px] animate-pulse-glow" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-6">
            <span className="gradient-text">Canva Pro</span>
            <br />
            <span className="text-white">ราคาพิเศษสุด</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8"
        >
          บริการ Canva Pro คุณภาพสูง ราคาถูกกว่า พร้อมระบบแนะนำเพื่อนที่คุ้มค่า
          รับส่วนลดเมื่อแนะนำเพื่อน
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/plans">
            <GlassButton size="lg">
              เลือกแพลน
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </GlassButton>
          </Link>
          <Link href="/register">
            <GlassButton variant="outline" size="lg">
              ลงทะเบียนฟรี
            </GlassButton>
          </Link>
        </motion.div>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-gray-500"
        >
          <div className="text-center min-w-[5rem]">
            <p className="text-3xl font-bold text-white tabular-nums">
              {users}+
            </p>
            <p className="text-sm">ผู้ใช้งาน</p>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center min-w-[5rem]">
            <p className="text-3xl font-bold text-white tabular-nums">
              {uptime.toFixed(1)}%
            </p>
            <p className="text-sm">ออนไลน์</p>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center min-w-[5rem]">
            <p className="text-3xl font-bold text-white tabular-nums">
              {supportHours}/7
            </p>
            <p className="text-sm">สนับสนุน</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
