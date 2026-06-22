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
      <div className="ticket p-7 pt-9">
        <div className="flex items-center gap-4">
          <img
            src={master.avatar_url ?? "/avatar-placeholder.svg"}
            alt={master.full_name}
            className="h-16 w-16 border border-ink/15 object-cover"
          />
          <div>
            <h1 className="font-display text-2xl font-bold uppercase leading-tight">
              {master.full_name}
            </h1>
            <p className="text-steel">{master.city}</p>
          </div>
        </div>

        {(master.whatsapp || master.telegram) && (
          <div className="mt-4 flex gap-2">
            {master.whatsapp && (
              <a
                href={`https://wa.me/${master.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1E6F39] px-4 py-2 font-mono text-sm text-paper transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            {master.telegram && (
              <a
                href={`https://t.me/${master.telegram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1B6F9E] px-4 py-2 font-mono text-sm text-paper transition hover:brightness-110"
              >
                <TelegramIcon className="h-4 w-4" />
                Telegram
              </a>
            )}
          </div>
        )}

        <div className="cut-line mt-5 flex items-center justify-between pt-3 font-mono text-sm">
          <span className="text-steel">№&nbsp;{ticketNumber(master.user_id)}</span>
          <span className="text-lg font-medium">
            {master.price_from}–{master.price_to}
          </span>
        </div>

        {master.bio && <p className="mt-5 text-ink/90">{master.bio}</p>}

        {master.experience_years != null && (
          <p className="mt-2 font-mono text-sm text-steel">
            Опыт работы: {master.experience_years} лет
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {master.categories.map((c) => (
            <span
              key={c.id}
              className="font-mono text-[11px] uppercase tracking-wide text-steel before:mr-1 before:content-['#']"
            >
              {c.name}
            </span>
          ))}
        </div>

        {master.portfolio_items.length > 0 && (
          <div className="cut-line mt-6 pt-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-steel">
              Выполненные работы
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {master.portfolio_items.map((item) => (
                <img
                  key={item.id}
                  src={item.image_url}
                  alt={item.description ?? ""}
                  className="aspect-square border border-ink/10 object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
