import { LANGUAGES, LANGUAGE_TO_FLAG } from "../constants";

export function getLanguageName(languageCode) {
  const language = LANGUAGES.find(lang => lang.code === languageCode);
  return language ? language.name : languageCode;
}

export function getLanguageFlag(languageCode) {
  if (!languageCode) return null;

  const language = LANGUAGES.find(lang => lang.code === languageCode);
  if (language) {
    return language.flag;
  }

  // Fallback to old system for backward compatibility
  const langLower = languageCode.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return `https://flagcdn.com/24x18/${countryCode}.png`;
  }

  return null;
}
