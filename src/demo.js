import { parseAssembly, generateAssembly } from './ISOassembly.js'
import { getHexBoltDimensions, generateHexBolt } from './ISObolt.js'
import { getNutDimensions, generateNut } from './ISOnut.js'
import { getWasherDimensions, generateWasher } from './ISOwasher.js'

/*
import { parseAssembly, generateAssembly } from './ASMEassembly.js'
import { getBoltDimensions, generateHexBolt } from './ASMEbolt.js'
import { getNutDimensions, generateNut } from './ASMEnut.js'
import { getWasherDimensions, generateWasher } from './ASMEwasher.js'
*/


//import { Thread } from './threads.js'

export const main = () => {
/*
  const thread = Thread({
    majorDiameter: 6.0,
    pitch: 1.0,
    tolerance: 0,
    isInternal: false,
    bevelStart: true,
    bevelEnd: true,
    segments: 36
  }, 5.0)
  return thread
*/


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

  const specs = parseAssembly("M12 x 1.25 x 50 Bolt, Washer, Nut")
  const parts = generateAssembly(specs)
  return parts

  //const washspec = getWasherDimensions({size: 'M22', type: 'HEAVY'})
  //const washer = generateWasher(washspec)
  //return washer

  //const nutspec = getNutDimensions({size: 'M10', type: 'heavy'})
  //const nut = generateNut(nutspec)
  //return nut

  //const boltspec = getHexBoltDimensions({size: 'M6'}, 20.0)
  //const bolt = generateHexBolt(boltspec)
  //return bolt

  // const specs = parseAssembly("5/16-24 x 1-1/2 Hex Bolt + B18.22.1 Washer + Hex Nut")
  // const parts = generateAssembly(specs)
  // return parts

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
