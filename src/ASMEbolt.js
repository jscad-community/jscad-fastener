import { union } from '@jscad/modeling';

import { generateHexHead, generateShank } from './bolt.js'

// Dimensions Offsets
const MAJOR_DIAMETER = 0
const WIDTH_ACROSS_FLATS = 1
const HEAD_HEIGHT = 2
const WASHER_DIAMETER = 3
const FILLET_RADIUS = 4

/**
 * Master Registry for ASME B18 Hex Cap Screws
 *
 * Core Reference: 
 *   - Sizes #2 to #12: ASME B18.6.3 Hex Washer Head Machine Screws (dw = Washer Flange Diameter)
 *   - Sizes 1/4" to 4": ASME B18.2.1 Hex Cap Screws (dw = Under-head Circular Boss Face)
 *
 * NOTE: Sizes #0 and #1 do not have standardized external hex heads under ASME B18.6.3.
 *
 * All values are preserved in native fractional/decimal inches (in).
 *
 * "Designation": [majorDiameter (d), widthAcrossFlats (s), headHeight (k), washerFaceDiameter (dw), filletRadius (r)]
 */
export const ASME_HEX_HEAD_REGISTRY = {
  // --- ASME B18.6.3 Miniature Machine Screw Series (#2 to #12) ---
  "2":     [0.0860, 0.1250, 0.0500, 0.1660, 0.010],
  "3":     [0.0990, 0.1875, 0.0550, 0.2430, 0.015],
  "4":     [0.1120, 0.1875, 0.0600, 0.2430, 0.015],
  "5":     [0.1250, 0.1880, 0.0700, 0.2600, 0.015],
  "6":     [0.1380, 0.2500, 0.0930, 0.3280, 0.020],
  "8":     [0.1640, 0.2500, 0.1100, 0.3480, 0.025],
  "10":    [0.1900, 0.3125, 0.1200, 0.4140, 0.030],
  "12":    [0.2160, 0.3125, 0.1550, 0.4320, 0.030],

  // --- ASME B18.2.1 Standard Fractional Fastener Series (1/4" to 1-1/2") ---
  "1/4":   [0.2500, 0.4375, 0.1630, 0.4050, 0.015],
  "5/16":  [0.3125, 0.5000, 0.2110, 0.4680, 0.015],
  "3/8":   [0.3750, 0.5625, 0.2380, 0.5310, 0.015],
  "7/16":  [0.4375, 0.6250, 0.2840, 0.5890, 0.015],
  "1/2":   [0.5000, 0.7500, 0.3210, 0.7130, 0.015],
  "9/16":  [0.5625, 0.8125, 0.3670, 0.7700, 0.020],
  "5/8":   [0.6250, 0.9375, 0.4060, 0.8900, 0.020],
  "3/4":   [0.7500, 1.1250, 0.4870, 1.0740, 0.020],
  "7/8":   [0.8750, 1.3125, 0.5640, 1.2580, 0.020],
  "1":     [1.0000, 1.5000, 0.6410, 1.4380, 0.020],
  "1-1/8": [1.1250, 1.6875, 0.7180, 1.6200, 0.030],
  "1-1/4": [1.2500, 1.8750, 0.8100, 1.8000, 0.030],
  "1-3/8": [1.3750, 2.0625, 0.8870, 1.9810, 0.030],
  "1-1/2": [1.5000, 2.2500, 0.9650, 2.1620, 0.030],
  
  // --- ASME B18.2.1 Large Industrial Infrastructure Extensions (1-5/8" to 4") ---
  "1-5/8": [1.6250, 2.4375, 1.0450, 2.3400, 0.060],
  "1-3/4": [1.7500, 2.6250, 1.1230, 2.5200, 0.060],
  "1-7/8": [1.8750, 2.8125, 1.2010, 2.7000, 0.060],
  "2":     [2.0000, 3.0000, 1.2790, 2.8800, 0.060],
  "2-1/4": [2.2500, 3.3750, 1.4350, 3.2400, 0.060],
  "2-1/2": [2.5000, 3.7500, 1.5910, 3.6000, 0.060],
  "2-3/4": [2.7500, 4.1250, 1.7470, 3.9600, 0.060],
  "3":     [3.0000, 4.5000, 1.9030, 4.3200, 0.060],
  "3-1/4": [3.2500, 4.8750, 2.0760, 4.6790, 0.080],
  "3-1/2": [3.5000, 5.2500, 2.2340, 5.0400, 0.080],
  "3-3/4": [3.7500, 5.6250, 2.3920, 5.4000, 0.080],
  "4":     [4.0000, 6.0000, 2.5500, 5.7600, 0.080]
};

