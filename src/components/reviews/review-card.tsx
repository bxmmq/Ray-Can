"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/reviews/star-rating";

export type PublicReview = {
  id: string;
  rating: number;
  comment: string;
  title: string | null;
  user: { name: string | null; image: string | null };
};

export function ReviewCard({ review }: { review: PublicReview }) {
  const displayName = review.user.name?.trim() || "สมาชิก";
  const subtitle = review.title?.trim() || "ผู้ใช้งาน";

  return (
    <GlassCard className="h-full">
      <div className="mb-4">
        <StarRating value={review.rating} readOnly size="md" />
      </div>
      <p className="text-gray-300 mb-4">&ldquo;{review.comment}&rdquo;</p>
      <div className="flex items-center gap-3">
        <Avatar src={review.user.image} fallback={displayName} size="sm" />
        <div>
          <p className="text-white font-medium">{displayName}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
    </GlassCard>
  );
}
