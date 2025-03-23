import Dialog from "./dialog.js";

class App {
  static dialog;

  static main() {
    App.dialog = new Dialog({
      modal: false,
      title:
        '<span style="color: #727272; font-weight: 800;">Ingreso de usuarios</span>',
      content: "Tabla de usuarios:",
      doSomething: this.listarPoblaciones,
      buttons: [
        {
          styles:
            "background-color: #4CAF50; color: white; margin-right: 10px; margin-left: 10px;",
          html: `Ingresar`,
          action: App.ingresar, // no se ha definido este método
        },
        {
          styles:
            "background-color: #f44336; color: white; margin-right: 10px; margin-left: 10px;",
          html: `Cancelar`,
          action: () => App.dialog.close(),
        },
      ],
    });
    document.querySelector("#abrir-dialog").addEventListener("click", () => {
      App.dialog.show();
    });

    document.querySelector("#cerrar-dialog").addEventListener("click", () => {
      App.dialog.close();
    });

    document.querySelector("#eliminar-dialog").addEventListener("click", () => {
      App.dialog.remove();
    });

    document.querySelector("#probar-dialog").addEventListener("click", () => {
      // Imprime en consola el estado del dialog
      console.log(App.dialog);
    });

    document.querySelector("#probar-hacer").addEventListener("click", () => {
      // Imprime en consola el id del dialog
      this.id = App.dialog.id;
      console.log("id = " + this.id);

      // Edita las proiedades de estilo del dialog
      App.dialog.style = "background-color: red; height: 300px; width: 300px;";
    });
  }

  static generarTabla(idDialog) {
    console.log("generando tabla en " + idDialog);
    const personas = ["Jorge", "Carlos", "Lucas"];

    // generar la cabecera de la tabla
    let cabecera = "";
    personas.forEach((p) => (cabecera += `<th>${p}</th>`));

    cabecera = `<tr>${cabecera}</tr>`;
    // generar las filas de la tabla
    let filas = "";
    for (let i = 0; i < 7; i++) {
      let fila = "";
      for (let j = 0; j < personas.length; j++) {
        fila += `<td>${Math.floor(Math.random() * 1001)}</td>`;
      }
      filas += `<tr>${fila}</tr>`;
    }

    // crear el código fuente de la tabla
    let tabla = `
        <table>
          ${cabecera}
          ${filas}
        </table>
      `;
    // inyectar la tabla en el dialog
    document
      .querySelector(`#${idDialog} section`)
      .insertAdjacentHTML("beforeend", tabla);
  }

  static listarPoblaciones(idDialog) {
    // imprime el id del dialog
    console.log("generando tabla de poblaciones en " + idDialog);
    fetch("/resources/data/colombia.json")
      .then((response) => response.json())
      .then((data) => {
        let cabecera = "";
        Object.keys(data[0]).forEach((key) => {
          cabecera += `<th>${key}</th>`;
        });

        let filas = "";
        data.forEach((row) => {
          let fila = "";
          Object.values(row).forEach((value) => {
            fila += `<td>${value}</td>`;
          });
          filas += `<tr>${fila}</tr>`;
        });

        let tabla = `
          <table>
            ${cabecera}
            ${filas}
          </table>
        `;

        document
          .querySelector(`#${idDialog} section`)
          .insertAdjacentHTML("beforeend", tabla);
      })
      .catch((error) => {
        // si hay un error, mostrarlo en la consola
        console.error("Error loading colombia.json:", error);
      });
  }

  static sumar(idDialog) {
    // imprime el id del dialog
    console.log("id = " + idDialog);
    return 20 + 30;
  }

  static ingresar() {
    // imprime un mensaje en la consola para simular un ingreso exitoso
    console.log("Ingreso existoso");
  }
}

App.main();
