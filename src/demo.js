import { parseAssembly, generateAssembly } from './ASMEassembly.js'
import { getBoltDimensions, generateHexBolt } from './ASMEbolt.js'
import { getNutDimensions, generateNut } from './ASMEnut.js'
import { getWasherDimensions, generateWasher } from './ASMEwasher.js'

/*
import { parseAssembly, generateAssembly } from './ISOassembly.js'
import { getHexBoltDimensions, generateHexBolt } from './ISObolt.js'
import { getNutDimensions, generateNut } from './ISOnut.js'
import { getWasherDimensions, generateWasher } from './ISOwasher.js'
*/

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

/*
  const specs = parseAssembly("M12 x 1.25 x 50 Bolt, Washer, Nut")
  const parts = generateAssembly(specs)
  return parts

  const washspec = getWasherDimensions({size: 'M22', type: 'HEAVY'})
  const washer = generateWasher(washspec)
  return washer

  const nutspec = getNutDimensions({size: 'M10', type: 'heavy'})
  const nut = generateNut(nutspec)
  return nut

  const boltspec = getHexBoltDimensions({size: 'M6'}, 20.0)
  const bolt = generateHexBolt(boltspec)
  return bolt
*/

  const specs = parseAssembly("5/16-24 x 1-1/2 Hex Bolt + B18.22.1 Washer + Hex Nut")
  const parts = generateAssembly(specs)
  return parts

  // const washspec = getWasherDimensions({size: '#8', type: 'WIDE', isLocking: true})
  // const washer = generateWasher(washspec)
  // return washer

  // const nutspec = getNutDimensions({size: '1/2', type: 'JAM'})
  // const nut = generateNut(nutspec)
  // return nut

  // const boltspec = getBoltDimensions({size: '1/2', type: 'HEAVY'}, 2)
  // const bolt = generateHexBolt(boltspec)
  // return bolt

}
