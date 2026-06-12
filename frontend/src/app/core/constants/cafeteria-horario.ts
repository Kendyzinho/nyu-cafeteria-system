export const HORA_APERTURA = 8;
export const HORA_CIERRE = 23;
export const INTERVALO_MINUTOS = 15;
export const MINUTOS_BUFFER_FUTURO = 5;

export function getSlotsDisponiblesHoy(ahora: Date = new Date()): Date[] {
  const slots: Date[] = [];

  const apertura = new Date(ahora);
  apertura.setHours(HORA_APERTURA, 0, 0, 0);

  const cierre = new Date(ahora);
  cierre.setHours(HORA_CIERRE, 0, 0, 0);

  const minimo = new Date(ahora.getTime() + MINUTOS_BUFFER_FUTURO * 60_000);
  const minutos = minimo.getMinutes();
  const resto = minutos % INTERVALO_MINUTOS;
  if (resto !== 0 || minimo.getSeconds() !== 0 || minimo.getMilliseconds() !== 0) {
    minimo.setMinutes(minutos + (INTERVALO_MINUTOS - resto), 0, 0);
  }

  const inicio = minimo > apertura ? minimo : apertura;

  for (let t = new Date(inicio); t < cierre; t = new Date(t.getTime() + INTERVALO_MINUTOS * 60_000)) {
    slots.push(new Date(t));
  }

  return slots;
}

export function formatearSlot(fecha: Date): string {
  const hh = fecha.getHours().toString().padStart(2, '0');
  const mm = fecha.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}
