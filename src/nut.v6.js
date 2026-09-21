/**
 * Fastener Nut Generation Module for JSCAD V3
 * Output: Solid Manifolds perfectly centered at origin (Z = 0)
 */

import { primitives, booleans } from '@jscad/modeling'
const { cylinder } = primitives
const { union } = booleans

// Parameter Layout Index Offsets
export const FLAT_INDEX = 0;
export const STD_HEIGHT_INDEX = 1;
export const THIN_HEIGHT_INDEX = 2;
export const LOCK_HEIGHT_INDEX = 3; 

const MM_PER_INCH = 25.4;

export const utsNuts = {
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
  "1-1/8": [1.688, 0.969, 0.609, 1.203],
  "1-1/4": [1.875, 1.078, 0.719, 1.422],
  "1-3/8": [2.062, 1.188, 0.781, 1.547],
  "1-1/2": [2.250, 1.281, 0.828, 1.672],
  "1-3/4": [2.625, 1.500, 0.969, 2.100],
  "2":     [3.000, 1.688, 1.094, 2.312],
  "2-1/2": [3.750, 2.125, 1.359, 2.937],
  "3":     [4.500, 2.531, 1.625, 3.562],
  "3-1/2": [5.250, 2.953, 1.891, 4.187],
  "4":     [6.000, 3.313, 2.000, 4.812]
};

export const isoNuts = {
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
};

export function getNutDimensions(size, standard = 'ISO', modifierOpts = {}, clearanceOpts = {}) {
  const isUts = standard.toUpperCase() === 'UTS';
  const dataset = isUts ? utsNuts : isoNuts;
  const matrix = dataset[size];

  if (!matrix) return null;

  const { isThin = false, isLockNut = false } = modifierOpts;
  const { flatOffset = 0, heightOffset = 0 } = clearanceOpts;

  let wAf = matrix[FLAT_INDEX];
  let stdH = matrix[STD_HEIGHT_INDEX];
  let totalHeight = stdH;

  if (isLockNut && matrix[LOCK_HEIGHT_INDEX] !== null) {
    totalHeight = matrix[LOCK_HEIGHT_INDEX];
  } else if (isThin && matrix[THIN_HEIGHT_INDEX] !== null) {
    totalHeight = matrix[THIN_HEIGHT_INDEX];
  }

  if (isUts) {
    wAf = wAf * MM_PER_INCH;
    stdH = stdH * MM_PER_INCH;
    totalHeight = totalHeight * MM_PER_INCH;
  }

  return {
    widthAcrossFlats: wAf + flatOffset,
    height: totalHeight + heightOffset,
    baseHexHeight: stdH + (isLockNut ? 0 : heightOffset) 
  };
}

/**
 * JSCAD V3 Geometry Generator
 * Generates solid hexagonal bodies perfectly centered around origin Z = 0
 */
export function generateNutGeometry(size, standard = 'ISO', modifierOpts = {}, clearanceOpts = {}) {
  const dim = getNutDimensions(size, standard, modifierOpts, clearanceOpts);
  if (!dim) throw new Error(`Size ${size} missing.`);

  const { isLockNut = false } = modifierOpts;
  const outerCornerRadius = (dim.widthAcrossFlats / 2) / Math.cos(Math.PI / 6);

  // Case 1: Standard / Thin nuts are symmetrical hexagonal prisms (default centered by JSCAD)
  if (!isLockNut) {
    return cylinder({
      radius: outerCornerRadius,
      height: dim.height,
      segments: 6
    });
  }

  // Case 2: Symmetrical Compound Nylon Lock Nut centered at Z = 0
  const hexBaseHeight = dim.baseHexHeight;
  const collarHeight = dim.height - hexBaseHeight;
  
  // Calculate total bounds to shift the stack halves down to absolute middle alignment
  const halfTotalHeight = dim.height / 2;

  // Base hex goes from bottom to the hex split line
  const hexBase = cylinder({
    radius: outerCornerRadius,
    height: hexBaseHeight,
    segments: 6,
    center: [0, 0, -halfTotalHeight + (hexBaseHeight / 2)]
  });

  // Round collar stacks right on top of the hex split line to the peak edge
  const roundCollar = cylinder({
    radius: dim.widthAcrossFlats / 2,
    height: collarHeight,
    segments: 32,
    center: [0, 0, -halfTotalHeight + hexBaseHeight + (collarHeight / 2)]
  });

  return union(hexBase, roundCollar);
}

