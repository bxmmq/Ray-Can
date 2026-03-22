"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassButton } from "@/components/ui/glass-button";

export function CTA() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-cyan-900/20" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass-gradient rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-6">
            พร้อมใช้งาน <span className="gradient-text">Canva Pro</span> แล้วหรือยัง?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            ลงทะเบียนวันนี้และเริ่มต้นใช้งาน Canva Pro ด้วยราคาที่เข้าถึงได้
            พร้อมระบบแนะนำเพื่อนที่คุ้มค่า
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <GlassButton size="lg">
                เริ่มต้นฟรี
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </GlassButton>
            </Link>
            <Link href="/plans">
              <GlassButton variant="outline" size="lg">
                ดูแพลนทั้งหมด
              </GlassButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
