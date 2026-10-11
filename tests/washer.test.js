import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { SpringWasher, StarWasher, Washer } from './src/index.js'

test('SpringWasher', () => {
  let spec = { innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, segments: 36 }
  let w = SpringWasher(spec)
  expect(geom3.isA(w)).toBe(true)
})

test('StarWasher', () => {
  let spec = { isInternal: true, innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, segments: 36 }
  let w = StarWasher(spec)
  expect(geom3.isA(w)).toBe(true)

  spec = { isInternal: false, innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, segments: 36 }
  w = StarWasher(spec)
  expect(geom3.isA(w)).toBe(true)
})

test('Washer', () => {
  let spec = { innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, segments: 36 }
  let w = Washer(spec)
  expect(geom3.isA(w)).toBe(true)
})
