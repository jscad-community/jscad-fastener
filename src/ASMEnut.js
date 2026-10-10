import { cylinder, cylinderElliptic, subtract, union, centerZ, mirrorZ, translate } from '@jscad/modeling'

import { HexNut } from './nut.js'

/**
 * ASME Nut Generation Module
 */

// Dimensions Offsets
export const WIDTH_ACROSS_FLATS = 0
export const STANDARD_HEIGHT = 1

const MM_PER_INCH = 25.4

/**
 * ASME B18.2.2 Hex Standard Nut (Finished Hex Nut) 
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise decimal inches (in).
 */
export const ASME_B18_2_2_HEX_STANDARD = {
  // Machine Screw Sizes
  "#0":     [0.1563, 0.0469],
  "#1":     [0.1563, 0.0469],
  "#2":     [0.1875, 0.0625],
  "#3":     [0.1875, 0.0625],
  "#4":     [0.2500, 0.0938],
  "#5":     [0.3125, 0.1094],
  "#6":     [0.3125, 0.1094],
  "#8":     [0.3438, 0.1250],
  "#10":    [0.3750, 0.1250],
  "#12":    [0.4375, 0.1563],
  // Fractional Inch Sizes (1/4" to 4")
  "1/4":   [0.4375, 0.2188],
  "5/16":  [0.5000, 0.2656],
  "3/8":   [0.5625, 0.3281],
  "7/16":  [0.6875, 0.3750],
  "1/2":   [0.7500, 0.4375],
  "9/16":  [0.8750, 0.4844],
  "5/8":   [0.9375, 0.5469],
  "3/4":   [1.1250, 0.6406],
  "7/8":   [1.3125, 0.7500],
  "1":     [1.5000, 0.8594],
  "1-1/8": [1.6875, 0.9688],
  "1-1/4": [1.8750, 1.0625],
  "1-3/8": [2.0625, 1.1719],
  "1-1/2": [2.2500, 1.2813],
  "1-3/4": [2.6250, 1.5000],
  "2":     [3.0000, 1.6875],
  "2-1/4": [3.3750, 1.8594],
  "2-1/2": [3.7500, 2.0156],
  "2-3/4": [4.1250, 2.2031],
  "3":     [4.5000, 2.3906],
  "3-1/4": [4.8750, 2.5781],
  "3-1/2": [5.2500, 2.7969],
  "3-3/4": [5.6250, 2.9844],
  "4":     [6.0000, 3.1719]
}

/**
 * ASME B18.2.2 Hex Heavy Nut
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise decimal inches (in).
 */
export const ASME_B18_2_2_HEX_HEAVY = {
  // Fractional Inch Sizes (1/4" to 4")
  "1/4":   [0.5000, 0.2344],
  "5/16":  [0.5625, 0.2969],
  "3/8":   [0.6875, 0.3594],
  "7/16":  [0.7500, 0.4219],
  "1/2":   [0.8750, 0.4844],
  "9/16":  [0.9375, 0.5469],
  "5/8":   [1.0625, 0.6094],
  "3/4":   [1.2500, 0.7344],
  "7/8":   [1.4375, 0.8594],
  "1":     [1.6250, 0.9844],
  "1-1/8": [1.8125, 1.1094],
  "1-1/4": [2.0000, 1.2188],
  "1-3/8": [2.1875, 1.3438],
  "1-1/2": [2.3750, 1.4688],
  "1-3/4": [2.7500, 1.7188],
  "2":     [3.1250, 1.9688],
  "2-1/4": [3.5000, 2.2188],
  "2-1/2": [3.8750, 2.4688],
  "2-3/4": [4.2500, 2.7188],
  "3":     [4.6250, 2.9688],
  "3-1/4": [5.0000, 3.2188],
  "3-1/2": [5.3750, 3.4688],
  "3-3/4": [5.7500, 3.7188],
  "4":     [6.1250, 3.9688]
}

