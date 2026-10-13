function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/** Formata uma data ISO como "dd/mm/aaaa hh:mm". */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}`;
}
