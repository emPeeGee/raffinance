export function getRandomNumber(minValue: number, maxValue: number) {
  const min = Math.ceil(minValue);
  const max = Math.floor(maxValue);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
