import { cylinder, mirrorZ, subtract, translate } from '@jscad/modeling'

import { parseBoltSpec, parseNutSpec, parseWasherSpec } from './ISOspecification.js'
import { getHexBoltDimensions, generateHexBolt } from './ISObolt.js'
import { getNutDimensions, generateNut } from './ISOnut.js'
import { getWasherDimensions, generateWasher } from './ISOwasher.js'

/*
 * Full Assembly Parser for ISO / Metric Systems
 * Takes a compound engineering stack description and parses into ISO specifications.
 * Supported Formats:
 *  - "Hexagon head bolt ISO 4014 - M12 x 80 - 8.8, with Plain washer ISO 7090, Hex nut ISO 4032"
 *  - "M6 x 0.75 x 40 Bolt + ISO 7092 Washer + ISO 4032 Nut"
 *  - "ISO 4017 Bolt M16 x 60 - 10.9 HDG Finish; ISO 7090 Washer; ISO 4032 Nut"
 *
 * @memberof jscad-fastener/iso
 * @returns {Object} ISO bolt, nut, and washer specifications
 */

/*
 * Procedural Classification Helper
 * Evaluates a clean string token and categorizes it using structural anchor clues.
 * 
 * @param {string} chunk - Trimmed text slice from the assembly specification string
 * @returns {string|null} 'BOLT', 'WASHER', 'NUT', or null if unidentifiable
 */
const determineFastenerType = (chunk) => {
  const text = chunk.toUpperCase()

  // 1. WASHER ANCHORS: Explicit washer standards, or literal keywords
  const washerISO = /\bISO\s*(7089|7090|7092|7093|7094|4759)\b/
  if (washerISO.test(text) || text.includes('WASHER') || text.includes('PLAIN') || text.includes('FLAT')) {
    return 'WASHER'
  }

  // 2. NUT ANCHORS: Explicit nut standards, or literal keywords
  const nutISO = /\bISO\s*(4032|4033|4034|4035|4036|4161|7040|7042)\b/
  if (nutISO.test(text) || text.includes('NUT') || text.includes('NYLOC') || text.includes('JAM')) {
    return 'NUT'
  }

  // 3. BOLT ANCHORS: Bolt standards, mechanical property/strength classes, or literal keywords
  const boltISO = /\bISO\s*(4014|4016|4017|4018|4762|7380|10642)\b/
  const propertyClass = /\b(8\.8|10\.9|12\.9|A2-70|A4-80)\b/
  const hasLengthToken = /X\s*\d+\s*(?:\$|\s|-|\b)/ // Looks for trailing length e.g., "x 80" or "x 40"
  
  if (
    boltISO.test(text) || 
    propertyClass.test(text) || 
    hasLengthToken.test(text) ||
    text.includes('BOLT') || 
    text.includes('SCREW') || 
    text.includes('SHCS') || 
    text.includes('HHCS')
  ) {
    return 'BOLT'
  }

  // Fallback case if an anonymous string is passed (e.g., just "M12 x 50" without the word "Bolt")
  if (hasLengthToken.test(text)) {
    return 'BOLT'
  }

  return null
}

/**
 * Parse a full ISO compound engineering stack description into specifications
 * for bolt, nut, and washer.
 *
 * @memberof jscad-fastener/iso
 * @param {string} callout - the full compound engineering callout string
 * @returns {Object} ISO bolt, nut, and washer specifications (nut/washer may be null)
 *
 * @example
 * const specs = parseAssembly("M12 x 1.25 x 50 Bolt, Washer, Nut")
 */
export const parseAssembly = (callout) => {
  // Normalize string spacing and uniform delimiters (+ or ; mapped to standard commas)
  const normalized = callout.replace(/\s+/g, ' ').replace(/\s*\+\s*/g, ', ').replace(/\s*;\s*/g, ', ').trim()
  
  // Split the compound string by commas or explicit "with" / "w/" conjunction boundaries
  const subComponents = normalized.split(/(?:,|\bwith\b|\bw\/\s*)/i)
  
  let boltString = null
  let washerString = null
  let nutString = null
  let sharedSizeContext = null   // e.g., "12" from M12
  let sharedPitchContext = null  // e.g., "1.25" for fine pitches

  // Step 1: Broad classification loop to sort text phrases into component buckets
  subComponents.forEach((component) => {
    const cleanChunk = component.trim()
    if (!cleanChunk) return

    const type = determineFastenerType(cleanChunk) 

    if (type === 'BOLT') boltString = cleanChunk
    else if (type === 'WASHER') washerString = cleanChunk
    else if (type === 'NUT') nutString = cleanChunk
  })

  // A bolt string is always mandatory to anchor a fastener assembly
  if (!boltString) {
    throw new Error("ISO assembly parsing failed: No identifiable bolt segment was found")
  }

  // Step 2: Extract explicit sizing context to handle shared shorthand patterns
  // Pattern parses up to 3 numeric groups: M[Diameter] x [Pitch/Length] x [Length]
  const multiDimensionRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+(?:\.\d+)?))?/i
  const threadMatch = boltString.match(multiDimensionRegex)

  if (threadMatch) {
    sharedSizeContext = threadMatch[1] // The primary diameter (e.g., "12")
    
    // Scenario A: Three distinct tokens matched (e.g., M12 x 1.25 x 50)
    if (threadMatch[3]) {
      sharedPitchContext = threadMatch[2]
      // Note: parseBoltSpec(boltString) handles the length mapping internally!
    } 
    // Scenario B: Two distinct tokens matched (e.g., M6 x 40)
    else if (threadMatch[2]) {
      const secondValue = parseFloat(threadMatch[2])
      const containsDecimal = threadMatch[2].includes('.')
      
      // If it's a small decimal, it's a pitch context
      if (containsDecimal && secondValue < 4.0) {
        sharedPitchContext = threadMatch[2]
      }
    }
  }

  // Step 3: Inject fallback sizing patterns to optional stacked hardware if present
  const checkMTextRegex = /M\d+/i

  const numericSize = sharedSizeContext ? sharedSizeContext.toString().replace(/^M/i, '') : ''

  if (washerString && !washerString.match(checkMTextRegex) && sharedSizeContext) {
    washerString = `M${numericSize} ${washerString}`
  }

  if (nutString && !nutString.match(checkMTextRegex) && sharedSizeContext) {
    const pitchSuffix = sharedPitchContext ? ` x ${sharedPitchContext}` : ''
    nutString = `M${numericSize}${pitchSuffix} ${nutString}`
  }

  // Step 4: Return specifications for each of the segments
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
 * @memberof jscad-fastener/iso
 * @param {Object} specifications - the specifications for bolt, nut (optional), and washer (optional)
 * @returns {Boolean} true if the stack specification passes all validations
 * @throws {Error} Detailed report of what failed along with the offending values
 */
