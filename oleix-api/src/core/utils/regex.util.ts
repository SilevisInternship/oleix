export const spaceToUnderscore = (str: string) =>
  str
    ?.replace(/ /g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') || undefined;
