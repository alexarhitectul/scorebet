export default function Home() {
  const checks = [
    {
      name: "Supabase URL",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
    {
      name: "Supabase Anon Key",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
    {
      name: "Firebase API Key",
      ok: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    },
    {
      name: "Firebase Project ID",
      ok: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    },
  ];

  const completed = checks.filter((item) => item.ok).length;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-2xl border border-white/10 bg-slate-900/80 p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
            scorebet.app
          </p>
          <h1 className="text-4xl font-semibold">Bootstrap complet activ</h1>
          <p className="text-slate-300">
            Aplicația rulează pe Next.js și este pregătită pentru Vercel,
            Supabase și Firebase.
          </p>
        </div>

        <section className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-lg font-medium">Status configurare mediu</h2>
          <p className="mt-1 text-sm text-slate-300">
            {completed}/{checks.length} variabile esențiale setate.
          </p>
          <ul className="mt-4 space-y-2">
            {checks.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2 text-sm"
              >
                <span>{item.name}</span>
                <span
                  className={item.ok ? "text-emerald-300" : "text-amber-300"}
                >
                  {item.ok ? "OK" : "Lipsește"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row">
          <a
            className="flex h-11 w-full items-center justify-center rounded-lg bg-emerald-400 px-4 text-slate-900 transition hover:bg-emerald-300"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creeaza proiectul pe Vercel
          </a>
          <a
            className="flex h-11 w-full items-center justify-center rounded-lg border border-white/20 px-4 transition hover:bg-white/5"
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
          >
            Verifica health endpoint
          </a>
        </div>
      </main>
    </div>
  );
}
