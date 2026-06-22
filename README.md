# FixMaster (Handyman Platform)

**FixMaster** is a modern online platform designed to connect professional handymen (service providers) with customers who need home improvement, maintenance, repair, or any other handyman services.

---

## 🎯 Platform Concept

The platform simplifies the process of finding and hiring specialists for various tasks — from minor household repairs to complex renovation and construction projects. 

### How it works:
1. **Handymen** register on the platform, create a detailed profile, describe their skills, specify pricing for their services, and upload photos of their completed work (portfolio).
2. **Customers (clients)** find suitable specialists using search and filters, browse their portfolios/profiles, and contact them directly to discuss the job.

---

## 👥 User Roles & Features

### 🛠️ For Handymen (Service Providers)
* **Easy Registration**: Quick account creation and profile setup.
* **Skill Cataloging**: List and describe services and areas of expertise.
* **Transparent Pricing**: Publish fixed rates or hourly pricing for different jobs.
* **Portfolio Showcase**: Upload photos of completed jobs to showcase work quality.
* **Direct Contacts**: Add preferred communication channels (phone, Telegram, WhatsApp, etc.).

### 👤 For Customers (Clients)
* **Smart Search**: Find handymen by service categories, pricing, and ratings.
* **Comprehensive Profiles**: View a handyman's experience, pricing, and portfolio in one place.
* **Direct Communication**: Connect directly with the chosen specialist without intermediaries to discuss work details.

---

## 🚀 Planned Features
* **Ratings & Reviews**: A trust-based system of reviews and ratings from real clients.
* **Geo-location Search**: Find specialists located close to your address.
* **In-app Chat**: Built-in messaging to discuss job details and share files directly on the platform.

---

## 🧱 Stack (MVP)

- **Backend**: Python + FastAPI, SQLAlchemy + Alembic, dependencies managed with [Poetry](https://python-poetry.org/)
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Database / Auth / Storage**: [Supabase](https://supabase.com) (Postgres, Auth, file storage)

## 🛠️ Local Setup

### Prerequisites
- Python 3.11+, [Poetry](https://python-poetry.org/docs/#installation)
- Node.js 18+/20+
- A Supabase project (free tier) — needed for the database, auth, and JWT secret

### Backend

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL, SUPABASE_URL, SUPABASE_JWT_SECRET, SUPABASE_SERVICE_KEY
poetry install
poetry run alembic upgrade head   # creates tables + seeds categories
poetry run uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
cp .env.example .env.local   # fill in NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

App available at `http://localhost:3000`.

### Where to get the Supabase values
In your Supabase project dashboard: **Project Settings → API** gives you the URL, anon key, and service role key. **Project Settings → API → JWT Settings** gives you the JWT secret. **Project Settings → Database** gives you the connection string for `DATABASE_URL` (use the `psycopg2`-compatible URI, e.g. `postgresql+psycopg2://...`).