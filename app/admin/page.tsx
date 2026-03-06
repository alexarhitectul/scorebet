"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";

type Competition = {
  id: string;
  name: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [items, setItems] = useState<Competition[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const loadCompetitions = async () => {
    const res = await fetch("/api/competitions");
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setError(body?.error ?? "Failed to load competitions.");
      return;
    }
    setItems(body?.competitions ?? []);
  };

  useEffect(() => {
    const init = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const userEmail = data.session?.user?.email ?? "";

      if (!userEmail) {
        router.replace("/auth");
        return;
      }
      if (!isAdminEmail(userEmail)) {
        router.replace("/");
        return;
      }

      setEmail(userEmail);
      await loadCompetitions();
      setLoading(false);
    };

    void init();
  }, [router]);

  const getAccessToken = async () => {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setInfo("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Competition name is required.");
      return;
    }

    setBusy(true);
    const token = await getAccessToken();
    const res = await fetch("/api/admin/competitions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: trimmedName }),
    });
    const body = await res.json().catch(() => null);
    setBusy(false);

    if (!res.ok) {
      setError(body?.error ?? "Failed to create competition.");
      return;
    }

    setName("");
    setInfo("Competition created.");
    await loadCompetitions();
  };

  const handleDelete = async (id: string) => {
    setError("");
    setInfo("");
    setBusy(true);

    const token = await getAccessToken();
    const res = await fetch(`/api/admin/competitions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => null);
    setBusy(false);

    if (!res.ok) {
      setError(body?.error ?? "Failed to delete competition.");
      return;
    }

    setInfo("Competition deleted.");
    await loadCompetitions();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1877F2] text-white">
        Loading admin...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1877F2] px-3 py-4 text-[#101828]">
      <section className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="bg-[#1877F2] px-4 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-md border border-white/30 bg-white/10"
            >
              <span className="h-0.5 w-5 bg-white" />
              <span className="h-0.5 w-5 bg-white" />
              <span className="h-0.5 w-5 bg-white" />
            </button>
            <div className="text-right">
              <p
                className="flex items-center justify-end gap-1 text-[1.65rem] font-bold leading-none tracking-tight"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <span>Score</span>
                <span className="rounded-lg bg-white px-1 py-0.5 text-[#1877F2]">Bet</span>
              </p>
              <p className="mt-1 text-sm text-blue-100">admin page</p>
            </div>
          </div>
          {menuOpen ? (
            <div className="mt-3 w-56 rounded-lg bg-white p-1 text-[#101828] shadow-lg">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
              >
                Home
              </button>
              <button
                type="button"
                onClick={async () => {
                  const supabase = createSupabaseBrowserClient();
                  await supabase.auth.signOut();
                  router.replace("/auth");
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : null}
        </header>

        <div className="px-4 py-4">
          <p className="text-xs text-slate-500">
            Logged as: <span className="font-medium text-slate-700">{email}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Allowed admin: {ADMIN_EMAIL}</p>
        </div>

        <form onSubmit={handleCreate} className="px-4 pb-4 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Competition name (ex: Champions League 2026)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            disabled={busy}
          />
          <button
            type="submit"
            className="rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
          >
            Add
          </button>
        </form>

        {error ? <p className="px-4 pb-2 text-sm text-rose-600">{error}</p> : null}
        {info ? <p className="px-4 pb-2 text-sm text-emerald-700">{info}</p> : null}

        <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-[1fr_auto] border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span>Competitions</span>
            <span>Action</span>
          </div>
          {items.length === 0 ? (
            <p className="px-3 py-4 text-sm text-slate-500">No competitions yet.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[1fr_auto] items-center border-b border-slate-100 px-3 py-3 text-sm last:border-0"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item.id)}
                    className="rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                    disabled={busy}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
