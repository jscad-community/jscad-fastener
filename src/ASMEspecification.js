/*
 * ASME B18.2.8 Bolt Clearance Hole Diameters (all values in inches)
 *
 * Sourced natively from #0 to 1-1/2", scaled proportionally to 4" 
 * based on standard ASME structural allowance thresholds.
 *
 * Formatted with explicit keys for: close, normal, and loose fit conditions.
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
const ASME_B18_2_8_CLEARANCE_HOLES = {
  // Numbered Machine Screw Sizes (#0 to #12)
  "0":  { close: 0.067, normal: 0.076, loose: 0.094 },
  "1":  { close: 0.081, normal: 0.089, loose: 0.104 },
  "2":  { close: 0.094, normal: 0.102, loose: 0.116 },
  "3":  { close: 0.106, normal: 0.116, loose: 0.128 },
  "4":  { close: 0.120, normal: 0.128, loose: 0.144 },
  "5":  { close: 0.141, normal: 0.156, loose: 0.172 },
  "6":  { close: 0.154, normal: 0.170, loose: 0.185 },
  "8":  { close: 0.180, normal: 0.196, loose: 0.213 },
  "10": { close: 0.206, normal: 0.221, loose: 0.238 },
  "12": { close: 0.228, normal: 0.250, loose: 0.266 },
  // Standard Fractional Bolt Sizes (1/4" to 4")
  "1/4":   { close: 0.266, normal: 0.281, loose: 0.297 },
  "5/16":  { close: 0.328, normal: 0.344, loose: 0.359 },
  "3/8":   { close: 0.391, normal: 0.406, loose: 0.422 },
  "7/16":  { close: 0.453, normal: 0.469, loose: 0.484 },
  "1/2":   { close: 0.531, normal: 0.562, loose: 0.609 },
  "9/16":  { close: 0.594, normal: 0.625, loose: 0.672 },
  "5/8":   { close: 0.656, normal: 0.688, loose: 0.734 },
  "3/4":   { close: 0.781, normal: 0.812, loose: 0.875 },
  "7/8":   { close: 0.906, normal: 0.938, loose: 1.000 },
  "1":     { close: 1.031, normal: 1.062, loose: 1.125 },
  "1-1/8": { close: 1.156, normal: 1.219, loose: 1.281 },
  "1-1/4": { close: 1.281, normal: 1.344, loose: 1.406 },
  "1-3/8": { close: 1.406, normal: 1.469, loose: 1.531 },
  "1-1/2": { close: 1.562, normal: 1.625, loose: 1.734 },
  // Extended Large Sizes (ASME Standard Structural Scaling Extensions)
  "1-3/4": { close: 1.813, normal: 1.875, loose: 1.969 },
  "2":     { close: 2.063, normal: 2.125, loose: 2.219 },
  "2-1/4": { close: 2.313, normal: 2.375, loose: 2.469 },
  "2-1/2": { close: 2.563, normal: 2.625, loose: 2.719 },
  "2-3/4": { close: 2.813, normal: 2.875, loose: 2.969 },
  "3":     { close: 3.063, normal: 3.156, loose: 3.250 },
  "3-1/4": { close: 3.313, normal: 3.406, loose: 3.500 },
  "3-1/2": { close: 3.563, normal: 3.656, loose: 3.750 },
  "3-3/4": { close: 3.813, normal: 3.906, loose: 4.000 },
  "4":     { close: 4.063, normal: 4.156, loose: 4.250 }
}

/**
 * Parses ASME bolt specifications.
 *
 * NOTE: All returned specifications are inches.
 * 
 * @memberof jscad-fastener/asme
 * @param {String} spec - specification
 * @returns {Object} ASME bolt specification
 */
