import { cylinder, cylinderElliptic, subtract, union, centerZ, mirrorZ, translate } from '@jscad/modeling'

import { HexNut } from './nut.js'

/*
 * ISO Nut Generation Module
 */

// Dimensions Offsets
export const WIDTH_ACROSS_FLATS = 0
export const STANDARD_HEIGHT = 1

const MM_PER_INCH = 25.4

/**
 * ISO 4032 Hex Standard Nuts
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 */
export const ISO_4032_HEX_STANDARD = {
  "M1.6": [3.20, 1.30],
  "M2":   [4.00, 1.60],
  "M2.5": [5.00, 2.00],
  "M3":   [5.50, 2.40],
  "M3.5": [6.00, 2.80],
  "M4":   [7.00, 3.20],
  "M5":   [8.00, 4.70],
  "M6":   [10.00, 5.20],
  "M7":   [11.00, 5.50],
  "M8":   [13.00, 6.80],
  "M10":  [16.00, 8.40], // Note: ISO uses 16mm WAF (DIN used 17mm)
  "M12":  [18.00, 10.80], // Note: ISO uses 18mm WAF (DIN used 19mm)
  "M14":  [21.00, 12.80], // Note: ISO uses 21mm WAF (DIN used 22mm)
  "M16":  [24.00, 14.80],
  "M18":  [27.00, 15.80],
  "M20":  [30.00, 18.00],
  "M22":  [34.00, 19.40], // Note: ISO uses 34mm WAF (DIN used 32mm)
  "M24":  [36.00, 21.50],
  "M27":  [41.00, 23.80],
  "M30":  [46.00, 25.60],
  "M33":  [50.00, 28.70],
  "M36":  [55.00, 31.00],
  "M39":  [60.00, 33.40],
  "M42":  [65.00, 34.00],
  "M45":  [70.00, 36.00],
  "M48":  [75.00, 38.00],
  "M52":  [80.00, 42.00],
  "M56":  [85.00, 45.00],
  "M60":  [90.00, 48.00],
  "M64":  [95.00, 51.00]
}

/**
 * ISO 7414 Hex Structual Heavy Nuts
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 */
export const ISO_7414_HEX_STRUCTURAL_HEAVY = {
  "M12": [22.00, 10.00],
  "M16": [27.00, 13.00],
  "M20": [32.00, 16.00],
  "M22": [36.00, 18.00],
  "M24": [41.00, 19.00],
  "M27": [46.00, 22.00],
  "M30": [50.00, 24.00],
  "M36": [60.00, 29.00]
}

/**
 * ISO 4033 Style 2 Hex High-Clamping Nuts
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 */
export const ISO_4033_HEX_HIGH_NUTS = {
  "M5":   [8.00,  5.10],
  "M6":   [10.00, 5.70],
  "M7":   [11.00, 6.50],  // Added/Updated in latest ISO revisions
  "M8":   [13.00, 7.50],
  "M10":  [16.00, 9.30],  // Note standard ISO 16mm wrench size
  "M12":  [18.00, 12.00],
  "M14":  [21.00, 14.10], // Recommended by standard to avoid if possible
  "M16":  [24.00, 16.40],
  "M18":  [27.00, 17.60],
  "M20":  [30.00, 20.30],
  "M22":  [34.00, 21.80],
  "M24":  [36.00, 23.90],
  "M27":  [41.00, 25.90],
  "M30":  [46.00, 28.60],
  "M33":  [50.00, 31.50],
  "M36":  [55.00, 34.70],
  "M39":  [60.00, 37.50]
}

/**
 * ISO 4035 Style 0 Hex Standard Nut (Metric Coarse)
 *
 * NOTE: ISO 8675 defines the same dimensions but uses metric fine pitch threads.
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 */
export const ISO_4035_HEX_THIN_JAM = {
  "M1.6": [3.200, 1.000],
  "M2":   [4.000, 1.200],
  "M2.5": [5.000, 1.600],
  "M3":   [5.500, 1.800],
  "M3.5": [6.000, 2.000],
  "M4":   [7.000, 2.200],
  "M5":   [8.000, 2.700],
  "M6":   [10.000, 3.200],
  "M7":   [11.000, 3.500],
  "M8":   [13.000, 4.000],
  "M10":  [16.000, 5.000],  // Standardized 16mm ISO WAF
  "M12":  [18.000, 6.000],  // Standardized 18mm ISO WAF
  "M14":  [21.000, 7.000],  // Standardized 21mm ISO WAF
  "M16":  [24.000, 8.000],
  "M18":  [27.000, 9.000],
  "M20":  [30.000, 10.000],
  "M22":  [34.000, 11.000], // Standardized 34mm ISO WAF
  "M24":  [36.000, 12.000],
  "M27":  [41.000, 13.500],
  "M30":  [46.000, 15.000],
  "M33":  [50.000, 16.500],
  "M36":  [55.000, 18.000],
  "M39":  [60.000, 19.500],
  "M42":  [65.000, 21.000],
  "M45":  [70.000, 22.500],
  "M48":  [75.000, 24.000],
  "M52":  [80.000, 26.000],
  "M56":  [85.000, 28.000],
  "M60":  [90.000, 30.000],
  "M64":  [95.000, 32.000]
}

