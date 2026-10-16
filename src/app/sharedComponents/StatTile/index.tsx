import type { ReactNode } from "react";

export default function StatTile({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {icon && <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-soft text-xl text-accent-dark">{icon}</span>}
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate text-2xl font-extrabold text-brand">{value}</p>
      </div>
    </div>
  );
}
