import { cylinder, cylinderElliptic, roundedCylinder, intersect, union } from '@jscad/modeling'

/**
 * Complete Fastener Nut Generation Module
 *
 * Solid Hexagonal Prisms from ISO or UTS Standard Dimensions
 */

// Dimensions Offsets
export const FLAT_INDEX = 0
export const STD_HEIGHT_INDEX = 1
export const THIN_HEIGHT_INDEX = 2
export const LOCK_HEIGHT_INDEX = 3 

const MM_PER_INCH = 25.4

/**
 * UTS (Unified Thread Standard) Hex Nut Dimensions (inches)
 *
 * Array Mapping per size: [ widthAcrossFlats, standardHeight, thinHeight, lockHeight ]
 * Lock dimensions map standard ASME B18.16.6 Style NE heights
 *
 * Note: Uses `null` where a specific standard/thin size does not officially exist.
 */
export const UTS_NUTS = {
  // --- Machine Screw Sizes ---
  "#0":    [0.156, 0.050, null,  0.075],
  "#1":    [0.156, 0.050, null,  0.075],
  "#2":    [0.188, 0.063, null,  0.095],
  "#3":    [0.188, 0.063, null,  0.095],
  "#4":    [0.250, 0.098, null,  0.150],
  "#5":    [0.312, 0.114, null,  0.165],
  "#6":    [0.312, 0.114, null,  0.188],
  "#8":    [0.344, 0.130, null,  0.250],
  "#10":   [0.375, 0.130, null,  0.250],
  "#12":   [0.438, 0.161, null,  0.281],
  // --- Fractional Sizes (Up to 1 Inch) ---
  "1/4":   [0.438, 0.219, 0.156, 0.328],
  "5/16":  [0.500, 0.266, 0.188, 0.359],
  "3/8":   [0.563, 0.328, 0.219, 0.468],
  "7/16":  [0.688, 0.375, 0.250, 0.469],
  "1/2":   [0.750, 0.438, 0.312, 0.609],
  "9/16":  [0.875, 0.484, 0.359, 0.656],
  "5/8":   [0.938, 0.547, 0.375, 0.766],
  "3/4":   [1.125, 0.641, 0.422, 0.891],
  "7/8":   [1.312, 0.750, 0.484, 0.984],
  "1":     [1.500, 0.859, 0.547, 1.078],
  // --- Heavy Industrial / Fractional Sizes (1-1/8" to 4") ---
  "1-1/8": [1.688, 0.969, 0.609, 1.203],
  "1-1/4": [1.875, 1.078, 0.719, 1.422],
  "1-3/8": [2.062, 1.188, 0.781, 1.547],
  "1-1/2": [2.250, 1.281, 0.828, 1.672],
  "1-3/4": [2.625, 1.500, 0.969, 2.100],
  "2":     [3.000, 1.688, 1.094, 2.312],
  "2-1/4": [3.375, 1.922, 1.219, 2.625],
  "2-1/2": [3.750, 2.125, 1.359, 2.937],
  "2-3/4": [4.125, 2.328, 1.484, 3.250],
  "3":     [4.500, 2.531, 1.625, 3.562],
  "3-1/4": [4.875, 2.734, 1.750, 3.875],
  "3-1/2": [5.250, 2.953, 1.891, 4.187],
  "3-3/4": [5.625, 3.141, 2.016, 4.500],
  "4":     [6.000, 3.313, 2.000, 4.812]
}

/**
 * ISO Hex Nut Dimensions (millimeters)
 *
 * Array Mapping per size: [ widthAcrossFlats, standardHeight, thinHeight, lockHeight ]
 * Lock dimensions map standard ISO 7040 regular/high lock heights
 */
