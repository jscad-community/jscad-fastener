/**
 * Simplified Registry of Bolt and Nut Thread Matches (ASME B18/UTS Coarse)
 * Maps Nominal Size -> Threads Per Inch (TPI)
 */
const UTS_COARSE_REGISTRY = {
  "#0": 80, "#2": 56, "#4": 40, "#6": 32, "#8": 32, "#10": 24, "#12": 24,
  "1/4": 20, "5/16": 18, "3/8": 16, "7/16": 14, "1/2": 13, "9/16": 12, "5/8": 11,
  "3/4": 10, "7/8": 9, "1": 8, "1 1/8": 7, "1 1/4": 7, "1 3/8": 6, "1 1/2": 6,
  "1 3/4": 5, "2": 4.5, "2 1/4": 4.5, "2 1/2": 4, "2 3/4": 4, "3": 4, "4": 4
};

/**
 * Validates a standard imperial connection stack profile.
 * Expects objects structured based on compliant engineer specification callouts.
 */
function validateFastenerAssembly(assembly) {
  const { bolt, washer, nut } = assembly;
  const errors = [];
  const warnings = [];

  console.log(`\n⚙️ Analyzing Assembly Stack: [Bolt: ${bolt.size}] + [Washer: ${washer.size}] + [Nut: ${nut.size}]`);

  // 1. Thread Pitch Check: Bolt vs Nut
  if (bolt.tpi !== nut.tpi) {
    errors.push(`CRITICAL: Thread pitch mismatch! Bolt is ${bolt.tpi} TPI, but Nut is ${nut.tpi} TPI. They will seize or strip.`);
  }

  // 2. Thread Series Check against UTS Standard
  const expectedTpi = UTS_COARSE_REGISTRY[bolt.size];
  if (expectedTpi && bolt.threadSeries === "UNC" && bolt.tpi !== expectedTpi) {
    errors.push(`CRITICAL: Bolt is labeled UNC but has ${bolt.tpi} TPI. Standard ${bolt.size} UNC requires ${expectedTpi} TPI.`);
  }

  // 3. Diameter / Sizing Check: Bolt vs Washer Clearance
  if (bolt.size !== washer.size) {
    errors.push(`CRITICAL: Nominal size mismatch! Cannot slide a ${washer.size} nominal washer onto a ${bolt.size} bolt.`);
  }

  // 4. Structural Grade Compatibility Check (ASME/ASTM Cross-Reference)
  const isHighStrengthBolt = ["A325", "A490", "F3125", "GRADE 8"].some(grade => 
    bolt.materialGrade.toUpperCase().includes(grade)
  );
  const isHardenedWasher = washer.standard.toUpperCase().includes("F436");

  if (isHighStrengthBolt && !isHardenedWasher) {
    errors.push(`CRITICAL: Safety Violation! High-strength structural bolt (${bolt.materialGrade}) paired with unhardened washer (${washer.standard}). Washer will crush or warp under heavy torque.`);
  } else if (!isHighStrengthBolt && isHardenedWasher) {
    warnings.push(`WARNING: Over-engineering detected. Soft/low-carbon bolt paired with a premium ASTM F436 hardened structural washer.`);
  }

  // Output Evaluation
  if (errors.length === 0) {
    console.log("✅ Assembly validation PASSED. Hardware configuration is compliant.");
    if (warnings.length > 0) {
      warnings.forEach(w => console.warn(`⚠️ ${w}`));
    }
    return { valid: true, errors, warnings };
  } else {
    console.error("❌ Assembly validation FAILED. Incompatible components found.");
    errors.forEach(e => console.error(`🛑 ${e}`));
    return { valid: false, errors, warnings };
  }
}

// ==========================================
// TEST CASE 1: Valid Structural Assembly (Passes)
// ==========================================
const validStructuralSet = {
  bolt: { size: "1/2", tpi: 13, threadSeries: "UNC", materialGrade: "ASTM F3125 Grade A325" },
  washer: { size: "1/2", standard: "ASTM F436 Type 1" },
  nut: { size: "1/2", tpi: 13, materialGrade: "ASTM A563 Grade DH" }
};
validateFastenerAssembly(validStructuralSet);

// ==========================================
// TEST CASE 2: Invalid Pitch and Safety Danger (Fails)
// ==========================================
const dangerousSet = {
  bolt: { size: "1/2", tpi: 13, threadSeries: "UNC", materialGrade: "ASTM F3125 Grade A325" },
  washer: { size: "1/2", standard: "ASME B18.21.1 Type A (Soft Steel)" }, // <-- CRITICAL ERR: Will crush under high torque
  nut: { size: "1/2", tpi: 20, materialGrade: "Standard Commercial" }     // <-- CRITICAL ERR: 20 TPI Fine Nut won't fit 13 TPI Coarse Bolt
};
validateFastenerAssembly(dangerousSet);

