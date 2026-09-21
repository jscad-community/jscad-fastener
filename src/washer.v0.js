/**
 * Fastener Washer Generation Module for JSCAD V3
 * Output: Solid Washer Manifolds perfectly centered at origin (Z = 0)
 * Array Mapping per sizing key: [ insideDiameter, standardOD, standardThickness, heavyOD, heavyThickness ]
 */

import { cylinderElliptic, subtract } from '@jscad/modeling'

// Parameter Layout Index Offsets
export const ID_INDEX = 0;      // Inner Diameter
export const OD_INDEX = 1;      // Outer Diameter
export const TH_INDEX = 2;      // Thickness

const MM_PER_INCH = 25.4;

/**
 * ISO 7089 - Plain washers — Normal series — Product grade A
 *
 * Replaces DIN 125 A
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * Dimensions: Normal series. Outer diameter is roughly 2× the nominal thread size
 */
export const ISO7089 = {
  "M1": [1.1, 3.0, 0.3],
  "M1.2": [1.3, 3.5, 0.3],
  "M1.4": [1.5, 4.0, 0.3],
  "M1.6": [1.7, 4.0, 0.3],
  "M2": [2.2, 5.0, 0.3],
  "M2.5": [2.7, 6.0, 0.5],
  "M3": [3.2, 7.0, 0.5],
  "M3.5": [3.7, 8.0, 0.5],
  "M4": [4.3, 9.0, 0.8],
  "M5": [5.3, 10.0, 1.0],
  "M6": [6.4, 12.0, 1.6],
  "M7": [7.4, 14.0, 1.6],
  "M8": [8.4, 16.0, 1.6],
  "M10": [10.5, 20.0, 2.0],
  "M12": [13.0, 24.0, 2.5],
  "M14": [15.0, 28.0, 2.5],
  "M16": [17.0, 30.0, 3.0],
  "M18": [19.0, 34.0, 3.0],
  "M20": [21.0, 37.0, 3.0],
  "M22": [23.0, 39.0, 3.0],
  "M24": [25.0, 44.0, 4.0],
  "M27": [28.0, 50.0, 4.0],
  "M30": [31.0, 56.0, 4.0],
  "M33": [34.0, 60.0, 5.0],
  "M36": [37.0, 66.0, 5.0],
  "M39": [40.0, 72.0, 6.0],
  "M42": [43.0, 78.0, 7.0],
  "M45": [46.0, 85.0, 7.0],
  "M48": [50.0, 92.0, 8.0],
  "M52": [54.0, 98.0, 8.0],
  "M56": [58.0, 105.0, 9.0],
  "M60": [62.0, 110.0, 9.0],
  "M64": [66.0, 115.0, 9.0],
  "M68": [70.0, 120.0, 10.0],
  "M72": [74.0, 125.0, 10.0],
  "M76": [78.0, 135.0, 10.0],
  "M80": [82.0, 140.0, 12.0],
  "M85": [87.0, 145.0, 12.0],
  "M90": [93.0, 160.0, 12.0],
  "M95": [98.0, 165.0, 12.0],
  "M100": [104.0, 175.0, 14.0]
}

/**
 * ISO 7090 - Plain washers with chamfer — Normal series — Product grade A
 *
 * Replaces DIN 125 B
 *
 * Profile Geometry: Chamfered (beveled/sloped) outer edge
 *
 * Dimensions: Normal series. (Outer diameter ≈ 2× nominal thread size)
 */
export const ISO7090 = ISO7089

/**
 * ISO 7091 - Plain washers — Normal series — Product grade C
 *
 * Replaces DIN 126
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * Dimensions: Normal series. The outer diameter matches ISO 7089/7090,
 * but the inner diameter is punched significantly looser (larger tolerances) to accommodate lower-grade fasteners.
 */
