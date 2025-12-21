// Language utility - dynamically loads properties based on language code

import englishProperties from "./english";
import hindiProperties from "./hindi";
import kannadaProperties from "./kannada";
import bengaliProperties from "./bengali";

// Language property maps
const languageMaps = {
  en: englishProperties,
  hi: hindiProperties,
  kn: kannadaProperties,
  bn: bengaliProperties,
};

// Get properties for a specific language
export const getLanguageProperties = (languageCode = "en") => {
  return languageMaps[languageCode] || languageMaps["en"];
};

// Get a property value for a specific language
export const getProperty = (key, languageCode = "en") => {
  const properties = getLanguageProperties(languageCode);
  return properties[key] || key;
};

// Language options for the language switcher (common for all languages)
export const languageOptions = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "bn", name: "বাংলা" }
];

