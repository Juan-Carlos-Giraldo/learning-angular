<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchData, getInfoEstudiantes, getInfoEstudiante, getDataGrupo } from './components';

  let estudiantes: any[] = [];

  onMount(async () => {
    await fetchData();
    estudiantes = getInfoEstudiantes();
  });

  function getDataEstudiante(codigo: string): boolean {
    //console.clear();
    console.log(getInfoEstudiante(codigo));
    return false;
  }
</script>

<main>
  <h1 class="text-center text-6xl text-slate-100 mt-10">Diseño basado en el videojuego <a href="https://www.google.com/search?q=persona+5&oq=persona+5&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQLhhA0gEIMjM3NGowajGoAgCwAgA&sourceid=chrome&ie=UTF-8" class="titlePersona5">Persona 5</a></h1>
  <div class="max-w-5xl mt-4 mx-auto">
    <div class="gap-12 grid mb-8 shadow-sm md:mb-12 md:grid-cols-3 bg-transparent">
      {#each estudiantes as inscripcion, i}
        <figure class="flex flex-col items-center justify-center p-8 bg-transparent">
          <blockquote class="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
            <div class="rotate-[-10deg] px-5 py-3 bg-gray-950 hover:rotate-[-14deg] mb-2 border-b-4 border-r-4">
              <h3 class="subtitlePersona5 text-start text-lg font-semibold text-gray-100 dark:text-gray-100"><a href="#top" on:click={() => getDataEstudiante(inscripcion.estudiante.codigo)}>{inscripcion.estudiante.nombre}</a></h3>
            </div>
            <div class="rotate-[-8deg] hover:rotate-[-14deg] bg-gray-950 px-3 py-6 ml-5 border-b-8 border-r-8 min-w-80">
              <p class="text-start subtitlePersona5">
                {#each inscripcion.info as info}
                  <a href="#top" class="block indent-5 text-slate-300" on:click={() => getDataGrupo(info.grupo.codigo)}>
                    {info.grupo.asignatura.nombre}
                  </a>
                  <div class="ml-16">
                    {#each info.notas as notas}
                      {#if notas < 3}
                        <span class="text-red-500">{notas},&nbsp;</span>
                      {:else}
                        <span class="text-blue-500">{notas},&nbsp; </span>
                      {/if}
                    {/each}
                  </div>
                {/each}
                {#if inscripcion.rendimiento === 'Deficiente'}
                  <span class="ml-10 text-red-500">Deficiente</span>
                {:else if inscripcion.rendimiento === 'Regular'}
                  <span class="ml-10 text-amber-500">Regular</span>
                {:else if inscripcion.rendimiento === 'Aceptable'}
                  <span class="ml-10 text-green-500">Aceptable</span>
                {:else if inscripcion.rendimiento === 'Bueno'}
                  <span class="ml-10 text-green-500">Bueno</span>
                {:else if inscripcion.rendimiento === 'Sobresaliente'}
                  <span class="ml-10 text-blue-500">Sobresaliente</span>
                {/if}
              </p>
            </div>
          </blockquote>
        </figure>
      {/each}
    </div>
  </div>
</main>

<style lang="postcss">
  :global(html) {
    background-image: linear-gradient(#ef4444, #a8000f);
  }

  @font-face {
    font-family: SubTitlePersona5;
    src: url('./src/assets/fonts/SubTitlePersona5.ttf');
  }

  @font-face {
    font-family: TitlePersona5;
    src: url('./src/assets/fonts/TitlePersona5.ttf');
  }

  .subtitlePersona5 {
    font-family: SubTitlePersona5;
    font-size: larger;
  }

  .titlePersona5 {
    font-family: TitlePersona5;
  }
</style>
