import { circle, cylinder, cylinderElliptic, extrudeLinear, intersect, union, rotate, translate, TAU } from '@jscad/modeling'

import { Thread } from './threads.js'
import { HexNut } from './nut.js'

/**
 * Generate a Bolt Hex Head with beveled hex block and optional bearing sholder.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS
 * 
 * @memberof jscad-fastener
 * @param {Object} spec - head specification, ALL ARE REQUIRED
 * @param {Number} spec.widthAcrossFlats - wrench size across flats (s) in mm
 * @param {Number} spec.headHeight - total standard head height (k) in mm
 * @param {Number} spec.bearingFaceDiameter - bearing face diameter (dw) in mm
 * @param {Number} spec.filletRadius - fillet radius (f) in mm
 * @param {Number} spec.majorDiameter - nominal (major) diameter (d) in mm
 * @param {Number} spec.segments - segments per full rotation
 * @returns {Geom3} bolt hex head, centered XY, sitting above Z=0
 */
export const HexHead = (spec) => {
  const { widthAcrossFlats, headHeight, bearingFaceDiameter, filletRadius, majorDiameter, segments } = spec

  let zOffset = 0
  const parts = []

  // FIXME this should be a parameter
  const bearingFaceHeight = (bearingFaceDiameter > 0) ? 0.2 : 0

  // 1. Create the hexagon body and position
  let hexBody = HexNut({widthAcrossFlats, height: headHeight, bearingFaceHeight, bearingFaceDiameter, zOffset: 0, segments})

  zOffset = headHeight / 2
  hexBody = translate([0, 0, zOffset], hexBody)
  parts.push(hexBody)

  // 2. Generate the fillet to connect head to shank
  if (filletRadius > 0) {
    const startRadius = [majorDiameter / 2, majorDiameter / 2]
    const endRadius = [majorDiameter / 2 + filletRadius, majorDiameter / 2 + filletRadius]
    const filletCone3D = cylinderElliptic({
      startRadius, // Top flare flaring wide outwards to match r radius bounds
      endRadius,   // Bottom matching the shank flush boundary line width
      height: filletRadius,
      segments
    })
    zOffset = -filletRadius / 2
    parts.push(translate([0, 0, zOffset], filletCone3D))
  }
  return union(parts)
}

/**
 * Generate a Bolt Shank extending downwards from the Z plane.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS
 * 
 * @memberof jscad-fastener
 * @param {Object} spec - shank specifications, ALL ARE REQUIRED
 * @param {Number} spec.threadLength - length of the threaded section (b) in mm
 * @param {Number} spec.unthreadedLength - length of smooth shank section in mm
 * @param {Number} spec.majorDiameter - nominal (major) diameter (d) in mm
 * @param {Number} spec.pitch - pitch of threads
 * @param {Number} spec.segments - segments per full rotation
 * @returns {Geom3} bolt shank, centered on XY, extending downwards from Z=0
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
    const threadSpec = {majorDiameter, pitch, tolerance: 0, inInternal: false, segments}
    const threadedSegment3D = Thread(threadSpec, threadLength)

    // Positions the threaded module directly beneath the smooth grip boundary
    const Zoffset = -unthreadedLength
    const positionedThread = translate([0, 0, Zoffset], rotate([TAU / 2, 0, 0], threadedSegment3D))
    parts.push(positionedThread)
  }

  // 3. Flatten and export the complete manifold shank collection
  return union(parts)
}
