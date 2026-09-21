import { colors, primitives, booleans, extrusions, transforms } from '@jscad/modeling'

const { colorize } = colors
const { cylinderElliptic, polygon } = primitives
const { intersect, union, subtract } = booleans
const { extrudeHelical } = extrusions
const { translate } = transforms

/**
 * ISO Standard Thread Dimensions (mm)
 * 
 * Each entry contains:
 * - major diameter
 * - minor diameter
 * - coarse thread pitch
 * - fine thread pitch
 * - pitch diameter
 * - tapping drill diameter
 * - clearence hole diameter
 */
export const ISO_THREADS = {
1:   [ 1.0, 0.729, 0.25, 0.20, 0.838, 0.75, 1.3 ],
1.1: [ 1.1, 0.829, 0.25, 0.20, 0.938, 0.85, 1.4 ],
1.2: [ 1.2, 0.929, 0.25, 0.20, 1.038, 0.95, 1.5 ],
1.4: [ 1.4, 1.075, 0.30, 0.20, 1.205, 1.10, 1.8 ],
1.6: [ 1.6, 1.221, 0.35, 0.20, 1.373, 1.25, 2.0 ],
1.8: [ 1.8, 1.421, 0.35, 0.20, 1.573, 1.45, 2.3 ],
2:   [ 2.0, 1.567, 0.40, 0.25, 1.740, 1.60, 2.6 ],
2.2: [ 2.2, 1.713, 0.45, 0.25, 1.908, 1.75, 2.9 ],
2.5: [ 2.5, 2.013, 0.45, 0.35, 2.208, 2.05, 3.1 ],
3:   [ 3.0, 2.459, 0.50, 0.35, 2.675, 2.50, 3.6 ],
3.5: [ 3.5, 2.850, 0.60, 0.35, 3.110, 2.90, 4.2 ],
4:   [ 4.0, 3.242, 0.70, 0.50, 3.545, 3.30, 4.8 ],
4.5: [ 4.5, 3.688, 0.75, 0.50, 4.013, 3.80, 5.3 ],
5:   [ 5.0, 4.134, 0.80, 0.50, 4.480, 4.20, 5.8 ],
6:   [ 6.0, 4.917, 1.00, 0.75, 5.350, 5.00, 7.0 ],
7:   [ 7.0, 5.917, 1.00, 0.75, 6.350, 6.00, 8.0 ],
8:   [ 8.0, 6.647, 1.25, 1.00, 7.188, 6.80, 10.0 ],
9:   [ 9.0, 7.647, 1.25, 1.00, 8.188, 7.80, 11.0 ],
10:  [ 10.0, 8.376, 1.50, 1.25, 9.026, 8.50, 12.0 ],
11:  [ 11.0, 9.376, 1.50, 1.00, 10.026, 9.50, 13.5 ],
12:  [ 12.0, 10.106, 1.75, 1.50, 10.863, 10.20, 15.0 ],
14:  [ 14.0, 11.835, 2.00, 1.50, 12.701, 12.00, 17.0 ],
16:  [ 16.0, 13.835, 2.00, 1.50, 14.701, 14.00, 19.0 ],
18:  [ 18.0, 15.394, 2.50, 2.00, 16.376, 15.50, 22.0 ],
20:  [ 20.0, 17.294, 2.50, 2.00, 18.376, 17.50, 24.0 ],
22:  [ 22.0, 19.294, 2.50, 2.00, 20.376, 19.50, 26.0 ],
24:  [ 24.0, 20.752, 3.00, 2.00, 22.051, 21.00, 28.0 ],
27:  [ 27.0, 23.752, 3.00, 2.00, 25.051, 24.00, 33.0 ],
30:  [ 30.0, 26.211, 3.50, 3.00, 27.727, 26.50, 35.0 ],
33:  [ 33.0, 29.211, 3.50, 3.00, 30.727, 29.50, 38.0 ],
36:  [ 36.0, 31.670, 4.00, 3.00, 33.402, 32.00, 41.0 ],
39:  [ 39.0, 29.211, 3.50, 3.00, 36.402, 35.00, 44.0 ],
42:  [ 42.0, 37.129, 4.50, 4.00, 39.077, 37.50, 47.0 ],
45:  [ 45.0, 40.129, 4.50, 4.00, 42.077, 40.50, 50.0 ],
48:  [ 48.0, 42.857, 5.00, 4.00, 44.752, 43.00, 53.0 ],
52:  [ 52.0, 46.587, 5.00, 4.00, 48.752, 47.00, 57.0 ],
56:  [ 56.0, 50.046, 5.50, 4.00, 52.428, 50.50, 61.0 ],
60:  [ 60.0, 54.046, 5.50, 4.00, 56.428, 54.50, 65.0 ],
64:  [ 64.0, 57.505, 6.00, 4.00, 60.103, 58.00, 69.0 ],
68:  [ 68.0, 61.505, 6.00, 4.00, 64.103, 62.00, 73.0 ],
}
                                        
