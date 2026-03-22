"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ReviewCard, type PublicReview } from "@/components/reviews/review-card";

export function Testimonials() {
  const { status: sessionStatus } = useSession();
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { reviews?: PublicReview[] }) => {
        setReviews(data.reviews ?? []);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

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
            รีวิวจาก <span className="gradient-text">ผู้ใช้งาน</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            ฟังจากผู้ใช้งานจริงที่ไว้วางใจเรา
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <GlassCard>
              <p className="text-gray-300 mb-4">ยังไม่มีรีวิว — ทดลองใช้บริการแล้วมาแบ่งปันประสบการณ์กัน</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {sessionStatus === "authenticated" ? (
                  <Link href="/dashboard">
                    <GlassButton size="sm">ไปที่แดชบอร์ดเพื่อเขียนรีวิว</GlassButton>
                  </Link>
                ) : sessionStatus === "loading" ? (
                  <span className="text-gray-500 text-sm py-2">กำลังโหลด…</span>
                ) : (
                  <Link href="/login">
                    <GlassButton size="sm">เข้าสู่ระบบเพื่อรีวิว</GlassButton>
                  </Link>
                )}
                <Link href="/plans">
                  <GlassButton size="sm" variant="outline">
                    เลือกแพลน
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 12).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
