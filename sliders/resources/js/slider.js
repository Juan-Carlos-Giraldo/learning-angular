export default class Slider {
  #currentIndex = 0;
  #autoplayInterval = null;

  constructor(config) {
    // autollamado a una función anónima
    (async () => await this.#createSlider(config))();
  }

  navigate(direction) {
    const galleryContainer = document.querySelector(".gallery-container");
    const totalImages = document.querySelectorAll(".gallery-item").length;

    this.#currentIndex =
      (this.#currentIndex + direction + totalImages) % totalImages;
    const offset = -this.#currentIndex * 100;

    galleryContainer.style.transform = `translateX(${offset}%)`;
  }

  startAutoplay(interval) {
    clearInterval(this.#autoplayInterval); // Detiene cualquier autoplay anterior para evitar múltiples intervalos.
    this.#autoplayInterval = setInterval(() => {
      this.navigate(1); // Navega a la siguiente imagen cada intervalo de tiempo.
    }, interval);
  }

  async #createSlider(config) {
    this.#autoplayInterval = config.interval;

    // Crear el contenedor del slider
    const container = document.createElement("section");
    container.setAttribute("id", "gallery");

    // Crear el contenedor de la galería
    const gallery = document.createElement("div");
    gallery.classList.add("gallery-container");

    // Crear el contenedor de los controles
    const nav = document.createElement("nav");
    nav.classList.add("gallery-navigator");
    nav.innerHTML = `<button class="nav-button prev-button"><i class="arrow left"></i></button>
                     <button class="nav-button next-button"><i class="arrow right"></i></button>`;

    fetch(config.gallery)
      .then((response) => response.json())
      .then((data) => {
        let images = "";

        data.forEach((image, index) => {
          images += `
          <figure class="gallery-item">
            <img src="${image.image}" alt="Imagen ${index + 1}">
            <figcaption><h3>${image.title}</h3><p>${
            image.description
          }</p></figcaption>
          </figure>
          `;
        });

        gallery.innerHTML = images;
      });

    container.appendChild(gallery);
    container.appendChild(nav);

    config.container.appendChild(container);

    // Funcionalidad de los botones
    document.querySelector(".prev-button").addEventListener("click", () => {
      this.navigate(-1);
    });

    document.querySelector(".next-button").addEventListener("click", () => {
      this.navigate(1);
    });

    // Autoplay
    this.startAutoplay(config.interval);

    // Stop Autoplay on press
    document.querySelectorAll(".nav-button").forEach((button) => {
      button.addEventListener("click", () =>
        clearInterval(this.#autoplayInterval)
      );
    });
  }
}
