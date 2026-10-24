import { SpringWasher, StarWasher, Washer } from './washer.js'

/*
 * ASME Washer Module
 */

// Parameter Layout Index Offsets
const ID_INDEX = 0      // Inner Diameter
const OD_INDEX = 1      // Outer Diameter
const TH_INDEX = 2      // Thickness

const MM_PER_INCH = 25.4

/**
 * ASME B18.22.1 is now a combined standard, it contains several different dimensions depending on the washer type.
 *
 * ASME B18.22.1 Type A (Narrow / SAE)
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TYPE_A_NARROW = {
  // Machine Screw Sizes (#0 to #12)
  "#0": [0.078, 0.188, 0.020],
  "#2": [0.094, 0.250, 0.020],
  "#4": [0.125, 0.312, 0.032],
  "#6": [0.156, 0.375, 0.049],
  "#8": [0.188, 0.438, 0.049],
  "#10": [0.219, 0.500, 0.049],
  "#12": [0.250, 0.562, 0.065],
  // Fractional Bolt Sizes (1/4" to 4")
  "1/4": [0.281, 0.625, 0.065],
  "5/16": [0.344, 0.688, 0.065],
  "3/8": [0.406, 0.812, 0.065],
  "7/16": [0.469, 0.922, 0.065],
  "1/2": [0.531, 1.062, 0.095],
  "9/16": [0.594, 1.156, 0.095],
  "5/8": [0.656, 1.312, 0.095],
  "3/4": [0.812, 1.469, 0.134],
  "7/8": [0.938, 1.750, 0.134],
  "1": [1.062, 2.000, 0.134],
  "1 1/8": [1.250, 2.250, 0.134],
  "1 1/4": [1.375, 2.500, 0.165],
  "1 3/8": [1.500, 2.750, 0.165],
  "1 1/2": [1.625, 3.000, 0.165],
  "1 3/4": [1.875, 3.375, 0.180],
  "2": [2.125, 3.750, 0.180],
  "2 1/4": [2.375, 4.125, 0.220],
  "2 1/2": [2.625, 4.500, 0.220],
  "2 3/4": [2.875, 4.875, 0.220],
  "3": [3.125, 5.250, 0.250],
  "3 1/4": [3.375, 5.500, 0.250],
  "3 1/2": [3.625, 5.750, 0.250],
  "3 3/4": [3.875, 6.000, 0.250],
  "4": [4.250, 8.500, 0.313]
}

/**
 * ASME B18.22.1 is now a combined standard, it contains several different dimensions depending on the washer type.
 *
 * ASME B18.22.1 Type A (Wide / USS)
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TYPE_A_WIDE = {
  // Machine Screw Sizes (#0 to #12)
  "#0": [0.068, 0.250, 0.025],
  "#1": [0.084, 0.281, 0.032],
  "#2": [0.094, 0.344, 0.032],
  "#3": [0.117, 0.414, 0.040],
  "#4": [0.133, 0.446, 0.040],
  "#5": [0.149, 0.508, 0.040],
  "#6": [0.164, 0.570, 0.040],
  "#8": [0.196, 0.640, 0.063],
  "#10": [0.211, 0.749, 0.063],
  "#12": [0.242, 0.890, 0.063],
  // Fractional Bolt Sizes (1/4" to 4")
  "1/4": [0.296, 1.015, 0.063],
  "5/16": [0.359, 1.140, 0.063],
  "3/8": [0.421, 1.280, 0.100],
  "7/16": [0.484, 1.499, 0.100],
  "1/2": [0.546, 1.780, 0.100],
  "9/16": [0.609, 2.030, 0.100],
  "5/8": [0.686, 2.280, 0.160],
  "3/4": [0.842, 2.530, 0.160],
  "7/8": [0.968, 2.780, 0.160],
  "1": [1.094, 3.030, 0.160],
  "1 1/8": [1.219, 3.280, 0.160],
  "1 1/4": [1.344, 3.530, 0.160],
  "1 3/8": [1.469, 3.780, 0.160],
  "1 1/2": [1.594, 4.030, 0.160],
  "1 3/4": [1.875, 4.500, 0.250],
  "2": [2.125, 5.000, 0.250],
  "2 1/4": [2.375, 5.500, 0.250],
  "2 1/2": [2.625, 6.000, 0.250],
  "2 3/4": [2.875, 6.500, 0.250],
  "3": [3.125, 7.000, 0.250],
  "3 1/4": [3.375, 7.500, 0.250],
  "3 1/2": [3.625, 8.000, 0.250],
  "3 3/4": [3.875, 8.500, 0.250],
  "4": [4.250, 9.500, 0.375]
}

/**
 * ASTM F436 - Standard Specification for Hardened Steel Washers
 *
 * Profile Geometry: Chamfered outer edge angled between 35° and 45° on at least one face
 *
 * Dimensions: Structural series. The inner diameter is sized to clear high-strength bolt shanks,
 * while the outer diameter and heavy thickness are scaled to match heavy structural bolt heads.
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASTM_F436_STRUCTURAL = {
  "1/4": [0.281, 0.625, 0.051],
  "5/16": [0.344, 0.688, 0.051],
  "3/8": [0.406, 0.812, 0.051],
  "7/16": [0.469, 0.922, 0.051],
  "1/2": [0.531, 1.062, 0.097],
  "9/16": [0.594, 1.188, 0.110],
  "5/8": [0.688, 1.312, 0.122],
  "3/4": [0.813, 1.469, 0.122],
  "7/8": [0.938, 1.750, 0.136],
  "1": [1.125, 2.000, 0.136],
  "1 1/8": [1.250, 2.250, 0.136],
  "1 1/4": [1.375, 2.500, 0.136],
  "1 3/8": [1.500, 2.750, 0.136],
  "1 1/2": [1.625, 3.000, 0.136],
  "1 3/4": [1.875, 3.375, 0.178],
  "2": [2.125, 3.750, 0.178],
  "2 1/4": [2.375, 4.000, 0.240],
  "2 1/2": [2.625, 4.500, 0.240],
  "2 3/4": [2.875, 5.000, 0.240],
  "3": [3.125, 5.500, 0.240],
  "3 1/4": [3.375, 6.000, 0.240],
  "3 1/2": [3.625, 6.500, 0.240],
  "3 3/4": [3.875, 7.000, 0.280],
  "4": [4.250, 8.500, 0.313]
}

/**
 * ASME B18.21.1 Regular Series Helical Spring Lock Washers
 *
 * Range Covered: #0 to 4" (Extrapolated using heavy mechanical metrics past 3")
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_LOCK_REGULAR = {
  // Machine Screw Sizes (#0 to #12)
  "#0":    [0.064, 0.119, 0.015],
  "#1":    [0.077, 0.149, 0.018],
  "#2":    [0.088, 0.172, 0.020],
  "#3":    [0.101, 0.190, 0.022],
  "#4":    [0.114, 0.209, 0.025],
  "#5":    [0.127, 0.236, 0.031],
  "#6":    [0.141, 0.250, 0.031],
  "#8":    [0.167, 0.293, 0.040],
  "#10":   [0.193, 0.334, 0.047],
  "#12":   [0.219, 0.377, 0.056],
  // Fractional Bolt Sizes (1/4" to 4")
  "1/4":   [0.252, 0.487, 0.062],
  "5/16":  [0.314, 0.583, 0.078],
  "3/8":   [0.377, 0.680, 0.094],
  "7/16":  [0.440, 0.776, 0.109],
  "1/2":   [0.504, 0.869, 0.125],
  "9/16":  [0.567, 0.965, 0.141],
  "5/8":   [0.629, 1.073, 0.156],
  "3/4":   [0.755, 1.265, 0.188],
  "7/8":   [0.881, 1.459, 0.219],
  "1":     [1.007, 1.656, 0.250],
  "1 1/8": [1.134, 1.847, 0.281],
  "1 1/4": [1.261, 2.036, 0.312],
  "1 3/8": [1.389, 2.219, 0.344],
  "1 1/2": [1.516, 2.419, 0.375],
  "1 5/8": [1.643, 2.610, 0.406],
  "1 3/4": [1.769, 2.793, 0.438],
  "1 7/8": [1.895, 2.975, 0.469],
  "2":     [2.021, 3.156, 0.500],
  "2 1/4": [2.260, 3.221, 0.563],
  "2 1/2": [2.512, 3.471, 0.625],
  "2 3/4": [2.762, 3.824, 0.688],
  "3":     [3.012, 4.074, 0.750],
  "3 1/4": [3.265, 4.412, 0.785],
  "3 1/2": [3.515, 4.745, 0.825],
  "3 3/4": [3.765, 5.080, 0.865],
  "4":     [4.015, 5.415, 0.910]
}

/**
 * ASME B18.21.1 Heavy Series Helical Spring Lock Washers
 *
 * Range Covered: #0 to 4" (Includes heavy machinery scaled boundary allocations)
 * Features expanded outside diameters and massive thickness walls to handle high torque.
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_LOCK_HEAVY = {
  // Machine Screw Sizes (#0 to #12)
  "#0":    [0.064, 0.128, 0.020], 
  "#1":    [0.077, 0.158, 0.024], 
  "#2":    [0.088, 0.182, 0.025],
  "#3":    [0.101, 0.209, 0.031],
  "#4":    [0.114, 0.223, 0.031],
  "#5":    [0.127, 0.252, 0.040],
  "#6":    [0.141, 0.266, 0.040],
  "#8":    [0.167, 0.307, 0.047],
  "#10":   [0.193, 0.350, 0.056],
  "#12":   [0.219, 0.391, 0.063],
  // Fractional Bolt Sizes (1/4" to 4")
  "1/4":   [0.252, 0.491, 0.077],
  "5/16":  [0.317, 0.596, 0.097],
  "3/8":   [0.380, 0.691, 0.115],
  "7/16":  [0.443, 0.787, 0.133],
  "1/2":   [0.506, 0.883, 0.151],
  "9/16":  [0.570, 0.981, 0.171],
  "5/8":   [0.635, 1.093, 0.189],
  "3/4":   [0.760, 1.291, 0.226],
  "7/8":   [0.887, 1.494, 0.266],
  "1":     [1.017, 1.705, 0.306],
  "1 1/8": [1.144, 1.909, 0.345],
  "1 1/4": [1.271, 2.113, 0.384],
  "1 3/8": [1.398, 2.311, 0.422],
  "1 1/2": [1.525, 2.502, 0.458],
  "1 5/8": [1.650, 2.700, 0.495],
  "1 3/4": [1.775, 2.900, 0.535],
  "1 7/8": [1.900, 3.100, 0.570],
  "2":     [2.025, 3.300, 0.605],
  "2 1/4": [2.262, 3.398, 0.693],
  "2 1/2": [2.515, 3.648, 0.762],
  "2 3/4": [2.765, 3.910, 0.835],
  "3":     [3.015, 4.160, 0.905],
  "3 1/4": [3.279, 5.068, 0.750],
  "3 1/2": [3.530, 5.434, 0.812],
  "3 3/4": [3.782, 5.801, 0.875],
  "4":     [4.033, 6.166, 0.938]
}

/**
 * ASME B18.21.1 External Tooth Lock (Star) Washers
 *
 * Range Covered: #2 to 1-3/4" (Complete Official Standard Bounds)
 *
 * Outer diameter bounds map to the furthest biting tooth perimeter apex.
 * 
 * Note: Sizes #0, #1, and sizes larger than 1 3/4 do not exist under ASME B18.21.1.
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TOOTH_EXTERNAL = {
  // Machine Screw Sizes (#0 to #12)
  "#2":    [0.089, 0.230, 0.015],
  "#3":    [0.102, 0.255, 0.016],
  "#4":    [0.115, 0.282, 0.019],
  "#5":    [0.129, 0.305, 0.020],
  "#6":    [0.141, 0.320, 0.022],
  "#8":    [0.168, 0.381, 0.023],
  "#10":   [0.195, 0.410, 0.024],
  "#12":   [0.221, 0.475, 0.027],
  // Fractional Bolt Sizes (1/4" to 4")
  "1/4":   [0.256, 0.510, 0.028],
  "5/16":  [0.320, 0.610, 0.034],
  "3/8":   [0.384, 0.694, 0.040],
  "7/16":  [0.448, 0.760, 0.040],
  "1/2":   [0.513, 0.900, 0.045],
  "9/16":  [0.576, 0.985, 0.045],
  "5/8":   [0.641, 1.070, 0.050],
  "3/4":   [0.769, 1.260, 0.055],
  "7/8":   [0.897, 1.410, 0.060],
  "1":     [1.025, 1.620, 0.067],
  "1 1/8": [1.153, 1.820, 0.067],
  "1 1/4": [1.281, 1.960, 0.067],
  "1 3/8": [1.408, 2.210, 0.067],
  "1 1/2": [1.536, 2.380, 0.067],
  "1 3/4": [1.791, 2.620, 0.067]
}

/**
 * ASME B18.21.1 Internal Tooth Lock (Star) Washers
 *
 * Range Covered: #2 to 1 3/4 (Complete Official Standard Bounds)
 *
 * Note: Sizes #0, #1, and sizes larger than 1 3/4 do not exist under ASME B18.21.1.
 *
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TOOTH_INTERNAL = {
  // Machine Screw Sizes (#0 to #12)
  "#2":    [0.089, 0.200, 0.015],
  "#3":    [0.102, 0.230, 0.016],
  "#4":    [0.115, 0.270, 0.019],
  "#5":    [0.129, 0.290, 0.020],
  "#6":    [0.141, 0.295, 0.021],
  "#8":    [0.168, 0.340, 0.023],
  "#10":   [0.195, 0.381, 0.024],
  "#12":   [0.221, 0.410, 0.027],
  // Fractional Bolt Sizes (1/4" to 4")
  "1/4":   [0.256, 0.478, 0.028],
  "5/16":  [0.320, 0.610, 0.034],
  "3/8":   [0.384, 0.692, 0.040],
  "7/16":  [0.448, 0.789, 0.040],
  "1/2":   [0.513, 0.892, 0.045],
  "9/16":  [0.576, 0.985, 0.045],
  "5/8":   [0.641, 1.071, 0.050],
  "3/4":   [0.769, 1.245, 0.055],
  "7/8":   [0.897, 1.410, 0.060],
  "1":     [1.025, 1.610, 0.067],
  "1 1/8": [1.153, 1.815, 0.067],
  "1 1/4": [1.281, 1.961, 0.067],
  "1 3/8": [1.408, 2.210, 0.067],
  "1 1/2": [1.536, 2.377, 0.067],
  "1 3/4": [1.791, 2.619, 0.067]
}

/**
 * ASME B18.21.1: Type B Plain Washers - Regular Series (Inch Series).
 * 
 * DESIGN NOTES:
 * - Governs precision-stamped flat washers manufactured to tight dimensional tolerances.
 * - This series serves as the standard industrial balance point, optimizing outside diameter 
 *   and material thickness to distribute fastener clamping loads without causing unnecessary space constraints.
 * - Engineered primarily to support high-precision mechanical assemblies where clearance and 
 *   predictable torque-tension performance are vital.
 * - Supersedes and incorporates the refined dimensional baseline of the historical ASME B18.22.1 standard.
 * 
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TYPE_B_REGULAR = {
  // Machine Screw Sizes
  "#0":   [0.068, 0.188, 0.025],
  "#1":   [0.084, 0.219, 0.025],
  "#2":   [0.094, 0.250, 0.032],
  "#3":   [0.109, 0.281, 0.032],
  "#4":   [0.125, 0.312, 0.040],
  "#5":   [0.141, 0.344, 0.040],
  "#6":   [0.156, 0.375, 0.049],
  "#8":   [0.188, 0.438, 0.049],
  "#10":  [0.219, 0.500, 0.063],
  "#12":  [0.250, 0.562, 0.063],
  // Fractional Inch Sizes
  "1/4":   [0.281, 0.625, 0.063],
  "5/16":  [0.344, 0.750, 0.063],
  "3/8":   [0.406, 0.875, 0.063],
  "7/16":  [0.469, 1.125, 0.063],
  "1/2":   [0.531, 1.250, 0.063],
  "9/16":  [0.594, 1.375, 0.063],
  "5/8":   [0.656, 1.500, 0.093],
  "3/4":   [0.812, 1.875, 0.109],
  "7/8":   [0.938, 2.250, 0.109],
  "1":   [1.062, 2.500, 0.134],
  "1 1/8": [1.250, 2.750, 0.134],
  "1 1/4": [1.375, 3.000, 0.165],
  "1 3/8": [1.500, 3.250, 0.165],
  "1 1/2": [1.625, 3.500, 0.165],
  "1 3/4": [1.875, 4.000, 0.180],
  "2":   [2.125, 4.500, 0.180],
  "2 1/4": [2.375, 4.750, 0.220],
  "2 1/2": [2.625, 5.000, 0.238],
  "2 3/4": [2.875, 5.250, 0.259],
  "3":   [3.125, 5.500, 0.284]
}

/**
 * ASME B18.21.1: Type B Plain Washers - Narrow Series (Inch Series).
 * 
 * DESIGN NOTES:
 * - Governs narrow precision flat washers engineered specifically for tight spatial constraints.
 * - Features reduced outside diameters (OD) designed to fit inside machined counterbores, 
 *   pockets, or dense structural castings where a Regular washer would physically collide with side walls.
 * - Aligns closely with the physical footprint profiles traditionally associated with standard SAE washer specs, 
 *   but maintains the tighter manufacturing and flatness tolerances required by the Type B precision class.
 * - Reduces surface area contact, meaning it should be paired with higher-strength mating materials to avoid crushing.
 * 
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TYPE_B_NARROW = {
  // Machine Screw Sizes
  "#0":     [0.068, 0.125, 0.025],
  "#1":     [0.084, 0.156, 0.025],
  "#2":     [0.094, 0.188, 0.025],
  "#3":     [0.109, 0.219, 0.025],
  "#4":     [0.125, 0.250, 0.032],
  "#5":     [0.141, 0.281, 0.032],
  "#6":     [0.156, 0.312, 0.040],
  "#8":     [0.188, 0.375, 0.049],
  "#10":    [0.219, 0.438, 0.049],
  "#12":    [0.250, 0.500, 0.063],
  // Fractional Inch Sizes
  "1/4":    [0.281, 0.562, 0.063],
  "5/16":   [0.344, 0.688, 0.063],
  "3/8":    [0.406, 0.812, 0.063],
  "7/16":   [0.469, 0.922, 0.063],
  "1/2":    [0.531, 1.062, 0.095],
  "9/16":   [0.594, 1.156, 0.095],
  "5/8":    [0.656, 1.312, 0.095],
  "3/4":    [0.812, 1.469, 0.134],
  "7/8":    [0.938, 1.750, 0.134],
  "1":     [1.062, 2.000, 0.134],
  "1 1/8":  [1.250, 2.250, 0.160],
  "1 1/4":  [1.375, 2.500, 0.160],
  "1 3/8":  [1.500, 2.750, 0.160],
  "1 1/2":  [1.625, 3.000, 0.160],
  "1 3/4":  [1.875, 3.500, 0.178],
  "2":     [2.125, 4.000, 0.178],
  "2 1/4":  [2.375, 4.500, 0.239],
  "2 1/2":  [2.625, 5.000, 0.239],
  "2 3/4":  [2.875, 5.500, 0.239],
  "3":     [3.125, 6.000, 0.239]
}

/**
 * ASME B18.21.1: Type B Plain Washers - Wide Series (Inch Series).
 * 
 * DESIGN NOTES:
 * - Governs wide, heavy-duty precision flat washers engineered for maximum load distribution.
 * - Features significantly enlarged outside diameters (OD) and increased material thicknesses.
 * - Designed primarily to span oversized, slotted, or poorly aligned clearance holes without buckling or pulling through.
 * - Minimizes surface embedding and local stress concentrations when clamping down onto soft, lower-strength, 
 *   or thin-gauge mating materials (e.g., aluminum, plastics, sheet metal panels).
 * - Aligns closely with traditional USS washer footprints but maintains the superior flatness and precision of the Type B standard.
 * 
 * Entries: ASME size: [insideDiameter, outsideDiameter, thickness]
 *
 * @constant
 * @type {Object}
 * @memberof jscad-fastener/asme
 */
