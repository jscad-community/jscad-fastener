/**
 * ============================================================================
 * METRIC FASTENER HARDWARE REGISTRY (ISO Standards)
 * All dimensional values are in millimeters (mm).
 * ============================================================================
 */

// ISO Metric Thread Pitch Mapping: Nominal Size -> { Coarse: Pitch(mm), Fine: Pitch(mm) }
// Derived from ISO 261 and ISO 262 standard series
const ISO_PITCH_REGISTRY = {
  "M1":   { Coarse: 0.25, Fine: null },
  "M2":   { Coarse: 0.4,  Fine: null },
  "M3":   { Coarse: 0.5,  Fine: null },
  "M4":   { Coarse: 0.7,  Fine: null },
  "M5":   { Coarse: 0.8,  Fine: null },
  "M6":   { Coarse: 1.0,  Fine: null },
  "M8":   { Coarse: 1.25, Fine: 1.0  },
  "M10":  { Coarse: 1.5,  Fine: 1.25 },
  "M12":  { Coarse: 1.75, Fine: 1.25 },
  "M14":  { Coarse: 2.0,  Fine: 1.5  },
  "M16":  { Coarse: 2.0,  Fine: 1.5  },
  "M20":  { Coarse: 2.5,  Fine: 1.5  },
  "M24":  { Coarse: 3.0,  Fine: 2.0  },
  "M30":  { Coarse: 3.5,  Fine: 2.0  },
  "M36":  { Coarse: 4.0,  Fine: 3.0  },
  "M42":  { Coarse: 4.5,  Fine: 3.0  },
  "M48":  { Coarse: 5.0,  Fine: 3.0  },
  "M56":  { Coarse: 5.5,  Fine: 4.0  },
  "M64":  { Coarse: 6.0,  Fine: 4.0  },
  "M100": { Coarse: 6.0,  Fine: 4.0  } // Industrial extension baseline
};

// Metric Nut Dimensional Tables per ISO 4032 / 4033
// Format: [Size, Width Across Flats (Wrench Size), Nut Height]
const ISO_NUT_REGISTRY = {
  "ISO_4032_NORMAL": [
    ["M1.6", 3.2, 1.3], ["M2", 4.0, 1.6], ["M3", 5.5, 2.4], ["M4", 7.0, 3.2],
    ["M5", 8.0, 4.7],   ["M6", 10.0, 5.2], ["M8", 13.0, 6.8], ["M10", 16.0, 8.4],
    ["M12", 18.0, 10.8], ["M14", 21.0, 12.8], ["M16", 24.0, 14.8], ["M20", 30.0, 18.0],
    ["M24", 36.0, 21.5], ["M30", 46.0, 25.6], ["M36", 55.0, 31.0], ["M42", 65.0, 34.0],
    ["M48", 75.0, 38.0], ["M56", 85.0, 45.0], ["M64", 95.0, 51.0]
  ],
  "ISO_4033_HIGH": [
    ["M5", 8.0, 5.1],   ["M6", 10.0, 5.7], ["M8", 13.0, 7.5], ["M10", 16.0, 9.3],
    ["M12", 18.0, 12.0], ["M14", 21.0, 14.1], ["M16", 24.0, 16.4], ["M20", 30.0, 20.3],
    ["M24", 36.0, 23.9], ["M30", 46.0, 28.6], ["M36", 55.0, 34.7], ["M42", 65.0, 38.3],
    ["M48", 75.0, 42.9], ["M56", 85.0, 50.5], ["M64", 95.0, 57.3]
  ]
};

/**
 * ============================================================================
 * ISO SPECIFIC VALIDATION ENGINE
 * ============================================================================
 */
