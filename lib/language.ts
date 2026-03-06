export type Language = "en" | "de" | "fr" | "es" | "it" | "pt" | "ro" | "nl";

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_STORAGE_KEY = "scorebet_lang";

export function isLanguage(value: string | null): value is Language {
  return (
    value === "en" ||
    value === "de" ||
    value === "fr" ||
    value === "es" ||
    value === "it" ||
    value === "pt" ||
    value === "ro" ||
    value === "nl"
  );
}