const MM_PER_INCH = 25.4

/**
 * Generate ASME Bolt from the given specification.
 *
 * @see parseASMEBolt() and parseASMEFastener()
 *
 * @param {Object} specification - bolt specification
 * @param {String} specification.size - Dimension identifier (e.g., '#1' or `1/2`)
 * @param {String} specifiation.standard - Bolt standard; ASME_B18_2_1_CAP_SCREW, etc
 * @param {String} specifiation.threadSeries - Thread series of bolt; UNF or UNC
 * @param {Number} nominalLength - nominal length of the shank (inches)
 * @returns {Geom3} ASME bolt, centered on X-Y, head above Z, shank below Z
 */
export const generateASMEBolt = (specification = {}, nominalLength) => {
  let {
    size = '1/2',
    standard = 'ASME_B18_2_1_CAP_SCREW',
    threadSeries = 'UNC',
    segments = 36
  } = specification

  const headSpecs = ASME_HEX_HEAD_REGISTRY[size]
  if (!headSpecs) {
    throw new Error(`Missing bolt head specification for size [${size}]`)
  }

  let widthAcrossFlats= headSpecs[WIDTH_ACROSS_FLATS] // s
  let headHeight= headSpecs[HEAD_HEIGHT] // k
  let washerFaceDiameter = headSpecs[WASHER_DIAMETER] // dw
  let filletRadius = headSpecs[FILLET_RADIUS] // f
  let majorDiameter = headSpecs[MAJOR_DIAMETER] // d

  let threadLength = 0
  let unthreadedLength = 0

  if (standard === "ASME_B18_2_1_TAP_BOLT" || standard === "ASME_B18_6_3_MACHINE") {
    // Fully Threaded Strategy
    threadLength = nominalLength
    unthreadedLength = 0
  } else if (standard === "ASME_B18_2_6_STRUCTURAL") {
    // ASME B18.2.6 Heavy Structural Fixed Thread Length Array (Short grip bounds)
    const fixedLT = (2 * majorDiameter + 0.25)
    threadLength = Math.min(fixedLT, nominalLength)
    unthreadedLength = nominalLengthInches - threadLength
  } else {
    // Standard ASME B18.2.1 Commercial Hex / Heavy Hex Cap Screw Formula
    // ASME_B18_2_1_CAP_SCREW
    // ASME_B18_2_1_HEAVY_BOLT
    // ASME_B18_2_1_HEX_BOLT
    let computedLT = 0
    if (nominalLength <= 6.0) {
      computedLT = (2 * majorDiameter) + 0.25 // 2D + 1/4"
    } else {
      computedLT = (2 * majorDiameter) + 0.50 // 2D + 1/2"
    }
    if (computedLT >= nominalLength) {
      // calculate structural rules
      const pitchInches = 1 / threadsPerInch;
      const maxRunout = majorDiameter <= 1.0 ? (2.5 * pitchInches) : (3.5 * pitchInches);

      unthreadedLength = maxRunout
      threadLength = nominalLength - unthreadedLength
    } else {
      threadLength = Math.min(computedLT, nominalLength)
      unthreadedLength = nominalLength - threadLength
    }
  }

  // convert inches to millimeter
  widthAcrossFlats = widthAcrossFlats * MM_PER_INCH
  headHeight = headHeight * MM_PER_INCH
  washerFaceDiameter = washerFaceDiameter * MM_PER_INCH
  filletRadius = filletRadius * MM_PER_INCH
  majorDiameter = majorDiameter * MM_PER_INCH
  threadLength = threadLength * MM_PER_INCH
  unthreadedLength = unthreadedLength * MM_PER_INCH

  // create the bolt head from the determined specifications
  const head = generateHexHead({widthAcrossFlats, headHeight, washerFaceDiameter, filletRadius, majorDiameter, segments})

  // NOTE: standard here is the thread standard
  const shank = generateShank({ standard: 'UTS', size, threadSeries, threadLength, unthreadedLength, segments })

  return union(head, shank)
}

