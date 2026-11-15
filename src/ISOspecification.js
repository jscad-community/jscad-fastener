import { getThreadSpec } from './ISOthreads.js'

/*
 * ISO 273 Bolt Clearance Hole Diameters (all values in mm)
 *
 * Map structure optimized for clean, semantic UI and geometry engine routing.
 *
 * Formatted with explicit keys for: close (H12), normal (H13), and loose (H14) fit conditions.
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
const ISO_273_CLEARANCE_HOLES = {
  "M1.6": { close: 1.700, normal: 1.800, loose: 2.000 },
  "M2":   { close: 2.200, normal: 2.400, loose: 2.600 },
  "M2.5": { close: 2.700, normal: 2.800, loose: 3.100 },
  "M3":   { close: 3.200, normal: 3.350, loose: 3.600 },
  "M3.5": { close: 3.700, normal: 3.900, loose: 4.200 },
  "M4":   { close: 4.300, normal: 4.500, loose: 4.800 },
  "M5":   { close: 5.300, normal: 5.500, loose: 5.800 },
  "M6":   { close: 6.400, normal: 6.500, loose: 7.000 },
  "M7":   { close: 7.400, normal: 7.800, loose: 8.000 },
  "M8":   { close: 8.400, normal: 9.000, loose: 10.000 },
  "M10":  { close: 10.500, normal: 11.000, loose: 12.000 },
  "M12":  { close: 13.000, normal: 14.000, loose: 15.000 },
  "M14":  { close: 15.000, normal: 16.000, loose: 18.000 },
  "M16":  { close: 17.000, normal: 18.000, loose: 19.000 },
  "M18":  { close: 19.000, normal: 20.000, loose: 21.000 },
  "M20":  { close: 21.000, normal: 22.000, loose: 24.000 },
  "M22":  { close: 23.000, normal: 24.000, loose: 26.000 },
  "M24":  { close: 25.000, normal: 26.000, loose: 28.000 },
  "M27":  { close: 28.000, normal: 30.000, loose: 32.000 },
  "M30":  { close: 31.000, normal: 33.000, loose: 35.000 },
  "M33":  { close: 34.000, normal: 36.000, loose: 38.000 },
  "M36":  { close: 37.000, normal: 39.000, loose: 42.000 },
  "M39":  { close: 40.000, normal: 42.000, loose: 45.000 },
  "M42":  { close: 43.000, normal: 45.000, loose: 48.000 },
  "M45":  { close: 46.000, normal: 48.000, loose: 52.000 },
  "M48":  { close: 50.000, normal: 52.000, loose: 56.000 },
  "M52":  { close: 54.000, normal: 56.000, loose: 62.000 },
  "M56":  { close: 58.000, normal: 62.000, loose: 66.000 },
  "M60":  { close: 62.000, normal: 66.000, loose: 70.000 },
  "M64":  { close: 66.000, normal: 70.000, loose: 74.000 }
}

/*
 * EXPANDED PROCEDURAL PARSING FUNCTIONS (ISO 8991 & ISO 965)
 */
const extractMaterialAndCoating = (str) => {
  const lower = str.toLowerCase()
  let material = 'Carbon Steel'
  let coating = 'Plain Finish'

  if (lower.includes('a2-70') || lower.includes('a2 ')) material = 'A2 Stainless Steel'
  else if (lower.includes('a4-80') || lower.includes('a4 ')) material = 'A4 Stainless Steel'

  if (lower.includes('hot-dip') || lower.includes('hdg') || lower.includes('galvanized')) coating = 'Hot-Dip Galvanized'
  else if (lower.includes('zinc') || lower.includes('electroplated')) coating = 'Zinc Electroplated'
  else if (material.includes('Stainless')) coating = 'Clean Passivated'

  return { material, coating }
}

/**
 * Parses ISO bolt specifications.
 *
 * NOTE: All returned specifications are millimeters.
 * 
 * @memberof jscad-fastener/iso
 * @param {String} str - specification
 * @returns {Object} ISO bolt specification
 */
