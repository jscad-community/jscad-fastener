import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { HexNut } from './src/index.js'

test('HexNut', () => {
  // standard hex nut, no washer
  let w = HexNut(19.05, 7.938, 0, 0, 36)
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = HexNut(19.05, 7.938, 0.016, 0, 36)
  expect(geom3.isA(w)).toBe(true)
})
