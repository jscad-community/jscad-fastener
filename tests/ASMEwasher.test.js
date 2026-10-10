import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { asme } from './src/index.js'

test('asme.getWasherDimensions', () => {
  // errors
  expect(asme.getWasherDimensions()).toStrictEqual(null)
  expect(asme.getWasherDimensions({})).toStrictEqual(null)
  expect(asme.getWasherDimensions({size: "Z", standard: "Z"})).toStrictEqual(null)
  expect(asme.getWasherDimensions({size: "Z", standard: "ISO"})).toStrictEqual(null)

  // ASME dimensions
  expect(asme.getWasherDimensions({size: "#4"})).toStrictEqual(
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
  expect(asme.getWasherDimensions({size: "1", isHeavy: true})).toStrictEqual(
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
  expect(asme.getWasherDimensions({size: "#4", isWide: true})).toStrictEqual(
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
  expect(asme.getWasherDimensions({size: "#4", isLocking: true})).toStrictEqual(
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
  expect(asme.getWasherDimensions({size: "#4", isLocking: true, isInternal: true})).toStrictEqual(
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
  expect(asme.getWasherDimensions({size: "#4", standard: 'ASME_18', isLocking: true, isExternal: true})).toStrictEqual(
  {
    "innerDiameter": "2.92",
    "isExternal": true,
    "isHeavy": false,
    "isInternal": false,
    "isLocking": true,
    "isWide": false,
    "outerDiameter": "7.16",
    "size": "#4",
    "standard": "ASME_18",
    "thickness": "0.48",
  }
  )
})

test('asme.generateWasher', () => {
  let w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8})
  expect(geom3.isA(w)).toBe(true)

  w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isInternal: true})
  expect(geom3.isA(w)).toBe(true)

  w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isExternal: true})
  expect(geom3.isA(w)).toBe(true)

  w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true})
  expect(geom3.isA(w)).toBe(true)
})
