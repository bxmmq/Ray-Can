import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
        <div className="space-y-2">
          <div className="h-4 w-32 mx-auto bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