export const parseBoltSpec = (str) => {
  str = str.toUpperCase()

  // 1. Extract the Bolt Standard / Specification (e.g., ISO 4014, ISO 4017, DIN 931)
  // captures the group name (ISO/DIN) and the full numerical string cleanly
  const standardRegex = /(ISO|DIN)\s*(\d+)/i
  const match = str.match(standardRegex)
  
  // provide fallback defaults if the user didn't specify an exact standard
  const prefix = match ? match[1] : 'ISO'
  const specNumber = match ? match[2] : '4014' // Defaulting to standard hex bolt if anonymous

  let standard = 'ISO_4014_HEX_BOLT' // Unified engineering fallback
  if (prefix === 'ISO') {
    if (specNumber === '4014') standard = 'ISO_4014_HEX_BOLT'
    if (specNumber === '4016') standard = 'ISO_4016_HEX_BOLT_C'
    if (specNumber === '4017') standard = 'ISO_4017_HEX_SCREW'
    if (specNumber === '7411') standard = 'ISO_7411_HEX_STRUCTURAL'
    if (specNumber === '7045') standard = 'ISO_7045_PAN_MACHINE'
  } else if (prefix === 'DIN') {
    if (specNumber === '601')  standard = 'DIN_601_HEX_BOLT_C'
    if (specNumber === '931')  standard = 'DIN_931_HEX_BOLT'
    if (specNumber === '933')  standard = 'DIN_933_HEX_SCREW'
    if (specNumber === '6914') standard = 'DIN_6914_HEX_STRUCTURAL'
    if (specNumber === '7985') standard = 'DIN_7985_PAN_MACHINE'
  }

  // 2. Parse Thread Parameters
  const clusterMatch = str.match(/M\d+(?:\.\d+)?(?:\s*[-X×]\s*\d+(?:\.\d+)?)?(?:\s*[X×]\s*\d+(?:\.\d+)?)?/);
  if (!clusterMatch) throw new Error("Failed to extract Metric Thread parameters from Bolt string.");

  const rawCluster = clusterMatch.at(0);
  const parts = rawCluster.replace(/^M/, '').split(/\s*[-X×]\s*/).map(Number);

  const nominalDiameter = parts.at(0);
  const second = parts.at(1);
  const third = parts.at(2);

  const size = `M${nominalDiameter}`;
  const coarseSpec = getThreadSpec(size, 'COARSE');

  let pitch = coarseSpec?.pitch ?? null;
  let length = null;

  if (third !== undefined) {
    // 3 numbers: Diameter, Pitch, Length (e.g., M24-3.0 x 60)
    pitch = second;
    length = third;
  } else if (second !== undefined) {
    // 2 numbers: Check if second is a valid pitch (<= coarse pitch) or a length
    const isValidPitch = coarseSpec && second <= coarseSpec.pitch;
    if (isValidPitch) {
      pitch = second;
    } else if (!rawCluster.includes('-')) {
      // Only treat as length if separated by X/× (ignores grade suffixes like M16-8.8)
      length = second;
    }
  }
  
  const threadType = (coarseSpec && pitch === coarseSpec.pitch) ? 'COARSE' : 'FINE';
  const spec = getThreadSpec(size, threadType);

  const toleranceMatch = str.match(/(?:\s|-)([4-7][a-h](?:[4-7][a-h])?)(?:\s|-|\$)/)
  const threadTolerance = toleranceMatch ? toleranceMatch[1] : '6g'

  // resolve raw material context from the specification string first
  const { material, coating } = extractMaterialAndCoating(str)

  // extract the Property Class (Fixed trailing edge anchor bug by changing \\$ to $)
  const propertyClassMatch = str.match(/(?:\s|-)(4\.6|5\.6|8\.8|10\.9|12\.9)(?:\s|-|$)/)
  
  // material is now safely resolved inline for the property class fallback block
  const propertyClass = propertyClassMatch 
    ? propertyClassMatch[1] 
    : (material.includes('Stainless') ? 'A2-70' : '8.8')

  // --- ISO 273 Clearance Hole Matrix ---
  let fineHole, mediumHole, coarseHole

  if (nominalDiameter <= 1) {
    fineHole = nominalDiameter + 0.1
    mediumHole = nominalDiameter + 0.2
    coarseHole = nominalDiameter + 0.3
  } else if (nominalDiameter <= 2) {
    fineHole = nominalDiameter + 0.1
    mediumHole = nominalDiameter + 0.2
    coarseHole = nominalDiameter + 0.4
  } else if (nominalDiameter <= 4) {
    fineHole = nominalDiameter + 0.1
    mediumHole = nominalDiameter + 0.3
    coarseHole = nominalDiameter + 0.5
  } else if (nominalDiameter <= 6) {
    fineHole = nominalDiameter + 0.2
    mediumHole = nominalDiameter + 0.4
    coarseHole = nominalDiameter + 0.6
  } else if (nominalDiameter <= 12) {
    fineHole = nominalDiameter + 0.5
    mediumHole = nominalDiameter + 1.0
    coarseHole = nominalDiameter + 1.5
  } else if (nominalDiameter <= 20) {
    fineHole = nominalDiameter + 1.0
    mediumHole = nominalDiameter + 2.0
    coarseHole = nominalDiameter + 3.0
  } else if (nominalDiameter <= 42) {
    fineHole = nominalDiameter + 2.0
    mediumHole = nominalDiameter + 3.0
    coarseHole = nominalDiameter + 5.0
  } else { 
    fineHole = nominalDiameter + 3.0
    mediumHole = nominalDiameter + 4.0
    coarseHole = nominalDiameter + 6.0
  }

  return {
    size,
    pitch,
    length,
    threadSeries: spec.threadSeries,
    standard,
    threadTolerance,
    propertyClass,
    material,
    coating,
    clearanceSpecifications: {
      clearanceStandard: "ISO 273",
      fineFitHole: Number(fineHole.toFixed(1)),
      mediumFitHole: Number(mediumHole.toFixed(1)), 
      coarseFitHole: Number(coarseHole.toFixed(1))
    }
  }
}

