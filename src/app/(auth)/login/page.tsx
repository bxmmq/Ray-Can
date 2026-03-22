"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { toast } from "@/stores/toast-store";

const loginSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const raw = searchParams.get("callbackUrl");
    const safe =
      raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
    router.replace(safe);
  }, [status, searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // NextAuth อาจคืน res.ok === true แม้ล็อกอินล้มเหลว (200 + URL มี ?error=...)
      // ต้องดู result.error — ถ้ามีแปลว่าเข้าไม่ได้
      if (result?.ok && !result?.error) {
        toast.success("เข้าสู่ระบบสำเร็จ", "กำลังพาไปที่แดชบอร์ด…", 2500);
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const code = result?.code;

      if (code === "oauth_only") {
        toast.error(
          "เข้าสู่ระบบไม่สำเร็จ",
          "บัญชีนี้ลงทะเบียนด้วย Google — กรุณาใช้ปุ่ม «ลงชื่อเข้าใช้ด้วย Google» แทน"
        );
        return;
      }

      if (code === "invalid_credentials" || result?.error === "CredentialsSignin") {
        toast.error(
          "เข้าสู่ระบบไม่สำเร็จ",
          "อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่มีบัญชีในระบบ"
        );
        return;
      }

      toast.error(
        "เข้าสู่ระบบไม่สำเร็จ",
        result?.error ? `รหัสข้อผิดพลาด: ${result.error}` : "เกิดข้อผิดพลาด กรุณาลองใหม่"
      );
    } catch {
      toast.error("เชื่อมต่อไม่สำเร็จ", "ตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="animate-spin w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

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
              <span className="gradient-text">เข้าสู่ระบบ</span>
            </h1>
            <p className="text-gray-400">ยินดีต้อนรับกลับมา</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/5" />
                จดจำการเข้าสู่ระบบ
              </label>
              <Link href="/forgot-password" className="text-violet-400 hover:text-violet-300">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <GlassButton
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </GlassButton>

            {isSubmitting && (
              <p className="text-center text-xs text-violet-300/80" aria-live="polite">
                กำลังตรวจสอบอีเมลและรหัสผ่านกับเซิร์ฟเวอร์…
              </p>
            )}

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
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300">
              ลงทะเบียน
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <div className="animate-spin w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
