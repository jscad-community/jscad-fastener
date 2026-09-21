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

