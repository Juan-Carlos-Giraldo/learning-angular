import Helpers from './helpers.js';
import Geo from './geolocation.js';

class App {
  static async init() {
    window.Helpers = Helpers;
    let geo = new Geo({
      apiKey:
        'pk.eyJ1IjoiYnBhY2h1Y2EiLCJhIjoiY2lxbGNwaXdmMDAweGZxbmg5OGx2YWo5aSJ9.zda7KLJF3TH84UU6OhW16w', // asigne su token de acceso
      longitude: 139.76667707175685,
      latitude: 35.69287280313817,
      container: 'map',
      dataPoints: '../resources/assets/data-points.geojson',
      zoom: 10, // aumente o disminuya este valor según prefiera
    });
  }
}

export default (async () => App.init())();
