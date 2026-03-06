"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/admin";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "@/lib/language";

const communities = [
  "scorebet daily league",
  "premier picks",
  "champions challenge",
  "liga weekend",
  "predictor masters",
];

const publicGames = ["UCL", "LaLiga", "F1", "Euro 2028", "UEL"];

const homeCopyByLanguage: Record<
  Language,
  {
    loading: string;
    subtitle: string;
    myCommunities: string;
    createPredictionGame: string;
    publicPredictionGames: string;
    myProfile: string;
    logout: string;
  }
> = {
  en: {
    loading: "Loading...",
    subtitle: "Predictor games for your communities",
    myCommunities: "My competitions",
    createPredictionGame: "Create prediction game",
    publicPredictionGames: "Public prediction games",
    myProfile: "My Profile",
    logout: "Logout",
  },
  de: {
    loading: "Wird geladen...",
    subtitle: "Tippspiele fuer deine Communities",
    myCommunities: "Meine Communities",
    createPredictionGame: "Tippspiel erstellen",
    publicPredictionGames: "Oeffentliche Tippspiele",
    myProfile: "Mein Profil",
    logout: "Abmelden",
  },
  fr: {
    loading: "Chargement...",
    subtitle: "Jeux de pronostics pour vos communautes",
    myCommunities: "Mes communautes",
    createPredictionGame: "Creer un jeu de pronostics",
    publicPredictionGames: "Jeux de pronostics publics",
    myProfile: "Mon profil",
    logout: "Deconnexion",
  },
  es: {
    loading: "Cargando...",
    subtitle: "Juegos de pronosticos para tus comunidades",
    myCommunities: "Mis comunidades",
    createPredictionGame: "Crear juego de pronosticos",
    publicPredictionGames: "Juegos publicos de pronosticos",
    myProfile: "Mi perfil",
    logout: "Cerrar sesion",
  },
  it: {
    loading: "Caricamento...",
    subtitle: "Giochi pronostici per le tue comunita",
    myCommunities: "Le mie comunita",
    createPredictionGame: "Crea gioco pronostici",
    publicPredictionGames: "Giochi pronostici pubblici",
    myProfile: "Il mio profilo",
    logout: "Esci",
  },
  pt: {
    loading: "Carregando...",
    subtitle: "Jogos de prognosticos para suas comunidades",
    myCommunities: "Minhas comunidades",
    createPredictionGame: "Criar jogo de prognosticos",
    publicPredictionGames: "Jogos publicos de prognosticos",
    myProfile: "Meu perfil",
    logout: "Sair",
  },
  ro: {
    loading: "Se incarca...",
    subtitle: "Competitii de pronosticuri sportive",
    myCommunities: "Competitiile tale",
    createPredictionGame: "Creeaza joc de predictii",
    publicPredictionGames: "Jocuri publice de predictii",
    myProfile: "Profilul meu",
    logout: "Deconectare",
  },
  nl: {
    loading: "Laden...",
    subtitle: "Voorspelspellen voor jouw communities",
    myCommunities: "Mijn communities",
    createPredictionGame: "Voorspelspel maken",
    publicPredictionGames: "Openbare voorspelspellen",
    myProfile: "Mijn profiel",
    logout: "Uitloggen",
  },
};

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const language = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      window.addEventListener("scorebet-language-change", handler as EventListener);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener("scorebet-language-change", handler as EventListener);
      };
    },
    () => {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
    },
    () => DEFAULT_LANGUAGE,
  );
  const [loading, setLoading] = useState(true);
  const t = homeCopyByLanguage[language];
  const isAdmin = isAdminEmail(email);

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
      const competitionsRes = await fetch("/api/competitions");
      const competitionsBody = await competitionsRes.json().catch(() => null);
      if (competitionsRes.ok) {
        const names = (competitionsBody?.competitions ?? [])
          .map((item: { name?: string }) => item?.name?.toString().trim())
          .filter(Boolean);
        if (names.length > 0) {
          setCompetitions(names);
        }
      }
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
        {t.loading}
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
              <p className="mt-1 text-sm text-blue-100">{t.subtitle}</p>
            </div>
          </div>
          {menuOpen ? (
            <div className="mt-3 w-56 rounded-lg bg-white p-1 text-[#101828] shadow-lg">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  Admin Panel
                </button>
              ) : null}
              <button
                type="button"
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
              >
                {t.myProfile}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
              >
                {t.logout}
              </button>
            </div>
          ) : null}
        </header>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-center text-base font-semibold">
          {t.myCommunities}
        </div>
        <ul>
          {(competitions.length > 0 ? competitions : communities).map((item) => (
            <li key={item} className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm">
              <span>{item}</span>
              <span className="text-slate-400">{">"}</span>
            </li>
          ))}
        </ul>

        <div className="px-4 py-5">
          <button
            type="button"
            className="mx-auto block w-[72%] rounded-md bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            {t.createPredictionGame}
          </button>
        </div>

        <div className="border-y border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold">
          {t.publicPredictionGames}
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
          <span>{t.myProfile}</span>
          <span className="text-slate-400">{">"}</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
        >
          <span>{t.logout}</span>
          <span className="text-slate-400">{">"}</span>
        </button>
      </section>
    </main>
  );
}
