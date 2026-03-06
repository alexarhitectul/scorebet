# ScoreBet

Bootstrap pentru `scorebet.app` cu:
- Next.js (App Router + TypeScript)
- Vercel (hosting/deploy)
- Supabase (Postgres + Auth + Storage)
- Firebase (Analytics / servicii client)

## 1) Rulare locală

```bash
npm install
cp .env.example .env.local
npm run dev
```

Aplicația pornește pe `http://localhost:3000`.

## 2) Variabile de mediu

Completează valorile în `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## 3) Supabase setup

1. Creează proiect nou în Supabase.
2. Ia URL + `anon key` din `Project Settings -> API`.
3. Ia `service_role key` (doar server-side, niciodată în client).
4. Pune aceste valori în `.env.local` și apoi în Vercel Environment Variables.

## 4) Firebase setup

1. Creează proiect nou în Firebase Console.
2. Adaugă o Web App și copiază configurația.
3. Completează variabilele `NEXT_PUBLIC_FIREBASE_*`.
4. Dacă folosești Analytics, activează Google Analytics în proiect.

## 5) Deploy pe Vercel

1. Urcă codul într-un repo GitHub.
2. Importă repo-ul în Vercel.
3. Adaugă toate variabilele de mediu din secțiunea de mai sus în Vercel (`Project Settings -> Environment Variables`).
4. Rulează primul deploy.

## 6) Domeniu `scorebet.app`

1. În Vercel: `Project -> Settings -> Domains -> Add scorebet.app`.
2. Adaugă și `www.scorebet.app` (opțional, recomandat).
3. În providerul de domeniu:
   - pentru apex (`scorebet.app`) configurează înregistrarea recomandată de Vercel;
   - pentru `www`, de regulă CNAME către target-ul Vercel.
4. După propagare DNS, setează redirect `www -> apex` sau invers (în Vercel).

## Endpoint util

- Health check: `GET /api/health`
- Verifică rapid ce variabile critice sunt prezente.
