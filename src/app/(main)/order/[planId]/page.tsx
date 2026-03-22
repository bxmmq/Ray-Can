"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { formatCurrency, formatPricePerDay } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadFiles } from "@/lib/uploadthing-client";

const orderSchema = z.object({
  canvaEmail: z.string().email("อีเมลไม่ถูกต้อง"),
});

type OrderForm = z.infer<typeof orderSchema>;

interface Plan {
  id: string;
  name: string;
  days: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
}

export default function OrderPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(900);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (planId) {
      fetch(`/api/plans`)
        .then((res) => res.json())
        .then((data) => {
          const foundPlan = data.find((p: Plan) => p.id === planId);
          setPlan(foundPlan || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [planId]);

  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  const onSubmitEmail = async (data: OrderForm) => {
    if (!plan) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          canvaEmail: data.canvaEmail,
        }),
      });

      if (res.ok) {
        const orderData = await res.json();
        setOrder(orderData);
        setStep(2);
        setCountdown(900);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    if (slipPreview) {
      URL.revokeObjectURL(slipPreview);
    }
    const localPreview = URL.createObjectURL(file);
    setSlipPreview(localPreview);

    setUploading(true);
    try {
      const uploaded = await uploadFiles("slipUploader", {
        files: [file],
      });
      const remoteUrl = uploaded[0]?.ufsUrl ?? uploaded[0]?.url;
      if (!remoteUrl) {
        throw new Error("อัปโหลดไม่สำเร็จ");
      }

      const patchRes = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: order.id,
          slipUrl: remoteUrl,
          status: "VERIFYING",
        }),
      });

      if (!patchRes.ok) {
        const err = await patchRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "บันทึกสลิปไม่สำเร็จ");
      }

      setOrder({ ...order, status: "VERIFYING" });
      setStep(3);
    } catch (error) {
      console.error("Error uploading slip:", error);
      URL.revokeObjectURL(localPreview);
      setSlipPreview(null);
      alert(error instanceof Error ? error.message : "อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center">
          <p className="text-gray-400">ไม่พบแพลนที่คุณเลือก</p>
          <GlassButton className="mt-4" onClick={() => router.push("/plans")}>
            กลับไปเลือกแพลน
          </GlassButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-wider mb-2">
            สั่งซื้อ <span className="gradient-text">{plan.name}</span>
          </h1>
          <p className="text-gray-400">
            {formatCurrency(plan.price)} · {plan.days} วัน
          </p>
          <p className="text-sm text-cyan-400/90 mt-1">
            เฉลี่ย {formatPricePerDay(plan.price, plan.days)} บาท/วัน
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step > s ? "bg-gradient-to-r from-violet-500 to-cyan-500" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">
                กรอกอีเมล Canva ของคุณ
              </h2>
              <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-6">
                <GlassInput
                  label="อีเมล Canva"
                  type="email"
                  placeholder="your@email.com"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  error={errors.canvaEmail?.message}
                  {...register("canvaEmail")}
                />
                <GlassButton type="submit" className="w-full" isLoading={loading}>
                  ดำเนินการต่อ
                </GlassButton>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <GlassCard className="text-center">
              <h2 className="text-xl font-semibold text-white mb-6">
                สแกน QR Code พร้อมเพย์
              </h2>
              <div className="bg-white p-6 rounded-xl inline-block mb-6">
                <QRCodeSVG
                  value={`https://promptpay.io/0812345678/${plan.price}`}
                  size={200}
                  level="H"
                />
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                {formatCurrency(plan.price)}
              </p>
              <p className="text-gray-400 mb-6">
                ชำระเงินภายใน 15 นาที
              </p>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 sm:p-8 text-center">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handleSlipUpload}
                  className="hidden"
                  id="slip-upload"
                  disabled={uploading}
                />

                {slipPreview && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-white/15 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slipPreview}
                      alt="ตัวอย่างสลิปที่เลือก"
                      className="w-full max-h-72 object-contain mx-auto"
                    />
                  </div>
                )}

                <label
                  htmlFor="slip-upload"
                  className={`cursor-pointer flex flex-col items-center gap-4 ${slipPreview ? "pt-2" : ""}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
                      <span className="text-sm text-gray-400">กำลังอัปโหลดไปยังเซิร์ฟเวอร์…</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-gray-400">
                        {slipPreview ? "เลือกรูปใหม่ (แทนที่)" : "อัปโหลดสลิปการโอนเงิน"}
                      </span>
                      <span className="text-xs text-gray-600">JPG, PNG, WebP สูงสุด ~4MB</span>
                    </>
                  )}
                </label>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard className="text-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                กำลังตรวจสอบการชำระเงิน
              </h2>
              <p className="text-gray-400 mb-6">
                ทีมงานจะตรวจสอบและอนุมัติภายใน 15-30 นาที
              </p>

              {countdown > 0 && (
                <div className="mb-8">
                  <p className="text-gray-500 text-sm mb-2">เวลาที่เหลือ</p>
                  <div className="text-4xl font-bold gradient-text">
                    {formatTime(countdown)}
                  </div>
                </div>
              )}

              <GlassButton variant="outline" onClick={() => router.push("/dashboard")}>
                ไปที่แดชบอร์ด
              </GlassButton>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
