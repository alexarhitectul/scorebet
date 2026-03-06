import { NextResponse } from "next/server";

export async function GET() {
  const status = {
    app: "ok",
    timestamp: new Date().toISOString(),
    supabase: {
      url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      anonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    firebase: {
      apiKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      authDomain: Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
      projectId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      appId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    },
  };

  return NextResponse.json(status);
}
