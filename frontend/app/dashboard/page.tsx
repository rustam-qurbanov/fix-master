"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const toggleCategory = (id: number) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.upsertProfile({
        full_name: fullName,
        bio: bio || undefined,
        city,
        price_from: Number(priceFrom),
        price_to: Number(priceTo),
        experience_years: experienceYears ? Number(experienceYears) : undefined,
        whatsapp: whatsapp || undefined,
        telegram: telegram || undefined,
        category_ids: categoryIds,
      });
      setStatus("Анкета сохранена");
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioUrl) return;
    try {
      await api.addPortfolioItem(portfolioUrl);
      setPortfolioUrl("");
      setStatus("Работа добавлена в портфолио");
    } catch (e) {
      setStatus((e as Error).message);
    }
  };

  const field =
    "w-full border-0 border-b-2 border-ink/20 bg-transparent px-0 py-2 focus:border-signal focus:outline-none";
  const label = "font-mono text-[11px] uppercase tracking-wider text-steel";

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <div className="ticket p-7 pt-9">
        <h1 className="font-display text-2xl font-bold uppercase">
          Анкета мастера
        </h1>

        <form onSubmit={saveProfile} className="mt-5 flex flex-col gap-4">
          <div>
            <label className={label}>Имя</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label className={label}>О себе</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`${field} resize-none`}
              rows={3}
            />
          </div>
          <div>
            <label className={label}>Город</label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={field}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Цена от</label>
              <input
                required
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label}>Цена до</label>
              <input
                required
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className={field}
              />
            </div>
          </div>
          <div>
            <label className={label}>Опыт работы, лет</label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className={field}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>WhatsApp (номер)</label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+77001234567"
                className={field}
              />
            </div>
            <div>
              <label className={label}>Telegram (юзернейм)</label>
              <input
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={label}>Категории услуг</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleCategory(c.id)}
                  aria-pressed={categoryIds.includes(c.id)}
                  className={`border px-3 py-1 font-mono text-sm uppercase tracking-wide transition ${
                    categoryIds.includes(c.id)
                      ? "border-signal bg-signal text-paper"
                      : "border-ink/20 text-steel hover:border-ink/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-ink py-2.5 font-display font-bold uppercase tracking-wide text-paper transition hover:bg-signal disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить анкету"}
          </button>
        </form>

        <div className="cut-line mt-7 pt-6">
          <h2 className={label}>Добавить работу в портфолио</h2>
          <form onSubmit={addPortfolio} className="mt-2 flex gap-3">
            <input
              placeholder="URL изображения"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className={field}
            />
            <button
              type="submit"
              className="shrink-0 border border-ink/20 px-4 font-mono text-sm uppercase tracking-wide text-steel transition hover:border-ink/40"
            >
              Добавить
            </button>
          </form>
        </div>

        {status && (
          <p className="mt-4 font-mono text-sm text-steel">{status}</p>
        )}
      </div>
    </main>
  );
}
