import './style.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { initI18n } from './locales/index.js'

initI18n().then(() => {
  import('./js/state.js')
  import('./js/view.js')
  import('./js/updater.js')
  import('./js/modal.js')
})
