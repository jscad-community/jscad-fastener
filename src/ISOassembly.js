import {parseBoltSpec, parseNutSpec, parseWasherSpec} from './ISOspecification.js'

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
import { parseBoltSpec, parseNutSpec, parseWasherSpec } from './ISOspecification.js'

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
 * Full Assembly Parser for ISO / Metric Systems
 * Breaks a compound engineering stack description into clean parsed specification tokens.
 *
 * @memberof jscad-fastener/iso
 * @param {string} fullAssemblyString - The full compound callout string
 * @returns {Object} ISO bolt, nut, and washer specifications (nut/washer may be null)
 */
export const parseAssembly = (fullAssemblyString) => {
  if (!fullAssemblyString || typeof fullAssemblyString !== 'string') {
    throw new Error("Invalid or empty assembly string provided.")
  }

  // Normalize string spacing and uniform delimiters (+ or ; mapped to standard commas)
  const normalized = fullAssemblyString.replace(/\s+/g, ' ').replace(/\s*\+\s*/g, ', ').replace(/\s*;\s*/g, ', ').trim()
  
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
    throw new Error("Assembly parsing failed: No identifiable Metric Bolt segment located in the callout string.")
  }

  // Step 2: Extract explicit sizing context to handle shared shorthand patterns
  // Pattern parses up to 3 numeric groups: M[Diameter] x [Pitch/Length] x [Length]
  const multiDimensionRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+(?:\.\d+)?))?/i
  const threadMatch = boltString.match(multiDimensionRegex)

  if (threadMatch) {
    sharedSizeContext = threadMatch[1]; // The primary diameter (e.g., "12")
    
    // Scenario A: Three distinct tokens matched (e.g., M12 x 1.25 x 50)
    if (threadMatch[3]) {
      sharedPitchContext = threadMatch[2];
      // Note: parseBoltSpec(boltString) handles the length mapping internally!
    } 
    // Scenario B: Two distinct tokens matched (e.g., M6 x 40)
    else if (threadMatch[2]) {
      const secondValue = parseFloat(threadMatch[2]);
      const containsDecimal = threadMatch[2].includes('.');
      
      // If it's a small decimal, it's a pitch context
      if (containsDecimal && secondValue < 4.0) {
        sharedPitchContext = threadMatch[2];
      }
    }
  }

  // Step 3: Inject fallback sizing patterns to optional stacked hardware if present
  const checkMTextRegex = /M\d+/i

  if (washerString && !washerString.match(checkMTextRegex) && sharedSizeContext) {
    washerString = `M${sharedSizeContext} ${washerString}`
  }

  if (nutString && !nutString.match(checkMTextRegex) && sharedSizeContext) {
    const pitchSuffix = sharedPitchContext ? ` x ${sharedPitchContext}` : ''
    nutString = `M${sharedSizeContext}${pitchSuffix} ${nutString}`
  }

  // Step 4: Route valid chunks or return explicit nulls for optional omissions
  return {
    bolt: parseBoltSpec(boltString),
    washer: washerString ? parseWasherSpec(washerString) : null,
    nut: nutString ? parseNutSpec(nutString) : null
  }
}

/**
 * Simple structural lookups for minimum physical clearance checks.
 * (Values match standard ISO 7090 normal series thicknesses and standard ISO 4032 regular nut heights)
 */
const ISO_WASHER_THICKNESS_LOOKUP = { 'M5': 1.0, 'M6': 1.6, 'M8': 1.6, 'M10': 2.0, 'M12': 2.5, 'M16': 3.0, 'M20': 3.0 }
const ISO_NUT_HEIGHT_LOOKUP = { 'M5': 4.7, 'M6': 5.2, 'M8': 6.8, 'M10': 8.4, 'M12': 10.8, 'M16': 14.8, 'M20': 18.0 }

/**
 * Validates a parsed metric assembly specification prior to 3D generation.
 * Throws strict, explicit errors if physical or mechanical attributes mismatch.
 * 
 * @param {Object} parsedAssembly - The output directly from parseAssembly()
 * @throws {Error} Detailed report of what failed along with the offending values
 * @returns {boolean} True if the stack specification passes all clearance and sizing rules
 */