/**
 * ASME B18.2.2 Regular Square Nut
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 * Maintained in precise decimal inches (in).
 */
export const ASME_B18_2_2_SQUARE = {
  // Machine Screw Sizes (Fallback to standard profiles)
  "#0":  [0.1563, 0.0469],
  "#1":  [0.1563, 0.0469],
  "#2":  [0.1875, 0.0625],
  "#3":  [0.1875, 0.0625],
  "#4":  [0.2500, 0.0938],
  "#5":  [0.3125, 0.1094],
  "#6":  [0.3125, 0.1094],
  "#8":  [0.3438, 0.1250],
  "#10": [0.3750, 0.1250],
  "#12": [0.4375, 0.1563],
  // Fractional Inch Sizes (1/4" to 1-1/2")
  "1/4":   [0.4375, 0.2188],
  "5/16":  [0.5625, 0.2656],
  "3/8":   [0.6250, 0.3281],
  "7/16":  [0.7500, 0.3750],
  "1/2":   [0.8125, 0.4375],
  "5/8":   [1.0000, 0.5469],
  "3/4":   [1.1250, 0.6406],
  "7/8":   [1.3125, 0.7500],
  "1":     [1.5000, 0.8594],
  "1-1/8": [1.6875, 0.9688],
  "1-1/4": [1.8750, 1.0625],
  "1-3/8": [2.0625, 1.1719],
  "1-1/2": [2.2500, 1.2813]
}

/**
 * ASME B18.2.2 Thin Jam Nut
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise decimal inches (in).
 */
export const ASME_B18_2_2_HEX_THIN_JAM = {
  // Machine Screw Sizes (Fallback to standard profiles)
  "#0":  [0.1563, 0.0469],
  "#1":  [0.1563, 0.0469],
  "#2":  [0.1875, 0.0625],
  "#3":  [0.1875, 0.0625],
  "#4":  [0.2500, 0.0938],
  "#5":  [0.3125, 0.1094],
  "#6":  [0.3125, 0.1094],
  "#8":  [0.3438, 0.1250],
  "#10": [0.3750, 0.1250],
  "#12": [0.4375, 0.1563],
  // Fractional Inch Sizes (1/4" to 4")
  "1/4":   [0.4375, 0.1563],
  "5/16":  [0.5000, 0.1875],
  "3/8":   [0.5625, 0.2188],
  "7/16":  [0.6875, 0.2500],
  "1/2":   [0.7500, 0.3125],
  "9/16":  [0.8750, 0.3281],
  "5/8":   [0.9375, 0.3750],
  "3/4":   [1.1250, 0.4219],
  "7/8":   [1.3125, 0.4844],
  "1":     [1.5000, 0.5469],
  "1-1/8": [1.6875, 0.6094],
  "1-1/4": [1.8750, 0.6719],
  "1-3/8": [2.0625, 0.7344],
  "1-1/2": [2.2500, 0.7969],
  "1-3/4": [2.6250, 0.9219],
  "2":     [3.0000, 1.0469],
  "2-1/4": [3.3750, 1.1719],
  "2-1/2": [3.7500, 1.2969],
  "2-3/4": [4.1250, 1.4219],
  "3":     [4.5000, 1.5469],
  "3-1/4": [4.8750, 1.6719],
  "3-1/2": [5.2500, 1.7969],
  "3-3/4": [5.6250, 1.9219],
  "4":     [6.0000, 2.0469]
}

/**
 * ASME B18.2.2 Heavy Jam Nut
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise decimal inches (in).
 */
