import { SkeletonPlansGrid } from "@/components/ui/skeleton";

export default function PlansLoading() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="h-12 w-96 mx-auto bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] rounded animate-pulse" />
          <div className="h-4 w-96 mx-auto bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] rounded animate-pulse" />
        </div>
        <SkeletonPlansGrid count={4} />
      </div>
    </div>
  );
}
