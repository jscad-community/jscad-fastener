import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { getWasherDimensions, generateWasher } from './src/washer.js'

test('getWasherDimensions', () => {
  // errors
  expect(getWasherDimensions()).toStrictEqual(null)
  expect(getWasherDimensions({})).toStrictEqual(null)
  expect(getWasherDimensions({size: "Z", standard: "Z"})).toStrictEqual(null)
  expect(getWasherDimensions({size: "Z", standard: "ISO"})).toStrictEqual(null)

  // ISO dimensions
  expect(getWasherDimensions({size: "M4"})).toStrictEqual(
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
  expect(getWasherDimensions({size: "M14", isHeavy: true})).toStrictEqual(
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
  expect(getWasherDimensions({size: "M14", isWide: true})).toStrictEqual(
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
  expect(getWasherDimensions({size: "M14", isLocking: true})).toStrictEqual(
  {
    "innerDiameter": 14.2,
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": 21.1,
    "size": "M14",
    "standard": "ISO",
    "thickness": 3,
  }
  )
  expect(getWasherDimensions({size: "M14", isLocking: true, isInternal: true})).toStrictEqual(
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
  expect(getWasherDimensions({size: "M14", isLocking: true, isExternal: true})).toStrictEqual(
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

  // ASME dimensions
  expect(getWasherDimensions({size: "#4", standard: 'ASME'})).toStrictEqual(
  {
    "innerDiameter": "3.17",
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": false,
    "isWide": false,
    "outerDiameter": "7.92",
    "size": "#4",
    "standard": "ASME",
    "thickness": "0.81",
  }
  )
  expect(getWasherDimensions({size: "1", standard: 'ASME', isHeavy: true})).toStrictEqual(
  {
    "innerDiameter": "28.57",
    "isExternal": false,
    "isHeavy": true,
    "isInternal": false,
    "isLocking": false,
    "isWide": false,
    "outerDiameter": "50.80",
    "size": "1",
    "standard": "ASME",
    "thickness": "3.45",
  }
  )
  expect(getWasherDimensions({size: "#4", standard: 'ASME', isWide: true})).toStrictEqual(
  {
    "innerDiameter": "3.38",
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": false,
    "isWide": true,
    "outerDiameter": "11.33",
    "size": "#4",
    "standard": "ASME",
    "thickness": "1.02",
  }
  )
  expect(getWasherDimensions({size: "#4", standard: 'ASME', isLocking: true})).toStrictEqual(
  {
    "innerDiameter": "2.90",
    "isExternal": false,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": "5.31",
    "size": "#4",
    "standard": "ASME",
    "thickness": "0.64",
  }
  )
  expect(getWasherDimensions({size: "#4", standard: 'ASME', isLocking: true, isInternal: true})).toStrictEqual(
  {
    "innerDiameter": "2.92",
    "isExternal": false,
    "isHeavy": false,
    "isInternal": true,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": "6.86",
    "size": "#4",
    "standard": "ASME",
    "thickness": "0.48",
  }
  )
  expect(getWasherDimensions({size: "#4", standard: 'ASME', isLocking: true, isExternal: true})).toStrictEqual(
  {
    "innerDiameter": "2.92",
    "isExternal": true,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": "7.16",
    "size": "#4",
    "standard": "ASME",
    "thickness": "0.48",
  }
  )
})

test('generateWasher', () => {
  let w = generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8})
  expect(geom3.isA(w)).toBe(true)

  w = generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isInternal: true})
  expect(geom3.isA(w)).toBe(true)

  w = generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isExternal: true})
  expect(geom3.isA(w)).toBe(true)

  w = generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true})
  expect(geom3.isA(w)).toBe(true)
})
