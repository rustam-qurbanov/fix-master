import Link from "next/link";
import type { MasterProfileCard } from "@/lib/types";

export function MasterCard({ master }: { master: MasterProfileCard }) {
  return (
    <Link
      href={`/masters/${master.user_id}`}
      className="ticket ticket-enter group block p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-signal/30"
    >
      <div className="flex items-center gap-4">
        <img
          src={master.avatar_url ?? "/avatar-placeholder.svg"}
          alt={master.full_name}
          className="h-14 w-14 rounded-full border-2 border-border-main/50 object-cover shadow-xs transition-transform duration-300 group-hover:scale-105"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-bold text-ink truncate group-hover:text-signal transition-colors duration-200">
            {master.full_name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium text-steel">{master.city}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border-main/60 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {master.categories.slice(0, 2).map((c) => (
            <span
              key={c.id}
              className="text-[10px] font-bold uppercase tracking-wider text-steel bg-canvas px-2.5 py-1 rounded-lg"
            >
              {c.name}
            </span>
          ))}
          {master.categories.length > 2 && (
            <span className="text-[10px] font-bold text-steel bg-canvas px-2.5 py-1 rounded-lg">
              +{master.categories.length - 2}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase font-bold tracking-wider text-steel leading-none">Ставка</p>
          <p className="font-mono text-base font-bold text-signal mt-1">
            {master.price_from}–{master.price_to}
          </p>
        </div>
      </div>
    </Link>
  );
}

