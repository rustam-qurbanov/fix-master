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
    "border-0 border-b-2 border-ink/20 bg-transparent px-0 py-1 font-mono text-sm focus:border-signal focus:outline-none";
  const label = "font-mono text-[11px] uppercase tracking-wider text-steel";

  return (
    <div className="ticket grid grid-cols-2 gap-x-6 gap-y-4 p-5 sm:grid-cols-5 sm:items-end">
      <div className="col-span-2 sm:col-span-1">
        <label className={label}>Категория</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${field} w-full`}
        >
          <option value="">Все</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Город</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`${field} w-full`}
          placeholder="Алматы"
        />
      </div>
      <div>
        <label className={label}>Цена от</label>
        <input
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className={`${field} w-full`}
        />
      </div>
      <div>
        <label className={label}>Цена до</label>
        <input
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className={`${field} w-full`}
        />
      </div>
      <button
        onClick={apply}
        className={`bg-signal px-4 py-2 font-display font-bold uppercase tracking-wide text-paper transition active:scale-95 ${
          pressed ? "scale-95" : ""
        }`}
      >
        Найти
      </button>
    </div>
  );
}