export const ASME_B18_21_1_TYPE_B_WIDE = {
  // Machine Screw Sizes
  "#0": [0.068, 0.250, 0.020],
  "#1": [0.081, 0.312, 0.025],
  "#2": [0.096, 0.375, 0.032],
  "#3": [0.109, 0.438, 0.040],
  "#4": [0.125, 0.500, 0.040],
  "#5": [0.141, 0.562, 0.040],
  "#6": [0.156, 0.625, 0.050],
  "#8": [0.188, 0.750, 0.050],
  "#10": [0.219, 0.875, 0.063],
  "#12": [0.250, 1.000, 0.063],
  // Fractional Inch Sizes
  "1/4": [0.281, 1.125, 0.063],
  "5/16": [0.344, 1.250, 0.063],
  "3/8": [0.406, 1.500, 0.080],
  "7/16": [0.469, 1.750, 0.080],
  "1/2": [0.531, 2.000, 0.090],
  "9/16": [0.594, 2.250, 0.112],
  "5/8": [0.656, 2.500, 0.112],
  "3/4": [0.812, 2.750, 0.148],
  "7/8": [0.938, 3.000, 0.165],
  "1": [1.062, 3.250, 0.165],
  "1 1/8": [1.188, 3.500, 0.165],
  "1 1/4": [1.344, 3.750, 0.165],
  "1 3/8": [1.469, 4.000, 0.180],
  "1 1/2": [1.594, 4.250, 0.180],
  "1 3/4": [1.875, 4.750, 0.220],
  "2": [2.125, 5.250, 0.220],
  "2 1/4": [2.375, 5.750, 0.250],
  "2 1/2": [2.625, 6.250, 0.250],
  "2 3/4": [2.875, 6.750, 0.250],
  "3": [3.125, 7.250, 0.250]
}

