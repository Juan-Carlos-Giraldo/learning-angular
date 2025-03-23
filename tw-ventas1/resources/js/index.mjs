import Dialog from './dialog.js'
import Toast from './toast.js'
import Popup from './popup.js'
import Alert from './alert.js'

import Helpers from './helpers.js'

class App {
  static main() {
    const listOptions = document.querySelectorAll('#main-menu a')
    console.log('listOptions: ', listOptions)
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
      case 'Inicio':
        console.log('Pagina de inicio')
        let bienvenida = ''
        document.querySelector('main').innerHTML = ''
        break
      case 'yyyyyyyy':
        console.log('yyyyyyyyyyyyyy')
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
