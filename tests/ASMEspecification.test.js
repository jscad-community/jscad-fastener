import { expect, test } from 'vitest'

import { parseASMEBolt } from './src/ASMEspecification.js'

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
