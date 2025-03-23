export default class Clientes {
  static #table
  static #modal
  static #currentOption
  static #form

  constructor() {
    throw new Error('No utilice el constructor. Use Clientes.init()')
  }

  static async init() {
    try {
      Clientes.#form = await Helpers.loadPage('./resources/html/clientes.html')
      const response = await Helpers.fetchData(`${urlAPI}/clientes`)
      if (response.message !== 'ok') {
        throw new Error('Falló la carga de clientes')
      }

      document.querySelector('main').innerHTML = `
                  <div class="p-2 w-full">
                      <div id="clientes" class="m-2"></div>
                  </dv>
              `

      Clientes.#table = new Tabulator('#clientes', {
        height: 'calc(100vh - 190px)', // establecer la altura de la tabla, esto habilita el DOM virtual y mejora drásticamente la velocidad de procesamiento
        data: response.data, // asignar los datos a la tabla
        layout: 'fitColumns', // ajustar columnas al ancho de la tabla (opcional)
        columns: [
          // definir las columnas de la tabla
          { title: 'IDENTIFICACIÓN', field: 'identificacion', width: 150, hozAlign: 'center' },
          { title: 'NOMBRE', field: 'nombre', hozAlign: 'left' },
          { title: 'TELÉFONO', field: 'telefono', hozAlign: 'left' },
          { formatter: Clientes.#editRowButton, width: 40, hozAlign: 'center', cellClick: Clientes.#editRowClick },
          { formatter: Clientes.#deleteRowButton, width: 40, hozAlign: 'center', cellClick: Clientes.#deleteRowClick }
        ],
        footerElement: `
              <div class='flex justify-end w-full'>
                  <button id="add-clientes" type="button" class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">${icons.add}Nuevo cliente</button>
              </div>`.trim()
      })

      Clientes.#table.on('tableBuilt', () => document.querySelector('#add-clientes').addEventListener('click', Clientes.#addRow))
    } catch (e) {
      new Toast({ content: 'Sin acceso a la opción de clientes', mode: 'danger', error: e })
    }

    return this
  }

  static #addRow = async e => {
    Clientes.#currentOption = 'add'
    Clientes.#modal = new Popup({
      classes: 'col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7',
      title: '<span class="text-back dark:text-gray-300">Agregar un cliente</span>',
      content: Clientes.#form,
      buttons: [
        { caption: icons.add + 'Agregar', classes: 'inline-flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2 ' },
        { caption: icons.x + 'Cancelar', classes: 'inline-flex text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2' }
      ],
      doSomething: Clientes.#toComplete
    })

    // mostrar el cuadro de diálogo y gestionar las opciones de agregar y cancelar
    try {
      const option = await Clientes.#modal.show()
      if (option === 'Cancelar' || option === '✖') {
        Clientes.#modal.close()
      } else if (option === 'Agregar') {
        Clientes.#add()
      }
    } catch (e) {
      new Toast({ content: 'Problemas al agregar el cliente', mode: 'danger', error: e })
    }
  }

  static async #add() {
    console.log('Agregar un cliente')
    // verificar si los datos cumplen con las restricciones indicadas en el formulario HTML
    if (!Helpers.okForm('#form-clientes')) {
      return
    }

    const data = Clientes.#getFormData()

    // Validar que la identificación no esté repetida
    if (await Clientes.#validateId(data.id)) {
      new Toast({ content: 'La identificación del cliente ya existe', mode: 'danger' })
      Clientes.#modal.close()
      return
    }

    try {
      // enviar la solicitud de creación con los datos del formulario
      let response = await Helpers.fetchData(`${urlAPI}/clientes`, {
        method: 'POST',
        body: data
      })

      if (response.message === 'ok') {
        Clientes.#table.addRow(response.data) // agregar el cliente a la tabla
        Clientes.#modal.close()
        new Toast({ content: 'Cliente agregado exitosamente' })
      } else {
        new Toast({ content: 'No se pudo agregar el cliente', mode: 'danger', error: response })
      }
    } catch (e) {
      new Toast({ content: 'Sin acceso a la creación de clientes', mode: 'danger', error: e })
    }
  }

  static #editRowButton = () => `
          <button id="edit-row" class="border-0 bg-transparent" data-bs-toggle="tooltip" title="Editar">${icons.edit}</button>
      `

  static #editRowClick = async (e, cell) => {
    // configurar el cuadro de diáloogo
    Clientes.#currentOption = 'edit'
    Clientes.#modal = new Popup({
      classes: 'col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7',
      title: '<span class="text-back dark:text-gray-300">Actualizar un cliente</span>',
      content: Clientes.#form,
      buttons: [
        { caption: icons.update + 'Actualizar', classes: 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2 ' },
        { caption: icons.x + 'Cancelar', classes: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2' }
      ],
      doSomething: idModal => Clientes.#toComplete(idModal, cell.getRow().getData())
    })

    // mostrar el cuadro de diálogo y gestionar las opciones de actualizar y cancelar
    try {
      const option = await Clientes.#modal.show()
      if (option === 'Cancelar' || option === '✖') {
        Clientes.#modal.close()
      } else if (option === 'Actualizar') {
        Clientes.#edit(cell)
      }
    } catch (e) {
      new Toast({ content: 'Problemas al actualizar el cliente', mode: 'danger', error: e })
    }
  }

  static async #edit(cell) {
    // verificar si los datos cumplen con las restricciones indicadas en el formulario HTML
    // *** falta validar que pVenta no sea <= pBase ***
    if (!Helpers.okForm('#form-clientes')) {
      return
    }

    // asignar en la variable data, los datos del formulario
    const data = Clientes.#getFormData()
    // configurar la url para enviar la solicitud PUT
    const url = `${urlAPI}/clientes/${cell.getRow().getData().id}`

    try {
      // intentar enviar la solicitud de actualización
      let response = await Helpers.fetchData(url, {
        method: 'PATCH',
        body: data
      })

      if (response.message === 'ok') {
        new Toast({ content: 'Cliente actualizado exitosamente' })
        cell.getRow().update(response.data)
        Clientes.#modal.close()
      } else {
        new Toast({ content: 'No se pudo actualizar el cliente', mode: 'danger', error: response })
      }
    } catch (e) {
      new Toast({ content: 'Sin acceso a la actualización de clientes', mode: 'danger', error: e })
    }
  }

  static #deleteRowButton = (cell, formatterParams, onRendered) => `
          <button id="delete-row" 
                  class="border-0 bg-transparent" data-bs-toggle="tooltip" title="Eliminar"
          >${icons.delete}</button>`

  static #deleteRowClick = async (e, cell) => {
    Clientes.#currentOption = 'delete'
    Clientes.#modal = new Popup({
      classes: 'col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7',
      title: '<span class="text-back dark:text-gray-300">Eliminar un cliente</span>',
      // mejorar la visualización del contenido siguiente:
      content: `<span class="text-back dark:text-gray-300">
                    Confirme la eliminación del cliente:<br>
                    ${cell.getRow().getData().id} – ${cell.getRow().getData().nombre} – Teléfono ${cell.getRow().getData().telefono}<br>
                  </span>`,
      buttons: [
        { caption: icons.trash + 'Eliminar', classes: 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2 ' },
        { caption: icons.x + 'Cancelar', classes: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2' }
      ]
    })

    // mostrar el cuadro de diálogo y gestionar las opciones de eliminar y cancelar
    try {
      const option = await Clientes.#modal.show()
      if (option === 'Cancelar' || option === '✖') {
        Clientes.#modal.close()
      } else if (option === 'Eliminar') {
        Clientes.#delete(cell)
      }
    } catch (e) {
      new Toast({ content: 'Problemas al eliminar el cliente', mode: 'danger', error: e })
    }
  }

  static async #delete(cell) {
    const id = cell.getRow().getData().id
    const url = `${urlAPI}/clientes/${id}`

    try {
      // enviar la solicitud de eliminación
      let response = await Helpers.fetchData(url, {
        method: 'DELETE'
      })

      if (response.message === 'ok') {
        new Toast({ content: 'Cliente eliminado exitosamente' })
        cell.getRow().delete()
        Clientes.#modal.close()
      } else {
        new Toast({ content: 'No se pudo eliminar el cliente', mode: 'danger', error: response })
      }
    } catch (e) {
      new Toast({ content: 'Sin acceso a la eliminación de clientes', mode: 'danger', error: e })
    }
  }

  static async #validateId(id) {
    try {
      const response = await Helpers.fetchData(`${urlAPI}/clientes`)
      const data = response.data
      if (data.length > 0) {
        const found = data.find(item => item.id === id)
        if (found) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error)
    }
  }

  static #toComplete(idModal, rowData) {
    if (Clientes.#currentOption === 'edit') {
      document.querySelector(`#${idModal} #identificacion`).value = rowData.identificacion
      document.querySelector(`#${idModal} #identificacion`).setAttribute('readonly', 'true')
      document.querySelector(`#${idModal} #nombre`).value = rowData.nombre
      document.querySelector(`#${idModal} #telefono`).value = rowData.telefono
    }
  }

  /**
   * Recupera los datos del formulario y crea un objeto para ser retornado
   * @returns Un objeto con los datos del cliente
   */
  static #getFormData() {
    const identificacion = document.querySelector(`#${Clientes.#modal.id} #identificacion`).value
    const id = identificacion
    const nombre = document.querySelector(`#${Clientes.#modal.id} #nombre`).value
    const telefono = document.querySelector(`#${Clientes.#modal.id} #telefono`).value

    return { id, nombre, telefono, identificacion }
  }
}
