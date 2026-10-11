import { cylinderElliptic, polygon, intersect, union, subtract, extrudeHelical, translate } from '@jscad/modeling'

// Dimensions Offsets
export const MAJOR_DIAMETER = 0
export const COARSE_TPI = 1
export const FINE_TPI = 2

/**
 * ISO Metric Threads (ISO 261 / ISO 724)
 *
 * NOTE: All dimensions are in millimeters.
 *
 * "Designation": [Major_Diameter, Coarse_TPI, Fine_TPI]
 */
const ISO_THREADS = {
  "M1":    [1.0,  0.25,  0.2   ],
  "M1.1":  [1.1,  0.25,  0.2   ],
  "M1.2":  [1.2,  0.25,  0.2   ],
  "M1.4":  [1.4,  0.3,   0.2   ],
  "M1.6":  [1.6,  0.35,  0.2   ],
  "M1.8":  [1.8,  0.35,  0.2   ],
  "M2":    [2.0,  0.4,   0.25  ],
  "M2.2":  [2.2,  0.45,  0.25  ],
  "M2.5":  [2.5,  0.45,  0.35  ],
  "M3":    [3.0,  0.5,   0.35  ],
  "M3.5":  [3.5,  0.6,   0.35  ],
  "M4":    [4.0,  0.7,   0.5   ],
  "M4.5":  [4.5,  0.75,  0.5   ],
  "M5":    [5.0,  0.8,   0.5   ],
  "M6":    [6.0,  1.0,   0.75  ],
  "M7":    [7.0,  1.0,   0.75  ],
  "M8":    [8.0,  1.25,  1.0   ],
  "M9":    [9.0,  1.25,  1.0   ],
  "M10":   [10.0, 1.5,   1.25  ], // 1.0 also exist, 1.25 is primary fine
  "M11":   [11.0, 1.5,   1.0   ],
  "M12":   [12.0, 1.75,  1.25  ], // 1.5 also exist, 1.25 is primary fine
  "M14":   [14.0, 2.0,   1.5   ],
  "M16":   [16.0, 2.0,   1.5   ],
  "M18":   [18.0, 2.5,   1.5   ],
  "M20":   [20.0, 2.5,   1.5   ],
  "M22":   [22.0, 2.5,   1.5   ],
  "M24":   [24.0, 3.0,   2.0   ],
  "M27":   [27.0, 3.0,   2.0   ],
  "M30":   [30.0, 3.5,   2.0   ],
  "M33":   [33.0, 3.5,   2.0   ],
  "M36":   [36.0, 4.0,   3.0   ], // 2.0 and 1.5 also exist
  "M39":   [39.0, 4.0,   3.0   ],
  "M42":   [42.0, 4.5,   3.0   ],
  "M45":   [45.0, 4.5,   3.0   ],
  "M48":   [48.0, 5.0,   3.0   ],
  "M52":   [52.0, 5.0,   4.0   ],
  "M56":   [56.0, 5.5,   4.0   ],
  "M60":   [60.0, 5.5,   4.0   ],
  "M64":   [64.0, 6.0,   4.0   ],
  "M68":   [68.0, 6.0,   4.0   ]
}

/**
 * UTS (Unified Thread Standard) Dimensions (inches)
 * @see https://www.engineeringtoolbox.com/unified-screw-threads-unc-unf-d_1809.html
 *
 * NOTE: All dimensions are in inches
 * 
 * Array mapping per size: [ majorDiameter, coarseTPI, fineTPI ]
 *
 * Note: Uses `null` where a specific coarse/fine TPI does not officially exist.
 */