export const validateAssemblySpecification = (parsedAssembly) => {
  if (!parsedAssembly || !parsedAssembly.bolt) {
    throw new Error("Validation Failed: Missing primary assembly data or anchor Bolt specification object.")
  }

  const { bolt, washer, nut } = parsedAssembly
  const nominalSize = bolt.size // e.g., "M12"

  // ---------------------------------------------------------
  // 1. DIAMETER CONSISTENCY CHECKS
  // ---------------------------------------------------------
  if (washer && washer.size !== nominalSize) {
    throw new Error(`Validation Failed: Nominal diameter mismatch. Bolt is ${nominalSize} but Washer is ${washer.size}.`)
  }

  if (nut && nut.size !== nominalSize) {
    throw new Error(`Validation Failed: Nominal diameter mismatch. Bolt is ${nominalSize} but Nut is ${nut.size}.`)
  }

  // ---------------------------------------------------------
  // 2. THREAD PITCH COMPATIBILITY CHECKS
  // ---------------------------------------------------------
  if (nut && bolt.pitch && nut.pitch) {
    if (parseFloat(bolt.pitch) !== parseFloat(nut.pitch)) {
      throw new Error(`Validation Failed: Thread pitch mismatch. Bolt thread pitch is ${bolt.pitch}mm but Nut thread pitch is ${nut.pitch}mm.`)
    }
  }

  // ---------------------------------------------------------
  // 3. MECHANICAL CLEARANCE (BOLT LENGTH CHECK)
  // ---------------------------------------------------------
  if (!bolt.length || isNaN(bolt.length)) {
    throw new Error(`Validation Failed: Missing or invalid bolt length. Provided value: ${bolt.length}`)
  }

  let requiredMinimumLength = 0
  
  // Account for physical hardware stack thickness
  if (washer) {
    const washerThickness = ISO_WASHER_THICKNESS_LOOKUP[nominalSize] || 2.0 // Fallback estimate if size out of core sample range
    requiredMinimumLength += washerThickness
  }
  
  if (nut) {
    const nutHeight = ISO_NUT_HEIGHT_LOOKUP[nominalSize] || (parseFloat(nominalSize.replace('M', '')) * 0.8) // Standard fallback rule-of-thumb height
    requiredMinimumLength += nutHeight
  }

  // Add a minimum thread engagement safety buffer (at least 2 full thread pitches protruding past the nut face, ~2-3mm average)
  const safetyProtrusionBuffer = 3.0
  requiredMinimumLength += safetyProtrusionBuffer

  if (bolt.length < requiredMinimumLength) {
    throw new Error(
      `Validation Failed: Bolt length is too short for this hardware stack. ` +
      `Requested Length: ${bolt.length}mm. Required Minimum Clearance: ${requiredMinimumLength.toFixed(1)}mm ` +
      `(Includes calculated stack hardware thickness and safety thread protrusion).`
    );
  }

  return true
}



/**
 * METRIC ISO ASSEMBLY VALIDATION ENGINE WITH TOLERANCE CHECKS
 * 
 * @memberof jscad-fastener/iso
 */
