# Шпаргалка: скиллы и агенты в проекте FixMaster

Два независимых набора скиллов работают в этом проекте: встроенные (superpowers, идут с Claude Code) и gstack (сторонний пакет, установлен **только в этом проекте**, не глобально).

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

## 🌌 Глобальные скиллы агента Antigravity

Эти скиллы установлены в глобальном окружении (`~/.agents/skills/`). Часть из них представляют собой базы знаний и сводки правил, по которым работает агент Antigravity, а часть содержат **готовые CLI-скрипты**, которые вы можете запускать прямо в терминале.

### 🛠️ CLI-инструменты для дизайна и UI/UX (Запускаются в терминале)

Ниже приведены реальные команды, которые вы можете выполнять из корня любого проекта.

#### 1. Интеллектуальный помощник UI/UX (`ui-ux-pro-max`)
Поиск по базе лучших практик, генерация палитр, шрифтов и дизайн-систем.
*   **Генерация полной дизайн-системы под проект:**
    ```bash
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "AI search tool modern minimal" --design-system -p "MyProject"
    ```
    *(Сгенерирует рекомендации: палитры, шрифты, микро-анимации, сетку и UX правила. Добавьте `-f markdown` для вывода в MD).*
*   **Сохранение дизайн-системы в проект (создает файл `design-system/MASTER.md`):**
    ```bash
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "fintech crypto dashboard" --design-system --persist -p "CryptoApp"
    ```
*   **Создание дизайн-оверрайда для конкретной страницы (создает `design-system/pages/dashboard.md`):**
    ```bash
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "analytics dashboard charts" --design-system --persist -p "CryptoApp" --page "dashboard"
    ```
*   **Поиск по отдельным доменам базы знаний (UX, цвета, стили и т.д.):**
    ```bash
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "minimalism glassmorphism" --domain style
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "contrast rules screen readers" --domain ux
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "vibrant neon" --domain color
    ```
    *Доступные домены (`--domain`):* `style` (стили), `color` (палитры), `chart` (графики), `landing` (лендинги), `product` (виды продуктов), `ux` (правила юзабилити), `typography` (шрифтовые пары), `google-fonts` (поиск по Google Fonts), `react` (оптимизация рендеров), `web` (платформенные гайды).
*   **Спецификации для конкретного технологического стека:**
    ```bash
    python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "lists performance scroll" --stack react-native
    ```

#### 2. Генератор логотипов, иконок и фирменных стилей (`ckm:design`)
Требует `export GEMINI_API_KEY="your-key"`.
*   **Создание дизайн-брифа для логотипа:**
    ```bash
    python3 ~/.agents/skills/ckm-design/scripts/logo/search.py "organic beauty spa" --design-brief -p "SerenitySpa"
    ```
*   **Генерация логотипа с помощью ИИ (создает изображение):**
    ```bash
    python3 ~/.agents/skills/ckm-design/scripts/logo/generate.py --brand "EcoBrand" --style minimalist --industry organic
    ```
*   **Генерация SVG-иконок (через Gemini 3.1 Pro):**
    ```bash
    # Одиночная иконка
    python3 ~/.agents/skills/ckm-design/scripts/icon/generate.py --prompt "settings gear" --style outlined
    # Иконка с цветом
    python3 ~/.agents/skills/ckm-design/scripts/icon/generate.py --prompt "shopping cart" --style filled --color "#6366F1"
    # Сгенерировать пачку из 4 вариантов
    python3 ~/.agents/skills/ckm-design/scripts/icon/generate.py --prompt "cloud upload" --batch 4 --output-dir ./icons
    ```
*   **Создание фирменного стиля (CIP):**
    ```bash
    # Создать бриф
    python3 ~/.agents/skills/ckm-design/scripts/cip/search.py "tech startup" --cip-brief -b "TechFlow"
    # Сгенерировать mockup визитки (business card)
    python3 ~/.agents/skills/ckm-design/scripts/cip/generate.py --brand "TechFlow" --logo logo.png --deliverable "business card" --industry "software"
    # Сгенерировать полный комплект CIP
    python3 ~/.agents/skills/ckm-design/scripts/cip/generate.py --brand "TechFlow" --logo logo.png --industry "software" --set
    ```

#### 3. Управление скиллами (`find-skills` / Skills CLI)
Утилита для поиска и установки готовых решений из реестра `skills.sh`.
*   **Поиск скилла по ключевым словам:**
    ```bash
    npx skills find react performance
    ```
*   **Установка скилла глобально (для всех проектов):**
    ```bash
    npx skills add owner/repo@skill -g -y
    ```
*   **Посмотреть список установленных глобальных скиллов:**
    ```bash
    npx skills ls -g
    ```
*   **Обновление всех скиллов:**
    ```bash
    npx skills update
    ```

---

### 🧠 Базы знаний для агента (Используются автоматически при обращении)

