// retorna o novo array sem mexer no estado
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
  return palavrasChave; // se não atender as condições, retorna o mesmo array
};

export const removePalavraChave = (
  index: number,
  palavrasChave: string[]
): string[] => {
  return palavrasChave.filter((_, i) => i !== index);
};

export const addReferencia = (
  novaReferencia: string,
  referencias: string[]
): string[] => {
  if (
    novaReferencia.trim() &&
    !referencias.includes(novaReferencia.trim())
  ) {
    return [...referencias, novaReferencia.trim()];
  }
  console.log(referencias)
  return referencias;
};

export const removeReferencia = (
  index: number,
  referencias: string[]
): string[] => {
  return referencias.filter((_, i) => i !== index);
};
