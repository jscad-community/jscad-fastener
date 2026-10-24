/**
 * Create ASME and ISO fasteners for JSCAD designs.
 *
 * @license MIT
 * @author Google Gemini (AI Collaborator) and others
 * @requires @jscad/modeling@^3.0.0
 * @namespace jscad-fastener
 * @example
 * import {asme} from 'jscad-fastener'
 * import {iso} from 'jscad-fastener'
 * import {HexHead, Shank, HexNut, Thread, SpringWasker, Washer, StarWasher} from 'jscad-fastener'
 */
export * from './bolt.js'
export * from './nut.js'
export * from './washer.js'

// ASME fasteners
export * as asme from './ASMEindex.js'

// ISO fasteners
export * as iso from './ISOindex.js'

