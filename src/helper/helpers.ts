// Randomize an number with a maximum deviation that is either subtracted or added
export default function randomizeNumber(number: number, maxDeviation: number) {
  return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
}
