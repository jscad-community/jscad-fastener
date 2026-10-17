import { union } from '@jscad/modeling'

import { getThreadSpec } from './ISOthreads.js'
import { HexHead, Shank } from './bolt.js'

// Dimensions Offsets
const MAJOR_DIAMETER = 0
const WIDTH_ACROSS_FLATS = 1
const HEAD_HEIGHT = 2
const BEARING_FACE_DIAMETER = 3
const FILLET_RADIUS = 4

/**
 * ISO 4014: Hexagon head bolts - Product grades A and B.
 * 
 * DESIGN NOTES:
 * - This standard governs partially threaded bolts featuring a plain, unthreaded body shank.
 * - Grade A applies to sizes M1.6 to M24 (lengths <= 150mm); Grade B applies to sizes > M24 or lengths > 150mm.
 * - Features modern ISO Width Across Flats (WAF) specifications for M10 (16mm), M12 (18mm), and M14 (21mm).
 * - Incorporates a precision-machined, circular underside bearing face (dw).
 *
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_4014_HEX_BOLT = {
  "M3": [3, 5.5, 2, 4.6, 0.1],
  "M4": [4, 7, 2.8, 5.9, 0.2],
  "M5": [5, 8, 3.5, 6.9, 0.2],
  "M6": [6, 10, 4, 8.9, 0.25],
  "M8": [8, 13, 5.3, 11.6, 0.4],
  "M10": [10, 16, 6.4, 14.6, 0.4], // Standard ISO WAF (differs from DIN 17mm)
  "M12": [12, 18, 7.5, 16.5, 0.6], // Standard ISO WAF (differs from DIN 19mm)
  "M14": [14, 21, 8.8, 19.2, 0.6], // Standard ISO WAF (differs from DIN 22mm)
  "M16": [16, 24, 10, 22.0, 0.6],
  "M20": [20, 30, 12.5, 27.7, 0.8],
  "M24": [24, 36, 15, 33.3, 0.8],
  "M30": [30, 46, 18.7, 42.8, 1.0],
  "M36": [36, 55, 22.5, 51.1, 1.0],
  "M42": [42, 65, 26, 60.0, 1.2],
  "M48": [48, 75, 30, 69.4, 1.6],
  "M56": [56, 85, 35, 78.7, 2.0],
  "M64": [64, 95, 40, 88.2, 2.0]
}

/**
 * ISO 4016: Hexagon head bolts - Product grade C.
 *
 * DESIGN NOTES:
 * - This standard defines "rough" or heavy black finish bolts with broad dimensional tolerances.
 * - Intended for low-preload architectural steel staging, agricultural setups, and heavy non-precision framing.
 * - Typically limited to low carbon-steel property classes (e.g., 4.6 or 5.6).
 * - Does NOT feature a machined circular bearing face underside; dw is bounded to the full flat profile footprint.
 * - Historically equivalent to the legacy DIN 601 structural standard.
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_4016_HEX_BOLT_C = {
  "M5":    [5.0, 8.0,  3.5,  8.0,  0.2],
  "M6":    [6.0, 10.0, 4.0,  10.0, 0.25],
  "M8":    [8.0, 13.0, 5.3,  13.0, 0.4],
  "M10":   [10.0, 16.0, 6.4,  16.0, 0.4],
  "M12":   [12.0, 18.0, 7.5,  18.0, 0.6],
  "M14":   [14.0, 21.0, 8.8,  21.0, 0.6],
  "M16":   [16.0, 24.0, 10.0, 24.0, 0.6],
  "M20":   [20.0, 30.0, 12.5, 30.0, 0.8],
  "M24":   [24.0, 36.0, 15.0, 36.0, 1.0],
  "M30":   [30.0, 46.0, 18.7, 46.0, 1.2],
  "M36":   [36.0, 55.0, 22.5, 55.0, 1.6],
  "M42":   [42.0, 65.0, 26.0, 65.0, 1.6],
  "M48":   [48.0, 75.0, 30.0, 75.0, 2.0],
  "M56":   [56.0, 85.0, 35.0, 85.0, 2.0],
  "M64":   [64.0, 95.0, 40.0, 95.0, 2.5]
}

/**
 * ISO 4017: Hexagon head screws - Product grades A and B.
 * 
 * DESIGN NOTES:
 * - This standard governs fully threaded fasteners (screws threaded completely to the head).
 * - It acts as the direct metric equivalent to an ASME B18.2.1 Tap Bolt or fully threaded Cap Screw.
 * - Grade A applies to sizes M1.6 to M24 (lengths <= 150mm); Grade B applies to sizes > M24 or lengths > 150mm.
 * - Features standard ISO Width Across Flats (WAF) specifications for M10 (16mm), M12 (18mm), and M14 (21mm).
 * - Incorporates a precision-machined, circular underside bearing face (dw).
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_4017_HEX_SCREW = {
  "M3":   [3.0,  5.5,  2.0,   5.00,  0.1],
  "M4":   [4.0,  7.0,  2.8,   6.35,  0.2],
  "M5":   [5.0,  8.0,  3.5,   7.30,  0.2],
  "M6":   [6.0, 10.0,  4.0,   8.88,  0.25],
  "M8":   [8.0, 13.0,  5.3,  11.63,  0.4],
  "M10":  [10.0, 16.0,  6.4,  14.25,  0.4], // ISO 16mm WAF
  "M12":  [12.0, 18.0,  7.5,  16.08,  0.6], // ISO 18mm WAF
  "M14":  [14.0, 21.0,  8.8,  18.73,  0.6], // ISO 21mm WAF
  "M16":  [16.0, 24.0, 10.0,  21.43,  0.6],
  "M20":  [20.0, 30.0, 12.5,  26.75,  0.8],
  "M24":  [24.0, 36.0, 15.0,  32.14,  0.8],
  "M30":  [30.0, 46.0, 18.7,  41.13,  1.0],
  "M36":  [36.0, 55.0, 22.5,  49.13,  1.0],
  "M42":  [42.0, 65.0, 26.0,  58.20,  1.2],
  "M48":  [48.0, 75.0, 30.0,  67.20,  1.6],
  "M56":  [56.0, 85.0, 35.0,  76.20,  2.0],
  "M64":  [64.0, 95.0, 40.0,  85.20,  2.0]
}

/**
 * ISO 7411: Hexagon bolts for high-strength structural bolting with large width across flats.
 * 
 * DESIGN NOTES:
 * - This standard governs heavy-duty structural steel fasteners designed for high preloads.
 * - Features significantly wider Width Across Flats (WAF) envelopes than precision ISO 4014 bolts 
 *   to maximize the joint's bearing area and prevent thread stripping.
 * - Natively corresponds to the legacy structural DIN 6914 standard profile.
 * - Product scope traditionally spans strictly from M12 to M36.
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7411_HEX_STRUCTURAL = {
  "M12": [12.0, 22.0,  8.0, 20.0, 1.2],
  "M16": [16.0, 27.0, 10.0, 25.0, 1.2],
  "M20": [20.0, 32.0, 13.0, 30.0, 1.5],
  "M22": [22.0, 36.0, 14.0, 34.0, 1.5],
  "M24": [24.0, 41.0, 15.0, 39.0, 1.5],
  "M27": [27.0, 46.0, 17.0, 44.0, 2.0],
  "M30": [30.0, 50.0, 19.0, 48.0, 2.0],
  "M36": [36.0, 60.0, 23.0, 58.0, 2.0]
}

/**
 * ISO 7045: Pan head screws with type H or type Z cross recess - Product grade A.
 * 
 * DESIGN NOTES:
 * - This standard governs precision, cross-recessed pan head machine screws.
 * - Used exclusively for smaller mechanical and electronic assemblies (M1.6 up to M10).
 * - Because it is a circular head profile, the 2nd slot [1] tracks Head Diameter (dk).
 * - The 4th slot [3] tracks the flat underside bearing surface diameter (dw) per ISO 7045 Grade A geometric limits.
 * - Supersedes and aligns closely with the historical legacy DIN 7985 standard profile.
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_7045_PAN_MACHINE = {
  "M2":   [2.0,  4.0, 1.6,  3.7, 0.2],
  "M2.5": [2.5,  5.0, 2.0,  4.6, 0.2],
  "M3":   [3.0,  5.6, 2.4,  5.2, 0.2],
  "M3.5": [3.5,  7.0, 2.6,  6.5, 0.3],
  "M4":   [4.0,  8.0, 3.1,  7.4, 0.4],
  "M5":   [5.0,  9.5, 3.7,  8.8, 0.5],
  "M6":   [6.0, 12.0, 4.6, 11.1, 0.6],
  "M8":   [8.0, 16.0, 6.0, 14.8, 0.8],
  "M10":  [10.0, 20.0, 7.5, 18.5, 1.0]
}

/**
 * DIN 601: Hexagon head bolts with nut - Product grade C.
 * 
 * DESIGN NOTES:
 * - This standard defines "rough" or heavy unmachined black/galvanized bolts with wide tolerances.
 * - Incorporates traditional legacy DIN spanner/WAF exceptions for M10 (17mm), M12 (19mm), and M14 (22mm).
 * - Because it lacks a machined circular relief step, dw tracks the full flat hex profile.
 * - This standard serves as the functional downstream analog to ISO_4016_HEX_BOLT_C.
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_601_HEX_BOLT_C = {
  "M5":  [5.0,  8.0,  3.5,  8.0,  0.2],
  "M6":  [6.0,  10.0, 4.0,  10.0, 0.2],
  "M8":  [8.0,  13.0, 5.3,  13.0, 0.3],
  "M10": [10.0, 17.0, 6.4,  17.0, 0.4], // Legacy DIN 17mm WAF
  "M12": [12.0, 19.0, 7.5,  19.0, 0.6], // Legacy DIN 19mm WAF
  "M14": [14.0, 22.0, 8.8,  22.0, 0.6], // Legacy DIN 22mm WAF
  "M16": [16.0, 24.0, 10.0, 24.0, 0.6],
  "M20": [20.0, 30.0, 12.5, 30.0, 0.8],
  "M24": [24.0, 36.0, 15.0, 36.0, 0.8],
  "M27": [27.0, 41.0, 17.0, 41.0, 1.0],
  "M30": [30.0, 46.0, 18.7, 46.0, 1.0],
  "M33": [33.0, 50.0, 21.0, 50.0, 1.0],
  "M36": [36.0, 55.0, 22.5, 55.0, 1.0],
  "M42": [42.0, 65.0, 26.0, 65.0, 1.2],
  "M48": [48.0, 75.0, 30.0, 75.0, 1.5],
  "M56": [56.0, 85.0, 35.0, 85.0, 1.5],
  "M64": [64.0, 95.0, 40.0, 95.0, 1.5]
}

/**
 * DIN 931: Hexagon head bolts with shank - Metric coarse thread.
 * 
 * MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_4014_HEX_BOLT
 * 
 * DESIGN NOTES:
 * - This standard governs precision partially threaded bolts featuring a plain unthreaded body shank.
 * - Preserves the legacy DIN wrench/WAF spanner contact sizes for M10 (17mm), M12 (19mm), M14 (22mm), and M22 (32mm).
 * - Incorporates a precision-machined circular underside washer bearing face step (dw).
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_931_HEX_BOLT = {
  "M3":   [3.0,  5.5,  2.0,  4.6,  0.1],
  "M4":   [4.0,  7.0,  2.8,  5.9,  0.2],
  "M5":   [5.0,  8.0,  3.5,  6.9,  0.2],
  "M6":   [6.0,  10.0, 4.0,  8.9,  0.25],
  "M8":   [8.0,  13.0, 5.3,  11.6, 0.4],
  "M10":  [10.0, 17.0, 6.4,  15.6, 0.4],  // Legacy DIN 17mm WAF (ISO uses 16mm)
  "M12":  [12.0, 19.0, 7.5,  17.4, 0.6],  // Legacy DIN 19mm WAF (ISO uses 18mm)
  "M14":  [14.0, 22.0, 8.8,  20.5, 0.6],  // Legacy DIN 22mm WAF (ISO uses 21mm)
  "M16":  [16.0, 24.0, 10.0, 22.5, 0.6],
  "M18":  [18.0, 27.0, 11.5, 24.9, 0.6],
  "M20":  [20.0, 30.0, 12.5, 27.7, 0.8],
  "M22":  [22.0, 32.0, 14.0, 29.5, 0.8],  // Legacy DIN 32mm WAF (ISO uses 34mm)
  "M24":  [24.0, 36.0, 15.0, 33.3, 1.0],
  "M27":  [27.0, 41.0, 17.0, 38.0, 1.0],
  "M30":  [30.0, 46.0, 18.7, 42.8, 1.0],
  "M33":  [33.0, 50.0, 21.0, 46.6, 1.0],
  "M36":  [36.0, 55.0, 22.5, 51.1, 1.0],
  "M42":  [42.0, 65.0, 26.0, 59.9, 1.2],
  "M48":  [48.0, 75.0, 30.0, 69.5, 1.6],
  "M56":  [56.0, 85.0, 35.0, 78.7, 2.0],
  "M64":  [64.0, 95.0, 38.0, 88.2, 2.0]
}

/**
 * DIN 933: Hexagon head screws - Threaded up to the head, metric coarse.
 * 
 * MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_4017_HEX_SCREW
 * 
 * DESIGN NOTES:
 * - This standard governs precision fully threaded screws (threaded completely up to the head).
 * - Preserves the legacy DIN wrench/WAF spanner contact sizes for M10 (17mm), M12 (19mm), M14 (22mm), and M22 (32mm).
 * - Incorporates a precision circular underside washer bearing face step (dw).
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_933_HEX_SCREW = {
  "M3":   [3.0,  5.5,  2.0,  4.6,  0.1],
  "M4":   [4.0,  7.0,  2.8,  5.9,  0.2],
  "M5":   [5.0,  8.0,  3.5,  6.9,  0.2],
  "M6":   [6.0,  10.0, 4.0,  8.9,  0.25],
  "M8":   [8.0,  13.0, 5.3,  11.6, 0.4],
  "M10":  [10.0, 17.0, 6.4,  15.6, 0.4],  // Legacy DIN 17mm WAF (ISO uses 16mm)
  "M12":  [12.0, 19.0, 7.5,  17.4, 0.6],  // Legacy DIN 19mm WAF (ISO uses 18mm)
  "M14":  [14.0, 22.0, 8.8,  20.5, 0.6],  // Legacy DIN 22mm WAF (ISO uses 21mm)
  "M16":  [16.0, 24.0, 10.0, 22.5, 0.6],
  "M18":  [18.0, 27.0, 11.5, 25.3, 0.6],
  "M20":  [20.0, 30.0, 12.5, 28.2, 0.8],
  "M22":  [22.0, 32.0, 14.0, 30.0, 0.8],  // Legacy DIN 32mm WAF (ISO uses 34mm)
  "M24":  [24.0, 36.0, 15.0, 33.6, 0.8],
  "M27":  [27.0, 41.0, 17.0, 38.0, 1.0],
  "M30":  [30.0, 46.0, 18.7, 42.8, 1.0],
  "M33":  [33.0, 50.0, 21.0, 46.6, 1.0],
  "M36":  [36.0, 55.0, 22.5, 51.1, 1.0],
  "M42":  [42.0, 65.0, 26.0, 59.9, 1.2],
  "M48":  [48.0, 75.0, 30.0, 69.5, 1.6],
  "M56":  [56.0, 85.0, 35.0, 78.7, 2.0],
  "M64":  [64.0, 95.0, 40.0, 88.2, 2.0]
}

/**
 * DIN 6914: Hexagon bolts for high-strength structural bolting (HV bolts).
 * 
 * MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_7411_HEX_STRUCTURAL
 * 
 * DESIGN NOTES:
 * - This standard governs heavy-duty structural steel fasteners designed for high preloads.
 * - Features wider Width Across Flats (WAF) envelopes than standard bolts to maximize contact area.
 * - Product scope spans strictly from M12 to M36.
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_6914_HEX_STRUCTURAL = {
  "M12": [12.0, 22.0, 8.0, 20.1, 1.2],
  "M16": [16.0, 27.0, 10.0, 24.9, 1.2],
  "M20": [20.0, 32.0, 13.0, 29.5, 1.5],
  "M22": [22.0, 36.0, 14.0, 33.3, 1.5],
  "M24": [24.0, 41.0, 15.0, 38.0, 1.5],
  "M27": [27.0, 46.0, 17.0, 42.8, 2.0],
  "M30": [30.0, 50.0, 19.0, 46.5, 2.0],
  "M36": [36.0, 60.0, 23.0, 55.9, 2.0]
}

/**
 * DIN 7985: Cross recessed pan head screws.
 * 
 * MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_7045_PAN_MACHINE
 * 
 * DESIGN NOTES:
 * - This standard governs precision, cross-recessed pan head machine screws.
 * - Used exclusively for smaller mechanical and electronic assemblies (M2 up to M10).
 * - Because it is a circular head profile, the 2nd slot tracks Head Diameter (dk).
 * - The 4th slot tracks the flat underside bearing surface diameter (dw) per DIN geometric limits.
 * 
 * Entries: ISO size: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const DIN_7985_PAN_MACHINE = {
  "M2":   [2.0,  4.0, 1.6,  3.6, 0.2],
  "M2.5": [2.5,  5.0, 2.0,  4.5, 0.2],
  "M3":   [3.0,  6.0, 2.4,  5.4, 0.2],
  "M3.5": [3.5,  7.0, 2.6,  6.3, 0.3],
  "M4":   [4.0,  8.0, 3.1,  7.2, 0.3],
  "M5":   [5.0, 10.0, 3.8,  9.0, 0.4],
  "M6":   [6.0, 12.0, 4.6, 10.8, 0.4],
  "M8":   [8.0, 16.0, 6.0, 14.4, 0.5],
  "M10":  [10.0, 20.0, 7.5, 18.0, 0.6]
}

const standards = {
  'ISO_4014_HEX_BOLT': ISO_4014_HEX_BOLT,
  'ISO_4016_HEX_BOLT_C': ISO_4016_HEX_BOLT_C,
  'ISO_4017_HEX_SCREW': ISO_4017_HEX_SCREW,
  'ISO_7411_HEX_STRUCTURAL': ISO_7411_HEX_STRUCTURAL,
  'ISO_7045_PAN_MACHINE': ISO_7045_PAN_MACHINE,

  'DIN_601_HEX_BOLT_C': DIN_601_HEX_BOLT_C,
  'DIN_931_HEX_BOLT' : DIN_931_HEX_BOLT,
  'DIN_933_HEX_SCREW': DIN_933_HEX_SCREW,
  'DIN_6914_HEX_STRUCTURAL': DIN_6914_HEX_STRUCTURAL,
  'DIN_7985_PAN_MACHINE': DIN_7985_PAN_MACHINE,
}

/**
 * Get the ISO Hex Bolt dimensions for the given specification.
 *
 * @see parseBoltSpec() for parsing of text specifications
 *
 * NOTE: All dimensions are millimeters.
 *
 * If the standard is not provided then a standard will be select using the type of bolt
 *
 * @memberof jscad-fastener/iso
 * @param {Object} spec - bolt specifications
 * @param {String} spec.size - ISO bolat size identifier (e.g., 'M6' for M6 ISO)
 * @param {String} [spec.standard=null] - bolt standard; null or valid ISO standard
 * @param {String} [spec.type='CAP'] - type of bolt; CAP, STRUCTURAL, HEAVY, TAP
 * @param {String} [spec.threadSeries='COARSE'] - thread series of bolt; COARSE or FINE
 * @returns {Object} full ISO bolt specification with dimensions
 */
