import { circle, cylinder, cylinderElliptic, extrudeLinear, intersect, union, rotate, translate, TAU } from '@jscad/modeling'

import { getThreadSpec, generateThread } from './threads.js'

/**
 * Generate a Bolt Hex Head with beveled hex block and optional bearing sholder.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS
 * 
 * @param {Object} spec - The head specification
 * @param {Number} spec.widthAcrossFlats - Wrench size across flats (s) in mm
 * @param {Number} spec.headHeight - Total standard head height (k) in mm
 * @param {Number} spec.bearingFaceDiameter - Bearing face diameter (dw) in mm
 * @param {Number} spec.filletRadius - Fillet radius (f) in mm
 * @param {Number} spec.majorDiameter - Nominal (major) diameter (d) in mm
 * @param {Number} spec.segments - Segments per full rotation
 * @returns {Geom3} bolt hex head sitting above Z=0
 */
export const HexHead = (spec) => {
  const { widthAcrossFlats, headHeight, bearingFaceDiameter, filletRadius, majorDiameter, segments } = spec

  // 1. Establish structural vertical steps
  // FIXME this should be a parameter
  let bearingFaceHeight = (bearingFaceDiameter > 0) ? 0.2 : 0
  const hexPrismHeight = headHeight - bearingFaceHeight

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

  const parts = []

  // Apply intersection to get the clean crowned beveled hex body top profile
  const beveledHexHead3D = intersect(hexBody3D, cutter)
  parts.push(translate([0, 0, bearingFaceHeight], beveledHexHead3D))

  // 4. Generate the Bottom Washer Face Shoulder (dw)
  if (bearingFaceHeight > 0) {
    const bearingFace3D = cylinder({
      radius: bearingFaceDiameter / 2,
      height: bearingFaceHeight,
      segments
    })
    parts.push(translate([0, 0, bearingFaceHeight / 2], bearingFace3D))
  }

  // 5. Generate the fillet to connect head to shank
  if (filletRadius > 0) {
    startRadius = [majorDiameter / 2, majorDiameter / 2]
    endRadius = [majorDiameter / 2 + filletRadius, majorDiameter / 2 + filletRadius]
    const filletCone3D = cylinderElliptic({
      startRadius, // Top flare flaring wide outwards to match r radius bounds
      endRadius,   // Bottom matching the shank flush boundary line width
      height: filletRadius,
      segments
    })
    parts.push(translate([0, 0, -filletRadius / 2], filletCone3D))
  }

  return union(parts)

  // 6. Assembly of Stack
  const alignedWasher = translate([0, 0, bearingFaceHeight / 2], bearingFace3D)
  const alignedHexHead = translate([0, 0, bearingFaceHeight], beveledHexHead3D)
  const alignedFillet = translate([0, 0, -filletRadius / 2], filletCone3D)

  return union(alignedWasher, alignedHexHead, alignedFillet)
}

/**
 * Generate a Bolt Shank extending downwards from the Z plane.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS
 * 
 * @param {Object} spec - The shank specifications
 * @param {Number} spec.threadLength - Length of the threaded section (b) in mm
 * @param {Number} spec.unthreadedLength - Length of smooth shank section in mm
 * @param {Number} spec.segments - Segments per full rotation
 * @returns {Geom3} bolt shank, centered on X-Y, extending downwards from Z
 */
export const Shank = (spec) => {
  const { threadLength, unthreadedLength, majorDiameter, pitch, segments } = spec

  const parts = []

  // 1. Generate the Unthreaded Smooth Grip Segment
  if (unthreadedLength > 0) {
    const radius = majorDiameter / 2
    const smoothGrip3D = cylinder({
      radius,
      height: unthreadedLength,
      segments
    })
    // Positions the upper face flush with the head boundary plane at Z=0
    const positionedGrip = translate([0, 0, -unthreadedLength / 2], smoothGrip3D)
    parts.push(positionedGrip)
  }

  // 2. Generate the Threaded Segment
  if (threadLength > 0) {
    const threadSpec = {majorDiameter, pitch, segments}
    const threadedSegment3D = generateThread(threadSpec, threadLength)

    // Positions the threaded module directly beneath the smooth grip boundary
    const Zoffset = -unthreadedLength
    const positionedThread = translate([0, 0, Zoffset], rotate([TAU / 2, 0, 0], threadedSegment3D))
    parts.push(positionedThread)
  }

  // 3. Flatten and export the complete manifold shank collection
  return union(parts)
}
