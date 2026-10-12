import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { iso } from './src/index.js'

test('iso.getHexBoltDimensions', () => {
  // errors
  expect(iso.getHexBoltDimensions()).toStrictEqual(null)
  expect(iso.getHexBoltDimensions({})).toStrictEqual(null)
  expect(iso.getHexBoltDimensions({size: "Z"})).toStrictEqual(null)
  expect(iso.getHexBoltDimensions({size: "Z"}, 20.0)).toStrictEqual(null)

  // defaults
  expect(iso.getHexBoltDimensions({size: "M6"}, 20.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 8.9,
    "filletRadius": 0.25,
    "headHeight": 4,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 6,
    "size": "M6",
    "standard": "ISO_4014_HEX_BOLT",
    "threadLength": 18,
    "threadSeries": "COARSE",
    "unthreadedLength": 2,
    "widthAcrossFlats": 10,
  }
  )

  // standards
  expect(iso.getHexBoltDimensions({size: "M8", standard: 'ISO_4014_HEX_BOLT'}, 20.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 11.6,
    "filletRadius": 0.4,
    "headHeight": 5.3,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 8,
    "size": "M8",
    "standard": "ISO_4014_HEX_BOLT",
    "threadLength": 20,
    "threadSeries": "COARSE",
    "unthreadedLength": 3.13,
    "widthAcrossFlats": 13,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M12", standard: 'ISO_4016_HEX_BOLT_C'}, 40.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 18,
    "filletRadius": 0.6,
    "headHeight": 7.5,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 12,
    "size": "M12",
    "standard": "ISO_4016_HEX_BOLT_C",
    "threadLength": 30,
    "threadSeries": "COARSE",
    "unthreadedLength": 10.0,
    "widthAcrossFlats": 18,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M20", standard: 'ISO_4017_HEX_SCREW'}, 60.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 26.75,
    "filletRadius": 0.8,
    "headHeight": 12.5,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 20,
    "size": "M20",
    "standard": "ISO_4017_HEX_SCREW",
    "threadLength": 60,
    "threadSeries": "COARSE",
    "unthreadedLength": 6.25,
    "widthAcrossFlats": 30,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M24", standard: 'ISO_7411_HEX_STRUCTURAL'}, 60.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 39,
    "filletRadius": 1.5,
    "headHeight": 15,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 24,
    "size": "M24",
    "standard": "ISO_7411_HEX_STRUCTURAL",
    "threadLength": 54,
    "threadSeries": "COARSE",
    "unthreadedLength": 6,
    "widthAcrossFlats": 41,
  }
  )
  // TODO rounded head
  // expect(iso.getHexBoltDimensions({size: "1/2", standard: 'ISO_7045_PAN_MACHINE'}, 20.0)).toStrictEqual(
  // {
  // }
  // )

  expect(iso.getHexBoltDimensions({size: "M8", standard: 'DIN_601_HEX_BOLT_C'}, 20.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 13,
    "filletRadius": 0.3,
    "headHeight": 5.3,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 8,
    "size": "M8",
    "standard": "DIN_601_HEX_BOLT_C",
    "threadLength": 20,
    "threadSeries": "COARSE",
    "unthreadedLength": 3.13,
    "widthAcrossFlats": 13,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M12", standard: 'DIN_931_HEX_BOLT'}, 40.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 17.4,
    "filletRadius": 0.6,
    "headHeight": 7.5,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 12,
    "size": "M12",
    "standard": "DIN_931_HEX_BOLT",
    "threadLength": 30,
    "threadSeries": "COARSE",
    "unthreadedLength": 10,
    "widthAcrossFlats": 19,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M20", standard: 'DIN_933_HEX_SCREW'}, 60.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 28.2,
    "filletRadius": 0.8,
    "headHeight": 12.5,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 20,
    "size": "M20",
    "standard": "DIN_933_HEX_SCREW",
    "threadLength": 60,
    "threadSeries": "COARSE",
    "unthreadedLength": 6.25,
    "widthAcrossFlats": 30,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M22", standard: 'DIN_6914_HEX_STRUCTURAL'}, 80.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 33.3,
    "filletRadius": 1.5,
    "headHeight": 14,
    "isHeavy": false,
    "isTap": false,
    "majorDiameter": 22,
    "size": "M22",
    "standard": "DIN_6914_HEX_STRUCTURAL",
    "threadLength": 50,
    "threadSeries": "COARSE",
    "unthreadedLength": 30,
    "widthAcrossFlats": 36,
  }
  )
  // TODO rounded head
  // expect(iso.getHexBoltDimensions({size: "M6", standard: 'DIN_7985_PAN_MACHINE'}, 20.0)).toStrictEqual(
  // {
  // }
  // )

  // choose
  expect(iso.getHexBoltDimensions({size: "M10", isTap: true, threadSeries: 'FINE'}, 40.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 14.25,
    "filletRadius": 0.4,
    "headHeight": 6.4,
    "isHeavy": false,
    "isTap": true,
    "majorDiameter": 10,
    "size": "M10",
    "standard": "ISO_4017_HEX_SCREW",
    "threadLength": 40,
    "threadSeries": "FINE",
    "unthreadedLength": 3.75,
    "widthAcrossFlats": 16,
  }
  )
  expect(iso.getHexBoltDimensions({size: "M16", isHeavy: true, threadSeries: 'COARSE'}, 60.0)).toStrictEqual(
  {
    "bearingFaceDiameter": 25,
    "filletRadius": 1.2,
    "headHeight": 10,
    "isHeavy": true,
    "isTap": false,
    "majorDiameter": 16,
    "size": "M16",
    "standard": "ISO_7411_HEX_STRUCTURAL",
    "threadLength": 38,
    "threadSeries": "COARSE",
    "unthreadedLength": 22,
    "widthAcrossFlats": 27,
  }
  )
})

test('iso.generateHexBolt', () => {
  let spec = {
    "bearingFaceDiameter": 25,
    "filletRadius": 1.2,
    "headHeight": 10,
    "isHeavy": true,
    "isTap": false,
    "majorDiameter": 16,
    "size": "M16",
    "standard": "ISO_7411_HEX_STRUCTURAL",
    "threadLength": 38,
    "threadSeries": "COARSE",
    "unthreadedLength": 22,
    "widthAcrossFlats": 27,
  }
  let b = iso.generateHexBolt(spec, 2.0)
  expect(geom3.isA(b)).toBe(true)
})
