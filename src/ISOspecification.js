import { getThreadSpec } from './threads.js'

/**
 * ISO 273 Bolt Clearance Hole Diameters (all values in mm)
 * Map structure optimized for clean, semantic UI and geometry engine routing.
 * Formatted with explicit keys for: close (H12), normal (H13), and loose (H14) fit conditions.
 */
export const ISO_273_CLEARANCE_HOLES = {
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

/**
 * ============================================================================
 * EXPANDED PROCEDURAL PARSING FUNCTIONS (ISO 8991 & ISO 965)
 * ============================================================================
 */
function extractMaterialAndCoating(str) {
  const lower = str.toLowerCase();
  let material = 'Carbon Steel';
  let coating = 'Plain Finish';

  if (lower.includes('a2-70') || lower.includes('a2 ')) material = 'A2 Stainless Steel';
  else if (lower.includes('a4-80') || lower.includes('a4 ')) material = 'A4 Stainless Steel';

  if (lower.includes('hot-dip') || lower.includes('hdg') || lower.includes('galvanized')) coating = 'Hot-Dip Galvanized';
  else if (lower.includes('zinc') || lower.includes('electroplated')) coating = 'Zinc Electroplated';
  else if (material.includes('Stainless')) coating = 'Clean Passivated';

  return { material, coating };
}

/**
 * Procedural function calculating bolt specifications.
 * Dynamically appends ISO 273 clearance hole guidelines based on the nominal size.
 */
export const parseBoltSpec = (str) => {
  // 1. Extract the Bolt Standard / Specification (e.g., ISO 4014, ISO 4017, DIN 931)
  const standardRegex = /(ISO|DIN)\s*\d+/i;
  const standardMatch = str.match(standardRegex);
  // Normalize formatting (e.g., "iso 4014" -> "ISO 4014")
  let standard = standardMatch ? standardMatch[0].toUpperCase().replace(/\s+/g, ' ') : 'ISO 4017';

  // 2. Parse Thread Parameters
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+))?/i;
  const threadMatch = str.match(threadRegex);
  if (!threadMatch) throw new Error("Failed to extract Metric Thread parameters from Bolt string.");

  const nominalDiameter = parseFloat(threadMatch[1]);
  const size = `M${nominalDiameter}`;

  let spec = null
  if (threadMatch[2] && threadMatch[3]) {
    spec = getThreadSpec('ISO', size, 'FINE')
  } else {
    spec = getThreadSpec('ISO', size, 'COARSE')
  }

  const toleranceMatch = str.match(/(?:\s|-)([4-7][a-h](?:[4-7][a-h])?)(?:\s|-|\$)/);
  const threadTolerance = toleranceMatch ? toleranceMatch[1] : '6g';

  const propertyClassMatch = str.match(/(?:\s|-)(4\.6|5\.6|8\.8|10\.9|12\.9)(?:\s|-|\$)/);
  const propertyClass = propertyClassMatch ? propertyClassMatch[1] : (material.includes('Stainless') ? 'A2-70' : '8.8')

  const { material, coating } = extractMaterialAndCoating(str);

  // --- ISO 273 Clearance Hole Matrix ---
  let fineHole, mediumHole, coarseHole;

  if (nominalDiameter <= 1) {
    fineHole = nominalDiameter + 0.1;   mediumHole = nominalDiameter + 0.2;   coarseHole = nominalDiameter + 0.3;
  } else if (nominalDiameter <= 2) {
    fineHole = nominalDiameter + 0.1;   mediumHole = nominalDiameter + 0.2;   coarseHole = nominalDiameter + 0.4;
  } else if (nominalDiameter <= 4) {
    fineHole = nominalDiameter + 0.1;   mediumHole = nominalDiameter + 0.3;   coarseHole = nominalDiameter + 0.5;
  } else if (nominalDiameter <= 6) {
    fineHole = nominalDiameter + 0.2;   mediumHole = nominalDiameter + 0.4;   coarseHole = nominalDiameter + 0.6;
  } else if (nominalDiameter <= 12) {
    fineHole = nominalDiameter + 0.5;   mediumHole = nominalDiameter + 1.0;   coarseHole = nominalDiameter + 1.5;
  } else if (nominalDiameter <= 20) {
    fineHole = nominalDiameter + 1.0;   mediumHole = nominalDiameter + 2.0;   coarseHole = nominalDiameter + 3.0;
  } else if (nominalDiameter <= 42) {
    fineHole = nominalDiameter + 2.0;   mediumHole = nominalDiameter + 3.0;   coarseHole = nominalDiameter + 5.0;
  } else { 
    fineHole = nominalDiameter + 3.0;   mediumHole = nominalDiameter + 4.0;   coarseHole = nominalDiameter + 6.0;
  }

  return {
    size,
    pitch: spec.pitch,
    threadSeries: spec.threadSeries,
    standard,
    threadTolerance,
    propertyClass,
    material,
    coating,
    clearanceSpecifications: {
      standard: "ISO 273",
      fineFitHole: Number(fineHole.toFixed(1)),
      mediumFitHole: Number(mediumHole.toFixed(1)), 
      coarseFitHole: Number(coarseHole.toFixed(1))
    }
  };
}

