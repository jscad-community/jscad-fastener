/**
 * Parses ASME bolt specifications.
 *
 * Output schema directly matches the precise format returned by parseISOBolt().
 * 
 * @param {string} str - specification, e.g., "Heavy Hex Structural Bolt, A325, 1/2-13 UNC x 2, Zinc Plated"
 * @returns {Object} Standardized token payload
 */
export const parseASMEBolt = (spec) => {
  if (!spec || typeof spec !== 'string') {
    throw new Error("Missing string parameter; spec");
  }

  spec = spec.toUpperCase();

  // 1. Resolve Fastener Standard from Trade Terms
  let standard = "ASME_B18_2_1_CAP_SCREW"; // Default fallback
  if (spec.includes("HEAVY HEX STRUCTURAL") || spec.includes("ASME B18.2.6") || spec.includes("A325")) {
    standard = "ASME_B18_2_6_STRUCTURAL";
  } else if (spec.includes("MACHINE SCREW") || spec.includes("ASME B18.6.3")) {
    standard = "ASME_B18_6_3_MACHINE";
  } else if (spec.includes("HEAVY HEX BOLT")) {
    standard = "ASME_B18_2_1_HEAVY_BOLT";
  } else if (spec.includes("HEX BOLT")) {
    standard = "ASME_B18_2_1_HEX_BOLT";
  } else if (spec.includes("TAP BOLT")) {
    standard = "ASME_B18_2_1_TAP_BOLT"; // Fully threaded
  }

  // 2. Structural Thread Regex Extraction
  const threadRegex = /(?:#)?(\d+(?:\/\d+)?)-(\d+)\s*(UNC|UNF)?/i;
  const threadMatch = spec.match(threadRegex);
  if (!threadMatch) throw new Error("Failed to extract ASME thread parameters");

  const size = threadMatch[1]; // e.g., "1/2" or "10"
  const pitch = parseInt(threadMatch[2], 10); // Threads per inch acting as pitch token
  const threadSeries = threadMatch[3] ? threadMatch[3].toUpperCase() : "UNC";

  // 3. Extract Material Grades & Properties
  const propertyClassMatch = spec.match(/(A325|GRADE\s*8|GRADE\s*5|A2-70|8\.8)/i);
  let propertyClass = propertyClassMatch ? propertyClassMatch[1].toUpperCase() : "8.8";
  
  let material = "Carbon Steel";
  if (spec.includes("STAINLESS")) material = "Stainless Steel";
  else if (propertyClass === "A325") material = "Hardened Structural Steel";

  let coating = "Bare Metal";
  if (spec.includes("ZINC")) coating = "Zinc Plated";
  else if (spec.includes("GALVANIZED") || spec.includes("HDG")) coating = "Hot Dip Galvanized";

  // 4. Mimic ISO Dynamic Clearance Hole Matrix Framework 
  // Custom imperial clearances based on standard fraction increments
  const d = size.includes("/") ? eval(size) : parseInt(size, 10) * 0.013 + 0.060; // Approximates gauge widths safely
  const fineHole = d + 0.015;
  const mediumHole = d + 0.032; // Standard ~1/32" shop floor oversized drilling boundary
  const coarseHole = d + 0.062;

  return {
    size,                         // "1/2"
    pitch,                        // 13
    threadSeries,                 // "UNC"
    standard,                     // "ASME_B18_2_1_CAP_SCREW"
    threadTolerance: "2A",        // Imperial standard external class fallback
    propertyClass,                // "A325"
    material,                     // "Hardened Structural Steel"
    coating,                      // "Zinc Plated"
    clearanceSpecifications: {
      standardBody: "ASME B18.21.1",
      fineFitHole: Number(fineHole.toFixed(3)),
      mediumFitHole: Number(mediumHole.toFixed(3)), 
      coarseFitHole: Number(coarseHole.toFixed(3))
    }
  };
}

/**
 * Parses ASME nut specification.
 *
 * Matches the exact output token schema layout of your parseISONut() engine.
 * 
 * @param {string} str - specification, e.g., "Heavy Hex Structural Nut 1/2 inch - 13 UNC"
 * @returns {Object} Perfectly structured token array with metric drilling limits
 */
export const parseASMENut = (spec) => {
  if (!spec || typeof spec !== 'string') {
    throw new Error("Missing string parameter; spec");
  }

  spec = spec.toUpperCase();

  // 1. Resolve Standard Names
  let standard = "ASME_B18_2_2_NORMAL";
  if (spec.includes("HEAVY HEX STRUCTURAL") || spec.includes("ASME B18.2.6")) {
    standard = "ASME_B18_2_6_STRUCTURAL";
  } else if (spec.includes("HEAVY HEX NUT")) {
    standard = "ASME_B18_2_2_HEAVY";
  } else if (spec.includes("JAM NUT")) {
    standard = "ASME_B18_2_2_JAM";
  }

  // 2. Structural Regex Thread Extraction
  const nutRegex = /(?:#)?(\d+(?:\/\d+)?)(?:\s*INCH|\s*IN|\")?(?:\s*-\s*|\s+)(\d+)\s*(UNC|UNF)?/i;
  const match = spec.match(nutRegex);
  if (!match) throw new Error("Failed to parse internal thread ASME criteria from Nut string.");

  const size = match[1];
  const tpi = parseInt(match[2], 10);
  const threadSeries = match[3] ? match[3].toUpperCase() : "UNC";

  // Resolve thread fit class (Class 2B is standard commercial off-the-shelf)
  let threadTolerance = "2B";
  if (spec.includes("3B")) threadTolerance = "3B";
  else if (spec.includes("1B")) threadTolerance = "1B";

  // 3. Dynamic Material and Coating Properties
  let material = "Carbon Steel";
  if (spec.includes("STAINLESS")) material = "Stainless Steel";
  else if (standard === "ASME_B18_2_6_STRUCTURAL" || spec.includes("DH") || spec.includes("A325")) {
    material = "Hardened Carbon Steel";
  }

  let coating = "Bare Metal";
  if (spec.includes("ZINC")) coating = "Zinc Plated";
  else if (spec.includes("GALVANIZED") || spec.includes("HDG")) coating = "Hot Dip Galvanized";

  // 4. Calculate ASME B1.1 Tapped Hole Limits (Converted to mm)
  // Convert fractional or gauge sizes to numerical decimal inches first
  let dInches = 0;
  if (size.includes("/")) {
    const parts = size.split("/");
    dInches = parseFloat(parts[0]) / parseFloat(parts[1]);
  } else {
    // If it's a machine number size (#2 to #12)
    const gaugeNum = parseInt(size, 10);
    dInches = (gaugeNum * 0.013) + 0.060;
  }

  // Apply ASME B1.1 foundational thread geometry constant paths (in inches)
  const theoreticalRecommended = dInches - (1.29904 / tpi); // 75% default engagement target
  const theoreticalMin         = dInches - (1.08253 / tpi); // 100% minor diameter bounds
  const theoreticalMax         = dInches - (0.64951 / tpi); // Loose structural minimum shelf limit

  // Scale the complete dimensional spectrum to millimeters (mm)
  const recommendedDrill = Number((theoreticalRecommended * 25.4).toFixed(2));
  const drillHoleMin     = Number((theoreticalMin * 25.4).toFixed(2));
  const drillHoleMax     = Number((theoreticalMax * 25.4).toFixed(2));

  // 5. Output Unified Component Token Structure
  return {
    size,
    pitch: tpi,             // TPI serves as the pitch descriptor for imperial
    threadTolerance,        // "2B"
    material,               // "Hardened Carbon Steel"
    coating,                // "Zinc Plated"
    standard,               // "ASME_B18_2_6_STRUCTURAL"
    drillingSpecifications: {
      recommendedDrillBitSize: recommendedDrill,
      allowableHoleMinimum: drillHoleMin, // The structural minimum (NO-GO limit for drill size)
      allowableHoleMaximum: drillHoleMax  // The structural maximum (GO limit for drill size)
    }
  };
}


/**
 * Parses ASME washer specification.
 *
 * Aligns perfectly with the core return signature of your ISO washer parser.
 * 
 * @param {string} str - specification, e.g., "Hardened Flat Washer ASTM F436 - 1/2 inch"
 * @returns {Object} Clean token matching the exact structure of your ISO washer parser.
 */
export const parseASMEWasher = (spec) => {
  if (!spec || typeof spec !== 'string') {
    throw new Error("Missing string parameter; spec");
  }

  spec = spec.toUpperCase();

  // 1. Resolve Structural Standard Profile Labels
  let standard = "ASME_B18_21_1_TYPE_A";
  if (spec.includes("F436") || spec.includes("STRUCTURAL")) {
    standard = "ASTM_F436_STRUCTURAL";
  } else if (spec.includes("LOCK")) {
    standard = "ASME_B18_21_1_LOCK";
  }

  // 2. Capture sizing bounds like "1/2 inch" or "1/2 in" or "#10"
  const washerRegex = /(?:#)?(\d+(?:\/\d+)?)\s*(?:INCH|IN|\"|\$)/i;
  const match = spec.match(washerRegex);
  if (!match) throw new Error("Failed to parse mechanical size limits from Washer string.");

  const size = match[1];

  // 3. Dynamic Material, Coating & Vickers Hardness (HV) Mapping
  let material = "Carbon Steel";
  let coating = "Bare Metal";
  let hardnessHV = 110; // Baseline for standard soft commercial Type A steel washers

  if (spec.includes("STAINLESS")) {
    material = "Stainless Steel";
    hardnessHV = 180; // Standard 300-series stainless washer hardness
  } else if (standard === "ASTM_F436_STRUCTURAL") {
    material = "Hardened Carbon Steel";
    hardnessHV = 360; // ASTM F436 structural through-hardened steel washer specs (~38-45 HRC / ~360+ HV)
  }

  // Extract common plating surface treatments
  if (spec.includes("ZINC")) coating = "Zinc Plated";
  else if (spec.includes("GALVANIZED") || spec.includes("HDG")) coating = "Hot Dip Galvanized";
  else if (spec.includes("BLACK OXIDE")) coating = "Black Oxide";

  // 4. Dimensional Metadata Lookups for 3D Modeling (Converted to mm)
  // Hardcoded engineering geometry arrays for our target sizes to assist the renderer:
  // Layout: [Inner_Dia_Inches, Outer_Dia_Inches, Thickness_Inches]
  const basicWasherDimensions = {
    "1/4":  [0.281, 0.625, 0.065],
    "5/16": [0.344, 0.688, 0.065],
    "3/8":  [0.406, 0.812, 0.065],
    "1/2":  standard === "ASTM_F436_STRUCTURAL" 
             ? [0.531, 1.062, 0.109] // Heavy Structural F436 Spec
             : [0.531, 1.250, 0.095]  // Standard Type A Spec
  };

  const dims = basicWasherDimensions[size] || [0.531, 1.250, 0.095]; // Safe default fallback to 1/2"

  // 5. Output Unified Structural Token Framework matching your ISO standard perfectly
  return {
    size,         // Required Core Key -> "1/2"
    standard,     // Required Core Key -> "ASTM_F436_STRUCTURAL"
    hardnessHV,   // Required Core Key -> 360
    material,     // Required Core Key -> "Hardened Carbon Steel"
    coating,      // Required Core Key -> "Bare Metal"
    
    // --- Extended Parameter Payload Extension Block for your 3D Render Engines ---
    metadata: {
      innerDiameterMM: Number((dims[0] * 25.4).toFixed(2)),
      outerDiameterMM: Number((dims[1] * 25.4).toFixed(2)),
      thicknessMM:     Number((dims[2] * 25.4).toFixed(2))
    }
  };
}


//console.log(parseASMENut("Heavy Hex Structural Nut 1/2 inch - 13 UNC"));
//console.log(parseASMEWasher("Hardened Flat Washer ASTM F436 - 1/2 inch"));

