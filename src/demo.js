import { getThreadSpec, generateThread } from './threads.v3.js'
import { getHexNutDimensions, generateHexNut } from './nut.v7.js'
import { getWasherDimensions, generateWasher } from './washer.v1.js'

import { generateISOBolt } from './ISObolt.v5.js'

import { generateASMEBolt } from './ASMEbolt.js'

export const main = () => {
  // Demonstration: Render a standard M10 Coarse Bolt with a 3D-printer friendly 0.15mm tolerance
  // Parameters: d=10, length=25, isInternal=false, isFine=false, tolerance=0.15, segments=48
  //let spec = getThreadSpec('ISO', 'M4', 'coarse')
  //let spec = getThreadSpec('UTS', '#10', 'UNF')
  //let thread = generateThread(spec, 20)
  //return thread

  //let spec = getHexNutDimensions({size: 'M4'})
  //let spec = getHexNutDimensions({size: 'M10'}) // washer
  //let nut = generateHexNut(spec)
  //return nut
  //const nut = generateHexNut({standard: 'ASME', size: '#10'});
  //return nut

  const bolt = generateISOBolt({
    size: 'M6',
    threadSeries: 'Coarse', // String: "Coarse" or "Fine"
    //standard: 'ISO 4017',   // full thread
    standard: 'ISO 4014',   // partial thread
  }, 20)
  return bolt

/*
  const bolt = generateASMEBolt({
    size: '1/2',
    threadSeries: 'UNC', // String: "UNC" or "UNF"
    standard: 'ASME_B18_2_1_TAP_BOLT',   // full thread
    //standard: 'ASME_B18_2_1_HEX_BOLT',   // partial thread
  }, 2)
  return bolt
*/
}
