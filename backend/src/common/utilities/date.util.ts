export const now = (): Date => {
  return new Date();
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};