export const getHexBoltDimensions = (spec, nominalLength) => {
  let {
    size,
    standard = null,
    type = 'CAP',
    threadSeries = 'COARSE',
    flatOffset = 0,
    lengthOffset = 0,
  } = spec

  if (!size) return null

  size = size.startsWith("M") ? size : "M" + size
  type = type.toUpperCase()

  // select the standard using the given options if not provided
  if (!standard) {
    if (type === 'TAP') {
      standard = 'ISO_4017_HEX_SCREW'
    } else if (type === 'PAN') {
      standard = 'ISO_7045_PAN_MACHINE'
    } else if (type === 'HEAVY') {
      standard = 'ISO_4016_HEX_BOLT_C'
    } else if (type === 'STRUCTURAL') {
      standard = 'ISO_7411_HEX_STRUCTURAL'
    } else {
      type = 'CAP'
      standard = 'ISO_4014_HEX_BOLT'
    }
    // TODO machine
  }

  const dataset = standards[standard]
  if (!dataset) return null

  // get the dimensions for the requested size
  const dims = dataset[size]
  if (!dims) return null

  const majorDiameter = dims[MAJOR_DIAMETER] + (flatOffset * 2) // d
  const widthAcrossFlats= dims[WIDTH_ACROSS_FLATS] + (flatOffset * 2) // s
  const headHeight= dims[HEAD_HEIGHT] + (lengthOffset) // k
  const bearingFaceDiameter = dims[BEARING_FACE_DIAMETER] // dw
  const filletRadius = dims[FILLET_RADIUS] // f

  // identify fully threaded standards
  const isFullyThreadedStandard = [
    'ISO_4017_HEX_SCREW', 
    'DIN_933_HEX_SCREW', 
    'ISO_7045_PAN_MACHINE', 
    'DIN_7985_PAN_MACHINE'
  ].includes(standard)

  let threadLength = 0
  let unthreadedLength = 0

  const threadSpec = getThreadSpec(size, threadSeries)
  const pitch = threadSpec.pitch
  if (isFullyThreadedStandard) {
    threadLength = nominalLength
    unthreadedLength = 2.5 * pitch
  } else {
    // apply ISO 888 length tier rules for partially threaded bolts
    let computedThreadLength = 0
    if (nominalLength <= 125) {
      computedThreadLength = (2 * majorDiameter) + 6
    } else if (nominalLength <= 200) {
      computedThreadLength = (2 * majorDiameter) + 12
    } else {
      computedThreadLength = (2 * majorDiameter) + 25
    }

    // handle short-bolt fallback (if nominal length is less than the standard thread length)
    if (nominalLength <= computedThreadLength) {
      threadLength = nominalLength
      unthreadedLength = 2.5 * pitch
    } else {
      threadLength = computedThreadLength
      unthreadedLength = nominalLength - computedThreadLength
    }
  }

  // enforce standard engineering 2-decimal rounding
  threadLength = Number(threadLength.toFixed(2))
  unthreadedLength = Number(unthreadedLength.toFixed(2))

  return {
    // spec
    size,
    standard,
    type,
    threadSeries,
    // dimensions
    majorDiameter,
    widthAcrossFlats,
    headHeight,
    bearingFaceDiameter,
    filletRadius,
    threadLength,
    unthreadedLength,
  }
}

