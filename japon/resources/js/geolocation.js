import Modal from './modal.js';

export default class Geolocation {
  constructor(config) {
    const { apiKey, longitude, latitude, dataPoints, container, zoom } = config;
    let here = this.#getHere(longitude, latitude);
    const map = this.#createMap(apiKey, here, container, zoom);
    const viewInfo = this.#viewInfo;
    map.on('load', () => {
      map.addSource('points', {
        type: 'geojson',
        data: dataPoints,
      });

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-image': 'marker-icon',
          'icon-size': 0.2,
          'text-field': ['get', 'site'],
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
          'icon-allow-overlap': true,
          'text-allow-overlap': true, // cambie a true si no aparecen los puntos
        },
      });

      map.on('click', 'points', (e) => viewInfo(e));
      map.on(
        'mouseenter',
        'points',
        () => (map.getCanvas().style.cursor = 'pointer')
      );
      map.on('mouseleave', 'points', () => (map.getCanvas().style.cursor = ''));
    });
  }

  #getHere(longitude, latitude) {
    navigator.geolocation.getCurrentPosition((location) => {
      latitude = location.coords.latitude;
      longitude = location.coords.longitude;
    });
    return { longitude, latitude };
  }

  #createMap(apiKey, here, container, zoom) {
    mapboxgl.accessToken = apiKey;
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [here.longitude, here.latitude],
      zoom,
    });

    map.loadImage(
      './resources/assets/images/map-point-icon-3.jpg',
      (error, image) => {
        if (error) {
          throw error;
        }
        map.addImage('marker-icon', image);
      }
    );

    return map;
  }

  #viewInfo(e) {
    let photo = e.features[0].properties.photo;
    photo = photo
      ? `<img class="h-96 w-full rounded-t-lg object-cover" src="${photo}" alt="imagen del sitio"/>`
      : '';
    let description = e.features[0].properties.description;
    if (photo) {
      description = `<div>${photo}</br>${description}</div>`;
    }

    new Modal({
      title: e.features[0].properties.site,
      content: description,
    }).show();
  }
}
