export default class Dialog {
 
  id
  instance
  modal
  content

  constructor(config) {
    this.modal = config.modal
    config.id = `${`dialog-${Math.random().toString(36).slice(2, 12)}`}`
    this._id = config.id
    config.instance = `
    <dialog id ="${this._id}" class="dialog" style="${config.style}">
        <section id="content-${this._id}">
          ${config.content}
          
        </section>
    </dialog>
    `
    document.querySelector('body').insertAdjacentHTML('beforeend', config.instance)
    this.instance = document.getElementById(this._id)
    this._content = config.content
  }
  get id() {
    return this._id
  }

  set content(content) {
    if (this.instance.querySelector('dialog')) {
      this._content = content
    } else {
      console.error('No se puede asignar contenido a una instancia eliminada del DOM')
    }
  }
  /**
   * @param {string} style
   */
  set style(style) {
    if (this.instance.parentElement) {
      if (style) {
        this.instance.setAttribute('style', style)
      }
    } else {
      console.error('No se puede asignar contenido a una instancia eliminada del DOM')
    }
  }

  show() {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        if (this.modal) {
          // el usuario sólo puede interactuar con el cuadro de diálogo abierto
          this.instance.showModal()
        } else {
          // el usuario puede seguir interactuando con otros elementos de la página
          this.instance.show()
        }
        resolve('ok')
      } else {
        reject('No se puede mostrar un dialog removido del DOM')
      }
    })
  }
  close() {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        resolve('ok')
        this.instance.close()
      } else {
        console.warn('Nada para cerrar. La instancia ya no existe en el DOM')
        reject('No se puede cerrar un dialog removido del DOM')
      }
    })
  }

  remove() {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        this.instance.remove()
        resolve('ok')
      } else {
        console.warn('Nada para eliminar. La instancia ya no existe en el DOM')
        reject('No se puede eliminar. La instancia ya no existe')
      } 
      this.instance = undefined
      this._id = undefined
      this.buttons = undefined
    })
  }
}
