import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { asme } from './src/index.js'

test('asme.parseAssembly', () => {
  // errors
  //expect(asme.parseAssembly()).toStrictEqual(null)
  //expect(asme.parseAssembly("").toStrictEqual(null)
  //expect(asme.parseAssembly("bah bah bah")).toStrictEqual(null)

  // 1. Standard Fractional & Structural Specs (Unified Standards)
  expect(asme.parseAssembly("Hex cap screw ASME B18.2.1 - 1/2-13 x 2.5 - Grade 5, with Plain washer ASME B18.22.1, Hex nut ASME B18.2.2")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.562,
        "fineFitHole": 0.515,
        "mediumFitHole": 0.532,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 2.5,
      "material": "Carbon Steel",
      "pitch": 13,
      "propertyClass": "GRADE 5",
      "size": "1/2",
      "standard": "ASME_B18_2_1_CAP_SCREW",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 0.45,
        "allowableHoleMinimum": 0.417,
        "recommendedDrillBitSize": 0.4,
      },
      "material": "Carbon Steel",
      "pitch": 13,
      "size": "1/2",
      "standard": "ASME_B18_2_2_NORMAL",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 110,
      "material": "Carbon Steel",
      "size": "1/2",
      "standard": "ASME_B18_21_1_TYPE_A_NARROW",
    },
  }
  )
  expect(asme.parseAssembly("ASME B18.2.6 Heavy Hex Structural Bolt 7/8-9 x 4.0 - A325, w/ F436 Structural Washer, Heavy Hex Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.937,
        "fineFitHole": 0.89,
        "mediumFitHole": 0.907,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 4,
      "material": "Hardened Structural Steel",
      "pitch": 9,
      "propertyClass": "A325",
      "size": "7/8",
      "standard": "ASME_B18_2_6_STRUCTURAL",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 0.803,
        "allowableHoleMinimum": 0.755,
        "recommendedDrillBitSize": 0.731,
      },
      "material": "Carbon Steel",
      "pitch": 9,
      "size": "7/8",
      "standard": "ASME_B18_2_2_HEAVY",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 360,
      "material": "Hardened Carbon Steel",
      "size": "7/8",
      "standard": "ASTM_F436_STRUCTURAL",
    },
  }
  )
  expect(asme.parseAssembly("5/16-24 x 1-1/2 Hex Bolt + B18.22.1 Washer + Hex Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.374,
        "fineFitHole": 0.328,
        "mediumFitHole": 0.345,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 1.5,
      "material": "Carbon Steel",
      "pitch": 24,
      "propertyClass": "GRADE 2",
      "size": "5/16",
      "standard": "ASME_B18_2_1_HEX_BOLT",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 0.285,
        "allowableHoleMinimum": 0.267,
        "recommendedDrillBitSize": 0.258,
      },
      "material": "Carbon Steel",
      "pitch": 24,
      "size": "5/16",
      "standard": "ASME_B18_2_2_NORMAL",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 110,
      "material": "Carbon Steel",
      "size": "5/16",
      "standard": "ASME_B18_21_1_TYPE_A_NARROW",
    },
  }
  )

  // 2. Machine Screw Sizes (Numbered Gauges)
  expect(asme.parseAssembly("Pan Head Machine Screw ASME B18.6.3 - #10-32 x 1.25, with Type B Narrow Washer, Lock Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.252,
        "fineFitHole": 0.205,
        "mediumFitHole": 0.222,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 1.25,
      "material": "Carbon Steel",
      "pitch": 32,
      "propertyClass": "GRADE 2",
      "size": "#10",
      "standard": "ASME_B18_6_3_MACHINE",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 0.17,
        "allowableHoleMinimum": 0.156,
        "recommendedDrillBitSize": 0.149,
      },
      "material": "Carbon Steel",
      "pitch": 32,
      "size": "#10",
      "standard": "ASME_B18_16_6_LOCK_STANDARD",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 110,
      "material": "Carbon Steel",
      "size": "#10",
      "standard": "ASME_B18_21_1_TYPE_B_NARROW",
    },
  }
  )
  expect(asme.parseAssembly("No. 8-32 x 3/4 Screw + Washer + Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.226,
        "fineFitHole": 0.179,
        "mediumFitHole": 0.196,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 0.75,
      "material": "Carbon Steel",
      "pitch": 32,
      "propertyClass": "GRADE 2",
      "size": "#8",
      "standard": "ASME_B18_2_1_CAP_SCREW",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 0.144,
        "allowableHoleMinimum": 0.13,
        "recommendedDrillBitSize": 0.123,
      },
      "material": "Carbon Steel",
      "pitch": 32,
      "size": "#8",
      "standard": "ASME_B18_2_2_NORMAL",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 110,
      "material": "Carbon Steel",
      "size": "#8",
      "standard": "ASME_B18_21_1_TYPE_A_NARROW",
    },
  }
  )

  // 3. Shorthand, Optional, & Messy Context Formatting
  expect(asme.parseAssembly("3/4-20 x 2.0 Bolt")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.812,
        "fineFitHole": 0.765,
        "mediumFitHole": 0.782,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 2,
      "material": "Carbon Steel",
      "pitch": 20,
      "propertyClass": "GRADE 2",
      "size": "3/4",
      "standard": "ASME_B18_2_1_CAP_SCREW",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": null,
    "washer": null,
  }
  )
  expect(asme.parseAssembly("3/8-16x1.50 Bolt+USS Wide Washer+Jam Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 0.437,
        "fineFitHole": 0.39,
        "mediumFitHole": 0.407,
        "standardBody": "ASME B1.1",
      },
      "coating": "Bare Metal",
      "length": 1.5,
      "material": "Carbon Steel",
      "pitch": 16,
      "propertyClass": "GRADE 2",
      "size": "3/8",
      "standard": "ASME_B18_2_1_CAP_SCREW",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 0.334,
        "allowableHoleMinimum": 0.307,
        "recommendedDrillBitSize": 0.294,
      },
      "material": "Carbon Steel",
      "pitch": 16,
      "size": "3/8",
      "standard": "ASME_B18_2_2_JAM",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 110,
      "material": "Carbon Steel",
      "size": "3/8",
      "standard": "ASME_B18_21_1_TYPE_A_WIDE",
    },
  }
  )
  expect(asme.parseAssembly("1-1/4-7 x 5.50 Hex Bolt - Grade 8 Zinc Plated; B18.22.1 Wide Washer; B18.2.2 Heavy Hex Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "coarseFitHole": 1.312,
        "fineFitHole": 1.265,
        "mediumFitHole": 1.282,
        "standardBody": "ASME B1.1",
      },
      "coating": "Zinc Plated",
      "length": 5.5,
      "material": "Carbon Steel",
      "pitch": 7,
      "propertyClass": "GRADE 8",
      "size": "1 1/4",
      "standard": "ASME_B18_2_1_HEX_BOLT",
      "threadSeries": "UNC",
      "threadTolerance": "2A",
    },
    "nut": {
      "coating": "Bare Metal",
      "drillingSpecifications": {
        "allowableHoleMaximum": 1.157,
        "allowableHoleMinimum": 1.095,
        "recommendedDrillBitSize": 1.064,
      },
      "material": "Carbon Steel",
      "pitch": 7,
      "size": "1 1/4",
      "standard": "ASME_B18_2_2_HEAVY",
      "threadSeries": "UNC",
      "threadTolerance": "2B",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 110,
      "material": "Carbon Steel",
      "size": "1 1/4",
      "standard": "ASME_B18_21_1_TYPE_A_WIDE",
    },
  }
  )

})

