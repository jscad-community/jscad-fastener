/**
 * Full Assembly Parser for ISO / Metric Systems
 * Takes a compound engineering stack description and breaks it into parsed tokens.
 * Supported Formats:
 *  - "Hexagon head bolt ISO 4014 - M12 x 80 - 8.8, with Plain washer ISO 7090, Hex nut ISO 4032"
 *  - "M6 x 0.75 x 40 Bolt + ISO 7092 Washer + ISO 4032 Nut"
 *  - "ISO 4017 Bolt M16 x 60 - 10.9 HDG Finish; ISO 7090 Washer; ISO 4032 Nut"
 */
function parseISOAssembly(fullAssemblyString) {
  if (!fullAssemblyString || typeof fullAssemblyString !== 'string') {
    throw new Error("Invalid or empty assembly string provided.");
  }

  // Normalize string spacing and uniform delimiters (+ or ; mapped to standard commas)
  const normalized = fullAssemblyString.replace(/\s+/g, ' ').replace(/\s*\+\s*/g, ', ').replace(/\s*;\s*/g, ', ').trim();
  
  // Split the compound string by commas or explicit "with" / "w/" conjunction boundaries
  const subComponents = normalized.split(/(?:,|\bwith\b|\bw\/\s*)/i);
  
  let boltString = null;
  let washerString = null;
  let nutString = null;
  let sharedSizeContext = null;   // e.g., "12" from M12
  let sharedPitchContext = null;  // e.g., "1.25" for fine pitches

  // Step 1: Broad classification loop to sort text phrases into component buckets
  subComponents.forEach(component => {
    const cleanChunk = component.trim();
    const type = determineFastenerType(cleanChunk); // Reuses the procedural type checker from previous ISO setup

    if (type === 'BOLT') boltString = cleanChunk;
    else if (type === 'WASHER') washerString = cleanChunk;
    else if (type === 'NUT') nutString = cleanChunk;
  });

  // Step 2: Extract explicit sizing context to handle shared shorthand patterns
  // (e.g., if an engineer writes "M12 x 1.25 x 50 Bolt, Washer, Nut" instead of repeating M12 multiple times)
  const threadRegex = /M(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i;
  if (boltString) {
    const threadMatch = boltString.match(threadRegex);
    if (threadMatch) {
      sharedSizeContext = threadMatch[1]; // Captures the core diameter number
      if (threadMatch[2] && parseFloat(threadMatch[2]) < 6.0) { 
        // If a second number exists and is small, it's a pitch rather than a bolt length (e.g., x 1.25)
        sharedPitchContext = threadMatch[2];
      }
    }
  }

  // Step 3: Enforce strict structural checks and apply fallback sizing shortcuts
  if (!boltString) {
    throw new Error("Assembly parsing failed: No identifiable Metric Bolt segment located in the callout string.");
  }
  if (!washerString) {
    throw new Error("Assembly parsing failed: No identifiable Metric Washer segment located in the callout string.");
  }
  if (!nutString) {
    throw new Error("Assembly parsing failed: No identifiable Metric Nut segment located in the callout string.");
  }

  // Inject sizing context backward if components are missing explicit dimension text ("MXX")
  const checkMTextRegex = /M\d+/i;
  if (!washerString.match(checkMTextRegex) && sharedSizeContext) {
    washerString = `M${sharedSizeContext} ${washerString}`;
  }
  if (!nutString.match(checkMTextRegex) && sharedSizeContext) {
    const pitchSuffix = sharedPitchContext ? ` x ${sharedPitchContext}` : '';
    nutString = `M${sharedSizeContext}${pitchSuffix} ${nutString}`;
  }

  // Step 4: Route the normalized chunks into your standalone worker functions
  console.log(`\n🧩 Deconstructing full metric assembly string callout...`);
  return {
    bolt: parseISOBolt(boltString),
    washer: parseISOWasher(washerString),
    nut: parseISONut(nutString)
  };
}

import { booleans, transforms } from '@jscad/modeling';

// Assumes your individual 3D component generators are imported or loaded in the scope
// e.g., import { generateISOBolt } from './boltGenerator.js';
// e.g., import { generateISOWasher } from './washerGenerator.js';
// e.g., import { generateISONut } from './nutGenerator.js';

const { union } = booleans;
const { translate } = transforms;

/**
 * Procedural 3D Assembly Generator for ISO Fastener Stack in JSCAD V3
 * Compiles a distinct Bolt, Washer, and Nut into an aligned 3D cluster group.
 * 
 * @param {Object} assemblyConfig - Raw pre-parsed specifications for each component
 * @param {number} clampThickness - Total material thickness being joined together (mm)
 * @param {Object} modules - Object containing reference pointers to your 3D creation functions
 * @returns {Object} Unified 3D assembly mesh
 */
export function generateISOAssembly3D(assemblyConfig, clampThickness, modules) {
  const { bolt, washer, nut } = assemblyConfig;
  const { createBolt, createWasher, createNut, createThread } = modules;

  const assemblySolids = [];

  // ==========================================
  // 1. GENERATE AND POSITION THE ISO BOLT
  // ==========================================
  // The bolt is generated with its under-head plane at Z=0, pointing downward into -Z
  const boltSolid = createBolt(bolt, createThread);
  assemblySolids.push(boltSolid);

  // ==========================================
  // 2. GENERATE AND POSITION THE ISO WASHER
  // ==========================================
  // Assumes your createWasher generator returns a washer centered on [0,0] 
  // with thickness extending from Z = 0 to Z = washerThickness.
  const washerSolid = createWasher(washer);
  
  // Slide washer flush against underside of head. 
  // Because the bolt shaft runs down into negative Z space, we push the washer down by its own thickness.
  const washerThickness = washer.thickness || 2.0; // Fallback default if missing from schema
  const positionedWasher = translate([0, 0, -washerThickness], washerSolid);
  assemblySolids.push(positionedWasher);

  // ==========================================
  // 3. GENERATE AND POSITION THE ISO NUT
  // ==========================================
  // Assumes your createNut generator returns a nut centered on [0,0]
  // with height extending from Z = 0 to Z = nutHeight.
  const nutSolid = createNut(nut, createThread);

  // The nut spins up the bolt shaft from the bottom tip.
  // Its final face must sit flat against the clamped material.
  // Position = -(Washer Thickness + Clamp Thickness + Nut Height)
  const nutHeight = nut.height || 10.0; // Fallback default if missing from schema
  const nutZPosition = -(washerThickness + clampThickness + nutHeight);

  const positionedNut = translate([0, 0, nutZPosition], nutSolid);
  assemblySolids.push(positionedNut);

  // ==========================================
  // 4. UNION ALL COMPONENTS INTO ONE ASSEMBLAGE
  // ==========================================
  console.log(`\n📦 Assembling 3D ISO Stack...`);
  console.log(` -> Joined Thickness Profile: ${clampThickness}mm`);
  console.log(` -> Washer Gap Depth: -${washerThickness}mm`);
  console.log(` -> Nut Seating Level: ${nutZPosition}mm`);

  return union(...assemblySolids);
}

// === EXAMPLE OF APPLICATION PIPELINE INTEGRATION ===
export default function main() {
  // 1. Data acquired independently (can come straight from your parseISOAssembly, or an API database lookup)
  const inputConfiguration = {
    bolt: {
      nominalDiameter: 12, totalLength: 50, widthAcrossFlats: 18, headHeight: 7.5,
      standard: "ISO 4014", threadSeries: "Coarse", threadTolerance: "6g"
    },
    washer: {
      size: "M12", innerDiameter: 13.0, outerDiameter: 24.0, thickness: 2.5,
      standard: "ISO 7090", hardnessHV: "200"
    },
    nut: {
      size: "M12", pitch: 1.75, widthAcrossFlats: 18, height: 10.8,
      standard: "ISO_4032_NORMAL", threadTolerance: "6H"
    }
  };

  // 2. Mocking your external module engine pointers to pass downward
  const componentModules = {
    createBolt: generateISOBolt,     // Your 30-deg chamfered bolt function from previous steps
    createWasher: (w) => {},         // Placeholder mapping to your existing washer generator
    createNut: (n, t) => {},         // Placeholder mapping to your existing nut generator
    createThread: (d, l, o) => {}    // Your external createThread function signature
  };

  // 3. Generate a combined 3D block assuming a plate thickness of 20mm
  const targetClampThickness = 20.0; 
  return generateISOAssembly3D(inputConfiguration, targetClampThickness, componentModules);
}


/**
 * ============================================================================
 * ASSEMBLY PIPELINE RUN TEST
 * ============================================================================
 */
try {
  // A typical compact shorthand line entry from a metric engineering bill of materials
  const sampleBOMCallout = "M12 x 1.25 x 50 Hex Bolt ISO 4017 - 10.9, w/ ISO 7090 Plain Washer 300HV, ISO 4032 Hex Nut";

  // Process the entire string compound line through a single function call
  const completedAssemblyPayload = parseISOAssembly(sampleBOMCallout);

  console.log("🚀 Complete Automated Metric Assembly Token Extraction:");
  console.log(JSON.stringify(completedAssemblyPayload, null, 2));

  // Feed this payload package directly into your independent metric engine routine
  // validateISOMetricAssembly(completedAssemblyPayload);

} catch (err) {
  console.error(`ISO Assembly Parser Failure: ${err.message}`);
}

