import { TabulatorFull as Tabulator } from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.min.js';

class App {
  static tabledata;

  static main() {
    App.basicTable('example-table');
    App.richTable('example-table2');
    App.nominaTable();
  }

  static basicTable(path) {
    //initialize table
    App.tabledata = [
      {
        id: 1,
        name: 'Oli Bob',
        progress: 12,
        gender: 'male',
        rating: 1,
        col: 'red',
        dob: '19/02/1984',
        car: 1,
      },
      {
        id: 2,
        name: 'Mary May',
        progress: 1,
        gender: 'female',
        rating: 2,
        col: 'blue',
        dob: '14/05/1982',
        car: true,
      },
      {
        id: 3,
        name: 'Christine Lobowski',
        progress: 42,
        gender: 'female',
        rating: 0,
        col: 'green',
        dob: '22/05/1982',
        car: 'true',
      },
      {
        id: 4,
        name: 'Brendon Philips',
        progress: 100,
        gender: 'male',
        rating: 1,
        col: 'orange',
        dob: '01/08/1980',
      },
      {
        id: 5,
        name: 'Margret Marmajuke',
        progress: 16,
        gender: 'female',
        rating: 5,
        col: 'yellow',
        dob: '31/01/1999',
      },
      {
        id: 6,
        name: 'Frank Harbours',
        progress: 38,
        gender: 'male',
        rating: 4,
        col: 'red',
        dob: '12/05/1966',
        car: 1,
      },
    ];
    var table = new Tabulator('#' + path, {
      data: App.tabledata, //assign data to table
      autoColumns: true, //create columns from data field names
    });
  }

  static richTable(path) {
    var table = new Tabulator('#' + path, {
      data: this.tabledata, //load row data from array
      layout: 'fitColumns', //fit columns to width of table
      responsiveLayout: 'hide', //hide columns that don't fit on the table
      addRowPos: 'top', //when adding a new row, add it to the top of the table
      history: true, //allow undo and redo actions on the table
      pagination: 'local', //paginate the data
      paginationSize: 7, //allow 7 rows per page of data
      paginationCounter: 'rows', //display count of paginated rows in footer
      movableColumns: true, //allow column order to be changed
      initialSort: [
        //set the initial sort order of the data
        { column: 'name', dir: 'asc' },
      ],
      columnDefaults: {
        tooltip: true, //show tool tips on cells
      },
      columns: [
        //define the table columns
        { title: 'Name', field: 'name', editor: 'input' },
        {
          title: 'Task Progress',
          field: 'progress',
          hozAlign: 'left',
          formatter: 'progress',
          editor: true,
        },
        {
          title: 'Gender',
          field: 'gender',
          width: 95,
          editor: 'select',
          editorParams: { values: ['male', 'female'] },
        },
        {
          title: 'Rating',
          field: 'rating',
          formatter: 'star',
          hozAlign: 'center',
          width: 100,
          editor: true,
        },
        { title: 'Color', field: 'col', width: 130, editor: 'input' },
        {
          title: 'Date Of Birth',
          field: 'dob',
          width: 130,
          sorter: 'date',
          hozAlign: 'center',
        },
        {
          title: 'Driver',
          field: 'car',
          width: 90,
          hozAlign: 'center',
          formatter: 'tickCross',
          sorter: 'boolean',
          editor: true,
        },
      ],
    });
  }

  static async nominaTable() {
    // Realizar la solicitud para obtener los datos
    const response = await fetch('./resources/data/pagohoras.json');
    const data = await response.json();

    // Una vez que se obtienen los datos, cargarlos en la tabla
    const formattedData = data.map((pagohoras) => ({
      cedula: pagohoras.cedula,
      nombre: pagohoras.nombre,
      profesion: pagohoras.profesion,
      horas: pagohoras.horas,
      pago: pagohoras.horas * (20000 * 0.86),
      estado:
        pagohoras.horas * (20000 * 0.86) ? 'Trabajo mucho' : 'Trabajo poco',
      compromiso: pagohoras.horas * 0.2,
    }));

    App.tabledata = formattedData;
    var table = new Tabulator('#nomina-table', {
      data: App.tabledata, //load row data from array
      layout: 'fitColumns', //fit columns to width of table
      responsiveLayout: 'hide', //hide columns that don't fit on the table
      addRowPos: 'top', //when adding a new row, add it to the top of the table
      history: true, //allow undo and redo actions on the table
      pagination: 'local', //paginate the data
      paginationSize: 10, //allow 7 rows per page of data
      paginationCounter: 'rows', //display count of paginated rows in footer
      movableColumns: true, //allow column order to be changed
      initialSort: [
        //set the initial sort order of the data
        { column: 'name', dir: 'asc' },
      ],
      columnDefaults: {
        tooltip: true, //show tool tips on cells
      },
      layout: 'fitColumns',
      columns: [
        { title: 'Cedula', field: 'cedula' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Profesion', field: 'profesion' },
        { title: 'Horas', field: 'horas' },
        { title: 'Pago', field: 'pago' },
        { title: 'Estado', field: 'estado' },
        {
          title: 'Compromiso',
          field: 'horas',
          align: 'left',
          formatter: 'progress',
          formatterParams: {
            min: 0,
            max: 200,
            color: ['red', 'orange', 'green'],
            // legend: false,
          },
        },
      ],
    });
  }
}

App.main();
