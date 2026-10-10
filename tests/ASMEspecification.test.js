import { expect, test } from 'vitest'

import { asme } from './src/index.js'

test('asme.parseBoltSpec parsing', () => {
  // error cases
  expect(() => asme.parseBoltSpec()).toThrow()
  expect(() => asme.parseBoltSpec('')).toThrow()

  // --- 1. ASME B18.2.1 Standard Commercial Hex Cap Screws ---
  expect(asme.parseBoltSpec("Hex Cap Screw, ASME B18.2.1, 1/4-20 UNC x 1-1/2, Grade 5 Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.312,
      "fineFitHole": 0.265,
      "mediumFitHole": 0.282,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Head Cap Screw 5/16-18 UNC x 2, Grade 8, Yellow Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.374,
      "fineFitHole": 0.328,
      "mediumFitHole": 0.345,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Finished Hex Cap Screw - 1/2-13 UNC x 3.5 - Grade 2 Bare Metal")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.562,
      "fineFitHole": 0.515,
      "mediumFitHole": 0.532,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("ASME B18.2.1 Hex Cap Screw 3/4-10 UNC x 4-1/2, Grade 8, Black Oxide")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.812,
      "fineFitHole": 0.765,
      "mediumFitHole": 0.782,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Cap Screw 3/8-16 UNC x 1-1/4, Stainless Steel 304, Passivated")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.437,
      "fineFitHole": 0.39,
      "mediumFitHole": 0.407,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Cap Screw 5/16-24 UNF x 1, Grade 8 Zinc Plated")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.374,
      "fineFitHole": 0.328,
      "mediumFitHole": 0.345,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("ASME B18.2.1 Hex Head Bolt, 1/2-20 UNF x 2.5, Grade 5, Bare")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.562,
      "fineFitHole": 0.515,
      "mediumFitHole": 0.532,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Heavy Hex Bolt, ASME B18.2.1, 5/8-11 UNC x 3, Grade 8, Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.687,
      "fineFitHole": 0.64,
      "mediumFitHole": 0.657,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Tap Bolt, ASME B18.2.1, 3/8-16 UNC x 2, Fully Threaded, Grade 5")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.437,
      "fineFitHole": 0.39,
      "mediumFitHole": 0.407,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Heavy Hex Tap Bolt 1-8 UNC x 4, Grade 2, Hot Dip Galvanized")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.135,
      "fineFitHole": 0.088,
      "mediumFitHole": 0.105,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Heavy Hex Structural Bolt, ASME B18.2.6, A325, 1/2-13 UNC x 2, Zinc Plated")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.562,
      "fineFitHole": 0.515,
      "mediumFitHole": 0.532,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Structural Bolt, ASTM F3125 Grade A325, 3/4-10 UNC x 3-1/2, HDG")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.812,
      "fineFitHole": 0.765,
      "mediumFitHole": 0.782,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Heavy Hex Structural Bolt ASME B18.2.6 - A490 - 7/8-9 UNC x 4 - Black Oxide")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.937,
      "fineFitHole": 0.89,
      "mediumFitHole": 0.907,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Washer Head Machine Screw, ASME B18.6.3, #4-40 UNC x 1/2, Steel Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.174,
      "fineFitHole": 0.127,
      "mediumFitHole": 0.144,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Machine Screw #6-32 UNC x 3/4, Hex Washer Head, Stainless Steel")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.2,
      "fineFitHole": 0.153,
      "mediumFitHole": 0.17,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("ASME B18.6.3 Hex Head Machine Screw #10-24 UNC x 1, Grade 2 Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.252,
      "fineFitHole": 0.205,
      "mediumFitHole": 0.222,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Washer Head Machine Screw #12-24 UNC x 5/8, Case Hardened")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.278,
      "fineFitHole": 0.231,
      "mediumFitHole": 0.248,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Hex Cap Screw, ASME B18.2.1, 1-3/4-5 UNC x 8, Grade 8 Alloy Steel")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.135,
      "fineFitHole": 0.088,
      "mediumFitHole": 0.105,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Heavy Hex Bolt 2-4.5 UNC x 12, ASTM A307 Grade A, Hot Dip Galvanized")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.148,
      "fineFitHole": 0.101,
      "mediumFitHole": 0.118,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("Large Hex Head Cap Screw 3-4 UNC x 10, Grade 8, Bare Metal")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.161,
      "fineFitHole": 0.114,
      "mediumFitHole": 0.131,
      "standardBody": "ASME B1.1",
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
  expect(asme.parseBoltSpec("ASME B18.2.1 Hex Cap Screw 4-4 UNC x 16, Structural Grade 5, Zinc")).toStrictEqual(
  {
    "clearanceSpecifications": {
      "coarseFitHole": 0.174,
      "fineFitHole": 0.127,
      "mediumFitHole": 0.144,
      "standardBody": "ASME B1.1",
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

test('asme.parseNutSpec parsing', () => {
  // error cases
  expect(() => asme.parseNutSpec()).toThrow()
  expect(() => asme.parseNutSpec('')).toThrow()

  // --- 1. ASME B18.2.2 Standard Finished Hex Nuts ---
  expect(asme.parseNutSpec("Hex Nut, ASME B18.2.2, 1/4-20 UNC, Grade 5 Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.218,
      "allowableHoleMinimum": 0.196,
      "recommendedDrillBitSize": 0.185,
    },
    "material": "Carbon Steel",
    "pitch": 20,
    "size": "1/4",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(asme.parseNutSpec("Finished Hex Nut 5/16-18 UNC, Grade 8, Yellow Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.276,
      "allowableHoleMinimum": 0.252,
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
  expect(asme.parseNutSpec("Hex Nut 3/8-16 UNC, Stainless Steel 316, Passivated")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.334,
      "allowableHoleMinimum": 0.307,
      "recommendedDrillBitSize": 0.294,
    },
    "material": "Stainless Steel",
    "pitch": 16,
    "size": "3/8",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(asme.parseNutSpec("ASME B18.2.2 Finished Hex Nut 1/2-13 UNC, Grade 2, Bare Metal")).toStrictEqual(
  {
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
  }
  )
  expect(asme.parseNutSpec("Hex Nut 5/8-11 UNC, Grade 8, Black Oxide")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.566,
      "allowableHoleMinimum": 0.527,
      "recommendedDrillBitSize": 0.507,
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
  expect(asme.parseNutSpec("Hex Nut 5/16-24 UNF, Grade 5 Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.285,
      "allowableHoleMinimum": 0.267,
      "recommendedDrillBitSize": 0.258,
    },
    "material": "Carbon Steel",
    "pitch": 24,
    "size": "5/16",
    "standard": "ASME_B18_2_2_NORMAL",
    "threadSeries": "UNF",
    "threadTolerance": "2B",
  }
  )
  expect(asme.parseNutSpec("ASME B18.2.2 Finished Hex Head Nut, 1/2-20 UNF, Grade 8, Bare")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.468,
      "allowableHoleMinimum": 0.446,
      "recommendedDrillBitSize": 0.435,
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
  expect(asme.parseNutSpec("Hex Jam Nut, ASME B18.2.2, 3/8-16 UNC, Grade 2 Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
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
  }
  )
  expect(asme.parseNutSpec("Finished Hex Jam Nut 1/2-13 UNC, Stainless Steel, Plain")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.417,
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
  expect(asme.parseNutSpec("ASME B18.2.2 Hex Jam Nut 3/4-10 UNC, Grade 5, Black Oxide")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.685,
      "allowableHoleMinimum": 0.642,
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

// TODO heavy jam specs

  // --- 4. ASME B18.2.2 Heavy Hex Nuts ---
  expect(asme.parseNutSpec("Heavy Hex Nut, ASME B18.2.2, 1/2-13 UNC, Grade 8, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.417,
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
  expect(asme.parseNutSpec("Heavy Hex Nut 5/8-11 UNC, ASTM A563 Grade DH, Hot Dip Galvanized")).toStrictEqual(
  {
    "coating": "Hot Dip Galvanized",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.566,
      "allowableHoleMinimum": 0.527,
      "recommendedDrillBitSize": 0.507,
    },
    "material": "Hardened Carbon Steel",
    "pitch": 11,
    "size": "5/8",
    "standard": "ASME_B18_2_2_HEAVY",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(asme.parseNutSpec("ASME B18.2.2 Heavy Hex Nut 1-8 UNC, Grade 2, Plain Finish")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.919,
      "allowableHoleMinimum": 0.865,
      "recommendedDrillBitSize": 0.838,
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
  expect(asme.parseNutSpec("Heavy Hex Structural Nut, ASME B18.2.6, 1/2-13 UNC, Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.417,
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
  expect(asme.parseNutSpec("Heavy Hex Structural Nut 3/4-10 UNC, ASTM A563 Grade DH, HDG")).toStrictEqual(
  {
    "coating": "Hot Dip Galvanized",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.685,
      "allowableHoleMinimum": 0.642,
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
  expect(asme.parseNutSpec("ASME B18.2.6 Structural Nut - 7/8-9 UNC - Black Oxide")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.803,
      "allowableHoleMinimum": 0.755,
      "recommendedDrillBitSize": 0.731,
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
  expect(asme.parseNutSpec("Nylon Insert Lock Nut, ASME B18.16.6, 1/4-20 UNC, Nylon Collar, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.218,
      "allowableHoleMinimum": 0.196,
      "recommendedDrillBitSize": 0.185,
    },
    "material": "Carbon Steel",
    "pitch": 20,
    "size": "1/4",
    "standard": "ASME_B18_16_6_LOCK_STANDARD",
    "threadSeries": "UNC",
    "threadTolerance": "2B",
  }
  )
  expect(asme.parseNutSpec("Nyloc Lock Nut 5/16-18 UNC, Grade 8, Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.276,
      "allowableHoleMinimum": 0.252,
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
  expect(asme.parseNutSpec("ASME B18.16.6 Nylon Insert Thin Lock Nut 1/2-13 UNC, Stainless Steel")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "drillingSpecifications": {
      "allowableHoleMaximum": 0.45,
      "allowableHoleMinimum": 0.417,
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


test('asme.parseWasherSpec parsing', () => {
  // error cases
  expect(() => asme.parseWasherSpec()).toThrow()
  expect(() => asme.parseWasherSpec('')).toThrow()

  // --- 1. ASME B18.21.1 Type A Standard Commercial Flat Washers ---
  expect(asme.parseWasherSpec("Flat Washer, ASME B18.21.1 Type A, 1/4 inch, Narrow Series, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "1/4",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )
  expect(asme.parseWasherSpec("Flat Washer ASME B18.21.1 5/16 in, Regular Series, Yellow Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "5/16",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )
  expect(asme.parseWasherSpec("ASME B18.21.1 Type A Flat Washer 3/8 inch, Wide Series, Bare Metal")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "3/8",
    "standard": "ASME_B18_21_1_TYPE_A_WIDE",
  }
  )
  expect(asme.parseWasherSpec("Flat Washer 1/2 inch, ASME B18.21.1, Stainless Steel 304")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 180,
    "material": "Stainless Steel",
    "size": "1/2",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )
// FIXME
  expect(asme.parseWasherSpec("Plain Flat Washer ASME B18.21.1 Regular 5/8 inch, Black Oxide")).toStrictEqual(
  {
    "coating": "Black Oxide",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "5/8",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )
  expect(asme.parseWasherSpec("ASME B18.21.1 Type A Plain Washer 1 inch, Carbon Steel, Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "1",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )

  // --- 2. ASTM F436 High-Strength Hardened Structural Washers ---
  expect(asme.parseWasherSpec("Hardened Flat Washer ASTM F436 - 1/2 inch, Circular, Plain")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 360,
    "material": "Hardened Carbon Steel",
    "size": "1/2",
    "standard": "ASTM_F436_STRUCTURAL",
  }
  )
  expect(asme.parseWasherSpec("Hardened Structural Washer, ASTM F436, 5/8 in, Hot Dip Galvanized")).toStrictEqual(
  {
    "coating": "Hot Dip Galvanized",
    "hardnessHV": 360,
    "material": "Hardened Carbon Steel",
    "size": "5/8",
    "standard": "ASTM_F436_STRUCTURAL",
  }
  )
  expect(asme.parseWasherSpec("ASTM F436 Hardened Structural Washer 3/4 inch, Circular, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 360,
    "material": "Hardened Carbon Steel",
    "size": "3/4",
    "standard": "ASTM_F436_STRUCTURAL",
  }
  )
  expect(asme.parseWasherSpec("Hardened Structural Washer ASTM F436 1 inch, Weathering Steel")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 360,
    "material": "Hardened Carbon Steel",
    "size": "1",
    "standard": "ASTM_F436_STRUCTURAL",
  }
  )

  // --- 3. ASME B18.21.1 Helical Spring Mechanical Lock Washers ---
  expect(asme.parseWasherSpec("Split Lock Washer, ASME B18.21.1, 1/4 inch, Regular Series, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "1/4",
    "standard": "ASME_B18_21_1_LOCK_REGULAR",
  }
  )
  expect(asme.parseWasherSpec("Helical Spring Lock Washer ASME B18.21.1 3/8 in, Heavy Series, Plain")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "3/8",
    "standard": "ASME_B18_21_1_LOCK_HEAVY",
  }
  )
  expect(asme.parseWasherSpec("ASME B18.21.1 Split Lock Washer 1/2 inch, Stainless Steel")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 180,
    "material": "Stainless Steel",
    "size": "1/2",
    "standard": "ASME_B18_21_1_LOCK_REGULAR",
  }
  )
  expect(asme.parseWasherSpec("High Collar Helical Spring Lock Washer 3/4 inch, ASME B18.21.1, Black Oxide")).toStrictEqual(
  {
    "coating": "Black Oxide",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "3/4",
    "standard": "ASME_B18_21_1_LOCK_REGULAR",
  }
  )

  // --- 4. ASME B18.21.1 Miniature Machine Screw Washers (#2 to #12) ---
  expect(asme.parseWasherSpec("Flat Washer, ASME B18.21.1, #4 Screw Size, Regular Series, Zinc")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "#4",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )
  expect(asme.parseWasherSpec("ASME B18.21.1 Split Lock Washer #6, Steel Zinc Plated")).toStrictEqual(
  {
    "coating": "Zinc Plated",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "#6",
    "standard": "ASME_B18_21_1_LOCK_REGULAR",
  }
  )
  expect(asme.parseWasherSpec("Flat Washer #10 inch Screw Size, ASME B18.21.1 Type A, Stainless Steel")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 180,
    "material": "Stainless Steel",
    "size": "#10",
    "standard": "ASME_B18_21_1_TYPE_A_NARROW",
  }
  )
  expect(asme.parseWasherSpec("Helical Spring Lock Washer ASME B18.21.1 #12, Regular Series")).toStrictEqual(
  {
    "coating": "Bare Metal",
    "hardnessHV": 110,
    "material": "Carbon Steel",
    "size": "#12",
    "standard": "ASME_B18_21_1_LOCK_REGULAR",
  }
  )
})