const ISO7091 = {
  "M1": [1.2, 3.0, 0.3],
  "M1.2": [1.4, 3.5, 0.3],
  "M1.4": [1.6, 4.0, 0.3],
  "M1.6": [1.8, 4.0, 0.3],
  "M2": [2.4, 5.0, 0.3],
  "M2.5": [2.9, 6.0, 0.5],
  "M3": [3.4, 7.0, 0.5],
  "M3.5": [3.9, 8.0, 0.5],
  "M4": [4.5, 9.0, 0.8],
  "M5": [5.5, 10.0, 1.0],
  "M6": [6.6, 12.0, 1.6],
  "M7": [7.6, 14.0, 1.6],
  "M8": [9.0, 16.0, 1.6],
  "M10": [11.0, 20.0, 2.0],
  "M12": [13.5, 24.0, 2.5],
  "M14": [15.5, 28.0, 2.5],
  "M16": [17.5, 30.0, 3.0],
  "M18": [20.0, 34.0, 3.0],
  "M20": [22.0, 37.0, 3.0],
  "M22": [24.0, 39.0, 3.0],
  "M24": [26.0, 44.0, 4.0],
  "M27": [30.0, 50.0, 4.0],
  "M30": [33.0, 56.0, 4.0],
  "M33": [36.0, 60.0, 5.0],
  "M36": [39.0, 66.0, 5.0],
  "M39": [42.0, 72.0, 6.0],
  "M42": [45.0, 78.0, 7.0],
  "M45": [48.0, 85.0, 7.0],
  "M48": [52.0, 92.0, 8.0],
  "M52": [56.0, 98.0, 8.0],
  "M56": [62.0, 105.0, 9.0],
  "M60": [66.0, 110.0, 9.0],
  "M64": [70.0, 115.0, 9.0],
  "M68": [74.0, 120.0, 10.0],
  "M72": [78.0, 125.0, 10.0],
  "M76": [82.0, 135.0, 10.0],
  "M80": [86.0, 140.0, 12.0],
  "M85": [91.0, 145.0, 12.0],
  "M90": [96.0, 160.0, 12.0],
  "M95": [101.0, 165.0, 12.0],
  "M100": [107.0, 175.0, 14.0]
}

/**
 * ISO 7092 - Plain washers — Small series — Product grade A
 *
 * Replaces DIN 433
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * Dimensions: Small series. The outer diameter is tightly constrained, roughly 1.5× to 1.8× the thread size
 */
const ISO7092 = {
  "M1": [1.1, 2.5, 0.3],
  "M1.2": [1.3, 2.8, 0.3],
  "M1.4": [1.5, 3.0, 0.3],
  "M1.6": [1.7, 3.5, 0.3],
  "M2": [2.2, 4.5, 0.3],
  "M2.5": [2.7, 5.0, 0.5],
  "M3": [3.2, 6.0, 0.5],
  "M3.5": [3.7, 7.0, 0.5],
  "M4": [4.3, 8.0, 0.5],
  "M5": [5.3, 9.0, 1.0],
  "M6": [6.4, 11.0, 1.6],
  "M7": [7.4, 12.0, 1.6],
  "M8": [8.4, 15.0, 1.6],
  "M10": [10.5, 18.0, 1.6],
  "M12": [13.0, 20.0, 2.0],
  "M14": [15.0, 24.0, 2.5],
  "M16": [17.0, 28.0, 2.5],
  "M18": [19.0, 30.0, 2.5],
  "M20": [21.0, 34.0, 3.0],
  "M22": [23.0, 37.0, 3.0],
  "M24": [25.0, 39.0, 3.0],
  "M27": [28.0, 44.0, 4.0],
  "M30": [31.0, 50.0, 4.0],
  "M33": [34.0, 56.0, 4.0],
  "M36": [37.0, 60.0, 5.0],
  "M39": [40.0, 66.0, 5.0],
  "M42": [43.0, 72.0, 6.0],
  "M45": [46.0, 78.0, 7.0],
  "M48": [50.0, 85.0, 7.0],
  "M52": [54.0, 92.0, 8.0],
  "M56": [58.0, 98.0, 8.0],
  "M60": [62.0, 105.0, 9.0],
  "M64": [66.0, 110.0, 9.0],
  "M68": [70.0, 115.0, 9.0],
  "M72": [74.0, 120.0, 10.0],
  "M76": [78.0, 125.0, 10.0],
  "M80": [82.0, 135.0, 10.0],
  "M85": [87.0, 140.0, 12.0],
  "M90": [93.0, 145.0, 12.0],
  "M95": [98.0, 160.0, 12.0],
  "M100": [104.0, 165.0, 12.0]
}

