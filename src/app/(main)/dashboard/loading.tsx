import { SkeletonDashboard } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkeletonDashboard />
      </div>
    </div>
  );
}
