"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FilterBar } from "@/components/FilterBar";
import { MasterCard } from "@/components/MasterCard";
import { mockMasters } from "@/lib/mockMasters";
import type { MasterProfileCard, MasterSearchFilters } from "@/lib/types";

export default function HomePage() {
  const [masters, setMasters] = useState<MasterProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = (filters: MasterSearchFilters = {}) => {
    setLoading(true);
    setError(null);
    api
      .searchMasters(filters)
      .then(setMasters)
      // Backend not reachable yet (no Supabase configured) — fall back to
      // demo masters so the design can be reviewed. Remove once live.
      .catch(() => setMasters(mockMasters))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <main className="flex-1 bg-canvas">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 px-5 pb-24 pt-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_45%)]"></div>
        <div className="mx-auto max-w-5xl relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
            Сервис для вашего дома
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl">
            Найдите мастера,
            <br />
            которому можно <span className="text-indigo-400">довериться</span>
          </h1>
          <p className="mt-5 max-w-lg text-slate-300 text-sm sm:text-base leading-relaxed">
            Сантехника, электрика, ремонт, стройка, отопление и газ — мастера
            с проверенными анкетами и реальным портфолио работ.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-12 max-w-5xl px-5 relative z-20">
        <FilterBar onChange={search} />

        <div className="mt-10 grid gap-6 pb-20 sm:grid-cols-2">
          {loading && (
            <div className="col-span-2 flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-signal"></div>
                <p className="text-sm font-semibold text-steel">Ищем лучших мастеров...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="col-span-2 text-center py-12 text-sm text-red-500 bg-red-50 border border-red-100 rounded-2xl">
              {error}
            </div>
          )}
          {!loading && !error && masters.length === 0 && (
            <div className="col-span-2 text-center py-16 text-steel font-medium bg-white/50 border border-border-main/50 rounded-2xl">
              Мастера не найдены. Попробуйте изменить параметры поиска.
            </div>
          )}
          {!loading && !error && masters.map((m) => (
            <MasterCard key={m.user_id} master={m} />
          ))}
        </div>
      </div>
    </main>
  );
}