/**
 * ISO 7093 - Plain washers — Large series — Product grade A and C
 *
 * Replaces DIN 9021
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * Dimensions: Large series. The outer diameter is dramatically enlarged, roughly 3× the nominal thread size
 */
const ISO7093 = {
  "M2.5": [2.7, 8.0, 0.8],
  "M3": [3.2, 9.0, 0.8],
  "M3.5": [3.7, 11.0, 0.8],
  "M4": [4.3, 12.0, 1.0],
  "M5": [5.3, 15.0, 1.0],
  "M6": [6.4, 18.0, 1.6],
  "M7": [7.4, 22.0, 2.0],
  "M8": [8.4, 24.0, 2.0],
  "M10": [10.5, 30.0, 2.5],
  "M12": [13.0, 37.0, 3.0],
  "M14": [15.0, 44.0, 3.0],
  "M16": [17.0, 50.0, 3.0],
  "M18": [19.0, 56.0, 4.0],
  "M20": [21.0, 60.0, 4.0],
  "M22": [23.0, 66.0, 5.0],
  "M24": [25.0, 72.0, 5.0],
  "M27": [28.0, 85.0, 6.0],
  "M30": [33.0, 92.0, 6.0],
  "M33": [36.0, 105.0, 6.0],
  "M36": [39.0, 110.0, 8.0],
  "M39": [42.0, 125.0, 8.0],
  "M42": [45.0, 135.0, 8.0],
  "M45": [48.0, 145.0, 8.0],
  "M48": [52.0, 160.0, 10.0],
  "M52": [56.0, 175.0, 10.0],
  "M56": [62.0, 190.0, 10.0],
  "M60": [66.0, 200.0, 10.0],
  "M64": [70.0, 220.0, 12.0],
  "M68": [74.0, 235.0, 12.0],
  "M72": [78.0, 250.0, 12.0],
  "M76": [82.0, 260.0, 12.0],
  "M80": [86.0, 275.0, 14.0],
  "M85": [91.0, 290.0, 14.0],
  "M90": [96.0, 310.0, 14.0],
  "M95": [101.0, 325.0, 14.0],
  "M100": [106.0, 345.0, 16.0]
}

/**
 * ASME B18.21.1 is now a combined standard, it contains several different dimensions depending on the washer type.
 *
 * ASME B18.21.1 Type A (Narrow / SAE)
 *
 * NOTE: Dimensions are in inches
 */
const ASMEB18211Narrow = {
  // Machine Screw Sizes (#0 to #12)
  "#0": [0.078, 0.188, 0.020],
  "#2": [0.094, 0.250, 0.020],
  "#4": [0.125, 0.312, 0.032],
  "#6": [0.156, 0.375, 0.049],
  "#8": [0.188, 0.438, 0.049],
  "#10": [0.219, 0.500, 0.049],
  "#12": [0.250, 0.562, 0.065],

  // Fractional Bolt Sizes (1/4" to 4")
  "1/4": [0.281, 0.625, 0.065],
  "5/16": [0.344, 0.688, 0.065],
  "3/8": [0.406, 0.812, 0.065],
  "7/16": [0.469, 0.922, 0.065],
  "1/2": [0.531, 1.062, 0.095],
  "9/16": [0.594, 1.156, 0.095],
  "5/8": [0.656, 1.312, 0.095],
  "3/4": [0.812, 1.469, 0.134],
  "7/8": [0.938, 1.750, 0.134],
  "1": [1.062, 2.000, 0.134],
  "1 1/8": [1.250, 2.250, 0.134],
  "1 1/4": [1.375, 2.500, 0.165],
  "1 3/8": [1.500, 2.750, 0.165],
  "1 1/2": [1.625, 3.000, 0.165],
  "1 3/4": [1.875, 3.375, 0.180],
  "2": [2.125, 3.750, 0.180],
  "2 1/4": [2.375, 4.125, 0.220],
  "2 1/2": [2.625, 4.500, 0.220],
  "2 3/4": [2.875, 4.875, 0.220],
  "3": [3.125, 5.250, 0.250],
  "3 1/4": [3.375, 5.500, 0.250],
  "3 1/2": [3.625, 5.750, 0.250],
  "3 3/4": [3.875, 6.000, 0.250],
  "4": [4.250, 8.500, 0.313]
}

