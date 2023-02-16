import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './en/translation.json';
import translationUk from './uk/translation.json';

export const resources = {
  en: {
    translation: translationEn,
  },
  "uk-UA": {
    translation: translationUk,
  }
};

i18next.use(initReactI18next).init({
  lng: 'uk-UA', // if you're using a language detector, do not define the lng option
  debug: false,
  fallbackLng: 'uk-UA',
  resources,
});