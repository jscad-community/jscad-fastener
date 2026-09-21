/**
 * ============================================================================
 * IMPERIAL FASTENER MASTER REGISTRY DATA (ASME / UTS / ASTM)
 * Thread values map Size -> { Coarse: TPI, Fine: TPI }
 * ============================================================================
 */
const UTS_PITCH_REGISTRY = {
  "#0":  { UNC: null, UNF: 80 },  "#1":  { UNC: 64,   UNF: 72 },
  "#2":  { UNC: 56,   UNF: 64 },  "#3":  { UNC: 48,   UNF: 56 },
  "#4":  { UNC: 40,   UNF: 48 },  "#5":  { UNC: 40,   UNF: 44 },
  "#6":  { UNC: 32,   UNF: 40 },  "#8":  { UNC: 32,   UNF: 36 },
  "#10": { UNC: 24,   UNF: 32 },  "#12": { UNC: 24,   UNF: 28 },
  "1/4": { UNC: 20,   UNF: 28 },  "5/16":{ UNC: 18,   UNF: 24 },
  "3/8": { UNC: 16,   UNF: 24 },  "7/16":{ UNC: 14,   UNF: 20 },
  "1/2": { UNC: 13,   UNF: 20 },  "9/16":{ UNC: 12,   UNF: 18 },
  "5/8": { UNC: 11,   UNF: 18 },  "3/4": { UNC: 10,   UNF: 16 },
  "7/8": { UNC: 9,    UNF: 14 },  "1":   { UNC: 8,    UNF: 12 },
  "1 1/8":{ UNC: 7,   UNF: 12 },  "1 1/4":{ UNC: 7,   UNF: 12 },
  "1 1/2":{ UNC: 6,   UNF: 12 },  "2":   { UNC: 4.5,  UNF: null },
  "3":   { UNC: 4,    UNF: null }, "4":   { UNC: 4,    UNF: null }
};

// ASME B18.6.3 Tap Drill Chart Baseline Decimals
const UTS_TAP_DRILL_DECIMALS = {
  "#0-80": 0.047, "#2-56": 0.070, "#4-40": 0.089, "#6-32": 0.107, "#8-32": 0.136,
  "#10-24": 0.149, "#10-32": 0.159, "1/4-20": 0.201, "1/4-28": 0.213,
  "5/16-18": 0.257, "3/8-16": 0.313, "1/2-13": 0.422, "5/8-11": 0.531, "3/4-10": 0.656
};

function determineUTSType(str) {
  const lower = str.toLowerCase();
  if (lower.includes('bolt') || lower.includes('screw')) return 'BOLT';
  if (lower.includes('washer')) return 'WASHER';
  if (lower.includes('nut')) return 'NUT';
  return null;
}

function extractUTSMaterialAndCoating(str) {
  const lower = str.toLowerCase();
  let material = 'Carbon Steel'; // Default
  let coating = 'Plain Finish';

  if (lower.includes('stainless') || lower.includes('ss316') || lower.includes('grade 316')) {
    material = 'Stainless Steel';
    coating = 'Passivated';
  } else if (lower.includes('grade 8') || lower.includes('grade 5') || lower.includes('a325')) {
    material = 'High-Strength Steel Alloy';
  }

  if (lower.includes('hot-dip') || lower.includes('hdg') || lower.includes('galvanized')) {
    coating = 'Hot-Dip Galvanized';
  } else if (lower.includes('zinc') || lower.includes('plated')) {
    coating = 'Zinc Plated';
  }

  return { material, coating };
}

/**
 * ============================================================================
 * UTS PARSING WORKERS
 * ============================================================================
 */