/**
 * ASME B18.21.1 is now a combined standard, it contains several different dimensions depending on the washer type.
 *
 * ASME B18.21.1 Type B (Wide / USS)
 *
 * NOTE: Dimensions are in inches
 */
const ASMEB18211Wide = {
  // Machine Screw Sizes (#0 to #12)
  "#0": [0.068, 0.250, 0.025],
  "#1": [0.084, 0.281, 0.032],
  "#2": [0.094, 0.344, 0.032],
  "#3": [0.117, 0.414, 0.040],
  "#4": [0.133, 0.446, 0.040],
  "#5": [0.149, 0.508, 0.040],
  "#6": [0.164, 0.570, 0.040],
  "#8": [0.196, 0.640, 0.063],
  "#10": [0.211, 0.749, 0.063],
  "#12": [0.242, 0.890, 0.063],

  // Fractional Bolt Sizes (1/4" to 4")
  "1/4": [0.296, 1.015, 0.063],
  "5/16": [0.359, 1.140, 0.063],
  "3/8": [0.421, 1.280, 0.100],
  "7/16": [0.484, 1.499, 0.100],
  "1/2": [0.546, 1.780, 0.100],
  "9/16": [0.609, 2.030, 0.100],
  "5/8": [0.686, 2.280, 0.160],
  "3/4": [0.842, 2.530, 0.160],
  "7/8": [0.968, 2.780, 0.160],
  "1": [1.094, 3.030, 0.160],
  "1 1/8": [1.219, 3.280, 0.160],
  "1 1/4": [1.344, 3.530, 0.160],
  "1 3/8": [1.469, 3.780, 0.160],
  "1 1/2": [1.594, 4.030, 0.160],
  "1 3/4": [1.875, 4.500, 0.250],
  "2": [2.125, 5.000, 0.250],
  "2 1/4": [2.375, 5.500, 0.250],
  "2 1/2": [2.625, 6.000, 0.250],
  "2 3/4": [2.875, 6.500, 0.250],
  "3": [3.125, 7.000, 0.250],
  "3 1/4": [3.375, 7.500, 0.250],
  "3 1/2": [3.625, 8.000, 0.250],
  "3 3/4": [3.875, 8.500, 0.250],
  "4": [4.250, 9.500, 0.375]
}

/**
 * ASTM F436 - Standard Specification for Hardened Steel Washers
 *
 * Profile Geometry: Chamfered outer edge angled between 35° and 45° on at least one face
 *
 * Dimensions: Structural series. The inner diameter is sized to clear high-strength bolt shanks,
 * while the outer diameter and heavy thickness are scaled to match heavy structural bolt heads.
 *
 * NOTE: Dimensions are in inches
 */
