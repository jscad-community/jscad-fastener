import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { HexNut } from './src/index.js'

test('HexNut', () => {
  // standard hex nut, no washer
  let w = HexNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0, zOffset: 0, segments: 36})
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = HexNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0.016, zOffset: 0, segments: 36})
  expect(geom3.isA(w)).toBe(true)
})
