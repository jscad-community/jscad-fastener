/**
 * Create ASME and ISO fasteners for JSCAD designs.
 *
 * @license MIT
 * @author Google Gemini (AI Collaborator) and others
 * @requires @jscad/modeling@^3.0.0
 * @namespace jscad-fastener
 */
export * from './bolt.js'
export * from './nut.js'
export * from './washer.js'

// ASME fasteners
export * as asme from './ASMEindex.js'

// ISO fasteners
export * as iso from './ISOindex.js'