export const ISO_NUTS = {
  "M1":    [2.5,   0.8,   0.55,  1.2],
  "M1.2":  [3.0,   1.0,   0.60,  1.5],
  "M1.4":  [3.0,   1.2,   0.70,  1.8],
  "M1.6":  [3.2,   1.3,   1.00,  2.0],
  "M2":    [4.0,   1.6,   1.20,  2.5],
  "M2.5":  [5.0,   2.0,   1.60,  3.0],
  "M3":    [5.5,   2.4,   1.80,  4.0],
  "M3.5":  [6.0,   2.8,   2.00,  4.5],
  "M4":    [7.0,   3.2,   2.20,  5.0],
  "M5":    [8.0,   4.7,   2.70,  6.3],
  "M6":    [10.0,  5.2,   3.20,  8.0],
  "M7":    [11.0,  5.5,   3.50,  8.5],
  "M8":    [13.0,  6.8,   4.00,  9.5],
  "M10":   [16.0,  8.4,   5.00,  11.5],
  "M12":   [18.0,  10.8,  6.00,  14.0],
  "M14":   [21.0,  12.8,  7.00,  16.0],
  "M16":   [24.0,  14.8,  8.00,  18.0],
  "M18":   [27.0,  15.8,  9.00,  20.0],
  "M20":   [30.0,  18.0,  10.00, 22.0],
  "M22":   [32.0,  19.4,  11.00, 25.0],
  "M24":   [36.0,  21.5,  12.00, 28.0],
  "M27":   [41.0,  23.8,  13.50, 31.0],
  "M30":   [46.0,  25.6,  15.00, 34.0],
  "M33":   [50.0,  28.7,  16.50, 37.0],
  "M36":   [55.0,  31.0,  18.00, 41.5],
  "M39":   [60.0,  33.4,  19.50, 45.0],
  "M42":   [65.0,  34.0,  21.00, 48.0],
  "M45":   [70.0,  36.0,  22.50, 51.5],
  "M48":   [75.0,  38.0,  24.00, 55.0],
  "M52":   [80.0,  42.0,  26.00, 59.5],
  "M56":   [85.0,  45.0,  28.00, 64.0],
  "M60":   [90.0,  48.0,  30.00, 68.5],
  "M64":   [95.0,  51.0,  32.00, 73.0],
  "M68":   [100.0, 54.0,  34.00, 77.5]
}

/**
 * Obtain overall hex nut dimensions for the given options.
 *
 * @param {Object} options - options for construction
 * @param {String} [options.size='M4'] - size of ISO / UTS nut, see lists above.
 * @param {String} [options.standard='ISO'] - dimension standard, ISO or UTS
 * @param {Boolean} [options.isThin=false] - generate nuts with thin dimensions
 * @param {Boolean} [options.isLocknut=false] - generate nuts with locknut dimensions
 * @param {Number} [options.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [options.heightOffset=0] - clearance for oversized cutouts
 * @returns {Object} hex nut dimensions; widthAcrossFlats, totalHeight, baseHeight
 */
export const hexNutDimensions = (options = {}) => {
  let {
    size = 'M4',
    standard = 'ISO',
    isThin = false,
    isLocknut = false,
    flatOffset = 0,
    heightOffset = 0,
  } = options

  const isUts = standard.toUpperCase() === 'UTS'
  const dataset = isUts ? UTS_NUTS : ISO_NUTS
  const dim = dataset[size]

  if (!dim) return null

  let wAf = dim[FLAT_INDEX]
  let stdH = dim[STD_HEIGHT_INDEX]
  
  // height prioritization logic sequence
  let totalHeight = stdH
  if (isLocknut && dim[LOCK_HEIGHT_INDEX] !== null) {
    totalHeight = dim[LOCK_HEIGHT_INDEX]
  } else if (isThin && dim[THIN_HEIGHT_INDEX] !== null) {
    totalHeight = dim[THIN_HEIGHT_INDEX]
  }

  if (isUts) {
    wAf = wAf * MM_PER_INCH
    stdH = stdH * MM_PER_INCH
    totalHeight = totalHeight * MM_PER_INCH
  }

  return {
    widthAcrossFlats: wAf + flatOffset,
    totalHeight: totalHeight + heightOffset,
    baseHeight: stdH + (isLocknut ? 0 : heightOffset) 
  }

}

/**
 * Internal Helper: Generates a double-beveled hex block centered on Z = 0
 */
