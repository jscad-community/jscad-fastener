import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { asme } from './src/index.js'

test('asme.getNutDimensions', () => {
  // errors
  expect(asme.getNutDimensions({})).toStrictEqual(null)
  expect(asme.getNutDimensions({size: "Z"})).toStrictEqual(null)
  expect(asme.getNutDimensions({size: "Z"})).toStrictEqual(null)

  // ASME dimensions
  expect(asme.getNutDimensions({size: "1/2"})).toStrictEqual(
  {
    "height": 11.112,
    "size": "1/2",
    "standard": "ASME_B18_2_2_NORMAL",
    "type": "STANDARD",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(asme.getNutDimensions({size: "7/8", type: 'HEAVY'})).toStrictEqual(
  {
    "height": 21.829,
    "size": "7/8",
    "standard": "ASME_B18_2_2_HEAVY",
    "type": "HEAVY",
    "bearingFaceHeight": 0.00063,
    "widthAcrossFlats": 36.512,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", type: 'thin'})).toStrictEqual(
  {
    "height": 7.938,
    "size": "1/2",
    "standard": "ASME_B18_2_2_JAM",
    "type": "THIN",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", type: 'JAM'})).toStrictEqual(
  {
    "height": 7.938,
    "size": "1/2",
    "standard": "ASME_B18_2_2_JAM",
    "type": "JAM",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 19.05,
  }
  )
  expect(asme.getNutDimensions({size: "1-1/4", type: 'structural'})).toStrictEqual(
  {
    "bearingFaceHeight": 0.015,
    "height": 19.842,
    "size": "1-1/4",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "type": "STRUCTURAL",
    "widthAcrossFlats": 50.8,
  }
  )

  expect(asme.getNutDimensions({size: "#4", standard: 'ASME_B18_2_2_JAM'})).toStrictEqual(
  {
    "height": 2.383,
    "size": "#4",
    "standard": "ASME_B18_2_2_JAM",
    "type": "STANDARD",
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
  w = asme.generateNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0.00063})
  expect(geom3.isA(w)).toBe(true)
})
