import { HexNut } from './nut.js'

/*
 * ISO Nut Generation Module
 */

// Dimensions Offsets
const WIDTH_ACROSS_FLATS = 0
const STANDARD_HEIGHT = 1
const TOTAL_HEIGHT = 2

/**
 * ISO 4032 Hex Standard Nuts
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7040_LOCK_STANDARD = {
  // Pattern: [Width Across Flats (s), Hex Height (m_min), Total Height (h_max)]
  "M3":  [5.5,  2.15, 4.0],
  "M4":  [7.0,  2.90, 5.0],
  "M5":  [8.0,  4.40, 6.3],
  "M6":  [10.0, 4.90, 8.0],
  "M8":  [13.0, 6.44, 9.5],
  "M10": [16.0, 8.04, 11.5],
  "M12": [18.0, 10.37, 14.0],
  "M14": [21.0, 12.10, 16.0],
  "M16": [24.0, 14.10, 18.0],
  "M20": [30.0, 16.90, 22.0],
  "M24": [36.0, 20.20, 28.0],
  "M30": [46.0, 24.30, 34.0],
  "M36": [55.0, 29.40, 42.0],
  "M39": [60.0, 31.80, 45.0]
}

/**
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_10511_LOCK_THIN = {
  // Pattern: [Width Across Flats (s), Hex Height (m_min), Total Height (h_max)]
  "M3":   [5.5,  1.55, 4.0],
  "M4":   [7.0,  1.95, 5.0],
  "M5":   [8.0,  2.45, 5.0],
  "M6":   [10.0, 2.90, 6.0],
  "M8":   [13.0, 3.70, 8.0],
  "M10":  [16.0, 4.70, 10.0], // Note: A/F width shifts from 17mm to 16mm per standard ISO sizing
  "M12":  [18.0, 5.70, 12.0], // Note: A/F width shifts from 19mm to 18mm per standard ISO sizing
  "M14":  [21.0, 7.42, 14.0],
  "M16":  [24.0, 9.10, 16.0],
  "M20":  [30.0, 10.90, 20.0],
  "M24":  [36.0, 13.90, 24.0],
  "M30":  [46.0, 16.90, 30.0],
  "M36":  [55.0, 21.30, 36.0],
  "M39":  [60.0, 23.30, 39.0]
}

/**
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7041_LOCK_HIGH = {
  // Pattern: [Width Across Flats (s), Hex Height (m_min), Total Height (h_max)]
  "M5":   [8,    4.4,   6.3],
  "M6":   [10,   4.9,   8.0],
  "M8":   [13,   6.44,  9.5],
  "M10":  [16,   8.04,  12.1], // Standard ISO 16mm width across flats
  "M12":  [18,   10.37, 15.1], // Standard ISO 18mm width across flats
  "M14":  [21,   12.1,  16.9],
  "M16":  [24,   14.1,  19.1],
  "M20":  [30,   16.9,  24.8],
  "M24":  [36,   20.2,  29.6],
  "M30":  [46,   25.0,  37.1],
  "M36":  [55,   29.4,  44.7],
  "M39":  [60,   31.8,  48.2]
}

/**
 * DIN 557 Square Standard Nut
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise millimeters (mm).
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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

const standards = {
  'ISO_4032_NORMAL': ISO_4032_HEX_STANDARD,
  'ISO_4033_HIGH': ISO_4033_HEX_HIGH_NUTS,
  'ISO_4035_HEX_THIN_JAM': ISO_4035_HEX_THIN_JAM,
  'ISO_7414_HEX_STRUCTURAL_HEAVY': ISO_7414_HEX_STRUCTURAL_HEAVY,
  'ISO_7040_LOCK_STANDARD': ISO_7040_LOCK_STANDARD,
  'ISO_10511_LOCK_THIN': ISO_10511_LOCK_THIN,
  'ISO_7041_LOCK_HIGH': ISO_7041_LOCK_HIGH,
}

/**
 * Get the hex nut dimensions for the given ISO specification.
 *
 * @memberof jscad-fastener/iso
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
    standard = null,
    isHeavy = false,
    isThin = false,
    flatOffset = 0,
    heightOffset = 0,
  } = spec

  if (!size) return null

  standard = standard ? standard : 'ISO'

  let dataset = standards[standard]

  // select ISO standard using the given options
  if (!dataset) {
    if (!dataset && isThin) dataset = ISO_4035_HEX_THIN_JAM
    if (!dataset && isHeavy) dataset = ISO_4033_HEX_HIGH_NUTS
    if (!dataset) dataset = ISO_4032_HEX_STANDARD
  }
  if (!dataset) return null

  // get the dimensions for the requested size
  const dim = dataset[size]
  if (!dim) return null

  const widthAcrossFlats = dim[WIDTH_ACROSS_FLATS] + (flatOffset * 2)
  const height = dim[STANDARD_HEIGHT] + (heightOffset * 2)
  
  // height prioritization logic sequence
  // let totalHeight = stdH
  // if (isLocknut && dim[LOCK_HEIGHT] !== null) {
  //   totalHeight = dim[LOCK_HEIGHT]
  // } else if (isThin && dim[THIN_HEIGHT] !== null) {
  //   totalHeight = dim[THIN_HEIGHT_INDEX]
  // }

  let bearingFaceHeight = 0
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
 * @memberof jscad-fastener/iso
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
  const {
    widthAcrossFlats,
    height,
    bearingFaceHeight,
    zOffset = 0,
    segments = 36
  } = spec

  // TODO add support for lock nuts
  // hex nut, beveled, with optional bearing
  return HexNut({widthAcrossFlats, height, bearingFaceHeight, zOffset, segments})
}
