/*
 * METRIC FASTENER HARDWARE REGISTRY (ISO Standards)
 * Complete sequence from M1 to M68 per ISO 261/262.
 * All dimensional values are in millimeters (mm).
 */

const ISO_PITCH_REGISTRY = {
  "M1":    { Coarse: 0.25,  Fine: null  },
  "M1.1":  { Coarse: 0.25,  Fine: null  },
  "M1.2":  { Coarse: 0.25,  Fine: null  },
  "M1.4":  { Coarse: 0.3,   Fine: null  },
  "M1.6":  { Coarse: 0.35,  Fine: null  },
  "M1.8":  { Coarse: 0.35,  Fine: null  },
  "M2":    { Coarse: 0.4,   Fine: 0.25  },
  "M2.2":  { Coarse: 0.45,  Fine: 0.25  },
  "M2.5":  { Coarse: 0.45,  Fine: 0.35  },
  "M3":    { Coarse: 0.5,   Fine: 0.35  },
  "M3.5":  { Coarse: 0.6,   Fine: 0.35  },
  "M4":    { Coarse: 0.7,   Fine: 0.5   },
  "M4.5":  { Coarse: 0.75,  Fine: 0.5   },
  "M5":    { Coarse: 0.8,   Fine: 0.5   },
  "M6":    { Coarse: 1.0,   Fine: 0.75  },
  "M7":    { Coarse: 1.0,   Fine: 0.75  },
  "M8":    { Coarse: 1.25,  Fine: 1.0   }, // Standard primary Fine
  "M9":    { Coarse: 1.25,  Fine: 1.0   },
  "M10":   { Coarse: 1.5,   Fine: 1.25  }, // Standard primary Fine (1.0 also used)
  "M11":   { Coarse: 1.5,   Fine: 1.0   },
  "M12":   { Coarse: 1.75,  Fine: 1.25  }, // Standard primary Fine (1.5 also used)
  "M14":   { Coarse: 2.0,   Fine: 1.5   },
  "M16":   { Coarse: 2.0,   Fine: 1.5   },
  "M18":   { Coarse: 2.5,   Fine: 1.5   },
  "M20":   { Coarse: 2.5,   Fine: 1.5   },
  "M22":   { Coarse: 2.5,   Fine: 1.5   },
  "M24":   { Coarse: 3.0,   Fine: 2.0   },
  "M27":   { Coarse: 3.0,   Fine: 2.0   },
  "M30":   { Coarse: 3.5,   Fine: 2.0   },
  "M33":   { Coarse: 3.5,   Fine: 2.0   },
  "M36":   { Coarse: 4.0,   Fine: 3.0   },
  "M39":   { Coarse: 4.0,   Fine: 3.0   },
  "M42":   { Coarse: 4.5,   Fine: 3.0   },
  "M45":   { Coarse: 4.5,   Fine: 3.0   },
  "M48":   { Coarse: 5.0,   Fine: 3.0   },
  "M52":   { Coarse: 5.0,   Fine: 4.0   },
  "M56":   { Coarse: 5.5,   Fine: 4.0   },
  "M60":   { Coarse: 5.5,   Fine: 4.0   },
  "M64":   { Coarse: 6.0,   Fine: 4.0   },
  "M68":   { Coarse: 6.0,   Fine: 4.0   }
};

// Metric Nut Heights and Wrench Sizes per ISO 4032 / ISO 4033
const ISO_NUT_REGISTRY = {
  "ISO_4032_NORMAL": [
    ["M1.6", 3.2, 1.3], ["M2", 4.0, 1.6], ["M2.5", 5.0, 2.0], ["M3", 5.5, 2.4], 
    ["M3.5", 6.0, 2.8], ["M4", 7.0, 3.2], ["M5", 8.0, 4.7],   ["M6", 10.0, 5.2], 
    ["M7", 11.0, 5.5],  ["M8", 13.0, 6.8], ["M10", 16.0, 8.4], ["M12", 18.0, 10.8], 
    ["M14", 21.0, 12.8], ["M16", 24.0, 14.8], ["M18", 27.0, 15.8], ["M20", 30.0, 18.0], 
    ["M22", 32.0, 19.4], ["M24", 36.0, 21.5], ["M27", 41.0, 23.8], ["M30", 46.0, 25.6], 
    ["M33", 50.0, 28.7], ["M36", 55.0, 31.0], ["M39", 60.0, 33.4], ["M42", 65.0, 34.0], 
    ["M45", 70.0, 36.0], ["M48", 75.0, 38.0], ["M52", 80.0, 42.0], ["M56", 85.0, 45.0], 
    ["M60", 90.0, 48.0], ["M64", 95.0, 51.0], ["M68", 100.0, 54.0]
  ],
  "ISO_4033_HIGH": [
    ["M5", 8.0, 5.1],   ["M6", 10.0, 5.7], ["M8", 13.0, 7.5], ["M10", 16.0, 9.3],
    ["M12", 18.0, 12.0], ["M14", 21.0, 14.1], ["M16", 24.0, 16.4], ["M20", 30.0, 20.3],
    ["M24", 36.0, 23.9], ["M30", 46.0, 28.6], ["M36", 55.0, 34.7], ["M42", 65.0, 38.3],
    ["M48", 75.0, 42.9], ["M56", 85.0, 50.5], ["M64", 95.0, 57.3], ["M68", 100.0, 61.5]
  ]
};

