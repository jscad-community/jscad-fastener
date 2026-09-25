import { createThread } from './threads.v3.js'

import { createHexNut } from './nut.v7.js'

import { generateISOBolt } from './ISObolt.v5.js'

import { generateUTSBolt } from './UTSbolt.v2.js'

//export main

export function main() {
  // Demonstration: Render a standard M10 Coarse Bolt with a 3D-printer friendly 0.15mm tolerance
  // Parameters: d=10, length=25, isInternal=false, isFine=false, tolerance=0.15, segments=48
  let thread = null
  //thread = createThread({}, 'M10', 20);
  //thread = createThread({standard: 'UTS'}, '1/2', 20);
  //return thread

  //const m10StandardNut = createHexNut({size: 'M10'});
  //return m10StandardNut

/*
  const bolt = generateISOBolt({
    size: 'M6',
    threadSeries: 'Coarse', // String: "Coarse" or "Fine"
    standard: 'ISO 4017',   // full thread
    standard: 'ISO 4014',   // partial thread
  }, 20)
*/

  const bolt = generateUTSBolt({
    size: '1/2',
    threadSeries: 'UNC', // String: "UNC" or "UNF"
    standard: 'ASME_B18_2_1_TAP_BOLT',   // full thread
    //standard: 'ASME_B18_2_1_HEX_BOLT',   // partial thread
  }, 2)

  return bolt
  
}