const standards = {
  'ASME_B18_21_1_TYPE_A_NARROW': ASME_B18_21_1_TYPE_A_NARROW,
  'ASME_B18_21_1_TYPE_A_WIDE': ASME_B18_21_1_TYPE_A_WIDE,
  'ASTM_F436_STRUCTURAL': ASTM_F436_STRUCTURAL,
  'ASME_B18_21_1_LOCK_REGULAR': ASME_B18_21_1_LOCK_REGULAR,
  'ASME_B18_21_1_LOCK_HEAVY': ASME_B18_21_1_LOCK_HEAVY,
  'ASME_B18_21_1_TOOTH_INTERNAL': ASME_B18_21_1_TOOTH_INTERNAL,
  'ASME_B18_21_1_TOOTH_EXTERNAL': ASME_B18_21_1_TOOTH_EXTERNAL,
  'ASME_B18_21_1_TYPE_B_NARROW': ASME_B18_21_1_TYPE_B_NARROW,
  'ASME_B18_21_1_TYPE_B_WIDE': ASME_B18_21_1_TYPE_B_WIDE,
  'ASME_B18_21_1_TYPE_B_REGULAR': ASME_B18_21_1_TYPE_B_REGULAR,
}

/**
 * Get the overall washer dimensions for the given specification.
 *
 * @see parseWasherSpec() for parsing of ASME callout specifications
 *
 * NOTE: Returned dimensions are inches.
 *
 * @memberof jscad-fastener/asme
 * @param {Object} spec - specification for construction
 * @param {String} spec.size - required, size of ASME washer, see lists above
 * @param {String} [spec.standard=null] - ASME standard or none (use type to choose)
 * @param {String} [spec.type='REGULAR'] - type of washer (REGULAR, HEAVY, WIDE, STRUCTURAL) / lock washer (REGULAR, HEAVY, INTERNAL, EXTERNAL)
 * @param {Boolean} [spec.isLocking=false] - get locking washer dimensions
 * @param {Number} [spec.idOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.odOffset=0] - clearance for oversized cutouts
 * @param {Number} [spec.thicknessOffset=0] - clearance for oversized cutouts
 * @returns {Object} full ASME washer specification with dimensions
 *
 * @example
 * const dims = getWasherDimensions({size: "#4"})
 * const dims = getWasherDimensions({size: "#4", type: "wide"})
 * const dims = getWasherDimensions({size: "3/4", standard: "ASME_B18_21_1_LOCK_REGULAR"})
 */
