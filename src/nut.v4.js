/**
 * Fastener Nut Generation Module for JSCAD V3
 * Output: Solid Hexagonal Prism Manifolds in Millimeters
 */

import { primitives } from '@jscad/modeling'
const { cylinder } = primitives

// Parameter Layout Index Offsets
export const FLAT_INDEX = 0;
export const STD_HEIGHT_INDEX = 1;
export const THIN_HEIGHT_INDEX = 2;

const MM_PER_INCH = 25.4;

// UTS Hex Nut Dimensions (Dimensions in Imperial Inches)
export const utsNuts = {
  "#0":    [0.156, 0.050, null],
  "#1":    [0.156, 0.050, null],
  "#2":    [0.188, 0.063, null],
  "#3":    [0.188, 0.063, null],
  "#4":    [0.250, 0.098, null],
  "#5":    [0.312, 0.114, null],
  "#6":    [0.312, 0.114, null],
  "#8":    [0.344, 0.130, null],
  "#10":   [0.375, 0.130, null],
  "#12":   [0.438, 0.161, null],
  "1/4":   [0.438, 0.219, 0.156],
  "5/16":  [0.500, 0.266, 0.188],
  "3/8":   [0.563, 0.328, 0.219],
  "7/16":  [0.688, 0.375, 0.250],
  "1/2":   [0.750, 0.438, 0.312],
  "9/16":  [0.875, 0.484, 0.359],
  "5/8":   [0.938, 0.547, 0.375],
  "3/4":   [1.125, 0.641, 0.422],
  "7/8":   [1.312, 0.750, 0.484],
  "1":     [1.500, 0.859, 0.547],
  "1-1/4": [1.875, 1.078, 0.719],
  "1-1/2": [2.250, 1.281, 0.828],
  "1-3/4": [2.625, 1.500, 0.969],
  "2":     [3.000, 1.688, 1.094],
  "2-1/2": [3.750, 2.125, 1.359],
  "3":     [4.500, 2.531, 1.625],
  "3-1/2": [5.250, 2.953, 1.891],
  "4":     [6.000, 3.313, 2.000]
};

// ISO Metric Hex Nut Dimensions (Dimensions in Millimeters)
export const isoNuts = {
  "M1":    [2.5,   0.8,   0.55],
  "M1.2":  [3.0,   1.0,   0.60],
  "M1.4":  [3.0,   1.2,   0.70],
  "M1.6":  [3.2,   1.3,   1.00],
  "M2":    [4.0,   1.6,   1.20],
  "M2.5":  [5.0,   2.0,   1.60],
  "M3":    [5.5,   2.4,   1.80],
  "M3.5":  [6.0,   2.8,   2.00],
  "M4":    [7.0,   3.2,   2.20],
  "M5":    [8.0,   4.7,   2.70],
  "M6":    [10.0,  5.2,   3.20],
  "M7":    [11.0,  5.5,   3.50],
  "M8":    [13.0,  6.8,   4.00],
  "M10":   [16.0,  8.4,   5.00],
  "M12":   [18.0,  10.8,  6.00],
  "M14":   [21.0,  12.8,  7.00],
  "M16":   [24.0,  14.8,  8.00],
  "M18":   [27.0,  15.8,  9.00],
  "M20":   [30.0,  18.0,  10.00],
  "M22":   [32.0,  19.4,  11.00],
  "M24":   [36.0,  21.5,  12.00],
  "M27":   [41.0,  23.8,  13.50],
  "M30":   [46.0,  25.6,  15.00],
  "M33":   [50.0,  28.7,  16.50],
  "M36":   [55.0,  31.0,  18.00],
  "M39":   [60.0,  33.4,  19.50],
  "M42":   [65.0,  34.0,  21.00],
  "M45":   [70.0,  36.0,  22.50],
  "M48":   [75.0,  38.0,  24.00],
  "M52":   [80.0,  42.0,  26.00],
  "M56":   [85.0,  45.0,  28.00],
  "M60":   [90.0,  48.0,  30.00],
  "M64":   [95.0,  51.0,  32.00],
  "M68":   [100.0, 54.0,  34.00]
};

/**
 * Resolves standard dataset parameters into functional millimeter values.
 */
export function getNutDimensions(size, standard = 'ISO', isThin = false, clearanceOpts = {}) {
  const isUts = standard.toUpperCase() === 'UTS';
  const dataset = isUts ? utsNuts : isoNuts;
  const matrix = dataset[size];

  if (!matrix) return null;

  const { flatOffset = 0, heightOffset = 0 } = clearanceOpts;

  let wAf = matrix[FLAT_INDEX];
  let rawHeight = (isThin && matrix[THIN_HEIGHT_INDEX] !== null) ? matrix[THIN_HEIGHT_INDEX] : matrix[STD_HEIGHT_INDEX];

  if (isUts) {
    wAf = wAf * MM_PER_INCH;
    rawHeight = rawHeight * MM_PER_INCH;
  }

  return {
    widthAcrossFlats: wAf + flatOffset,
    height: rawHeight + heightOffset
  };
}

/**
 * JSCAD V3 Geometry Generator
 * Constructs a solid hexagonal prism for assembly modeling or pocket cutouts.
 * 
 * @param {string} size - Sizing string (e.g., "M5", "1/2")
 * @param {string} standard - 'ISO' or 'UTS'
 * @param {boolean} isThin - Targets low-profile / jam variants
 * @param {object} clearanceOpts - { flatOffset: 0.2, heightOffset: 0.1 }
 */
export function generateNutGeometry(size, standard = 'ISO', isThin = false, clearanceOpts = {}) {
  const dim = getNutDimensions(size, standard, isThin, clearanceOpts);
  if (!dim) throw new Error(`Size ${size} not found in ${standard} specifications.`);

  // In JSCAD, a cylinder with 6 segments builds a hexagon.
  // The cylinder constructor takes a standard vertex corner radius (e).
  // Formula: cornerRadius = (widthAcrossFlats / 2) / cos(30 degrees)
  const outerRadius = (dim.widthAcrossFlats / 2) / Math.cos(Math.PI / 6);
  
  return cylinder({
    radius: outerRadius,
    height: dim.height,
    segments: 6
  });
}

