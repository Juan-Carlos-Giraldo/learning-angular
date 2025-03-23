import { TabulatorFull as Tabulator } from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.min.js'

import Dialog from './dialog.js'
import Toast from './toast.js'
import Popup from './popup.js'
import Alert from './alert.js'
import Helpers from './helpers.js'

class App {
  static async main() {
    const config = await Helpers.fetchData('./resources/assets/config.json')
    window.urlVentas = config.url
    window.Tabulator = Tabulator
    window.Popup = Popup

    App.loadHome()

    const listOptions = document.querySelectorAll('#main-menu a')
    listOptions.forEach(item => item.addEventListener('click', App.#mainMenu))

    document.querySelector('#read-more').addEventListener('click', App.#mainMenu)
  }

  /**
   * Determina la acción a llevar a cabo según la opción elegida en el menú principal
   * @param {String} option El texto del ancla seleccionada
   */
  static #mainMenu = async e => {
    let option = 'ninguna'
    if (e !== undefined) {
      e.preventDefault()
      option = e.target.text
    }

    switch (option) {
      case 'Home':
        App.loadHome()
        break
      case 'Services':
        const { default: Prueba } = await import(`./prueba.js`)
        await Prueba.init()
        break
      case 'Pricing':
        App.testConnection()
        break
      case 'About':
        const aboutPage = Helpers.loadPage('./resources/html/about.html', 'main')
        break
      case 'Read more':
        const readMore = Helpers.loadPage('./resources/html/about.html', 'main')
        break
      default:
        new Toast({ content: `La opción ${option} no ha sido implementada`, mode: 'warning', delay: 3000, close: false })
        console.warn('Fallo en ', e.target)
      // Toast se puede usar en los modos 'success', 'warning', 'danger' o 'info'
      // Toast.info({ message: `No hay un caso para la opción ${option} `, mode: 'warning' })
    }
  }

  /**
   * Esta función sirve para probar que hay acceso al servidor de la API Rest
   * Ver las líneas 11 y 12 para saber qué contiene urlVentas
   */
  static async testConnection() {
    const data = await Helpers.fetchData(`${urlVentas}/productos`)
    console.log(data)
    document.querySelector('main').innerText = JSON.stringify(data)
  }

  /**
   * Carga la página de inicio de la aplicación
   */
  static loadHome() {
    Helpers.loadPage('./resources/html/home.html', 'main')
  }
}

App.main()