export const UTS_THREADS = {
  // --- Machine Screw Sizes ---
  '#0':  [ 0.0600, null, 80   ], // 80 TPI is exclusively a UNF designation
  '#1':  [ 0.0730, 64,   72   ],
  '#2':  [ 0.0860, 56,   64   ],
  '#3':  [ 0.0990, 48,   56   ],
  '#4':  [ 0.1120, 40,   48   ],
  '#5':  [ 0.1250, 40,   44   ],
  '#6':  [ 0.1380, 32,   40   ],
  '#8':  [ 0.1640, 32,   36   ],
  '#10': [ 0.1900, 24,   32   ],
  '#12': [ 0.2160, 24,   28   ],
  // --- Fractional Sizes (Up to 1 Inch) ---
  '1/4':   [ 0.2500, 20,   28   ],
  '5/16':  [ 0.3125, 18,   24   ],
  '3/8':   [ 0.3750, 16,   24   ],
  '7/16':  [ 0.4375, 14,   20   ],
  '1/2':   [ 0.5000, 13,   20   ],
  '9/16':  [ 0.5625, 12,   18   ],
  '5/8':   [ 0.6250, 11,   18   ],
  '3/4':   [ 0.7500, 10,   16   ],
  '7/8':   [ 0.8750, 9,    14   ],
  '1':     [ 1.0000, 8,    12   ],
  // --- Heavy Industrial / Fractional Sizes (1-1/8" to 4") ---
  // Large diameters typically shift to 8UN series instead of UNF for fine settings
  '1-1/8': [ 1.1250, 7,    12   ],
  '1-1/4': [ 1.2500, 7,    12   ], // 12 TPI used for fine/constant pitch series
  '1-3/8': [ 1.3750, 6,    12   ],
  '1-1/2': [ 1.5000, 6,    12   ],
  '1-3/4': [ 1.7500, 5,    8    ], // High-load threads swap over to 8 TPI constant pitch limits
  '2':     [ 2.0000, 4.5,  8    ],
  '2-1/4': [ 2.2500, 4.5,  8    ],
  '2-1/2': [ 2.5000, 4,    8    ],
  '2-3/4': [ 2.7500, 4,    8    ],
  '3':     [ 3.0000, 4,    8    ],
  '3-1/4': [ 3.2500, 4,    8    ],
  '3-1/2': [ 3.5000, 4,    8    ],
  '3-3/4': [ 3.7500, 4,    8    ],
}

/**
 * Get the thread specification for the given standard, size, and thread series.
 *
 * @param {String} standard - 'ISO' (mm) or 'UTS' (inch)
 * @param {Number|String} size - Dimension identifier; 6 or 'M6', #0 or '1/2'
 * @param {String} threadSeries - Thread series of bolt; coarse or fine, UNC or UNF
 * @return {Object} specification with majorDiameter, pitch, isFine
 */
export const getThreadSpec = (standard, size, threadSeries) => {
  let majorDiameter = 0
  let pitch = 0
  let isFine = false

  if (standard.toUpperCase() === 'UTS') {
    // UTS Imperial Standard
    const utsData = UTS_THREADS[size]
    if (!utsData) {
      throw new Error(`UTS size "${size}" is not available in the current tables`)
    }

    isFine = (threadSeries.toUpperCase() === 'UNF')

    // Convert major diameter to millimeters
    majorDiameter = utsData[MAJOR_DIAMETER]

    // Convert Threads Per Inch (TPI) to millimeters
    const tpi = isFine ? utsData[FINE_TPI] : utsData[COARSE_TPI]
    if (!tpi) throw new Error(`Thread spec is unavailable for UTS ${size}, ${threadSeries}`)

    pitch = tpi
  } else if (standard.toUpperCase() === 'ISO') {
    // ISO Metric Standard
    size = size.startsWith("M") ? size : "M" + size

    const isoData = ISO_THREADS[size]
    if (!isoData) {
      throw new Error(`ISO size "${size}" is not available in the current tables`)
    }

    isFine = (threadSeries.toUpperCase === 'FINE')
    majorDiameter = isoData[MAJOR_DIAMETER]
    pitch = isFine ? isoData[FINE_TPI] : isoData[COARSE_TPI]
    if (!pitch) throw new Error(`Thread spec is unavailable for ISO ${size}, ${threadSeries}`)
  } else {
    throw new Error(`Standard "${standard}" is not available, use UTS or ISO`)
  }

  // return the full thread specification
  return {standard, size, threadSeries, majorDiameter, pitch, isFine}
}

/**
 * Create a thread segment supporting ISO and UTS thread standards.
 *
 * NOTE: All dimensions are in millimeters.
 *
 * @param {Object} spec - Generation configurations
 * @param {Boolean} spec.isInternal - False for bolt/external, True for nut/internal
 * @param {Number} spec.majorDiameter - Major diameter of thread body
 * @param {Number} spec.pitch - Pitch of threads
 * @param {Number} spec.tolerance - Radial offset value in mm (e.g. 0.15 for 3D prints)
 * @param {Number} spec.segments - Segments per full rotation
 * @param {Number} length - Total length of the thread to generate
 * @returns {Geom3} thread body, extending up from Z
 */
export const generateThread = (spec = {}, length) => {
  const {
    isInternal = false,
    majorDiameter = 0,
    pitch = 0,
    tolerance = 0.0,
    segments = 36
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
