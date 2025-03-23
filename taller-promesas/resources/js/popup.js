import Dialog from "./dialog.js";

export default class Popup extends Dialog {
  #buttons;

  constructor(config) {
    super(config);
    this.#buttons = config.buttons;
    this.content = config.content;
    this.id = config.id;

    document.querySelector(`#${this.id}`).insertAdjacentHTML(
      "afterbegin",
      `<header id="title-${this.id}">
                ${config.title}
                <button id="${this.id}_close" class="x-btn">✖</button>
              </header> 
              <hr>`
    );

    this.modal = true;
    if (!config.style) {
      this.style = "width:500px;";
    } else {
      this.style = config.style;
    }
    this.title = "Sin título";
    this.content = "Sin contenido";
    this.buttons = []; // los botones que se agregan al footer
    this.doSomething = null; // un callBack

    this.addButtons();

    if (typeof this.doSomething === "function") {
      this.doSomething();
    }
  }
  doSomething(fx) {
    if (typeof fx === "function") {
      return fx(this.id);
    }
  }
  /**
        Agregar al popup un pie de pagina con potones
         @param {Object{}} _buttons La definicion de los botones
         */
  addButtons() {
    // el botón de cierre de la parte superior derecha, elimina la instancia de <dialog>
    document
      .querySelector(`#${this.id}_close`)
      .addEventListener("click", () => this.remove());
    if (this.#buttons.length) {
      // si el arry de botones tiene elmentos se agrega un pie de pagina en ellos
      document
        .querySelector(`#${this.id}`)
        .insertAdjacentHTML("beforeend", "<hr><footer></footer>");
      const footer = document.querySelector(`#${this.id} footer`);
      this.#buttons.forEach((b, i) => {
        //si no se proporcionan estilos para el boton se asigna lo basico
        if (!b.styles) {
          b.styles = "margin-left:5px";
        }
        //se define con el codigo html el botón
        const idButton = `${this.id}-btn${i}`;
        const html = `<button id="${idButton}" style="${b.styles}">${b.caption}</button>`;
        //se agrega el botón al pie de pagina del popup
        footer.insertAdjacentHTML("beforeend", html);

        //se referencia el botón creado y se le agregan las posibles clases CSS definidas para él
        const button = document.querySelector(`#${idButton}`);
        b.classes.forEach((c) => button.classList.add(c));
        //se le asigna la posible accion asignada en su creacion
        if (typeof b.action === "function") {
          button.addEventListener("click", b.action);
        }
        //reemplazar la definicion de botones por referencias a botones
        this.#buttons[i] = button;
      });
    }
  }
  show() {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        if (this.modal) {
          // el usuario sólo puede interactuar con el cuadro de diálogo abierto
          this.instance.showModal();
        } else {
          // el usuario puede seguir interactuando con otros elementos de la página
          this.instance.show();
        }
        if (!this.#buttons) {
          this.#buttons = [];
        }
        // Agregar el botón ✖ de la cabecera al array de buttons
        this.#buttons.push(document.querySelector(`#${this.id}`));

        // Para cada botón retornar una promesa con su nombre
        this.#buttons.forEach((button) => {
          if (button) {
            button.addEventListener("click", (e) => {
              resolve(e.target.innerText);
            });
          }
        });
      } else {
        reject("No se puede mostrar un popup removido del DOM");
      }
    });
  }
}
