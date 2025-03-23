// version tailwind: https://drive.google.com/drive/folders/1m-RskOpDB1enwETp6sTgksY5BqMhaRHG

export default class Modal {
  #id;
  #modal;

  constructor({
    style = 'w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12',
    title = '',
    content = '',
    photo = '',
    hashtags = [],
    buttons = [], // los botones que se agregan al footer
    built = null, // un callBack
  } = {}) {
    const hidden = 'hidden';
    // una de las muchas formas de agregar un elemento al DOM con un id único
    this.#id = Helpers.idRandom('modal-');
    document.querySelector('body').insertAdjacentHTML(
      // hacer caso omiso a la advertencia del flex/hidden
      'beforeend',
      `
            <div id="${this.#id}" class="flex fixed inset-0 z-50 justify-center items-center bg-blue-900 bg-opacity-30 ${hidden}">
              <div class="max-w-md rounded overflow-hidden shadow-lg bg-slate-100">
                <div id="img-${this.#id}" class="w-full h-72"></div>
                <div class="px-6 py-4">
                    <div id="title-${this.#id}" class="font-bold text-xl mb-2"></div>
                    <p id="content-${this.#id}" class="text-gray-700 text-base">
                    
                    </p>
                </div>
                <footer class="px-6 pt-4 pb-2">
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
                </footer>
                </div>
            </div>`
    );
    this.title = title;
    this.content = content;
    this.photo = photo;
    this.hashtags = hashtags;
    this.buttons = buttons;
    this.#modal = document.querySelector(`#${this.#id}`);

    if (typeof built === 'function') {
      built(this.#id);
    }
  }

  get id() {
    return this.#id;
  }

  /**
   * Establecer el título del cuadro de diálogo
   * @param {string} _title
   */
  set title(_title) {
    document.querySelector(`#title-${this.#id}`).innerHTML = _title;
    return this;
  }

  /**
   * Establecer el contenido del cuadro de diálogo
   * @param {string} _content
   */
  set content(_content) {
    document.querySelector(`#content-${this.#id}`).innerHTML = _content;
    return this;
  }

  set photo(_photo) {
    document.querySelector(`#img-${this.#id}`).innerHTML = _photo;
    return this;
  }

  set hashtags(_hashtags) {
    let hashtags = '';
    _hashtags.forEach((hastag) => {
      hashtags += `<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${hastag}</span>`;
    });
    document.querySelector(`#${this.#id} footer`).innerHTML = hashtags;
  }

  /**
   * Agregar botones al pie de página del modal u ocultar el pie de página
   * @param {any[]} _buttons
   */
  set buttons(_buttons) {
    // el botón de cerrar de la parte superior derecha del modal
    document
      .querySelector(`#${this.#id}`)
      .addEventListener('click', () => this.close());
  }

  show() {
    if (this.#modal) {
      this.#modal.classList.remove('hidden');
    } else {
      console.log('No hay un Modal referenciado por esta variable');
    }
    return this;
  }

  close() {
    this.#modal.classList.add('hidden');
    return this;
  }

  dispose() {
    this.#modal.parentNode.removeChild(this.#modal);
    this.#modal = null;
  }
}
