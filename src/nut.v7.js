import { cylinder, cylinderElliptic, roundedCylinder, intersect, union } from '@jscad/modeling'

/**
 * Complete Fastener Nut Generation Module
 *
 * Solid Hexagonal Prisms from ISO or UTS Standard Dimensions
 */

// Dimensions Offsets
export const WIDTH_ACROSS_FLATS = 0
export const STANDARD_HEIGHT = 1
export const THIN_HEIGHT = 2
export const LOCK_HEIGHT = 3 

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
 * Master Registry for ISO Hexagon Nut Dimensions (millimeters)
 *
 * Standards: 
 *   - widthAcrossFlats & standardHeight: ISO 4032
 *   - thinHeight: ISO 4035
 *   - lockHeight: ISO 7040 plus DIN 934 / 439 / 985
 *
 * "Designation": [widthAcrossFlats, standardHeight, thinHeight, lockHeight]
 */
const ISO_NUTS = {
  "M1":    [2.5,   0.8,   0.55,  1.2 ], // Safe sub-millimeter DIN limits applied
  "M1.1":  [2.5,   0.8,   0.55,  1.2 ],
  "M1.2":  [3.0,   1.0,   0.6,   1.4 ],
  "M1.4":  [3.0,   1.2,   0.7,   1.4 ],
  "M1.6":  [3.2,   1.3,   1.0,   1.7 ], // DIN 985 low-profile lock height
  "M1.8":  [3.5,   1.4,   1.0,   2.0 ],
  "M2":    [4.0,   1.6,   1.2,   3.0 ], // DIN 985 standard M2 lock form
  "M2.2":  [4.5,   1.8,   1.3,   3.3 ],
  "M2.5":  [5.0,   2.0,   1.6,   3.5 ],
  "M3":    [5.5,   2.4,   1.8,   4.0 ], // Standard ISO 7040 structural line begins
  "M3.5":  [6.0,   2.8,   2.0,   4.5 ],
  "M4":    [7.0,   3.2,   2.2,   5.0 ],
  "M4.5":  [8.0,   3.6,   2.2,   5.0 ],
  "M5":    [8.0,   4.7,   2.7,   5.0 ],
  "M6":    [10.0,  5.2,   3.2,   6.0 ],
  "M7":    [11.0,  5.5,   3.5,   7.5 ],
  "M8":    [13.0,  6.8,   4.0,   8.0 ],
  "M9":    [13.0,  7.2,   4.5,   8.0 ],
  "M10":   [16.0,  8.4,   5.0,   10.0],
  "M11":   [17.0,  8.8,   5.5,   10.0],
  "M12":   [18.0,  10.8,  6.0,   12.0],
  "M14":   [21.0,  12.8,  7.0,   14.0],
  "M16":   [24.0,  14.8,  8.0,   16.0],
  "M18":   [27.0,  15.8,  9.0,   18.5],
  "M20":   [30.0,  18.0,  10.0,  20.0],
  "M22":   [34.0,  19.4,  11.0,  22.0],
  "M24":   [36.0,  21.5,  12.0,  22.0],
  "M27":   [41.0,  23.8,  13.5,  27.0],
  "M30":   [46.0,  25.6,  15.0,  30.0],
  "M33":   [50.0,  28.7,  16.5,  33.0],
  "M36":   [55.0,  31.0,  18.0,  36.0],
  "M39":   [60.0,  33.4,  20.0,  39.0],
  "M42":   [65.0,  34.0,  21.0,  null], // Poly-locking limits cap at M39
  "M45":   [70.0,  36.0,  22.0,  null],
  "M48":   [75.0,  38.0,  24.0,  null],
  "M52":   [80.0,  42.0,  26.0,  null],
  "M56":   [85.0,  45.0,  28.0,  null],
  "M60":   [90.0,  48.0,  30.0,  null],
  "M64":   [95.0,  51.0,  32.0,  null],
  "M68":   [100.0, 54.0,  34.0,  null]
}

/**
 * Obtain overall hex nut dimensions for the given specification.
 *
 * @param {Object} specification - specification for construction
 * @param {String} [specification.size='M4'] - size of ISO / UTS nut, see lists above.
 * @param {String} [specification.standard='ISO'] - dimension standard, ISO or UTS
 * @param {Boolean} [specification.isThin=false] - generate nuts with thin dimensions
 * @param {Boolean} [specification.isLocknut=false] - generate nuts with locknut dimensions
 * @param {Number} [specification.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [specification.heightOffset=0] - clearance for oversized cutouts
 * @returns {Object} hex nut dimensions; widthAcrossFlats, totalHeight, baseHeight
 */
