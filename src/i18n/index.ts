import { translations, Language } from "@/i18n/translations";

// Helper type for nested translation access
type TranslationValue = string | { [key: string]: TranslationValue };

export type Translations = typeof translations.de;

export function getTranslations(language: Language): Translations {
  return translations[language] as Translations;
}