/**
 * Procedural function calculating the internal minor thread limits for 6H/6G.
 * Dynamically outputs tap drill hole sizing with absolute structural limits.
 */
export const parseNutSpec = (str) => {
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i;
  const threadMatch = str.match(threadRegex);
  if (!threadMatch) throw new Error("Failed to extract Metric parameters from Nut string.");

  const nominalDiameter = parseFloat(threadMatch[1]);
  const size = `M${nominalDiameter}`;

  let threadSeries = 'COARSE'
  if (threadMatch[2]) {
    threadSeries = 'FINE'
  }
  const spec = getThreadSpec('ISO', size, threadSeries)

  const pitch = spec.pitch

  const toleranceMatch = str.match(/(?:\s|-)([4-7][G-H])(?:\s|-|\$)/);
  const threadTolerance = toleranceMatch ? toleranceMatch[1].toUpperCase() : '6H'; 

  const standardMatch = str.match(/ISO\s*(\d{4})/i);
  const standardNum = standardMatch ? standardMatch[1] : "4032";
  const standard = standardNum === "4033" ? "ISO_4033_HIGH" : "ISO_4032_NORMAL"

  const { material, coating } = extractMaterialAndCoating(str);

  // --- ISO 965-1 Sizing and Tolerance Formulas ---
  // The fundamental minor diameter floor baseline (Zero Line)
  const basicMinorDiameter = nominalDiameter - (1.08253 * pitch);
  
  // Dynamic calculation table for Internal Minor Diameter Tolerance (TD1) in microns (µm)
  // Maps standard ISO 965-1 Grade 6 allowances based on pitch intervals
  let toleranceMicrons = 150; // Default fallback for common mid-sizes
  if (pitch <= 0.25)  toleranceMicrons = 56;
  else if (pitch <= 0.35) toleranceMicrons = 80;
  else if (pitch <= 0.5)  toleranceMicrons = 112;
  else if (pitch <= 0.75) toleranceMicrons = 150;
  else if (pitch <= 1.0)  toleranceMicrons = 190;
  else if (pitch <= 1.25) toleranceMicrons = 212;
  else if (pitch <= 1.5)  toleranceMicrons = 236;
  else if (pitch <= 1.75) toleranceMicrons = 265;
  else if (pitch <= 2.0)  toleranceMicrons = 300;
  else if (pitch <= 3.0)  toleranceMicrons = 375;
  else if (pitch <= 4.0)  toleranceMicrons = 480;

  // Convert structural microns to millimeters
  const td1 = toleranceMicrons / 1000;
  
  // Set fundamental deviations based on tolerance zone letters (H vs G)
  const fundamentalDeviation = (threadTolerance.endsWith('G')) ? (0.03 + (0.01 * pitch)) : 0.0;

  // Absolute Engineering Min and Max Limits for the hole before tapping
  const drillHoleMin = Number((basicMinorDiameter + fundamentalDeviation).toFixed(3));
  const drillHoleMax = Number((basicMinorDiameter + fundamentalDeviation + td1).toFixed(3));

  // The recommended commercial shop drill bit selection value (Target value)
  let recommendedDrill = Number((nominalDiameter - pitch).toFixed(2));
  if (threadTolerance === '6G') recommendedDrill = Number((recommendedDrill + 0.04).toFixed(2));

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
  };
}

/**
 * Parses metric/ISO/DIN washer specification strings.
 * Maintained strictly in millimeters (mm).
 * 
 * @param {string} str - e.g., "Plain Washer, ISO 7089, M12, 200HV, Zinc"
 * @returns {Object} Clean token matching the unified formatting footprint of the system.
 */
