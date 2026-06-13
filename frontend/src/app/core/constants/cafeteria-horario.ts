export const HORA_APERTURA = 8;
export const HORA_CIERRE = 23;
export const INTERVALO_MINUTOS = 15;
export const MINUTOS_BUFFER_FUTURO = 5;

function getSlotsParaDia(dia: Date, ahora: Date): Date[] {
  const slots: Date[] = [];

  const apertura = new Date(dia);
  apertura.setHours(HORA_APERTURA, 0, 0, 0);

  const cierre = new Date(dia);
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

function getSlotsManana(ahora: Date): Date[] {
  const slots: Date[] = [];
  const manana = new Date(ahora);
  manana.setDate(manana.getDate() + 1);

  const apertura = new Date(manana);
  apertura.setHours(HORA_APERTURA, 0, 0, 0);

  const cierre = new Date(manana);
  cierre.setHours(HORA_CIERRE, 0, 0, 0);

  for (let t = new Date(apertura); t < cierre; t = new Date(t.getTime() + INTERVALO_MINUTOS * 60_000)) {
    slots.push(new Date(t));
  }
  return slots;
}

export function getSlotsDisponiblesHoy(ahora: Date = new Date()): Date[] {
  const hoy = getSlotsParaDia(ahora, ahora);
  if (hoy.length > 0) return hoy;
  return getSlotsManana(ahora);
}

export function formatearSlot(fecha: Date): string {
  const hh = fecha.getHours().toString().padStart(2, '0');
  const mm = fecha.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}