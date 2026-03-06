"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const communities = [
  "scorebet daily league",
  "premier picks",
  "champions challenge",
  "liga weekend",
  "predictor masters",
];

const publicGames = ["UCL", "LaLiga", "F1", "Euro 2028", "UEL"];

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.replace("/auth");
        return;
      }

      setEmail(user.email ?? "");
      setLoading(false);
    };

    void load();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1877F2] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1877F2] px-3 py-4 text-[#101828]">
      <section className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="bg-[#0f63cf] px-4 py-4 text-white">
          <p className="text-3xl font-bold tracking-tight">scorebet</p>
          <p className="text-sm text-blue-100">Predictor games for your communities</p>
        </header>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold">
          My Communities
        </div>
        <ul>
          {communities.map((item) => (
            <li key={item} className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm">
              <span>{item}</span>
              <span className="text-slate-400">›</span>
            </li>
          ))}
        </ul>

        <div className="px-4 py-5">
          <button
            type="button"
            className="w-full rounded-md bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Create prediction game
          </button>
        </div>

        <div className="border-y border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold">
          Public prediction games
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {publicGames.map((game) => (
            <div
              key={game}
              className="min-w-[62px] rounded-md bg-[#1877F2] px-2 py-3 text-center text-xs font-semibold text-white"
            >
              {game}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold">{email}</div>
        <button
          type="button"
          className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
        >
          <span>My Profile</span>
          <span className="text-slate-400">›</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
        >
          <span>Logout</span>
          <span className="text-slate-400">›</span>
        </button>
      </section>
    </main>
  );
}
