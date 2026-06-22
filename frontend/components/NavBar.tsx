import Link from "next/link";

export function NavBar() {
  return (
    <header className="bg-ink text-paper">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="font-display text-xl font-bold uppercase tracking-wide"
        >
          Fix<span className="text-signal">Master</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/dashboard"
            className="text-paper/80 transition hover:text-paper"
          >
            Кабинет мастера
          </Link>
          <Link
            href="/login"
            className="text-paper/80 transition hover:text-paper"
          >
            Вход
          </Link>
          <Link
            href="/register"
            className="border border-signal px-3 py-1.5 font-medium text-signal transition hover:bg-signal hover:text-ink"
          >
            Регистрация
          </Link>
        </div>
      </nav>
    </header>
  );
}
