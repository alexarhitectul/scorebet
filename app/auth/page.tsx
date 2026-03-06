"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "reset";
type Language = "en" | "de" | "fr" | "es" | "it" | "pt" | "ro" | "nl";

type Copy = {
  title: string;
  subtitle: string;
  languageLabel: string;
  signInTab: string;
  signUpTab: string;
  resetTab: string;
  email: string;
  name: string;
  password: string;
  createAccount: string;
  sendResetLink: string;
  signInAction: string;
  pleaseWait: string;
  backHome: string;
  accountCreated: string;
  resetSent: string;
  unexpectedError: string;
};

const copyByLanguage: Record<Language, Copy> = {
  en: {
    title: "Scorebet Auth",
    subtitle: "Sign in, sign up, or reset password",
    languageLabel: "Language",
    signInTab: "Sign in",
    signUpTab: "Sign up",
    resetTab: "Reset",
    email: "Email",
    name: "Name",
    password: "Password",
    createAccount: "Create account",
    sendResetLink: "Send reset link",
    signInAction: "Sign in",
    pleaseWait: "Please wait...",
    backHome: "Back to home",
    accountCreated: "Account created. You can sign in now.",
    resetSent: "Reset link sent. Check your inbox.",
    unexpectedError: "Unexpected error",
  },
  de: {
    title: "Scorebet Anmeldung",
    subtitle: "Anmelden, registrieren oder Passwort zurücksetzen",
    languageLabel: "Sprache",
    signInTab: "Anmelden",
    signUpTab: "Registrieren",
    resetTab: "Zurücksetzen",
    email: "E-Mail",
    name: "Name",
    password: "Passwort",
    createAccount: "Konto erstellen",
    sendResetLink: "Reset-Link senden",
    signInAction: "Anmelden",
    pleaseWait: "Bitte warten...",
    backHome: "Zur Startseite",
    accountCreated: "Konto erstellt. Du kannst dich jetzt anmelden.",
    resetSent: "Reset-Link gesendet. Prüfe dein Postfach.",
    unexpectedError: "Unerwarteter Fehler",
  },
  fr: {
    title: "Authentification Scorebet",
    subtitle: "Connexion, inscription ou réinitialisation du mot de passe",
    languageLabel: "Langue",
    signInTab: "Connexion",
    signUpTab: "Inscription",
    resetTab: "Réinitialiser",
    email: "E-mail",
    name: "Nom",
    password: "Mot de passe",
    createAccount: "Créer un compte",
    sendResetLink: "Envoyer le lien",
    signInAction: "Connexion",
    pleaseWait: "Veuillez patienter...",
    backHome: "Retour à l'accueil",
    accountCreated: "Compte créé. Vous pouvez maintenant vous connecter.",
    resetSent: "Lien envoyé. Vérifiez votre boîte mail.",
    unexpectedError: "Erreur inattendue",
  },
  es: {
    title: "Autenticación Scorebet",
    subtitle: "Inicia sesión, regístrate o restablece la contraseña",
    languageLabel: "Idioma",
    signInTab: "Iniciar sesión",
    signUpTab: "Registrarse",
    resetTab: "Restablecer",
    email: "Correo",
    name: "Nombre",
    password: "Contraseña",
    createAccount: "Crear cuenta",
    sendResetLink: "Enviar enlace",
    signInAction: "Entrar",
    pleaseWait: "Espera un momento...",
    backHome: "Volver al inicio",
    accountCreated: "Cuenta creada. Ya puedes iniciar sesión.",
    resetSent: "Enlace enviado. Revisa tu correo.",
    unexpectedError: "Error inesperado",
  },
  it: {
    title: "Accesso Scorebet",
    subtitle: "Accedi, registrati o reimposta la password",
    languageLabel: "Lingua",
    signInTab: "Accedi",
    signUpTab: "Registrati",
    resetTab: "Reset",
    email: "Email",
    name: "Nome",
    password: "Password",
    createAccount: "Crea account",
    sendResetLink: "Invia link",
    signInAction: "Accedi",
    pleaseWait: "Attendere...",
    backHome: "Torna alla home",
    accountCreated: "Account creato. Ora puoi accedere.",
    resetSent: "Link inviato. Controlla la tua email.",
    unexpectedError: "Errore imprevisto",
  },
  pt: {
    title: "Autenticacao Scorebet",
    subtitle: "Entrar, criar conta ou redefinir senha",
    languageLabel: "Idioma",
    signInTab: "Entrar",
    signUpTab: "Criar conta",
    resetTab: "Redefinir",
    email: "Email",
    name: "Nome",
    password: "Senha",
    createAccount: "Criar conta",
    sendResetLink: "Enviar link",
    signInAction: "Entrar",
    pleaseWait: "Aguarde...",
    backHome: "Voltar para inicio",
    accountCreated: "Conta criada. Agora voce pode entrar.",
    resetSent: "Link enviado. Verifique seu email.",
    unexpectedError: "Erro inesperado",
  },
  ro: {
    title: "Autentificare Scorebet",
    subtitle: "Conectare, cont nou sau resetare parola",
    languageLabel: "Limba",
    signInTab: "Conectare",
    signUpTab: "Cont nou",
    resetTab: "Resetare",
    email: "Email",
    name: "Nume",
    password: "Parola",
    createAccount: "Creeaza cont",
    sendResetLink: "Trimite link",
    signInAction: "Conectare",
    pleaseWait: "Te rog asteapta...",
    backHome: "Inapoi acasa",
    accountCreated: "Cont creat. Te poti conecta acum.",
    resetSent: "Link trimis. Verifica emailul.",
    unexpectedError: "Eroare neasteptata",
  },
  nl: {
    title: "Scorebet Inloggen",
    subtitle: "Inloggen, registreren of wachtwoord resetten",
    languageLabel: "Taal",
    signInTab: "Inloggen",
    signUpTab: "Registreren",
    resetTab: "Reset",
    email: "E-mail",
    name: "Naam",
    password: "Wachtwoord",
    createAccount: "Account maken",
    sendResetLink: "Resetlink sturen",
    signInAction: "Inloggen",
    pleaseWait: "Even geduld...",
    backHome: "Terug naar home",
    accountCreated: "Account aangemaakt. Je kunt nu inloggen.",
    resetSent: "Resetlink verzonden. Controleer je inbox.",
    unexpectedError: "Onverwachte fout",
  },
};

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Francais" },
  { value: "es", label: "Espanol" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Portugues" },
  { value: "ro", label: "Romana" },
  { value: "nl", label: "Nederlands" },
];

