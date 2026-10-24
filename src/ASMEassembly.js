import { translate } from '@jscad/modeling'

import { parseBoltSpec, parseNutSpec, parseWasherSpec } from './ASMEspecification.js'
import { getBoltDimensions, generateHexBolt } from './ASMEbolt.js'
import { getNutDimensions, generateNut } from './ASMENut.js'
import { getWasherDimensions, generateWasher } from './ASMEwasher.js'


/*
 * Full Assembly Parser for ASME Systems
 * Takes a compound engineering stack description and parses into ASME specifications.
 * @returns {Object} ASME bolt, nut, and washer specifications
 */

/*
 * Procedural Classification Helper for ASME Fasteners
 * Categorizes a string token using imperial structural anchor clues.
 */
const determineFastenerType = (chunk) => {
  const text = chunk.toUpperCase()

  // 1. WASHER ANCHORS: ASME B18.22.1 standards or explicit keywords
  if (text.includes('B18.22') || text.includes('WASHER') || text.includes('PLAIN') || text.includes('FLAT')) {
    return 'WASHER'
  }

  // 2. NUT ANCHORS: ASME B18.2.2 standards or explicit keywords
  if (text.includes('B18.2.2') || text.includes('NUT') || text.includes('HEX NUT') || text.includes('JAM')) {
    return 'NUT'
  }

  // 3. BOLT ANCHORS: ASME standards, thread series (UNC/UNF), grades (Grade 5/8), lengths, or bolt keywords
  const hasLengthToken = /X\s*\d+(?:\.\d+)?(?:\s*|\$|-|\b)/ 
  if (
    text.includes('B18.2.1') || 
    text.includes('B18.3') ||
    text.includes('UNC') || 
    text.includes('UNF') || 
    text.includes('GRADE') ||
    text.includes('BOLT') || 
    text.includes('SCREW') || 
    text.includes('CAP') ||
    hasLengthToken.test(text)
  ) {
    return 'BOLT'
  }

  return null
}

/**
 * Parses an ASME compound engineering stack description into specifications
 * for bolt, nut, and washer.
 *
 * @memberof jscad-fastener/asme
 * @param {string} callout - the full compound engineering callout string
 * @returns {Object} ASME bolt, nut, and washer specifications (nut/washer may be null)
 *
 * @example
 * const specs = parseAssembly("Hex cap screw ASME B18.2.1 - 1/2-13 x 2.5 - Grade 5, with Plain washer ASME B18.22.1, Hex nut ASME B18.2.2")
 */
