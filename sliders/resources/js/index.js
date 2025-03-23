import Slider from "./slider.js";

class App {
  static main() {
    new Slider({
      container: document.body,
      gallery: "./resources/data/gallery.json",
      interval: 3000,
      visibleTitle: false | true,
      visibleDescription: false | true,
    });
  }
}

App.main();
