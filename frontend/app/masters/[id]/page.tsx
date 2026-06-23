"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { mockMasters } from "@/lib/mockMasters";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";
import type { MasterProfileOut } from "@/lib/types";

function ticketNumber(id: string) {
  return id.replace(/-/g, "").slice(-5).toUpperCase();
}

export default function MasterProfilePage() {
  const params = useParams<{ id: string }>();
  const [master, setMaster] = useState<MasterProfileOut | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMaster(params.id)
      .then(setMaster)
      .catch(() => {
        // Backend not reachable yet — fall back to demo masters for design review.
        const demo = mockMasters.find((m) => m.user_id === params.id);
        if (demo) setMaster(demo);
        else setError("Мастер не найден");
      });
  }, [params.id]);

  if (error)
    return (
      <main className="mx-auto max-w-2xl px-5 py-12 font-mono text-signal">
        {error}
      </main>
    );
  if (!master)
    return (
      <main className="mx-auto max-w-2xl px-5 py-12 font-mono text-steel">
        Загрузка...
      </main>
    );

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="ticket p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={master.avatar_url ?? "/avatar-placeholder.svg"}
              alt={master.full_name}
              className="h-20 w-20 rounded-full border-4 border-slate-50 object-cover shadow-sm"
            />
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                {master.full_name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-sm font-semibold text-steel">{master.city}</p>
              </div>
            </div>
          </div>
          <div className="bg-canvas/60 border border-border-main/50 px-4 py-2 rounded-xl text-left sm:text-right shrink-0">
            <p className="text-[9px] uppercase font-bold tracking-wider text-steel leading-none">Ставка</p>
            <p className="font-mono text-lg font-bold text-signal mt-1">
              {master.price_from}–{master.price_to}
            </p>
          </div>
        </div>

        {(master.whatsapp || master.telegram) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {master.whatsapp && (
              <a
                href={`https://wa.me/${master.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-emerald-600/10 active:scale-97 text-sm"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                Написать в WhatsApp
              </a>
            )}
            {master.telegram && (
              <a
                href={`https://t.me/${master.telegram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-sky-500/10 active:scale-97 text-sm"
              >
                <TelegramIcon className="h-4 w-4 fill-current" />
                Написать в Telegram
              </a>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border-main/60 flex items-center justify-between font-mono text-xs text-steel">
          <span>ID: {ticketNumber(master.user_id)}</span>
          {master.experience_years != null && (
            <span className="font-semibold bg-canvas px-2.5 py-1 rounded-lg">
              Опыт: {master.experience_years} лет
            </span>
          )}
        </div>

        {master.bio && (
          <div className="mt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-steel mb-2">О мастере</h3>
            <p className="text-ink/90 leading-relaxed text-sm sm:text-base">{master.bio}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-steel mb-2">Услуги</h3>
          <div className="flex flex-wrap gap-1.5">
            {master.categories.map((c) => (
              <span
                key={c.id}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-canvas px-3 py-1.5 rounded-lg"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {master.portfolio_items.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border-main/60">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-steel">
              Выполненные работы
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {master.portfolio_items.map((item) => (
                <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border-main bg-slate-50 cursor-pointer">
                  <img
                    src={item.image_url}
                    alt={item.description ?? ""}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.description && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                      <p className="text-[10px] text-white truncate w-full">{item.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
