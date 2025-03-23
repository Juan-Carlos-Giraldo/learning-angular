export default class Accordion {
  #id; // id ID de la capa principal del accordion

  constructor(config) {
    (async () => await this.create(config))();
  }

  async create(config) {
    this.#id = `accordion-${Math.random().toString(36).slice(2, 12)}`;
    const container = document.querySelector(config.container);
    const accordion = document.createElement("div");
    accordion.classList.add("accordion");
    accordion.id = this.#id;
    container.innerHTML = "<h1>FAQ</h1>";
    container.appendChild(accordion);
    let i = 0;

    // Crear un array de objetos con los datos del archivo JSON referenciado por data
    let data = fetch(config.data);
    data = await (await data).json();

    // Recorrer el array de objetos para
    //    En cada iteración recuperar el texto HTML referenciado por urlContent
    //    Cree el HTML del pliegue actual y concaténelo a los demás pliegues
    for await (const item of data) {
      const resource = await fetch(item.urlContent);
      const texto = await resource.text();
      item.content = texto;
    }

    // Agregar los pliegues a un string que represente el HTML de la capa
    //    principal del accordion
    for await (const item of data) {
      this.addPliegue(this.#id, item.title, item.content);
    }

    // Agregar la funcionalidad JavaScript complementaria, dada por el autor.
    document
      .querySelectorAll(".accordion-item h2")
      .forEach((accordionToggle) => {
        accordionToggle.addEventListener("click", () => {
          const accordionItem = accordionToggle.parentNode;
          const accordionContent = accordionToggle.nextElementSibling;

          // If this accordion item is already open, close it.
          if (accordionContent.style.maxHeight) {
            accordionContent.style.maxHeight = null;
            accordionItem.classList.remove("active");
          } else {
            accordionContent.style.maxHeight =
              accordionContent.scrollHeight + "px";
            accordionItem.classList.add("active");
          }
        });
      });

    // Si la propiedad built es una función ejecútela enviando como argumento
    //    un objeto con el ID del accordion y la data completa
    if (typeof config.built === "function") {
      config.built({
        id: this.#id,
        data: data,
      });
    }
  }

  addPliegue(id, title, content) {
    const accordion = document.getElementById(id);
    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");
    accordionItem.id = `accordion-${id}-item-${accordion.children.length}`;
    accordionItem.innerHTML = `<h2 id="accordion-${id}-item-title-${accordion.children.length}">${title}</h2><div class="accordion-content" id="accordion-${id}-item-content-${accordion.children.length}">${content}</div>`;
    accordion.appendChild(accordionItem);
  }

  deletePliegue(id, index) {
    const accordion = document.getElementById(id);
    const accordionItem = document.getElementById(
      `accordion-${id}-item-${index}`
    );
    accordion.removeChild(accordionItem);
    if (accordion.children.length === 0) {
      accordion.parentElement.removeChild(accordion);
    }
  }

  get id() {
    return this.#id;
  }
}
