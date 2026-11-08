// Dimensions Offsets
export const MAJOR_DIAMETER = 0
export const COARSE_TPI = 1
export const FINE_TPI = 2

/**
 * UTS (Unified Thread Standard) Dimensions (inches)
 * @see https://www.engineeringtoolbox.com/unified-screw-threads-unc-unf-d_1809.html
 *
 * NOTE: All dimensions are in inches
 * 
 * Array mapping per size: [ majorDiameter, coarseTPI, fineTPI ]
 *
 * Note: Uses `null` where a specific coarse/fine TPI does not officially exist.
 *
 * @constant
 * @type {ThreadDimensions}
 * @memberof jscad-fastener/asme
 */
export const UTS_THREADS = {
  // --- Machine Screw Sizes ---
  '#0':  [ 0.0600, null, 80   ], // #0 TPI is exclusively a UNF designation
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
  '1 1/8': [ 1.1250, 7,    12   ],
  '1 1/4': [ 1.2500, 7,    12   ], // 12 TPI used for fine/constant pitch series
  '1 3/8': [ 1.3750, 6,    12   ],
  '1 1/2': [ 1.5000, 6,    12   ],
  '1 3/4': [ 1.7500, 5,    8    ], // High-load threads swap over to 8 TPI constant pitch limits
  '2':     [ 2.0000, 4.5,  8    ],
  '2 1/4': [ 2.2500, 4.5,  8    ],
  '2 1/2': [ 2.5000, 4,    8    ],
  '2 3/4': [ 2.7500, 4,    8    ],
  '3':     [ 3.0000, 4,    8    ],
  '3 1/4': [ 3.2500, 4,    8    ],
  '3 1/2': [ 3.5000, 4,    8    ],
  '3 3/4': [ 3.7500, 4,    8    ],
}

/**
 * Get the thread specification for the given size and thread series.
 *
 * NOTE: All dimensions are inches
 *
 * @memberof jscad-fastener/asme
 * @param {Number|String} size - size identifier; '#0' or '1/2'
 * @param {String} threadSeries - Thread series of bolt; 'UNC' or 'UNF'
 * @return {Object} specification with standard, size, threadSeries, majorDiameter, pitch, isFine
 */
export const getThreadSpec = (size, threadSeries) => {
  const utsData = UTS_THREADS[size]
  if (!utsData) {
    throw new Error(`UTS thread size [${size}] is unavailable`)
  }

  // Convert Threads Per Inch (TPI) to millimeters
  const isFine = (threadSeries.toUpperCase() === 'UNF')
  const pitch = isFine ? utsData[FINE_TPI] : utsData[COARSE_TPI]
  if (!pitch) throw new Error(`UTS thread series ${threadSeries} for ${size} is unavailable`)

  // return the full thread specification
  const standard = 'UTS'
  const majorDiameter = utsData[MAJOR_DIAMETER]

  return {standard, size, threadSeries, majorDiameter, pitch, isFine}
}

