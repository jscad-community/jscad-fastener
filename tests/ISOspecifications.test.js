import { expect, test } from 'vitest'

import { iso } from './src/index.js'

test('iso.parseBoltSpec parsing', () => {
  // error cases
  expect(() => iso.parseBoltSpec()).toThrow()
  expect(() => iso.parseBoltSpec('')).toThrow()

  // --- 1. Hexagon Bolts (Partially Threaded / Smooth Body)
  expect(iso.parseBoltSpec("ISO 4014 M12x75 Hex Bolt Grade 8.8")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 13.5,
      "fineFitHole": 12.5,
      "mediumFitHole": 13,
      "clearanceStandard": "ISO 273",
    },
    "coating": "Plain Finish",
    "length": 75,
    "material": "Carbon Steel",
    "pitch": 1.75,
    "propertyClass": "8.8",
    "size": "M12",
    "standard": "ISO_4014_HEX_BOLT",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("iso4014-M16x100-8.8 ZP")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 19,
      "fineFitHole": 17,
      "mediumFitHole": 18,
    },
    "coating": "Plain Finish",
    "length": 100,
    "material": "Carbon Steel",
    "pitch": 2,
    "propertyClass": "8.8",
    "size": "M16",
    "standard": "ISO_4014_HEX_BOLT",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("Hexagon Bolt ISO4014 - M20 x 2.5 x 120")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 23,
      "fineFitHole": 21,
      "mediumFitHole": 22,
    },
    "coating": "Plain Finish",
    "length": 120,
    "material": "Carbon Steel",
    "pitch": 2.5,
    "propertyClass": "8.8",
    "size": "M20",
    "standard": "ISO_4014_HEX_BOLT",
    "threadSeries": "FINE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("DIN 931 M10x50 Hex Head Bolt")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 11.5,
      "fineFitHole": 10.5,
      "mediumFitHole": 11,
    },
    "coating": "Plain Finish",
    "length": 50,
    "material": "Carbon Steel",
    "pitch": 1.5,
    "propertyClass": "8.8",
    "size": "M10",
    "standard": "DIN_931_HEX_BOLT",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("din931 M8x40 Blk")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 9.5,
      "fineFitHole": 8.5,
      "mediumFitHole": 9,
    },
    "coating": "Plain Finish",
    "length": 40,
    "material": "Carbon Steel",
    "pitch": 1.25,
    "propertyClass": "8.8",
    "size": "M8",
    "standard": "DIN_931_HEX_BOLT",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("HEX BOLT DIN 931 - M24 x 90 - CLASS 10.9")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 29,
      "fineFitHole": 26,
      "mediumFitHole": 27,
    },
    "coating": "Plain Finish",
    "length": 90,
    "material": "Carbon Steel",
    "pitch": 3,
    "propertyClass": "10.9",
    "size": "M24",
    "standard": "DIN_931_HEX_BOLT",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )

  // --- 2. Hexagon Screws (Fully Threaded / Tap Bolts)
  expect(iso.parseBoltSpec("ISO 4017 M6x20 Hex Head Cap Screw")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 6.6,
      "fineFitHole": 6.2,
      "mediumFitHole": 6.4,
    },
    "coating": "Plain Finish",
    "length": 20,
    "material": "Carbon Steel",
    "pitch": 1,
    "propertyClass": "8.8",
    "size": "M6",
    "standard": "ISO_4017_HEX_SCREW",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("iso4017_M10x35_A2-70 Stainless")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 11.5,
      "fineFitHole": 10.5,
      "mediumFitHole": 11,
    },
    "coating": "Clean Passivated",
    "length": 35,
    "material": "A2 Stainless Steel",
    "pitch": 1.5,
    "propertyClass": "A2-70",
    "size": "M10",
    "standard": "ISO_4017_HEX_SCREW",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("Hex Screw ISO 4017 - M14 x 45")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 17,
      "fineFitHole": 15,
      "mediumFitHole": 16,
    },
    "coating": "Plain Finish",
    "length": 45,
    "material": "Carbon Steel",
    "pitch": 2,
    "propertyClass": "8.8",
    "size": "M14",
    "standard": "ISO_4017_HEX_SCREW",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("DIN 933 M12x30 Fully Threaded Bolt")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 13.5,
      "fineFitHole": 12.5,
      "mediumFitHole": 13,
    },
    "coating": "Plain Finish",
    "length": 30,
    "material": "Carbon Steel",
    "pitch": 1.75,
    "propertyClass": "8.8",
    "size": "M12",
    "standard": "DIN_933_HEX_SCREW",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("din933-M5x16-8.8")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 5.6,
      "fineFitHole": 5.2,
      "mediumFitHole": 5.4,
    },
    "coating": "Plain Finish",
    "length": 16,
    "material": "Carbon Steel",
    "pitch": 0.8,
    "propertyClass": "8.8",
    "size": "M5",
    "standard": "DIN_933_HEX_SCREW",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("HEX SCREW DIN 933 M16 X 50 CLASS 10.9")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 19,
      "fineFitHole": 17,
      "mediumFitHole": 18,
    },
    "coating": "Plain Finish",
    "length": 50,
    "material": "Carbon Steel",
    "pitch": 2,
    "propertyClass": "10.9",
    "size": "M16",
    "standard": "DIN_933_HEX_SCREW",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )

  // --- 3. High-Strength Structural Bolts
  expect(iso.parseBoltSpec("ISO 7411 M24x80 Heavy Hex Structural Bolt")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 29,
      "fineFitHole": 26,
      "mediumFitHole": 27,
    },
    "coating": "Plain Finish",
    "length": 80,
    "material": "Carbon Steel",
    "pitch": 3,
    "propertyClass": "8.8",
    "size": "M24",
    "standard": "ISO_7411_HEX_STRUCTURAL",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("Structural Bolt ISO7411 M20x70 HV")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 23,
      "fineFitHole": 21,
      "mediumFitHole": 22,
    },
    "coating": "Plain Finish",
    "length": 70,
    "material": "Carbon Steel",
    "pitch": 2.5,
    "propertyClass": "8.8",
    "size": "M20",
    "standard": "ISO_7411_HEX_STRUCTURAL",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("DIN 6914 M22x90 High Strength Structural Bolt")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 27,
      "fineFitHole": 24,
      "mediumFitHole": 25,
    },
    "coating": "Plain Finish",
    "length": 90,
    "material": "Carbon Steel",
    "pitch": 2.5,
    "propertyClass": "8.8",
    "size": "M22",
    "standard": "DIN_6914_HEX_STRUCTURAL",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("din6914 M16x60 10.9 HV")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 19,
      "fineFitHole": 17,
      "mediumFitHole": 18,
    },
    "coating": "Plain Finish",
    "length": 60,
    "material": "Carbon Steel",
    "pitch": 2,
    "propertyClass": "10.9",
    "size": "M16",
    "standard": "DIN_6914_HEX_STRUCTURAL",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )

  // --- 4. Pan Head Machine Screws
  expect(iso.parseBoltSpec("ISO 7045 M3x12 Pan Head Machine Screw")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 3.5,
      "fineFitHole": 3.1,
      "mediumFitHole": 3.3,
    },
    "coating": "Plain Finish",
    "length": 12,
    "material": "Carbon Steel",
    "pitch": 0.5,
    "propertyClass": "8.8",
    "size": "M3",
    "standard": "ISO_7045_PAN_MACHINE",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("iso 7045 - M4 x 0.7 x 10 - Phillips")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 4.5,
      "fineFitHole": 4.1,
      "mediumFitHole": 4.3,
    },
    "coating": "Plain Finish",
    "length": 10,
    "material": "Carbon Steel",
    "pitch": 0.7,
    "propertyClass": "8.8",
    "size": "M4",
    "standard": "ISO_7045_PAN_MACHINE",
    "threadSeries": "FINE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("DIN 7985 M5x16 Pan Head Screw")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 5.6,
      "fineFitHole": 5.2,
      "mediumFitHole": 5.4,
    },
    "coating": "Plain Finish",
    "length": 16,
    "material": "Carbon Steel",
    "pitch": 0.8,
    "propertyClass": "8.8",
    "size": "M5",
    "standard": "DIN_7985_PAN_MACHINE",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
  expect(iso.parseBoltSpec("din7985-M2x6-A4 Stainless")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "clearanceStandard": "ISO 273",
      "coarseFitHole": 2.4,
      "fineFitHole": 2.1,
      "mediumFitHole": 2.2,
    },
    "coating": "Clean Passivated",
    "length": 6,
    "material": "A4 Stainless Steel",
    "pitch": 0.4,
    "propertyClass": "A2-70",
    "size": "M2",
    "standard": "DIN_7985_PAN_MACHINE",
    "threadSeries": "COARSE",
    "threadTolerance": "6g",
  }
  )
})

test('iso.parseNutSpec parsing', () => {
  // error cases
  expect(() => iso.parseNutSpec()).toThrow()
  expect(() => iso.parseNutSpec('')).toThrow()

  // --- 1. ASME B18.2.2 Standard Finished Hex Nuts ---
  expect(iso.parseNutSpec("Plain Washer ISO 7090 - M16 - 300 HV - HDG Finish")).toStrictEqual(
  {
    "coating": "Hot-Dip Galvanized",
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
  }
  )
return
  expect(iso.parseNutSpec(aa)).toStrictEqual(
  {
  }
  )
})


test('iso.parseWasherSpec parsing', () => {
  // error cases
  expect(() => iso.parseWasherSpec()).toThrow()
  expect(() => iso.parseWasherSpec('')).toThrow()

  // --- 1. ASME B18.21.1 Type A Standard Commercial Flat Washers ---
  expect(iso.parseWasherSpec("Hex nut ISO 4032 - M16 - 6H - Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 200,
    "material": "Carbon Steel",
    "size": "M16",
    "standard": "ISO_4032",
  }
  )
return
  expect(iso.parseWasherSpec(aa)).toStrictEqual(
  {
  }
  )
})
