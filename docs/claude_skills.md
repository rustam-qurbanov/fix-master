# Шпаргалка: скиллы и агенты в проекте FixMaster

Два независимых набора скиллов работают в этом проекте: встроенные (superpowers, идут с Claude Code) и gstack (сторонний пакет, установлен **только в этом проекте**, не глобально).

---

## 👷 Постоянные субагенты проекта (`.claude/agents/`)

Файлы-определения лежат в `.claude/agents/` и закоммичены в git (в отличие от `.claude/skills/` — это symlink'и на gstack, они в `.gitignore`). Каждый — markdown с YAML frontmatter (`name`, `description`, `tools`, `model`) + системный промпт. Claude сам решает, когда делегировать, по полю `description`; можно и вызвать явно.

| Агент | Когда используется | Доступ к инструментам | Преднагруженные скиллы (`skills:` в frontmatter) |
|---|---|---|---|
| **`frontend-engineer`** | Любая работа над `frontend/` — компоненты, страницы, стили, типы | Полный (наследует) | `frontend-design`, `webapp-testing`, `design-review` (gstack), `ui-ux-pro-max`, `react-best-practices` (Vercel), `composition-patterns` (Vercel) |
| **`backend-engineer`** | Любая работа над `backend/` — роуты FastAPI, модели, миграции Alembic | Полный (наследует) | `test-driven-development`, `systematic-debugging` *(нет специфичного FastAPI-скилла — это общие инженерные)* |
| **`security-auditor`** | Перед мерджем auth-кода, перед подключением реального Supabase, по запросу аудита | Только чтение: `Read, Grep, Glob, Bash` (без `Write`/`Edit` — он только репортит находки) | `cso` (gstack, OWASP + STRIDE) |
| **`qa-engineer`** | После того как `frontend-engineer`/`backend-engineer` закончили фичу — сквозное тестирование UI + API | `Read, Grep, Glob, Bash, Write, WebFetch` (без `Edit` — пишет новые файлы/отчёты, но не правит исходники) | `senior-aqa-engineer`, `webapp-testing`, `qa-only` (gstack), `verification-before-completion` |

`skills:` во frontmatter — это **преднагрузка**: полный текст скилла инжектится в системный промпт агента при старте, а не просто доступен по требованию. Это отдельная официальная фича: [Configure subagents → skills field](https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields).

`ui-ux-pro-max` — не часть superpowers и не gstack: вручную установлен **глобально** в `~/.claude/skills/ui-ux-pro-max/` из [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (доступен во всех проектах, не только в этом). Design-intelligence база — 67 стилей, 161 цветовая палитра, 57 пар шрифтов, accessibility/touch/animation/forms-чеклисты; запрашивается через `python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<запрос>" --domain <style|color|typography|ux|...>` (требует `python3`, данные — CSV в `data/`).

`react-best-practices` и `composition-patterns` — тоже вручную установлены **глобально** в `~/.claude/skills/`, из [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills) (внутри `name:` — `vercel-react-best-practices`/`vercel-composition-patterns`, но идентификатор для `skills:` во frontmatter — **имя директории**, не внутреннее поле). Первый — 70 правил перфоманса React/Next.js от Vercel Engineering, второй — паттерны композиции компонентов (избегание boolean-prop-проliferation, React 19 API).

Полную инструкцию по делегированию (когда вызывать агента, как изолировать задачу) см. `ORCHESTRATOR.md` §5. Официальная документация механизма: [Create custom subagents](https://code.claude.com/docs/en/sub-agents).

---

## 🧩 Встроенные скиллы (superpowers)

Уже были до gstack, работают во всех твоих проектах.

| Команда | Что делает |
|---|---|
| `/brainstorming` | Обсудить идею до того, как писать код |
| `/plan` | Составить структурированный план реализации (режим Plan Mode) |
| `/execute-plan` | Выполнить уже согласованный план |
| `/debug` | Системный дебаг конкретной проблемы |
| `/code-review` | Ревью текущего диффа (есть уровни: low/medium/high/ultra) |
| `/review` | Ревью пул-реквеста *(имя пересекается с gstack `/review` — см. ниже)* |
| `/tdd` | Разработка через тесты |
| `/webapp-testing` | Написание/улучшение тестов веб-приложения |
| `/finish-branch` | Завершить работу над веткой |
| `/simplify` | Упростить/почистить изменённый код (без поиска багов) |

---

## 🏗️ gstack — установлен локально в `fix-master`

Скачан как полноценный пакет (не глобально): исходники лежат в `.gstack-src/` (~1.1 ГБ, в `.gitignore`, **не удалять** — это источник для symlink'ов в `.claude/skills/`). Требует `bun` (установлен на этой машине).

### Из чего реально брать пользу для FixMaster сейчас

| Команда | Что делает | Когда использовать |
|---|---|---|
| **`/qa`** | Живое тестирование сайта в реальном Chromium: находит баги и сам их фиксит, коммитит каждый фикс отдельно | Когда фича готова — "протестируй сайт", "найди баги" |
| **`/qa-only`** | То же, но только отчёт, без автофиксов | Когда хочешь сам решать, что фиксить |
| **`/cso`** | Security-аудит (OWASP + STRIDE) | Перед подключением реального Supabase / перед продом |

### Остальное — есть, но для MVP пока не приоритет

| Группа | Команды |
|---|---|
| Планирование | `/office-hours`, `/autoplan`, `/plan-eng-review`, `/plan-ceo-review`, `/plan-design-review`, `/plan-devex-review`, `/plan-tune`, `/spec` |
| Дизайн | `/design-consultation`, `/design-shotgun`, `/design-html`, `/design-review` |
| Разработка | `/review` *(пересекается с superpowers)*, `/investigate`, `/devex-review` |
| Релиз | `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/benchmark-models` |
| Документация | `/document-release`, `/document-generate` |
| iOS (не нужно пока — мы на вебе) | `/ios-qa`, `/ios-fix`, `/ios-clean`, `/ios-design-review`, `/ios-sync` |
| Браузер/утилиты | `/browse`, `/scrape`, `/diagram`, `/make-pdf`, `/skillify` |
| Координация агентов | `/pair-agent` — координация нескольких субагентов на одну задачу |
| Память/ретро | `/learn`, `/retro`, `/context-save`, `/context-restore`, ---

---

## 🌌 Глобальные слэш-команды Antigravity (IDE)

| Команда | Что делает | Когда использовать |
| :--- | :--- | :--- |
| **`/goal`** | Запуск длительной фоновой задачи. Агент не остановится, пока цель не будет полностью достигнута | Для больших автономных задач (например: "покрыть тестами весь проект", "найти и пофиксить все ворнинги") |
| **`/schedule`** | Запуск инструкции по расписанию (cron) или установка одноразового таймера | Чтобы регулярно опрашивать состояние сборки, запускать тесты или будить агента через время |
| **`/grill-me`** | Интерактивный опрос/интервью с агентом для уточнения деталей задачи | Когда нужно детально обсудить требования и спроектировать архитектуру фичи |