function parseUTSBolt(str) {
  // Regex captures size patterns like 1/4, 1 1/2, or #10
  const sizeRegex = /((?:#\d+|\d+(?:\s+\d+\/\d+)?|\d+\/\d+))/;
  const match = str.match(sizeRegex);
  if (!match) throw new Error("Could not extract nominal size from UTS string.");
  
  const size = match[1].trim();
  let threadSeries = str.toUpperCase().includes('UNF') ? 'UNF' : 'UNC';
  
  // Isolate TPI explicitly if printed, otherwise lookup from registry
  const tpiMatch = str.match(/(?:-|\s)(\d{2})(?:\s|UNC|UNF)/i);
  let tpi = tpiMatch ? parseInt(tpiMatch[1], 10) : null;
  
  if (!tpi && UTS_PITCH_REGISTRY[size]) {
    tpi = UTS_PITCH_REGISTRY[size][threadSeries];
  }

  // Extract structural grade limits (e.g., Grade 5, Grade 8, A325)
  const gradeMatch = str.match(/(grade\s+[258]|a325|a490)/i);
  const materialGrade = gradeMatch ? gradeMatch[1].toUpperCase() : "Grade 2 Standard";
  
  const { material, coating } = extractUTSMaterialAndCoating(str);

  // --- ASME B18.2.8 Clearance Hole Calculations ---
  let numericSize = parseFloat(size.replace('#', '')) / 10; // Rough proxy for machine size fractions
  if (size.includes('/')) {
    const parts = size.split(' ');
    const frac = parts[parts.length - 1].split('/');
    numericSize = parseInt(frac[0]) / parseInt(frac[1]);
    if (parts.length > 1) numericSize += parseInt(parts[0]);
  }
  
  return {
    size,
    tpi,
    threadSeries,
    materialGrade,
    material,
    coating,
    clearanceSpecifications: {
      standardBody: "ASME B18.2.8",
      normalFitHole: Number((numericSize + 0.032).toFixed(3)), // General engineering clearance rule
      looseFitHole: Number((numericSize + 0.062).toFixed(3))
    }
  };
}

function parseUTSNut(str) {
  const sizeRegex = /((?:#\d+|\d+(?:\s+\d+\/\d+)?|\d+\/\d+))/;
  const match = str.match(sizeRegex);
  if (!match) throw new Error("Could not isolate structural size for UTS Nut.");

  const size = match[1].trim();
  const threadSeries = str.toUpperCase().includes('UNF') ? 'UNF' : 'UNC';
  
  const tpiMatch = str.match(/(?:-|\s)(\d{2})(?:\s|UNC|UNF)/i);
  let tpi = tpiMatch ? parseInt(tpiMatch[1], 10) : null;
  if (!tpi && UTS_PITCH_REGISTRY[size]) tpi = UTS_PITCH_REGISTRY[size][threadSeries];

  const style = str.toUpperCase().includes('HEAVY') ? 'HEAVY_HEX' : 'HEX_STANDARD';
  const { material, coating } = extractUTSMaterialAndCoating(str);

  // --- ASME B18.6.3 Tap Drill Extraction ---
  const key = `${size}-${tpi}`;
  const tapDrillHole = UTS_TAP_DRILL_DECIMALS[key] || "See Manual Specification";

  return {
    size,
    tpi,
    threadSeries,
    style,
    material,
    coating,
    drillingSpecifications: {
      recommendedDrillSizeInch: tapDrillHole
    }
  };
}

function parseUTSWasher(str) {
  const sizeRegex = /((?:#\d+|\d+(?:\s+\d+\/\d+)?|\d+\/\d+))/;
  const match = str.match(sizeRegex);
  if (!match) throw new Error("Could not parse nominal washer sizing constraint.");

  const size = match[1].trim();
  let standard = "ASME B18.21.1 Type A";
  if (str.toUpperCase().includes('F436')) standard = "ASTM F436 Hardened";
  else if (str.toUpperCase().includes('TYPE B') || str.toUpperCase().includes('USS')) standard = "ASME B18.21.1 Type B (USS)";

  const { material, coating } = extractUTSMaterialAndCoating(str);
  return { size, standard, material, coating };
}

// Unified Top-Level Entry Router
function parseUTSFastener(rawString) {
  if (!rawString || typeof rawString !== 'string') return null;
  const normalized = rawString.replace(/\s+/g, ' ').trim();
  const type = determineUTSType(normalized);

  if (type === 'BOLT') return parseUTSBolt(normalized);
  if (type === 'WASHER') return parseUTSWasher(normalized);
  if (type === 'NUT') return parseUTSNut(normalized);

  throw new Error(`Unable to recognize imperial system signature for: "${rawString}"`);
}

/**
 * ============================================================================
 * PIPELINE TOKEN EXECUTION EXAMPLES
 * ============================================================================
 */

// Example 1: Parsing a High-Tensile Structural Coarse Assembly
const parsedStructuralBolt   = parseUTSFastener("Heavy Hex Structural Bolt, A325, 1/2-13 UNC x 2, Zinc Plated");
const parsedStructuralWasher = parseUTSFastener("Hardened Flat Washer ASTM F436 - 1/2 inch");
const parsedStructuralNut    = parseUTSFastener("Heavy Hex Structural Nut 1/2 inch - 13 UNC");

console.log("🛠️ Parsed Imperial Bolt Output Token:\n", JSON.stringify(parsedStructuralBolt, null, 2));
console.log("🛠️ Parsed Imperial Nut Sizing Parameters:\n", JSON.stringify(parsedStructuralNut, null, 2));

