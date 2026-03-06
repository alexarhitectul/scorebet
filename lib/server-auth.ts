import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";

function getBearerToken(headerValue: string | null): string | null {
  if (!headerValue) return null;
  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

export async function requireAdminFromRequest(headers: Headers) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { ok: false as const, status: 500, error: "Missing Supabase env." };
  }

  const token = getBearerToken(headers.get("authorization"));
  if (!token) {
    return { ok: false as const, status: 401, error: "Missing bearer token." };
  }

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false as const, status: 401, error: "Invalid auth token." };
  }

  if (!isAdminEmail(data.user.email)) {
    return {
      ok: false as const,
      status: 403,
      error: `Only admin (${ADMIN_EMAIL}) is allowed.`,
    };
  }

  return { ok: true as const, user: data.user };
}
