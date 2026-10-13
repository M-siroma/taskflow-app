/** Gera um identificador único baseado no horário atual e em um sufixo aleatório. */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${random}`;
}
