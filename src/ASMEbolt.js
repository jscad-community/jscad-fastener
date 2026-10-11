import { union } from '@jscad/modeling';

import { getThreadSpec } from './UTSthreads.js'
import { HexHead, Shank } from './bolt.js'

// Dimensions Offsets
const MAJOR_DIAMETER = 0
const WIDTH_ACROSS_FLATS = 1
const HEAD_HEIGHT = 2
const WASHER_DIAMETER = 3
const FILLET_RADIUS = 4

/**
 * "Designation": [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 */
export const ASME_B18_2_1_CAP_SCREW = {
  // Pattern: [majorDiameter, widthAcrossFlats, headHeight, bearingFaceDiameter, filletRadius]
  "1/4":   [0.2500, 0.4375, 0.1630, 0.4010, 0.015],
  "5/16":  [0.3125, 0.5000, 0.2110, 0.4600, 0.015],
  "3/8":   [0.3750, 0.5625, 0.2430, 0.5180, 0.015],
  "7/16":  [0.4375, 0.6250, 0.2910, 0.5740, 0.015],
  "1/2":   [0.5000, 0.7500, 0.3230, 0.6960, 0.015],
  "9/16":  [0.5625, 0.8125, 0.3710, 0.7520, 0.020],
  "5/8":   [0.6250, 0.9375, 0.4030, 0.8710, 0.020],
  "3/4":   [0.7500, 1.1250, 0.4830, 1.0500, 0.020],
  "7/8":   [0.8750, 1.3125, 0.5630, 1.2310, 0.020],
  "1":   [1.0000, 1.5000, 0.6270, 1.4080, 0.030],
  "1-1/8": [1.1250, 1.6875, 0.7180, 1.5830, 0.030],
  "1-1/4": [1.2500, 1.8750, 0.8130, 1.7660, 0.030],
  "1-3/8": [1.3750, 2.0625, 0.8780, 1.9440, 0.030],
  "1-1/2": [1.5000, 2.2500, 0.9740, 2.1250, 0.030],
  "1-3/4": [1.7500, 2.6250, 1.1340, 2.4860, 0.045],
  "2":   [2.0000, 3.0000, 1.2630, 2.8460, 0.045],
  "2-1/4": [2.2500, 3.3750, 1.4230, 3.2080, 0.060],
  "2-1/2": [2.5000, 3.7500, 1.5830, 3.5690, 0.060],
  "2-3/4": [2.7500, 4.1250, 1.7440, 3.9310, 0.060],
  "3":   [3.0000, 4.5000, 1.9350, 4.2920, 0.060]
}

/**
 * "Designation": [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 */
export const ASME_B18_2_1_HEAVY_BOLT = {
  "1/2":   [0.500, 0.875, 0.344, 0.814, 0.031],
  "5/8":   [0.625, 1.063, 0.422, 0.998, 0.062],
  "3/4":   [0.750, 1.250, 0.500, 1.183, 0.062],
  "7/8":   [0.875, 1.438, 0.578, 1.368, 0.062],
  "1":   [1.000, 1.625, 0.656, 1.551, 0.094],
  "1-1/8": [1.125, 1.813, 0.750, 1.734, 0.094],
  "1-1/4": [1.250, 2.000, 0.844, 1.918, 0.094],
  "1-3/8": [1.375, 2.188, 0.906, 2.102, 0.094],
  "1-1/2": [1.500, 2.375, 1.000, 2.286, 0.094],
  // Extended Industrial Range (Using ASME B18.2.1 formula limits)
  "1-3/4": [1.750, 2.750, 1.156, 2.658, 0.125],
  "2":   [2.000, 3.125, 1.313, 3.029, 0.125],
  "2-1/4": [2.250, 3.500, 1.500, 3.400, 0.125],
  "2-1/2": [2.500, 3.875, 1.656, 3.771, 0.188],
  "2-3/4": [2.750, 4.250, 1.844, 4.143, 0.188],
  "3":   [3.000, 4.625, 2.000, 4.514, 0.188]
}

/**
 * "Designation": [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 */
