/**
 * ============================================================================
 * FASTENER HARDWARE REGISTRY (ASME B18 / UTS / ASTM)
 * All dimensions are in inches.
 * ============================================================================
 */

// Comprehensive Pitch Mapping: Nominal Size -> { UNC: TPI, UNF: TPI }
const UTS_PITCH_REGISTRY = {
  "#0":    { UNC: null, UNF: 80   },
  "#1":    { UNC: 64,   UNF: 72   },
  "#2":    { UNC: 56,   UNF: 64   },
  "#3":    { UNC: 48,   UNF: 56   },
  "#4":    { UNC: 40,   UNF: 48   },
  "#5":    { UNC: 40,   UNF: 44   },
  "#6":    { UNC: 32,   UNF: 40   },
  "#8":    { UNC: 32,   UNF: 36   },
  "#10":   { UNC: 24,   UNF: 32   },
  "#12":   { UNC: 24,   UNF: 28   },
  "1/4":   { UNC: 20,   UNF: 28   },
  "5/16":  { UNC: 18,   UNF: 24   },
  "3/8":   { UNC: 16,   UNF: 24   },
  "7/16":  { UNC: 14,   UNF: 20   },
  "1/2":   { UNC: 13,   UNF: 20   },
  "9/16":  { UNC: 12,   UNF: 18   },
  "5/8":   { UNC: 11,   UNF: 18   },
  "3/4":   { UNC: 10,   UNF: 16   },
  "7/8":   { UNC: 9,    UNF: 14   },
  "1":     { UNC: 8,    UNF: 12   },
  "1 1/8": { UNC: 7,    UNF: 12   },
  "1 1/4": { UNC: 7,    UNF: 12   },
  "1 3/8": { UNC: 6,    UNF: 12   },
  "1 1/2": { UNC: 6,    UNF: 12   },
  "1 3/4": { UNC: 5,    UNF: null },
  "2":     { UNC: 4.5,  UNF: null },
  "2 1/4": { UNC: 4.5,  UNF: null },
  "2 1/2": { UNC: 4,    UNF: null },
  "2 3/4": { UNC: 4,    UNF: null },
  "3":     { UNC: 4,    UNF: null },
  "3 1/4": { UNC: 4,    UNF: null },
  "3 1/2": { UNC: 4,    UNF: null },
  "3 3/4": { UNC: 4,    UNF: null },
  "4":     { UNC: 4,    UNF: null }
};

// ASME B18.2.2 Nut Dimensional Tables
// Format: [Size, Width Across Flats (Wrench Size), Nut Thickness]
const ASME_B18_2_2_NUTS = {
  "HEX_STANDARD": [
    ["1/4",   0.438, 0.219], ["5/16",  0.500, 0.266], ["3/8",   0.562, 0.328],
    ["7/16",  0.688, 0.375], ["1/2",   0.750, 0.438], ["9/16",  0.875, 0.484],
    ["5/8",   0.938, 0.547], ["3/4",   1.125, 0.641], ["7/8",   1.312, 0.750],
    ["1",     1.500, 0.859], ["1 1/8", 1.688, 0.969], ["1 1/4", 1.875, 1.078],
    ["1 3/8", 2.062, 1.188], ["1 1/2", 2.250, 1.312]
  ],
  "HEAVY_HEX": [
    ["1/4",   0.500, 0.250], ["5/16",  0.562, 0.313], ["3/8",   0.688, 0.375],
    ["7/16",  0.750, 0.438], ["1/2",   0.875, 0.500], ["9/16",  0.938, 0.563],
    ["5/8",   1.062, 0.625], ["3/4",   1.250, 0.750], ["7/8",   1.438, 0.875],
    ["1",     1.625, 1.000], ["1 1/8", 1.813, 1.125], ["1 1/4", 2.000, 1.250],
    ["1 3/8", 2.188, 1.375], ["1 1/2", 2.375, 1.500], ["1 3/4", 2.750, 1.750],
    ["2",     3.125, 2.000], ["2 1/4", 3.500, 2.250], ["2 1/2", 3.875, 2.500],
    ["2 3/4", 4.250, 2.750], ["3",     4.625, 3.000], ["3 1/4", 5.000, 3.250],
    ["3 1/2", 5.375, 3.500], ["3 3/4", 5.750, 3.750], ["4",     6.125, 4.000]
  ]
};

/**
 * ============================================================================
 * EXPANDED ENGINE VALIDATION SYSTEM
 * ============================================================================
 */
