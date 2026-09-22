import { primitives, booleans, extrusions, transforms } from '@jscad/modeling'

const { cylinderElliptic, polygon } = primitives
const { intersect, union, subtract } = booleans
const { extrudeHelical } = extrusions
const { translate } = transforms

// Dimensions Offsets
export const MAJOR_DIAMETER = 0
export const COARSE_TPI = 1
export const FINE_TPI = 1

/**
 * Master Registry for ISO Metric Threads (ISO 261 / ISO 724)
 * Schema Format: "Designation": [Major_Diameter_mm, Coarse_Pitch_mm, Primary_Fine_Pitch_mm]
 * Note: If an ultra-small profile size has no official standard Fine series definition, it maps to null.
 */
const ISO_THREAD_REGISTRY = {
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

const INCH_TO_MM = 25.4

/**
 * Generates a true spiral thread segment supporting ISO and UTS standards.
 *
 * @param {string|number} size - Dimension identifier (e.g., 6 or '6' for M6 ISO, or '#10', '1/4' for UTS)
 * @param {number} length - Total length of the thread (mm)
 * @param {object} options - Generation configurations
 * @param {string} options.standard - 'ISO' or 'UTS' (defaults to 'ISO')
 * @param {boolean} options.isInternal - False for bolt/external, True for nut/internal
 * @param {boolean} options.isFine - True to look up Fine pitch (UNF/Metric Fine), False for Coarse pitch (UNC/Metric Coarse)
 * @param {number} options.tolerance - Radial offset value in mm (e.g. 0.15 for 3D prints)
 * @param {number} options.segments - Segments per full rotation
 */
export function createThread(size, length, options = {}) {
  const {
    standard = 'ISO',
    isInternal = false,
    isFine = false,
    tolerance = 0.0,
    segments = 32
  } = options

  let majorDiameterMm = 0
  let pitchMm = 0

  // 1. Resolve Geometric parameters depending on the targeted standard
  if (standard.toUpperCase() === 'UTS') {
    const utsData = UTS_THREADS[size]
    if (!utsData) {
      throw new Error(`UTS size "${size}" is not supported in dictionary lookups.`)
    }
    
    // Convert nominal inch diameter to mm
    majorDiameterMm = utsData[0] * INCH_TO_MM
    
    // Convert Threads Per Inch (TPI) to metric Pitch value
    const tpi = isFine ? utsData[2] : utsData[1]
    if (tpi === Infinity) throw new Error(`Fine thread configuration not available for UTS size ${size}`)
    pitchMm = INCH_TO_MM / tpi

  } else {
    // Default: ISO Metric Standard
    const numericKey = typeof size === 'string' ? parseFloat(size) : size
    const isoData = ISO_THREADS[numericKey]
    
    if (isoData) {
      majorDiameterMm = isoData[0]
      pitchMm = isFine ? isoData[3] : isoData[2]
    } else {
      // Fallback fallback algorithm calculation if entry is missing
      majorDiameterMm = numericKey
      pitchMm = isFine ? numericKey * 0.10 : numericKey * 0.15
    }
  }

  // 2. ISO / UTS Unified Thread Profile Calculations (Both use identical 60-deg H = 0.866025 * P)
  const H = 0.866025 * pitchMm
  const tOffset = isInternal ? tolerance : -tolerance
  
  const majorRadius = (majorDiameterMm / 2) + tOffset
  const minorRadius = majorRadius - (5/8 * H) 
  
  const chamferHeight = pitchMm * 0.75
  const totalTurns = (length / pitchMm) + 2
  const totalAngle = totalTurns * 2 * Math.PI
  
  // 3. Define 60-degree V-profile 2D cross-section
  const sagitta = minorRadius * (1 - Math.cos(Math.PI / segments))
  const profileMinorRadius = minorRadius - sagitta

  const profilePoints = [
    [profileMinorRadius, 0],
    [majorRadius, pitchMm * 0.375], 
    [majorRadius, pitchMm * 0.625],
    [profileMinorRadius, pitchMm]
  ]
  
  const ridge2D = polygon({ points: profilePoints })
  
  // 4. Extrude using true helical calculation
  let threadedHelix = extrudeHelical({
    angle: totalAngle,
    pitch: pitchMm,
    endAngle: totalAngle,
    segments: segments
  }, ridge2D)

  // 5. Shift the thread up to correct the baseline start phase
  threadedHelix = translate([0, 0, pitchMm], threadedHelix)

  // 6. Precise bounding volume to trim uneven helical endings perfectly to [0, length]
  const cleanBounds = translate(
    [0, 0, length / 2],
    cylinderElliptic({ 
      startRadius: [majorRadius + 1, majorRadius + 1], 
      endRadius: [majorRadius + 1, majorRadius + 1], 
      height: length, 
      segments: segments
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
        segments: segments
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
        segments: segments
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
      segments: segments
    })
  )
  
  const cRadius2 = majorRadius - chamferHeight
  const positionedCone = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({
      startRadius: [majorRadius, majorRadius], 
      endRadius: [cRadius2, cRadius2],         
      height: chamferHeight + 0.1,
      segments: segments
    })
  )

  const chamferTool = subtract(positionedCutterBox, positionedCone)
  return subtract(finalThreadedObject, chamferTool)
}

