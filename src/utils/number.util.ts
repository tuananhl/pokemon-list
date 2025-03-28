function replaceWithValidNumber(num: number, defaultValue: number): number {
  if (Number.isNaN(num)) return defaultValue;
  return num;
}

export { replaceWithValidNumber };
