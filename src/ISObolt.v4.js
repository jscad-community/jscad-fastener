/**
 * Master Registry for ISO Hexagon Bolt Head Parameters
 * Schema Layout: "Designation": [widthAcrossFlats (s), headHeight (k), washerFaceDiameter (dw)]
 */
const ISO_BOLT_HEAD_REGISTRY = {
  "M1":    [2.5,   0.7,   2.0 ],
  "M1.2":  [3.0,   0.85,  2.5 ],
  "M1.6":  [3.2,   1.1,   2.7 ],
  "M2":    [4.0,   1.4,   3.5 ],
  "M2.5":  [5.0,   1.7,   4.4 ],
  "M3":    [5.5,   2.0,   4.9 ],
  "M4":    [7.0,   2.8,   6.3 ],
  "M4.5":  [8.0,   3.0,   7.2 ],
  "M5":    [8.0,   3.5,   7.2 ],
  "M6":    [10.0,  4.0,   9.0 ],
  "M7":    [11.0,  4.8,   10.0],
  "M8":    [13.0,  5.3,   11.7],
  "M9":    [13.0,  6.0,   11.7],
  "M10":   [16.0,  6.4,   14.6],
  "M11":   [17.0,  7.0,   15.6],
  "M12":   [18.0,  7.5,   16.6],
  "M14":   [21.0,  8.8,   19.6],
  "M16":   [24.0,  10.0,  22.5],
  "M18":   [27.0,  11.5,  25.3],
  "M20":   [30.0,  12.5,  28.2],
  "M22":   [34.0,  14.0,  31.4],
  "M24":   [36.0,  15.0,  33.3],
  "M27":   [41.0,  17.0,  38.0],
  "M30":   [46.0,  18.7,  42.8],
  "M33":   [50.0,  21.0,  46.6],
  "M36":   [55.0,  22.5,  51.1],
  "M39":   [60.0,  25.0,  55.9],
  "M42":   [65.0,  26.0,  60.0],
  "M45":   [70.0,  28.0,  64.7],
  "M48":   [75.0,  30.0,  69.5],
  "M52":   [80.0,  33.0,  74.2],
  "M56":   [85.0,  35.0,  78.7],
  "M60":   [90.0,  38.0,  83.4],
  "M64":   [95.0,  40.0,  88.2],
  "M68":   [100.0, 43.0,  92.9]
};

/**
 * Generate ISO Bolt Head, complete with bottom washer face and a top crown chamfer.
 * 
 * @param {Object} headSpec - The head object parameters returned from generateISOBolt()
 * @param {number} headSpec.widthAcrossFlats - Wrench flat size (s) in mm
 * @param {number} headSpec.height - Total standard head height (k) in mm
 * @param {number} headSpec.washerFaceDiameter - Circular shoulder diameter (dw) in mm
 * @returns {Geom3} Fully manifold beveled 3D mesh resting on Z=0
 */
