import Dialog from "./dialog.js";
import Toast from "./toast.js";
import Popup from "./popup.js";
import Alert from "./alert.js";
import Details from "./details.js";

class App {
  static async loadPage(url) {
    const response = await fetch(url);
    return await response.text();
  }
  static async main() {
    const dialog = new Dialog({
      modal: false,
      style: "background-color: #f2f5ff;",
      content: `
                <h2 class="title">mejoremos esta pagina  </h2>
                  <p class="paragraph">Visita a <a href="https://fonts.google.com/">https://fonts.google.com</a> y … `,
    });
    //punto 10
    document
      .querySelector("#abrir-dialog")
      .addEventListener("click", async () => {
        try {
          const opcion = await dialog.show();
          console.info(`Todo ${opcion}, promesa cumplida`);
        } catch (error) {
          console.error("Sucedió un error.", error);
        }
      });

    //punto 12
    document
      .querySelector("#cerrar-dialog")
      .addEventListener("click", async () => {
        try {
          const opcion = await dialog.close();
          console.info(`Todo ${opcion}, promesa cumplida`);
        } catch (error) {
          console.error("Sucedió un error.", error);
        }
      });

    document
      .querySelector("#eliminar-dialog")
      .addEventListener("click", async () => {
        try {
          const opcion = await dialog.remove();
          console.info(`Todo ${opcion}, promesa cumplida`);
        } catch (error) {
          console.error("Sucedió un error.", error);
        }
      });

    //15
    document
      .querySelector("#probar-dialog")
      .addEventListener("click", async () => {
        try {
          console.log(dialog);
        } catch (error) {
          console.error("Sucedió un error.", error);
        }
      });

    document
      .querySelector("#abrir-toast")
      .addEventListener("click", async () => {
        new Toast({
          content: "Acceso denegado",
          mode: "danger",
          delay: 3000,
        });
      });

    const popup = new Popup({
      title: "<span style=font-weight:bold>Ingreso de usuarios</span>",
      content: await this.loadPage("./resources/html/form-demo.html"),
      buttons: [
        {
          caption: "Ingresar ",
          classes: ["custom-btn", "btn-ok"],
          action: () => popup.show(),
        },
        {
          caption: "Cancelar",
          classes: ["custom-btn", "btn-cancel"],
          action: () => popup.close(),
        },
      ],
      id: this.id,
    });
    document
      .querySelector("#abrir-popup")
      .addEventListener("click", async () => {
        try {
          const option = await popup.show();
          console.log(`Botón pulsado: ${option}`);

          if (option === "Cancelar" || option === "✖") {
            // Se ha cerrado el popup
            console.log("No hacer algo");
          } else if (option === "Ingresar") {
            console.log("hacer algo");
            popup.close();
          }
        } catch (e) {
          console.error("Hubo un problema ", e);
        }
      });

    document
      .querySelector("#abrir-alert")
      .addEventListener("click", async () => {
        const alert = new Alert({
          title: "<b>Eliminación concluida</b>",
          content:
            "La acción de eliminación ha culminado exitosamente. Se elimino correctamente el registro.",
        });
      });

    document
      .querySelector("#abrir-slider")
      .addEventListener("click", async () => {
        const details = new Details({
          title: "Presentación",
          gallery: `./resources/data/gallery.json`,
        });
        details.show();
      });
  }
}
App.main();
