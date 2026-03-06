"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "reset";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const buttonLabel = useMemo(() => {
    if (mode === "signup") return "Create account";
    if (mode === "reset") return "Send reset link";
    return "Sign in";
  }, [mode]);

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        window.location.href = "/";
        return;
      }

      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone,
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        setInfo("Account created. Check your email for confirmation.");
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setInfo("Reset link sent. Check your inbox.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f3ec] px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] border border-[#d8d5c8] bg-[#f7f6f0] p-8 shadow-lg shadow-black/10">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-[#1f211f]">Scorebet Auth</p>
          <p className="text-sm text-slate-600">Sign in, sign up, or reset password</p>
        </div>

        <div className="mb-6 flex rounded-full border border-[#d8d5c8] bg-white p-1 text-sm">
          <TabButton
            label="Sign in"
            active={mode === "signin"}
            onClick={() => {
              setMode("signin");
              clearMessages();
            }}
          />
          <TabButton
            label="Sign up"
            active={mode === "signup"}
            onClick={() => {
              setMode("signup");
              clearMessages();
            }}
          />
          <TabButton
            label="Reset"
            active={mode === "reset"}
            onClick={() => {
              setMode("reset");
              clearMessages();
            }}
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
              required
            />
          </label>

          {mode === "signup" ? (
            <label className="block text-sm text-slate-700">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
                required
              />
            </label>
          ) : null}

          {mode === "signup" ? (
            <label className="block text-sm text-slate-700">
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
              />
            </label>
          ) : null}

          {mode !== "reset" ? (
            <label className="block text-sm text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
                required
              />
            </label>
          ) : null}

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          {info ? <p className="text-sm font-medium text-emerald-700">{info}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Please wait..." : buttonLabel}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link className="text-sky-700 hover:underline" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex-1 min-h-[34px] rounded-full px-3 py-1.5 text-[14px] leading-tight ${
        active ? "bg-[#1877F2] font-medium text-white shadow-md shadow-blue-500/20" : "text-slate-600"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
