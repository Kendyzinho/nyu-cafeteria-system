import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  validarEstudianteActivo(estudiante: any): boolean {
    return estudiante.estudianteActivo === true;
  }

  validarResidenciaActiva(estudiante: any): boolean {
    return estudiante.residenciaActiva === true;
  }

  validarPagoAprobado(estudiante: any): boolean {
    return estudiante.pagoAprobado === true;
  }
}