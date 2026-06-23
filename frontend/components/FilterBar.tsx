"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, MasterSearchFilters } from "@/lib/types";

export function FilterBar({
  onChange,
}: {
  onChange: (filters: MasterSearchFilters) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>("");
  const [city, setCity] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const apply = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    onChange({
      category: category ? Number(category) : undefined,
      city: city || undefined,
      price_min: priceMin ? Number(priceMin) : undefined,
      price_max: priceMax ? Number(priceMax) : undefined,
    });
  };

  const field =
    "w-full rounded-xl border border-border-main bg-paper px-3 py-2.5 text-sm text-ink focus:border-signal focus:ring-2 focus:ring-signal/15 focus:outline-none transition-all duration-200 appearance-none";
  const label = "block text-[11px] font-bold uppercase tracking-wider text-steel mb-1.5";

  return (
    <div className="ticket grid grid-cols-2 gap-x-6 gap-y-5 p-6 sm:grid-cols-5 sm:items-end">
      <div className="col-span-2 sm:col-span-1">
        <label className={label}>Категория</label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-steel">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label className={label}>Город</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={field}
          placeholder="Алматы"
        />
      </div>
      <div>
        <label className={label}>Цена от</label>
        <input
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className={field}
          placeholder="0"
        />
      </div>
      <div>
        <label className={label}>Цена до</label>
        <input
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className={field}
          placeholder="До"
        />
      </div>
      <button
        onClick={apply}
        className={`w-full bg-signal hover:bg-signal/95 text-paper font-display font-extrabold uppercase tracking-wider rounded-xl py-3 transition-all duration-200 active:scale-97 shadow-sm hover:shadow-md hover:shadow-signal/15 ${
          pressed ? "scale-97" : ""
        }`}
      >
        Найти
      </button>
    </div>
  );
}

