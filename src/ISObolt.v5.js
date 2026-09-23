import { circle, cylinder, cylinderElliptic, extrudeLinear, intersect, union, rotate, translate, TAU } from '@jscad/modeling'

import { createThread } from './threads.v3.js'

// Dimensions Offsets
export const WIDTH_ACROSS_FLATS = 0
export const HEAD_HEIGHT = 1
export const WASHER_DIAMETER = 2
export const FILLET_RADIUS = 3

// TODO map the legacy German DIN 931 (Partial) and DIN 933 (Full) cross-references into your ISO_BOLT_STANDARD_REGISTRY

/**
 * Master Registry for ISO Bolts (ISO 4014 / ISO 4017)
 *
 * Schema Layout: "Designation": [widthAcrossFlats (s), headHeight (k), washerFaceDiameter (dw), filletRadius (r)]
 * Core Reference: ISO 4014 / ISO 4017 minimum engineering stress-dispersion boundaries
 */
const ISO_BOLT_HEAD_REGISTRY = {
  "M1":    [2.5,   0.7,   2.0,   0.1 ],
  "M1.2":  [3.0,   0.85,  2.5,   0.1 ],
  "M1.6":  [3.2,   1.1,   2.7,   0.1 ],
  "M2":    [4.0,   1.4,   3.5,   0.1 ],
  "M2.5":  [5.0,   1.7,   4.4,   0.1 ],
  "M3":    [5.5,   2.0,   4.9,   0.1 ],
  "M4":    [7.0,   2.8,   6.3,   0.2 ],
  "M4.5":  [8.0,   3.0,   7.2,   0.2 ],
  "M5":    [8.0,   3.5,   7.2,   0.2 ],
  "M6":    [10.0,  4.0,   9.0,   0.25],
  "M7":    [11.0,  4.8,   10.0,  0.25],
  "M8":    [13.0,  5.3,   11.7,  0.4 ],
  "M9":    [13.0,  6.0,   11.7,  0.4 ],
  "M10":   [16.0,  6.4,   14.6,  0.4 ],
  "M11":   [17.0,  7.0,   15.6,  0.4 ],
  "M12":   [18.0,  7.5,   16.6,  0.6 ],
  "M14":   [21.0,  8.8,   19.6,  0.6 ],
  "M16":   [24.0,  10.0,  22.5,  0.6 ],
  "M18":   [27.0,  11.5,  25.3,  0.8 ],
  "M20":   [30.0,  12.5,  28.2,  0.8 ],
  "M22":   [34.0,  14.0,  31.4,  0.8 ],
  "M24":   [36.0,  15.0,  33.3,  0.8 ],
  "M27":   [41.0,  17.0,  38.0,  1.0 ],
  "M30":   [46.0,  18.7,  42.8,  1.0 ],
  "M33":   [50.0,  21.0,  46.6,  1.0 ],
  "M36":   [55.0,  22.5,  51.1,  1.0 ],
  "M39":   [60.0,  25.0,  55.9,  1.0 ],
  "M42":   [65.0,  26.0,  60.0,  1.2 ],
  "M45":   [70.0,  28.0,  64.7,  1.2 ],
  "M48":   [75.0,  30.0,  69.5,  1.6 ],
  "M52":   [80.0,  33.0,  74.2,  1.6 ],
  "M56":   [85.0,  35.0,  78.7,  2.0 ],
  "M60":   [90.0,  38.0,  83.4,  2.0 ],
  "M64":   [95.0,  40.0,  88.2,  2.0 ],
  "M68":   [100.0, 54.0,  92.9,  2.0 ]
};

/**
 * Generate ISO Bolt Head, complete with bottom washer face and a top crown chamfer.
 * 
 * @param {Object} headSpec - The head object parameters returned from generateISOBolt()
 * @param {Number} headSpec.widthAcrossFlats - Wrench size across flats (s) in mm
 * @param {Number} headSpec.headHeight - Total standard head height (k) in mm
 * @param {Number} headSpec.washerFaceDiameter - Bearing face diameter (dw) in mm
 * @param {Number} headSpec.filletRadius - Fillet radius (f) in mm
 * @param {Number} headSpec.majorDiameter - Nominal (major) diameter (d) in mm
 * @param {Number} headSpec.segments - Segments per full rotation
 * @returns {Geom3} ISO bolt head sitting at Z=0
 */
