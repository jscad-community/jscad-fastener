import { HexNut } from './nut.js'

/*
 * ASME Nut Generation Module
 */

// Dimensions Offsets
const WIDTH_ACROSS_FLATS = 0
const STANDARD_HEIGHT = 1
const TOTAL_HEIGHT = 1

const MM_PER_INCH = 25.4

/**
 * ASME B18.2.2 Hex Standard Nut (Finished Hex Nut) 
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
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
  "1 1/8": [1.6875, 0.9688],
  "1 1/4": [1.8750, 1.0625],
  "1 3/8": [2.0625, 1.1719],
  "1 1/2": [2.2500, 1.2813],
  "1 3/4": [2.6250, 1.5000],
  "2":     [3.0000, 1.6875],
  "2 1/4": [3.3750, 1.8594],
  "2 1/2": [3.7500, 2.0156],
  "2 3/4": [4.1250, 2.2031],
  "3":     [4.5000, 2.3906],
  "3 1/4": [4.8750, 2.5781],
  "3 1/2": [5.2500, 2.7969],
  "3 3/4": [5.6250, 2.9844],
  "4":     [6.0000, 3.1719]
}

/**
 * ASME B18.2.2 Hex Heavy Nut
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
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
  "1 1/8": [1.8125, 1.1094],
  "1 1/4": [2.0000, 1.2188],
  "1 3/8": [2.1875, 1.3438],
  "1 1/2": [2.3750, 1.4688],
  "1 3/4": [2.7500, 1.7188],
  "2":     [3.1250, 1.9688],
  "2 1/4": [3.5000, 2.2188],
  "2 1/2": [3.8750, 2.4688],
  "2 3/4": [4.2500, 2.7188],
  "3":     [4.6250, 2.9688],
  "3 1/4": [5.0000, 3.2188],
  "3 1/2": [5.3750, 3.4688],
  "3 3/4": [5.7500, 3.7188],
  "4":     [6.1250, 3.9688]
}

/**
 * ASME B18.2.2 Regular Square Nut
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
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
  "1 1/8": [1.6875, 0.9688],
  "1 1/4": [1.8750, 1.0625],
  "1 3/8": [2.0625, 1.1719],
  "1 1/2": [2.2500, 1.2813]
}

/**
 * ASME B18.2.2 Thin Jam Nut
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
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
  "1 1/8": [1.6875, 0.6094],
  "1 1/4": [1.8750, 0.6719],
  "1 3/8": [2.0625, 0.7344],
  "1 1/2": [2.2500, 0.7969],
  "1 3/4": [2.6250, 0.9219],
  "2":     [3.0000, 1.0469],
  "2 1/4": [3.3750, 1.1719],
  "2 1/2": [3.7500, 1.2969],
  "2 3/4": [4.1250, 1.4219],
  "3":     [4.5000, 1.5469],
  "3 1/4": [4.8750, 1.6719],
  "3 1/2": [5.2500, 1.7969],
  "3 3/4": [5.6250, 1.9219],
  "4":     [6.0000, 2.0469]
}

/**
 * ASME B18.2.2 Heavy Jam Nut
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
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
  "1 1/8": [1.8125, 0.6094],
  "1 1/4": [2.0000, 0.6719],
  "1 3/8": [2.1875, 0.7344],
  "1 1/2": [2.3750, 0.7969],
  "1 3/4": [2.7500, 0.9219],
  "2":     [3.1250, 1.0469],
  "2 1/4": [3.5000, 1.1719],
  "2 1/2": [3.8750, 1.2969],
  "2 3/4": [4.2500, 1.4219],
  "3":     [4.6250, 1.5469],
  "3 1/4": [5.0000, 1.6719],
  "3 1/2": [5.3750, 1.7969],
  "3 3/4": [5.7500, 1.9219],
  "4":     [6.1250, 2.0469]
}

/**
 * ASME B18.2.6 Heavy Hex Nuts
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_2_6_HEX_STRUCTURAL = {
  "1/2":   [0.8750, 0.3125],
  "5/8":   [1.0625, 0.3906],
  "3/4":   [1.2500, 0.4688],
  "7/8":   [1.4375, 0.5312],
  "1":     [1.6250, 0.6094],
  "1 1/8": [1.8125, 0.6875],
  "1 1/4": [2.0000, 0.7812],
  "1 3/8": [2.1875, 0.8438],
  "1 1/2": [2.3750, 0.9375]
}

/**
 * ASME B18.16.6 Style NE Standard Nylon-Insert Lock Nuts
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_16_6_HEX_LOCK_STANDARD = {
  // Machine Screw Sizes (Style NM)
  "#2":     [0.2500, 0.063, 0.121],
  "#4":     [0.2500, 0.063, 0.121],
  "#6":     [0.3125, 0.111, 0.188],
  "#8":     [0.3438, 0.142, 0.250],
  "#10":    [0.3750, 0.142, 0.250],
  "#12":    [0.4375, 0.160, 0.328],
  // Fractional Inch Sizes (Style NE)
  "1/4":    [0.4375, 0.225, 0.328],
  "5/16":   [0.5000, 0.250, 0.359],
  "3/8":    [0.5625, 0.335, 0.468],
  "7/16":   [0.6250, 0.360, 0.468],
  "1/2":    [0.7500, 0.453, 0.609],
  "9/16":   [0.8750, 0.484, 0.656],
  "5/8":    [0.9375, 0.578, 0.766],
  "3/4":    [1.1250, 0.641, 0.891],
  "7/8":    [1.3125, 0.734, 0.984],
  "1":      [1.5000, 0.812, 1.078],
  "1 1/8":  [1.6875, 1.016, 1.328],
  "1 1/4":  [1.8750, 1.094, 1.422],
  "1 3/8":  [2.0625, 1.250, 1.609],
  "1 1/2":  [2.2500, 1.375, 1.766]
}

/**
 * ASME B18.16.6 Style NE Thin Nylon-Insert Lock Nuts
 *
 * Entries: ASME size: [widthAcrossFlats (W), height (H)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_16_6_HEX_LOCK_THIN = {
  // Machine Screw Sizes (Style NTM)
  "#2":     [0.2500, 0.050, 0.125],
  "#4":     [0.2500, 0.050, 0.125],
  "#6":     [0.3125, 0.060, 0.140],
  "#8":     [0.3438, 0.090, 0.172],
  "#10":    [0.3750, 0.110, 0.187],
  "#12":    [0.4375, 0.140, 0.218],
  // Fractional Inch Sizes (Style NTE)
  "1/4":    [0.4390, 0.125, 0.218],
  "5/16":   [0.5020, 0.158, 0.265],
  "3/8":    [0.5640, 0.150, 0.281],
  "7/16":   [0.6270, 0.225, 0.328],
  "1/2":    [0.7520, 0.190, 0.328],
  "9/16":   [0.8770, 0.225, 0.374],
  "5/8":    [0.9400, 0.265, 0.406],
  "3/4":    [1.0640, 0.288, 0.421],
  "7/8":    [1.2520, 0.340, 0.484],
  "1":      [1.4400, 0.405, 0.578],
  "1 1/8":  [1.6250, 0.450, 0.656],
  "1 1/4":  [1.8125, 0.510, 0.718],
  "1 3/8":  [2.0000, 0.550, 0.812],
  "1 1/2":  [2.1875, 0.600, 0.875]
}

// TBD Support square nuts
// TBD Support flange nuts

const standards = {
  'ASME_B18_2_2_NORMAL': ASME_B18_2_2_HEX_STANDARD,
  'ASME_B18_2_2_HEAVY': ASME_B18_2_2_HEX_HEAVY,
  'ASME_B18_2_2_JAM': ASME_B18_2_2_HEX_THIN_JAM,
  'ASME_B18_2_2_HEAVY_JAM': ASME_B18_2_2_HEX_HEAVY_JAM,
  'ASME_B18_2_6_STRUCTURAL': ASME_B18_2_6_HEX_STRUCTURAL,
  'ASME_B18_16_6_LOCK_STANDARD': ASME_B18_16_6_HEX_LOCK_STANDARD,
  'ASME_B18_16_6_LOCK_THIN': ASME_B18_16_6_HEX_LOCK_THIN
}

/*
 * Calculates bearing face boundaries for ASME B18.2.6 Heavy Hex Structural Nuts.
 * @param {number} nominalWaf - The nominal Width Across Flats (inches) from your profile database.
 * @returns {Object} Calculated bearing face parameters (diameters and structural feature thickness).
 */