/**
 * Generate ISO Hex Bolt from the given specification.
 *
 * @see getHexBoltDimensions() for obtaining correct dimensions
 *
 * NOTE: All dimensions are millimeters.
 *
 * @memberof jscad-fastener/iso
 * @param {Object} spec - bolt specifications
 * @param {String} spec.size - ISO size identifier (e.g., 'M6' for M6 ISO)
 * @param {String} spec.threadSeries - thread series of bolt; COARSE or FINE
 * @returns {Geom3} ISO bolt, centered on X-Y, head above Z, shank below Z
 */
export const generateHexBolt = (spec) => {
  const {
    // spec
    size,
    threadSeries,
    // dimensions
    majorDiameter,
    widthAcrossFlats,
    headHeight,
    bearingFaceDiameter,
    filletRadius,
    threadLength,
    unthreadedLength,
    segments = 36
  } = spec

  // create the bolt head from the specifications
  const head = HexHead({widthAcrossFlats, headHeight, bearingFaceDiameter, filletRadius, majorDiameter, segments})

  // create the shank from the specifications and the thread specifications
  const threadSpec = getThreadSpec(size, threadSeries)
  const pitch = threadSpec.pitch
  const shank = Shank({ threadLength, unthreadedLength, majorDiameter, pitch, segments })

  const bolt = union(head, shank)
  bolt.spec = spec
  return bolt
}

