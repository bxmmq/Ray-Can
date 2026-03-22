"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { AlertTriangle, Home, Mail } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col antialiased">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <GlassCard className="max-w-lg w-full text-center p-8 md:p-12">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                เกิดข้อผิดพลาด
              </h1>
              <p className="text-gray-400 mb-2">
                ขออภัย มีบางอย่างผิดพลาดและเราไม่สามารถดำเนินการต่อได้
              </p>
              {error?.digest && (
                <p className="text-xs text-gray-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={reset}>
                <GlassButton size="lg">ลองใหม่อีกครั้ง</GlassButton>
              </button>
              <Link href="/">
                <GlassButton variant="outline" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  กลับหน้าหลัก
                </GlassButton>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-500 mb-4">
                หากปัญหายังคงอยู่ กรุณาติดต่อเรา
              </p>
              <a
                href="mailto:support@raycast.app"
                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@raycast.app
              </a>
            </div>
          </GlassCard>
        </div>
      </body>
    </html>
  );
}