export const parseWasherSpec = (str) => {
  if (!str || typeof str !== 'string') {
    throw new Error("Invalid Input: String required for ISO washer parsing pipeline.");
  }

  const upperStr = str.toUpperCase();

  // 1. Structural Sizing Match (Extracts numbers like 12 from "M12" or "M12.5")
  const sizeMatch = str.match(/M\s*(\d+(?:\.\d+)?)/i);
  if (!sizeMatch) {
    throw new Error("Failed to parse mechanical boundary dimensions from Metric Washer specification.");
  }
  const size = `M${sizeMatch[1]}`; // e.g., "M12"

  // 2. Resolve Precise Engineering Standards & Default Mappings
  let standard = "ISO_7090"; // System baseline default fallback
  
  const standardMatch = str.match(/(?:ISO|DIN)\s*(\d+)/i);

  if (upperStr.includes("SPLIT") || upperStr.includes("LOCK") || upperStr.includes("HELICAL")) {
    standard = upperStr.includes("HIGH COLLAR") ? "DIN_7980" : "DIN_127_B";
  } else if (upperStr.includes("STAR") || upperStr.includes("TOOTH") || upperStr.includes("SERRATED")) {
    standard = upperStr.includes("INTERNAL") ? "DIN_6797_J" : "DIN_6797_A";
  } else if (upperStr.includes("HEAVY STRUCTURAL") || upperStr.includes("14399") || upperStr.includes("6916")) {
    standard =  "EN_14399_6_STRUCTURAL"
  } else if (upperStr.includes("EXTRA WIDE") || upperStr.includes("EXTRA LARGE") || upperStr.includes("440")) {
    standard = "ISO_7094"; // Extra Large Timber Washer
  } else if (upperStr.includes("WIDE") || upperStr.includes("LARGE") || upperStr.includes("9021")) {
    standard = "ISO_7093"; // Standard Wide/Large Washer
  } else if (upperStr.includes("NARROW") || upperStr.includes("SMALL")) {
    standard = "ISO_7092"; // Small Series Washer
  } else if (standardMatch) {
    standard = `ISO_${standardMatch[1]}`
  }

  // 3. Dynamic Vickers Hardness (HV) Target Configuration
  const hvMatch = str.match(/(\d+)\s*HV/i);
  let hardnessHV = 200; // General engineering baseline default for Grade A plain washers

  if (hvMatch) {
    hardnessHV = parseInt(hvMatch[1], 10);
  } else {
    // Dynamic fallbacks when no explicit hardness is provided in the string
    if (standard === "EN_14399_6_STRUCTURAL") {
      hardnessHV = 350; // Hardened high-strength structural grade baseline (~35 HRC)
    } else if (standard === "ISO_7091") {
      hardnessHV = 100; // Soft Product Grade C architectural steel plate washer baseline
    } else if (standard === "ISO_7089" || standard === "ISO_7090") {
      hardnessHV = 200; // Standard Product Grade A baseline
    } else if (standard.includes("DIN_")) {
      hardnessHV = 400; // Hardened spring steels used for locking washers require massive thresholds (~40 HRC)
    }
  }

  // 4. Resolve Materials & Plating Coatings
  let material = "Carbon Steel";
  if (upperStr.includes("STAINLESS") || upperStr.includes("A2") || upperStr.includes("A4")) {
    material = "Stainless Steel";
  }

  let coating = "Bare Metal";
  if (upperStr.includes("ZINC") || upperStr.includes("GALVANIZED") || upperStr.includes("HDG")) {
    coating = upperStr.includes("HDG") ? "Hot Dip Galvanized" : "Zinc Plated";
  } else if (upperStr.includes("BLACK OXIDE")) {
    coating = "Black Oxide";
  }

  // 5. Output Normalized Data Token Payload (Pure Millimeters)
  return {
    size,
    standard,
    hardnessHV,
    material,
    coating
  };
}


function parseISOFastener(rawString) {
  if (!rawString || typeof rawString !== 'string') return null;
  const normalized = rawString.replace(/\s+/g, ' ').trim();
  const lower = normalized.toLowerCase();
  
  if (lower.includes('bolt') || lower.includes('screw')) return parseBoltSpec(normalized);
  if (lower.includes('washer')) return parseWasherSpec(normalized);
  if (lower.includes('nut')) return parseNutSpec(normalized);
  
  throw new Error(`Unable to resolve fastener classification for: "${rawString}"`);
}