function validateUnifiedAssembly(assembly) {
  const { bolt, washer, nut } = assembly;
  const errors = [];
  const warnings = [];

  const bSize = String(bolt.size).trim();
  const bSeries = String(bolt.threadSeries).toUpperCase().trim(); // "UNC" or "UNF"

  console.log(`\n⚙️ Validating Assembly Profile: [Bolt: ${bSize} ${bSeries}] + [Washer: ${washer.standard} ${washer.size}] + [Nut: ${nut.style} ${nut.size}]`);

  // 1. Validate Bolt Series Requirements via UTS Master Mapping
  const sizeMap = UTS_PITCH_REGISTRY[bSize];
  if (!sizeMap) {
    errors.push(`CRITICAL: Nominal bolt size "${bSize}" is unknown to the UTS infrastructure.`);
    return { valid: false, errors, warnings };
  }

  const expectedTpi = sizeMap[bSeries];
  if (expectedTpi === null) {
    errors.push(`CRITICAL: UTS limits violated. The size ${bSize} does not support a standard "${bSeries}" pitch.`);
  } else if (bolt.tpi !== expectedTpi) {
    errors.push(`CRITICAL: Pitch conflict! Mismatch found on Bolt Callout. ${bSize} ${bSeries} expects ${expectedTpi} TPI, but configuration requested ${bolt.tpi} TPI.`);
  }

  // 2. Thread Matching Check: Bolt vs Nut
  if (bolt.tpi !== nut.tpi) {
    errors.push(`CRITICAL: Assembly Failure. Bolt Pitch (${bolt.tpi} TPI) cannot mesh with Nut Pitch (${nut.tpi} TPI).`);
  }
  if (bSize !== nut.size) {
    errors.push(`CRITICAL: Diameter Conflict. Cannot spin a ${nut.size} nut over a ${bSize} bolt diameter.`);
  }

  // 3. Dimensional Verification of the Nut style
  const targetNutTable = ASME_B18_2_2_NUTS[nut.style.toUpperCase()];
  if (!targetNutTable) {
    errors.push(`CRITICAL: Unregistered Nut standard profile geometry style: "${nut.style}".`);
  } else {
    const registryEntry = targetNutTable.find(row => row[0] === nut.size);
    if (!registryEntry) {
      errors.push(`CRITICAL: Sizing Failure. ASME B18.2.2 ${nut.style} doesn't support a ${nut.size} production mapping.`);
    }
  }

  // 4. Structural Safety & Clearance Verification: Washer Profile
  if (bSize !== washer.size) {
    errors.push(`CRITICAL: Physical assembly clearance fail. Nominal sizing prevents running a ${washer.size} washer along a ${bSize} shank.`);
  }

  const isStructuralBolt = ["A325", "A490", "F3125", "GRADE 8"].some(g => bolt.materialGrade.toUpperCase().includes(g));
  const isHardenedWasher = washer.standard.toUpperCase().includes("F436");
  const isHeavyNut = nut.style.toUpperCase() === "HEAVY_HEX";

  if (isStructuralBolt) {
    if (!isHardenedWasher) {
      errors.push(`CRITICAL: Safety Infraction. High-load structural fastener (${bolt.materialGrade}) matched to an unhardened low-carbon washer. Washer will deform under torque.`);
    }
    if (!isHeavyNut) {
      warnings.push(`WARNING: Structural engineering practice recommends pairing heavy hex bolts with HEAVY_HEX profile nuts rather than standard hex.`);
    }
  }

  // Output Evaluation Report
  if (errors.length === 0) {
    console.log("✅ Validation successfully PASSED. Structural connection is safe and fully compliant.");
    warnings.forEach(w => console.warn(`⚠️ ${w}`));
    return { valid: true, errors, warnings };
  } else {
    console.error("❌ Validation FAILED. Component profile parameters conflict.");
    errors.forEach(e => console.error(`🛑 ${e}`));
    return { valid: false, errors, warnings };
  }
}

// ============================================================================
// TEST SCENARIOS
// ============================================================================

// TEST 1: Valid UNF (Fine Thread) Precision Mechanical Assembly
const fineThreadAssembly = {
  bolt:   { size: "1/2", tpi: 20, threadSeries: "UNF", materialGrade: "SAE Grade 5" },
  washer: { size: "1/2", standard: "ASME B18.21.1 Type A" },
  nut:    { size: "1/2", tpi: 20, style: "HEX_STANDARD" }
};
validateUnifiedAssembly(fineThreadAssembly);

// TEST 2: Fails — Invalid TPI Combination for Fine Thread Size
const invalidFinePitchAssembly = {
  bolt:   { size: "5/16", tpi: 32, threadSeries: "UNF", materialGrade: "SAE Grade 5" }, // Err: 5/16 UNF should be 24 TPI
  washer: { size: "5/16", standard: "ASME B18.21.1 Type A" },
  nut:    { size: "5/16", tpi: 32, style: "HEX_STANDARD" }
};
validateUnifiedAssembly(invalidFinePitchAssembly);

