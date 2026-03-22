"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "รวดเร็ว",
    description: "เปิดใช้งาน Canva Pro ภายในไม่กี่นาทีหลังยืนยันการชำระเงิน",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "ปลอดภัย",
    description: "การชำระเงินผ่าน PromptPay ที่ปลอดภัย 100% พร้อม QR Code",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "แนะนำเพื่อน",
    description: "แนะนำเพื่อนและรับส่วนลดพิเศษ ยิ่งแนะนำเยอะ ยิ่งคุ้มค่า",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "ติดตามอายุ",
    description: "ติดตามวันหมดอายุและรับการแจ้งเตือนล่วงหน้าได้ตลอดเวลา",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Canva Pro เต็มรูปแบบ",
    description: "เข้าถึงฟีเจอร์ทั้งหมดของ Canva Pro รวมถึง Brand Kit และ Templates",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "สนับสนุน 24/7",
    description: "ทีมงานพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง ทุกวัน",
  },
];

function FeatureCardBody({ feature }: { feature: (typeof features)[number] }) {
  return (
    <GlassCard variant="hover" className="h-full">
      <div className="text-violet-400 mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </GlassCard>
  );
}

const CAROUSEL_DURATION_MS = 520;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function Features() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setAtStart(scrollLeft <= 2);
    setAtEnd(max <= 2 || scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  useEffect(() => {
    return () => {
      if (scrollAnimRef.current !== null) {
        cancelAnimationFrame(scrollAnimRef.current);
      }
    };
  }, []);

  const scrollByDir = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el) return;

      if (scrollAnimRef.current !== null) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }

      const slides = Array.from(el.children) as HTMLElement[];
      if (slides.length === 0) return;

      const centerX = el.scrollLeft + el.clientWidth / 2;
      let active = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const mid = slide.offsetLeft + slide.offsetWidth / 2;
        const d = Math.abs(mid - centerX);
        if (d < bestDist) {
          bestDist = d;
          active = i;
        }
      });

      const next = Math.max(0, Math.min(slides.length - 1, active + dir));
      if (next === active) return;

      const slide = slides[next];
      const maxScroll = el.scrollWidth - el.clientWidth;
      const targetLeft = Math.max(
        0,
        Math.min(maxScroll, slide.offsetLeft + slide.offsetWidth / 2 - el.clientWidth / 2)
      );

      const startLeft = el.scrollLeft;
      const distance = targetLeft - startLeft;
      if (Math.abs(distance) < 2) return;

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        el.scrollLeft = targetLeft;
        updateScrollState();
        return;
      }

      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / CAROUSEL_DURATION_MS);
        el.scrollLeft = startLeft + distance * easeOutCubic(t);
        updateScrollState();
        if (t < 1) {
          scrollAnimRef.current = requestAnimationFrame(tick);
        } else {
          scrollAnimRef.current = null;
        }
      };
      scrollAnimRef.current = requestAnimationFrame(tick);
    },
    [updateScrollState]
  );

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-4">
            ทำไมต้อง <span className="gradient-text">Raycast</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            เรานำเสนอบริการ Canva Pro ที่คุ้มค่าที่สุด พร้อมฟีเจอร์เด่นมากมาย
          </p>
        </motion.div>

        {/* Mobile: horizontal slider + prev/next */}
        <div className="md:hidden flex items-stretch gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="การ์ดก่อนหน้า"
            disabled={atStart}
            onClick={() => scrollByDir(-1)}
            className={cn(
              "shrink-0 self-center flex h-11 w-11 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900/80 text-violet-300 shadow-lg backdrop-blur-sm transition",
              atStart ? "opacity-35 pointer-events-none" : "hover:bg-violet-500/15 active:scale-95"
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            ref={scrollerRef}
            className={cn(
              "min-w-0 flex-1 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="snap-center shrink-0 w-[min(100%,19rem)] sm:w-[min(100%,21rem)]"
              >
                <FeatureCardBody feature={feature} />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="การ์ดถัดไป"
            disabled={atEnd}
            onClick={() => scrollByDir(1)}
            className={cn(
              "shrink-0 self-center flex h-11 w-11 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900/80 text-violet-300 shadow-lg backdrop-blur-sm transition",
              atEnd ? "opacity-35 pointer-events-none" : "hover:bg-violet-500/15 active:scale-95"
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Tablet+ : grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCardBody feature={feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
