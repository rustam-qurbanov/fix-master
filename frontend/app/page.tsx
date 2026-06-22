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
    <main className="flex-1">
      <section className="bg-ink px-5 pb-20 pt-14 text-paper">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            Сервис для вашего дома
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Найдите мастера,
            <br />
            которому можно <span className="text-signal">довериться</span>
          </h1>
          <p className="mt-4 max-w-md text-paper/70">
            Сантехника, электрика, ремонт, стройка, отопление и газ — мастера
            с проверенными анкетами и реальным портфолио работ.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-5xl px-5">
        <FilterBar onChange={search} />

        <div className="mt-8 grid gap-5 pb-16 sm:grid-cols-2">
          {loading && (
            <p className="font-mono text-sm text-steel">Загрузка...</p>
          )}
          {error && <p className="font-mono text-sm text-signal">{error}</p>}
          {!loading && !error && masters.length === 0 && (
            <p className="font-mono text-sm text-steel">Мастера не найдены</p>
          )}
          {masters.map((m) => (
            <MasterCard key={m.user_id} master={m} />
          ))}
        </div>
      </div>
    </main>
  );
}