function generateHexHead(headSpec) {
  const { widthAcrossFlats, height, washerFaceDiameter } = headSpec

  // 1. Establish structural vertical steps
  const washerFaceHeight = 0.2
  const hexPrismHeight = height - washerFaceHeight

  // 2. Extrude the Base Hexagon Body
  // Hex vertex radius = (s / 2) / cos(30 deg)
  const hexRadius = (widthAcrossFlats / 2) / Math.cos(Math.PI / 6)
  const hex2D = circle({ 
    radius: hexRadius, 
    segments: 6,
    startAngle: Math.PI / 6 // Keeps flats aligned orthogonal to the grid coordinate axes
  })
  const hexBody3D = extrudeLinear({ height: hexPrismHeight }, hex2D)

  // 3. Generate the Bevel/Chamfer Tool (Cone intersecting logic)
  // Per ISO standard rules, the circular bevel crown diameter on top matches the width across flats (s).
  const bevelCrownRadius = widthAcrossFlats / 2
  const bevelAngleRad = (30 * Math.PI) / 180 // Standard 30 degree industrial tool angle
  
  // Calculate the required extra cone clearance height based on the radius expansion delta
  const outerDeltaRadius = hexRadius - bevelCrownRadius
  const bevelCutHeight = outerDeltaRadius / Math.tan(bevelAngleRad)

  // Create a cone (cylinder with a zero top radius) to use as the intersection cutting boundary
  const bevelCutter3D = cylinder({
    radiusStart: hexRadius + 1, // Oversized bottom to fully clear the prism footprint
    radiusEnd: bevelCrownRadius, // Tapering down directly onto the flat tangent circle path
    height: bevelCutHeight,
    segments: 64
  })

  // Position the cutter tool so it smoothly tapers down right at the top edge threshold boundary
  const cutterZPosition = hexPrismHeight - (bevelCutHeight / 2)
  const positionedCutter = translate([0, 0, cutterZPosition], bevelCutter3D)

  // Apply intersection to get the clean crowned beveled hex body top profile
  const beveledHexHead3D = intersect(hexBody3D, positionedCutter)

  // 4. Generate the Bottom Washer Face Shoulder (dw)
  const washerFace3D = cylinder({
    radius: washerFaceDiameter / 2,
    height: washerFaceHeight,
    segments: 32
  })

  // 5. Unified Assembly Transformation Stack
  const alignedWasher = translate([0, 0, washerFaceHeight / 2], washerFace3D)
  const alignedHexHead = translate([0, 0, washerFaceHeight + (hexPrismHeight / 2)], beveledHexHead3D)

  // Add this inside generateHexHead() to create the under-head fillet flare geometry
  const filletCone3D = primitives.cylinder({
    radiusStart: (majorDiameter / 2) + filletRadius, // Top flare flaring wide outwards to match r radius bounds
    radiusEnd: majorDiameter / 2,                  // Bottom matching the shank flush boundary line width
    height: filletRadius,
    segments: 32
  })

  // Position it right at the base underside of your washer face step
  const alignedFillet = translate([0, 0, -filletRadius / 2], filletCone3D)

  // Union it with your alignedWasher and alignedHexHead meshes!
  return union(alignedWasher, alignedHexHead, alignedFillet)

}

/**
 * Generates a 3D ISO Bolt Shank extending downwards from the Z=0 plane.
 * Utilizes the custom project-level createThread() block for detailing.
 * 
 * @param {Object} shankSpec - The shank object returned from generateISOBolt()
 * @param {number} shankSpec.majorDiameter - Thread/shank outer diameter in mm
 * @param {number} shankSpec.totalLength - Total bolt length under the head (l) in mm
 * @param {number} shankSpec.threadLength - Length of the threaded section (b) in mm
 * @param {number} shankSpec.unthreadedLength - Length of smooth shank section in mm
 * @param {number} shankSpec.pitch - Thread pitch in mm
 * @param {boolean} [renderThreadsHighFidelity=false] - Toggle to use createThread() or a smooth proxy cylinder
 * @returns {Geom3} 3D geometry centered on X-Y, extending downwards from Z=0
 */
function generateShank(shankSpec, renderThreadsHighFidelity = false) {
  const { majorDiameter, totalLength, threadLength, unthreadedLength, pitch } = shankSpec
  const radius = majorDiameter / 2
  const segments = 32 // Circular mesh resolution for smooth matching shanks
  
  const piecesToUnion = []

  // 1. Generate the Unthreaded Smooth Grip Segment (ISO 4014)
  if (unthreadedLength > 0) {
    const smoothGrip3D = cylinder({
      radius: radius,
      height: unthreadedLength,
      segments: segments
    })
    // Positions the upper face flush with the head boundary plane at Z=0
    const positionedGrip = translate([0, 0, -unthreadedLength / 2], smoothGrip3D)
    piecesToUnion.push(positionedGrip)
  }

  // 2. Generate the Threaded Segment
  if (threadLength > 0) {
    let threadedSegment3D

    if (renderThreadsHighFidelity) {
      // High-Fidelity Path: Execute your dedicated thread cutting profile loop
      threadedSegment3D = createThread(radius, threadLength, pitch)
    } else {
      // High-Performance Proxy Path: Standard smooth cylinder representation
      threadedSegment3D = cylinder({
        radius: radius,
        height: threadLength,
        segments: segments
      })
    }

    // Positions the threaded module directly beneath the smooth grip boundary
    const threadedZCenter = -(unthreadedLength + (threadLength / 2))
    const positionedThread = translate([0, 0, threadedZCenter], threadedSegment3D)
    piecesToUnion.push(positionedThread)
  }

  // 3. Flatten and export the complete manifold shank collection
  return union(...piecesToUnion)
}

