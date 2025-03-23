import { TabulatorFull as Tabulator } from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.min.js'

import icons from './icons.js'
import Dialog from './dialog.js'
import Toast from './toast.js'
import Popup from './popup.js'
import Alert from './alert.js'
import Helpers from './helpers.js'

class App {
  static async main() {
    const config = await Helpers.fetchData('./resources/assets/config.json')
    window.urlAPI = config.url
    window.icons = icons
    window.Helpers = Helpers
    window.urlVentas = config.url
    window.Tabulator = Tabulator
    window.Popup = Popup
    window.Toast = Toast

    const listOptions = document.querySelectorAll('#main-menu a')
    listOptions.forEach(item => item.addEventListener('click', App.#mainMenu))
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
      case 'Services':
        const { default: Prueba } = await import(`./prueba.js`)
        await Prueba.init()
        break
      case 'Clientes':
        const { default: Clientes } = await import(`./clientes.js`)
        await Clientes.init()
        break
      case 'Productos':
        const { default: Productos } = await import(`./productos.js`)
        await Productos.init()
        break
      case 'Informe de ventas':
        const { default: InfoVentas } = await import(`./infoVentas.js`)
        await InfoVentas.init()
        break
      case 'About':
        const aboutPage = Helpers.loadPage('./resources/html/about.html', 'main')
        break
      default:
        new Toast({ content: `La opción ${option} no ha sido implementada`, mode: 'warning', delay: 3000, close: false })
        console.warn('Fallo en ', e.target)
      // Toast se puede usar en los modos 'success', 'warning', 'danger' o 'info'
      // Toast.info({ message: `No hay un caso para la opción ${option} `, mode: 'warning' })
    }
  }
}

App.main()
