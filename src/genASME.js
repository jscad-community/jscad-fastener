/**
 * Imperial ASME Fastener Thread Length Lookup & Matrix Router
 * Processes the enriched token object from parseUTSBolt().
 * 
 * @param {Object} parsedUTSToken - Token object returned from parseUTSBolt()
 * @returns {Object} Unified geometric layout specs fully scaled to millimeters (mm)
 */
function generateASMEBolt(parsedUTSToken) {
  const { size, pitch, threadSeries, metadata } = parsedUTSToken
  const { fastenerStandard, nominalLengthInches, majorDiameterInches } = metadata

  // 1. Resolve Head Dimensions from our Master Inch Registry
  const headSpecs = ASME_HEX_HEAD_REGISTRY_INCHES[size]
  if (!headSpecs) {
    throw new Error(`Data Mapping Error: No ASME head dimensions found for size [${size}].`)
  }

  const sInches  = headSpecs[1] // widthAcrossFlats
  const kInches  = headSpecs[2] // headHeight
  const dwInches = headSpecs[3] // washerFaceDiameter
  const rInches  = headSpecs[4] // filletRadius

  // 2. Compute Thread Sizing Distribution based on ASME Standards (Inches)
  let threadLengthInches = 0
  let unthreadedLengthInches = 0

  if (fastenerStandard === "ASME_B18_2_1_TAP_BOLT" || fastenerStandard === "ASME_B18_6_3_MACHINE") {
    // Fully Threaded Strategy
    threadLengthInches = nominalLengthInches
    unthreadedLengthInches = 0
  } else if (fastenerStandard === "ASME_B18_2_6_STRUCTURAL") {
    // ASME B18.2.6 Heavy Structural Fixed Thread Length Array (Short grip bounds)
    // Layout mapping: Size -> Standard Fixed Thread Length
    const structuralThreadLengths = {
      "1/2": 1.000, "5/8": 1.250, "3/4": 1.375, "7/8": 1.500, "1": 1.750,
      "1-1/8": 2.000, "1-1/4": 2.000, "1-3/8": 2.250, "1-1/2": 2.250
    }
    const fixedLT = structuralThreadLengths[size] || (2 * majorDiameterInches + 0.25)
    threadLengthInches = Math.min(fixedLT, nominalLengthInches)
    unthreadedLengthInches = nominalLengthInches - threadLengthInches
  } else {
    // Standard ASME B18.2.1 Commercial Hex / Heavy Hex Cap Screw Formula
    let computedLT = 0
    if (nominalLengthInches <= 6.0) {
      computedLT = (2 * majorDiameterInches) + 0.25 // 2D + 1/4"
    } else {
      computedLT = (2 * majorDiameterInches) + 0.50 // 2D + 1/2"
    }
    threadLengthInches = Math.min(computedLT, nominalLengthInches)
    unthreadedLengthInches = nominalLengthInches - threadLengthInches
  }

  // 3. Output Fully Scaled Geometric Token Payload (Converted directly to mm)
  return {
    meta: {
      standard: fastenerStandard,
      designation: `${size}x${nominalLengthInches} ${threadSeries}`,
      propertyClass: parsedUTSToken.propertyClass,
      material: parsedUTSToken.material,
      coating: parsedUTSToken.coating
    },
    head: {
      widthAcrossFlats: Number((sInches * 25.4).toFixed(2)),
      height: Number((kInches * 25.4).toFixed(2)),
      washerFaceDiameter: Number((dwInches * 25.4).toFixed(2)),
      filletRadius: Number((rInches * 25.4).toFixed(2)),
      shape: "hexagon"
    },
    shank: {
      majorDiameter: Number((majorDiameterInches * 25.4).toFixed(3)),
      totalLength: Number((nominalLengthInches * 25.4).toFixed(2)),
      threadLength: Number((threadLengthInches * 25.4).toFixed(2)),
      unthreadedLength: Number((unthreadedLengthInches * 25.4).toFixed(2)),
      pitch: Number(((1 / pitch) * 25.4).toFixed(4)), // Pitch converted from TPI to mm spacing width
      tolerance: parsedUTSToken.threadTolerance
    },
    clearance: { ...parsedUTSToken.clearanceSpecifications }
  }
}