Эти скиллы не имеют скриптов для терминала, но вы можете просить агента выполнить задачи, используя их. Например: *"Сделай аудит по a11y-debugging"* или *"Настрой базу данных по гайдам firebase-firestore"*.

| Название скилла | Сфера применения | Что делает агент при вызове |
|:---|:---|:---|
| **`modern-web-guidance`** | Современный Web (CSS, HTML, JS) | Использует передовые API (View Transitions, Popover API, `:has()`), оптимизирует LCP и INP. |
| **`a11y-debugging`** | Доступность (Accessibility) | Проверяет семантику HTML, контрастность, фокус, ARIA-атрибуты по гайдлайнам web.dev. |
| **`debug-optimize-lcp`** | Производительность веб-страниц | Ищет причины медленного рендеринга первого экрана и оптимизирует LCP. |
| **`memory-leak-debugging`**| Утечки памяти в JS / Node.js | Анализирует дампы памяти (heapsnapshots) и находит незакрытые таймеры, утечки замыканий. |
| **`firebase-firestore`** | База данных Cloud Firestore | Создает оптимальную структуру коллекций, настраивает индексы, пишет безопасные правила. |
| **`firebase-auth-basics`** | Авторизация пользователей | Настраивает регистрацию/вход, работу с токенами и правами пользователей. |
| **`firebase-security-rules-auditor`** | Безопасность Firebase | Проверяет ваши правила Firestore на уязвимости перед релизом. |
| **`firebase-data-connect`**| Firebase SQL (PostgreSQL) | Разрабатывает схемы, пишет безопасные мутации и запросы к реляционным базам. |
| **`android-cli`** | Разработка под Android | Конфигурирует окружение Android SDK, собирает APK через CLI. |
| **`xcode-project-setup`** | Разработка под iOS | Управляет `.pbxproj` файлами, добавляет CocoaPods/Swift Packages. |

*Полный список биологических/химических баз знаний (`uniprot`, `alphafold`, `chembl`, `pubmed` и др.) можно посмотреть через команду `npx skills ls -g`.*�рана (Largest Contentful Paint).
- **`memory-leak-debugging`** — поиск и устранение утечек памяти в Node.js / JavaScript.
- **`troubleshooting`** — диагностика проблем подключения к DevTools.

### 📱 Мобильная разработка и Firebase
- **Firebase Suite** — проектирование баз данных, правил безопасности и инфраструктуры:
  - `firebase-basics` (CLI & Init)
  - `firebase-firestore` (Firestore)
  - `firebase-auth-basics` (Авторизация)
  - `firebase-data-connect` (SQL / PostgreSQL)
  - `firebase-security-rules-auditor` (Аудит безопасности правил)
  - `firebase-crashlytics` / `firebase-remote-config-basics` / `firebase-app-hosting-basics` / `firebase-hosting-basics` / `firebase-ai-logic-basics`
- **`android-cli`** — управление SDK, сборка и отладка приложений под Android.
- **`xcode-project-setup`** — добавление Swift Packages и интеграция зависимостей в проекты Xcode.

### 🔬 Биология, генетика и биоинформатика (Science)
- **Белки и 3D-структуры:** `alphafold-database-fetch-and-analyze` (AlphaFold), `foldseek-structural-search` (3D поиск структур), `pymol` (визуализация PyMOL), `uniprot-database`, `string-database` (взаимодействия), `protein-sequence-msa` / `protein-sequence-similarity-search` (выравнивание и BLAST), `interpro-database` (домены).
- **Генетика и геномика:** `alphagenome-single-variant-analysis`, `dbsnp-database` (мутации и rsID), `clinvar-database` (клиническая значимость), `gnomad-database` (частоты аллелей), `ensembl-database`, `gtex-database` (экспрессия в тканях), `encode-ccres-database`, `jaspar-database` (TFBS).
- **Химия и фармакология:** `chembl-database`, `pubchem-database`, `openfda-database` (лекарства и безопасность FDA), `opentargets-database` (мишени и болезни), `reactome-database` (метаболические пути), `quickgo-database`, `embl-ebi-ols`.

### 📚 Поиск научной литературы
- **`pubmed-database`** — поиск публикаций в базе биомедицинской литературы PubMed.
- **Поиск по препринтам и статьям:** `literature-search-arxiv` (arXiv), `literature-search-biorxiv` (bioRxiv/medRxiv), `literature-search-europepmc`, `literature-search-openalex`.
- **`clinical-trials-database`** — база клинических испытаний ClinicalTrials.gov.

### 🛠️ Системные и мета-скиллы
- **`google-antigravity-sdk`** — разработка автономных агентов на AGY SDK.
- **`workflow-skill-creator`** — автоматическое создание новых скиллов из завершённых сессий.
- **`find-skills`** — поиск и установка скиллов из общего реестра.
- **`uv`** — быстрый менеджер зависимостей Python.

