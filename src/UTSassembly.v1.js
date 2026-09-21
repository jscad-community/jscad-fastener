import { translate } from '@jscad/modeling';

/**
 * Parse UTS Bolt Assembly Stack Class descriptions.
 *
 * Supported Formats:
 *  - "1/2-13 UNC x 2 Bolt, w/ F436 Washer, Heavy Hex Nut"
 *  - "Bolt: 1/4-20 x 1; Washer: Type A 1/4; Nut: Hex 1/4"
 *  - "3/4-10 UNC x 3 Heavy Hex Structural Bolt + ASTM F436 Washer + Heavy Hex Nut"
 */
function parseUTSAssembly(fullAssemblyString) {
  if (!fullAssemblyString || typeof fullAssemblyString !== 'string') {
    throw new Error("Invalid or empty assembly string provided.");
  }

  // Normalize string spacing and delimiters
  const normalized = fullAssemblyString.replace(/\s+/g, ' ').replace(/\s*\+\s*/g, ', ').replace(/\s*;\s*/g, ', ').trim();
  
  // Split the compound string by commas or explicit "with" / "w/" conjunction boundaries
  const subComponents = normalized.split(/(?:,|\bwith\b|\bw\/\s*)/i);
  
  let boltString = null;
  let washerString = null;
  let nutString = null;
  let sharedSizeContext = null;

  // Step 1: Broad classification loop to sort text phrases into component buckets
  subComponents.forEach(component => {
    const cleanChunk = component.trim();
    const type = determineUTSType(cleanChunk);

    if (type === 'BOLT') boltString = cleanChunk;
    else if (type === 'WASHER') washerString = cleanChunk;
    else if (type === 'NUT') nutString = cleanChunk;
  });

  // Step 2: Extract explicit sizing context to handle shared shorthand patterns
  // (e.g., if a user writes "1/2-13 x 2 Bolt, Washer, Nut" instead of repeating "1/2" three times)
  const sizeContextRegex = /((?:#\d+|\d+(?:\s+\d+\/\d+)?|\d+\/\d+))/;
  if (boltString) {
    const sizeMatch = boltString.match(sizeContextRegex);
    if (sizeMatch) sharedSizeContext = sizeMatch[0];
  }

  // Step 3: Enforce strict structural checks and apply fallback sizing shortcuts
  if (!boltString) {
    throw new Error("Assembly parsing failed: No identifiable Bolt or Screw segment located in the callout string.");
  }
  if (!washerString) {
    throw new Error("Assembly parsing failed: No identifiable Washer segment located in the callout string.");
  }
  if (!nutString) {
    throw new Error("Assembly parsing failed: No identifiable Nut segment located in the callout string.");
  }

  // Inject sizing context backward if components are missing explicit dimension text
  if (!washerString.match(sizeContextRegex) && sharedSizeContext) {
    washerString = `${sharedSizeContext} ${washerString}`;
  }
  if (!nutString.match(sizeContextRegex) && sharedSizeContext) {
    // If the nut lacks a pitch indicator (TPI) but the bolt has one, pull the full pattern
    const tpiMatch = boltString.match(/(?:-|\s)(\d{2})(?:\s|UNC|UNF)/i);
    const seriesMatch = boltString.toUpperCase().includes('UNF') ? 'UNF' : 'UNC';
    const pitchSuffix = tpiMatch ? `-${tpiMatch[1]} ${seriesMatch}` : '';
    nutString = `${sharedSizeContext}${pitchSuffix} ${nutString}`;
  }

  // Step 4: Route the normalized chunks into your worker functions
  console.log(`\n🧩 Deconstructing full assembly string callout...`);
  return {
    bolt: parseUTSBolt(boltString),
    washer: parseUTSWasher(washerString),
    nut: parseUTSNut(nutString)
  };
}


/**
 * Procedural 3D Assembly Generator for UTS Imperial Fastener Stack in JSCAD V3
 * Workspace: Output solids and translations are strictly computed in Millimeters (mm).
 * 
 * @param {Object} assemblyConfig - Specifications for each component (bolt required; washer/nut optional)
 * @param {number} clampThickness - Total material thickness being joined together (INCHES)
 * @param {Object} modules - Reference pointers to your 3D creation functions
 * @returns {Object} Unified 3D assembly mesh scaled in millimeters
 */
export function generateUTSAssembly3D(assemblyConfig, clampThickness, modules) {
  const { bolt, washer, nut } = assemblyConfig;
  const { createUTSBolt, createUTSWasher, createUTSNut, createThread } = modules;

  const MM_PER_INCH = 25.4;

  // Safety Gate: The bolt is always required as the primary assembly core
  if (!bolt) {
    throw new Error("Assembly generation failed: A valid UTS bolt configuration object must be provided.");
  }

  const assemblySolids = [];
  let currentZTrackingMM = 0; // Tracks stacking depth downward in millimeters

  // ==========================================
  // 1. GENERATE AND POSITION THE UTS BOLT
  // ==========================================
  // The generateUTSBoltInMM function handles its own inch->mm conversion natively.
  // Head is generated above Z=0; shank runs downward into negative Z space.
  const boltSolid = createUTSBolt(bolt, createThread);
  assemblySolids.push(boltSolid);

  // ==========================================
  // 2. OPTIONAL: IMPERIAL WASHER CONFIGURATION
  // ==========================================
  if (washer) {
    // Generate the washer solid (assumed to be natively outputting in mm or handled by your module)
    const washerSolid = createUTSWasher(washer);
    
    // Convert washer thickness to mm for structural tracking
    const washerThicknessInch = washer.thickness || 0.095; // Default fallback to standard 1/2" washer thickness
    const washerThicknessMM = washerThicknessInch * MM_PER_INCH;
    
    // Slide washer flush against the underside of the bolt head
    currentZTrackingMM -= washerThicknessMM;
    const positionedWasher = translate([0, 0, currentZTrackingMM], washerSolid);
    assemblySolids.push(positionedWasher);
  }

  // ==========================================
  // 3. OPTIONAL: IMPERIAL NUT CONFIGURATION
  // ==========================================
  if (nut) {
    // Generate the nut solid (handles its own internal dimension formatting)
    const nutSolid = createUTSNut(nut, createThread);
    
    // Convert nut height and clamping thickness variables to millimeters
    const nutHeightInch = nut.height || nut.thickness || 0.438; // Default fallback to standard 1/2" hex nut height
    const nutHeightMM = nutHeightInch * MM_PER_INCH;
    const clampThicknessMM = clampThickness * MM_PER_INCH;
    
    // Position the nut below the washer (if it exists) and the clamped material block
    const nutZPositionMM = currentZTrackingMM - clampThicknessMM - nutHeightMM;
    
    const positionedNut = translate([0, 0, nutZPositionMM], nutSolid);
    assemblySolids.push(positionedNut);
    
    console.log(` -> Imperial Nut Seating Level determined at: ${nutZPositionMM.toFixed(2)}mm`);
  } else {
    console.log(` -> Note: No nut specified. Assuming a tapped blind hole structural profile.`);
  }

  // ==========================================
  // 4. UNION AND EXECUTE SOLIDS
  // ==========================================
  console.log(`\n📦 Compiling 3D UTS Imperial Assembly Stack...`);
  console.log(` -> Clamped Material Depth: ${clampThickness}" (${(clampThickness * MM_PER_INCH).toFixed(2)}mm)`);
  console.log(` -> Structural Stack Parts count: ${assemblySolids.length}`);

  return assemblySolids
}

