import Dialog from './dialog.js'

export default class Toast extends Dialog {
  #delay
  #timeoutId

  constructor({ content = 'Sin contenido', mode = 'info', delay = 3000, close = false } = {}) {
    super({ modal: false })
    this.#delay = delay

    if (close) {
      this.content = `
        <div style="display:flex">
          <div style="flex: 0 1 auto;">${this.#getIcon(mode)}</div>
          <div style="flex: 1 1 auto; font-size: 16px;">${content}</div>
          <div style="flex: 0 1 auto;"><button id="${this.id}-close" >✖</button></div>
        </div>
    `
      document.querySelector(`#${this.id}-close`).addEventListener('click', () => {
        return new Promise((resolve, reject) => {
          if (this.instance) {
            clearTimeout(this.#timeoutId)
            this.instance.remove()
            resolve('ok')
          } else {
            reject('No se puede mostrar un toast removido del DOM')
          }
        })
      })
    } else {
      this.content = `
        <div style="display:flex;justify-content: center;">
          ${this.#getIcon(mode)}<span style="font-size: 16px;">${content}</span>
        </div>`
    }

    this.style = this.#getStyles(mode)
    this.show()
  }

  /**
   * bla bla bla
   * @returns bla bla bla
   */
  show() {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        // el usuario puede seguir interactuando con otros elementos de la página
        this.instance.show()

        this.#timeoutId = setTimeout(() => {
          this.instance.remove()
          resolve('ok')
        }, this.#delay)
      } else {
        reject('No se puede mostrar un toast removido del DOM')
      }
    })
  }

  #getStyles(mode) {
    switch (mode) {
      case 'warning':
        return 'background-color:#d69404;color:white;'
      case 'success':
        return 'background-color:#007a56;color:white;'
      case 'danger':
        return 'background-color:#af0000;color:white;'
      default:
        return 'background-color:#00519c;color:white;'
    }
  }

  #getIcon(mode) {
    switch (mode) {
      case 'warning':
        return `
        <i style="margin-right: 10px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
          </svg>
        </i>`
      case 'success':
        return `
          <i style="margin-right: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </i>`
      case 'danger':
        return `
          <i style="margin-right: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
          </i>`
      default:
        return `
          <i style="margin-right: 10px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
          </svg>
          </i>`
    }
  }
}
