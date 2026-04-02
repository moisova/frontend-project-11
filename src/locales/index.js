import i18n from 'i18next'
import en from './en'
import ru from './ru'

const initI18n = () => {
  return i18n.init({
    lng: 'ru',
    resources: { ru, en },
  })
}

export { i18n, initI18n }
