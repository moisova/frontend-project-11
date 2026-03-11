import i18n from "i18next";
import en from "./en";
import ru from "./ru";

i18n.init({
  lng: 'ru',
  resources: {
    ru: ru,
    en: en
  }
})

export default i18n