function generateHexHead(headSpec) {
  const { widthAcrossFlats, headHeight, washerFaceDiameter, filletRadius, majorDiameter, segments } = headSpec

  // 1. Establish structural vertical steps
  const washerFaceHeight = 0.2
  const hexPrismHeight = headHeight - washerFaceHeight

  // 2. Extrude the Base Hexagon Body
  const hexRadius = (widthAcrossFlats / 2) / Math.cos(Math.PI / 6)
  const hex2D = circle({ 
    radius: hexRadius, 
    segments: 6,
    //startAngle: Math.PI / 6 // Keeps flats aligned orthogonal to the grid coordinate axes
  })
  const hexBody3D = extrudeLinear({ height: hexPrismHeight }, hex2D)

  // 3. Generate the Bevel/Chamfer Tool (Cone intersecting logic)
  // Per ISO standard rules, the circular bevel crown diameter on top matches the width across flats (s).
  const bevelCrownRadius = widthAcrossFlats / 2
  const bevelAngleRad = (30 * Math.PI) / 180 // Standard 30 degree industrial tool angle
  
  const outerDeltaRadius = hexRadius - bevelCrownRadius
  const bevelCutHeight = outerDeltaRadius / Math.tan(bevelAngleRad)

  let startRadius = [hexRadius + 1, hexRadius + 1]
  let endRadius = [bevelCrownRadius, bevelCrownRadius]
  const bevelCutter3D = cylinderElliptic({
    startRadius, // Oversized bottom to fully clear the prism footprint
    endRadius, // Tapering down directly onto the flat tangent circle path
    height: bevelCutHeight,
    segments
  })

  const cutterZPosition = hexPrismHeight - (bevelCutHeight / 2)
  const positionedCutter = translate([0, 0, cutterZPosition], bevelCutter3D)

  const middleCylinderHeight = hexPrismHeight - bevelCutHeight;
  const middleCoreC = circle({ 
    radius: hexRadius + 1, 
    segments,
  })
  const middleCore = extrudeLinear({ height: middleCylinderHeight }, middleCoreC)

  const cutter = union(positionedCutter, middleCore)

  // Apply intersection to get the clean crowned beveled hex body top profile
  const beveledHexHead3D = intersect(hexBody3D, cutter)

  // 4. Generate the Bottom Washer Face Shoulder (dw)
  const washerFace3D = cylinder({
    radius: washerFaceDiameter / 2,
    height: washerFaceHeight,
    segments
  })

  // 5. Generate the fillet to connect head to shank
  startRadius = [majorDiameter / 2, majorDiameter / 2]
  endRadius = [majorDiameter / 2 + filletRadius, majorDiameter / 2 + filletRadius]
  const filletCone3D = cylinderElliptic({
    startRadius, // Top flare flaring wide outwards to match r radius bounds
    endRadius,   // Bottom matching the shank flush boundary line width
    height: filletRadius,
    segments
  })

  // 6. Assembly of Stack
  const alignedWasher = translate([0, 0, washerFaceHeight / 2], washerFace3D)
  const alignedHexHead = translate([0, 0, washerFaceHeight], beveledHexHead3D)
  const alignedFillet = translate([0, 0, -filletRadius / 2], filletCone3D)

  return union(alignedWasher, alignedHexHead, alignedFillet)
}

/**
 * Generate a ISO Bolt Shank extending downwards from the Z=0 plane.
 * 
 * @param {Object} shankSpec - The shank object returned from generateISOBolt()
 * @param {Number} shankSpec.majorDiameter - Thread/shank outer diameter in mm
 * @param {Number} shankSpec.threadLength - Length of the threaded section (b) in mm
 * @param {Number} shankSpec.unthreadedLength - Length of smooth shank section in mm
 * @param {Number} shankSpec.segments - Segments per full rotation
 * threadSeries
 * @returns {Geom3} 3D geometry centered on X-Y, extending downwards from Z=0
 */
