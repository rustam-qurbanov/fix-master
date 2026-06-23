"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? "Не удалось войти");
      }
      const { access_token, refresh_token, role } = await res.json();
      await supabase.auth.setSession({ access_token, refresh_token });
      router.push(role === "master" ? "/dashboard" : "/");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-ink placeholder:text-steel/50 focus:border-signal focus:ring-2 focus:ring-signal/10 focus:outline-none transition duration-200";
  const label = "block text-xs font-semibold uppercase tracking-wider text-steel mb-1.5";

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="ticket p-8 shadow-sm">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink text-center mb-1">
          Вход
        </h1>
        <p className="text-center text-sm text-steel mb-6">
          Войдите в свой личный кабинет FixMaster
        </p>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label className={label}>Email</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Пароль</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-signal hover:bg-signal/90 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow transition duration-200 disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-steel">
          Еще нет аккаунта?{" "}
          <Link href="/register" className="text-signal hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </main>
  );
}