export const getHexNutDimensions = (specification = {}) => {
  let {
    size = 'M4',
    standard = 'ISO',
    isThin = false,
    isLocknut = false,
    flatOffset = 0,
    heightOffset = 0,
  } = specification

  const isUts = standard.toUpperCase() === 'UTS'
  const dataset = isUts ? UTS_NUTS : ISO_NUTS
  const dim = dataset[size]

  if (!dim) return null

  let wAf = dim[WIDTH_ACROSS_FLATS]
  let stdH = dim[STANDARD_HEIGHT]
  
  // height prioritization logic sequence
  let totalHeight = stdH
  if (isLocknut && dim[LOCK_HEIGHT] !== null) {
    totalHeight = dim[LOCK_HEIGHT]
  } else if (isThin && dim[THIN_HEIGHT] !== null) {
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
const createBeveledHex = (hexSpec = {}) => {
  const { outerRadius, widthAcrossFlats, targetHeight, zOffset, segments } = hexSpec
  console.log(outerRadius, widthAcrossFlats, targetHeight, zOffset, segments)

  // 1. Raw sharp Hex prism
  const rawHex = cylinder({
    radius: outerRadius,
    height: targetHeight,
    segments: 6,
    center: [0, 0, zOffset]
  })

  // 2. Precision Chamfer Geometry Math (30-degree target angle from face plane)
  const chamferRadiusStart = widthAcrossFlats / 2
  const deltaRadius = outerRadius - chamferRadiusStart
  const chamferDepth = deltaRadius / Math.sqrt(3) 
  const overshootRadius = outerRadius + 1

  // 3. Top Tapered Cone Cutter (Tapers INWARD toward the top face)
  const topCutter = cylinderElliptic({
    startRadius: [overshootRadius, overshootRadius],
    endRadius: [chamferRadiusStart, chamferRadiusStart],
    height: chamferDepth,
    segments,
    center: [0, 0, zOffset + (targetHeight / 2) - (chamferDepth / 2)]
  })

  // 4. Bottom Tapered Cone Cutter (Tapers OUTWARD away from the bottom face)
  // Bottom of this cone is narrow (chamfer start), top of this cone is wide (overshoot)
  const bottomCutter = cylinderElliptic({
    startRadius: [chamferRadiusStart, chamferRadiusStart],
    endRadius: [overshootRadius, overshootRadius],
    height: chamferDepth,
    segments,
    center: [0, 0, zOffset - (targetHeight / 2) + (chamferDepth / 2)]
  })

  // 5. Middle Cylindrical Core Mask
  const middleCylinderHeight = targetHeight - (chamferDepth * 2)
  const middleCore = cylinderElliptic({
    startRadius: [overshootRadius, overshootRadius],
    endRadius: [overshootRadius, overshootRadius],
    height: middleCylinderHeight > 0 ? middleCylinderHeight : 0.01,
    segments,
    center: [0, 0, zOffset]
  })

  // 6. Combine boundaries into lathe geometry mask
  const masterLatheMask = union(topCutter, middleCore, bottomCutter)

  // 7. Intersect the hex with BOTH cutters sequentially to cleanly taper both ends
  return intersect(rawHex, masterLatheMask)
}


/**
 * Create a Hex Nut from the given specification.
 *
 * @param {Object} specification - specification for construction
 * @param {String} [specification.size='M4'] - size of ISO / UTS nut, see lists above.
 * @param {String} [specification.standard='ISO'] - dimension standard, ISO or UTS
 * @param {Boolean} [specification.isThin=false] - generate nuts with thin dimensions
 * @param {Boolean} [specification.isLocknut=false] - generate nuts with locknut dimensions
 * @param {Number} [specification.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [specification.heightOffset=0] - clearance for oversized cutouts
 *
 * @example
 * createHexNut({size: 'M4'})
 * createHexNut({size: 'M30', isLocknut: true})
 * createHexNut({size: '#8', standard: 'UTS'})
 * createHexNut({size: '1', standard: 'UTS', isThin: true})
 */
export const createHexNut = (specification = {}) => {
  let {
    size = 'M4',
    standard = 'ISO',
    isThin = false,
    isLocknut = false,
    flatOffset = 0,
    heightOffset = 0,
    segments = 36, // for locknut collar
  } = specification

  const dim = getHexNutDimensions(specification)
  if (!dim) throw new Error(`Missing hex nut specification for size [${size}] withing ${standard}`)

  const { widthAcrossFlats, totalHeight, baseHeight } = dim

  // Computes vertex corner bounds from flat width parameter constraints
  const outerRadius = (widthAcrossFlats / 2) / Math.cos(Math.PI / 6)
  let zOffset = 0
  
  // Case 1: standard / thin nuts are symmetrical hexagonal prisms
  if (!isLocknut) {
    return createBeveledHex({outerRadius, widthAcrossFlats, targetHeight: totalHeight, zOffset, segments})
  }

  // Case 2: symmetrical compound nylon lock nut
  const collarHeight = totalHeight - baseHeight
  
  // calculate total bounds to center the geometry
  const halfTotalHeight = totalHeight / 2

  // base hex goes from bottom to the hex split line
  zOffset = -halfTotalHeight + (baseHeight / 2)
  const hexBase = createBeveledHex({outerRadius, widthAcrossFlats, targetHeight: baseHeight, zOffset, segments})

  // round collar stacks above the base hex
  const roundRadius = collarHeight * 0.25
  zOffset = -halfTotalHeight + baseHeight + (collarHeight / 2) - roundRadius
  const roundCollar = roundedCylinder({
    roundRadius,
    radius: widthAcrossFlats / 2,
    height: collarHeight + roundRadius,
    segments,
    center: [0, 0, zOffset]
  })

  return union(hexBase, roundCollar)
}
