/**
 * Randomise number with a maximum deviation, defaults to convert to integer
 *
 * @export
 * @param {number} number Number to which maxDeviation randomisation is applied
 * @param {number} maxDeviation Maximum deviation (positive and negative) in generating the random number
 * @param {boolean} [toInteger=true] Convert randomised number to integer
 * @returns {number}
 */
export default function randomizeNumber(
  number: number,
  maxDeviation: number,
  toInteger: boolean = true
): number {
  const randomised = number + (Math.random() - 0.5) * 2 * maxDeviation;
  return toInteger ? Math.floor(randomised) : randomised;
}
