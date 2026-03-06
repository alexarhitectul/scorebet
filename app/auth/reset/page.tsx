"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getSession().then(() => setReady(true));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Missing config");
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setInfo("Password updated. You can now sign in.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f3ec] px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] border border-[#d8d5c8] bg-[#f7f6f0] p-8 shadow-lg shadow-black/10">
        <h1 className="text-lg font-semibold text-[#1f211f]">Set new password</h1>
        <p className="mt-1 text-sm text-slate-600">
          Open this page from the reset email link and choose a new password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
              required
            />
          </label>

          <label className="block text-sm text-slate-700">
            Confirm password
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
              required
            />
          </label>

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          {info ? <p className="text-sm font-medium text-emerald-700">{info}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading || !ready}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link className="text-sky-700 hover:underline" href="/auth">
            Back to auth
          </Link>
        </p>
      </div>
    </main>
  );
}