/**
 * Parses ISO nut specification.
 *
 * NOTE: All returned specifications are millimeters.
 * 
 * @memberof jscad-fastener/iso
 * @param {String} spec - specification
 * @returns {Object} ISO nut specification
 */
export const parseNutSpec = (str) => {
  str = str.toUpperCase()

  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i
  const threadMatch = str.match(threadRegex)
  if (!threadMatch) throw new Error("Failed to extract Metric parameters from Nut string.")

  const nominalDiameter = parseFloat(threadMatch[1])
  const size = `M${nominalDiameter}`

  let threadSeries = 'COARSE'
  if (threadMatch[2]) {
    threadSeries = 'FINE'
  }
  const spec = getThreadSpec(size, threadSeries)

  const pitch = spec.pitch

  const toleranceMatch = str.match(/(?:\s|-)([4-7][G-H])(?:\s|-|\$)/)
  const threadTolerance = toleranceMatch ? toleranceMatch[1].toUpperCase() : '6H' 

  const standardMatch = str.match(/\b(ISO|DIN)\s*(\d{3,5})\b/);
  const prefix = standardMatch ? standardMatch[1] : "ISO";
  const standardNum = standardMatch ? standardMatch[2] : "4032";

  let standard = "ISO_4032_HEX_STANDARD"; // Default fallback

  if (prefix === "DIN") {
    if (standardNum === "934") {
      standard = "DIN_934_HEX_STANDARD";
    } else if (standardNum === "557") {
      standard = "DIN_557_SQUARE";
    } else if (standardNum === "439") {
      standard = "ISO_4035_HEX_THIN_JAM"; // DIN 439 maps to thin jam nut
    } else if (standardNum === "985") {
      standard = "ISO_10511_LOCK_THIN"; // DIN 985 maps to thin nylon lock nut
    } else if (standardNum === "982") {
      standard = "ISO_7040_LOCK_STANDARD"; // DIN 982 maps to standard nylon lock nut
    }
  } else {
    // 1. Plain & Structural Nuts (ISO)
    if (standardNum === "4033") {
      standard = "ISO_4033_HEX_HIGH";
    } else if (standardNum === "4035" || str.includes("THIN JAM")) {
      standard = "ISO_4035_HEX_THIN_JAM";
    } else if (standardNum === "7414" || str.includes("STRUCTURAL HEAVY")) {
      standard = "ISO_7414_HEX_STRUCTURAL_HEAVY";

    // 2. Lock Nuts (Nylon Insert / Prevailing Torque)
    } else if (standardNum === "7040" || standardNum === "10512" || (str.includes("LOCK") && str.includes("REGULAR"))) {
      standard = "ISO_7040_LOCK_STANDARD";
    } else if (standardNum === "10511" || (str.includes("LOCK") && str.includes("THIN"))) {
      standard = "ISO_10511_LOCK_THIN";
    } else if (standardNum === "7041" || (str.includes("LOCK") && str.includes("HIGH"))) {
      standard = "ISO_7041_LOCK_HIGH";
    }
  }

  const { material, coating } = extractMaterialAndCoating(str)

  // --- ISO 965-1 Sizing and Tolerance Formulas ---
  // The fundamental minor diameter floor baseline (Zero Line)
  const basicMinorDiameter = nominalDiameter - (1.08253 * pitch)
  
  // Dynamic calculation table for Internal Minor Diameter Tolerance (TD1) in microns (µm)
  // Maps standard ISO 965-1 Grade 6 allowances based on pitch intervals
  let toleranceMicrons = 150 // Default fallback for common mid-sizes
  if (pitch <= 0.25)  toleranceMicrons = 56
  else if (pitch <= 0.35) toleranceMicrons = 80
  else if (pitch <= 0.5)  toleranceMicrons = 112
  else if (pitch <= 0.75) toleranceMicrons = 150
  else if (pitch <= 1.0)  toleranceMicrons = 190
  else if (pitch <= 1.25) toleranceMicrons = 212
  else if (pitch <= 1.5)  toleranceMicrons = 236
  else if (pitch <= 1.75) toleranceMicrons = 265
  else if (pitch <= 2.0)  toleranceMicrons = 300
  else if (pitch <= 3.0)  toleranceMicrons = 375
  else if (pitch <= 4.0)  toleranceMicrons = 480

  // Convert structural microns to millimeters
  const td1 = toleranceMicrons / 1000
  
  // Set fundamental deviations based on tolerance zone letters (H vs G)
  const fundamentalDeviation = (threadTolerance.endsWith('G')) ? (0.03 + (0.01 * pitch)) : 0.0

  // Absolute Engineering Min and Max Limits for the hole before tapping
  const drillHoleMin = Number((basicMinorDiameter + fundamentalDeviation).toFixed(3))
  const drillHoleMax = Number((basicMinorDiameter + fundamentalDeviation + td1).toFixed(3))

  // The recommended commercial shop drill bit selection value (Target value)
  let recommendedDrill = Number((nominalDiameter - pitch).toFixed(2))
  if (threadTolerance === '6G') recommendedDrill = Number((recommendedDrill + 0.04).toFixed(2))

  return {
    size,
    pitch,
    threadSeries,
    threadTolerance,
    material,
    coating,
    standard,
    drillingSpecifications: {
      recommendedDrillBitSize: recommendedDrill,
      allowableHoleMinimum: drillHoleMin,
      allowableHoleMaximum: drillHoleMax
    }
  }
}