const calculateStructuralBearingFace = (nominalWaf) => {
  // Heavy hex profiles typically have a max/min WAF variance of roughly ~2%
  const approximateMinWaf = nominalWaf * 0.98
  const approximateMaxWaf = nominalWaf * 1.01

  return {
    // Standard rule: Min bearing diameter is 95% of the minimum WAF
    minBearingDiameter: Number((approximateMinWaf * 0.95).toFixed(4)),
    
    // Standard rule: Max bearing diameter equals the maximum WAF boundary
    maxBearingDiameter: Number(approximateMaxWaf.toFixed(4)),
    
    // Feature Thickness Rule: B18.2.6 structural nuts feature a minor raised washer 
    // face projection profile intended to sit within these boundaries.
    bearingFaceThicknessMin: 0.015,
    bearingFaceThicknessMax: 0.035
  }
}

/*
 * Calculates bearing face boundaries for ASME B18.16.6 Prevailing Torque Lock Nuts.
 * @param {number} nominalWaf - The nominal Width Across Flats (inches) from your profile database.
 * @returns {Object} Calculated bearing face parameters (diameters and max permissible runout limits).
 */
const calculateLockNutBearingFace = (nominalWaf) => {
  // Lock nut profiles typically feature a tight max/min manufacturing envelope
  const approximateMinWaf = nominalWaf * 0.985
  const approximateMaxWaf = nominalWaf * 1.005

  // Max permissible runout (Full Indicator Movement) limits scale linearly with size
  let maxRunoutFim = 0.015 
  if (nominalWaf > 1.0) maxRunoutFim = 0.025
  if (nominalWaf > 1.5) maxRunoutFim = 0.034

  return {
    // Standard rule: Min bearing circle matches 95% of minimum WAF 
    minBearingDiameter: Number((approximateMinWaf * 0.95).toFixed(4)),
    
    // Standard rule: Max bearing circle matches maximum envelope WAF
    maxBearingDiameter: Number(approximateMaxWaf.toFixed(4)),
    
    // Perpendicularity Tolerance limit relative to internal thread axis
    maxTotalRunoutFim: maxRunoutFim
  }
}

