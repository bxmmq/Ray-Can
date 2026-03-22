"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { BrandMark } from "@/components/layout/brand-mark";
import { usePathname } from "next/navigation";

export function AdminNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]">
        <nav className="glass border-b border-white/10" aria-label="Admin">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 min-w-0">
                <Link href="/admin" className="flex items-center gap-2 min-w-0">
                  <BrandMark />
                  <span className="text-xl font-bold gradient-text tracking-wider truncate">Raycast</span>
                  <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-violet-400/90 px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30 shrink-0">
                    Admin
                  </span>
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Link href="/" className="text-sm text-gray-400 hover:text-white">
                  กลับหน้าแรก
                </Link>
                {session && (
                  <div className="flex items-center gap-2">
                    <Avatar src={session.user?.image} fallback={session.user?.name || "A"} size="sm" />
                    <span className="text-sm font-medium text-gray-300">{session.user?.name}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
                className="md:hidden p-3 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-hidden
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="เมนู Admin"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="fixed left-0 right-0 top-16 bottom-0 z-[90] flex min-h-0 flex-col md:hidden border-t border-white/10 bg-[#0a0a0a]/92 backdrop-blur-xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-[#0a0a0a]/80"
            >
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-6">
                <Link
                  href="/"
                  className="flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium text-gray-200 hover:bg-white/10 border border-transparent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  กลับหน้าแรก
                </Link>
              </div>
              {session && (
                <div className="shrink-0 border-t border-white/10 bg-[#080808]/90 px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-3 backdrop-blur-md">
                  <Avatar src={session.user?.image} fallback={session.user?.name || "A"} size="sm" />
                  <span className="text-sm font-medium text-gray-300 truncate">{session.user?.name}</span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
