export function isValidOdds(odds: string | null): boolean {
  return !!odds && !['-', '--', '0'].includes(odds);
}
