import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { HexHead, Shank } from './src/index.js'

test('HexHead', () => {
  // standard hex nut, no washer
  let hh = HexHead({widthAcrossFlats: 19.05, headHeight: 7.938, bearingFaceDiameter: 0.12, filletRadius: 0.2, majorDiameter: 36})
  expect(geom3.isA(hh)).toBe(true)
})

test('Shank', () => {
  const spec = {threadLength: 10, unthreadedLength: 10, majorDiameter: 7.0, pitch: 1.0, segments: 18 }
  let s = Shank(spec)
  expect(geom3.isA(s)).toBe(true)
})

