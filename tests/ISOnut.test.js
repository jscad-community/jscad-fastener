import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { iso } from './src/index.js'

test('iso.getNutDimensions', () => {
  // errors
  expect(iso.getNutDimensions({})).toStrictEqual(null)
  expect(iso.getNutDimensions({size: "Z"})).toStrictEqual(null)
  expect(iso.getNutDimensions({size: "Z"})).toStrictEqual(null)

  // choose ISO dimensions
  expect(iso.getNutDimensions({size: "M4"})).toStrictEqual(
  {
    "bearingFaceHeight": 0,
    "height": 3.2,
    "size": "M4",
    "standard": "ISO_4032_HEX_STANDARD",
    "type": "STANDARD",
    "widthAcrossFlats": 7,
  }
  )
  expect(iso.getNutDimensions({size: "M12", type: 'HEAVY'})).toStrictEqual(
  {
    "bearingFaceHeight": 0.4,
    "height": 12,
    "size": "M12",
    "standard": "ISO_4033_HEX_HIGH",
    "type": "HEAVY",
    "widthAcrossFlats": 18,
  }
  )
  expect(iso.getNutDimensions({size: "M8", type: 'thin'})).toStrictEqual(
  {
    "bearingFaceHeight": 0.4,
    "height": 4,
    "size": "M8",
    "standard": "ISO_4035_HEX_THIN_JAM",
    "type": "THIN",
    "widthAcrossFlats": 13,
  }
  )
  expect(iso.getNutDimensions({size: "M5", type: 'JAM'})).toStrictEqual(
  {
    "bearingFaceHeight": 0,
    "height": 2.7,
    "size": "M5",
    "standard": "ISO_4035_HEX_THIN_JAM",
    "type": "JAM",
    "widthAcrossFlats": 8,
  }
  )
})

test('iso.generateNut', () => {
  // standard hex nut, no washer
  let w = iso.generateNut({type: 'STANDARD', widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0})
  expect(geom3.isA(w)).toBe(true)

  // standard hex nut, with washer
  w = iso.generateNut({type: 'STANDARD', widthAcrossFlats: 19.05, height: 7.938, bearingFaceHeight: 0.016})
  expect(geom3.isA(w)).toBe(true)
})
