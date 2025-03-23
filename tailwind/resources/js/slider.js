export default class Slider {
  #currentIndex = 0;
  #autoplayInterval = null;

  constructor(config) {
    // autollamado a una función anónima
    (async () => await this.#createSlider(config))();
  }

  navigate(direction) {
    const galleryContainer = document.querySelector('.gallery-container');
    const totalImages = document.querySelectorAll('.gallery-item').length;

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
    const container = document.createElement('section');
    container.setAttribute('id', 'gallery');
    // Agregar las siguientes clases al contenedor relative w-6/12 overflow-hidden m-auto
    container.classList.add('relative', 'w-6/12', 'overflow-hidden', 'm-auto');

    // Crear el contenedor de la galería
    const gallery = document.createElement('div');
    gallery.classList.add('gallery-container');
    // Agregar las siguientes clases al gallery flex transition-transform duration-[0.5s] ease-[ease-in-out] translate-x-[0%]
    gallery.classList.add(
      'flex',
      'transition-transform',
      'duration-[0.5s]',
      'ease-[ease-in-out]',
      'translate-x-[0%]'
    );

    // Crear el contenedor de los controles
    const nav = document.createElement('nav');
    // Agregar las siguientes clases al w-full flex justify-between absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4
    nav.classList.add(
      'w-full',
      'flex',
      'justify-between',
      'absolute',
      '-translate-x-2/4',
      '-translate-y-2/4',
      'left-2/4',
      'top-2/4'
    );
    nav.innerHTML = `<button class="nav-button prev-button bg-[#008bba00] cursor-pointer transition-[0.2s] p-5 rounded-[50%] border-[none] scale-150 hover:scale-[2]"><i class="border-solid border-b-4 border-r-4 border-[rgb(240,240,240)] inline-block p-[3px] rotate-[135deg]"></i></button>
                     <button class="nav-button next-button bg-[#008bba00] cursor-pointer transition-[0.2s] p-5 rounded-[50%] border-[none] scale-150 hover:scale-[2]"><i class="border-solid border-b-4 border-r-4 border-[rgb(240,240,240)] inline-block p-[3px] -rotate-45"></i></button>`;

    fetch(config.gallery)
      .then((response) => response.json())
      .then((data) => {
        let images = '';

        data.forEach((image, index) => {
          images += `
          <figure class="gallery-item min-w-full box-border overflow-y-hidden m-0">
            <img src="${image.image}" alt="Imagen ${index + 1}" class="block w-full h-full object-cover mx-auto">
            <figcaption class="flex flex-col justify-between gap-[30px] absolute h-full w-full text-[1.5em] text-[#c7c7c7] transition-[0.2s] top-[0%]"><h3 class="bg-[rgba(0,0,0,0.4)] text-center m-0 p-2.5">${image.title}</h3><p class="bg-[rgba(0,0,0,0.4)] text-justify m-0 pt-5 pb-2.5 px-[30px]">${
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
    document.querySelector('.prev-button').addEventListener('click', () => {
      this.navigate(-1);
    });

    document.querySelector('.next-button').addEventListener('click', () => {
      this.navigate(1);
    });

    // Autoplay
    this.startAutoplay(config.interval);

    // Stop Autoplay on press
    document.querySelectorAll('.nav-button').forEach((button) => {
      button.addEventListener('click', () =>
        clearInterval(this.#autoplayInterval)
      );
    });
  }
}
