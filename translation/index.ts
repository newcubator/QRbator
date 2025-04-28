import { init18n } from "../core/i18n/init";
import de from "./de.json";
import en from "./en.json";

export const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
};

export const fallbackLng = "en";

export type LanguageCode = keyof typeof resources;

const i18n = init18n({ resources, fallbackLng });

export default i18n;