function generateShank(shankSpec) {
  const { size, majorDiameter, threadLength, unthreadedLength, threadSeries, segments } = shankSpec

  const piecesToUnion = []

  // 1. Generate the Unthreaded Smooth Grip Segment (ISO 4014)
  if (unthreadedLength > 0) {
    const radius = majorDiameter / 2
    const smoothGrip3D = cylinder({
      radius,
      height: unthreadedLength,
      segments
    })
    // Positions the upper face flush with the head boundary plane at Z=0
    const positionedGrip = translate([0, 0, -unthreadedLength / 2], smoothGrip3D)
    piecesToUnion.push(positionedGrip)
  }

  // 2. Generate the Threaded Segment
  if (threadLength > 0) {
    //const threadedSegment3D = createThread(radius, threadLength, pitch)
    const isFine = (threadSeries === 'FINE')
    // NOTE: createThread accepts Number or String for ISO sizes
    const threadedSegment3D = createThread({standard: 'ISO', size, isFine, segments}, threadLength)

    // Positions the threaded module directly beneath the smooth grip boundary
    //const Zoffset = -threadLength - unthreadedLength
    const Zoffset = -unthreadedLength
    const positionedThread = translate([0, 0, Zoffset], rotate([TAU / 2, 0, 0], threadedSegment3D))
    piecesToUnion.push(positionedThread)
  }

  // 3. Flatten and export the complete manifold shank collection
  return union(...piecesToUnion)
}

/**
 * Generate ISO Bolt from the given specification.
 *
 * @see parseISOBolt() and parseAA()
 *
 * @param {Object} specification - bolt specification
 * @param {String} specification.size - Dimension identifier (e.g., 'M6' for M6 ISO)
 * @param {String} specifiation.standard - Bolt standard; ISO 4014 or ISO 4017
 * @param {String} specifiation.threadSeries - Thread series of bolt; coarse or fine
 * @param {Number} nominalLength - nominal length of the shank (mm)
 */
export const generateISOBolt = (specification, nominalLength, segments = 36) => {
  if (!specification || !specification.size) {
    throw new Error("Pipeline Error: Invalid parseISOBolt token structure.");
  }

  let size = specification.size.startsWith("M") ? specification.size : "M" + specification.size;

  const headSpecs = ISO_BOLT_HEAD_REGISTRY[size];
  if (!headSpecs) {
    throw new Error(`Data Mapping Error: No bolt head specifications found for size [${sizeKey}].`);
  }

  // Extract from the newly expanded array index parameters
  const widthAcrossFlats = headSpecs[WIDTH_ACROSS_FLATS];
  const headHeight = headSpecs[HEAD_HEIGHT];
  const washerFaceDiameter = headSpecs[2];
  const filletRadius = headSpecs[3];

  const majorDiameter = parseFloat(specification.size.replace(/[^\d.]/g, ""));

  let threadLength = 0;
  let unthreadedLength = 0;
  let standard = specification.standard

  if (standard === "ISO 4017") {
    // ISO 4017 (full thread)
    threadLength = nominalLength;
    unthreadedLength = 0;
  } else if (standard === "ISO 4014") {
    // ISO 4014 (partial thread)
    let computedB = nominalLength <= 125 ? (2 * majorDiameter) + 6 : 
                    nominalLength <= 200 ? (2 * majorDiameter) + 12 : (2 * majorDiameter) + 25;
    threadLength = Math.min(computedB, nominalLength);
    unthreadedLength = nominalLength - threadLength;
  } else {
    standard = 'ISO 4017'
    threadLength = nominalLength;
    unthreadedLength = 0;
  }
  threadLength = Number(threadLength.toFixed(2))
  unthreadedLength = Number(unthreadedLength.toFixed(2))

  // create the bolt head from the specifications
  const head = generateHexHead({widthAcrossFlats, headHeight, washerFaceDiameter, filletRadius, majorDiameter, segments})

  const threadSeries = specification.threadSeries.toUpperCase()
  const shank = generateShank({ size, majorDiameter, threadLength, unthreadedLength, threadSeries, segments })

  return union(head, shank)

  return {
    meta: {
      standard: standard,
      designation: `${size}x${nominalLength}`
    },
    head: {
      widthAcrossFlats,
      headHeight,
      washerFaceDiameter,
      filletRadius, // Included in structural output payload token maps!
      shape: "hexagon"
    },
    shank: {
      size,
      majorDiameter,
      totalLength: nominalLength,
      threadLength,
      unthreadedLength,
      pitch
    }
  };
}