const ASTMF436 = {
  "1/4": [0.281, 0.625, 0.051],
  "5/16": [0.344, 0.688, 0.051],
  "3/8": [0.406, 0.812, 0.051],
  "7/16": [0.469, 0.922, 0.051],
  "1/2": [0.531, 1.062, 0.097],
  "9/16": [0.594, 1.188, 0.110],
  "5/8": [0.688, 1.312, 0.122],
  "3/4": [0.813, 1.469, 0.122],
  "7/8": [0.938, 1.750, 0.136],
  "1": [1.125, 2.000, 0.136],
  "1 1/8": [1.250, 2.250, 0.136],
  "1 1/4": [1.375, 2.500, 0.136],
  "1 3/8": [1.500, 2.750, 0.136],
  "1 1/2": [1.625, 3.000, 0.136],
  "1 3/4": [1.875, 3.375, 0.178],
  "2": [2.125, 3.750, 0.178],
  "2 1/4": [2.375, 4.000, 0.240],
  "2 1/2": [2.625, 4.500, 0.240],
  "2 3/4": [2.875, 5.000, 0.240],
  "3": [3.125, 5.500, 0.240],
  "3 1/4": [3.375, 6.000, 0.240],
  "3 1/2": [3.625, 6.500, 0.240],
  "3 3/4": [3.875, 7.000, 0.280],
  "4": [4.250, 8.500, 0.313]
}

/**
 * Resolves washer parameters into absolute millimeter tracking fields.
 * Expects a flat layout options structure.
 */
export function getWasherDimensions(options = {}) {
  const {
    size,
    standard = 'ISO',
    isHeavy = false,
    idOffset = 0,
    odOffset = 0,
    thicknessOffset = 0
  } = options;

  if (!size) return null;

  const isUts = standard.toUpperCase() === 'UTS';
  const dataset = isUts ? utsWashers : isoWashers;
  const matrix = dataset[size];

  if (!matrix) return null;

  // Track correct column indices based on grade selection
  const odIndex = isHeavy ? HEAVY_OD_INDEX : STD_OD_INDEX;
  const thickIndex = isHeavy ? HEAVY_THICK_INDEX : STD_THICK_INDEX;

  let innerDia = matrix[ID_INDEX];
  let outerDia = matrix[odIndex];
  let thickness = matrix[thickIndex];

  // Inline imperial parsing scaling
  if (isUts) {
    innerDia = innerDia * MM_PER_INCH;
    outerDia = outerDia * MM_PER_INCH;
    thickness = thickness * MM_PER_INCH;
  }

  return {
    innerRadius: (innerDia + idOffset) / 2,
    outerRadius: (outerDia + odOffset) / 2,
    thickness: thickness + thicknessOffset
  };
}

/**
 * JSCAD V3 Washer Geometry Generator
 * Outputs a solid washer manifold centered perfectly on Z = 0
 * 
 * @param {object} options - Flat geometry property config block
 * @param {string} options.size - e.g. "M6" or "1/4"
 * @param {string} options.standard - 'ISO' or 'UTS'
 * @param {boolean} options.isHeavy - True switches to larger series
 * @param {number} options.idOffset - Clearance modifier added to inner diameter hole path
 * @param {number} options.odOffset - Clearance modifier added to outer bounding diameter 
 * @param {number} options.thicknessOffset - Clearance modifier added to height thickness
 */
export function generateWasherGeometry(options = {}) {
  const dim = getWasherDimensions(options);
  if (!dim) throw new Error(`Size metadata lookup failed for option sequence.`);

  // Outer solid disk bounds centered on origin [0,0,0]
  const outerDisk = cylinderElliptic({
    startRadius: [dim.outerRadius, dim.outerRadius],
    endRadius: [dim.outerRadius, dim.outerRadius],
    height: dim.thickness,
    segments: 32,
    center: [0, 0, 0]
  });

  // Inner pass-through cutout core (height overshoot clears overlapping surface artifacts)
  const innerCutout = cylinderElliptic({
    startRadius: [dim.innerRadius, dim.innerRadius],
    endRadius: [dim.innerRadius, dim.innerRadius],
    height: dim.thickness + 2,
    segments: 32,
    center: [0, 0, 0]
  });

  return subtract(outerDisk, innerCutout);
}

