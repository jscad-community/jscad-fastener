import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { iso } from './src/index.js'

test('iso.getWasherDimensions', () => {
  // errors
  expect(iso.getWasherDimensions()).toStrictEqual(null)
  expect(iso.getWasherDimensions({})).toStrictEqual(null)
  expect(iso.getWasherDimensions({size: "Z", standard: "Z"})).toStrictEqual(null)
  expect(iso.getWasherDimensions({size: "Z", standard: "ISO"})).toStrictEqual(null)

  // ISO dimensions
  expect(iso.getWasherDimensions({size: "M4"})).toStrictEqual(
  {
    "innerDiameter": 4.3,
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": false,
    "isWide": false,
    "outerDiameter": 9,
    "size": "M4",
    "standard": "ISO",
    "thickness": 0.8,
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isHeavy: true})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isExternal": false,
    "isHeavy": true,
    "isInternal": false,
    "isLocking": false,
    "isWide": false,
    "outerDiameter": 28,
    "size": "M14",
    "standard": "ISO",
    "thickness": 3,
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isWide: true})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": false,
    "isWide": true,
    "outerDiameter": 44,
    "size": "M14",
    "standard": "ISO",
    "thickness": 3,
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isLocking: true})).toStrictEqual(
  {
    "innerDiameter": 14.2,
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": 24.1,
    "size": "M14",
    "standard": "ISO",
    "thickness": 3,
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isLocking: true, isInternal: true})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isExternal": false,
    "isHeavy": false,
    "isInternal": true,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": 24,
    "size": "M14",
    "standard": "ISO",
    "thickness": 1,
  }
  )
  expect(iso.getWasherDimensions({size: "M14", isLocking: true, isExternal: true})).toStrictEqual(
  {
    "innerDiameter": 15,
    "isExternal": true,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": 24,
    "size": "M14",
    "standard": "ISO",
    "thickness": 1,
  }
  )
})

test('iso.generateWasher', () => {
  let w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8})
  expect(geom3.isA(w)).toBe(true)

  w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isInternal: true})
  expect(geom3.isA(w)).toBe(true)

  w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isExternal: true})
  expect(geom3.isA(w)).toBe(true)

  w = iso.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true})
  expect(geom3.isA(w)).toBe(true)
})
