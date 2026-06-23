import Link from "next/link";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/90 backdrop-blur-md text-ink">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink"
        >
          Fix<span className="text-signal">Master</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-steel hover:text-signal transition-colors duration-200"
          >
            Кабинет мастера
          </Link>
          <Link
            href="/login"
            className="text-steel hover:text-signal transition-colors duration-200"
          >
            Вход
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-signal px-4 py-2 text-paper transition-all duration-200 hover:bg-signal/90 hover:shadow-md hover:shadow-signal/10 active:scale-98"
          >
            Регистрация
          </Link>
        </div>
      </nav>
    </header>
  );
}

