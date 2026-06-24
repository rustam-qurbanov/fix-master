# FixMaster — Чек-лист проекта

Статус MVP. Обновляется по ходу разработки.

## ✅ Реализовано

- [x] Архитектура и стек согласованы (FastAPI + Next.js + Supabase)
- [x] Backend: scaffold на Poetry, FastAPI, конфиг, CORS
- [x] Backend: модели БД (users, master_profiles, categories, master_categories, portfolio_items)
- [x] Backend: Alembic-миграция (0001_initial) + сид категорий (Сантехника, Электрика, Ремонт квартир, Стройка, Отопление, Газ)
- [x] Backend: auth-зависимость (проверка Supabase JWT, роли client/master)
- [x] Backend: эндпоинты `/auth/register`, `/auth/login`, `/categories`, `/masters` (поиск/фильтр), `/masters/{id}`, `/masters/profile` (PUT), `/masters/portfolio` (POST)
- [x] Backend: проверено локально — приложение поднимается, все роуты регистрируются, `/health` отвечает 200
- [x] Frontend: scaffold на Next.js 16 (App Router) + TypeScript + Tailwind
- [x] Frontend: Supabase client, типизированный API-wrapper (`lib/api.ts`)
- [x] Frontend: страница поиска/landing с фильтром (категория, город, цена)
- [x] Frontend: страница профиля мастера
- [x] Frontend: страницы регистрации и логина (с гидрацией сессии Supabase)
- [x] Frontend: личный кабинет мастера (анкета + добавление работ в портфолио)
- [x] Frontend: проверено локально — типы проходят, `npm run build` зелёный, все страницы отдают 200
- [x] `.env.example` для backend и frontend, `.gitignore`, README с инструкцией запуска

## ⏳ Осталось сделать

### Перед первым реальным запуском
- [ ] Создать проект в Supabase (БД, Auth, ключи)
- [ ] Прогнать `alembic upgrade head` на реальной БД
- [ ] End-to-end проверка вживую: регистрация мастера → анкета → поиск клиентом

### Доработки MVP (известные упрощения)
- [ ] Загрузка фото портфолио сейчас через вставку URL — нужна реальная загрузка файлов в Supabase Storage
- [ ] Нет валидации/UX-полировки форм (ошибки, лоадеры — есть базовые, но не финальные)
- [ ] Нет логаута и отображения текущего пользователя в навбаре

### Отложенные фичи (по согласованию — добавим позже)
- [ ] Рейтинги и отзывы
- [ ] Геолокация / поиск по карте
- [ ] Встроенный чат между клиентом и мастером
- [ ] Деплой (Render для backend, Vercel для frontend)
- [ ] Переход на React Native для iOS/Android

### Команда ИИ-агентов
- [x] Настроить роли агентов (`frontend-engineer`, `backend-engineer`, `security-auditor`, `qa-engineer` в `.claude/agents/`) — см. `docs/claude_skills.md`
- [x] Общая доска задач для координации агентов — добавлен доступ к `TaskList`/`TaskGet`/`TaskUpdate` всем четырём агентам (ранее `security-auditor`/`qa-engineer` его не видели)
- [ ] Общая память агентов в духе [`claude-mem`](https://github.com/thedotmack/claude-mem) (hooks + SQLite + Chroma vector DB, MCP-поиск по истории сессий) — решить: ставить реальный пакет или писать свой аналог под FixMaster; обсудить Obsidian-визуализацию отдельно, т.к. у claude-mem её нет из коробки
- [ ] Decision log по агентам — лёгкий markdown-отчёт о принятых решениях (что сделано и почему, например "поменял цвет кнопки, т.к. сливалась с фоном"), читаемый через Obsidian как vault

### Скиллы — скачать позже, когда дойдём до соответствующего этапа
- [ ] [`deploy-to-vercel`](https://github.com/vercel-labs/agent-skills/tree/main/skills/deploy-to-vercel) — когда начнём реальный деплой фронтенда на Vercel
- [ ] [`vercel-cli-with-tokens`](https://github.com/vercel-labs/agent-skills/tree/main/skills/vercel-cli-with-tokens) — деплой/управление через Vercel CLI с токенами, тоже к этапу деплоя
- [ ] [`vercel-optimize`](https://github.com/vercel-labs/agent-skills/tree/main/skills/vercel-optimize) — анализ бандла/перфоманса уже собранного приложения, имеет смысл после того как фичи стабилизируются, не во время активной разработки MVP
