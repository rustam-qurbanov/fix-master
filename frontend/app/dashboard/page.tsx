"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import type { Category, PortfolioItem } from "@/lib/types";

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
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load categories
    api.getCategories().then(setCategories).catch(() => setCategories([]));

    // Load existing profile on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        api.getMaster(data.session.user.id)
          .then((profile) => {
            setFullName(profile.full_name || "");
            setBio(profile.bio || "");
            setCity(profile.city || "");
            setPriceFrom(profile.price_from ? String(profile.price_from) : "");
            setPriceTo(profile.price_to ? String(profile.price_to) : "");
            setExperienceYears(profile.experience_years ? String(profile.experience_years) : "");
            setWhatsapp(profile.whatsapp || "");
            setTelegram(profile.telegram || "");
            setCategoryIds(profile.categories?.map((c) => c.id) || []);
            setPortfolioItems(profile.portfolio_items || []);
          })
          .catch((err) => {
            console.log("No existing master profile found. Ready for creation.", err);
          });
      }
    });
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
      setStatus({ type: "success", text: "Анкета успешно сохранена" });
    } catch (e) {
      setStatus({ type: "error", text: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const addPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioUrl) return;
    setStatus(null);
    try {
      const newItem = await api.addPortfolioItem(portfolioUrl);
      setPortfolioUrl("");
      setPortfolioItems((prev) => [...prev, newItem as PortfolioItem]);
      setStatus({ type: "success", text: "Работа добавлена в портфолио" });
    } catch (e) {
      setStatus({ type: "error", text: (e as Error).message });
    }
  };

  const field =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-ink placeholder:text-steel/50 focus:border-signal focus:ring-2 focus:ring-signal/10 focus:outline-none transition duration-200";
  const label = "block text-xs font-semibold uppercase tracking-wider text-steel mb-1.5";

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <div className="ticket p-8 shadow-sm">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Анкета мастера
          </h1>
          <p className="mt-1 text-sm text-steel">
            Заполните информацию о себе, чтобы клиенты могли легко вас найти
          </p>
        </div>

        {status && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-medium border transition duration-200 ${
              status.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-rose-50 border-rose-100 text-rose-800"
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={saveProfile} className="flex flex-col gap-6">
          {/* Main Grid: Info columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Personal info */}
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-l-2 border-signal pl-2">
                Личные данные
              </h2>
              <div>
                <label className={label}>Имя</label>
                <input
                  required
                  placeholder="Иван Иванов"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>О себе</label>
                <textarea
                  placeholder="Расскажите о своей специализации, подходе к работе и ключевых навыках..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`${field} resize-none`}
                  rows={4}
                />
              </div>
              <div>
                <label className={label}>Город</label>
                <input
                  required
                  placeholder="Алматы"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Опыт работы, лет</label>
                <input
                  type="number"
                  placeholder="5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className={field}
                />
              </div>
            </div>

            {/* Right Column: Pricing & services */}
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-l-2 border-signal pl-2">
                Стоимость и контакты
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Цена от (₸)</label>
                  <input
                    required
                    type="number"
                    placeholder="3000"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>Цена до (₸)</label>
                  <input
                    required
                    type="number"
                    placeholder="15000"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className={label}>WhatsApp (номер телефона)</label>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+77012345678"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Telegram (имя пользователя)</label>
                <input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="username"
                  className={field}
                />
              </div>
            </div>
          </div>

          {/* Service categories */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-l-2 border-signal pl-2 mb-4">
              Категории услуг
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleCategory(c.id)}
                  aria-pressed={categoryIds.includes(c.id)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    categoryIds.includes(c.id)
                      ? "border-signal bg-signal text-white shadow-sm"
                      : "border-slate-200 bg-white text-steel hover:border-slate-300 hover:text-ink"
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
            className="mt-4 bg-signal hover:bg-signal/90 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow transition duration-200 disabled:opacity-50 self-start"
          >
            {saving ? "Сохранение..." : "Сохранить анкету"}
          </button>
        </form>

        {/* Portfolio Manager Section */}
        <div className="cut-line mt-8 pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-l-2 border-signal pl-2 mb-4">
            Портфолио работ
          </h2>

          {portfolioItems.length > 0 ? (
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt="Работа из портфолио"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-steel mb-6 bg-slate-50 border border-slate-100 rounded-lg p-4 text-center">
              У вас пока нет работ в портфолио. Добавьте ссылки на фото ваших выполненных заказов ниже.
            </p>
          )}

          <form onSubmit={addPortfolio} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                placeholder="Ссылка на изображение (например, https://images.unsplash.com/...)"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className={field}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 bg-ink hover:bg-ink/90 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition duration-200"
            >
              Добавить фото
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

