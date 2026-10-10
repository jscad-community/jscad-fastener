import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { asme } from './src/index.js'

test('asme.getNutDimensions', () => {
  // errors
  expect(asme.getNutDimensions()).toStrictEqual(null)
  expect(asme.getNutDimensions({})).toStrictEqual(null)
  expect(asme.getNutDimensions({size: "Z"})).toStrictEqual(null)
  expect(asme.getNutDimensions({size: "Z"})).toStrictEqual(null)

  // ASME dimensions
  expect(asme.getNutDimensions({size: "1/2"})).toStrictEqual(
  {
    "height": 11.112,
    "isHeavy": false,
    "isThin": false,
    "size": "1/2",
    "standard": "ASME",
    "bearingFaceHeight": 0.016,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", isHeavy: true})).toStrictEqual(
  {
    "height": 12.304,
    "isHeavy": true,
    "isThin": false,
    "size": "1/2",
    "standard": "ASME",
    "bearingFaceHeight": 0.016,
    "widthAcrossFlats": 22.225,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", isThin: true})).toStrictEqual(
  {
    "height": 7.938,
    "isHeavy": false,
    "isThin": true,
    "size": "1/2",
    "standard": "ASME",
    "bearingFaceHeight": 0.016,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", isThin: true, isHeavy: true})).toStrictEqual(
  {
    "height": 7.938,
    "isHeavy": true,
    "isThin": true,
    "size": "1/2",
    "standard": "ASME",
    "bearingFaceHeight": 0.016,
    "widthAcrossFlats": 22.225,
  }
  )
  expect(asme.getNutDimensions({size: "#4"})).toStrictEqual(
  {
    "height": 2.383,
    "isHeavy": false,
    "isThin": false,
    "size": "#4",
    "standard": "ASME",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 6.35,
  }
  )
})

test('asme.generateNut', () => {
  // standard hex nut, no washer
  let w = asme.generateNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0})
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = asme.generateNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0.016})
  expect(geom3.isA(w)).toBe(true)
})
