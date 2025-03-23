import Popup from './popup.js'

export default class Alert extends Popup {
  constructor({ modal = true, style = 'color:black', title = 'Sin título', content = 'Sin contenido', image = '', button = { caption: 'Aceptar', classes: ['custom-btn', 'btn-cancel'], action: () => this.remove() } } = {}) {
    // no se envía el content a super() porque hay que es posible que el contenido requiera formato
    super({ title, modal, style, buttons: [button] })
    this.#setContent(image, content)
    this.show()
  }

  /**
   * Dar formato al contenido antes de enviar
   * @param {String} content
   */
  #setContent(image, content) {
    // definir los SVG para warning, danger y success
    const exclamation = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FBC02D" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
      </svg>`

    const xCircle = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#B71C1C" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
    </svg>`

    const checkCircle = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#239B56" class="bi bi-check2-circle" viewBox="0 0 16 16">
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
      </svg>`

    // Si hay que asignar imagen establecer la indicada
    let html = content
    if (image) {
      if (image === 'warning') {
        image = exclamation
      } else if (image === 'danger') {
        image = xCircle
      } else if (image === 'success') {
        image = checkCircle
      }

      // disponer la imagen a la izquierda del mensaje
      html = `
        <div style="display:flex;width:100%">
          <div style="margin-right:10px">
            ${image}          
          </div>
          <div style="text-align:left;">
            ${content}
          </div>
        </div>`
    }
    // asignar al contenido el content original que llega como argumento o el formateado
    this.content = html
  }
}
