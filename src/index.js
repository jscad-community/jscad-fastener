import { createMetricThread } from './threads.v3.js'

import { createHexNut } from './nut.v7.js'

//export main

export function main() {
  // Demonstration: Render a standard M10 Coarse Bolt with a 3D-printer friendly 0.15mm tolerance
  // Parameters: d=10, length=25, isInternal=false, isFine=false, tolerance=0.15, segments=48
  //const m10WithTolerance = createMetricThread(10, 25, false, false, 0.15, 48);
  //return m10WithTolerance

  const m10StandardNut = createHexNut({size: 'M10'});
  return m10StandardNut
  
}