function validateISOMetricAssembly(assembly) {
  const { bolt, washer, nut } = assembly;
  const errors = [];
  const warnings = [];

  const bSize = String(bolt.size).toUpperCase().trim();         // e.g., "M12"
  const bSeries = String(bolt.threadSeries).trim(); // "Coarse" or "Fine"

  console.log(`\n⚙️ Validating ISO Profile: [Bolt: ${bSize} ${bSeries}] + [Washer: ${washer.standard} ${washer.size}] + [Nut: ${nut.standard} ${nut.size}]`);

  // 1. Thread Pitch Check: Bolt Series Validation via ISO Registry
  const sizeMap = ISO_PITCH_REGISTRY[bSize];
  if (!sizeMap) {
    // If it's a valid fractional step not inside the minimal tester map, provide an extension fallback notice
    warnings.push(`Sizing metadata for "${bSize}" is unlisted in the strict validation array subset.`);
  } else {
    const expectedPitch = sizeMap[bSeries];
    if (expectedPitch === null) {
      errors.push(`CRITICAL: ISO standard series violation. Size ${bSize} does not support a standard "${bSeries}" pitch.`);
    } else if (bolt.pitch !== expectedPitch) {
      errors.push(`CRITICAL: Thread Pitch mismatch on Bolt Callout! ${bSize} ${bSeries} expects a ${expectedPitch}mm pitch, but configuration declared ${bolt.pitch}mm.`);
    }
  }

  // 2. Thread Mating Evaluation: Bolt vs Nut
  if (bolt.pitch !== nut.pitch) {
    errors.push(`CRITICAL: Assembly Failure. Bolt Thread Pitch (${bolt.pitch}mm) cannot mesh with Nut Thread Pitch (${nut.pitch}mm).`);
  }
  if (bSize !== nut.size.toUpperCase().trim()) {
    errors.push(`CRITICAL: Nominal Size Mismatch. Cannot thread a ${nut.size} nut over an ${bSize} bolt diameter shank.`);
  }

  // 3. Dimensional Verification of Nut Registry Spec
  const targetNutTable = ISO_NUT_REGISTRY[nut.standard.toUpperCase().replace(/\s+/g, '_')];
  if (!targetNutTable) {
    errors.push(`CRITICAL: Unregistered ISO Nut geometric specification standard: "${nut.standard}".`);
  } else {
    const registryEntry = targetNutTable.find(row => row === bSize);
    if (!registryEntry && sizeMap) { // Flag only if size is within our documented framework limits
      errors.push(`CRITICAL: Sizing Exception. Standard ${nut.standard} does not provide data mapping for ${bSize}.`);
    }
  }

  // 4. Physical Clearance Check: Bolt vs Washer Size
  if (bSize !== washer.size.toUpperCase().trim()) {
    errors.push(`CRITICAL: Interference Fail. Geometric boundaries prevent passing an ${bSize} bolt through a ${washer.size} washer.`);
  }

  // 5. Hardness Compatibility Evaluation (ISO Property Class vs Hardness Class)
  const boltClass = parseFloat(bolt.propertyClass); // e.g., 8.8, 10.9, 12.9
  const washerHV = parseInt(washer.hardnessHV, 10);  // e.g., 100, 200, 300

  if (!isNaN(boltClass) && !isNaN(washerHV)) {
    if (boltClass >= 8.8 && washerHV < 200) {
      errors.push(`CRITICAL: Safety Violation! High-strength Property Class ${boltClass} bolt paired with a soft ${washerHV} HV washer. The washer will yield or squeeze out under high tightening torques.`);
    }
    if (boltClass >= 10.9 && washerHV < 300) {
      errors.push(`CRITICAL: Safety Violation! Ultra high-tensile Class ${boltClass} bolt requires a minimum 300 HV hardened washer. Current washer specification (${washerHV} HV) is insufficient.`);
    }
  }

  // Output Processing
  if (errors.length === 0) {
    console.log("✅ Validation successfully PASSED. Metric ISO stack configuration is valid and compliant.");
    warnings.forEach(w => console.warn(`⚠️ ${w}`));
    return { valid: true, errors, warnings };
  } else {
    console.error("❌ Validation FAILED. ISO configuration discrepancies found.");
    errors.forEach(e => console.error(`🛑 ${e}`));
    return { valid: false, errors, warnings };
  }
}

// ============================================================================
// ISO VALIDATION SCENARIOS
// ============================================================================

// TEST 1: Valid High-Tensile M12 Structural Connection (Passes)
const validMetricSet = {
  bolt:   { size: "M12", pitch: 1.75, threadSeries: "Coarse", propertyClass: "8.8" },
  washer: { size: "M12", standard: "ISO 7090", hardnessHV: "200" }, // 200 HV matches 8.8 bolt safely
  nut:    { size: "M12", pitch: 1.75, standard: "ISO_4032_NORMAL" }
};
validateISOMetricAssembly(validMetricSet);

// TEST 2: Fails — Hardness Safety Violation (Class 10.9 Bolt with Soft 100HV Washer)
const defectiveMetricSet = {
  bolt:   { size: "M16", pitch: 2.0, threadSeries: "Coarse", propertyClass: "10.9" },
  washer: { size: "M16", standard: "ISO 7091", hardnessHV: "100" }, // <-- CRITICAL ERR: 100 HV is too soft for 10.9 structural torque
  nut:    { size: "M16", pitch: 2.0, standard: "ISO_4033_HIGH" }
};
validateISOMetricAssembly(defectiveMetricSet);

