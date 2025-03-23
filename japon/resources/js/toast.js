/**
 * Una clase para crear pequeños mensajes emergentes que desaparecen automáticamente
 * Use:
 *   Toast.info({
 *      message: 'bla bla bla...',
 *      mode: 'success' // ['warning' | 'danger' | 'info']
 *      error: Opcional, un mensaje por consola
 *      sleep: Opcional, un entero que representa milisegundos. Ej.: 4000
 *   })
 */
export default class Toast {
    /**
     * Cre el objeto con la configuración del toast: título, color e ícono
     * @param {String} mode Un valor 'sucess', 'warning', 'danger' o 'info'
     * @returns Un objeto con la configuración del Toast
     */
    static #init(mode) {
        const colors = {
            'bg-blue-500': 'blue-500',
            'bg-green-500': 'green-500',
            'bg-yellow-400': 'yellow-400',
            'bg-red-500': 'red-500'
        }

        switch (mode) {
            case 'success':
                return {
                    title: 'Acción exitosa',
                    colour: colors['bg-green-500'],
                    icon: icons.check
                }
            case 'warning':
                return {
                    title: '¡Cuidado!',
                    colour: colors['bg-yellow-400'],
                    icon: icons.exclamationCircleFill
                }
            case 'danger':
                return {
                    title: 'Lo siento...',
                    colour: colors['bg-red-500'],
                    icon: icons.exclamationCircleFill
                }
            default:
                return {
                    title: 'Icaro Air',
                    colour: colors['bg-blue-500'],
                    icon: icons.rayCircle
                }
        }
    }

    /**
     * Estándar para la presentaciones de errores, advertencias o información general
     * @param {String} message El mensaje que se debe mostrar
     * @param {String} mode Indica el tipo de toast a mostrar: 'success', 'warning', 'danger' o 'info'
     * @param {String} error Preferiblemente aquellos mensajes reportados por el entorno de ejecución
     * @param {integer} sleep El tiempo en milisegundos que permanece visible el toast
     */
    static info({ message = '', mode = 'info', error = '', sleep = 3000 } = {}) {
        // https://dmitripavlutin.com/javascript-object-destructuring/
        const { title, colour, icon } = this.#init(mode)
        const id = Helpers.idRandom('toast-')
        const zIndex = '' // cambie por z-50 si el toast queda por debajo de otra capa

        const html = `
            <div id="${id}" class="absolute right-2 top-2 ${zIndex} mx-auto w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-gray-800">
                <div class="bg-${colour} flex bg-opacity-90 shadow-inner">
                    <div class="bg-${colour} flex w-12 items-center justify-center transition-all duration-1000 ease-in-out">
                        ${icon}
                    </div>
                    <div class="-mx-3 px-4 py-2">
                        <div class="mx-3">
                            <span class="text-${colour} dark:text-${colour} font-semibold">${title}</span>
                            <p class="text-sm text-gray-600 dark:text-gray-200">${message}</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        // Basado en https://tailwind-elements.com/docs/standard/components/toast/
        document.querySelector('body').insertAdjacentHTML('afterbegin', html)

        setTimeout(() => document.querySelector(`#${id}`).remove(), sleep)
        if (error) {
            console.error('Houston, tenemos un problema > ', error)
        }
    }
}
