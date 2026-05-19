export const HORA_APERTURA = 8;
export const HORA_CIERRE = 18;
export const INTERVALO_MINUTOS = 15;
export const MINUTOS_BUFFER_FUTURO = 5;

export interface ValidacionSlot {
  ok: boolean;
  motivo?: string;
}

export function validarHorarioRetiro(fecha: Date, ahora: Date = new Date()): ValidacionSlot {
  if (isNaN(fecha.getTime())) {
    return { ok: false, motivo: 'Horario de retiro inválido' };
  }

  const minimo = new Date(ahora.getTime() + MINUTOS_BUFFER_FUTURO * 60_000);
  if (fecha < minimo) {
    return { ok: false, motivo: 'El horario de retiro debe ser al menos 5 minutos en el futuro' };
  }

  const mismaFecha =
    fecha.getFullYear() === ahora.getFullYear() &&
    fecha.getMonth() === ahora.getMonth() &&
    fecha.getDate() === ahora.getDate();
  if (!mismaFecha) {
    return { ok: false, motivo: 'El horario de retiro debe ser para hoy' };
  }

  const hora = fecha.getHours();
  if (hora < HORA_APERTURA || hora >= HORA_CIERRE) {
    return {
      ok: false,
      motivo: `El horario de retiro debe estar entre ${HORA_APERTURA}:00 y ${HORA_CIERRE}:00`,
    };
  }

  if (fecha.getMinutes() % INTERVALO_MINUTOS !== 0 || fecha.getSeconds() !== 0) {
    return {
      ok: false,
      motivo: `El horario debe coincidir con un slot de ${INTERVALO_MINUTOS} minutos`,
    };
  }

  return { ok: true };
}
