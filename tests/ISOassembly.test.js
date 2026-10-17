import { expect, test } from 'vitest'

import { geom3 } from '@jscad/modeling'

import { iso } from './src/index.js'

test('iso.parseAssembly', () => {
  // errors
  // expect(iso.parseAssembly()).toStrictEqual(null)
  // expect(iso.parseAssembly("")).toStrictEqual(null)
  // expect(iso.parseAssembly("bah bah bah")).toStrictEqual(null)

  // edge cases, i.e. short specifications
  expect(iso.parseAssembly("M6 x 40 Bolt")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 6.6,
        "fineFitHole": 6.2,
        "mediumFitHole": 6.4,
      },
      "coating": "Plain Finish",
      "length": 40,
      "material": "Carbon Steel",
      "pitch": 1,
      "propertyClass": "8.8",
      "size": "M6",
      "standard": "ISO_4014_HEX_BOLT",
      "threadSeries": "COARSE",
      "threadTolerance": "6g",
    },
    "nut": null,
    "washer": null,
  }
  )
  expect(iso.parseAssembly("M12 x 1.25 x 50 Bolt, Washer, Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 13.5,
        "fineFitHole": 12.5,
        "mediumFitHole": 13,
      },
      "coating": "Plain Finish",
      "length": 50,
      "material": "Carbon Steel",
      "pitch": 1.25,
      "propertyClass": "8.8",
      "size": "M12",
      "standard": "ISO_4014_HEX_BOLT",
      "threadSeries": "FINE",
      "threadTolerance": "6g",
    },
    "nut": {
      "coating": "Plain Finish",
      "drillingSpecifications": {
        "allowableHoleMaximum": 10.371,
        "allowableHoleMinimum": 10.106,
        "recommendedDrillBitSize": 10.25,
      },
      "material": "Carbon Steel",
      "pitch": 1.75,
      "size": "M12",
      "standard": "ISO_4032_HEX_STANDARD",
      "threadSeries": "FINE",
      "threadTolerance": "6H",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 200,
      "material": "Carbon Steel",
      "size": "M12",
      "standard": "ISO_7090",
    },
  }
  )
  expect(iso.parseAssembly("M8 x 1.0 Bolt")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 9.5,
        "fineFitHole": 8.5,
        "mediumFitHole": 9,
      },
      "coating": "Plain Finish",
      "length": null,
      "material": "Carbon Steel",
      "pitch": 1,
      "propertyClass": "8.8",
      "size": "M8",
      "standard": "ISO_4014_HEX_BOLT",
      "threadSeries": "FINE",
      "threadTolerance": "6g",
    },
    "nut": null,
    "washer": null,
  }
  )
  expect(iso.parseAssembly("M5 x 5 Bolt")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 5.6,
        "fineFitHole": 5.2,
        "mediumFitHole": 5.4,
      },
      "coating": "Plain Finish",
      "length": 5,
      "material": "Carbon Steel",
      "pitch": 0.8,
      "propertyClass": "8.8",
      "size": "M5",
      "standard": "ISO_4014_HEX_BOLT",
      "threadSeries": "COARSE",
      "threadTolerance": "6g",
    },
    "nut": null,
    "washer": null,
  }
  )
  expect(iso.parseAssembly("ISO 4017 Bolt M16 x 60 - 10.9 HDG Finish; ISO 7090 Washer")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 19,
        "fineFitHole": 17,
        "mediumFitHole": 18,
      },
      "coating": "Hot-Dip Galvanized",
      "length": 60,
      "material": "Carbon Steel",
      "pitch": 2,
      "propertyClass": "10.9",
      "size": "M16",
      "standard": "ISO_4017_HEX_SCREW",
      "threadSeries": "COARSE",
      "threadTolerance": "6g",
    },
    "nut": null,
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 200,
      "material": "Carbon Steel",
      "size": "M16",
      "standard": "ISO_7090",
    },
  }
  )

  // full specifications
  expect(iso.parseAssembly("Hexagon head bolt ISO 4014 - M12 x 80 - 8.8, with Plain washer ISO 7090, Hex nut ISO 4032")).toStrictEqual(
  {
  "bolt": {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 13.5,
      "fineFitHole": 12.5,
      "mediumFitHole": 13,
    },
    "coating": "Plain Finish",
    "length": 80,
    "material": "Carbon Steel",
    "pitch": 1.75,
    "propertyClass": "8.8",
    "size": "M12",
    "standard": "ISO_4014_HEX_BOLT",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  },
  "nut": {
    "coating": "Plain Finish",
    "drillingSpecifications": {
      "allowableHoleMaximum": 10.371,
      "allowableHoleMinimum": 10.106,
      "recommendedDrillBitSize": 10.25,
    },
    "material": "Carbon Steel",
    "pitch": 1.75,
    "size": "M12",
    "standard": "ISO_4032_HEX_STANDARD",
    "threadSeries": "COARSE",
    "threadTolerance": "6H",
  },
  "washer": {
    "coating": "Bare Metal",
    "hardnessHV": 200,
    "material": "Carbon Steel",
    "size": "M12",
    "standard": "ISO_7090",
  },
  }
  )
  expect(iso.parseAssembly("M6 x 0.75 x 40 Bolt + ISO 7092 Washer + ISO 4032 Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 6.6,
        "fineFitHole": 6.2,
        "mediumFitHole": 6.4,
      },
      "coating": "Plain Finish",
      "length": 40,
      "material": "Carbon Steel",
      "pitch": 0.75,
      "propertyClass": "8.8",
      "size": "M6",
      "standard": "ISO_4014_HEX_BOLT",
      "threadSeries": "FINE",
      "threadTolerance": "6g",
    },
    "nut": {
      "coating": "Plain Finish",
      "drillingSpecifications": {
        "allowableHoleMaximum": 5.107,
        "allowableHoleMinimum": 4.917,
        "recommendedDrillBitSize": 5,
      },
      "material": "Carbon Steel",
      "pitch": 1,
      "size": "M6",
      "standard": "ISO_4032_HEX_STANDARD",
      "threadSeries": "FINE",
      "threadTolerance": "6H",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 200,
      "material": "Carbon Steel",
      "size": "M6",
      "standard": "ISO_7092",
    },
  }
  )
  expect(iso.parseAssembly("ISO 4017 Bolt M16 x 60 - 10.9 HDG Finish; ISO 7090 Washer; ISO 4032 Nut")).toStrictEqual(
  {
    "bolt": {
      "clearanceSpecifications": {
        "clearanceStandard": "ISO 273",
        "coarseFitHole": 19,
        "fineFitHole": 17,
        "mediumFitHole": 18,
      },
      "coating": "Hot-Dip Galvanized",
      "length": 60,
      "material": "Carbon Steel",
      "pitch": 2,
      "propertyClass": "10.9",
      "size": "M16",
      "standard": "ISO_4017_HEX_SCREW",
      "threadSeries": "COARSE",
      "threadTolerance": "6g",
    },
    "nut": {
      "coating": "Plain Finish",
      "drillingSpecifications": {
        "allowableHoleMaximum": 14.135,
        "allowableHoleMinimum": 13.835,
        "recommendedDrillBitSize": 14,
      },
      "material": "Carbon Steel",
      "pitch": 2,
      "size": "M16",
      "standard": "ISO_4032_HEX_STANDARD",
      "threadSeries": "COARSE",
      "threadTolerance": "6H",
    },
    "washer": {
      "coating": "Bare Metal",
      "hardnessHV": 200,
      "material": "Carbon Steel",
      "size": "M16",
      "standard": "ISO_7090",
    },
  }
  )
})