/**
 * ============================================================================
 * METRIC ISO ASSEMBLY VALIDATION ENGINE WITH TOLERANCE CHECKS
 * ============================================================================
 */
function validateISOMetricAssembly(assembly) {
  const { bolt, washer, nut } = assembly;
  const errors = [];
  const warnings = [];

  console.log(`\n⚙️ Evaluating Metric Joint with Tolerance Controls:`);
  console.log(` -> Bolt:   ${bolt.size} Pitch:${bolt.pitch}mm Tolerance:${bolt.threadTolerance}`);
  console.log(` -> Washer: ${washer.standard} (${washer.material})`);
  console.log(` -> Nut:    ${nut.size} Pitch:${nut.pitch}mm Tolerance:${nut.threadTolerance}`);

  // 1. Thread Sizing & Interface Layout Matching Check
  if (bolt.pitch !== nut.pitch) {
    errors.push(`CRITICAL: Thread pitch mismatch! Bolt pitch is ${bolt.pitch}mm, but Nut pitch is ${nut.pitch}mm.`);
  }
  if (bolt.size !== washer.size || bolt.size !== nut.size) {
    errors.push(`CRITICAL: Diameter Interface mismatch! Components must share exact nominal steps.`);
  }

  // 2. ISO 965 Allowance & Interference Mechanical Fit Evaluation
  const bTol = bolt.threadTolerance.toLowerCase(); // Lower-case external zone check
  const nTol = nut.threadTolerance.toUpperCase();   // Upper-case internal zone check

  if (bolt.coating === 'Hot-Dip Galvanized') {
    // Structural Rule: Galvanized shanks are too thick for tight '6g' external limits unless oversized '6G' nuts are explicitly selected
    if (bTol === '6g' && nTol === '6H') {
      errors.push(`CRITICAL: Thread Interference Hazard! A Hot-Dip Galvanized bolt coating will jam inside a standard 6H nut profile. Requires an over-tapped 6G structural internal nut fit.`);
    }
  } else {
    // Standard Coating Rule: Heavy clearance configurations should not be mixed unnecessarily
    if (bTol === '6e' && nTol === '6H') {
      warnings.push(`WARNING: Slack fit assembly. Loose clearance position '6e' bolt paired with standard '6H' internal nut. Acceptable for high-temperature settings, but tracks higher vibration play.`);
    }
  }

  // 3. Material Compatibility (Preventing Galvanic Corrosion)
  const isBoltStainless = bolt.material.includes('Stainless');
  const isWasherStainless = washer.material.includes('Stainless');
  if (isBoltStainless !== isWasherStainless) {
    errors.push(`CRITICAL: Galvanic Corrosion Risk! Mixing Stainless Steel components alongside regular Carbon Steels.`);
  }

  // Final Verdict
  if (errors.length === 0) {
    console.log("✅ Validation successfully PASSED. Structural tolerance and alignment checks are compliant.");
    warnings.forEach(w => console.warn(`⚠️ ${w}`));
    return { valid: true, errors, warnings };
  } else {
    console.error("❌ Validation FAILED.");
    errors.forEach(e => console.error(`🛑 ${e}`));
    return { valid: false, errors, warnings };
  }
}

/**
 * ============================================================================
 * EXECUTING SEPARATED TOLERANCE CHECK TESTS
 * ============================================================================
 */

/*
const badGalvanizedStack = {
  bolt:   parseISOFastener("Hex structural bolt ISO 4014 - M16 x 80 - 6g - 10.9 - Hot-Dip Galvanized"), // 6g tight space
  washer: parseISOFastener("Plain Washer ISO 7090 - M16 - 300 HV - HDG Finish"),
  nut:    parseISOFastener("Hex nut ISO 4032 - M16 - 6H - Zinc Plated") // 6H cannot accept HDG bolts cleanly
};
validateISOMetricAssembly(badGalvanizedStack);

const correctStack = {
  bolt:   parseISOFastener("Hex head screw ISO 4017 - M12 x 50 - 6g - 8.8 - Zinc Electroplated"),
  washer: parseISOFastener("Plain Washer ISO 7090 - M12 - 200 HV"),
  nut:    parseISOFastener("Hex nut ISO 4032 - M12 - 6H")
};
validateISOMetricAssembly(correctStack);
*/

