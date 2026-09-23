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

const { union } = booleans;
const { translate } = transforms;

/**
 * Procedural 3D Assembly Generator for ISO Fastener Stack in JSCAD V3
 * Handles optional washers and nuts seamlessly without crashing.
 * 
 * @param {Object} assemblyConfig - Specifications for each component (bolt required; washer/nut optional)
 * @param {number} clampThickness - Total material thickness being joined together (mm)
 * @param {Object} modules - Reference pointers to your 3D creation functions
 * @returns {Object} Unified 3D assembly mesh
 */
export function generateISOAssembly3D(assemblyConfig, clampThickness, modules) {
  const { bolt, washer, nut } = assemblyConfig;
  const { createBolt, createWasher, createNut, createThread } = modules;

  // Safety Gate: The bolt is always required as the primary assembly core
  if (!bolt) {
    throw new Error("Assembly generation failed: A valid bolt configuration object must be provided.");
  }

  const assemblySolids = [];
  let currentZTracking = 0; // Tracks the stacking depth downward along the negative Z-axis

  // ==========================================
  // 1. GENERATE AND POSITION THE ISO BOLT
  // ==========================================
  // Head is generated above Z=0; shank runs downward into negative Z space
  const boltSolid = createBolt(bolt);
  assemblySolids.push(boltSolid);

  // ==========================================
  // 2. OPTIONAL: WASHER CONFIGURATION
  // ==========================================
  if (washer) {
    const washerSolid = createWasher(washer);
    const washerThickness = washer.thickness || 2.0; // Fallback default
    
    // Slide washer flush against the underside of the bolt head
    currentZTracking -= washerThickness;
    const positionedWasher = translate([0, 0, currentZTracking], washerSolid);
    assemblySolids.push(positionedWasher);
  }

  // ==========================================
  // 3. OPTIONAL: NUT CONFIGURATION
  // ==========================================
  if (nut) {
    const nutSolid = createNut(nut, createThread);
    const nutHeight = nut.height || 10.0; // Fallback default
    
    // Position the nut below the washer (if it exists) and the clamped material block
    const nutZPosition = currentZTracking - clampThickness - nutHeight;
    
    const positionedNut = translate([0, 0, nutZPosition], nutSolid);
    assemblySolids.push(positionedNut);
    
    console.log(` -> Nut Seating Level determined at: ${nutZPosition}mm`);
  } else {
    console.log(` -> Note: No nut specified. Assuming a tapped blind hole assembly configuration.`);
  }

  // ==========================================
  // 4. UNION AND EXECUTE SOLIDS
  // ==========================================
  console.log(`\n📦 Compiling 3D ISO Assembly Stack...`);
  console.log(` -> Clamped Material Depth: ${clampThickness}mm`);
  console.log(` -> Structural Stack Parts count: ${assemblySolids.length}`);

  return union(...assemblySolids);
}


