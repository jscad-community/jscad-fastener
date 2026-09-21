/**
 * ============================================================================
 * METRIC FASTENER MASTER REGISTRY DATA (ISO)
 * Dimensional units are in millimeters (mm).
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
  "M48": { Coarse: 5.0, Fine: 3.0 },  "M64": { Coarse: 6.0, Fine: 4.0 }
};

const ISO_NUT_REGISTRY = {
  "ISO_4032_NORMAL": [
    ["M2", 4.0, 1.6], ["M3", 5.5, 2.4], ["M4", 7.0, 3.2], ["M5", 8.0, 4.7],
    ["M6", 10.0, 5.2], ["M8", 13.0, 6.8], ["M10", 16.0, 8.4], ["M12", 18.0, 10.8],
    ["M16", 24.0, 14.8], ["M20", 30.0, 18.0], ["M24", 36.0, 21.5]
  ]
};

// Global helper function for internal coarse lookups
function lookupCoarsePitch(size) {
  return ISO_PITCH_REGISTRY[size] ? ISO_PITCH_REGISTRY[size].Coarse : 1.0;
}

/**
 * ============================================================================
 * PROCEDURAL PARSING FUNCTIONS (ISO 8991 STANDARDS)
 * ============================================================================
 */

function determineFastenerType(str) {
  const lower = str.toLowerCase();
  if (lower.includes('bolt') || lower.includes('screw')) return 'BOLT';
  if (lower.includes('washer')) return 'WASHER';
  if (lower.includes('nut')) return 'NUT';
  return null;
}

function extractMaterialAndCoating(str) {
  const lower = str.toLowerCase();
  let material = 'Carbon Steel'; // Standard industrial base default
  let coating = 'Plain Finish';

  // 1. Parse Material Types
  if (lower.includes('a2-70') || lower.includes('a2-50') || lower.includes('a2 ')) {
    material = 'A2 Stainless Steel';
  } else if (lower.includes('a4-80') || lower.includes('a4-70') || lower.includes('a4 ')) {
    material = 'A4 Stainless Steel (Marine Grade)';
  } else if (lower.includes('stainless')) {
    material = 'Stainless Steel (Unspecified)';
  }

  // 2. Parse Corrosion Protection Coatings (ISO 4042 / ISO 10684)
  if (lower.includes('hot-dip') || lower.includes('hdg') || lower.includes('galvanized')) {
    coating = 'Hot-Dip Galvanized';
  } else if (lower.includes('zinc') || lower.includes('electroplated') || lower.includes('a2l')) {
    coating = 'Zinc Electroplated';
  } else if (lower.includes('passivated')) {
    coating = 'Passivated';
  } else if (material.includes('Stainless')) {
    coating = 'Clean Passivated'; // Stainless defaults away from plating requirements
  }

  return { material, coating };
}

function parseISOBolt(str) {
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+))?/i;
  const threadMatch = str.match(threadRegex);
  
  const propertyClassRegex = /(?:-\s*|\s)(4\.6|5\.6|8\.8|10\.9|12\.9)(?:\s|-|$)/;
  const classMatch = str.match(propertyClassRegex);

  if (!threadMatch) throw new Error("Failed to extract Metric Thread footprint properties from Bolt string.");

  const size = `M${threadMatch[1]}`;
  let pitch = null;
  let threadSeries = 'Coarse';

  if (threadMatch[2] && threadMatch[3]) {
    pitch = parseFloat(threadMatch[2]);
    threadSeries = 'Fine';
  } else {
    pitch = lookupCoarsePitch(size);
  }

  const { material, coating } = extractMaterialAndCoating(str);

  return {
    size,
    pitch,
    threadSeries,
    propertyClass: classMatch ? classMatch[1] : (material.includes('Stainless') ? 'A2-70' : '8.8'),
    material,
    coating
  };
}

function parseISOWasher(str) {
  const sizeRegex = /M(\d+(?:\.\d+)?)/i;
  const sizeMatch = str.match(sizeRegex);
  
  const standardRegex = /ISO\s*(\d{4})/i;
  const standardMatch = str.match(standardRegex);
  
  const hvRegex = /(\d{3})\s*(?:HV)?/i;
  const hvMatch = str.match(hvRegex);

  if (!sizeMatch) throw new Error("Failed to parse nominal thread diameter envelope for Washer.");

  const size = `M${sizeMatch[1]}`;
  const standard = standardMatch ? `ISO ${standardMatch[1]}` : "ISO 7090";
  let hardnessHV = hvMatch ? hvMatch[1] : "200";

  if (!hvMatch && standard === "ISO 7091") hardnessHV = "100";

  const { material, coating } = extractMaterialAndCoating(str);

  return { size, standard, hardnessHV, material, coating };
}

