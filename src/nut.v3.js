/**
 * Fastener Nut Generation Module for JSCAD V3
 * Output: Solid 3D Manifolds in Millimeters
 */

import { primitives, booleans } from '@jscad/modeling'
const { cylinder } = primitives
const { subtract } = booleans

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
  "4":     [6.000, 3.313, 2.000]
};

// ISO Metric Hex Nut Dimensions (Dimensions in Millimeters)
export const isoNuts = {
  "M1":    [2.5,   0.8,   0.55],
  "M2":    [4.0,   1.6,   1.20],
  "M3":    [5.5,   2.4,   1.80],
  "M4":    [7.0,   3.2,   2.20],
  "M5":    [8.0,   4.7,   2.70],
  "M6":    [10.0,  5.2,   3.20],
  "M8":    [13.0,  6.8,   4.00],
  "M10":   [16.0,  8.4,   5.00],
  "M12":   [18.0,  10.8,  6.00],
  "M20":   [30.0,  18.0,  10.00],
  "M68":   [100.0, 54.0,  34.00]
};

/**
 * Resolves raw dataset attributes into explicit millimeter values.
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
    height: rawHeight + heightOffset,
    nominalDiameter: isUts ? parseFloat(size.replace('#', '')) || eval(size.split('-')[0]) * MM_PER_INCH : parseFloat(size.replace('M', ''))
  };
}

/**
 * JSCAD V3 Geometry Generator
 * Generates an aligned 3D Hex Nut shape with an internal passage cutout.
 * 
 * @param {string} size - e.g. "M6" or "1/4"
 * @param {string} standard - 'ISO' or 'UTS'
 * @param {boolean} isThin - Targets low-profile / jam variants
 * @param {object} clearanceOpts - { flatOffset: 0.2, heightOffset: 0.1, holeOffset: 0.2 }
 */
export function generateNutGeometry(size, standard = 'ISO', isThin = false, clearanceOpts = {}) {
  const dim = getNutDimensions(size, standard, isThin, clearanceOpts);
  if (!dim) throw new Error(`Size ${size} not found in ${standard} specifications.`);

  const { holeOffset = 0 } = clearanceOpts;

  // In JSCAD, a hexagon is constructed using a cylinder with exactly 6 segments.
  // Note: JSCAD cylinder uses standard radial bounds (center-to-vertex corner radius).
  // Trig geometry: cornerRadius = (widthAcrossFlats / 2) / cos(30 deg)
  const outerRadius = (dim.widthAcrossFlats / 2) / Math.cos(Math.PI / 6);
  
  const outerHex = cylinder({
    radius: outerRadius,
    height: dim.height,
    segments: 6
  });

  // Inner core pass-through cylinder matching the thread diameter
  const innerHoleRadius = (dim.nominalDiameter + holeOffset) / 2;
  const innerPassage = cylinder({
    radius: innerHoleRadius,
    height: dim.height + 2, // Slight height overshoot prevents artifact skins during CSG subtraction
    segments: 32            // Higher segment count for a clean smooth round hole
  });

  // Perform CSG subtraction
  return subtract(outerHex, innerPassage);
}