export const ASME_B18_6_3_MACHINE = {
  // Numbered Machine Screw Sizes
  "#2":    [0.0860, 0.1250, 0.0500, 0.1130, 0.0050],
  "#3":    [0.0990, 0.1875, 0.0550, 0.1690, 0.0050],
  "#4":    [0.1120, 0.1875, 0.0600, 0.1690, 0.0050],
  "#5":    [0.1250, 0.2500, 0.0700, 0.2250, 0.0050],
  "#6":    [0.1380, 0.2500, 0.0930, 0.2250, 0.0050],
  "#8":    [0.1640, 0.2500, 0.1100, 0.2250, 0.0050],
  "#10":   [0.1900, 0.3125, 0.1200, 0.2810, 0.0050],
  "#12":   [0.2160, 0.3125, 0.1550, 0.2810, 0.0050],
  // Fractional Machine Screw Sizes
  "1/4":   [0.2500, 0.3750, 0.1900, 0.3370, 0.0100],
  "5/16":  [0.3125, 0.5000, 0.2300, 0.4500, 0.0100],
  "3/8":   [0.3750, 0.5625, 0.2800, 0.5060, 0.0100],
  "7/16":  [0.4375, 0.6250, 0.3200, 0.5620, 0.0100],
  "1/2":   [0.5000, 0.7500, 0.3800, 0.6750, 0.0100],
  "9/16":  [0.5625, 0.8125, 0.4200, 0.7310, 0.0150],
  "5/8":   [0.6250, 0.9375, 0.4700, 0.8440, 0.0150],
  "3/4":   [0.7500, 1.1250, 0.5600, 1.0120, 0.0150]
}

/**
 * "Designation": [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 */
export const ASME_B18_2_1_HEX_BOLT = {
  "1/4":   [0.2500, 0.4375, 0.1630, 0.4375, 0.0150],
  "5/16":  [0.3125, 0.5000, 0.2110, 0.5000, 0.0150],
  "3/8":   [0.3750, 0.5625, 0.2430, 0.5625, 0.0150],
  "7/16":  [0.4375, 0.6250, 0.2910, 0.6250, 0.0150],
  "1/2":   [0.5000, 0.7500, 0.3230, 0.7500, 0.0150],
  "9/16":  [0.5625, 0.8125, 0.3710, 0.8125, 0.0200],
  "5/8":   [0.6250, 0.9375, 0.4030, 0.9375, 0.0200],
  "3/4":   [0.7500, 1.1250, 0.4830, 1.1250, 0.0200],
  "7/8":   [0.8750, 1.3125, 0.5630, 1.3125, 0.0200],
  "1":   [1.0000, 1.5000, 0.6270, 1.5000, 0.0300],
  "1-1/8": [1.1250, 1.6875, 0.7180, 1.6875, 0.0300],
  "1-1/4": [1.2500, 1.8750, 0.8130, 1.8750, 0.0300],
  "1-3/8": [1.3750, 2.0625, 0.8780, 2.0625, 0.0300],
  "1-1/2": [1.5000, 2.2500, 0.9740, 2.2500, 0.0300],
  "1-3/4": [1.7500, 2.6250, 1.1340, 2.6250, 0.0400],
  "2":   [2.0000, 3.0000, 1.2940, 3.0000, 0.0400],
  "2-1/4": [2.2500, 3.3750, 1.4540, 3.3750, 0.0400],
  "2-1/2": [2.5000, 3.7500, 1.6140, 3.7500, 0.0400],
  "2-3/4": [2.7500, 4.1250, 1.7740, 4.1250, 0.0400],
  "3":   [3.0000, 4.5000, 1.9340, 4.5000, 0.0400]
}

/**
 * "Designation": [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]
 */
export const ASME_B18_2_1_TAP_BOLT = {
  "1/4":   [0.2500, 0.4375, 0.1630, 0.4375, 0.015],
  "5/16":  [0.3125, 0.5000, 0.2110, 0.5000, 0.015],
  "3/8":   [0.3750, 0.5625, 0.2430, 0.5625, 0.015],
  "7/16":  [0.4375, 0.6250, 0.2910, 0.6250, 0.015],
  "1/2":   [0.5000, 0.7500, 0.3230, 0.7500, 0.015],
  "9/16":  [0.5625, 0.8125, 0.3710, 0.8125, 0.020],
  "5/8":   [0.6250, 0.9375, 0.4030, 0.9375, 0.020],
  "3/4":   [0.7500, 1.1250, 0.4830, 1.1250, 0.020],
  "7/8":   [0.8750, 1.3125, 0.5630, 1.3125, 0.020],
  "1":   [1.0000, 1.5000, 0.6270, 1.5000, 0.030],
  "1-1/8": [1.1250, 1.6875, 0.7180, 1.6875, 0.030],
  "1-1/4": [1.2500, 1.8750, 0.8130, 1.8750, 0.030],
  "1-3/8": [1.3750, 2.0625, 0.8780, 2.0625, 0.030],
  "1-1/2": [1.5000, 2.2500, 0.9740, 2.2500, 0.030],
  "1-3/4": [1.7500, 2.6250, 1.1340, 2.6250, 0.040],
  "2":   [2.0000, 3.0000, 1.2630, 3.0000, 0.040]
};

const MM_PER_INCH = 25.4

