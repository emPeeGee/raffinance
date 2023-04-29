export function capitalizeFirst(str: string): string {
  if (str.length === 0) {
    return str;
  }

  const firstLetter = str.charAt(0);
  const capitalizedFirstLetter = firstLetter.toUpperCase();

  return capitalizedFirstLetter + str.slice(1);
}