/**
 * Get the hex nut dimensions for the given ASME nut specification.
 *
 * @see parseNutSpec() for parsing of ASME callout specifications
 *
 * NOTE: All dimensions are inches.
 *
 * @memberof jscad-fastener/asme
 * @param {Object} spec - specification for construction
 * @param {String} spec.size - required, size of ASME nut, see lists above
 * @param {String} [spec.standard=null] - ASME standard or none (use other specs to choose)
 * @param {String} [spec.type='STANDARD'] - type of nut; THIN, JAM, HEAVY, STANDARD
 * @param {Number} [spec.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.heightOffset=0] - clearance for oversized cutouts
 * @returns {Object} full ASME nut specification with dimensions
 *
 * @example
 * const dims = getNutDimensions({size: "1/2"})
 * const dims = getNutDimensions({size: "1/2", type: 'jam'})
 * const dims = getNutDimensions({size: "1 1/2", standard: 'ASME_B18_2_6_STRUCTURAL'})
 */
export const getNutDimensions = (spec) => {
  let {
    size,
    standard = null,
    type = 'STANDARD',
    flatOffset = 0,
    heightOffset = 0,
  } = spec

  if (!size) return null

  size = size.replace(/-/g, ' ').trim()

  type = type.toUpperCase().trim()

  // select the standard using the given options
  if (!standard) {
    if (type === 'THIN' || type === 'JAM') {
      standard = 'ASME_B18_2_2_JAM'
    } else if (type === 'HEAVY') {
      standard = 'ASME_B18_2_2_HEAVY'
    } else if (type === 'STRUCTURAL') {
      standard = 'ASME_B18_2_6_STRUCTURAL'
    } else {
      type = 'STANDARD'
      standard = 'ASME_B18_2_2_NORMAL'
    }
  }

  let dataset = standards[standard]
  if (!dataset) return null

  // get the dimensions for the requested size
  const dim = dataset[size]
  if (!dim) return null

  let widthAcrossFlats = dim[WIDTH_ACROSS_FLATS] + (flatOffset * 2)
  let height = dim[STANDARD_HEIGHT] + (heightOffset * 2)
  
  // TODO support lock nuts
  // height prioritization logic sequence
  // let totalHeight = stdH
  // if (isLocknut && dim[LOCK_HEIGHT] !== null) {
  //   totalHeight = dim[LOCK_HEIGHT]
  // } else if (isThin && dim[THIN_HEIGHT] !== null) {
  //   totalHeight = dim[THIN_HEIGHT_INDEX]
  // }

  let bearingFaceHeight = 0
  if (standard === 'ASME_B18_2_6_STRUCTURAL') {
    // apply a bearing surface
    const t = calculateStructuralBearingFace(widthAcrossFlats)
    bearingFaceHeight = t.bearingFaceThicknessMin
  } else if (standard === 'ASME_B18_2_2_HEAVY' && widthAcrossFlats >= 0.6875) {
    // add a bearing surface to the bottom of large nuts
    bearingFaceHeight = 0.00063 // inch
  }

  return {
    // spec
    size,
    standard,
    type,
    // dimensions
    widthAcrossFlats,
    height,
    bearingFaceHeight
  }
}

