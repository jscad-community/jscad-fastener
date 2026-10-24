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
    "height": 0.4375,
    "size": "1/2",
    "standard": "ASME_B18_2_2_NORMAL",
    "type": "STANDARD",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getNutDimensions({size: "7/8", type: 'HEAVY'})).toStrictEqual(
  {
    "height": 0.8594,
    "size": "7/8",
    "standard": "ASME_B18_2_2_HEAVY",
    "type": "HEAVY",
    "bearingFaceHeight": 0.00063,
    "widthAcrossFlats": 1.4375,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", type: 'thin'})).toStrictEqual(
  {
    "height": 0.3125,
    "size": "1/2",
    "standard": "ASME_B18_2_2_JAM",
    "type": "THIN",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getNutDimensions({size: "1/2", type: 'JAM'})).toStrictEqual(
  {
    "height": 0.3125,
    "size": "1/2",
    "standard": "ASME_B18_2_2_JAM",
    "type": "JAM",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getNutDimensions({size: "1-1/4", type: 'structural'})).toStrictEqual(
  {
    "bearingFaceHeight": 0.015,
    "height": 0.7812,
    "size": "1 1/4",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "type": "STRUCTURAL",
    "widthAcrossFlats": 2,
  }
  )

  expect(asme.getNutDimensions({size: "#4", standard: 'ASME_B18_2_2_JAM'})).toStrictEqual(
  {
    "height": 0.0938,
    "size": "#4",
    "standard": "ASME_B18_2_2_JAM",
    "type": "STANDARD",
    "bearingFaceHeight": 0,
    "widthAcrossFlats": 0.25,
  }
  )
})

test('asme.generateNut', () => {
  // standard hex nut, no washer
  let w = asme.generateNut({widthAcrossFlats: 0.25, height: 0.098, bearingFaceHeight: 0})
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = asme.generateNut({widthAcrossFlats: 0.75, height: 0.3125, bearingFaceHeight: 0.015})
  expect(geom3.isA(w)).toBe(true)
})
