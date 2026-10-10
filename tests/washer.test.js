import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { SpringWasher, StarWasher, Washer } from './src/index.js'

test('SpringWasher', () => {
  let w = SpringWasher(4.3, 9, 0.8, 36)
  expect(geom3.isA(w)).toBe(true)
})

test('StarWasher', () => {
  let w = StarWasher(true, 4.3, 9, 0.8, 36)
  expect(geom3.isA(w)).toBe(true)

  w = StarWasher(false, 4.3, 9, 0.8, 36)
  expect(geom3.isA(w)).toBe(true)
})

test('Washer', () => {
  let w = Washer(4.3, 9, 0.8, 36)
  expect(geom3.isA(w)).toBe(true)
})
