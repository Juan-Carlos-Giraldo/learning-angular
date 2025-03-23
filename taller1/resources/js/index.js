class App {
  static populations;

  static async main() {
    // referenciar el elemento HTML con clase #container y pasarlo como argumento
    App.addBoxes(document.querySelector(".container"), 100);
    await App.loadPopulations();
  }
  
  static async loadPopulations() {
    let response = await fetch('../resources/data/poblaciones-colombia.json');
    if (response.ok) {
      App.populations = await response.json();
      App.populations.forEach((p) => { 
        if (p["Código Departamento"] === 5) {
          console.log(p);
        }
       });
    } else {
        console.log('Error-HTTP: ', response.status);
    }
  }

  static addBoxes(container, max) {
    for (let i = 0; i <= max; i++) {
      container.insertAdjacentHTML('beforeend', `<div class="box" id = "box${i}">${i*i}</div>`);
    }
  }

}
App.main();
