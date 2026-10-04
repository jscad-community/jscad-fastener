import { cylinder, cylinderElliptic, roundedCylinder, intersect, subtract, union, centerZ, mirrorZ, rotateZ, translate } from '@jscad/modeling'

/**
 * Complete ISO or ASME Fastener Nut Generation Module
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
const ISO_4032_HEX_STANDARD = {
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

/**
 * ASME B18.2.2 Hex Standard Nut (Finished Hex Nut) 
 *
 * Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
 *
 * Maintained in precise decimal Inches (in).
 */
export const ASME_B18_2_2_HEX_STANDARD = {
  // Machine Screw Sizes
  "0":     [0.1563, 0.0469],
  "1":     [0.1563, 0.0469],
  "2":     [0.1875, 0.0625],
  "3":     [0.1875, 0.0625],
  "4":     [0.2500, 0.0938],
  "5":     [0.3125, 0.1094],
  "6":     [0.3125, 0.1094],
  "8":     [0.3438, 0.1250],
  "10":    [0.3750, 0.1250],
  "12":    [0.4375, 0.1563],
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
 * Maintained in precise decimal Inches (in).
 */
const ASME_B18_2_2_HEX_HEAVY = {
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
 * Maintained in precise decimal Inches (in).
 */
export const ASME_B18_2_2_SQUARE = {
  // Machine Screw Sizes (Fallback to standard profiles)
  "0":  [0.1563, 0.0469],
  "1":  [0.1563, 0.0469],
  "2":  [0.1875, 0.0625],
  "3":  [0.1875, 0.0625],
  "4":  [0.2500, 0.0938],
  "5":  [0.3125, 0.1094],
  "6":  [0.3125, 0.1094],
  "8":  [0.3438, 0.1250],
  "10": [0.3750, 0.1250],
  "12": [0.4375, 0.1563],
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
 * Maintained in precise decimal Inches (in).
 */
export const ASME_B18_2_2_HEX_THIN_JAM = {
  // Machine Screw Sizes (Fallback to standard profiles)
  "0":  [0.1563, 0.0469],
  "1":  [0.1563, 0.0469],
  "2":  [0.1875, 0.0625],
  "3":  [0.1875, 0.0625],
  "4":  [0.2500, 0.0938],
  "5":  [0.3125, 0.1094],
  "6":  [0.3125, 0.1094],
  "8":  [0.3438, 0.1250],
  "10": [0.3750, 0.1250],
  "12": [0.4375, 0.1563],
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
 * Maintained in precise decimal Inches (in).
 */
export const ASME_B18_2_2_HEX_HEAVY_JAM = {
  // Machine Screw Sizes (Fallback to standard profile height)
  "0":     [0.1563, 0.0469],
  "1":     [0.1563, 0.0469],
  "2":     [0.1875, 0.0625],
  "3":     [0.1875, 0.0625],
  "4":     [0.2500, 0.0938],
  "5":     [0.3125, 0.1094],
  "6":     [0.3125, 0.1094],
  "8":     [0.3438, 0.1250],
  "10":    [0.3750, 0.1250],
  "12":    [0.4375, 0.1563],
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
// const squareOuterRadius = +((widthAcrossFlats * 1.4142) / 2).toFixed(3);

/**
 * Obtain overall hex nut dimensions for the given specification.
 *
 * @param {Object} specification - specification for construction
 * @param {String} [specification.size] - required, size of ISO / ASME nut, see lists above
 * @param {String} [specification.standard='ISO'] - dimension standard, ISO or ASME
 * @param {Boolean} [specification.isHeavy=false] - generate nuts with heavy dimensions
 * @param {Boolean} [specification.isThin=false] - generate nuts with thin (jam) dimensions
 * @param {Number} [specification.flatOffset=0] - clearance for oversized cutouts
 * @param {Number} [specification.heightOffset=0] - clearance for oversized cutouts
 * @returns {Object} hex nut dimensions; widthAcrossFlats, totalHeight, baseHeight (mm)
 */
export const getHexNutDimensions = (specification = {}) => {
  let {
    size,
    standard = 'ISO',
    isHeavy = false,
    isThin = false,
    flatOffset = 0,
    heightOffset = 0,
  } = specification

  if (!size) return null;

  standard = standard.toUpperCase()

  let dataset

  if (standard === 'ASME') {
    if (isThin) {
      if (!dataset && isHeavy) dataset = ASME_B18_2_2_HEX_HEAVY_JAM
      if (!dataset) dataset = ASME_B18_2_2_HEX_THIN_JAM
    } else {
      if (!dataset && isHeavy) dataset = ASME_B18_2_2_HEX_HEAVY
      if (!dataset) dataset = ASME_B18_2_2_HEX_STANDARD
    }
  }
  if (standard === 'ISO') {
    if (!dataset && isThin) dataset = ISO_4035_HEX_THIN_JAM
    if (!dataset && isHeavy) dataset = ISO_4033_HEX_HIGH_NUTS
    if (!dataset) dataset = ISO_4032_HEX_STANDARD
  }
  if (!dataset) return null

  // get the dimensions for the requested size
  const dim = dataset[size]
  if (!dim) return null

  let widthAcrossFlats = dim[WIDTH_ACROSS_FLATS] + (flatOffset * 2)
  let height = dim[STANDARD_HEIGHT] + (heightOffset * 2)
  let washerFaceHeight = 0
  
  // height prioritization logic sequence
  // let totalHeight = stdH
  // if (isLocknut && dim[LOCK_HEIGHT] !== null) {
  //   totalHeight = dim[LOCK_HEIGHT]
  // } else if (isThin && dim[THIN_HEIGHT] !== null) {
  //   totalHeight = dim[THIN_HEIGHT_INDEX]
  // }

  if (standard === 'ASME') {
    if (widthAcrossFlats >= 0.6875) {
      // add a bearing surface to the bottom of the nut
      washerFaceHeight = 0.016
    }
    widthAcrossFlats = +(widthAcrossFlats * MM_PER_INCH).toFixed(3)
    height = +(height * MM_PER_INCH).toFixed(3)
  }
  if (standard === 'ISO') {
    if (widthAcrossFlats >= 10.00) { // M6
      // add a bearing surface to the bottom of the nut
      washerFaceHeight = 0.400
    }
    if (widthAcrossFlats >= 21.00) { // M14
      // add a bearing surface to the bottom of the nut
      washerFaceHeight = 0.600
    }
    if (widthAcrossFlats >= 60.00) { // M39
      // add a bearing surface to the bottom of the nut
      washerFaceHeight = 0.800
    }
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
    washerFaceHeight
  }
}

/**
 * Generate a double-beveled hex block.
 *
 * @param {number} widthAcrossFlats - Width across the flats, i.e. wrench size (WAF)
 * @param {number} height - Total thickness/height of the nut (H)
 * @param {number} washerFaceHeight - Height of the bottom washer step (C). May be zero.
 * @param {number} zOffset - Z-axis translation offset to position/center the assembly
 * @returns {geom3} - A valid 3D JSCAD V3 solid geometry object.
 */
export const generateBeveledHexNut = (widthAcrossFlats, height, washerFaceHeight, zOffset, segments) => {
  // 1. Structural constants for hex layout
  const HEX_CONSTANT = 1.154700538; // 1 / cos(30 deg)
  const outerRadius = +((widthAcrossFlats * HEX_CONSTANT) / 2).toFixed(3);
  
  const washerFaceDiameter = +(widthAcrossFlats * 0.95).toFixed(3);
  const washerFaceRadius = washerFaceDiameter / 2;

  // 2. Adjust core hex body extrusion height to fit total standard thickness H
  const hexBodyHeight = +(height - washerFaceHeight).toFixed(3);

  // 3. Generate the main hex block body prism using native 6-segment cylinder shortcut
  // Rotate by 30 degrees (Math.PI / 6) to keep flat sides aligned cleanly with coordinate planes
  let hexNutBody = cylinder({
    radius: outerRadius,
    height: hexBodyHeight,
    segments: 6
  });

  // 4. Build the 30-degree top chamfer cutting tool using cylinderElliptic()
  const chamferDepth = +(widthAcrossFlats * 0.12).toFixed(3); 
  const rStartTop = outerRadius * 1.1; // Extra clearance safety buffer
  const rEndTop = widthAcrossFlats / 2; // Cut lands exactly on inner edge of hex flats
  
  let topChamferTool = cylinderElliptic({
    height: chamferDepth,
    startRadius: [rStartTop, rStartTop],
    endRadius: [rEndTop, rEndTop],
    segments
  })
  const chamferBlock = cylinder({radius: rStartTop + 1, height: chamferDepth, segments})
  topChamferTool = subtract(chamferBlock, topChamferTool)

  // Align and subtract the tapered cone tool from the top perimeter of the hex body
  let zoffset = (hexBodyHeight / 2) - (chamferDepth / 2)
  const positionedTopTool = translate([0, 0, zoffset], topChamferTool);
  hexNutBody = subtract(hexNutBody, positionedTopTool);

  // 5. Apply Bottom Surface Treatment
  if (washerFaceHeight > 0) {
    // Add flat bottom washer-face concentric cylinder step
    zoffset = -((hexBodyHeight / 2) + (washerFaceHeight / 2))
    const washerFace = cylinder({
      radius: washerFaceRadius,
      height: washerFaceHeight,
      center: [0, 0, zoffset],
      segments
    })
    hexNutBody = centerZ(union(hexNutBody, washerFace))
  } else {
    const bottomChamferTool = mirrorZ(topChamferTool)
    const positionedBottomTool = translate([0, 0, -zoffset], bottomChamferTool);
    hexNutBody = subtract(hexNutBody, positionedBottomTool)
  }

  // 6. Apply ultimate global structural Z-axis translation offset
  return translate([0, 0, zOffset], hexNutBody);
}

/**
 * Generate a Hex Nut from the given specification.
 *
 * @see getHexNutDimensions
 *
 * @param {Object} spec - specification for construction
 * @param {Number} spec.widthAcrossFlats - width across the flats, i.e. wrench size (WAF)
 * @param {Number} spec.height - total thickness/height of the nut (H)
 * @param {Number} spec.washerFaceHeight - height of the bottom washer step (C), may be zero
 * @param {Number} spec.segments=36 - number of segments per full turn
 * @returns {Geom3} hex nut, centered on XYZ
 *
 * @example
 * const spec = getHexNutDimensions({size: 'M10', isHeavy: true})
 * const nut = generateHexNut(spec)
 */
export const generateHexNut = (spec = {}) => {
  let {
    widthAcrossFlats,
    height,
    washerFaceHeight,
    segments = 36
  } = spec

  // hex nut, beveled, with optional washer
  const zOffset = 0
  return generateBeveledHexNut(widthAcrossFlats, height, washerFaceHeight, zOffset, segments)
}
