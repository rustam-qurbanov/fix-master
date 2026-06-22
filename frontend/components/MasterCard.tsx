import Link from "next/link";
import type { MasterProfileCard } from "@/lib/types";

function ticketNumber(id: string) {
  return id.replace(/-/g, "").slice(-5).toUpperCase();
}

export function MasterCard({ master }: { master: MasterProfileCard }) {
  return (
    <Link
      href={`/masters/${master.user_id}`}
      className="ticket ticket-enter group block p-5 pt-6 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <img
          src={master.avatar_url ?? "/avatar-placeholder.svg"}
          alt={master.full_name}
          className="h-12 w-12 border border-ink/15 object-cover"
        />
        <div>
          <p className="font-display text-lg font-bold uppercase leading-tight">
            {master.full_name}
          </p>
          <p className="text-sm text-steel">{master.city}</p>
        </div>
      </div>

      <div className="cut-line mt-4 flex items-center justify-between pt-3">
        <span className="font-mono text-xs text-steel">
          №&nbsp;{ticketNumber(master.user_id)}
        </span>
        <span className="font-mono text-base font-medium">
          {master.price_from}–{master.price_to}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {master.categories.map((c) => (
          <span
            key={c.id}
            className="font-mono text-[11px] uppercase tracking-wide text-steel before:mr-1 before:content-['#']"
          >
            {c.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
