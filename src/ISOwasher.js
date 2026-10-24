import { SpringWasher, StarWasher, Washer } from './washer.js'

/*
 * ISO Washer Module for JSCAD
 */

// Parameter Layout Index Offsets
export const ID_INDEX = 0      // Inner Diameter
export const OD_INDEX = 1      // Outer Diameter
export const TH_INDEX = 2      // Thickness

/**
 * ISO 7089 - Plain washers — Normal series — Product grade A
 *
 * Replaces DIN 125 A
 *
 * Profile Geometry: Flat, square outer edge (No chamfer)
 *
 * Entries: ISO size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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
 * Entries: ISO size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
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
 * Entries: ISO size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7091 = {
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
 * Entries: ISO size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7092 = {
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
 * Entries: ISO size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7093 = {
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
 *
 * Range Covered: M1.6 to M30 (Complete Official German Standard Bounds)
 *
 * Note: Sizes below M1.6 and sizes larger than M30 do not exist under DIN 6797.
 *
 * Entries: ISO size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_6797_A = {
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
 *
 * Range Covered: M2 to M30 (Complete Official German Standard Bounds)
 *
 * Note: Per the official DIN standard authority limits:
 *   - Sizes M1, M1.2, and M1.6 are completely omitted as internal tooth geometry
 *     at micro-scales causes structural metal stress fractures.
 *   - Sizes larger than M30 do not exist because thin internal tabs easily 
 *     flatten or strip out under heavy industrial structural preload torques.
 *
 * Entries: ISO size: [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_6797_J = {
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
 *
 * Exact Sizing Envelope Range: M2 to M48 (All standard physical sizes)
 *
 * Entries: ISO size: [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_7980 = {
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
 *
 * Note: These washers feature an explicit external perimeter chamfer and 
 * are tightly bounded between M12 and M64 due to heavy engineering rules.
 *
 * Entries: ISO size: [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const EN_14399_6 = {
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

/**
 * DIN 127 B Helical Spring Split Lock Washers with square ends
 *
 * Entries: ISO size: [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_127_B = {
  "M2":     [2.1, 4.4, 0.5],
  "M2.5":   [2.6, 5.1, 0.6],
  "M3":     [3.1, 6.2, 0.8],
  "M3.5":   [3.6, 6.7, 0.8],
  "M4":     [4.1, 7.6, 0.9],
  "M5":     [5.1, 9.2, 1.2],
  "M6":     [6.1, 11.8, 1.6],
  "M8":     [8.1, 14.8, 2.0],
  "M10":    [10.2, 18.1, 2.2],
  "M12":    [12.2, 21.1, 2.5],
  "M14":    [14.2, 24.1, 3.0],
  "M16":    [16.2, 27.4, 3.5],
  "M18":    [18.2, 29.4, 3.5],
  "M20":    [20.2, 33.6, 4.0],
  "M22":    [22.5, 35.9, 4.0],
  "M24":    [24.5, 40.0, 5.0],
  "M27":    [27.5, 43.0, 5.0],
  "M30":    [30.5, 48.2, 6.0],
  "M33":    [33.5, 55.2, 6.0],
  "M36":    [36.5, 58.2, 6.0],
  "M42":    [42.5, 68.2, 7.0],
  "M48":    [48.5, 75.0, 7.0],
  "M56":    [56.5, 87.0, 8.0],
  "M64":    [64.5, 95.0, 8.0],
  "M72":    [72.5, 103.0, 8.0],
  "M80":    [80.5, 111.0, 8.0],
  "M90":    [90.5, 121.0, 8.0],
  "M100":   [100.5, 131.0, 8.0]
}

/**
 * ISO 7094 Plain washers — Extra large series — Product grade C
 *
 * Entries: ISO size: [insideDiameter (d1), outsideDiameter (d2), thickness (s)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7094 = {
  "M5":  [5.5,  18.0, 2.0],
  "M6":  [6.6,  22.0, 2.0],
  "M8":  [9.0,  28.0, 3.0],
  "M10": [11.0, 34.0, 3.0],
  "M12": [13.5, 44.0, 4.0],
  "M16": [17.5, 56.0, 5.0],
  "M20": [22.0, 72.0, 6.0],
  "M22": [24.0, 80.0, 6.0],
  "M24": [26.0, 85.0, 6.0],
  "M27": [30.0, 98.0, 6.0],
  "M30": [33.0, 105.0, 6.0],
  "M33": [36.0, 112.0, 6.0],
  "M36": [39.0, 120.0, 8.0]
}

const standards = {
  'DIN_6797_J': DIN_6797_J,
  'DIN_6797_A': DIN_6797_A,
  'EN_14399_6_STRUCTURAL': EN_14399_6,
  'ISO_7090': ISO_7090,
  'ISO_7091': ISO_7091,
  'ISO_7092': ISO_7092,
  'ISO_7093': ISO_7093,
  'ISO_7094': ISO_7094,
  'DIN_7980': DIN_7980,
  'DIN_127_B': DIN_127_B,
}

/**
 * Get the overall washer dimensions for the given specification.
 *
 * @see parseWasherSpec() for parsing of specifications
 *
 * NOTE: Returned dimensions are millimeters.
 *
 * @memberof jscad-fastener/iso
 * @param {Object} spec - specification for construction
 * @param {String} spec.size - required, size of ISO / ASME washer, see lists above
 * @param {String} [spec.standard=null] - ISO standard or none (use type to choose)
 * @param {String} [spec.type='REGULAR'] - type of washer (REGULAR, HEAVY, WIDE, STRUCTURAL) / lock washer (REGULAR, HEAVY, INTERNAL, EXTERNAL)
 * @param {Boolean} [spec.isLocking=false] - get locking washer dimensions
 * @param {Number} [spec.idOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.odOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.thicknessOffset=0] - clearance for oversized cutouts
 * @returns {Object} ISO specification with washer dimensions: innerRadius, outerRadius, thickness
 *
 * @example
 * const dims = getWasherDimensions({size: 'M6'})
 * const dims = getWasherDimensions({size: 'M16', type: 'HEAVY'})
 * const dims = getWasherDimensions({size: 'M22', standard: 'ISO_7093'})
 */
