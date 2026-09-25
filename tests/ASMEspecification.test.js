import { expect, test } from 'vitest'

import { parseASMEBolt, parseASMENut } from './src/ASMEspecification.js'

test('parseASMEBolt parsing', () => {
  // error cases
  expect(() => parseASMEBolt()).toThrow()
  expect(() => parseASMEBolt('')).toThrow()

  // --- 1. ASME B18.2.1 Standard Commercial Hex Cap Screws ---
  expect(parseASMEBolt("Hex Cap Screw, ASME B18.2.1, 1/4-20 UNC x 1-1/2, Grade 5 Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.312,
      "fineFitHole": 0.265,
      "mediumFitHole": 0.282,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 20,
    "propertyClass": "GRADE 5",
    "size": "1/4",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Hex Head Cap Screw 5/16-18 UNC x 2, Grade 8, Yellow Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.374,
      "fineFitHole": 0.328,
      "mediumFitHole": 0.345,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 18,
    "propertyClass": "GRADE 8",
    "size": "5/16",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Finished Hex Cap Screw - 1/2-13 UNC x 3.5 - Grade 2 Bare Metal")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.562,
      "fineFitHole": 0.515,
      "mediumFitHole": 0.532,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 13,
    "propertyClass": "8.8",
    "size": "1/2",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("ASME B18.2.1 Hex Cap Screw 3/4-10 UNC x 4-1/2, Grade 8, Black Oxide")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.812,
      "fineFitHole": 0.765,
      "mediumFitHole": 0.782,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 10,
    "propertyClass": "GRADE 8",
    "size": "3/4",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Hex Cap Screw 3/8-16 UNC x 1-1/4, Stainless Steel 304, Passivated")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.437,
      "fineFitHole": 0.39,
      "mediumFitHole": 0.407,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Stainless Steel",
    "pitch": 16,
    "propertyClass": "8.8",
    "size": "3/8",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )

  // --- 2. ASME B18.2.1 Fine Thread Options (UNF) ---
  expect(parseASMEBolt("Hex Cap Screw 5/16-24 UNF x 1, Grade 8 Zinc Plated")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.374,
      "fineFitHole": 0.328,
      "mediumFitHole": 0.345,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 24,
    "propertyClass": "GRADE 8",
    "size": "5/16",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNF",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("ASME B18.2.1 Hex Head Bolt, 1/2-20 UNF x 2.5, Grade 5, Bare")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.562,
      "fineFitHole": 0.515,
      "mediumFitHole": 0.532,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 20,
    "propertyClass": "GRADE 5",
    "size": "1/2",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNF",
    "threadTolerance": "2A",
  }
  )

  // --- 3. ASME B18.2.1 Heavy Hex and Fully Threaded Tap Bolts ---
  expect(parseASMEBolt("Heavy Hex Bolt, ASME B18.2.1, 5/8-11 UNC x 3, Grade 8, Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.687,
      "fineFitHole": 0.64,
      "mediumFitHole": 0.657,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 11,
    "propertyClass": "GRADE 8",
    "size": "5/8",
    "standard": "ASME_B18_2_1_HEAVY_BOLT",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Hex Tap Bolt, ASME B18.2.1, 3/8-16 UNC x 2, Fully Threaded, Grade 5")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.437,
      "fineFitHole": 0.39,
      "mediumFitHole": 0.407,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 16,
    "propertyClass": "GRADE 5",
    "size": "3/8",
    "standard": "ASME_B18_2_1_TAP_BOLT",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Heavy Hex Tap Bolt 1-8 UNC x 4, Grade 2, Hot Dip Galvanized")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.135,
      "fineFitHole": 0.088,
      "mediumFitHole": 0.105,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Hot Dip Galvanized",
    "material": "Carbon Steel",
    "pitch": 8,
    "propertyClass": "8.8",
    "size": "1",
    "standard": "ASME_B18_2_1_TAP_BOLT",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )

  // --- 4. ASME B18.2.6 Heavy Hex Structural Bolts (High-Strength) ---
  expect(parseASMEBolt("Heavy Hex Structural Bolt, ASME B18.2.6, A325, 1/2-13 UNC x 2, Zinc Plated")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.562,
      "fineFitHole": 0.515,
      "mediumFitHole": 0.532,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Hardened Structural Steel",
    "pitch": 13,
    "propertyClass": "A325",
    "size": "1/2",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Structural Bolt, ASTM F3125 Grade A325, 3/4-10 UNC x 3-1/2, HDG")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.812,
      "fineFitHole": 0.765,
      "mediumFitHole": 0.782,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Hot Dip Galvanized",
    "material": "Hardened Structural Steel",
    "pitch": 10,
    "propertyClass": "A325",
    "size": "3/4",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Heavy Hex Structural Bolt ASME B18.2.6 - A490 - 7/8-9 UNC x 4 - Black Oxide")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.937,
      "fineFitHole": 0.89,
      "mediumFitHole": 0.907,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 9,
    "propertyClass": "8.8",
    "size": "7/8",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )

  // --- 5. ASME B18.6.3 Miniature Machine Screws (Hex Washer Head) ---
  expect(parseASMEBolt("Hex Washer Head Machine Screw, ASME B18.6.3, #4-40 UNC x 1/2, Steel Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.174,
      "fineFitHole": 0.127,
      "mediumFitHole": 0.144,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 40,
    "propertyClass": "8.8",
    "size": "4",
    "standard": "ASME_B18_6_3_MACHINE",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Machine Screw #6-32 UNC x 3/4, Hex Washer Head, Stainless Steel")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.2,
      "fineFitHole": 0.153,
      "mediumFitHole": 0.17,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Stainless Steel",
    "pitch": 32,
    "propertyClass": "8.8",
    "size": "6",
    "standard": "ASME_B18_6_3_MACHINE",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("ASME B18.6.3 Hex Head Machine Screw #10-24 UNC x 1, Grade 2 Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.252,
      "fineFitHole": 0.205,
      "mediumFitHole": 0.222,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 24,
    "propertyClass": "8.8",
    "size": "10",
    "standard": "ASME_B18_6_3_MACHINE",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Hex Washer Head Machine Screw #12-24 UNC x 5/8, Case Hardened")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.278,
      "fineFitHole": 0.231,
      "mediumFitHole": 0.248,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 24,
    "propertyClass": "8.8",
    "size": "12",
    "standard": "ASME_B18_6_3_MACHINE",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )

  // --- 6. ASME B18.2.1 Large Industrial Infrastructure Extensions ---
  expect(parseASMEBolt("Hex Cap Screw, ASME B18.2.1, 1-3/4-5 UNC x 8, Grade 8 Alloy Steel")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.135,
      "fineFitHole": 0.088,
      "mediumFitHole": 0.105,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 3,
    "propertyClass": "GRADE 8",
    "size": "1",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Heavy Hex Bolt 2-4.5 UNC x 12, ASTM A307 Grade A, Hot Dip Galvanized")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.148,
      "fineFitHole": 0.101,
      "mediumFitHole": 0.118,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Hot Dip Galvanized",
    "material": "Carbon Steel",
    "pitch": 4,
    "propertyClass": "8.8",
    "size": "2",
    "standard": "ASME_B18_2_1_HEAVY_BOLT",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("Large Hex Head Cap Screw 3-4 UNC x 10, Grade 8, Bare Metal")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.161,
      "fineFitHole": 0.114,
      "mediumFitHole": 0.131,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Bare Metal",
    "material": "Carbon Steel",
    "pitch": 4,
    "propertyClass": "GRADE 8",
    "size": "3",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
  expect(parseASMEBolt("ASME B18.2.1 Hex Cap Screw 4-4 UNC x 16, Structural Grade 5, Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.174,
      "fineFitHole": 0.127,
      "mediumFitHole": 0.144,
      "standardBody": "ASME B18.21.1",
    },
    "coating": "Zinc Plated",
    "material": "Carbon Steel",
    "pitch": 4,
    "propertyClass": "GRADE 5",
    "size": "4",
    "standard": "ASME_B18_2_1_CAP_SCREW",
    "threadSeries": "UNC",
    "threadTolerance": "2A",
  }
  )
})

test('parseASMENut parsing', () => {
  // error cases
  expect(() => parseASMENut()).toThrow()
  expect(() => parseASMENut('')).toThrow()

  // --- 1. ASME B18.2.2 Standard Finished Hex Nuts ---
  expect(parseASMENut("Hex Nut, ASME B18.2.2, 1/4-20 UNC, Grade 5 Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.22,
      "allowableHoleMinimum": 0.2,
      "recommendedDrillBitSize": 0.19,
    },
    "material": "Carbon Steel",
    "pitch": 20,
    "size": "1/4",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Finished Hex Nut 5/16-18 UNC, Grade 8, Yellow Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.28,
      "allowableHoleMinimum": 0.25,
      "recommendedDrillBitSize": 0.24,
    },
    "material": "Carbon Steel",
    "pitch": 18,
    "size": "5/16",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Hex Nut 3/8-16 UNC, Stainless Steel 316, Passivated")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.33,
      "allowableHoleMinimum": 0.31,
      "recommendedDrillBitSize": 0.29,
    },
    "material": "Stainless Steel",
    "pitch": 16,
    "size": "3/8",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("ASME B18.2.2 Finished Hex Nut 1/2-13 UNC, Grade 2, Bare Metal")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.42,
      "recommendedDrillBitSize": 0.4,
    },
    "material": "Carbon Steel",
    "pitch": 13,
    "size": "1/2",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Hex Nut 5/8-11 UNC, Grade 8, Black Oxide")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.57,
      "allowableHoleMinimum": 0.53,
      "recommendedDrillBitSize": 0.51,
    },
    "material": "Carbon Steel",
    "pitch": 11,
    "size": "5/8",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )

  // --- 2. ASME B18.2.2 Fine Thread Options (UNF) ---
  expect(parseASMENut("Hex Nut 5/16-24 UNF, Grade 5 Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.29,
      "allowableHoleMinimum": 0.27,
      "recommendedDrillBitSize": 0.26,
    },
    "material": "Carbon Steel",
    "pitch": 24,
    "size": "5/16",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNF",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("ASME B18.2.2 Finished Hex Head Nut, 1/2-20 UNF, Grade 8, Bare")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.47,
      "allowableHoleMinimum": 0.45,
      "recommendedDrillBitSize": 0.44,
    },
    "material": "Carbon Steel",
    "pitch": 20,
    "size": "1/2",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNF",
    "threadTolerance": "2B",
  }
  )

  // --- 3. ASME B18.2.2 Thin / Jam Nuts ---
  expect(parseASMENut("Hex Jam Nut, ASME B18.2.2, 3/8-16 UNC, Grade 2 Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.33,
      "allowableHoleMinimum": 0.31,
      "recommendedDrillBitSize": 0.29,
    },
    "material": "Carbon Steel",
    "pitch": 16,
    "size": "3/8",
    "standard": "ASME_B18_2_2_JAM",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Finished Hex Jam Nut 1/2-13 UNC, Stainless Steel, Plain")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.42,
      "recommendedDrillBitSize": 0.4,
    },
    "material": "Stainless Steel",
    "pitch": 13,
    "size": "1/2",
    "standard": "ASME_B18_2_2_JAM",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("ASME B18.2.2 Hex Jam Nut 3/4-10 UNC, Grade 5, Black Oxide")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.69,
      "allowableHoleMinimum": 0.64,
      "recommendedDrillBitSize": 0.62,
    },
    "material": "Carbon Steel",
    "pitch": 10,
    "size": "3/4",
    "standard": "ASME_B18_2_2_JAM",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )

  // --- 4. ASME B18.2.2 Heavy Hex Nuts ---
  expect(parseASMENut("Heavy Hex Nut, ASME B18.2.2, 1/2-13 UNC, Grade 8, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.42,
      "recommendedDrillBitSize": 0.4,
    },
    "material": "Carbon Steel",
    "pitch": 13,
    "size": "1/2",
    "standard": "ASME_B18_2_2_HEAVY",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Heavy Hex Nut 5/8-11 UNC, ASTM A563 Grade DH, Hot Dip Galvanized")).toStrictEqual(
  {
    "coating": "Hot Dip Galvanized",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.57,
      "allowableHoleMinimum": 0.53,
      "recommendedDrillBitSize": 0.51,
    },
    "material": "Hardened Carbon Steel",
    "pitch": 11,
    "size": "5/8",
    "standard": "ASME_B18_2_2_HEAVY",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("ASME B18.2.2 Heavy Hex Nut 1-8 UNC, Grade 2, Plain Finish")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.92,
      "allowableHoleMinimum": 0.86,
      "recommendedDrillBitSize": 0.84,
    },
    "material": "Carbon Steel",
    "pitch": 8,
    "size": "1",
    "standard": "ASME_B18_2_2_HEAVY",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )

  // --- 5. ASME B18.2.6 Heavy Hex Structural Nuts ---
  expect(parseASMENut("Heavy Hex Structural Nut, ASME B18.2.6, 1/2-13 UNC, Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.42,
      "recommendedDrillBitSize": 0.4,
    },
    "material": "Hardened Carbon Steel",
    "pitch": 13,
    "size": "1/2",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Heavy Hex Structural Nut 3/4-10 UNC, ASTM A563 Grade DH, HDG")).toStrictEqual(
  {
    "coating": "Hot Dip Galvanized",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.69,
      "allowableHoleMinimum": 0.64,
      "recommendedDrillBitSize": 0.62,
    },
    "material": "Hardened Carbon Steel",
    "pitch": 10,
    "size": "3/4",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("ASME B18.2.6 Structural Nut - 7/8-9 UNC - Black Oxide")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.8,
      "allowableHoleMinimum": 0.75,
      "recommendedDrillBitSize": 0.73,
    },
    "material": "Hardened Carbon Steel",
    "pitch": 9,
    "size": "7/8",
    "standard": "ASME_B18_2_6_STRUCTURAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )

  // --- 6. ASME B18.16.6 Nylon Insert Lock Nuts ---
  expect(parseASMENut("Nylon Insert Lock Nut, ASME B18.16.6, 1/4-20 UNC, Nylon Collar, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.22,
      "allowableHoleMinimum": 0.2,
      "recommendedDrillBitSize": 0.19,
    },
    "material": "Carbon Steel",
    "pitch": 20,
    "size": "1/4",
    "standard": "ASME_B18_16_6_LOCK_STANDARD",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("Nyloc Lock Nut 5/16-18 UNC, Grade 8, Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.28,
      "allowableHoleMinimum": 0.25,
      "recommendedDrillBitSize": 0.24,
    },
    "material": "Carbon Steel",
    "pitch": 18,
    "size": "5/16",
    "standard": "ASME_B18_16_6_LOCK_STANDARD",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(parseASMENut("ASME B18.16.6 Nylon Insert Thin Lock Nut 1/2-13 UNC, Stainless Steel")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.42,
      "recommendedDrillBitSize": 0.4,
    },
    "material": "Stainless Steel",
    "pitch": 13,
    "size": "1/2",
    "standard": "ASME_B18_16_6_LOCK_THIN",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
})
