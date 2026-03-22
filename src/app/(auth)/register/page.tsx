"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { Suspense, useEffect } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      referralCode: "",
    },
  });

  useEffect(() => {
    const code = searchParams.get("ref")?.trim();
    if (code) setValue("referralCode", code);
  }, [searchParams, setValue]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/dashboard",
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <GlassInput
        label="ชื่อ"
        type="text"
        placeholder="ชื่อของคุณ"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        error={errors.name?.message}
        {...register("name")}
      />

      <GlassInput
        label="อีเมล"
        type="email"
        placeholder="example@email.com"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
        error={errors.email?.message}
        {...register("email")}
      />

      <GlassInput
        label="รหัสผ่าน"
        type="password"
        placeholder="••••••••"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        error={errors.password?.message}
        {...register("password")}
      />

      <GlassInput
        label="ยืนยันรหัสผ่าน"
        type="password"
        placeholder="••••••••"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <GlassInput
        label="รหัสแนะนำเพื่อน (ไม่บังคับ)"
        type="text"
        placeholder="เช่น ABC12XYZ หรือวางจากลิงก์แนะนำ"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        error={errors.referralCode?.message}
        {...register("referralCode")}
      />
      <p className="text-xs text-gray-500 -mt-2">
        กรอกรหัสที่เพื่อนส่งให้ เพื่อให้เพื่อนได้รับรางวัลเมื่อคุณลงทะเบียนและสั่งซื้อแพลน
      </p>

      <div className="flex items-start gap-2 text-sm text-gray-400">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-gray-600 bg-white/5"
          required
        />
        <span>
          ฉันยอมรับ{" "}
          <Link href="/terms" className="text-violet-400 hover:text-violet-300">
            ข้อกำหนดการใช้งาน
          </Link>{" "}
          และ{" "}
          <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
            นโยบายความเป็นส่วนตัว
          </Link>
        </span>
      </div>

      <GlassButton type="submit" className="w-full" isLoading={isSubmitting}>
        ลงทะเบียน
      </GlassButton>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#111] text-gray-500">หรือ</span>
        </div>
      </div>

      <GlassButton
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        ลงชื่อเข้าใช้ด้วย Google
      </GlassButton>

      <p className="mt-6 text-center text-sm text-gray-400">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <GlassCard className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wider mb-2">
              <span className="gradient-text">ลงทะเบียน</span>
            </h1>
            <p className="text-gray-400">สร้างบัญชีใหม่เพื่อเริ่มต้น</p>
          </div>

          <Suspense fallback={
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
            </div>
          }>
            <RegisterForm />
          </Suspense>
        </GlassCard>
      </motion.div>
    </div>
  );
}
