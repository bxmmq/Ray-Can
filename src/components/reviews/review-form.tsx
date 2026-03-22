"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { GlassButton } from "@/components/ui/glass-button";
import { StarRating } from "@/components/reviews/star-rating";

type OrderReview = {
  id: string;
  rating: number;
  comment: string;
  title: string | null;
};

type EligibleOrderRow = {
  orderId: string;
  planName: string;
  createdAt: string;
  review: OrderReview | null;
};

type MeResponse = {
  eligibleOrders: EligibleOrderRow[];
  canReview: boolean;
};

function formatMeApiError(message: string) {
  const m = message.trim();
  if (m === "Failed" || m.length === 0) {
    return "โหลดข้อมูลรีวิวไม่สำเร็จ — ลองกด «ลองอีกครั้ง» หรือรัน: npx prisma db push (อัปเดตตารางในฐานข้อมูล)";
  }
  return m;
}

function formatOrderLabel(o: EligibleOrderRow) {
  const d = new Date(o.createdAt);
  const dateStr = d.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const status = o.review ? "รีวิวแล้ว" : "ยังไม่รีวิว";
  return `${o.planName} · ${dateStr} (${status})`;
}

export function ReviewForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetch("/api/reviews/me", { credentials: "include", cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          setMe(null);
          return null;
        }
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const raw =
            typeof (data as { error?: string })?.error === "string"
              ? (data as { error: string }).error
              : "โหลดข้อมูลรีวิวไม่สำเร็จ";
          setLoadError(formatMeApiError(raw));
          setMe(null);
          return null;
        }
        if (
          !data ||
          typeof (data as MeResponse).canReview !== "boolean" ||
          !Array.isArray((data as MeResponse).eligibleOrders)
        ) {
          setLoadError("ข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง กรุณารีเฟรชหน้า");
          setMe(null);
          return null;
        }
        return data as MeResponse;
      })
      .then((data: MeResponse | null) => {
        if (!data) return;
        setMe(data);
      })
      .catch(() => {
        setLoadError("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
        setMe(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /** รอ session + มีตัวตนผู้ใช้ (id หรือ email) ก่อนโหลด */
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      setMe(null);
      setLoading(false);
      return;
    }
    if (sessionStatus === "authenticated") {
      if (!session?.user?.id && !session?.user?.email) {
        setLoading(false);
        setLoadError("ไม่พบข้อมูลบัญชีในเซสชัน กรุณาออกจากระบบแล้วเข้าใหม่");
        return;
      }
      load();
    }
  }, [sessionStatus, session?.user?.id, session?.user?.email, load]);

  /** เลือกคำสั่งซื้อเริ่มต้น: รายการที่ยังไม่รีวิวก่อน ไม่มีค่อยเลือกรายการล่าสุด */
  useEffect(() => {
    if (!me?.eligibleOrders?.length) {
      setSelectedOrderId(null);
      return;
    }
    setSelectedOrderId((prev) => {
      if (prev && me.eligibleOrders.some((o) => o.orderId === prev)) {
        return prev;
      }
      const without = me.eligibleOrders.find((o) => !o.review);
      return (without ?? me.eligibleOrders[0]).orderId;
    });
  }, [me]);

  const selected = useMemo(
    () => me?.eligibleOrders.find((o) => o.orderId === selectedOrderId) ?? null,
    [me, selectedOrderId]
  );

  /** เปลี่ยนคำสั่งซื้อหรือโหลด me ใหม่ → เติมฟอร์มจากรีวิวของรายการที่เลือก */
  useEffect(() => {
    if (!me || !selectedOrderId) return;
    const row = me.eligibleOrders.find((o) => o.orderId === selectedOrderId);
    if (!row) return;
    if (row.review) {
      setRating(row.review.rating);
      setComment(row.review.comment);
      setTitle(row.review.title ?? "");
    } else {
      setRating(5);
      setComment("");
      setTitle("");
    }
  }, [me, selectedOrderId]);

  const hasReviewForSelected = Boolean(selected?.review);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const method = hasReviewForSelected ? "PATCH" : "POST";
      const res = await fetch("/api/reviews", {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId,
          rating,
          comment,
          title: title.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "บันทึกไม่สำเร็จ");
      }
      setSuccess(hasReviewForSelected ? "อัปเดตรีวิวแล้ว" : "ขอบคุณสำหรับรีวิว!");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <p className="text-red-400 text-sm">{loadError}</p>
        <GlassButton type="button" size="sm" variant="outline" onClick={() => load()}>
          ลองอีกครั้ง
        </GlassButton>
      </div>
    );
  }

  if (!me) {
    return (
      <p className="text-gray-400 text-sm">
        <a href="/login" className="text-violet-400 hover:underline">
          เข้าสู่ระบบ
        </a>{" "}
        เพื่อเขียนรีวิว
      </p>
    );
  }

  if (!me.canReview) {
    return (
      <p className="text-gray-400 text-sm leading-relaxed">
        รีวิวได้เมื่อมีคำสั่งซื้อที่<strong className="text-gray-300">ชำระแล้ว</strong> (สถานะ รอตรวจสอบ /
        ใช้งานอยู่ / ครบระยะเวลา) —{" "}
        <a href="/plans" className="text-violet-400 hover:underline">
          เลือกแพลน
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="review-order" className="text-gray-400 text-sm block mb-1">
          คำสั่งซื้อที่รีวิว <span className="text-violet-400/90">(แต่ละรอบซื้อรีวิวได้ 1 ครั้ง)</span>
        </label>
        <select
          id="review-order"
          value={selectedOrderId ?? ""}
          onChange={(e) => {
            setSelectedOrderId(e.target.value || null);
            setError(null);
            setSuccess(null);
          }}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          {me.eligibleOrders.map((o) => (
            <option key={o.orderId} value={o.orderId} className="bg-zinc-900">
              {formatOrderLabel(o)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-2">คะแนน</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <div>
        <label htmlFor="review-title" className="text-gray-400 text-sm block mb-1">
          บทบาท / อาชีพ <span className="text-gray-600">(ไม่บังคับ)</span>
        </label>
        <input
          id="review-title"
          type="text"
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="เช่น Freelancer, นักออกแบบ"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
      </div>
      <div>
        <label htmlFor="review-comment" className="text-gray-400 text-sm block mb-1">
          รีวิวของคุณ
        </label>
        <textarea
          id="review-comment"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="แชร์ประสบการณ์อย่างน้อย 10 ตัวอักษร..."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y min-h-[100px]"
        />
        <p className="text-gray-600 text-xs mt-1">{comment.length}/2000</p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-emerald-400 text-sm">{success}</p>}

      <GlassButton
        type="submit"
        disabled={saving || !selectedOrderId || comment.trim().length < 10}
        isLoading={saving}
      >
        {hasReviewForSelected ? "บันทึกการแก้ไข" : "ส่งรีวิว"}
      </GlassButton>

      {me.eligibleOrders.length > 1 && (
        <p className="text-gray-600 text-xs">
          เลือกคำสั่งซื้อแต่ละรายการแยกกัน — แต่ละรอบซื้อรีวิวได้ 1 ครั้ง
        </p>
      )}
    </form>
  );
}
