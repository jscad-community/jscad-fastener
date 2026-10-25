import { cylinder, cylinderElliptic, polygon, union, subtract, extrudeHelical, centerZ, mirrorZ, translate } from '@jscad/modeling'

/**
 * Create a thread segment supporting ISO and UTS thread standards.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS.
 *
 * @memberof jscad-fastener
 * @param {Object} spec - thread specifications, ALL ARE REQUIRED
 * @param {Number} spec.majorDiameter - major diameter of thread body
 * @param {Number} spec.pitch - pitch of threads
 * @param {Number} spec.tolerance - radial offset value in mm
 * @param {Boolean} spec.isInternal - false for bolt/external, True for nut/internal
 * @param {Boolean} spec.bevelStart - true to bevel the start (above Z) of the thread
 * @param {Boolean} spec.bevelEnd - true to bevel the end of the thread
 * @param {Number} spec.segments - segments per full rotation
 * @param {Number} length - total length of the thread to generate
 * @returns {Geom3} thread body, centered XYZ
 */
export const Thread = (spec, length) => {
  const {
    majorDiameter,
    pitch,
    tolerance,
    isInternal,
    bevelStart,
    bevelEnd,
    segments
  } = spec

  // 1. ISO / UTS Unified Thread Profile Calculations (Both use identical 60-deg H = 0.866025 * P)
  const H = 0.866025 * pitch
  const tOffset = isInternal ? tolerance : -tolerance
  
  const majorRadius = (majorDiameter / 2) + tOffset
  const minorRadius = majorRadius - (5/8 * H) 
  
  const chamferHeight = pitch * 0.75
  const totalTurns = (length / pitch) + 2
  const totalAngle = totalTurns * 2 * Math.PI
  
  // 2. Define 60-degree V-profile 2D cross-section
  const sagitta = minorRadius * (1 - Math.cos(Math.PI / segments))
  const profileMinorRadius = minorRadius - sagitta

  const profilePoints = [
    [profileMinorRadius, 0],
    [majorRadius, pitch * 0.375], 
    [majorRadius, pitch * 0.625],
    [profileMinorRadius, pitch]
  ]
  
  const ridge2D = polygon({ points: profilePoints })

  // 3. Extrude using true helical calculation
  let threadHelix = extrudeHelical({
    angle: totalAngle,
    pitch: pitch,
    endAngle: totalAngle,
    segments
  }, ridge2D)

  threadHelix = centerZ(threadHelix)
  
  // 4. Assemble threaded body
  let threadCore = null
  if (!isInternal) {
    threadCore = cylinderElliptic({
      startRadius: [minorRadius, minorRadius],
      endRadius: [minorRadius, minorRadius],
      height: length,
      segments
    })
  } else {
    threadCore = cylinderElliptic({
      startRadius: [majorRadius, majorRadius],
      endRadius: [majorRadius, majorRadius],
      height: length,
      segments
    })
  }
  let threadedCore = union(threadCore, threadHelix)

  // 5. Trim or bevel the thread core to precise ends
  let beveledCutter = null
  if (bevelStart || bevelEnd) {
    // 30 degree chamfer
    let eRadius = chamferHeight * Math.tan((30 * Math.PI) / 180)
 
    let chamfer = cylinderElliptic({
      height: chamferHeight,
      startRadius: [majorRadius, majorRadius],
      endRadius: [eRadius, eRadius],
      segments
    })
    const radius = majorRadius + 1
    const height = chamferHeight * 2 + (pitch * 2)
    const zOffset = chamferHeight * 0.5 + pitch
    const chamferBlock = cylinder({radius, height, center: [0, 0, zOffset], segments})
    beveledCutter = subtract(chamferBlock, chamfer)
  }
  let trimmedCutter = null
  if ((!bevelStart) || (!bevelEnd)) {
    const radius = majorRadius + 1.0
    trimmedCutter = cylinderElliptic({
      startRadius: [radius, radius],
      endRadius: [radius, radius],
      height: length,
      segments
    })
  }

  if (bevelStart && bevelEnd) {
    // NOTE: creates cleaner geometry
    const cutterS = translate([0, 0, length * 0.5], beveledCutter)
    const cutterE = translate([0, 0, -length * 0.5], mirrorZ(beveledCutter))
    threadedCore = subtract(threadedCore, cutterS, cutterE)
    return threadedCore
  }

  if (bevelStart) {
    const cutter = translate([0, 0, length * 0.5], beveledCutter)
    threadedCore = subtract(threadedCore, cutter)
  } else {
    const cutter = translate([0, 0, length], trimmedCutter)
    threadedCore = subtract(threadedCore, cutter)
  }
  if (bevelEnd) {
    const cutter = translate([0, 0, -length * 0.5], mirrorZ(beveledCutter))
    threadedCore = subtract(threadedCore, cutter)
  } else {
    const cutter = translate([0, 0, -length], trimmedCutter)
    threadedCore = subtract(threadedCore, cutter)
  }
  return threadedCore
}
