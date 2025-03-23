import Accordion from "./accordion.js";

class App {
  static main() {
    new Accordion({
      container: "body",
      data: "./resources/data/info-tabs.json",
      built: (obj) => console.log(obj),
    });
  }
}

App.main();
