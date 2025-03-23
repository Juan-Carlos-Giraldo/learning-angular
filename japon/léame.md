## Instrucciones

Deben estar instalados los siguientes complementos
- PostCSS Language Support
- Tailwind CSS IntelliSense
- prettier a VSCode ????????????

Paso 1: configure el gestor de dependencias para su proyecto
npm init -y

Paso 2:  instale Tailwind CSS
npm install -D tailwindcss 
npx tailwindcss init

Paso 3:
Configure las rutas desde las que se analizan archivos fuentes en tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js}", "./resources/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: []
}

Paso 4:
Agregue las directivas Tailwind a su src/input.css:
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

Paso 5 (opcional):
Instale https://github.com/tailwindlabs/prettier-plugin-tailwindcss
npm install -D prettier-plugin-tailwindcss

Paso 6:
Escanear los archivos en busca de clases y cree el CSS utilizando:

npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch

También lo puede incluir en el package.json:

{
  "scripts": {
    "dev": "npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch"
  },
  "devDependencies": {
    "prettier-plugin-tailwindcss": "^0.1.13",
    "tailwindcss": "^3.2.4"
  }
}

A partir de aquí puede usar npm run dev para activar la herramienta Tailwind CLI y procesar CSS

Para convertir a webp: https://convertio.co/es/
Para transparencias: https://www7.lunapic.com/editor/
Sobre Prettier: https://prettier.io/docs/en/api.html

Instalar https://tabulator.info/
npm install tabulator-tables --save

Instalar https://moment.github.io/luxon/
npm install --save luxon

## Otras configuraciones

- Se estandariza el uso de comillas simples para cadenas
- Se eliminan los paréntesis cuando las funciones flecha reciben un solo argumento
- Se agrega la clase CardMasonry
- El usuario actual permanece registrado en el localStorage

## otra información
- Versions JS: https://gist.github.com/rajaramtt/7df3702a04c644b0b62c9a64f48f3dbf
- https://www.javascripttutorial.net/javascript-top-level-await/
- https://sailboatui.com/tools/ (enlaces a páginas de componentes)
- https://tailwindflex.com/ (componentes)
- https://github.com/tailwindlabs/tailwindcss-forms <<tailwind forms>>
- https://tailwindcss-custom-forms.netlify.app/ <<tailwind forms ejemplos>>

## MapBox

- En ./src/input.css
  @import 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';

- En ./index.html
  <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>

- 