export const parseAssembly = (callout) => {
  if (!callout || typeof callout !== 'string') {
    throw new Error("Invalid or empty ASME callout string")
  }

  // Normalize delimiters to clean commas
  const normalized = callout.replace(/\s+/g, ' ').replace(/\s*\+\s*/g, ', ').replace(/\s*;\s*/g, ', ').trim()
  const subComponents = normalized.split(/(?:,|\bwith\b|\bw\/\s*)/i)
  
  let boltString = null
  let washerString = null
  let nutString = null
  
  let sharedSizeContext = null  // e.g., "1/2" or "#10" or "0.250"
  let sharedTPIContext = null   // e.g., "13" or "32" (Threads Per Inch)

  // Step 1: Classification
  subComponents.forEach((component) => {
    const cleanChunk = component.trim()
    if (!cleanChunk) return

    const type = determineFastenerType(cleanChunk) 

    if (type === 'BOLT') boltString = cleanChunk
    else if (type === 'WASHER') washerString = cleanChunk
    else if (type === 'NUT') nutString = cleanChunk
  })

  if (!boltString) {
    throw new Error("ASME assembly parsing failed: No identifiable bolt segment located in the callout string.")
  }

  // Step 2: Context Extraction for Imperial Fasteners
  // Captures fractional sizes (1/4, 1/2), numbers (#10, No.8), or decimals (0.250) up to 3 segments
  // Enforces a strict word boundary or whitespace anchor, and ensures the number does NOT follow a period
  // Capture mixed fractions and protected the TPI with a negative lookahead
  const imperialSizeRegex = /(?:^|\s)(?:#|NO\.?\s*)?((?<![A-Z0-9\.])\d+(?:[\s-]\d+\/\d+)?|\d+\/\d+)\s*-\s*(\d+)(?![0-9\/])(?:\s*x\s*(\d+(?:\/\d+)?))?/i
  const sizeMatch = boltString.match(imperialSizeRegex)

  if (sizeMatch) {
    // Clean up spacing and drop any internal hyphens (e.g., "1-1/4" -> "1 1/4")
    let extractedSize = sizeMatch[1].replace(/-/g, ' ').trim()
    
    // Fix B: Enforce the # prefix logic natively based strictly on the matched size, not the entire string
    if (/^\d+$/.test(extractedSize)) {
      const validNumberedSizes = ['0', '2', '3', '4', '5', '6', '8', '10', '12']
      if (validNumberedSizes.includes(extractedSize) || boltString.toUpperCase().includes('#') || boltString.toUpperCase().includes('NO.')) {
        extractedSize = `#${extractedSize}`
      }
    }

    sharedSizeContext = extractedSize
    sharedTPIContext = sizeMatch[2]
  }


  // Step 3: Backward Context Injection
  // Checks if the string strictly starts with an explicit size descriptor 
  // (e.g., "1/2", "#10", "No. 8"). If not, it safely applies the shared context.
  const startsWithSizeRegex = /^(?:#|NO\.?\s*)?(\d+(?:\/\d+)?(?:\.\d+)?)/i

  if (washerString && !startsWithSizeRegex.test(washerString.trim()) && sharedSizeContext) {
    washerString = `${sharedSizeContext} ${washerString}`
  }

  if (nutString && !startsWithSizeRegex.test(nutString.trim()) && sharedSizeContext) {
    const tpiSuffix = sharedTPIContext ? `-${sharedTPIContext}` : ''
    nutString = `${sharedSizeContext}${tpiSuffix} ${nutString}`
  }

  return {
    bolt: parseBoltSpec(boltString),
    washer: washerString ? parseWasherSpec(washerString) : null,
    nut: nutString ? parseNutSpec(nutString) : null
  }
}

/**
 * Validate the assembly specifications prior to generation.
 *
 * @see parseAssembly() to obtain specifications from a compound engineering stack description
 *
 * Throws strict, explicit errors if physical or mechanical attributes mismatch.
 * 
 * @memberof jscad-fastener/asme
 * @param {Object} specifications - the specifications for bolt, nut (optional), and washer (optional)
 * @returns {Boolean} true if the stack specification passes all validations
 * @throws {Error} Detailed report of what failed along with the offending values
 */
export const validateAssembly = (specifications) => {
  if (!specifications || !specifications.bolt) {
    throw new Error("Invalid Assembly: Missing bolt specification")
  }

  const { bolt, washer, nut } = specifications
  const nominalSize = bolt.size // e.g., "1/2" or "#10"

  // 1. SIZE CONSISTENCY CHECKS
  if (washer && washer.size !== nominalSize) {
    throw new Error(`Invalid Assembly: Size mismatch. Bolt is ${nominalSize} but Washer is ${washer.size}`)
  }

  if (nut && nut.size !== nominalSize) {
    throw new Error(`Invalid Assembly: Size mismatch. Bolt is ${nominalSize} but Nut is ${nut.size}`)
  }

  // 2. THREAD PITCH COMPATIBILITY CHECKS
  if (nut && bolt.pitch && nut.pitch) {
    if (bolt.pitch !== nut.pitch) {
      throw new Error(`Invalid Assembly: Thread pitch mismatch. Bolt thread pitch is ${bolt.pitch} TPI but Nut thread pitch is ${nut.pitch} TPI`)
    }
  }

  // 3. MECHANICAL CLEARANCE (BOLT LENGTH CHECK)
  if (!bolt.length || isNaN(bolt.length)) {
    throw new Error(`Invalid Assembly: Missing bolt length specifier. Check the original callout specification.`)
  }

  let requiredMinimumLength = 0

  if (washer) {
    const washerSpec = getWasherDimensions(washer)
    if (!washerSpec) throw new Error(`Invalid Assembly: Missing washer dimensions`)
    requiredMinimumLength += washerSpec.thickness
  }

  if (nut) {
    const nutSpec = getNutDimensions(nut)
    if (!nutSpec) throw new Error(`Invalid Assembly: Missing nut dimensions`)
    requiredMinimumLength += nutSpec.height
  }

  // Dynamic TPI clearance buffer: Protrude at least 2 full threads past the nut face
  const threadPitchInches = 1.0 / bolt.pitch
  const safetyProtrusionBuffer = 2.0 * threadPitchInches
  requiredMinimumLength += safetyProtrusionBuffer

  if (bolt.length < requiredMinimumLength) {
    throw new Error(
      `Invalid Assembly: Bolt length (${bolt.length}") is too short for the requested assembly. ` +
      `which requires a minimum length of ${requiredMinimumLength.toFixed(3)}"`
    )
  }

  return true
}

/**
 * Generate a full assembly from the given specifications for bolt, nut, washer.
 *
 * @see parseAssembly() for parsing specifications from a compound engineering stack description 
 *
 * @memberof jscad-fastener/asme
 * @param {Object} specifications - the specifications of the assembly
 * @returns {Array} Array of geometries
 *
 * @example
 * const specs = parseAssembly("Hex Head Cap Screw 5/16-18 UNC x 2, Grade 8, Yellow Zinc")
 * const parts = generateAssembly(specs)
 */
export const generateAssembly = (specifications) => {
  // Guard validation check
  validateAssembly(specifications)

  const { bolt, washer, nut } = specifications
  const stack = []

  // 1. Calculate Core Component Dimensions
  const boltDims = getBoltDimensions(bolt, bolt.length)
  const washerDims = washer ? getWasherDimensions(washer) : null
  const nutDims = nut ? getNutDimensions(nut) : null

  // 2. Position the Bolt Mesh
  // If a washer is present, the underside of the bolt head rests atop the washer body.
  // Otherwise, the underside of the bolt head sits directly on the joint boundary face (Z = 0).
  const boltHeadBaseZ = washerDims ? washerDims.thickness : 0
  let boltMesh = generateHexBolt(boltDims)
  
  // Position bolt shank extending down through the joint from its head seating plane
  // Adjust by half the head height since the head object origin is centered inside its own primitive boundaries
  const boltZPosition = boltHeadBaseZ + (boltDims.headHeight / 2)
  boltMesh = translate([0, 0, boltZPosition], boltMesh)
  stack.push(boltMesh)

  // 3. Position the Optional Washer Mesh
  // The washer rests flat right over the joint channel opening (from Z = 0 to Z = washer thickness)
  if (washerDims) {
    let washerMesh = generateWasher(washerDims)
    const washerZPosition = washerDims.thickness / 2
    washerMesh = translate([0, 0, washerZPosition], washerMesh)
    stack.push(washerMesh)
  }

  // 4. Position the Optional Nut Mesh
  // The nut is threaded up from underneath the bottom exit boundary layer of the joint.
  // In your joint-face orientation, the bottom face of the joint is located at exactly -bolt.length + boltHeadBaseZ.
  if (nutDims) {
    let nutMesh = generateNut(nutDims)
    const jointBottomZ = boltHeadBaseZ - bolt.length
    
    // Position nut flush against the bottom exit layer, adjusting for its centered origin alignment
    const nutZPosition = jointBottomZ + (nutDims.height / 2)
    nutMesh = translate([0, 0, nutZPosition], nutMesh)
    stack.push(nutMesh)
  }

  return stack
}
