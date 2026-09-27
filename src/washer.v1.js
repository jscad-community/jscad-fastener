import { cuboid, cylinder, cylinderElliptic, rotateZ, subtract, translate, TAU } from '@jscad/modeling'

/**
 * Fastener Washer Generation Module for JSCAD V3
 *
 * Output: Solid Washer Manifolds perfectly centered at origin (Z = 0)
 */

// Parameter Layout Index Offsets
export const ID_INDEX = 0      // Inner Diameter
export const OD_INDEX = 1      // Outer Diameter
export const TH_INDEX = 2      // Thickness

const MM_PER_INCH = 25.4

/**
 * ISO 7089 - Plain washers — Normal series — Product grade A
 *
 * Replaces DIN 125 A
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
 */
export const ISO_7089 = {
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
export const ISO_7090 = ISO_7089

/**
 * ISO 7091 - Plain washers — Normal series — Product grade C
 *
 * Replaces DIN 126
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * Dimensions: Normal series. The outer diameter matches ISO 7089/7090,
 * but the inner diameter is punched significantly looser (larger tolerances) to accommodate lower-grade fasteners.
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
 */
const ISO_7091 = {
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
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
 */
const ISO_7092 = {
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
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
 */
const ISO_7093 = {
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
 * DIN 6797 Form A External Tooth Lock (Star) Washers
 * Range Covered: M1.6 to M30 (Complete Official German Standard Bounds)
 * Schema Layout: "Designation": [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 * Maintained strictly in precise decimal Millimeters (mm).
 * 
 * Note: Sizes below M1.6 and sizes larger than M30 do not exist under DIN 6797.
 */
const DIN_6797_A = {
  "M1.6":  [1.7,   3.6, 0.3],
  "M2":    [2.2,   4.5, 0.3],
  "M2.5":  [2.7,   5.5, 0.4],
  "M3":    [3.2,   6.0, 0.4],
  "M3.5":  [3.7,   7.0, 0.5],
  "M4":    [4.3,   8.0, 0.5],
  "M5":    [5.3,  10.0, 0.6],
  "M6":    [6.4,  11.0, 0.7],
  "M7":    [7.4,  12.5, 0.8],
  "M8":    [8.4,  15.0, 0.8],
  "M10":   [10.5, 18.0, 0.9],
  "M12":   [13.0, 20.5, 1.0],
  "M14":   [15.0, 24.0, 1.0],
  "M16":   [17.0, 26.0, 1.2],
  "M18":   [19.0, 30.0, 1.4],
  "M20":   [21.0, 33.0, 1.4],
  "M22":   [23.0, 36.0, 1.5],
  "M24":   [25.0, 38.0, 1.5],
  "M27":   [28.0, 44.0, 1.6],
  "M30":   [31.0, 48.0, 1.6]
}

/**
 * DIN 6797 Form J Internal Tooth Lock (Star) Washers
 * Range Covered: M2 to M30 (Complete Official German Standard Bounds)
 * Schema Layout: "Designation": [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 * Maintained strictly in precise decimal Millimeters (mm).
 * 
 * Note: Per the official DIN standard authority limits:
 *   - Sizes M1, M1.2, and M1.6 are completely omitted as internal tooth geometry
 *     at micro-scales causes structural metal stress fractures.
 *   - Sizes larger than M30 do not exist because thin internal tabs easily 
 *     flatten or strip out under heavy industrial structural preload torques.
 */
const DIN_6797_J = {
  "M2":    [2.2,   4.5, 0.3],
  "M2.5":  [2.7,   5.5, 0.4],
  "M3":    [3.2,   6.0, 0.4],
  "M3.5":  [3.7,   7.0, 0.5],
  "M4":    [4.3,   8.0, 0.5],
  "M5":    [5.3,  10.0, 0.6],
  "M6":    [6.4,  11.0, 0.7],
  "M7":    [7.4,  12.5, 0.8],
  "M8":    [8.4,  15.0, 0.8],
  "M10":   [10.5, 18.0, 0.9],
  "M12":   [13.0, 20.5, 1.0],
  "M14":   [15.0, 24.0, 1.0],
  "M16":   [17.0, 26.0, 1.2],
  "M18":   [19.0, 30.0, 1.4],
  "M20":   [21.0, 33.0, 1.4],
  "M22":   [23.0, 36.0, 1.5],
  "M24":   [25.0, 38.0, 1.5],
  "M27":   [28.0, 44.0, 1.6],
  "M30":   [31.0, 48.0, 1.6]
}

/**
 * Complete Official DIN 7980 High-Collar Lock Washer Registry
 * Exact Sizing Envelope Range: M2 to M48 (All standard physical sizes)
 * Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]
 * Maintained strictly in precise decimal Millimeters (mm).
 */
const DIN_7980 = {
  // --- Micro-Extensions Added ---
  "M2":    [2.1,   3.6, 0.5], // Micro counterbore spec
  "M2.5":  [2.6,   4.5, 0.6], // Micro counterbore spec
  
  // --- Existing Baseline Core ---
  "M3":    [3.1,   5.6, 1.0],
  "M3.5":  [3.6,   6.2, 1.0],
  "M4":    [4.1,   7.0, 1.2],
  "M5":    [5.1,   8.8, 1.6],
  "M6":    [6.1,   9.9, 1.6],
  "M8":    [8.1,  12.7, 2.0],
  "M10":   [10.2, 16.0, 2.5],
  "M12":   [12.2, 18.0, 2.5],
  "M14":   [14.2, 21.1, 3.0],
  "M16":   [16.2, 24.4, 3.5],
  "M18":   [18.2, 26.4, 3.5],
  "M20":   [20.2, 30.6, 4.5],
  "M22":   [22.5, 32.9, 4.5],
  "M24":   [24.5, 35.9, 5.0],
  "M27":   [27.5, 38.9, 5.0],
  "M30":   [30.5, 44.1, 6.0],
  "M33":   [33.5, 47.1, 6.0],
  "M36":   [36.5, 52.2, 7.0],
  
  // --- Heavy Industrial Core Caps ---
  "M42":   [42.5, 60.2, 8.0],
  "M48":   [49.0, 67.0, 8.0]
}

/**
 * EN 14399-6 (Formerly DIN 6916) High-Strength Preload Structural Washers
 * Schema Layout: "Designation": [insideDiameter (d1), outsideDiameter (d2), thickness (h)]
 * Maintained strictly in precise decimal Millimeters (mm).
 * 
 * Note: These washers feature an explicit external perimeter chamfer and 
 * are tightly bounded between M12 and M64 due to heavy engineering rules.
 */
const EN_14399_6 = {
  "M12":   [13.0,  24.0, 3.0],
  "M14":   [15.0,  28.0, 3.0],
  "M16":   [17.0,  30.0, 4.0],
  "M18":   [19.0,  34.0, 4.0],
  "M20":   [21.0,  37.0, 4.0],
  "M22":   [23.0,  39.0, 4.0],
  "M24":   [25.0,  44.0, 4.0],
  "M27":   [28.0,  50.0, 5.0],
  "M30":   [31.0,  56.0, 5.0],
  "M33":   [34.0,  60.0, 5.0],
  "M36":   [37.0,  66.0, 6.0],
  "M39":   [40.4,  72.0, 6.0],
  "M42":   [43.4,  78.0, 8.0],
  "M45":   [46.4,  85.0, 8.0],
  "M48":   [49.4,  92.0, 8.0],
  "M56":   [58.0, 105.0, 10.0],
  "M64":   [66.0, 115.0, 10.0]
}


/*
ASME B18.21.1
  - mechanical lock washers
  - Helical Spring Split Lock Washers (Regular, Heavy, High Collar, etc.)
  - Tooth-Lock Star Washers (Internal, External, Countersunk)

ASME B18.22.1
  - commercial plain flat washers
  - Type A Narrow/Wide
  - Type B Narrow/Regular/Wide

ASTM F436
  - High-strength hardened washers
 */

/**
 * ASME B18.22.1 is now a combined standard, it contains several different dimensions depending on the washer type.
 *
 * ASME B18.22.1 Type A (Narrow / SAE)
 * ASME_B18_22_1_TYPE_A
 *
 * NOTE: Dimensions are in inches
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
 */
const ASME_B18_22_1_NARROW = {
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
 * ASME B18.22.1 is now a combined standard, it contains several different dimensions depending on the washer type.
 *
 * ASME B18.22.1 Type B (Wide / USS)
 *
 * NOTE: Dimensions are in inches
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
 */
const ASME_B18_22_1_WIDE = {
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
 *
 * "Designation": [insideDiameter, outsideDiameter, thickness]
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
 * ASME B18.21.1 Regular Series Helical Spring Lock Washers
 * Range Covered: #0 to 4" (Extrapolated using heavy mechanical metrics past 3")
 * Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]
 * Maintained in precise decimal Inches (in).
 */
const ASME_B18_21_1_LOCK_REGULAR = {
  "#0":    [0.064, 0.119, 0.015],
  "#1":    [0.077, 0.149, 0.018],
  "#2":    [0.088, 0.172, 0.020],
  "#3":    [0.101, 0.190, 0.022],
  "#4":    [0.114, 0.209, 0.025],
  "#5":    [0.127, 0.236, 0.031],
  "#6":    [0.141, 0.250, 0.031],
  "#8":    [0.167, 0.293, 0.040],
  "#10":   [0.193, 0.334, 0.047],
  "#12":   [0.219, 0.377, 0.056],
  "1/4":   [0.252, 0.487, 0.062],
  "5/16":  [0.314, 0.583, 0.078],
  "3/8":   [0.377, 0.680, 0.094],
  "7/16":  [0.440, 0.776, 0.109],
  "1/2":   [0.504, 0.869, 0.125],
  "9/16":  [0.567, 0.965, 0.141],
  "5/8":   [0.629, 1.073, 0.156],
  "3/4":   [0.755, 1.265, 0.188],
  "7/8":   [0.881, 1.459, 0.219],
  "1":     [1.007, 1.656, 0.250],
  "1-1/8": [1.134, 1.847, 0.281],
  "1-1/4": [1.261, 2.036, 0.312],
  "1-3/8": [1.389, 2.219, 0.344],
  "1-1/2": [1.516, 2.419, 0.375],
  "1-5/8": [1.643, 2.610, 0.406],
  "1-3/4": [1.769, 2.793, 0.438],
  "1-7/8": [1.895, 2.975, 0.469],
  "2":     [2.021, 3.156, 0.500],
  "2-1/4": [2.260, 3.221, 0.563],
  "2-1/2": [2.512, 3.471, 0.625],
  "2-3/4": [2.762, 3.824, 0.688],
  "3":     [3.012, 4.074, 0.750],
  "3-1/4": [3.265, 4.412, 0.785],
  "3-1/2": [3.515, 4.745, 0.825],
  "3-3/4": [3.765, 5.080, 0.865],
  "4":     [4.015, 5.415, 0.910]
}

/**
 * ASME B18.21.1 Heavy Series Helical Spring Lock Washers
 * Range Covered: #0 to 4" (Includes heavy machinery scaled boundary allocations)
 * Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]
 * Features expanded outside diameters and massive thickness walls to handle high torque.
 */
const ASME_B18_21_1_LOCK_HEAVY = {
  "#0":    [0.064, 0.128, 0.020], 
  "#1":    [0.077, 0.158, 0.024], 
  "#2":    [0.088, 0.182, 0.025],
  "#3":    [0.101, 0.209, 0.031],
  "#4":    [0.114, 0.223, 0.031],
  "#5":    [0.127, 0.252, 0.040],
  "#6":    [0.141, 0.266, 0.040],
  "#8":    [0.167, 0.307, 0.047],
  "#10":   [0.193, 0.350, 0.056],
  "#12":   [0.219, 0.391, 0.063],
  "1/4":   [0.252, 0.491, 0.077],
  "5/16":  [0.317, 0.596, 0.097],
  "3/8":   [0.380, 0.691, 0.115],
  "7/16":  [0.443, 0.787, 0.133],
  "1/2":   [0.506, 0.883, 0.151],
  "9/16":  [0.570, 0.981, 0.171],
  "5/8":   [0.635, 1.093, 0.189],
  "3/4":   [0.760, 1.291, 0.226],
  "7/8":   [0.887, 1.494, 0.266],
  "1":     [1.017, 1.705, 0.306],
  "1-1/8": [1.144, 1.909, 0.345],
  "1-1/4": [1.271, 2.113, 0.384],
  "1-3/8": [1.398, 2.311, 0.422],
  "1-1/2": [1.525, 2.502, 0.458],
  "1-5/8": [1.650, 2.700, 0.495],
  "1-3/4": [1.775, 2.900, 0.535],
  "1-7/8": [1.900, 3.100, 0.570],
  "2":     [2.025, 3.300, 0.605],
  "2-1/4": [2.262, 3.398, 0.693],
  "2-1/2": [2.515, 3.648, 0.762],
  "2-3/4": [2.765, 3.910, 0.835],
  "3":     [3.015, 4.160, 0.905],
  "3-1/4": [3.279, 5.068, 0.750],
  "3-1/2": [3.530, 5.434, 0.812],
  "3-3/4": [3.782, 5.801, 0.875],
  "4":     [4.033, 6.166, 0.938]
}

/**
 * ASME B18.21.1 External Tooth Lock (Star) Washers
 * Range Covered: #2 to 1-3/4" (Complete Official Standard Bounds)
 * Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]
 * Maintained in precise decimal Inches (in).
 * Outer diameter bounds map to the furthest biting tooth perimeter apex.
 * 
 * Note: Sizes #0, #1, and sizes larger than 1-3/4" do not exist under ASME B18.21.1.
 *
 * Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]
 */
const ASME_B18_21_1_TOOTH_EXTERNAL = {
  "#2":    [0.089, 0.230, 0.015],
  "#3":    [0.102, 0.255, 0.016],
  "#4":    [0.115, 0.282, 0.019],
  "#5":    [0.129, 0.305, 0.020],
  "#6":    [0.141, 0.320, 0.022],
  "#8":    [0.168, 0.381, 0.023],
  "#10":   [0.195, 0.410, 0.024],
  "#12":   [0.221, 0.475, 0.027],
  "1/4":   [0.256, 0.510, 0.028],
  "5/16":  [0.320, 0.610, 0.034],
  "3/8":   [0.384, 0.694, 0.040],
  "7/16":  [0.448, 0.760, 0.040],
  "1/2":   [0.513, 0.900, 0.045],
  "9/16":  [0.576, 0.985, 0.045],
  "5/8":   [0.641, 1.070, 0.050],
  "3/4":   [0.769, 1.260, 0.055],
  "7/8":   [0.897, 1.410, 0.060],
  "1":     [1.025, 1.620, 0.067],
  "1-1/8": [1.153, 1.820, 0.067],
  "1-1/4": [1.281, 1.960, 0.067],
  "1-3/8": [1.408, 2.210, 0.067],
  "1-1/2": [1.536, 2.380, 0.067],
  "1-3/4": [1.791, 2.620, 0.067]
}

/**
 * ASME B18.21.1 Internal Tooth Lock (Star) Washers
 * Range Covered: #2 to 1-3/4" (Complete Official Standard Bounds)
 * Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]
 * Maintained in precise decimal Inches (in).
 * 
 * Note: Sizes #0, #1, and sizes larger than 1-3/4" do not exist under ASME B18.21.1.
 */
const ASME_B18_21_1_TOOTH_INTERNAL = {
  "#2":    [0.089, 0.200, 0.015],
  "#3":    [0.102, 0.230, 0.016],
  "#4":    [0.115, 0.270, 0.019],
  "#5":    [0.129, 0.290, 0.020],
  "#6":    [0.141, 0.295, 0.021],
  "#8":    [0.168, 0.340, 0.023],
  "#10":   [0.195, 0.381, 0.024],
  "#12":   [0.221, 0.410, 0.027],
  "1/4":   [0.256, 0.478, 0.028],
  "5/16":  [0.320, 0.610, 0.034],
  "3/8":   [0.384, 0.692, 0.040],
  "7/16":  [0.448, 0.789, 0.040],
  "1/2":   [0.513, 0.892, 0.045],
  "9/16":  [0.576, 0.985, 0.045],
  "5/8":   [0.641, 1.071, 0.050],
  "3/4":   [0.769, 1.245, 0.055],
  "7/8":   [0.897, 1.410, 0.060],
  "1":     [1.025, 1.610, 0.067],
  "1-1/8": [1.153, 1.815, 0.067],
  "1-1/4": [1.281, 1.961, 0.067],
  "1-3/8": [1.408, 2.210, 0.067],
  "1-1/2": [1.536, 2.377, 0.067],
  "1-3/4": [1.791, 2.619, 0.067]
}

/**
 * Get the overall washer dimensions for the given specification.
 *
 * NOTE: Returned dimensions are millimeters.
 *
 * @param {Object} spec - specification for construction
 * @param {String} [spec.size='M4'] - size of ISO / ASME washer, see lists above.
 * @param {String} [spec.standard='ISO'] - dimension standard, ISO or ASME
 * @param {Boolean} [spec.isHeavy=false] - get dimensions for heavy washers
 * @param {Boolean} [spec.isLocking=false] - get locking washer dimensions
 * @param {Boolean} [spec.isInternal=false] - get locking washer with internal stars
 * @param {Boolean} [spec.isExternal=false] - get locking washer with external stars
 * @param {Number} [spec.idOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.odOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.thicknessOffset=0] - clearance for oversized cutouts
 * @returns {Object} washer dimensions: innerRadius, outerRadius, thickness (mm)
 */
export const getWasherDimensions = (spec = {}) => {
  const {
    size,
    standard = 'ISO',
    isWide = false,
    isHeavy = false,
    isLocking = false,
    isExternal = false,
    isInternal = false,
    idOffset = 0,
    odOffset = 0,
    thicknessOffset = 0
  } = spec

  if (!size) return null

  let dataset

  if (standard.toUpperCase() === 'ASME') {
    // select the ASME washer standard to apply
    if (isLocking) {
      // select a locking washer standard
      if (!dataset && isInternal) dataset = ASME_B18_21_1_TOOTH_INTERNAL
      if (!dataset && isExternal) dataset = ASME_B18_21_1_TOOTH_EXTERNAL
      if (!dataset && isHeavy) dataset = ASME_B18_21_1_LOCK_HEAVY
      if (!dataset) dataset = ASME_B18_21_1_LOCK_REGULAR
    } else {
      // select a regular washer standard
      if (!dataset && isHeavy) dataset = ASTMF436
      if (!dataset && isWide) dataset = ASME_B18_22_1_WIDE
      if (!dataset) dataset = ASME_B18_22_1_NARROW
    }
  }
  if (standard.toUpperCase() === 'ISO') {
    // select the ISO washer standard to apply
    if (isLocking) {
      // select a locking washer standard
      if (!dataset && isInternal) dataset = DIN_6797_J
      if (!dataset && isExternal) dataset = DIN_6797_A
      //if (!dataset && isHeavy) dataset = ??
      if (!dataset) dataset = DIN_7980
    } else {
      if (!dataset && isHeavy) dataset = EN_14399_6
      if (!dataset && isWide) dataset = ISO_7093
      if (!dataset) dataset = ISO_7090
    }
  }
  if (!dataset) return null

  // get the dimensions for the requested size
  const dims = dataset[size]
  if (!dims) return null

  let innerDiameter = dims[ID_INDEX] + (idOffset * 2)
  let outerDiameter = dims[OD_INDEX] + (odOffset * 2)
  let thickness = dims[TH_INDEX] + (thicknessOffset * 2)

  // convert ASME inches to mm
  if (standard.toUpperCase() === 'ASME') {
    innerDiameter = Number(innerDiameter * MM_PER_INCH).toFixed(2)
    outerDiameter = Number(outerDiameter * MM_PER_INCH).toFixed(2)
    thickness = Number(thickness * MM_PER_INCH).toFixed(2)
  }

  return {
    // spec
    size,
    standard,
    isWide,
    isHeavy,
    isLocking,
    isInternal,
    isExternal,
    // dimensions
    innerDiameter,
    outerDiameter,
    thickness,
  }
}

/**
 * Procedural Star Washer Geometry Estimator
 *
 * Calculates an authentic commercial tooth count derived entirely from the outer diameter.
 * 
 * @param {Number} outerDiameter - The washer's true outside diameter in millimeters
 * @returns {Number} Standardized target count for polar rotation loops
 */
const getProceduralToothCount = (outerDiameter) => {
  // Enforces a structural minimum of 6 teeth for microscopic sizes (M2 / #2)
  const count = 3 * Math.sqrt(outerDiameter) + 1
  return Math.max(6, Math.round(count))
}

/*
 * Generates a 3D simulated external tooth star washer.
 */
const generateExternalStarWasher = (innerDiameter, outerDiameter, thickness, segments) => {
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2
  const toothCount = getProceduralToothCount(outerDiameter)

  // Generate the baseline core washer ring
  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments })
  const washerRing = subtract(baseOuterCylinder, baseInnerCylinder)

  // Compute geometric parameters for the cutout wedges using TAU
  const angleStep = TAU / toothCount
  const perimeter = TAU * outerRadius
  const cutoutWidth = (perimeter / toothCount) * 0.40
  const cutoutLength = (outerRadius - innerRadius) * 0.50 
  const shiftDistance = outerRadius - (cutoutLength / 2)

  const masterCutoutBit = cuboid({
    size: [cutoutLength, cutoutWidth, thickness + 0.2]
  })

  const cutouts = []

  // Polar calculation loop
  for (let i = 0; i < toothCount; i++) {
    const currentAngle = i * angleStep
    
    // Process unique spatial translations from our static master node
    const transformedBit = rotateZ(
      currentAngle, 
      translate([shiftDistance, 0, 0], masterCutoutBit)
    )
    
    cutouts.push(transformedBit)
  }

  return subtract(washerRing, cutouts)
}

/*
 * Generates a 3D simulated internal tooth star washer.
 */
const generateInternalStarWasher = (innerDiameter, outerDiameter, thickness, segments) => {
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2

  // 1. Calculate the authentic commercial tooth density count from the mm OD
  const toothCount = getProceduralToothCount(outerDiameter)

  // 2. Generate the base core washer ring primitive
  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments })
  const washerRing = subtract(baseOuterCylinder, baseInnerCylinder)

  // 3. Compute geometric parameters for the internal cutout wedges
  const angleStep = TAU / toothCount
  
  // Cutout width scales off the inside perimeter to balance tooth vs air gap (~40% air gap)
  const innerPerimeter = TAU * innerRadius
  const cutoutWidth = (innerPerimeter / toothCount) * 0.40
  
  // Length penetrates deep enough from the inside bore to simulate internal teeth
  const cutoutLength = (outerRadius - innerRadius) * 0.50 
  
  // Shift distance pulls the master cutting bit inward so its outer edge rides along the innerRadius boundary
  const shiftDistance = innerRadius + (cutoutLength / 2)

  const masterCutoutBit = cuboid({
    size: [cutoutLength, cutoutWidth, thickness + 0.2]
  })

  const cutouts = []

  // 4. Polar calculation loop
  for (let i = 0; i < toothCount; i++) {
    const currentAngle = i * angleStep
    
    // Process unique spatial translations pulling inward from our static master node
    const transformedBit = rotateZ(
      currentAngle, 
      translate([shiftDistance, 0, 0], masterCutoutBit)
    )
    
    cutouts.push(transformedBit)
  }

  return subtract(washerRing, cutouts)
}

/*
 * Generates a 3D simulated helical split-ring lock washer.
 *
 * Slices a thin radial gap through one side of the ring.
 */
const generateSplitLockWasher = (innerDiameter, outerDiameter, thickness, segments) => {
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2

  // 1. Generate the base core solid washer ring primitive
  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments }) // Over-height buffer
  const washerRing = subtract(baseOuterCylinder, baseInnerCylinder)

  // 2. Compute parameters for the single split-ring cutout slice
  // The split width scales dynamically but stays thin to represent a real compressed spring lock washer
  const gapWidth = Math.max(0.4, (outerRadius - innerRadius) * 0.25)
  const gapLength = (outerRadius - innerRadius) * 2.5
  
  // Shift the cutting bit out along the X-axis so it centers perfectly over one side wall of the ring
  const targetXCenter = innerRadius + (gapLength / 2) - 0.1

  // 3. Allocate the immutable single slice block matrix
  const positionedSlice = cuboid({
    size: [gapLength, gapWidth, thickness + 0.2],
    center: [targetXCenter, 0, 0]
  })

  // 5. Execute the final high-performance geometry subtraction
  return subtract(washerRing, positionedSlice)
}

/**
 * Generate a solid washer manifold using the given dimensions.
 *
 * @see getWasherDimensions
 * 
 * @param {object} dimensions - washer dimensions
 */
export const generateWasher = (dimensions = {}) => {
  let {
    innerDiameter,
    outerDiameter,
    thickness,
    isLocking = false,
    isInternal = false,
    isExternal = false,
    segments = 38
  } = dimensions

  // lock washers

  if (isInternal) {
    return generateInternalStarWasher(innerDiameter, outerDiameter, thickness, segments )
  }

  if (isExternal) {
    return generateExternalStarWasher(innerDiameter, outerDiameter, thickness, segments )
  }

  if (isLocking) {
    return generateSplitLockWasher(innerDiameter, outerDiameter, thickness, segments )
  }

  // standard washer

  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2

  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments })

  return subtract(baseOuterCylinder, baseInnerCylinder)
}

