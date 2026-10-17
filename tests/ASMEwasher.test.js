import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { asme } from './src/index.js'

test('asme.getWasherDimensions', () => {
  // errors
  expect(asme.getWasherDimensions({})).toStrictEqual(null)
  expect(asme.getWasherDimensions({size: "Z", standard: "Z"})).toStrictEqual(null)
  expect(asme.getWasherDimensions({size: "Z", standard: "ISO"})).toStrictEqual(null)

  // ASME dimensions from choosing standards
  expect(asme.getWasherDimensions({size: "#4"})).toStrictEqual(
  {
    "innerDiameter": 0.125,
    "isLocking": false,
    "outerDiameter": 0.312,
    "size": "#4",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
    "thickness": 0.032,
    "type": "REGULAR",
  }
  )
  expect(asme.getWasherDimensions({size: "1", type: 'HEAVY'})).toStrictEqual(
  {
    "innerDiameter": 1.094,
    "isLocking": false,
    "outerDiameter": 3.03,
    "size": "1",
    "standard": "ASME_B18_21_1_TYPE_A_WIDE",
    "thickness": 0.16,
    "type": "HEAVY",
  }
  )
  expect(asme.getWasherDimensions({size: "#4", type: 'wide'})).toStrictEqual(
  {
    "innerDiameter": 0.133,
    "isLocking": false,
    "outerDiameter": 0.446,
    "size": "#4",
    "standard": "ASME_B18_21_1_TYPE_A_WIDE",
    "thickness": 0.04,
    "type": "WIDE",
  }
  )
  expect(asme.getWasherDimensions({size: "#4", isLocking: true})).toStrictEqual(
  {
    "innerDiameter": 0.114,
    "isLocking": true,
    "outerDiameter": 0.209,
    "size": "#4",
    "standard": "ASME_B18_21_1_LOCK_REGULAR",
    "thickness": 0.025,
    "type": "REGULAR",
  }
  )
  expect(asme.getWasherDimensions({size: "#4", isLocking: true, type: 'INTERNAL'})).toStrictEqual(
  {
    "innerDiameter": 0.115,
    "isLocking": true,
    "outerDiameter": 0.27,
    "size": "#4",
    "standard": "ASME_B18_21_1_TOOTH_INTERNAL",
    "thickness": 0.019,
    "type": "INTERNAL",
  }
  )

  expect(asme.getWasherDimensions({size: "#4", isLocking: true, type: 'external'})).toStrictEqual(
  {
    "innerDiameter": 0.115,
    "isLocking": true,
    "outerDiameter": 0.282,
    "size": "#4",
    "standard": "ASME_B18_21_1_TOOTH_EXTERNAL",
    "thickness": 0.019,
    "type": "EXTERNAL",
  }
  )
})

test('asme.generateWasher', () => {
  let w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8})
  expect(geom3.isA(w)).toBe(true)
return

  w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true, type: 'INTERNAL'})
  expect(geom3.isA(w)).toBe(true)

  w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true, type: 'EXTERNAL'})
  expect(geom3.isA(w)).toBe(true)

  w = asme.generateWasher({innerDiameter: 4.3, outerDiameter: 9, thickness: 0.8, isLocking: true})
  expect(geom3.isA(w)).toBe(true)
})
