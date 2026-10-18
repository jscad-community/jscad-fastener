import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { iso } from './src/index.js'

test('iso.getWasherDimensions', () => {
  // errors
  expect(iso.getWasherDimensions({})).toStrictEqual(null)
  expect(iso.getWasherDimensions({size: "Z", standard: "Z"})).toStrictEqual(null)
  expect(iso.getWasherDimensions({size: "Z", standard: "ISO"})).toStrictEqual(null)

  // ISO dimensions
  expect(iso.getWasherDimensions({size: "M4"})).toStrictEqual(
  {
    "innerDiameter": 4.3,
    "isLocking": false,
    "outerDiameter": 9,
    "size": "M4",
    "standard": "ISO_7090",
    "thickness": 0.8,
    "type": "REGULAR",
  }
  )
  expect(iso.getWasherDimensions({size: "M14", type: 'HEAVY'})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isLocking": false,
    "outerDiameter": 44,
    "size": "M14",
    "standard": "ISO_7093",
    "thickness": 3,
    "type": "HEAVY",
  }
  )
  expect(iso.getWasherDimensions({size: "M14", type: 'wide'})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isLocking": false,
    "outerDiameter": 44,
    "size": "M14",
    "standard": "ISO_7093",
    "thickness": 3,
    "type": "WIDE",
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isLocking: true})).toStrictEqual(
  {
    "innerDiameter": 14.2,
    "isLocking": true,
    "outerDiameter": 24.1,
    "size": "M14",
    "standard": "DIN_127_B",
    "thickness": 3,
    "type": "REGULAR",
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isLocking: true, type: 'internal'})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isLocking": true,
    "outerDiameter": 24,
    "size": "M14",
    "standard": "DIN_6797_J",
    "thickness": 1,
    "type": "INTERNAL",
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isLocking: true, type: 'EXTERNAL'})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isLocking": true,
    "outerDiameter": 24,
    "size": "M14",
    "standard": "DIN_6797_A",
    "thickness": 1,
    "type": "EXTERNAL",
  }
  )

  // from aa
  let spec = { size: 'M16', standard: 'ISO_7090', hardnessHV: 200, material: 'Carbon Steel', coating: 'Bare Metal' }
  expect(iso.getWasherDimensions(spec)).toStrictEqual(
  {
    "innerDiameter": 17,
    "isLocking": false,
    "outerDiameter": 30,
    "size": "M16",
    "standard": "ISO_7090",
    "thickness": 3,
    "type": "REGULAR",
  }
  )
})

test('iso.generateWasher', () => {
  let w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8})
  expect(geom3.isA(w)).toBe(true)

  w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true, type: 'INTERNAL'})
  expect(geom3.isA(w)).toBe(true)

  w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true, type: 'EXTERNAL'})
  expect(geom3.isA(w)).toBe(true)

  w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true})
  expect(geom3.isA(w)).toBe(true)

  let dims = {
    "innerDiameter": 17,
    "isLocking": false,
    "outerDiameter": 30,
    "size": "M16",
    "standard": "ISO_7090",
    "thickness": 3,
    "type": "REGULAR",
  }
  w = iso.generateWasher(dims)
  expect(geom3.isA(w)).toBe(true)
})