/**
 * Refactored ISO Bolt Generator Engine
 * Uses the explicit ISO_BOLT_HEAD_REGISTRY table for precise head and washer-face geometries.
 * Compatible with the structured tokens returned from parseISOBolt().
 * 
 * @param {Object} parsedBoltToken - Token dictionary returned by parseISOBolt()
 * @param {number} nominalLength - The total shank length under the head (l) in mm
 * @returns {Object} Clean geometric specs ready for JSCAD extrusion routines
 */
function generateISOBolt(parsedBoltToken, nominalLength) {
  // 1. Validate Input Structure
  if (!parsedBoltToken || !parsedBoltToken.size) {
    throw new Error("Pipeline Error: Invalid or missing parseISOBolt token structure.");
  }

  // Normalize size key (Ensure it matches registry formats like "M8", "M12", "M4.5")
  let sizeKey = parsedBoltToken.size;
  if (!sizeKey.startsWith("M")) {
    sizeKey = "M" + sizeKey;
  }

  // 2. Resolve Master Bolt Head Registry Metrics [widthAcrossFlats, headHeight, washerFaceDiameter]
  const headSpecs = ISO_BOLT_HEAD_REGISTRY[sizeKey];
  if (!headSpecs) {
    throw new Error(`Data Mapping Error: No bolt head specifications found for size [${sizeKey}].`);
  }

  const widthAcrossFlats = headSpecs[0];
  const headHeight = headSpecs[1];
  const washerFaceDiameter = headSpecs[2];

  const majorDiameter = parseFloat(parsedBoltToken.size.replace(/[^\d.]/g, ""));
  const pitch = parsedBoltToken.pitch;

  // 3. Thread Layout Sizing Rule Router (ISO 4014 vs ISO 4017)
  let threadLength = 0;
  let unthreadedShankLength = 0;
  const standardKey = parsedBoltToken.threadSeries; // e.g., "ISO 4014" or "ISO 4017"

  if (standardKey === "ISO 4017") {
    // Fully Threaded Bolt Strategy
    threadLength = nominalLength;
    unthreadedShankLength = 0;
  } else if (standardKey === "ISO 4014") {
    // Partially Threaded Bolt Strategy (Dynamic ISO 4014 thread length calculation)
    let computedB = 0;
    if (nominalLength <= 125) {
      computedB = (2 * majorDiameter) + 6;
    } else if (nominalLength > 125 && nominalLength <= 200) {
      computedB = (2 * majorDiameter) + 12;
    } else {
      computedB = (2 * majorDiameter) + 25;
    }
    
    // Clamp thread limits cleanly within total physical part space
    threadLength = Math.min(computedB, nominalLength);
    unthreadedShankLength = nominalLength - threadLength;
  } else {
    // Fallback default approach: full thread
    threadLength = nominalLength;
    unthreadedShankLength = 0;
  }

  // 4. Output complete structural token payload for the 3D JSCAD render loops
  return {
    meta: {
      standard: standardKey || "ISO Generic",
      designation: `${sizeKey}x${nominalLength}`,
      propertyClass: parsedBoltToken.propertyClass,
      material: parsedBoltToken.material,
      coating: parsedBoltToken.coating
    },
    head: {
      widthAcrossFlats: widthAcrossFlats,
      height: headHeight,
      washerFaceDiameter: washerFaceDiameter, // Used to extrude the thin dw shoulder step
      shape: "hexagon"
    },
    shank: {
      majorDiameter: majorDiameter,
      totalLength: nominalLength,
      threadLength: Number(threadLength.toFixed(2)),
      unthreadedLength: Number(unthreadedShankLength.toFixed(2)),
      pitch: pitch,
      tolerance: parsedBoltToken.threadTolerance || "6g"
    },
    clearance: { ...parsedBoltToken.clearanceSpecifications }
  };
}

