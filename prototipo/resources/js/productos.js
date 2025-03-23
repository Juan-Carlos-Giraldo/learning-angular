export default class Productos {
  static #table
  static #modal
  static #currentOption
  static #form
  static #tipos

  constructor() {
    throw new Error('No utilice el constructor. Use Productos.init()')
  }

  static async init() {
    try {
      Productos.#tipos = await Helpers.fetchData(`${urlAPI}/productos/categorias`)
      if (Productos.#tipos.message !== 'ok') {
        throw new Error('Falló la carga de tipos de productos')
      }

      Productos.#form = await Helpers.loadPage('./resources/html/productos.html')
      const response = await Helpers.fetchData(`${urlAPI}/productos`)
      if (response.message !== 'ok') {
        throw new Error('Falló la carga de productos')
      }

      document.querySelector('main').innerHTML = `
                <div class="p-2 w-full">
                    <div id="productos" class="m-2"></div>
                </dv>
            `

      Productos.#table = new Tabulator('#productos', {
        height: 'calc(100vh - 190px)', // establecer la altura de la tabla, esto habilita el DOM virtual y mejora drásticamente la velocidad de procesamiento
        data: response.data, // asignar los datos a la tabla
        layout: 'fitColumns', // ajustar columnas al ancho de la tabla (opcional)
        columns: [
          // definir las columnas de la tabla
          { title: 'CÓDIGO', field: 'id', width: 150, hozAlign: 'center' },
          { title: 'NOMBRE', field: 'nombre', hozAlign: 'left' },
          { title: 'TIPO', field: 'tipoEnum', hozAlign: 'left' },
          { title: 'DISP.', field: 'disponibles', hozAlign: 'left', hozAlign: 'center' },
          { title: 'VENCIMIENTO', field: 'vence', width: 150, hozAlign: 'center' },
          { title: 'Vr. BASE', field: 'valorBase', hozAlign: 'center', formatter: 'money' },
          { title: 'Vr. VENTA', field: 'valorVenta', hozAlign: 'center', formatter: 'money' },
          { formatter: Productos.#editRowButton, width: 40, hozAlign: 'center', cellClick: Productos.#editRowClick },
          { formatter: Productos.#deleteRowButton, width: 40, hozAlign: 'center', cellClick: Productos.#deleteRowClick }
        ],
        footerElement: `
            <div class='flex justify-end w-full'>
                <button id="add-productos" type="button" class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">${icons.add}Nuevo producto</button>
            </div>`.trim()
      })

      Productos.#table.on('tableBuilt', () => document.querySelector('#add-productos').addEventListener('click', Productos.#addRow))
    } catch (e) {
      new Toast({ content: 'Sin acceso a la opción de productos', mode: 'danger', error: e })
    }

    return this
  }

  static #addRow = async e => {
    Productos.#currentOption = 'add'
    Productos.#modal = new Popup({
      classes: 'col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7',
      title: '<span class="text-back dark:text-gray-300">Agregar un producto</span>',
      content: Productos.#form,
      buttons: [
        { caption: 'Agregar', classes: 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2 ' },
        { caption: 'Cancelar', classes: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2' }
      ],
      doSomething: Productos.#toComplete
    })

    // mostrar el cuadro de diálogo y gestionar las opciones de agregar y cancelar
    try {
      const option = await Productos.#modal.show()
      if (option === 'Cancelar' || option === '✖') {
        Productos.#modal.close()
      } else if (option === 'Agregar') {
        Productos.#add()
      }
    } catch (e) {
      new Toast({ content: 'Problemas al agregar el producto', mode: 'danger', error: e })
    }
  }

  static async #add() {
    // verificar si los datos cumplen con las restricciones indicadas en el formulario HTML
    if (!Helpers.okForm('#form-productos')) {
      return
    }

    const data = Productos.#getFormData()

    try {
      // enviar la solicitud de creación con los datos del formulario
      let response = await Helpers.fetchData(`${urlAPI}/productos`, {
        method: 'POST',
        body: data
      })

      if (response.message === 'ok') {
        Productos.#table.addRow(response.data) // agregar el producto a la tabla
        Productos.#modal.close()
        new Toast({ content: 'Producto agregado exitosamente' })
      } else {
        new Toast({ content: 'No se pudo agregar el producto', mode: 'danger', error: response })
      }
    } catch (e) {
      new Toast({ content: 'Sin acceso a la creación de productos', mode: 'danger', error: e })
    }
  }

  static #editRowButton = () => `
        <button id="edit-row" class="border-0 bg-transparent" data-bs-toggle="tooltip" title="Editar">${icons.edit}</button>
    `

  static #editRowClick = async (e, cell) => {
    // configurar el cuadro de diáloogo
    Productos.#currentOption = 'edit'
    Productos.#modal = new Popup({
      classes: 'col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7',
      title: '<span class="text-back dark:text-gray-300">Actualizar un producto</span>',
      content: Productos.#form,
      buttons: [
        { caption: 'Actualizar', classes: 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2 ' },
        { caption: 'Cancelar', classes: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2' }
      ],
      doSomething: idModal => Productos.#toComplete(idModal, cell.getRow().getData())
    })

    // mostrar el cuadro de diálogo y gestionar las opciones de actualizar y cancelar
    try {
      const option = await Productos.#modal.show()
      if (option === 'Cancelar' || option === '✖') {
        Productos.#modal.close()
      } else if (option === 'Actualizar') {
        Productos.#edit(cell)
      }
    } catch (e) {
      new Toast({ content: 'Problemas al actualizar el producto', mode: 'danger', error: e })
    }
  }

  static async #edit(cell) {
    // verificar si los datos cumplen con las restricciones indicadas en el formulario HTML
    // *** falta validar que pVenta no sea <= pBase ***
    if (!Helpers.okForm('#form-productos')) {
      return
    }

    // asignar en la variable data, los datos del formulario
    const data = Productos.#getFormData()
    // configurar la url para enviar la solicitud PUT
    const url = `${urlAPI}/productos/${cell.getRow().getData().id}`

    try {
      // intentar enviar la solicitud de actualización
      let response = await Helpers.fetchData(url, {
        method: 'PATCH',
        body: data
      })

      if (response.message === 'ok') {
        new Toast({ content: 'Producto actualizado exitosamente' })
        cell.getRow().update(response.data)
        Productos.#modal.close()
      } else {
        new Toast({ content: 'No se pudo actualizar el producto', mode: 'danger', error: response })
      }
    } catch (e) {
      new Toast({ content: 'Sin acceso a la actualización de productos', mode: 'danger', error: e })
    }
  }

  static #deleteRowButton = (cell, formatterParams, onRendered) => `
        <button id="delete-row" 
                class="border-0 bg-transparent" data-bs-toggle="tooltip" title="Eliminar"
        >${icons.delete}</button>`

  static #deleteRowClick = async (e, cell) => {
    Productos.#currentOption = 'delete'
    Productos.#modal = new Popup({
      classes: 'col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7',
      title: '<span class="text-back dark:text-gray-300">Eliminar un producto</span>',
      // mejorar la visualización del contenido siguiente:
      content: `<span class="text-back dark:text-gray-300">
                  Confirme la eliminación del producto:<br>
                  ${cell.getRow().getData().id} – ${cell.getRow().getData().nombre} – Valor venta $${cell.getRow().getData().valorVenta}<br>
                </span>`,
      buttons: [
        { caption: 'Eliminar', classes: 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2 ' },
        { caption: 'Cancelar', classes: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mt-2' }
      ]
    })

    // mostrar el cuadro de diálogo y gestionar las opciones de eliminar y cancelar
    try {
      const option = await Productos.#modal.show()
      if (option === 'Cancelar' || option === '✖') {
        Productos.#modal.close()
      } else if (option === 'Eliminar') {
        Productos.#delete(cell)
      }
    } catch (e) {
      new Toast({ content: 'Problemas al eliminar el producto', mode: 'danger', error: e })
    }
  }

  static async #delete(cell) {
    const id = cell.getRow().getData().id
    const url = `${urlAPI}/productos/${id}`

    try {
      // enviar la solicitud de eliminación
      let response = await Helpers.fetchData(url, {
        method: 'DELETE'
      })

      if (response.message === 'ok') {
        new Toast({ content: 'Producto eliminado exitosamente' })
        cell.getRow().delete()
        Productos.#modal.close()
      } else {
        new Toast({ content: 'No se pudo eliminar el producto', mode: 'danger', error: response })
      }
    } catch (e) {
      new Toast({ content: 'Sin acceso a la eliminación de productos', mode: 'danger', error: e })
    }
  }

  static #toComplete(idModal, rowData) {
    console.log(Productos.#tipos.data)
    const tipos = Helpers.toOptionList({
      items: Productos.#tipos.data,
      value: 'key',
      text: 'value',
      selected: Productos.#currentOption === 'edit' ? rowData.tipo : ''
    })

    document.querySelector(`#${idModal} #tipo`).innerHTML = tipos

    if (Productos.#currentOption === 'edit') {
      document.querySelector(`#${idModal} #id`).value = rowData.id
      document.querySelector(`#${idModal} #nombre`).value = rowData.nombre
      document.querySelector(`#${idModal} #disponibles`).value = rowData.disponibles
      document.querySelector(`#${idModal} #vence`).value = rowData.vence
      document.querySelector(`#${idModal} #valor-base`).value = rowData.valorBase
      document.querySelector(`#${idModal} #valor-venta`).value = rowData.valorVenta
    }
  }

  /**
   * Recupera los datos del formulario y crea un objeto para ser retornado
   * @returns Un objeto con los datos del producto
   */
  static #getFormData() {
    const id = document.querySelector(`#${Productos.#modal.id} #id`).value
    const nombre = document.querySelector(`#${Productos.#modal.id} #nombre`).value
    const disponibles = document.querySelector(`#${Productos.#modal.id} #disponibles`).value
    const vence = document.querySelector(`#${Productos.#modal.id} #vence`).value
    const valorBase = document.querySelector(`#${Productos.#modal.id} #valor-base`).value
    const valorVenta = document.querySelector(`#${Productos.#modal.id} #valor-venta`).value
    const tipo = document.querySelector(`#${Productos.#modal.id} #tipo`).value

    return { id, nombre, tipo, disponibles, vence, valorBase, valorVenta }
  }
}
