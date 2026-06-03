import { Skeleton } from "@/components/ui/skeleton";

export function PedidosLoading() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}
