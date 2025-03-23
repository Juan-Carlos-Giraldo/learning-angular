import Popup from "./popup.js";
export default class Alert extends Popup {
  constructor({
    modal = false,
    style = "width:500px;",
    title = "Sin título",
    content = "Sin contenido",
    button = {
      caption: "Aceptar",
      classes: ["custom-btn", "btn-cancel"],
      action: () => this.remove(),
    },
  } = {}) {
    super({ title, modal, content, style, buttons: [button] });

    this.content = `
			<div style="display:flex;justify-content: center;>
      <span style="font-size: 18px; margin-left: 10px">${content}</span>
			</div>`;
    this.show();
  }
}
