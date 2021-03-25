// Randomise number with a maximum deviation, defaults to convert to integer
export default function randomizeNumber(
  number: number,
  maxDeviation: number,
  toInteger: boolean = true
): number {
  const randomised = number + (Math.random() - 0.5) * 2 * maxDeviation;
  return toInteger ? Math.floor(randomised) : randomised;
}