/**
 * Generate a ASME Nut from the given specification.
 *
 * @see getNutDimensions() for obtaining correct dimensions
 *
 * NOTE: All dimensions are inches.
 *
 * @memberof jscad-fastener/asme
 * @param {Object} spec - full nut specification with dimensions
 * @param {String} spec.type - type of nut; THIN, HEAVY, STANDARD
 * @param {Number} spec.widthAcrossFlats - width across the flats, i.e. wrench size (WAF)
 * @param {Number} spec.height - total thickness/height of the nut (H)
 * @param {Number} spec.bearingFaceHeight - height of the bottom washer step (C), may be zero
 * @param {Number} [spec.segments=18] - number of segments per full turn
 * @returns {Geom3} hex nut, centered on XYZ
 *
 * @example
 * const spec = getNutDimensions({size: '1-1/4', type: 'HEAVY'})
 * const nut = generateNut(spec)
 */
export const generateNut = (spec) => {
  let {
    type,
    widthAcrossFlats,
    height,
    bearingFaceHeight,
    zOffset = 0,
    segments = 18
  } = spec

  // convert ASME inch dimensions to millimeter
  widthAcrossFlats = +(widthAcrossFlats * MM_PER_INCH).toFixed(3)
  height = +(height * MM_PER_INCH).toFixed(3)
  bearingFaceHeight = +(bearingFaceHeight * MM_PER_INCH).toFixed(3)

  // FIXME this should be a parameter
  const bearingFaceDiameter = +(widthAcrossFlats * 0.95).toFixed(3)

  // hex nut, beveled, with optional bearing face
  return HexNut({ widthAcrossFlats, height, bearingFaceHeight, bearingFaceDiameter, zOffset, segments })
}