export const validateAssembly = (specifications) => {
  if (!specifications || !specifications.bolt) {
    throw new Error("Invalid Assembly: Missing bolt specification")
  }

  const { bolt, washer, nut, segments = 18 } = specifications
  const nominalSize = bolt.size // e.g., "M12"

  // 1. DIAMETER CONSISTENCY CHECKS
  if (washer && washer.size !== nominalSize) {
    throw new Error(`Invalid Assembly: Nominal diameter mismatch; Bolt is ${nominalSize} but Washer is ${washer.size}`)
  }

  if (nut && nut.size !== nominalSize) {
    throw new Error(`Invalid Assembly: Nominal diameter mismatch; Bolt is ${nominalSize} but Nut is ${nut.size}`)
  }

  // 2. THREAD PITCH COMPATIBILITY CHECKS
  if (nut && bolt.pitch && nut.pitch) {
    if (bolt.pitch !== nut.pitch) {
      throw new Error(`Invalid Assembly: Thread pitch mismatch; Bolt thread pitch is ${bolt.pitch} but Nut thread pitch is ${nut.pitch}`)
    }
  }

  // 3. MECHANICAL CLEARANCE (BOLT LENGTH CHECK)
  if (!bolt.length || isNaN(bolt.length)) {
    throw new Error(`Invalid Assembly: Missing bolt length. See the orginal callout specification`)
  }

  let requiredMinimumLength = 0
  
  // account for physical hardware stack thickness
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

  // add a minimum thread engagement safety buffer (at least 2 full thread pitches protruding past the nut face)
  const safetyProtrusionBuffer = 2.0 * bolt.pitch
  requiredMinimumLength += safetyProtrusionBuffer

  if (bolt.length < requiredMinimumLength) {
    throw new Error(
      `Invalid Assembly: Bolt length (${bolt.length}) is too short for the requested assembly, ` +
      `which requires a minimum length of ${requiredMinimumLength.toFixed(1)}`
    )
  }

  return true
}

/**
 * Generate a full assembly from the given specifications for bolt, nut, washer.
 *
 * @see parseAssembly() for parsing specifications from a compound engineering stack description 
 *
 * @memberof jscad-fastener/iso
 * @param {Object} specifications - the specifications of the assembly
 * @returns {Array} Array of geometries
 *
 * @example
 * const specs = parseAssembly("Hexagon head bolt ISO 4014 - M12 x 80 - 8.8, with Plain washer ISO 7090, Hex nut ISO 4032")
 * const parts = generateAssembly(specs)
 */
export const generateAssembly = (specifications) => {
  // Phase 1: Validate structural integrity and physical clearance rules
  validateAssembly(specifications)

  const { bolt, washer, nut, segments = 18 } = specifications

  // Phase 2: Generate Geometries
  // Because validation passed, bolt.length is guaranteed to be a valid number here.
  const stack = []

  // 1. Build the bolt geometry
  const boltDims = getHexBoltDimensions(bolt, bolt.length)
  boltDims.segments = segments
  const boltMesh = generateHexBolt(boltDims)
  stack.push(boltMesh)

  // 2. Build and position the optional washer if present
  if (washer) {
    const washerDims = getWasherDimensions(washer)
    washerDims.segments = segments
    let washerMesh = generateWasher(washerDims)

    // Position washer directly flat against the underside of the bolt head
    const washerZPosition = 0 - (washerDims.thickness / 2)
    washerMesh = translate([0, 0, washerZPosition], washerMesh)
    stack.push(washerMesh)
  }

  // 3. Build and position the optional nut if present
  if (nut) {
    const nutDims = getNutDimensions(nut)
    nutDims.segments = segments
    let nutMesh = generateNut(nutDims)

    if (nut.drillingSpecifications && nut.drillingSpecifications.recommendedDrillBitSize) {
      const radius =  nut.drillingSpecifications.recommendedDrillBitSize / 2
      const drill = cylinder({height: nutDims.height + 1.0, radius, segments})
      nutMesh = subtract(nutMesh, drill)
    }

    // flip and position to sit at the end of the bolt
    nutMesh = mirrorZ(nutMesh)

    const nutZPosition = 0 - bolt.length + (nutDims.height / 2)
    nutMesh = translate([0, 0, nutZPosition], nutMesh)
    stack.push(nutMesh)
  }

  return stack
}

