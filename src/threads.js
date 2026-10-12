import { cylinderElliptic, polygon, intersect, union, subtract, extrudeHelical, translate } from '@jscad/modeling'

/**
 * Create a thread segment supporting ISO and UTS thread standards.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS.
 *
 * @memberof jscad-fastener
 * @param {Object} spec - thread specifications, ALL ARE REQUIRED
 * @param {Number} spec.majorDiameter - Major diameter of thread body
 * @param {Number} spec.pitch - Pitch of threads
 * @param {Number} spec.tolerance - Radial offset value in mm (e.g. 0.15 for 3D prints)
 * @param {Number} spec.segments - Segments per full rotation
 * @param {Boolean} spec.isInternal - False for bolt/external, True for nut/internal
 * @param {Number} length - Total length of the thread to generate
 * @returns {Geom3} thread body, centered XY, extending up from Z
 */
export const Thread = (spec, length) => {
  const {
    majorDiameter,
    pitch,
    tolerance,
    isInternal,
    segments
  } = spec

  // 2. ISO / UTS Unified Thread Profile Calculations (Both use identical 60-deg H = 0.866025 * P)
  const H = 0.866025 * pitch
  const tOffset = isInternal ? tolerance : -tolerance
  
  const majorRadius = (majorDiameter / 2) + tOffset
  const minorRadius = majorRadius - (5/8 * H) 
  
  const chamferHeight = pitch * 0.75
  const totalTurns = (length / pitch) + 2
  const totalAngle = totalTurns * 2 * Math.PI
  
  // 3. Define 60-degree V-profile 2D cross-section
  const sagitta = minorRadius * (1 - Math.cos(Math.PI / segments))
  const profileMinorRadius = minorRadius - sagitta

  const profilePoints = [
    [profileMinorRadius, 0],
    [majorRadius, pitch * 0.375], 
    [majorRadius, pitch * 0.625],
    [profileMinorRadius, pitch]
  ]
  
  const ridge2D = polygon({ points: profilePoints })

  // 4. Extrude using true helical calculation
  let threadedHelix = extrudeHelical({
    angle: totalAngle,
    pitch: pitch,
    endAngle: totalAngle,
    segments
  }, ridge2D)

  // 5. Shift the thread up to correct the baseline start phase
  threadedHelix = translate([0, 0, pitch], threadedHelix)

  // 6. Precise bounding volume to trim uneven helical endings perfectly to [0, length]
  const cleanBounds = translate(
    [0, 0, length / 2],
    cylinderElliptic({ 
      startRadius: [majorRadius + 1, majorRadius + 1], 
      endRadius: [majorRadius + 1, majorRadius + 1], 
      height: length, 
      segments
    })
  )
  
  const trimmedHelix = intersect(cleanBounds, threadedHelix)
  
  // 7. Assemble core body
  let finalThreadedObject
  if (!isInternal) {
    const shiftedCore = translate(
      [0, 0, length / 2],
      cylinderElliptic({ 
        startRadius: [minorRadius, minorRadius], 
        endRadius: [minorRadius, minorRadius], 
        height: length, 
        segments
      })
    )
    finalThreadedObject = union(shiftedCore, trimmedHelix)
  } else {
    const shiftedOuter = translate(
      [0, 0, length / 2],
      cylinderElliptic({ 
        startRadius: [majorRadius, majorRadius], 
        endRadius: [majorRadius, majorRadius], 
        height: length, 
        segments
      })
    )
    finalThreadedObject = union(shiftedOuter, trimmedHelix)
  }

  // 8. Apply the top entry chamfer 
  const positionedCutterBox = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({ 
      startRadius: [majorRadius + 2, majorRadius + 2], 
      endRadius: [majorRadius + 2, majorRadius + 2], 
      height: chamferHeight + 0.1, 
      segments
    })
  )

  const cRadius2 = majorRadius - chamferHeight
  const positionedCone = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({
      startRadius: [majorRadius, majorRadius], 
      endRadius: [cRadius2, cRadius2],         
      height: chamferHeight + 0.1,
      segments
    })
  )

  // TBD lots of booleans, so snap might help
  const chamferTool = subtract(positionedCutterBox, positionedCone)

  return subtract(finalThreadedObject, chamferTool)
}
