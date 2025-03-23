
import type { Inscripcion, Estudiante, InfoEstudiante, InfoInscripcion } from './+page';

let data: Inscripcion[];
  
export async function fetchData(): Promise<void> {
		const response = await fetch('src/assets/inscripciones.json')
		data = await response.json();
	};


	export function getEstudiantes(): Estudiante[] {
    return [...new Map(
      data.map(item => [item.estudiante.nombre, item.estudiante])).values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  export function getInfoEstudiante(codigo: string): InfoEstudiante {
    const inscripciones: Inscripcion[] = data.filter(inscripcion => inscripcion.estudiante.codigo === codigo);
    const estudiante: Estudiante = inscripciones[0]?.estudiante;

    const info: InfoInscripcion[] = inscripciones.map(inscripcion => ({
      grupo: inscripcion.grupo,
      notas: inscripcion.notas,
      definitiva: inscripcion.definitiva,
      inasistencia: inscripcion.inasistencia
    }));

    const promedio: number = getPromedio(info);
    const rendimiento: string = getRendimiento(promedio);

    return { estudiante, info, promedio, rendimiento };
  }

  export function getPromedio(info: InfoInscripcion[]): number {
    const notas: number[] = info.map(inscripcion => inscripcion.definitiva);
    const promedio: number = notas.reduce((a, b) => a + b, 0) / notas.length;

    return promedio;
  }

  export function getRendimiento(promedio: number): string {
    if (promedio >= 4.4) return 'Sobresaliente';
    if (promedio >= 3.9) return 'Bueno';
    if (promedio >= 3.4) return 'Aceptable';
    if (promedio >= 3.0) return 'Regular';

    return 'Deficiente';
  }

  export function getInfoEstudiantes(): InfoEstudiante[] {
    return getEstudiantes().map(estudiante => getInfoEstudiante(estudiante.codigo));
}
  
export function getDataGrupo(codigo: string): boolean {
  //console.log(codigo)
  const gr = data.find(inscripcion => inscripcion.grupo.codigo === codigo);
  if (gr) {
    console.log(gr.grupo);
    return false;
  } else {
    console.log(`No se encontró un grupo con el código de asignatura ${codigo}`);
    return false;
  }

}



  

  
