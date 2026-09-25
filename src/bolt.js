import { circle, cylinder, cylinderElliptic, extrudeLinear, intersect, union, rotate, translate, TAU } from '@jscad/modeling'

import { getThreadSpec, generateThread } from './threads.v3.js'

/**
 * Generate a hex bolt head, complete with bottom washer face and a top crown chamfer.
 *
 * NOTE: ALL SIZES ARE IN MILLIMETERS
 * 
 * @param {Object} headSpec - The head specification
 * @param {Number} headSpec.widthAcrossFlats - Wrench size across flats (s) in mm
 * @param {Number} headSpec.headHeight - Total standard head height (k) in mm
 * @param {Number} headSpec.washerFaceDiameter - Bearing face diameter (dw) in mm
 * @param {Number} headSpec.filletRadius - Fillet radius (f) in mm
 * @param {Number} headSpec.majorDiameter - Nominal (major) diameter (d) in mm
 * @param {Number} headSpec.segments - Segments per full rotation
 * @returns {Geom3} ISO bolt head sitting at Z=0
 */
export const generateHexHead = (headSpec) => {
  const { widthAcrossFlats, headHeight, washerFaceDiameter, filletRadius, majorDiameter, segments } = headSpec

  // 1. Establish structural vertical steps
  const washerFaceHeight = 0.2
  const hexPrismHeight = headHeight - washerFaceHeight

  // 2. Extrude the Base Hexagon Body
  const hexRadius = (widthAcrossFlats / 2) / Math.cos(TAU / 12)
  const hex2D = circle({ 
    radius: hexRadius, 
    segments: 6,
  })
  const hexBody3D = extrudeLinear({ height: hexPrismHeight }, hex2D)

  // 3. Generate the Bevel/Chamfer Tool (Cone intersecting logic)
  // Per ISO standard rules, the circular bevel crown diameter on top matches the width across flats (s).
  const bevelCrownRadius = widthAcrossFlats / 2
  const bevelAngleRad = 30 * (TAU / 360) // Standard 30 degree industrial tool angle
  
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

  const middleCylinderHeight = hexPrismHeight - bevelCutHeight
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
 * Generate a Bolt Shank extending downwards from the Z plane.
 * 
 * @param {Object} shankSpec - The shank specifications
 * @param {String} shankSpec.standard - 'ISO' or 'UTS'
 * @param {Number|String} shankSpec.size - Dimension identifier; 6 or 'M6', #0 or '1/2'
 * @param {String} shankSpec.threadSeries - Series of thread pitch; coarse or fine
 * @param {Number} shankSpec.threadLength - Length of the threaded section (b) in mm
 * @param {Number} shankSpec.unthreadedLength - Length of smooth shank section in mm
 * @param {Number} shankSpec.segments - Segments per full rotation
 * @returns {Geom3} bolt shank, centered on X-Y, extending downwards from Z
 */
export const generateShank = (shankSpec) => {
  const { standard, size, threadSeries, threadLength, unthreadedLength, segments } = shankSpec

  const threadSpec = getThreadSpec(standard, size, threadSeries)
  const {majorDiameter} = threadSpec

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
    // NOTE: createThread accepts Number or String for ISO sizes
    const threadedSegment3D = generateThread(threadSpec, threadLength)

    // Positions the threaded module directly beneath the smooth grip boundary
    const Zoffset = -unthreadedLength
    const positionedThread = translate([0, 0, Zoffset], rotate([TAU / 2, 0, 0], threadedSegment3D))
    piecesToUnion.push(positionedThread)
  }

  // 3. Flatten and export the complete manifold shank collection
  return union(...piecesToUnion)
}
