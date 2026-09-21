/**
 * Calculate the geometric sagitta (deviation depth of a faceted circle)
 *
 * Used to determine the exact structural padding required to avoid CSG z-fighting mesh artifacts.
 *
 * @param {number} radius - The target radius of the circle or cylinder
 * @param {number} segments - Number of subdivisions/segments per turn
 * @returns {number} The maximum distance from the true circle to the flat facet chord
 */
export function calculateSagitta(radius, segments) {
  if (segments <= 0) return 0;
  return radius * (1 - Math.cos(Math.PI / segments));
}
