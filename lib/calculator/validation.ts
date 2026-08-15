export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

export function assertInRange(
  value: number,
  label: string,
  minimum: number,
  maximum: number,
  minimumInclusive = true
): void {
  const belowMinimum = minimumInclusive ? value < minimum : value <= minimum;
  if (belowMinimum || value > maximum) {
    const lowerBound = minimumInclusive ? `at least ${minimum}` : `greater than ${minimum}`;
    throw new Error(`${label} must be ${lowerBound} and up to ${maximum}.`);
  }
}
