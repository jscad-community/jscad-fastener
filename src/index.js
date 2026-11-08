/**
 * Create ASME and ISO fasteners for JSCAD designs.
 *
 * This JSCAD project supplies various fasteners for JSCAD designs.
 *
 * The default quality is kept as low as possible to keep generation times to a minimum.
 * The number of segments (default 18) can be increased but beware.
 *
 * Full assemblies can be created from ASME and ISO compound engineering stack descriptions.
 * Or specific ASME/ISO bolts, nuts, and washers can be created from standards or parameters.
 * ASME/ISO fasteners are generally easier to understand and generate.
 *
 * @license MIT
 * @author Google Gemini (AI Collaborator) and others
 * @requires @jscad/modeling@^3.0.0
 * @namespace jscad-fastener
 * @example
 * import {asme} from 'jscad-fastener'
 * import {iso} from 'jscad-fastener'
 * import {HexHead, Shank, HexNut, Thread, SpringWasher, Washer, StarWasher} from 'jscad-fastener'
 */
export * from './bolt.js'
export * from './nut.js'
export * from './washer.js'

// ASME fasteners
export * as asme from './ASMEindex.js'

// ISO fasteners
export * as iso from './ISOindex.js'

