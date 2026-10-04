import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { getHexNutDimensions, generateHexNut } from './src/nut.v7.js'

test('getHexNutDimensions', () => {
  // errors
  expect(getHexNutDimensions()).toStrictEqual(null)
  expect(getHexNutDimensions({})).toStrictEqual(null)
  expect(getHexNutDimensions({size: "Z", standard: "Z"})).toStrictEqual(null)
  expect(getHexNutDimensions({size: "Z", standard: "ISO"})).toStrictEqual(null)

  // ISO dimensions
  expect(getHexNutDimensions({size: "M4"})).toStrictEqual(
  {
    "height": 3.2,
    "isHeavy": false,
    "isThin": false,
    "size": "M4",
    "standard": "ISO",
    "washerFaceHeight": 0,
    "widthAcrossFlats": 7,
  }
  )
  expect(getHexNutDimensions({size: "M10"})).toStrictEqual(
  {
    "height": 8.4,
    "isHeavy": false,
    "isThin": false,
    "size": "M10",
    "standard": "ISO",
    "washerFaceHeight": 0.4,
    "widthAcrossFlats": 16,
  }
  )
  expect(getHexNutDimensions({size: "M10", isHeavy: true})).toStrictEqual(
  {
    "height": 9.3,
    "isHeavy": true,
    "isThin": false,
    "size": "M10",
    "standard": "ISO",
    "washerFaceHeight": 0.4,
    "widthAcrossFlats": 16,
  }
  )
  expect(getHexNutDimensions({size: "M10", isThin: true})).toStrictEqual(
  {
    "height": 5,
    "isHeavy": false,
    "isThin": true,
    "size": "M10",
    "standard": "ISO",
    "washerFaceHeight": 0.4,
    "widthAcrossFlats": 16,
  }
  )

  // ASME dimensions
  expect(getHexNutDimensions({size: "1/2", standard: 'ASME'})).toStrictEqual(
  {
    "height": 11.112,
    "isHeavy": false,
    "isThin": false,
    "size": "1/2",
    "standard": "ASME",
    "washerFaceHeight": 0.016,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(getHexNutDimensions({size: "1/2", standard: 'ASME', isHeavy: true})).toStrictEqual(
  {
    "height": 12.304,
    "isHeavy": true,
    "isThin": false,
    "size": "1/2",
    "standard": "ASME",
    "washerFaceHeight": 0.016,
    "widthAcrossFlats": 22.225,
  }
  )
  expect(getHexNutDimensions({size: "1/2", standard: 'ASME', isThin: true})).toStrictEqual(
  {
    "height": 7.938,
    "isHeavy": false,
    "isThin": true,
    "size": "1/2",
    "standard": "ASME",
    "washerFaceHeight": 0.016,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(getHexNutDimensions({size: "1/2", standard: 'ASME', isThin: true, isHeavy: true})).toStrictEqual(
  {
    "height": 7.938,
    "isHeavy": true,
    "isThin": true,
    "size": "1/2",
    "standard": "ASME",
    "washerFaceHeight": 0.016,
    "widthAcrossFlats": 22.225,
  }
  )
  expect(getHexNutDimensions({size: "#4", standard: 'ASME'})).toStrictEqual(
  {
    "height": 2.383,
    "isHeavy": false,
    "isThin": false,
    "size": "#4",
    "standard": "ASME",
    "washerFaceHeight": 0,
    "widthAcrossFlats": 6.35,
  }
  )
})

test('generateHexNut', () => {
  // standard hex nut, no washer
  let w = generateHexNut({widthAcrossFlats: 19.05, height: 7.938, washerFaceHeight: 0})
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = generateHexNut({widthAcrossFlats: 19.05, height: 7.938, washerFaceHeight: 0.016})
  expect(geom3.isA(w)).toBe(true)
})