export const ASME_B18_2_2_HEX_HEAVY_JAM = {
  // Machine Screw Sizes (Fallback to standard profile height)
  "#0":     [0.1563, 0.0469],
  "#1":     [0.1563, 0.0469],
  "#2":     [0.1875, 0.0625],
  "#3":     [0.1875, 0.0625],
  "#4":     [0.2500, 0.0938],
  "#5":     [0.3125, 0.1094],
  "#6":     [0.3125, 0.1094],
  "#8":     [0.3438, 0.1250],
  "#10":    [0.3750, 0.1250],
  "#12":    [0.4375, 0.1563],
  // Heavy Hex Jam Nut Sizes (1/4" to 4")
  "1/4":   [0.5000, 0.1719],
  "5/16":  [0.5625, 0.2031],
  "3/8":   [0.6875, 0.2344],
  "7/16":  [0.7500, 0.2656],
  "1/2":   [0.8750, 0.3125],
  "9/16":  [0.9375, 0.3281],
  "5/8":   [1.0625, 0.3750],
  "3/4":   [1.2500, 0.4219],
  "7/8":   [1.4375, 0.4844],
  "1":     [1.6250, 0.5469],
  "1-1/8": [1.8125, 0.6094],
  "1-1/4": [2.0000, 0.6719],
  "1-3/8": [2.1875, 0.7344],
  "1-1/2": [2.3750, 0.7969],
  "1-3/4": [2.7500, 0.9219],
  "2":     [3.1250, 1.0469],
  "2-1/4": [3.5000, 1.1719],
  "2-1/2": [3.8750, 1.2969],
  "2-3/4": [4.2500, 1.4219],
  "3":     [4.6250, 1.5469],
  "3-1/4": [5.0000, 1.6719],
  "3-1/2": [5.3750, 1.7969],
  "3-3/4": [5.7500, 1.9219],
  "4":     [6.1250, 2.0469]
}


// TBD Support square nuts
// Calculate outer corner radius directly for the 4-corner square profile
// const squareOuterRadius = +((widthAcrossFlats * 1.4142) / 2).toFixed(3)
// TBD Support flange nuts

// NOTE: See ASMEspecification.js for parseNutSpec()

/**
 * Get the hex nut dimensions for the given ASME nut specification.
 *
 * @param {Object} spec - specification for construction
 * @param {String} [spec.size] - required, size of ASME nut, see lists above
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

  const standard = 'ASME'

  let dataset

  if (isThin) {
    if (!dataset && isHeavy) dataset = ASME_B18_2_2_HEX_HEAVY_JAM
    if (!dataset) dataset = ASME_B18_2_2_HEX_THIN_JAM
  } else {
    if (!dataset && isHeavy) dataset = ASME_B18_2_2_HEX_HEAVY
    if (!dataset) dataset = ASME_B18_2_2_HEX_STANDARD
  }
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

  if (widthAcrossFlats >= 0.6875) {
    // add a bearing surface to the bottom of large nuts
    bearingFaceHeight = 0.016 // mm
  }

  // convert ASME inch dimensions to millimeter
  widthAcrossFlats = +(widthAcrossFlats * MM_PER_INCH).toFixed(3)
  height = +(height * MM_PER_INCH).toFixed(3)

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
 * Generate a ASME Nut from the given specification.
 *
 * @see getNutDimensions
 *
 * @param {Object} spec - specification for construction
 * @param {Number} spec.widthAcrossFlats - width across the flats, i.e. wrench size (WAF)
 * @param {Number} spec.height - total thickness/height of the nut (H)
 * @param {Number} spec.bearingFaceHeight - height of the bottom washer step (C), may be zero
 * @param {Number} spec.segments=36 - number of segments per full turn
 * @returns {Geom3} hex nut, centered on XYZ
 *
 * @example
 * const spec = getHexNutDimensions({size: 'M10', isHeavy: true})
 * const nut = generateHexNut(spec)
 */
export const generateNut = (spec = {}) => {
  let {
    widthAcrossFlats,
    height,
    bearingFaceHeight,
    segments = 36
  } = spec

  // hex nut, beveled, with optional washer
  const zOffset = 0
  return HexNut(widthAcrossFlats, height, bearingFaceHeight, zOffset, segments)
}