export const getWasherDimensions = (spec) => {
  let {
    size,
    standard = null,
    isLocking = false,
    type = 'REGULAR',
    idOffset = 0,
    odOffset = 0,
    thicknessOffset = 0
  } = spec

  if (!size) return null

  size = size.replace(/-/g, ' ').trim()

  type = type.toUpperCase().trim()

  // select the ASME washer standard using the given options
  if (!standard) {
    if (isLocking) {
      if (type === 'INTERNAL') {
        standard = 'ASME_B18_21_1_TOOTH_INTERNAL'
      } else if (type === 'EXTERNAL') {
        standard = 'ASME_B18_21_1_TOOTH_EXTERNAL'
      } else if (type === 'HEAVY') {
        standard = 'ASME_B18_21_1_LOCK_HEAVY'
      } else {
        type = 'REGULAR'
        standard = 'ASME_B18_21_1_LOCK_REGULAR'
      }
    } else {
      if (type === 'STRUCTURAL') {
        standard = 'ASTM_F436_STRUCTURAL'
      } else if (type === 'HEAVY' || type === 'WIDE') {
        standard = 'ASME_B18_21_1_TYPE_A_WIDE'
      } else {
        type = 'REGULAR'
        standard = 'ASME_B18_21_1_TYPE_A_NARROW'
      }
    }
  }

  let dataset = standards[standard]
  if (!dataset) return null

  // get the dimensions for the requested size
  const dims = dataset[size]
  if (!dims) return null

  let innerDiameter = dims[ID_INDEX] + (idOffset * 2)
  let outerDiameter = dims[OD_INDEX] + (odOffset * 2)
  let thickness = dims[TH_INDEX] + (thicknessOffset * 2)

  return {
    // spec
    size,
    standard,
    isLocking,
    type,
    // dimensions
    innerDiameter,
    outerDiameter,
    thickness,
  }
}

