"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <GlassCard className="max-w-lg w-full text-center p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="text-8xl md:text-9xl font-bold gradient-text mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            404
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <svg
              className="w-24 h-24 mx-auto text-violet-500/30 mb-4"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path
                d="M35 45C35 45 40 35 50 35C60 35 65 45 65 45"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="38" cy="40" r="3" fill="currentColor" />
              <circle cx="62" cy="40" r="3" fill="currentColor" />
              <path
                d="M40 65C40 65 45 60 50 60C55 60 60 65 60 65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            หน้าที่คุณค้นหาไม่พบ
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            ดูเหมือนว่าหน้าที่คุณกำลังมองหาไม่มีอยู่ในระบบของเรา
            <br />
            หรืออาจถูกย้ายไปที่อื่นแล้ว
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/">
              <GlassButton size="lg">กลับหน้าหลัก</GlassButton>
            </Link>
            <Link href="/plans">
              <GlassButton variant="outline" size="lg">ดูแพลนราคา</GlassButton>
            </Link>
          </motion.div>
        </motion.div>
      </GlassCard>
    </div>
  );
}
