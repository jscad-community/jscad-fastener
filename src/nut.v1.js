/**
 * Fastener Nut Dimensions Parameters Matrix
 * Array Mapping: [ widthAcrossFlats, standardHeight, thinHeight ]
 * Native Units: UTS = Inches, ISO = Millimeters
 * Target Output: All computed variations converted to Millimeters (3D Printing Ready)
 */

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
  "1-1/8": [1.688, 0.969, 0.609],
  "1-1/4": [1.875, 1.078, 0.719],
  "1-3/8": [2.062, 1.188, 0.781],
  "1-1/2": [2.250, 1.281, 0.828],
  "1-3/4": [2.625, 1.500, 0.969],
  "2":     [3.000, 1.688, 1.094],
  "2-1/4": [3.375, 1.922, 1.219],
  "2-1/2": [3.750, 2.125, 1.359],
  "2-3/4": [4.125, 2.328, 1.484],
  "3":     [4.500, 2.531, 1.625],
  "3-1/4": [4.875, 2.734, 1.750],
  "3-1/2": [5.250, 2.953, 1.891],
  "3-3/4": [5.625, 3.141, 2.016],
  "4":     [6.000, 3.313, 2.000]
};

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

// Parameter Layout Index Offsets
export const FLAT_INDEX = 0;
export const STD_HEIGHT_INDEX = 1;
export const THIN_HEIGHT_INDEX = 2;

// Conversion factor constants
const MM_PER_INCH = 25.4;

/**
 * Resolves nut standard profile specifications fully converted into millimeters.
 * @param {string} size - Sizing identifier (e.g., "M12", "1/2")
 * @param {string} standard - 'ISO' or 'UTS'
 * @param {boolean} isThin - If true, selects low-profile thickness variant
 */
export function getNutDimensions(size, standard = 'ISO', isThin = false) {
  const isUts = standard.toUpperCase() === 'UTS';
  const dataset = isUts ? utsNuts : isoNuts;
  const matrix = dataset[size];

  if (!matrix) return null;

  // Read native parameters
  let wAf = matrix[FLAT_INDEX];
  let stdH = matrix[STD_HEIGHT_INDEX];
  let thinH = matrix[THIN_HEIGHT_INDEX];

  // Pick target active height variant before conversion
  let rawHeight = (isThin && thinH !== null) ? thinH : stdH;

  // Process inch-to-mm scaling inline if standard is imperial UTS
  if (isUts) {
    wAf = parseFloat((wAf * MM_PER_INCH).toFixed(4));
    rawHeight = parseFloat((rawHeight * MM_PER_INCH).toFixed(4));
  }

  return {
    widthAcrossFlats: wAf,                             // in mm
    widthAcrossCorners: calculateWidthAcrossCorners(wAf), // in mm
    height: rawHeight,                                 // in mm
    isThinAvailable: thinH !== null,
    unit: 'mm'                                         // Fixed unified target unit
  };
}

/**
 * Computes exact maximum corner-to-corner clearance (e) for hex geometry modeling.
 * Formula: e = s / cos(30 deg) = s * 1.1547005
 */
export function calculateWidthAcrossCorners(widthAcrossFlats) {
  if (!widthAcrossFlats) return 0;
  return parseFloat((widthAcrossFlats / Math.cos(Math.PI / 6)).toFixed(4));
}

/**
 * Output helper mirroring exact positional raw array parameter layouts
 * Returns layout array: [ widthAcrossFlats_mm, widthAcrossCorners_mm, height_mm ]
 */
export function generatePrintArray(size, standard = 'ISO', isThin = false) {
  const data = getNutDimensions(size, standard, isThin);
  if (!data) return [];
  return [data.widthAcrossFlats, data.widthAcrossCorners, data.height];
}