export default function AuthPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const t = copyByLanguage[language];

  useEffect(() => {
    const stored = window.localStorage.getItem("scorebet_lang");
    if (
      stored === "en" ||
      stored === "de" ||
      stored === "fr" ||
      stored === "es" ||
      stored === "it" ||
      stored === "pt" ||
      stored === "ro" ||
      stored === "nl"
    ) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("scorebet_lang", language);
  }, [language]);

  const buttonLabel = useMemo(() => {
    if (mode === "signup") return t.createAccount;
    if (mode === "reset") return t.sendResetLink;
    return t.signInAction;
  }, [mode, t.createAccount, t.sendResetLink, t.signInAction]);

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
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        setInfo(t.accountCreated);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setInfo(t.resetSent);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f3ec] px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] border border-[#d8d5c8] bg-[#f7f6f0] p-8 shadow-lg shadow-black/10">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-[#1f211f]">{t.title}</p>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-700">
            {t.languageLabel}
            <select
              className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-6 flex rounded-full border border-[#d8d5c8] bg-white p-1 text-sm">
          <TabButton
            label={t.signInTab}
            active={mode === "signin"}
            onClick={() => {
              setMode("signin");
              clearMessages();
            }}
          />
          <TabButton
            label={t.signUpTab}
            active={mode === "signup"}
            onClick={() => {
              setMode("signup");
              clearMessages();
            }}
          />
          <TabButton
            label={t.resetTab}
            active={mode === "reset"}
            onClick={() => {
              setMode("reset");
              clearMessages();
            }}
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            {t.email}
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
              {t.name}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d8d5c8] bg-white px-3 py-2 text-sm text-[#1f211f] focus:border-sky-500 focus:outline-none"
                required
              />
            </label>
          ) : null}

          {mode !== "reset" ? (
            <label className="block text-sm text-slate-700">
              {t.password}
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
            {loading ? t.pleaseWait : buttonLabel}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link className="text-sky-700 hover:underline" href="/">
            {t.backHome}
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