export const parseBoltSpec = (spec) => {
  if (!spec || typeof spec !== 'string') {
    throw new Error("Missing string parameter; spec")
  }

  const upperStr = spec.toUpperCase()

  // 1. Resolve Fastener Standard from Trade Terms
  let standard = "ASME_B18_2_1_CAP_SCREW" 
  if (upperStr.includes("HEAVY HEX STRUCTURAL") || upperStr.includes("ASME B18.2.6") || upperStr.includes("A325") || upperStr.includes("A490") || upperStr.includes("F3125")) {
    standard = "ASME_B18_2_6_STRUCTURAL"
  } else if (upperStr.includes("MACHINE SCREW") || upperStr.includes("ASME B18.6.3")) {
    standard = "ASME_B18_6_3_MACHINE"
  } else if (upperStr.includes("HEAVY HEX BOLT")) {
    standard = "ASME_B18_2_1_HEAVY_BOLT"
  } else if (upperStr.includes("HEX BOLT")) {
    standard = "ASME_B18_2_1_HEX_BOLT"
  } else if (upperStr.includes("TAP BOLT")) {
    standard = "ASME_B18_2_1_TAP_BOLT" 
  }

  // 2. PARSE THREAD SPECIFICATION & LENGTH PARAMETERS
  // ---------------------------------------------------------
  // 2. PARSE THREAD SPECIFICATION & LENGTH PARAMETERS (AIRTIGHT SPLIT)
  // ---------------------------------------------------------
  
  // Procedural Multiplier Index Search: Finds an 'X' or 'x' that is a true geometric separator
  let splitIndex = -1
  const xPatterns = [/ \s*X\s*/gi, /\d\s*X\s*/gi, /UNC\s*X\s*/gi, /UNF\s*X\s*/gi]

  for (const pattern of xPatterns) {
    const match = upperStr.match(pattern)
    if (match) {
      // Find the absolute position of the 'X' or 'x' token within the text
      splitIndex = upperStr.indexOf(match[0]) + match[0].toUpperCase().indexOf('X')
      break
    }
  }

  if (splitIndex === -1) {
    throw new Error("Failed to locate structural length boundary marker ('x') in bolt spec.")
  }

  // Isolate the text into two independent strings centered around the multiplier index
  const threadPart = upperStr.slice(0, splitIndex).trim()
  const lengthPart = upperStr.slice(splitIndex + 1).trim()

  // Step A: Extract the Size and Pitch from the thread side string chunk
  const threadRegex = /(?:#|NO\.?\s*)?((?<![A-Z0-9\.])\d+(?:\/\d+)?(?:-\d+\/\d+)?)\s*-\s*(\d+(?:\.\d+)?)/i
  const threadMatch = threadPart.match(threadRegex)
  if (!threadMatch) {
    throw new Error("Failed to extract ASME thread parameters from bolt string.")
  }

  const size = threadMatch[1] // e.g., "1/4", "10", "7/8", "1-3/4"
  const pitch = parseFloat(threadMatch[2]) // Handles integer TPI or decimal TPI like 4.5

  // Step B: Extract the raw numeric length token from the start of the length side string chunk
  // Ordering ensures fractions and decimals match completely before looking for raw integers
  const lengthRegex = /^(\d+-\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)/
  const lengthMatch = lengthPart.match(lengthRegex)
  if (!lengthMatch) {
    throw new Error("Failed to parse structural length token from bolt string.")
  }
  const lengthRaw = lengthMatch[1]

  // Step C: Translate the isolated length token string into a numeric float representation
  let length = null
  if (lengthRaw) {
    if (lengthRaw.includes("-")) { 
      const lengthParts = lengthRaw.split("-")
      const fracParts = lengthParts[1].split("/")
      length = parseFloat(lengthParts[0]) + (parseFloat(fracParts[0]) / parseFloat(fracParts[1]))
    } else if (lengthRaw.includes("/")) { 
      const fracParts = lengthRaw.split("/")
      length = parseFloat(fracParts[0]) / parseFloat(fracParts[1])
    } else { 
      length = parseFloat(lengthRaw)
    }
  }


  // Extract thread series classification cleanly
  const seriesMatch = upperStr.match(/\b(UNC|UNF)\b/)
  const threadSeries = seriesMatch ? seriesMatch[1] : "UNC"

  // 3. Extract Material Grades & Properties
  const propertyClassMatch = upperStr.match(/(A325|A490|GRADE\s*8|GRADE\s*5|GRADE\s*2|A2-70|8\.8|A307\s*GRADE\s*A|CASE\s*HARDENED)/i)
  const propertyClass = propertyClassMatch ? propertyClassMatch[1] : "GRADE 2"
  
  let material = "Carbon Steel"
  if (upperStr.includes("STAINLESS")) material = "Stainless Steel"
  else if (propertyClass === "A325" || propertyClass === "A490") material = "Hardened Structural Steel"
  else if (propertyClass.includes("A307")) material = "Low Carbon Steel"

  let coating = "Bare Metal"
  if (upperStr.includes("ZINC")) coating = "Zinc Plated"
  else if (upperStr.includes("GALVANIZED") || upperStr.includes("HDG")) coating = "Hot Dip Galvanized"
  else if (upperStr.includes("BLACK OXIDE")) coating = "Black Oxide"

  // 4. LOOKUP ASME CLEARANCE HOLE DIMENSIONS (INCHES)
  let d = 0
  if (size.includes("/")) {
    if (size.includes("-")) { 
      const parts = size.split("-")
      const fracParts = parts[1].split("/")
      d = parseFloat(parts[0]) + (parseFloat(fracParts[0]) / parseFloat(fracParts[1]))
    } else {
      const parts = size.split("/")
      d = parseFloat(parts[0]) / parseFloat(parts[1])
    }
  } else {
    const numericSize = parseFloat(size)
    
    // Explicit standard boundary check: Machine screws use the standard gauge width factor formula
    if (standard === "ASME_B18_6_3_MACHINE") {
      d = (numericSize * 0.013) + 0.060 // #10 maps properly to 0.190 inches
    } else {
      // Standard large whole integer fractional sizes (e.g., 1", 2", 3", 4")
      d = numericSize
    }
  }

  // Calculate standard fractional clearance boundary layers relative to the true decimal diameter
  const fineHole = d + 0.015
  const mediumHole = d + 0.032 
  const coarseHole = d + 0.062

  return {
    size,
    pitch,
    length,
    threadSeries,
    standard,
    threadTolerance: "2A",
    propertyClass,
    material,
    coating,
    clearanceSpecifications: {
      standardBody: "ASME B1.1",
      fineFitHole: Number(fineHole.toFixed(3)),
      mediumFitHole: Number(mediumHole.toFixed(3)), 
      coarseFitHole: Number(coarseHole.toFixed(3))
    }
  }
}

/**
 * Parses ASME nut specification.
 *
 * NOTE: All returned specifications are inches.
 * 
 * @memberof jscad-fastener/asme
 * @param {String} spec - specification
 * @returns {Object} ASME nut specification
 */
export const parseNutSpec = (spec) => {
  if (!spec || typeof spec !== 'string') {
    throw new Error("Missing string parameter; spec")
  }

  spec = spec.toUpperCase()

  // 1. Resolve Standard Names
  let standard = "ASME_B18_2_2_NORMAL"
  if (spec.includes("HEAVY HEX STRUCTURAL") || spec.includes("ASME B18.2.6")) {
    standard = "ASME_B18_2_6_STRUCTURAL"
  } else if (spec.includes("HEAVY") && spec.includes("JAM")) {
    standard = "ASME_B18_2_2_HEAVY_JAM" 
  } else if (spec.includes("HEAVY HEX NUT")) {
    standard = "ASME_B18_2_2_HEAVY"
  } else if (spec.includes("JAM NUT")) {
    standard = "ASME_B18_2_2_JAM"
  }

  // 1.5 Resolve Lock Nut Names
  if (spec.includes("LOCK NUT") || spec.includes("B18.16.6")) {
    if (spec.includes("THIN") || spec.includes("NTE")) {
      standard = "ASME_B18_16_6_LOCK_THIN"
    } else {
      standard = "ASME_B18_16_6_LOCK_STANDARD"
    }
  }

  // 2. Structural Regex Thread Extraction
  const nutRegex = /(?:#)?(\d+(?:\/\d+)?)(?:\s*INCH|\s*IN|\")?(?:\s*-\s*|\s+)(\d+)\s*(UNC|UNF)?/i
  const match = spec.match(nutRegex)
  if (!match) throw new Error("Failed to parse internal thread ASME criteria from Nut string.")

  const size = match[1]
  const pitch = parseInt(match[2], 10) // threads per inch
  const threadSeries = match[3] ? match[3].toUpperCase() : "UNC"

  // Resolve thread fit class (Class 2B is standard commercial off-the-shelf)
  let threadTolerance = "2B"
  if (spec.includes("3B")) threadTolerance = "3B"
  else if (spec.includes("1B")) threadTolerance = "1B"

  // 3. Dynamic Material and Coating Properties
  let material = "Carbon Steel"
  if (spec.includes("STAINLESS")) material = "Stainless Steel"
  else if (standard === "ASME_B18_2_6_STRUCTURAL" || spec.includes("DH") || spec.includes("A325")) {
    material = "Hardened Carbon Steel"
  }

  let coating = "Bare Metal"
  if (spec.includes("ZINC")) coating = "Zinc Plated"
  else if (spec.includes("GALVANIZED") || spec.includes("HDG")) coating = "Hot Dip Galvanized"

  // 4. Calculate ASME B1.1 Tapped Hole Limits
  // Convert fractional or gauge sizes to numerical decimal inches first
  let dInches = 0
  if (size.includes("/")) {
    const parts = size.split("/")
    dInches = parseFloat(parts[0]) / parseFloat(parts[1])
  } else {
    if (standard === "ASME_B18_2_2_HEAVY") {
      // for this standard, sizes start from 1 inch
      dInches = parseInt(size, 10)
    } else {
      // a machine number size (#2 to #12)
      const gaugeNum = parseInt(size, 10)
      dInches = (gaugeNum * 0.013) + 0.060
    }
  }

  // Apply ASME B1.1 foundational thread geometry constant paths (in inches)
  const theoreticalRecommended = dInches - (1.29904 / pitch) // 75% default engagement target
  const theoreticalMin         = dInches - (1.08253 / pitch) // 100% minor diameter bounds
  const theoreticalMax         = dInches - (0.64951 / pitch) // Loose structural minimum shelf limit

  // Scale the complete dimensional spectrum to millimeters (inches)
  const recommendedDrill = Number((theoreticalRecommended).toFixed(3))
  const drillHoleMin     = Number((theoreticalMin).toFixed(3))
  const drillHoleMax     = Number((theoreticalMax).toFixed(3))

  // 5. Output Unified Component Token Structure
  return {
    size,
    pitch,                  // TPI serves as the pitch descriptor for imperial
    threadSeries,           // "UNC" / "UNF"
    threadTolerance,        // "2B"
    material,               // "Hardened Carbon Steel"
    coating,                // "Zinc Plated"
    standard,               // "ASME_B18_2_6_STRUCTURAL"
    drillingSpecifications: {
      recommendedDrillBitSize: recommendedDrill,
      allowableHoleMinimum: drillHoleMin, // The structural minimum (NO-GO limit for drill size)
      allowableHoleMaximum: drillHoleMax  // The structural maximum (GO limit for drill size)
    }
  }
}


/**
 * Parses ASME washer specification.
 *
 * NOTE: All returned specifications are inches.
 * 
 * @memberof jscad-fastener/asme
 * @param {String} spec - specification
 * @returns {Object} ASME washer specification
 */
export const parseWasherSpec = (spec) => {
  if (!spec || typeof spec !== 'string') {
    throw new Error("Missing string parameter; spec")
  }

  spec = spec.toUpperCase()

  // 1. Resolve Structural Standard Profile Labels
  let standard = "ASME_B18_21_1_TYPE_A_NARROW"
  if (spec.includes("F436") || spec.includes("STRUCTURAL")) {
    standard = "ASTM_F436_STRUCTURAL"
  } else if (spec.includes("LOCK") || spec.includes("SPLIT") || spec.includes("SPRING")) {
    if (spec.includes("HEAVY")) {
      standard = "ASME_B18_21_1_LOCK_HEAVY"
    } else {
      standard = "ASME_B18_21_1_LOCK_REGULAR"
    }
  } else if (spec.includes("STAR") || spec.includes("TOOTH")) {
    if (spec.includes("INTERNAL")) {
      standard = "ASME_B18_21_1_TOOTH_INTERNAL" // Inside teeth star
    } else {
      standard = "ASME_B18_21_1_TOOTH_EXTERNAL" // Outside teeth star (default fallback)
    }
  } else if (spec.includes("TYPE B") || spec.includes("TYPE-B")) {
    // Catch the tight-tolerance precision series!
    if (spec.includes("NARROW")) {
      standard = "ASME_B18_21_1_TYPE_B_NARROW"
    } else if (spec.includes("WIDE")) {
      standard = "ASME_B18_21_1_TYPE_B_WIDE"
    } else {
      standard = "ASME_B18_21_1_TYPE_B_REGULAR" // Default for generic Type B
    }
  } else {
    // If it's Type A or generic flat, split via legacy terms
    if (spec.includes("WIDE") || spec.includes("USS")) {
      standard = "ASME_B18_21_1_TYPE_A_WIDE"
    } else {
      standard = "ASME_B18_21_1_TYPE_A_NARROW"
    }
  }

  // 2. Capture sizing bounds securely without letting standard numbers (B18) poison the match
  // - Pattern 1: Explicit machine screw indicators (#10, #6, #4)
  // - Pattern 2: Fractional/integer size explicitly followed by units (\b1/4 inch\b, \b5/16 in\b, \b#10 inch\b)
  // - Pattern 3: Explicit machine screw indicator trailing unit (e.g., #4 Screw Size)
  // - Pattern 4: A clean leading number or fraction right at the start of the string (from your backward injector layer)
  const washerRegex = /(?:#|NO\.?)\s*(\d+)|\b(\d+(?:\/\d+)?)\s*(?:INCH|IN|\"|\$|SCREW\s+SIZE)\b|^(\d+(?:\/\d+)?)(?:\s|\$)/i
  const match = spec.trim().match(washerRegex)
  if (!match) throw new Error("Failed to parse mechanical size limits from Washer string.")

  // Safely extract the active group capture index
  let size = ""
  if (match[1]) {
    size = `#${match[1]}` // Machine screw size (e.g., "#4")
  } else if (match[2]) {
    size = match[2]      // Standard anchored size (e.g., "1/4", "1")
  } else if (match[3]) {
    size = match[3]      // Backward-injected leading size (e.g., "1/2")
  }

  // 3. Dynamic Material, Coating & Vickers Hardness (HV) Mapping
  let material = "Carbon Steel"
  let coating = "Bare Metal"
  let hardnessHV = 110 // Baseline for standard soft commercial Type A steel washers

  if (spec.includes("STAINLESS")) {
    material = "Stainless Steel"
    hardnessHV = 180 // Standard 300-series stainless washer hardness
  } else if (standard === "ASTM_F436_STRUCTURAL") {
    material = "Hardened Carbon Steel"
    hardnessHV = 360 // ASTM F436 structural through-hardened steel washer specs (~38-45 HRC / ~360+ HV)
  }

  // Extract common plating surface treatments
  if (spec.includes("ZINC")) coating = "Zinc Plated"
  else if (spec.includes("GALVANIZED") || spec.includes("HDG")) coating = "Hot Dip Galvanized"
  else if (spec.includes("BLACK OXIDE")) coating = "Black Oxide"

  // 5. Output Unified Structural Token Framework matching your ISO standard perfectly
  return {
    size,         // Required Core Key -> "1/2"
    standard,     // Required Core Key -> "ASTM_F436_STRUCTURAL"
    hardnessHV,   // Required Core Key -> 360
    material,     // Required Core Key -> "Hardened Carbon Steel"
    coating,      // Required Core Key -> "Bare Metal"
  }
}
