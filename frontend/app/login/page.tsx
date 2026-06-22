"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    "w-full border-0 border-b-2 border-ink/20 bg-transparent px-0 py-2 focus:border-signal focus:outline-none";
  const label = "font-mono text-[11px] uppercase tracking-wider text-steel";

  return (
    <main className="mx-auto max-w-sm px-5 py-14">
      <div className="ticket p-7 pt-9">
        <h1 className="font-display text-2xl font-bold uppercase">Вход</h1>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className={label}>Email</label>
            <input
              type="email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>
          {error && (
            <p className="font-mono text-sm text-signal">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-ink py-2.5 font-display font-bold uppercase tracking-wide text-paper transition hover:bg-signal disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </main>
  );
}
