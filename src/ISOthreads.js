// Dimensions Offsets
const MAJOR_DIAMETER = 0
const COARSE_TPI = 1
const FINE_TPI = 2

/**
 * ISO Metric Threads (ISO 261 / ISO 724)
 *
 * NOTE: All dimensions are in millimeters.
 *
 * "Designation": [Major_Diameter, Coarse_TPI, Fine_TPI]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/iso
 */
export const ISO_THREADS = {
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
 * Get the thread specification for the given size and thread series.
 *
 * NOTE: All dimensions are in millimeters
 *
 * @memberof jscad-fastener/iso
 * @param {Number|String} size - Dimension identifier; 6 or 'M6'
 * @param {String} threadSeries - Thread series of bolt; coarse or fine
 * @return {Object} specification with majorDiameter, pitch, isFine
 */
export const getThreadSpec = (size, threadSeries) => {
  // adjust size if necessary 
  size = size.startsWith("M") ? size : "M" + size

  const isoData = ISO_THREADS[size]
  if (!isoData) {
    throw new Error(`ISO thread size ${size} is unavailable`)
  }

  const isFine = (threadSeries.toUpperCase === 'FINE')
  const pitch = isFine ? isoData[FINE_TPI] : isoData[COARSE_TPI]
  if (!pitch) throw new Error(`ISO thread series ${threadSeries} for ${size} is unavailable`)

  // return the full thread specification
  const standard = 'ISO'
  const majorDiameter = isoData[MAJOR_DIAMETER]

  return {standard, size, threadSeries, majorDiameter, pitch, isFine}
}