function createBeveledHex(outerCornerRadius, widthAcrossFlats, targetHeight, centerZ = 0) {
  // 1. Raw sharp Hex prism
  const rawHex = cylinder({
    radius: outerCornerRadius,
    height: targetHeight,
    segments: 6,
    center: [0, 0, centerZ]
  });

  // 2. Precision Chamfer Geometry Math (30-degree target angle from face plane)
  const chamferRadiusStart = widthAcrossFlats / 2;
  const deltaRadius = outerCornerRadius - chamferRadiusStart;
  const chamferDepth = deltaRadius / Math.sqrt(3); 
  const overshootRadius = outerCornerRadius + 1;

  // 3. Top Tapered Cone Cutter (Tapers INWARD toward the top face)
  const topCutter = cylinderElliptic({
    startRadius: [overshootRadius, overshootRadius],
    endRadius: [chamferRadiusStart, chamferRadiusStart],
    height: chamferDepth,
    segments: 32,
    center: [0, 0, centerZ + (targetHeight / 2) - (chamferDepth / 2)]
  });

  // 4. Bottom Tapered Cone Cutter (Tapers OUTWARD away from the bottom face)
  // Bottom of this cone is narrow (chamfer start), top of this cone is wide (overshoot)
  const bottomCutter = cylinderElliptic({
    startRadius: [chamferRadiusStart, chamferRadiusStart],
    endRadius: [overshootRadius, overshootRadius],
    height: chamferDepth,
    segments: 32,
    center: [0, 0, centerZ - (targetHeight / 2) + (chamferDepth / 2)]
  });

  // 5. Middle Cylindrical Core Mask
  const middleCylinderHeight = targetHeight - (chamferDepth * 2);
  const middleCore = cylinderElliptic({
    startRadius: [overshootRadius, overshootRadius],
    endRadius: [overshootRadius, overshootRadius],
    height: middleCylinderHeight > 0 ? middleCylinderHeight : 0.01,
    segments: 32,
    center: [0, 0, centerZ]
  });

  // 6. Combine boundaries into lathe geometry mask
  const masterLatheMask = union(topCutter, middleCore, bottomCutter);

  return intersect(rawHex, masterLatheMask);

  return [topCutter, bottomCutter, middleCore]

  // Intersect the hex with BOTH cutters sequentially to cleanly taper both ends
  return intersect(rawHex, topCutter, bottomCutter);
}


/**
 * Construct a Hex Nut from the given options.
 *
 * @param {Object} options - options for construction
 * @param {String} [options.size='M4'] - size of ISO / UTS nut, see lists above.
 * @param {String} [options.standard='ISO'] - dimension standard, ISO or UTS
 * @param {Boolean} [options.isThin=false] - generate nuts with thin dimensions
 * @param {Boolean} [options.isLocknut=false] - generate nuts with locknut dimensions
 * @param {Number} [options.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [options.heightOffset=0] - clearance for oversized cutouts
 *
 * @example
 * hexNut({size: 'M4'})
 * hexNut({size: 'M30', isLocknut: true})
 * hexNut({size: '#8', standard: 'UTS'})
 * hexNut({size: '1', standard: 'UTS', isThin: true})
 */
export const hexNut = (options = {}) => {
  let {
    size = 'M4',
    standard = 'ISO',
    isThin = false,
    isLocknut = false,
    flatOffset = 0,
    heightOffset = 0,
    segments = 32, // for locknut collar
  } = options

  const dim = hexNutDimensions(options)
  if (!dim) throw new Error(`Size ${size} not found within ${standard} dictionaries.`)

  // Computes vertex corner bounds from flat width parameter constraints
  const outerRadius = (dim.widthAcrossFlats / 2) / Math.cos(Math.PI / 6)
  
  // Case 1: standard / thin nuts are symmetrical hexagonal prisms
  if (!isLocknut) {
    return createBeveledHex(outerRadius, dim.widthAcrossFlats, dim.totalHeight)
  }

  // Case 2: symmetrical compound nylon lock nut
  const baseHeight = dim.baseHeight
  const collarHeight = dim.totalHeight - baseHeight
  
  // calculate total bounds to center the geometry
  const halfTotalHeight = dim.totalHeight / 2

  // base hex goes from bottom to the hex split line
  const zOffset = -halfTotalHeight + (baseHeight / 2)
  const hexBase = createBeveledHex(outerRadius, dim.widthAcrossFlats, baseHeight, zOffset)

  // round collar stacks above the base hex
  const roundRadius = collarHeight * 0.25
  const roundCollar = roundedCylinder({
    roundRadius,
    radius: dim.widthAcrossFlats / 2,
    height: collarHeight + roundRadius,
    segments,
    center: [0, 0, -halfTotalHeight + baseHeight + (collarHeight / 2) - roundRadius]
  })

  return union(hexBase, roundCollar)
}

export const main = () => {
  //return hexNut({size: 'M4'})
  //return hexNut({size: 'M30', isLocknut: true})
  //return hexNut({size: '#8', standard: 'UTS'})
  return hexNut({size: '1', standard: 'UTS', isThin: true})
}
