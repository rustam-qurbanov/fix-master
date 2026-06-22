// Demo data for design review only — used as a fallback when the backend
// isn't reachable yet. Safe to delete once real Supabase data is wired up.
import type { MasterProfileOut } from "./types";

export const mockMasters: MasterProfileOut[] = [
  {
    user_id: "11111111-1111-1111-1111-111111111111",
    full_name: "Игорь Соколов",
    city: "Алматы",
    price_from: 8000,
    price_to: 25000,
    avatar_url: null,
    whatsapp: "+77001234567",
    telegram: "@igor_plumber",
    bio: "15 лет занимаюсь сантехникой: от замены смесителя до полной разводки труб в новой квартире. Работаю аккуратно, убираю за собой.",
    experience_years: 15,
    categories: [{ id: 1, name: "Сантехника" }],
    portfolio_items: [
      { id: 1, image_url: "https://picsum.photos/seed/pipe1/400/400", description: "Замена стояка" },
      { id: 2, image_url: "https://picsum.photos/seed/pipe2/400/400", description: "Установка бойлера" },
      { id: 3, image_url: "https://picsum.photos/seed/pipe3/400/400", description: "Разводка труб" },
    ],
  },
  {
    user_id: "22222222-2222-2222-2222-222222222222",
    full_name: "Дамир Қасымов",
    city: "Астана",
    price_from: 5000,
    price_to: 18000,
    avatar_url: null,
    whatsapp: "+77051112233",
    telegram: null,
    bio: "Электрик с допуском, работаю с щитками, проводкой, освещением. Выезжаю в день обращения.",
    experience_years: 9,
    categories: [{ id: 2, name: "Электрика" }],
    portfolio_items: [
      { id: 4, image_url: "https://picsum.photos/seed/wire1/400/400", description: "Сборка щитка" },
      { id: 5, image_url: "https://picsum.photos/seed/wire2/400/400", description: "Проводка под ключ" },
    ],
  },
  {
    user_id: "33333333-3333-3333-3333-333333333333",
    full_name: "Андрей Ким",
    city: "Алматы",
    price_from: 15000,
    price_to: 60000,
    avatar_url: null,
    whatsapp: null,
    telegram: "@andrey_remont",
    bio: "Бригада из 3 человек, делаем ремонт квартир под ключ: стяжка, штукатурка, плитка, малярка.",
    experience_years: 7,
    categories: [{ id: 3, name: "Ремонт квартир" }, { id: 4, name: "Стройка" }],
    portfolio_items: [
      { id: 6, image_url: "https://picsum.photos/seed/reno1/400/400", description: "Ремонт ванной" },
      { id: 7, image_url: "https://picsum.photos/seed/reno2/400/400", description: "Стяжка пола" },
    ],
  },
  {
    user_id: "44444444-4444-4444-4444-444444444444",
    full_name: "Серик Алиев",
    city: "Шымкент",
    price_from: 10000,
    price_to: 40000,
    avatar_url: null,
    whatsapp: "+77071234567",
    telegram: "@serik_heating",
    bio: "Монтаж и обслуживание систем отопления и газового оборудования. Официальный допуск к газовым работам.",
    experience_years: 12,
    categories: [{ id: 5, name: "Отопление" }, { id: 6, name: "Газ" }],
    portfolio_items: [
      { id: 8, image_url: "https://picsum.photos/seed/heat1/400/400", description: "Монтаж котла" },
    ],
  },
];
