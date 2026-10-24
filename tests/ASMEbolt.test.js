import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { asme } from './src/index.js'

test('asme.getBoltDimensions', () => {
  // errors
  expect(asme.getBoltDimensions({})).toStrictEqual(null)
  expect(asme.getBoltDimensions({size: "Z"})).toStrictEqual(null)
  expect(asme.getBoltDimensions({size: "Z"}, 1.0)).toStrictEqual(null)

  // defaults
  expect(asme.getBoltDimensions({size: "1/2"}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.75,
    "filletRadius": 0.015,
    "headHeight": 0.323,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_HEX_BOLT",
    "threadLength": 0.81,
    "type": "CAP",
    "threadSeries": "UNC",
    "unthreadedLength": 0.19,
    "widthAcrossFlats": 0.75,
  }
  )

  // standards
  expect(asme.getBoltDimensions({size: "1/2", standard: 'ASME_B18_2_1_CAP_SCREW'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.696,
    "filletRadius": 0.015,
    "headHeight": 0.323,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadLength": 0.81,
    "threadSeries": "UNC",
    "type": "CAP",
    "unthreadedLength": 0.19,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getBoltDimensions({size: "1/2", standard: 'ASME_B18_2_6_STRUCTURAL'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.85,
    "filletRadius": 0.031,
    "headHeight": 0.323,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadLength": 1,
    "threadSeries": "UNC",
    "type": "CAP",
    "unthreadedLength": 0,
    "widthAcrossFlats": 0.875,
  }
  )
  expect(asme.getBoltDimensions({size: "1/2", standard: 'ASME_B18_6_3_MACHINE'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.675,
    "filletRadius": 0.01,
    "headHeight": 0.38,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_6_3_MACHINE",
    "threadLength": 1,
    "threadSeries": "UNC",
    "type": "CAP",
    "unthreadedLength": 0,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getBoltDimensions({size: "1/2", standard: 'ASME_B18_2_1_HEAVY_BOLT'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.814,
    "filletRadius": 0.031,
    "headHeight": 0.344,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_HEAVY_BOLT",
    "threadLength": 0.81,
    "threadSeries": "UNC",
    "type": "CAP",
    "unthreadedLength": 0.19,
    "widthAcrossFlats": 0.875,
  }
  )
  expect(asme.getBoltDimensions({size: "1/2", standard: 'ASME_B18_2_1_HEX_BOLT'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.75,
    "filletRadius": 0.015,
    "headHeight": 0.323,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_HEX_BOLT",
    "threadLength": 0.81,
    "threadSeries": "UNC",
    "type": "CAP",
    "unthreadedLength": 0.19,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getBoltDimensions({size: "1/2", standard: 'ASME_B18_2_1_TAP_BOLT'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.75,
    "filletRadius": 0.015,
    "headHeight": 0.323,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_TAP_BOLT",
    "threadLength": 1,
    "threadSeries": "UNC",
    "type": "CAP",
    "unthreadedLength": 0,
    "widthAcrossFlats": 0.75,
  }
  )

  // choose
  expect(asme.getBoltDimensions({size: "1/2", type: 'tap'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.75,
    "filletRadius": 0.015,
    "headHeight": 0.323,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_TAP_BOLT",
    "threadLength": 1,
    "threadSeries": "UNC",
    "type": "TAP",
    "unthreadedLength": 0,
    "widthAcrossFlats": 0.75,
  }
  )
  expect(asme.getBoltDimensions({size: "1/2", type: 'HEAVY'}, 1.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 0.814,
    "filletRadius": 0.031,
    "headHeight": 0.344,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_HEAVY_BOLT",
    "threadLength": 0.81,
    "threadSeries": "UNC",
    "type": "HEAVY",
    "unthreadedLength": 0.19,
    "widthAcrossFlats": 0.875,
  }
  )
})

test('asme.generateHexBolt', () => {
  // defaults
  let spec = {
    "bearingFaceDiameter": 0.814,
    "filletRadius": 0.031,
    "headHeight": 0.344,
    "majorDiameter": 0.5,
    "size": "1/2",
    "standard": "ASME_B18_2_1_HEAVY_BOLT",
    "threadLength": 0.81,
    "threadSeries": "UNC",
    "unthreadedLength": 0.19,
    "widthAcrossFlats": 0.875,
  }
  let b = asme.generateHexBolt(spec, 2.0)
  expect(geom3.isA(b)).toBe(true)
})