export const validateAssembly = (assembly) => {
  const { bolt, washer, nut } = assembly
  const errors = []
  const warnings = []

  console.log(`\n⚙️ Evaluating Metric Joint with Tolerance Controls:`)
  console.log(` -> Bolt:   ${bolt.size} Pitch:${bolt.pitch}mm Tolerance:${bolt.threadTolerance}`)
  console.log(` -> Washer: ${washer.standard} (${washer.material})`)
  console.log(` -> Nut:    ${nut.size} Pitch:${nut.pitch}mm Tolerance:${nut.threadTolerance}`)

  // 1. Thread Sizing & Interface Layout Matching Check
  if (bolt.pitch !== nut.pitch) {
    errors.push(`CRITICAL: Thread pitch mismatch! Bolt pitch is ${bolt.pitch}mm, but Nut pitch is ${nut.pitch}mm.`)
  }
  if (bolt.size !== washer.size || bolt.size !== nut.size) {
    errors.push(`CRITICAL: Diameter Interface mismatch! Components must share exact nominal steps.`)
  }

  // 2. ISO 965 Allowance & Interference Mechanical Fit Evaluation
  const bTol = bolt.threadTolerance.toLowerCase() // Lower-case external zone check
  const nTol = nut.threadTolerance.toUpperCase()   // Upper-case internal zone check

  if (bolt.coating === 'Hot-Dip Galvanized') {
    // Structural Rule: Galvanized shanks are too thick for tight '6g' external limits unless oversized '6G' nuts are explicitly selected
    if (bTol === '6g' && nTol === '6H') {
      errors.push(`CRITICAL: Thread Interference Hazard! A Hot-Dip Galvanized bolt coating will jam inside a standard 6H nut profile. Requires an over-tapped 6G structural internal nut fit.`)
    }
  } else {
    // Standard Coating Rule: Heavy clearance configurations should not be mixed unnecessarily
    if (bTol === '6e' && nTol === '6H') {
      warnings.push(`WARNING: Slack fit assembly. Loose clearance position '6e' bolt paired with standard '6H' internal nut. Acceptable for high-temperature settings, but tracks higher vibration play.`)
    }
  }

  // 3. Material Compatibility (Preventing Galvanic Corrosion)
  const isBoltStainless = bolt.material.includes('Stainless')
  const isWasherStainless = washer.material.includes('Stainless')
  if (isBoltStainless !== isWasherStainless) {
    errors.push(`CRITICAL: Galvanic Corrosion Risk! Mixing Stainless Steel components alongside regular Carbon Steels.`)
  }

  // Final Verdict
  if (errors.length === 0) {
    console.log("✅ Validation successfully PASSED. Structural tolerance and alignment checks are compliant.")
    warnings.forEach((w) => console.warn(`⚠️ ${w}`))
    return { valid: true, errors, warnings }
  } else {
    console.error("❌ Validation FAILED.")
    errors.forEach((e) => console.error(`🛑 ${e}`))
    return { valid: false, errors, warnings }
  }
}

/**
 * Procedural 3D Assembly Generator for ISO Fastener Stack in JSCAD V3
 * Handles optional washers and nuts seamlessly without crashing.
 *
 * @memberof jscad-fastener/iso
 * @param {Object} assemblyConfig - Specifications for each component (bolt required; washer/nut optional)
 * @param {number} clampThickness - Total material thickness being joined together (mm)
 * @param {Object} modules - Reference pointers to your 3D creation functions
 * @returns {Object} Unified 3D assembly mesh
 */
export const generateAssembly = (assemblyConfig, clampThickness, modules) => {
  const { bolt, washer, nut } = assemblyConfig
  const { createBolt, createWasher, createNut, createThread } = modules

  // Safety Gate: The bolt is always required as the primary assembly core
  if (!bolt) {
    throw new Error("Assembly generation failed: A valid bolt configuration object must be provided.")
  }

  const assemblySolids = []
  let currentZTracking = 0 // Tracks the stacking depth downward along the negative Z-axis

  // ==========================================
  // 1. GENERATE AND POSITION THE ISO BOLT
  // ==========================================
  // Head is generated above Z=0; shank runs downward into negative Z space
  const boltSolid = createBolt(bolt)
  assemblySolids.push(boltSolid)

  // ==========================================
  // 2. OPTIONAL: WASHER CONFIGURATION
  // ==========================================
  if (washer) {
    const washerSolid = createWasher(washer)
    const washerThickness = washer.thickness || 2.0 // Fallback default
    
    // Slide washer flush against the underside of the bolt head
    currentZTracking -= washerThickness
    const positionedWasher = translate([0, 0, currentZTracking], washerSolid)
    assemblySolids.push(positionedWasher)
  }

  // ==========================================
  // 3. OPTIONAL: NUT CONFIGURATION
  // ==========================================
  if (nut) {
    const nutSolid = createNut(nut, createThread)
    const nutHeight = nut.height || 10.0 // Fallback default
    
    // Position the nut below the washer (if it exists) and the clamped material block
    const nutZPosition = currentZTracking - clampThickness - nutHeight
    
    const positionedNut = translate([0, 0, nutZPosition], nutSolid)
    assemblySolids.push(positionedNut)
    
    console.log(` -> Nut Seating Level determined at: ${nutZPosition}mm`)
  } else {
    console.log(` -> Note: No nut specified. Assuming a tapped blind hole assembly configuration.`)
  }

  // ==========================================
  // 4. UNION AND EXECUTE SOLIDS
  // ==========================================
  console.log(`\n📦 Compiling 3D ISO Assembly Stack...`)
  console.log(` -> Clamped Material Depth: ${clampThickness}mm`)
  console.log(` -> Structural Stack Parts count: ${assemblySolids.length}`)

  return union(...assemblySolids)
}