const standards = {
  'ASME_B18_2_1_CAP_SCREW': ASME_B18_2_1_CAP_SCREW,
  'ASME_B18_2_6_STRUCTURAL': ASME_B18_2_1_HEAVY_BOLT,
  'ASME_B18_6_3_MACHINE': ASME_B18_6_3_MACHINE,
  'ASME_B18_2_1_HEAVY_BOLT': ASME_B18_2_1_HEAVY_BOLT,
  'ASME_B18_2_1_HEX_BOLT': ASME_B18_2_1_HEX_BOLT,
  'ASME_B18_2_1_TAP_BOLT': ASME_B18_2_1_TAP_BOLT,
}

/**
 * NOTE: All dimensions are inches.
 */
export const getHexBoltDimensions = (spec = {}, nominalLength) => {
  let {
    size,
    standard = null,
    threadSeries = 'UNC',
    isHeavy = false,
    isTap = false,
    flatOffset = 0,
    lengthOffset = 0,
  } = spec

  if (!size) return null

  // select the standard using the given options if not provided
  if (!standard) {
    if (!standard && isTap) standard = 'ASME_B18_2_1_TAP_BOLT'
    if (!standard && isHeavy) standard = 'ASME_B18_2_1_HEAVY_BOLT'
    if (!standard) standard = 'ASME_B18_2_1_HEX_BOLT'
    // TODO cap machine strutural
  }

  let dataset = standards[standard]
  if (!dataset) return null

  // get the dimensions for the requested size
  const dims = dataset[size]
  if (!dims) return null

  let majorDiameter = dims[MAJOR_DIAMETER] + (flatOffset * 2) // d
  let widthAcrossFlats= dims[WIDTH_ACROSS_FLATS] + (flatOffset * 2) // s
  let headHeight= dims[HEAD_HEIGHT] + (lengthOffset) // k
  let bearingFaceDiameter = dims[WASHER_DIAMETER] // dw
  let filletRadius = dims[FILLET_RADIUS] // f

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
    unthreadedLength = nominalLength - threadLength
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
      const threadSpec = getThreadSpec(size, threadSeries)
      const pitchInches = 1 / threadSpec.pitch
      const maxRunout = majorDiameter <= 1.0 ? (2.5 * pitchInches) : (3.5 * pitchInches);

      unthreadedLength = maxRunout
      threadLength = nominalLength - unthreadedLength
    } else {
      threadLength = Math.min(computedLT, nominalLength)
      unthreadedLength = nominalLength - threadLength
    }
  }
  threadLength = Number(threadLength.toFixed(2))
  unthreadedLength = Number(unthreadedLength.toFixed(2))

  return {
    // spec
    size,
    standard,
    threadSeries,
    isHeavy,
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
 * Generate ASME Hex Bolt from the given specification.
 *
 * @see getHexBoltDimensions()
 *
 * @param {Object} spec - bolt specification
 * @param {String} spec.size - Dimension identifier (e.g., '#1' or `1/2`)
 * @param {String} spec.standard - Bolt standard; ASME_B18_2_1_CAP_SCREW, etc
 * @param {String} spec.threadSeries - Thread series of bolt; UNF or UNC
 * @returns {Geom3} ASME bolt, centered on X-Y, head above Z, shank below Z
 */
export const generateHexBolt = (spec) => {
  let {
    // spec
    size,
    standard,
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

  // 1. Thread and Stress-Concentration Geometry (Strict 3 Decimals)
  majorDiameter       = Number((majorDiameter * MM_PER_INCH).toFixed(3));
  filletRadius        = Number((filletRadius * MM_PER_INCH).toFixed(3));

  // 2. Tooling & Socket Wrench Interfaces (Up to 3 Decimals for fractional accuracy)
  widthAcrossFlats    = Number((widthAcrossFlats * MM_PER_INCH).toFixed(3));

  // 3. Clearances, Heights, and General Tolerances (Strict 2 Decimals)
  headHeight          = Number((headHeight * MM_PER_INCH).toFixed(2));
  bearingFaceDiameter = Number((bearingFaceDiameter * MM_PER_INCH).toFixed(2));
  threadLength        = Number((threadLength * MM_PER_INCH).toFixed(2));
  unthreadedLength    = Number((unthreadedLength * MM_PER_INCH).toFixed(2));

  // create the bolt head from the specifications
  const head = HexHead({widthAcrossFlats, headHeight, bearingFaceDiameter, filletRadius, majorDiameter, segments})

  // create the shank from the specifications and the thread specifications
  const threadSpec = getThreadSpec(size, threadSeries)

  let pitch = MM_PER_INCH / threadSpec.pitch
  // Mandatory ASME B1.30M Rule: Thread pitch metrics must be exactly 4 decimal places
  pitch = Number(pitch.toFixed(4))

  const shank = Shank({ threadLength, unthreadedLength, majorDiameter, pitch, segments })

  const bolt = union(head, shank)
  bolt.spec = spec
  return bolt
}

