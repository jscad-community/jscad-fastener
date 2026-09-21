/**
 * ============================================================================
 * METRIC FASTENER MASTER REGISTRY DATA (ISO 261 / ISO 262)
 * All values are in millimeters (mm).
 * ============================================================================
 */
const ISO_PITCH_REGISTRY = {
  "M1": { Coarse: 0.25, Fine: null }, "M2": { Coarse: 0.4, Fine: null },
  "M3": { Coarse: 0.5, Fine: null },  "M4": { Coarse: 0.7, Fine: null },
  "M5": { Coarse: 0.8, Fine: 0.5 },   "M6": { Coarse: 1.0, Fine: 0.75 },
  "M8": { Coarse: 1.25, Fine: 1.0 },  "M10": { Coarse: 1.5, Fine: 1.25 },
  "M12": { Coarse: 1.75, Fine: 1.25 }, "M14": { Coarse: 2.0, Fine: 1.5 },
  "M16": { Coarse: 2.0, Fine: 1.5 },  "M20": { Coarse: 2.5, Fine: 1.5 },
  "M24": { Coarse: 3.0, Fine: 2.0 },  "M30": { Coarse: 3.5, Fine: 2.0 },
  "M36": { Coarse: 4.0, Fine: 3.0 },  "M42": { Coarse: 4.5, Fine: 3.0 },
  "M48": { Coarse: 5.0, Fine: 3.0 },  "M64": { Coarse: 6.0, Fine: 4.0 },
  "M68": { Coarse: 6.0, Fine: 4.0 }
};

function lookupCoarsePitch(size) {
  return ISO_PITCH_REGISTRY[size] ? ISO_PITCH_REGISTRY[size].Coarse : 1.0;
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

function parseISOBolt(str) {
  // Regex isolates footprint profiles and thread length steps (e.g., M12x1.25x80 or M12x80)
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+))?/i;
  const threadMatch = str.match(threadRegex);
  if (!threadMatch) throw new Error("Failed to extract Metric Thread parameters from Bolt string.");

  const size = `M${threadMatch[1]}`;
  let pitch = null;
  let threadSeries = 'Coarse';

  if (threadMatch[2] && threadMatch[3]) {
    pitch = parseFloat(threadMatch[2]);
    threadSeries = 'Fine';
  } else {
    pitch = lookupCoarsePitch(size);
  }

  // Regex extracts ISO 965 lower-case external tolerances (e.g., 6g, 6h, 4h6h)
  const toleranceMatch = str.match(/(?:\s|-)([4-7][a-h](?:[4-7][a-h])?)(?:\s|-|\$)/);
  const threadTolerance = toleranceMatch ? toleranceMatch[1] : '6g'; // Standard structural commercial baseline

  const propertyClassMatch = str.match(/(?:\s|-)(4\.6|5\.6|8\.8|10\.9|12\.9)(?:\s|-|\$)/);
  const { material, coating } = extractMaterialAndCoating(str);

  return {
    size,
    pitch,
    threadSeries,
    threadTolerance,
    propertyClass: propertyClassMatch ? propertyClassMatch[1] : (material.includes('Stainless') ? 'A2-70' : '8.8'),
    material,
    coating
  };
}

function parseISONut(str) {
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i;
  const threadMatch = str.match(threadRegex);
  if (!threadMatch) throw new Error("Failed to extract Metric parameters from Nut string.");

  const size = `M${threadMatch[1]}`;
  const pitch = threadMatch[2] ? parseFloat(threadMatch[2]) : lookupCoarsePitch(size);

  const toleranceMatch = str.match(/(?:\s|-)([4-7][G-H])(?:\s|-|\$)/);
  const threadTolerance = toleranceMatch ? toleranceMatch[1] : '6H'; 

  const standardMatch = str.match(/ISO\s*(\d{4})/i);
  const { material, coating } = extractMaterialAndCoating(str);

  // --- ISO 965 Tap Drill Calculation ---
  // Standard metric internal thread formula: Drill Diameter = Nominal Diameter - Thread Pitch
  const nominalDiameter = parseFloat(threadMatch[1]);
  let tapDrillDiameter = Number((nominalDiameter - pitch).toFixed(2));
  
  // Rule Modifiers for 6G Oversized Coating Fits
  if (threadTolerance === '6G') {
    // 6G nuts are over-tapped slightly (~0.03mm to 0.05mm larger) to clear thick hot-dip galvanizing
    tapDrillDiameter = Number((tapDrillDiameter + 0.04).toFixed(2));
  }

  return {
    size,
    pitch,
    threadTolerance,
    tapDrillDiameter,
    standard: standardMatch && standardMatch[1] === "4033" ? "ISO_4033_HIGH" : "ISO_4032_NORMAL",
    material,
    coating
  };
}

function parseISOWasher(str) {
  const sizeMatch = str.match(/M(\d+(?:\.\d+)?)/i);
  if (!sizeMatch) throw new Error("Failed to parse nominal thread diameter envelope for Washer.");

  const standardMatch = str.match(/ISO\s*(\d{4})/i);
  const hvMatch = str.match(/(\d{3})\s*(?:HV)?/i);

  const size = `M${sizeMatch[1]}`;
  const standard = standardMatch ? `ISO ${standardMatch[1]}` : "ISO 7090";
  let hardnessHV = hvMatch ? hvMatch[1] : "200";
  if (!hvMatch && standard === "ISO 7091") hardnessHV = "100";

  const { material, coating } = extractMaterialAndCoating(str);
  return { size, standard, hardnessHV, material, coating };
}

function parseISOFastener(rawString) {
  if (!rawString || typeof rawString !== 'string') return null;
  const normalized = rawString.replace(/\s+/g, ' ').trim();
  const lower = normalized.toLowerCase();
  
  if (lower.includes('bolt') || lower.includes('screw')) return parseISOBolt(normalized);
  if (lower.includes('washer')) return parseISOWasher(normalized);
  if (lower.includes('nut')) return parseISONut(normalized);
  
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

// SCENARIO 1: Interferences from thick zinc layers (Fails)
const badGalvanizedStack = {
  bolt:   parseISOFastener("Hex structural bolt ISO 4014 - M16 x 80 - 6g - 10.9 - Hot-Dip Galvanized"), // 6g tight space
  washer: parseISOFastener("Plain Washer ISO 7090 - M16 - 300 HV - HDG Finish"),
  nut:    parseISOFastener("Hex nut ISO 4032 - M16 - 6H - Zinc Plated") // 6H cannot accept HDG bolts cleanly
};
validateISOMetricAssembly(badGalvanizedStack);

// SCENARIO 2: Valid High-Precision Coarse Assembly with proper allowances (Passes)
const correctStack = {
  bolt:   parseISOFastener("Hex head screw ISO 4017 - M12 x 50 - 6g - 8.8 - Zinc Electroplated"),
  washer: parseISOFastener("Plain Washer ISO 7090 - M12 - 200 HV"),
  nut:    parseISOFastener("Hex nut ISO 4032 - M12 - 6H")
};
validateISOMetricAssembly(correctStack);

