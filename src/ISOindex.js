/**
 * ISO Fasteners
 * - ISO compound engineering stack description parsing and assembly generation
 * - ISO bolts with coarse or fine threads
 * - ISO nuts
 * - ISO washers
 *
 * @namespace jscad-fastener/iso
 * @example
 * import {iso} from 'jscad-fastener'
 *
 * const specs = iso.parseAssembly("Hexagon head bolt ISO 4014 - M12 x 80 - 8.8, with Plain washer ISO 7090, Hex nut ISO 4032")
 * const parts = iso.generateAssembly(specs)
 */ 
export * from './ISOassembly.js'
export * from './ISOspecification.js'
export * from './ISObolt.js'
export * from './ISOnut.js'
export * from './ISOthreads.js'
export * from './ISOWasher.js'