/**
 * Generates a true spiral Metric Thread Segment with an integrated mechanical tolerance offset
 *
 * @param {number} d - Nominal Major Diameter (mm)
 * @param {number} length - Total length of the thread (mm)
 * @param {boolean} isInternal - False for bolt/external, True for nut/internal
 * @param {boolean} isFine - True to look up Fine pitch, False for Coarse pitch
 * @param {number} tolerance - Radial offset value in mm (e.g., 0.15 for 3D prints, 0.03 for machined 6g/6H)
 * @param {number} segmentsPerTurn - Level of detail (radial steps per turn)
 */
export function createMetricThread(d, length, isInternal = false, isFine = false, tolerance = 0.0, segmentsPerTurn = 32) {
  // 1. Resolve Pitch
  const iso = ISO_THREADS[d] || [d, d, d * 0.15, d * 0.25, d, d * 0.75, d * 1.30]
  const pitch = isFine ? iso[3] : iso[2]
  
  // 2. ISO Thread Profile Calculations (H = 0.866025 * P)
  const H = 0.866025 * pitch
  
  // Apply the physical tolerance offset depending on thread application intent
  // External threads (bolts) step inward (-), Internal threads (nuts) expand outward (+)
  const tOffset = isInternal ? tolerance : -tolerance
  
  const majorRadius = (d / 2) + tOffset
  const minorRadius = (majorRadius - (5/8 * H)) 
  
  // Define chamfer height proportional to pitch (0.75P)
  const chamferHeight = pitch * 0.75
  
  // Add 2 extra turns to ensure full structural coverage before bounding trim
  const totalTurns = (length / pitch) + 2
  const totalAngle = totalTurns * 2 * Math.PI
  
  // 3. Define the 60-degree V-profile 2D cross-section incorporating tolerance shifts

  // Calculate the maximum geometric sagitta error of the faceted cylinder
  const sagitta = minorRadius * (1 - Math.cos(Math.PI / segmentsPerTurn))

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
    segments: segmentsPerTurn
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
      segments: segmentsPerTurn 
    })
  )
  
  const trimmedHelix = intersect(cleanBounds, threadedHelix)
  
  // 7. Assemble the core body
  let finalThreadedObject
  if (!isInternal) {
    // External Bolt Core
    const shiftedCore = translate(
      [0, 0, length / 2],
      cylinderElliptic({ 
        startRadius: [minorRadius, minorRadius], 
        endRadius: [minorRadius, minorRadius], 
        height: length, 
        segments: segmentsPerTurn 
      })
    )
    finalThreadedObject = union(shiftedCore, trimmedHelix)
  } else {
    // Internal Nut Tool Core
    const shiftedOuter = translate(
      [0, 0, length / 2],
      cylinderElliptic({ 
        startRadius: [majorRadius, majorRadius], 
        endRadius: [majorRadius, majorRadius], 
        height: length, 
        segments: segmentsPerTurn 
      })
    )
    finalThreadedObject = union(shiftedOuter, trimmedHelix)
  }

  // 8. Apply the 45-degree top entry chamfer cutting tool
  const positionedCutterBox = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({ 
      startRadius: [majorRadius + 2, majorRadius + 2], 
      endRadius: [majorRadius + 2, majorRadius + 2], 
      height: chamferHeight + 0.1, 
      segments: segmentsPerTurn 
    })
  )
  
  const cRadius2 = majorRadius - chamferHeight
  const positionedCone = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({
      startRadius: [majorRadius, majorRadius], 
      endRadius: [cRadius2, cRadius2],         
      height: chamferHeight + 0.1,
      segments: segmentsPerTurn
    })
  )

  const chamferTool = subtract(positionedCutterBox, positionedCone)
  const chamferedBolt = subtract(finalThreadedObject, chamferTool)

  return chamferedBolt
}

export function main() {
  // Demonstration: Render a standard M Bolt with a 3D-printer friendly 0.15mm tolerance
  // Parameters: d, length, isInternal, isFine, tolerance, segments
  const mThread = createMetricThread(10, 25, false, false, 0.15, 48)
  
  return mThread
}