test('asme.validateAssembly', () => {
  expect(() => asme.validateAssembly()).toThrow('Missing bolt specification')

  // invalid bolt spec
  let bolt = {size: '1 1/4', pitch: 2 }
  let assembly = {bolt}
  expect(() => asme.validateAssembly(assembly)).toThrow('Missing bolt length')

  // valid bolt spec
  bolt = {size: '1 1/4', pitch: 7, length: 5.5 }
  assembly = {bolt}
  expect(asme.validateAssembly(assembly)).toStrictEqual(true)

  // size checks
  let washer = {size: '1 1/2'}
  assembly = {bolt, washer}
  expect(() => asme.validateAssembly(assembly)).toThrow('Size mismatch')

  let nut = {size: '1 1/2'}
  assembly = {bolt, nut}
  expect(() => asme.validateAssembly(assembly)).toThrow('Size mismatch')

  // thread pitch checks
  nut = {size: '1 1/4', pitch: 5}
  assembly = {bolt, nut}
  expect(() => asme.validateAssembly(assembly)).toThrow('Thread pitch mismatch')

  // mechanical checks
  bolt = {size: '1 1/4', pitch: 7, length: 1.5 }
  washer = {size: '1 1/4', standard: 'ASME_B18_21_1_TYPE_A_WIDE'}
  nut = {size: '1 1/4', standard: 'ASME_B18_2_2_HEAVY', pitch: 7}
  assembly = {bolt, nut, washer}
  expect(() => asme.validateAssembly(assembly)).toThrow('Bolt length')
})

test('asme.generateAssembly', () => {
  // bolt, nut, washer
  let specifications = asme.parseAssembly("1-1/4-7 x 5.50 Hex Bolt - Grade 8 Zinc Plated; B18.22.1 Wide Washer; B18.2.2 Heavy Hex Nut")

  let assembly = asme.generateAssembly(specifications)
  expect(assembly.length).toStrictEqual(3)

  // bolt, washer

  // bolt, nut

  // bolt
  specifications = asme.parseAssembly("1-1/4-7 x 5.50 Hex Bolt")

  assembly = asme.generateAssembly(specifications)
  expect(assembly.length).toStrictEqual(1)
})
