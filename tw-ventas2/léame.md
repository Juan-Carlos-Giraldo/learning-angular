# Notas sobre TailwindCSS Template

Para estructurar esta plantilla previamente se tuvo en cuenta verificar la disponibilidad de lo siguiente:

- NodeJS (`node -version`) y de NPM (`npm -version`)
- La extensión PostCSS Language Support
- La extensión Prettier - Code formatter
- Se configuró el gestor de dependencias (`npm init -y`)
- Se configuró un archivo `.prettierrc` como se puede ver en la carpeta raíz

## Importante
**Luego de descargar esta plantilla recuerde ejecutar `npm install` para restaurar las dependencias.**

## Configuración de Tailwind CSS
- Se ejecutaron uno a uno los siguientes dos comandos:
~~~
    npm install -D tailwindcss
    npx tailwindcss init --esm
~~~

- Se asignaron al atributo content en el archivo `tailwind.config.js`, las siguientes rutas:
~~~
    ["./index.html", "./src/**/*.{html,js}", "./resources/**/*.{html,js}"]
~~~

- Se creó el archivo `./src/input.css` con las siguientes directivas Tailwind:
~~~
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
~~~

- Se instaló el complemento Prettier para Tailwind CSS:
~~~
    npm install -D prettier-plugin-tailwindcss
~~~

- En el objeto scripts de package.json se reemplazo la propiedad `"test": "..."` por la propiedad:
~~~    
    "dev": "npx tailwindcss -i ./src/input.css -o ./resources/css/styles.css --watch"
~~~

- En el <head> de index.html se agregó:
~~~
    <link href="./resources/css/styles.css" rel="stylesheet">
~~~

## Importante
- Antes de empezar a codificar ejecute en la terminal:
~~~
    npm run dev
~~~
- Para que Tailwind pueda observar los cambios y crear|actualizar el archivo `./resources/css/styles.css` a partir de las clases de utilidad que vaya utilizando.

- Use LiveServer para ver los cambios automáticamente en el navegador.

- Es posible que cuando el punto de inserción se encuentra dentro de la cadena de texto class y se guarde, los cambios no se reflejen en el navegador.

- Recuerde cambiar el nombre de la carpeta principal de la plantilla por uno acorde al proyecto a desarrollar y también la propiedad `name` en el package.json.

Notas sobre Tailwind con Tabulator
https://docs.google.com/document/d/15JDGrS6zGC3-8mvRGeAPNybgrBGqVCld5B9XNmH6qLI/edit

tw-reservas
https://drive.google.com/drive/folders/1pgUC_1QBIXd6u86ItNODXgVhDGVTWk-1?usp=drive_link