export const getWasherDimensions = (spec) => {
  let {
    size,
    standard = null,
    isLocking = false,
    type = 'REGULAR',
    idOffset = 0,
    odOffset = 0,
    thicknessOffset = 0
  } = spec

  if (!size) return null

  type = type.toUpperCase()

  // select the ISO washer standard using the given options
  if (!standard) {
    if (isLocking) {
      // select a locking washer standard
      if (type === 'INTERNAL') {
        standard = 'DIN_6797_J'
      } else if (type === 'EXTERNAL') {
        standard = 'DIN_6797_A'
      } else if (type === 'HEAVY') {
        standard = 'DIN_7980'
      } else {
        type = 'REGULAR'
        standard = 'DIN_127_B'
      }
    } else {
      // select a regular washer standard
      if (type === 'STRUCTURAL') {
        standard = 'EN_14399_6_STRUCTURAL'
      } else if (type === 'HEAVY' || type === 'WIDE') {
        standard = 'ISO_7093'
      } else {
        type = 'REGULAR'
        standard = 'ISO_7090'
      }
    }
  }

  let dataset = standards[standard]
  if (!dataset) return null

  // get the dimensions for the requested size
  const dims = dataset[size]
  if (!dims) return null

  const innerDiameter = dims[ID_INDEX] + (idOffset * 2)
  const outerDiameter = dims[OD_INDEX] + (odOffset * 2)
  const thickness = dims[TH_INDEX] + (thicknessOffset * 2)

  return {
    // spec
    size,
    standard,
    isLocking,
    type,
    // dimensions
    innerDiameter,
    outerDiameter,
    thickness,
  }
}

/**
 * Generate a solid washer manifold using the given dimensions.
 *
 * @see getWasherDimensions() to obtain correct dimensions
 *
 * NOTE: All dimensions are millimeters
 * 
 * @memberof jscad-fastener/iso
 * @param {object} spec - full washer specifications with dimensions
 * @param {String} spec.type - type of washer (REGULAR, HEAVY, WIDE, STRUCTURAL) / lock washer (REGULAR, HEAVY, INTERNAL, EXTERNAL)
 * @param {Boolean} spec.isLocking - true to generate locking washer
 * @param {Number} spec.innerDiameter - diameter of inside of washer
 * @param {Number} spec.outerDiameter - diameter of outside of washer
 * @param {Number} spec.thickness - thickness of washer
 * @param {Number} [spec.segments=36] - segments per full rotation
 * @returns {Geom3} washer, centered on XYZ
 *
 * @example
 * const dims = getWasherDimensions({size: 'M22', type: 'HEAVY'})
 * const nut = generateWasher(spec)
 */
export const generateWasher = (spec) => {
  const {
    isLocking,
    type,
    innerDiameter,
    outerDiameter,
    thickness,
    segments = 36
  } = spec

  const washerSpec = { innerDiameter, outerDiameter, thickness, segments }

  // lock washers
  if (isLocking) {
    if (type === 'INTERNAL') {
      washerSpec['isInternal'] = true
      return StarWasher(washerSpec)
    } else if (type === 'EXTERNAL') {
      washerSpec['isInternal'] = false
      return StarWasher(washerSpec)
    } else {
      return SpringWasher(washerSpec)
    }
  }

  // standard washers
  return Washer(washerSpec)
}