/**
 * Generate a solid washer manifold using the given dimensions.
 *
 * @see getWasherDimensions() to obtain correct dimensions
 *
 * NOTE: All dimensions are inches
 * 
 * @memberof jscad-fastener/asme
 * @param {object} spec - full washer specifications with dimensions
 * @param {String} spec.type - type of washer (REGULAR, HEAVY, WIDE, STRUCTURAL) / lock washer (REGULAR, HEAVY, INTERNAL, EXTERNAL)
 * @param {Boolean} spec.isLocking - true to generate locking washer
 * @param {Number} spec.innerDiameter - diameter of inside of washer
 * @param {Number} spec.outerDiameter - diameter of outside of washer
 * @param {Number} spec.thickness - thickness of washer
 * @param {Number} [spec.segments=36] - segments per full rotation
 * @returns {Geom3} washer, centered on XYZ
 *
 * @example
 * const spec = getWasherDimensions({size: '1 1/4', type: 'HEAVY'})
 * const nut = generateWasher(spec)
 */
export const generateWasher = (spec) => {
  let {
    isLocking,
    type,
    innerDiameter,
    outerDiameter,
    thickness,
    segments = 36
  } = spec

  // convert ASME inches to mm
  innerDiameter = Number((innerDiameter * MM_PER_INCH).toFixed(2))
  outerDiameter = Number((outerDiameter * MM_PER_INCH).toFixed(2))
  thickness = Number((thickness * MM_PER_INCH).toFixed(2))

  const washerSpec = { innerDiameter, outerDiameter, thickness, segments }

  // lock washers
  if (isLocking) {
    if (type === 'INTERNAL') {
      washerSpec['isInternal'] = true
      return StarWasher(washerSpec)
    } else if (type === 'EXTERNAL') {
      washerSpec['isInternal'] = false
      return StarWasher(washerSpec)
    } else {
      return SpringWasher(washerSpec)
    }
  }

  // standard washers
  return Washer(washerSpec)
}