/**
 * Parses ISO/DIN washer specification.
 *
 * NOTE: All returned specifications are millimeters.
 * 
 * @memberof jscad-fastener/iso
 * @param {String} str - specification, e.g. "Plain Washer, ISO 7089, M12, 200HV, Zinc"
 * @returns {Object} ISO washer specification
 */
export const parseWasherSpec = (str) => {
  if (!str || typeof str !== 'string') {
    throw new Error("Missing string parameter; str")
  }

  str = str.toUpperCase()

  // 1. Structural Sizing Match (Extracts numbers like 12 from "M12" or "M12.5")
  const sizeMatch = str.match(/M\s*(\d+(?:\.\d+)?)/i)
  if (!sizeMatch) {
    throw new Error("Failed to parse mechanical boundary dimensions from Metric Washer specification.")
  }
  const size = `M${sizeMatch[1]}` // e.g., "M12"

  // 2. Resolve Precise Engineering Standards & Default Mappings
  let standard = "ISO_7090" // System baseline default fallback

  // Captures Prefix (1), Number (2), and optional single Form Letter (3) like DIN125A or DIN 127 B
  const standardMatch = str.match(/\b(ISO|DIN)\s*(\d{3,5})(?:\s*([A-Z]))?\b/)

  if (standardMatch) {
    // 1. Prioritize explicit DIN/ISO standards stated in the spec
    const prefix = standardMatch.at(1)
    const num = standardMatch.at(2)
    const form = standardMatch.at(3)
    standard = form ? `${prefix}_${num}_${form}` : `${prefix}_${num}`
  } else if (str.includes("STAR") || str.includes("TOOTH") || str.includes("SERRATED")) {
    // 2. Check specific lock washer subtypes before generic "LOCK"
    standard = str.includes("INTERNAL") ? "DIN_6797_J" : "DIN_6797_A"
  } else if (str.includes("SPLIT") || str.includes("LOCK") || str.includes("HELICAL")) {
    standard = str.includes("HIGH COLLAR") ? "DIN_7980" : "DIN_127_B"
  } else if (str.includes("HEAVY STRUCTURAL") || str.includes("14399") || str.includes("6916")) {
    standard = "EN_14399_6_STRUCTURAL"
  } else if (str.includes("EXTRA WIDE") || str.includes("EXTRA LARGE") || str.includes("440")) {
    standard = "ISO_7094" // Extra Large Timber Washer
  } else if (str.includes("WIDE") || str.includes("LARGE") || str.includes("9021")) {
    standard = "ISO_7093" // Standard Wide/Large Washer
  } else if (str.includes("NARROW") || str.includes("SMALL")) {
    standard = "ISO_7092" // Small Series Washer
  }

  // 3. Dynamic Vickers Hardness (HV) Target Configuration
  const hvMatch = str.match(/(\d+)\s*HV/i)
  let hardnessHV = 200 // General engineering baseline default for Grade A plain washers

  if (hvMatch) {
    hardnessHV = parseInt(hvMatch[1], 10)
  } else {
    // Dynamic fallbacks when no explicit hardness is provided in the string
    if (standard === "EN_14399_6_STRUCTURAL") {
      hardnessHV = 350 // Hardened high-strength structural grade baseline (~35 HRC)
    } else if (standard === "ISO_7091") {
      hardnessHV = 100 // Soft Product Grade C architectural steel plate washer baseline
    } else if (standard === "ISO_7089" || standard === "ISO_7090") {
      hardnessHV = 200 // Standard Product Grade A baseline
    } else if (standard.includes("DIN_")) {
      hardnessHV = 400 // Hardened spring steels used for locking washers require massive thresholds (~40 HRC)
    }
  }

  // 4. Resolve Materials & Plating Coatings
  let material = "Carbon Steel"
  if (str.includes("STAINLESS") || str.includes("A2") || str.includes("A4")) {
    material = "Stainless Steel"
  }

  let coating = "Bare Metal"
  if (str.includes("ZINC") || str.includes("GALVANIZED") || str.includes("HDG")) {
    coating = str.includes("HDG") ? "Hot Dip Galvanized" : "Zinc Plated"
  } else if (str.includes("BLACK OXIDE")) {
    coating = "Black Oxide"
  }

  // 5. Output Normalized Data Token Payload (Pure Millimeters)
  return {
    size,
    standard,
    hardnessHV,
    material,
    coating
  }
}