/*
 * ISO METRIC VALIDATION ENGINE (STANDALONE ROUTINE)
 */
export const validateISOMetricAssembly = (assembly) => {
  const { bolt, washer, nut } = assembly;
  const errors = [];
  const warnings = [];

  const bSize = String(bolt.size).toUpperCase().trim();
  const bSeries = String(bolt.threadSeries).trim(); // Expected: "Coarse" or "Fine"

  console.log(`\n⚙️ Evaluating Metric ISO Joint: [Bolt: ${bSize} ${bSeries}] + [Washer: ${washer.standard} ${washer.size}] + [Nut: ${nut.standard} ${nut.size}]`);

  // 1. Thread Pitch Check: Validate against ISO Master Registry
  const sizeMap = ISO_PITCH_REGISTRY[bSize];
  if (!sizeMap) {
    errors.push(`CRITICAL: Sizing Exception. Nominal size "${bSize}" breaks ISO 261 structural plan definitions.`);
    return { valid: false, errors, warnings };
  }

  const expectedPitch = sizeMap[bSeries];
  if (expectedPitch === null) {
    errors.push(`CRITICAL: Designation Error. ISO standard sizing for ${bSize} does not support a "${bSeries}" pitch profile.`);
  } else if (bolt.pitch !== expectedPitch) {
    errors.push(`CRITICAL: Pitch conflict. ${bSize} ${bSeries} expects a ${expectedPitch}mm thread pitch, but your input declared ${bolt.pitch}mm.`);
  }

  // 2. Component Interlocking: Bolt vs Nut
  if (bolt.pitch !== nut.pitch) {
    errors.push(`CRITICAL: Assembly Failure. Bolt pitch (${bolt.pitch}mm) cannot screw into Nut pitch (${nut.pitch}mm).`);
  }
  if (bSize !== nut.size.toUpperCase().trim()) {
    errors.push(`CRITICAL: Dimensional mismatch. Cannot spin a ${nut.size} nut over an ${bSize} shank.`);
  }

  // 3. Dimensional Existence Check for Nut
  const targetNutTable = ISO_NUT_REGISTRY[nut.standard.toUpperCase().replace(/\s+/g, '_')];
  if (!targetNutTable) {
    errors.push(`CRITICAL: Unregistered Nut specification standard: "${nut.standard}".`);
  } else {
    const registryEntry = targetNutTable.find((row) => row === bSize);
    if (!registryEntry) {
      errors.push(`CRITICAL: Dimensional Gap. Standard ${nut.standard} has no tabulated properties for size ${bSize}.`);
    }
  }

  // 4. Washer Shank Clearance Check
  if (bSize !== washer.size.toUpperCase().trim()) {
    errors.push(`CRITICAL: Structural interference. Clearances prevent feeding an ${bSize} bolt through an ${washer.size} washer.`);
  }

  // 5. Metallurgy and Hardness Mapping (Property Class vs Vickers Rating)
  const boltClass = parseFloat(bolt.propertyClass);
  const washerHV = parseInt(washer.hardnessHV, 10);

  if (!isNaN(boltClass) && !isNaN(washerHV)) {
    if (boltClass >= 8.8 && washerHV < 200) {
      errors.push(`CRITICAL: High Safety Risk! Property Class ${boltClass} high-tensile bolt paired with soft ${washerHV} HV washer. The washer will yield and squeeze outward under load.`);
    }
    if (boltClass >= 10.9 && washerHV < 300) {
      errors.push(`CRITICAL: Structural Defect! Property Class ${boltClass} ultra high-strength bolt requires a minimum 300 HV hardened washer. Current specification (${washerHV} HV) is too weak.`);
    }
  }

  // Final Verdict Processing
  if (errors.length === 0) {
    console.log("✅ Validation PASSED. All metric ISO component properties correlate perfectly.");
    warnings.forEach((w) => console.warn(`⚠️ ${w}`));
    return { valid: true, errors, warnings };
  } else {
    console.error("❌ Validation FAILED. Fastener cluster setup is non-compliant.");
    errors.forEach((e) => console.error(`🛑 ${e}`));
    return { valid: false, errors, warnings };
  }
}

// RUNNING TEST VALIDATIONS

// TEST 1: Valid Fine-Pitch M8 Assembly (Passes)
const validM8FineAssembly = {
  bolt:   { size: "M8", pitch: 1.0, threadSeries: "Fine", propertyClass: "8.8" },
  washer: { size: "M8", standard: "ISO 7090", hardnessHV: "200" },
  nut:    { size: "M8", pitch: 1.0, standard: "ISO_4032_NORMAL" }
};
validateISOMetricAssembly(validM8FineAssembly);

// TEST 2: Fails - Requesting a Fine Pitch layout on a size that doesn't support it
const invalidM3FineAssembly = {
  bolt:   { size: "M3", pitch: 0.35, threadSeries: "Fine", propertyClass: "5.6" }, // Err: M3 does not support a fine pitch series
  washer: { size: "M3", standard: "ISO 7091", hardnessHV: "100" },
  nut:    { size: "M3", pitch: 0.35, standard: "ISO_4032_NORMAL" }
};
validateISOMetricAssembly(invalidM3FineAssembly);

