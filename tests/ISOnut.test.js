import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { iso } from './src/index.js'

test('iso.getNutDimensions', () => {
  // errors
  expect(iso.getNutDimensions({})).toStrictEqual(null)
  expect(iso.getNutDimensions({size: "Z"})).toStrictEqual(null)
  expect(iso.getNutDimensions({size: "Z"})).toStrictEqual(null)

  // ISO dimensions
  expect(iso.getNutDimensions({size: "M4"})).toStrictEqual(
  {
    "bearingFaceHeight": 0,
    "height": 3.2,
    "isHeavy": false,
    "isThin": false,
    "size": "M4",
    "standard": "ISO",
    "widthAcrossFlats": 7,
  }
  )
  expect(iso.getNutDimensions({size: "M12", isHeavy: true})).toStrictEqual(
  {
    "bearingFaceHeight": 0.4,
    "height": 12,
    "isHeavy": true,
    "isThin": false,
    "size": "M12",
    "standard": "ISO",
    "widthAcrossFlats": 18,
  }
  )
  expect(iso.getNutDimensions({size: "M8", isThin: true})).toStrictEqual(
  {
    "bearingFaceHeight": 0.4,
    "height": 4,
    "isHeavy": false,
    "isThin": true,
    "size": "M8",
    "standard": "ISO",
    "widthAcrossFlats": 13,
  }
  )
  expect(iso.getNutDimensions({size: "M5", isThin: true, isHeavy: true})).toStrictEqual(
  {
    "bearingFaceHeight": 0,
    "height": 2.7,
    "isHeavy": true,
    "isThin": true,
    "size": "M5",
    "standard": "ISO",
    "widthAcrossFlats": 8,
  }
  )
})

test('iso.generateNut', () => {
  // standard hex nut, no washer
  let w = iso.generateNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0})
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = iso.generateNut({widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0.016})
  expect(geom3.isA(w)).toBe(true)
})
