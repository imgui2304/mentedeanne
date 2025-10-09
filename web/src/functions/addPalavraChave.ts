export const addPalavraChave = (
  novaPalavraChave: string,
  palavrasChave: string[]
): string[] => {
  if (
    novaPalavraChave.trim() &&
    !palavrasChave.includes(novaPalavraChave.trim()) &&
    palavrasChave.length < 5
  ) {
    return [...palavrasChave, novaPalavraChave.trim()];
  }
  return palavrasChave; // se não adicionou, retorna o array original
};

export const removePalavraChave = (
  index: number,
  palavrasChave: string[]
): string[] => {
  return palavrasChave.filter((_, i) => i !== index);
};