"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

interface Referral {
  id: string;
  referred: {
    name: string | null;
    email: string;
  };
  reward: number;
  status: string;
  createdAt: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  referralCount: number;
}

export default function ReferralPage() {
  const { data: session } = useSession();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/referrals")
        .then((res) => res.json())
        .then((data) => {
          setReferrals(data.referrals || []);
          setLeaderboard(data.leaderboard || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const myCode = session?.user?.referralCode ?? "";
  const referralLink =
    typeof window !== "undefined" && myCode
      ? `${window.location.origin}/register?ref=${encodeURIComponent(myCode)}`
      : "";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCodeOnly = async () => {
    if (!myCode) return;
    await navigator.clipboard.writeText(myCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const totalReward = referrals.reduce((sum, r) => sum + r.reward, 0);

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-wider mb-4">
            แนะนำ <span className="gradient-text">เพื่อน</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            แนะนำเพื่อนและรับส่วนลดพิเศษ ยิ่งแนะนำเยอะ ยิ่งคุ้มค่า
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-gray-400 mb-2">รางวัลต่อการแนะนำ</h3>
              <p className="text-3xl font-bold gradient-text">50 บาท</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-gray-400 mb-2">จำนวนที่แนะนำ</h3>
              <p className="text-3xl font-bold text-white">{referrals.length}</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-400 mb-2">รางวัลสะสม</h3>
              <p className="text-3xl font-bold gradient-text">{totalReward} บาท</p>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">รหัสแนะนำของคุณ</h2>
            <p className="text-gray-400 text-sm mb-3">
              ให้เพื่อนกรอกรหัสนี้ในหน้าลงทะเบียน หรือส่งลิงก์ด้านล่าง
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
              <div className="flex-1 px-4 py-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                <p className="text-xs text-violet-300/80 mb-1">รหัส (คัดลอกส่งในแชทได้)</p>
                <p className="text-2xl font-bold tracking-wider text-white font-mono break-all">
                  {myCode || "—"}
                </p>
              </div>
              <GlassButton type="button" onClick={copyCodeOnly} disabled={!myCode}>
                {codeCopied ? "คัดลอกรหัสแล้ว!" : "คัดลอกรหัส"}
              </GlassButton>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">ลิงก์แนะนำ</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
              />
              <GlassButton type="button" onClick={copyToClipboard} disabled={!referralLink}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? "คัดลอกแล้ว!" : "คัดลอกลิงก์"}
              </GlassButton>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              เมื่อเพื่อนลงทะเบียน (ด้วยรหัสหรือลิงก์) และซื้อแพลน คุณจะได้รับรางวัล 50 บาทเมื่อออเดอร์ได้รับการอนุมัติ
            </p>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">รายการแนะนำ</h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
                </div>
              ) : referrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">ยังไม่มีการแนะนำ</p>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{referral.referred.name || referral.referred.email}</p>
                        <p className="text-gray-500 text-sm">{new Date(referral.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">+{referral.reward} บาท</p>
                        <p className={`text-sm ${referral.status === "COMPLETED" ? "text-green-400" : "text-yellow-400"}`}>
                          {referral.status === "COMPLETED" ? "สำเร็จ" : "รอดำเนินการ"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                อันดับนำ
              </h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-gray-500 text-center py-8">ยังไม่มีผู้นำ</p>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        index === 0 ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? "bg-yellow-500 text-black" : "bg-white/10 text-gray-400"
                        }`}>
                          {index + 1}
                        </span>
                        <p className="text-white font-medium">{entry.name}</p>
                      </div>
                      <p className="text-cyan-400 font-medium">{entry.referralCount} คน</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
