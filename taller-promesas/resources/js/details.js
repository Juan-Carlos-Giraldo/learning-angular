import Popup from "./popup.js";
import Slider from "./slider.js";

export default class Details extends Popup {
  #slider;

  constructor({
    modal = false,
    style = "width:800px; height:500px; overflow: hidden;",
    title = "Sin título",
    gallery = "",
    button = {
      caption: "Aceptar",
      classes: ["custom-btn", "btn-cancel"],
      action: () => this.remove(),
    },
  } = {}) {
    super({ title, modal, content: "", style, buttons: [button] });
    this.#slider = new Slider({
      container: document.querySelector(`#content-${this.id}`),
      gallery: gallery,
      interval: 3000,
      visibleTitle: false | true,
      visibleDescription: false | true,
    });
  }

  remove() {
    return new Promise((resolve, reject) => {
      this.#slider.clarAutoplayInterval();
      if (this.instance) {
        this.instance.remove();
        resolve("ok");
      } else {
        console.warn("Nada para eliminar. La instancia ya no existe en el DOM");
        reject("No se puede eliminar. La instancia ya no existe");
      }
      this.instance = undefined;
      this._id = undefined;
      this.buttons = undefined;
    });
  }
}
