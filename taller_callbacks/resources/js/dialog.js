export default class Dialog {
  #id;
  #instance;
  #modal;
  #buttons;

  constructor({
    modal = true,
    style = "width:500px;",
    title = "Sin título",
    content = "Sin contenido",
    buttons = [],
    doSomething = null,
  } = {}) {
    this.#modal = modal;
    this.#buttons = buttons;
    this.#id = "dialog-" + Math.random().toString(36).slice(2, 12);
    document.querySelector("body").insertAdjacentHTML(
      "beforeend",
      `<dialog id="${this.#id}" class="dialog" style="${style}">
              <header id="title-${this.#id}">
                  ${title}
                  <button id="_close" >✖</button>
              </header>
              <hr>
                  <section id="content-${this.#id}"></section>
              <hr>
          </dialog>`
    );

    this.#instance = document.querySelector(`#${this.#id}`);
    this.content = content;
    if (typeof doSomething === "function") {
      doSomething(this.#id);
    }
    this.addButtons();

    // Ver por consola los valores de las propiedades
    console.log({ modal, style, title, content, buttons, doSomething });
    console.log(this.#instance);
  }

  show() {
    if (this.#instance) {
      // si existe una instancia de <dialog> …
      if (this.#modal) {
        // el usuario sólo puede interactuar con el cuadro de diálogo abierto
        this.#instance.showModal();
      } else {
        // el usuario puede seguir interactuando con otros elementos de la página
        this.#instance.show();
      }
    } else {
      // si no existe una instancia de <dialog> …
      console.log("No se puede mostrar un dialog removido del DOM");
    }
    return this;
  }

  close() {
    if (this.#instance) {
      this.#instance.close();
    } else {
      console.warn("Nada para cerrar. La instancia ya no existe en el DOM");
    }
    return this;
  }

  set content(_content) {
    document.querySelector(`#content-${this.#id}`).innerHTML = _content;
    return this;
  }

  remove() {
    if (this.#instance) {
      this.#instance.remove();
      // otra forma de eliminar nodos:this.instance.parentNode.removeChild(this.instance)
    } else {
      console.warn("Nada para eliminar. La instancia ya no existe en el DOM");
    }
    this.#instance = undefined;
    this.#id = undefined;
    this.#buttons = undefined;
  }

  addButtons() {
    if (this.#buttons.length) {
      document
        .querySelector(`#${this.#id}`)
        .insertAdjacentHTML("beforeend", `<footer></footer>`);
      const footer = document.querySelector(`#${this.#id} footer`);

      this.#buttons.forEach((item, i) => {
        const idButton = `${this.#id}-btn${i}`;
        const html = `<button id="${idButton}">${item.html}</button>`;
        footer.insertAdjacentHTML("beforeend", html);
        if (item.styles) {
          const button = document.querySelector(`#${idButton}`);
          button.setAttribute("style", item.styles);
        }
        const button = document.querySelector(`#${idButton}`);

        if (button && typeof item.action === "function") {
          button.addEventListener("click", (e) => item.action(e));
        }
      });

      // el botón de cerrar de la parte superior derecha del modal elimina del DOM el dialog
      document
        .querySelector(`#${this.#id} #_close`)
        .addEventListener("click", () => this.remove());
    }
  }

  doSomething(fx) {
    if (typeof fx === "function") {
      return fx(this.#id);
    }
  }

  get id() {
    return this.#id;
  }

  set style(_styles) {
    if (this.#instance) {
      if (_styles) {
        this.#instance.setAttribute("style", _styles);
      }
    } else {
      // si no existe una instancia de <dialog> …
      console.error(
        "No se pueden asignar estilos a una instancia eliminada del DOM"
      );
    }
  }
}