/**
 * DIN 557 Square Standard Nut
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 */
export const DIN_557_SQUARE = {
  // Small Sizes (Fallback to standard profiles)
  "M1.6": [3.200, 1.000],
  "M2":   [4.000, 1.200],
  "M2.5": [5.000, 1.600],
  "M3":   [5.500, 1.800],
  "M3.5": [6.000, 2.000],
  "M4":   [7.000, 2.200],
  // Regular Metric Square Nuts (Aligned with ISO WAF Framework)
  "M5":  [8.000, 4.000],
  "M6":  [10.000, 5.000],
  "M8":  [13.000, 6.500],
  "M10": [16.000, 8.000], // Modern ISO tool clearance variant
  "M12": [18.000, 10.000], // Modern ISO tool clearance variant
  "M16": [24.000, 13.000]
}

// TBD Support square nuts
// Calculate outer corner radius directly for the 4-corner square profile
// const squareOuterRadius = +((widthAcrossFlats * 1.4142) / 2).toFixed(3)
// TBD Support flange nuts

/**
 * Get the hex nut dimensions for the given ISO specification.
 *
 * @param {Object} spec - specification for construction
 * @param {String} [spec.size] - required, size of ISO nut, see lists above
 * @param {Boolean} [spec.isHeavy=false] - generate nuts with heavy dimensions
 * @param {Boolean} [spec.isThin=false] - generate nuts with thin (jam) dimensions
 * @param {Number} [spec.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.heightOffset=0] - clearance for oversized cutouts
 * @returns {Object} hex nut dimensions; widthAcrossFlats, height, bearingFaceHeight (mm)
 */
export const getNutDimensions = (spec = {}) => {
  let {
    size,
    isHeavy = false,
    isThin = false,
    flatOffset = 0,
    heightOffset = 0,
  } = spec

  if (!size) return null

  const standard = 'ISO'

  let dataset

  if (!dataset && isThin) dataset = ISO_4035_HEX_THIN_JAM
  if (!dataset && isHeavy) dataset = ISO_4033_HEX_HIGH_NUTS
  if (!dataset) dataset = ISO_4032_HEX_STANDARD

  if (!dataset) return null

  // get the dimensions for the requested size
  const dim = dataset[size]
  if (!dim) return null

  let widthAcrossFlats = dim[WIDTH_ACROSS_FLATS] + (flatOffset * 2)
  let height = dim[STANDARD_HEIGHT] + (heightOffset * 2)
  let bearingFaceHeight = 0
  
  // height prioritization logic sequence
  // let totalHeight = stdH
  // if (isLocknut && dim[LOCK_HEIGHT] !== null) {
  //   totalHeight = dim[LOCK_HEIGHT]
  // } else if (isThin && dim[THIN_HEIGHT] !== null) {
  //   totalHeight = dim[THIN_HEIGHT_INDEX]
  // }

  if (widthAcrossFlats >= 10.00) { // M6
    // add a bearing surface to the bottom of the nut
    bearingFaceHeight = 0.400
  }
  if (widthAcrossFlats >= 21.00) { // M14
    // add a bearing surface to the bottom of the nut
    bearingFaceHeight = 0.600
  }
  if (widthAcrossFlats >= 60.00) { // M39
    // add a bearing surface to the bottom of the nut
    bearingFaceHeight = 0.800
  }

  return {
    // spec
    size,
    standard,
    isHeavy,
    isThin,
    // dimensions
    widthAcrossFlats,
    height,
    bearingFaceHeight
  }
}

/**
 * Generate a ISO Hex from the given specification.
 *
 * @see getNutDimensions
 *
 * @param {Object} spec - specification for construction
 * @param {Number} spec.widthAcrossFlats - width across the flats, i.e. wrench size (WAF)
 * @param {Number} spec.height - total thickness/height of the nut (H)
 * @param {Number} spec.bearingFaceHeight - height of the bottom bearing step (C), may be zero
 * @param {Number} spec.segments=36 - number of segments per full turn
 * @returns {Geom3} hex nut, centered on XYZ
 *
 * @example
 * const spec = getNutDimensions({size: 'M10', isHeavy: true})
 * const nut = generateNut(spec)
 */
export const generateNut = (spec = {}) => {
  let {
    widthAcrossFlats,
    height,
    bearingFaceHeight,
    segments = 36
  } = spec

  // hex nut, beveled, with optional bearing
  const zOffset = 0
  return HexNut(widthAcrossFlats, height, bearingFaceHeight, zOffset, segments)
}
