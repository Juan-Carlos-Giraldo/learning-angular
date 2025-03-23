class App {
  static palette = ['#f1f1f1', '#fd8183', '#fdbd80', '#feff80', '#82fd81',
                    '#81fefc', '#8a88fe', '#c28ffd', '#fb88fe']

  static async main() {
    App.addBoxes(document.querySelector(".container"));
  }

  static addBoxes(container) {
    container.insertAdjacentHTML(
      "beforeend",
      '<div id="box1" class="box"></div>'
    );
    document.querySelector("#box1").style.backgroundColor = App.palette[0];
    for (let i = 2; i < 10; i++) {
      container.insertAdjacentHTML(
        "beforeend",
        '<div id="box'+i+'" class="box">'+ i +'</div>'
      );
      document.querySelector('#box'+i+'').style.backgroundColor = App.palette[0];
    }
    container.insertAdjacentHTML(
      "beforeend",
      '<div id="box10" class="box"></div>'
    );
    document.querySelector("#box10").style.backgroundColor = App.palette[0];
    container.insertAdjacentHTML(
      "beforeend",
      '<div id="box11" class="box">2</div>'
    );
    document.querySelector("#box11").style.backgroundColor = App.palette[0];
    for (let i = 1; i < 11; i++) {
      
    }
  }
}
App.main();