function parseISONut(str) {
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i;
  const threadMatch = str.match(threadRegex);
  
  const standardRegex = /ISO\s*(\d{4})/i;
  const standardMatch = str.match(standardRegex);

  if (!threadMatch) throw new Error("Failed to extract diameter matrix coordinates for Nut specification.");

  const size = `M${threadMatch[1]}`;
  const standardNum = standardMatch ? standardMatch[1] : "4032";
  const pitch = threadMatch[2] ? parseFloat(threadMatch[2]) : lookupCoarsePitch(size);

  const { material, coating } = extractMaterialAndCoating(str);

  return {
    size,
    pitch,
    standard: standardNum === "4033" ? "ISO_4033_HIGH" : "ISO_4032_NORMAL",
    material,
    coating
  };
}

// Flat, entry point router function
function parseISOFastener(rawString) {
  if (!rawString || typeof rawString !== 'string') return null;
  const normalized = rawString.replace(/\s+/g, ' ').trim();
  const type = determineFastenerType(normalized);
  
  if (type === 'BOLT') return parseISOBolt(normalized);
  if (type === 'WASHER') return parseISOWasher(normalized);
  if (type === 'NUT') return parseISONut(normalized);
  
  throw new Error(`Unable to resolve fastener classification for: "${rawString}"`);
}

/**
 * ============================================================================
 * METRIC ISO ASSEMBLY VALIDATION ENGINE (FLATTENED EXTENSION)
 * ============================================================================
 */
function validateISOMetricAssembly(assembly) {
  const { bolt, washer, nut } = assembly;
  const errors = [];
  const warnings = [];

  console.log(`\n⚙️ Evaluating Metric Joint:`);
  console.log(` -> Bolt:   ${bolt.size} (${bolt.material} / ${bolt.coating})`);
  console.log(` -> Washer: ${washer.standard} (${washer.material} / ${washer.coating})`);
  console.log(` -> Nut:    ${nut.standard} (${nut.material} / ${nut.coating})`);

  // 1. Thread Geometry Interlocking Validations
  if (bolt.pitch !== nut.pitch) {
    errors.push(`CRITICAL: Thread pitch mismatch. Bolt has ${bolt.pitch}mm, but Nut has ${nut.pitch}mm.`);
  }
  if (bolt.size !== washer.size || bolt.size !== nut.size) {
    errors.push(`CRITICAL: Sizing interface error. Bolt (${bolt.size}), Washer (${washer.size}), and Nut (${nut.size}) must share identical nominal footprints.`);
  }

  // 2. Material Compatibility Matrix Check
  const isBoltStainless = bolt.material.includes('Stainless');
  const isWasherStainless = washer.material.includes('Stainless');
  const isNutStainless = nut.material.includes('Stainless');

  if ((isBoltStainless && !isWasherStainless) || (!isBoltStainless && isWasherStainless)) {
    errors.push(`CRITICAL: Galvanic Corrosion Risk! Do not mix Stainless Steel and regular Carbon Steel components (${bolt.material} vs ${washer.material}).`);
  }
  if (isBoltStainless && !isNutStainless) {
    errors.push(`CRITICAL: Material mismatch! Stainless steel bolt paired with carbon steel nut. This connection will quickly lock up or corrode.`);
  }

  // 3. Corrosion Coating Profile Compatibility Check
  if (!isBoltStainless) { // Only evaluate plating matches on carbon steels
    if (bolt.coating !== washer.coating || bolt.coating !== nut.coating) {
      warnings.push(`WARNING: Coating mismatched across assembly items. Bolt: [${bolt.coating}], Washer: [${washer.coating}], Nut: [${nut.coating}]. Mixing different protective coatings can accelerate zinc depletion.`);
    }
    if (bolt.coating === 'Hot-Dip Galvanized' && nut.coating === 'Zinc Electroplated') {
      errors.push(`CRITICAL: Mechanical Assembly Fail! A Hot-Dip Galvanized bolt thread layer is too thick for a standard zinc electroplated nut. The nut will jam during installation.`);
    }
  }

  // 4. Hardness Class Limits
  const boltClass = parseFloat(bolt.propertyClass);
  const washerHV = parseInt(washer.hardnessHV, 10);

  if (!isNaN(boltClass) && !isNaN(washerHV)) {
    if (boltClass >= 8.8 && washerHV < 200) {
      errors.push(`CRITICAL: Hardness Failure. Property Class ${boltClass} bolt requires at least a 200 HV washer. Current washer is structural grade C (${washerHV} HV) and will collapse.`);
    }
  }

  // Return Processing
  if (errors.length === 0) {
    console.log("✅ Validation successfully PASSED. Joint is compliant.");
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
 * EXECUTING PIPELINE PIPELINE TESTS
 * ============================================================================
 */

// SCENARIO 1: Mixed Materials Error (Stainless Bolt with Carbon Steel Washer)
const rawBOM_1 = {
  bolt:   parseISOFastener("Hex screw ISO 4017 - M8 x 40 - Stainless A2-70"),
  washer: parseISOFastener("Plain Washer ISO 7090 - M8 - 200 HV - Zinc Plated"), 
  nut:    parseISOFastener("Hex nut ISO 4032 - M8 - Stainless A2")
};
validateISOMetricAssembly(rawBOM_1);

