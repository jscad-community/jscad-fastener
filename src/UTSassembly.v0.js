/**
 * Full Assembly Parser for UTS Imperials
 * Takes a compound engineering stack description and breaks it into parsed tokens.
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
 * ============================================================================
 * ASSEMBLY PIPELINE RUN TEST
 * ============================================================================
 */
try {
  // A typical shorthand line entry often found in a structural engineering bill of materials
  const sampleBOMCallout = "1/2-13 UNC x 2 Heavy Hex Bolt Grade 8, w/ ASTM F436 Flat Washer, Heavy Hex Nut Plated";

  // Process the full string at once
  const completedAssemblyPayload = parseUTSAssembly(sampleBOMCallout);

  console.log("🚀 Complete Automated Assembly Token Extraction:");
  console.log(JSON.stringify(completedAssemblyPayload, null, 2));

  // Now this payload can be run straight into the imperial validation routine!
  // validateUnifiedAssembly(completedAssemblyPayload);

} catch (err) {
  console.error(`Assembly Parser Error: ${err.message}`);
}

