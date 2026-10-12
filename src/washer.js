import { cuboid, cylinder, rotateZ, subtract, translate, TAU } from '@jscad/modeling'

/*
 * Washer Generation Module for JSCAD
 */


/*
 * Procedural Star Washer Geometry Estimator
 *
 * Calculates an authentic commercial tooth count derived entirely from the outer diameter.
 * 
 * @param {Number} outerDiameter - The washer's true outside diameter in millimeters
 * @returns {Number} Standardized target count for polar rotation loops
 */
const getProceduralToothCount = (outerDiameter) => {
  // Enforces a structural minimum of 6 teeth for microscopic sizes (M2 / #2)
  const count = 3 * Math.sqrt(outerDiameter) + 1
  return Math.max(6, Math.round(count))
}

/*
 * Generates a 3D simulated external tooth star washer.
 */
const generateExternalStarWasher = (innerDiameter, outerDiameter, thickness, segments) => {
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2
  const toothCount = getProceduralToothCount(outerDiameter)

  // Generate the baseline core washer ring
  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments })
  const washerRing = subtract(baseOuterCylinder, baseInnerCylinder)

  // Compute geometric parameters for the cutout wedges using TAU
  const angleStep = TAU / toothCount
  const perimeter = TAU * outerRadius
  const cutoutWidth = (perimeter / toothCount) * 0.40
  const cutoutLength = (outerRadius - innerRadius) * 0.50 
  const shiftDistance = outerRadius - (cutoutLength / 2)

  const masterCutoutBit = cuboid({
    size: [cutoutLength, cutoutWidth, thickness + 0.2]
  })

  const cutouts = []

  // Polar calculation loop
  for (let i = 0; i < toothCount; i++) {
    const currentAngle = i * angleStep
    
    // Process unique spatial translations from our static master node
    const transformedBit = rotateZ(
      currentAngle, 
      translate([shiftDistance, 0, 0], masterCutoutBit)
    )
    
    cutouts.push(transformedBit)
  }

  return subtract(washerRing, cutouts)
}

/*
 * Generates a 3D simulated internal tooth star washer.
 */
const generateInternalStarWasher = (innerDiameter, outerDiameter, thickness, segments) => {
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2

  // 1. Calculate the authentic commercial tooth density count from the mm OD
  const toothCount = getProceduralToothCount(outerDiameter)

  // 2. Generate the base core washer ring primitive
  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments })
  const washerRing = subtract(baseOuterCylinder, baseInnerCylinder)

  // 3. Compute geometric parameters for the internal cutout wedges
  const angleStep = TAU / toothCount
  
  // Cutout width scales off the inside perimeter to balance tooth vs air gap (~40% air gap)
  const innerPerimeter = TAU * innerRadius
  const cutoutWidth = (innerPerimeter / toothCount) * 0.40
  
  // Length penetrates deep enough from the inside bore to simulate internal teeth
  const cutoutLength = (outerRadius - innerRadius) * 0.50 
  
  // Shift distance pulls the master cutting bit inward so its outer edge rides along the innerRadius boundary
  const shiftDistance = innerRadius + (cutoutLength / 2)

  const masterCutoutBit = cuboid({
    size: [cutoutLength, cutoutWidth, thickness + 0.2]
  })

  const cutouts = []

  // 4. Polar calculation loop
  for (let i = 0; i < toothCount; i++) {
    const currentAngle = i * angleStep
    
    // Process unique spatial translations pulling inward from our static master node
    const transformedBit = rotateZ(
      currentAngle, 
      translate([shiftDistance, 0, 0], masterCutoutBit)
    )
    
    cutouts.push(transformedBit)
  }

  return subtract(washerRing, cutouts)
}

/*
 * Generates a 3D simulated helical split-ring lock washer.
 *
 * Slices a thin radial gap through one side of the ring.
 */
export const SpringWasher = (spec) => {
  const { innerDiameter, outerDiameter, thickness, segments } = spec
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2

  // 1. Generate the base core solid washer ring primitive
  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments }) // Over-height buffer
  const washerRing = subtract(baseOuterCylinder, baseInnerCylinder)

  // 2. Compute parameters for the single split-ring cutout slice
  // The split width scales dynamically but stays thin to represent a real compressed spring lock washer
  const gapWidth = Math.max(0.4, (outerRadius - innerRadius) * 0.25)
  const gapLength = (outerRadius - innerRadius) * 2.5
  
  // Shift the cutting bit out along the X-axis so it centers perfectly over one side wall of the ring
  const targetXCenter = innerRadius + (gapLength / 2) - 0.1

  // 3. Allocate the immutable single slice block matrix
  const positionedSlice = cuboid({
    size: [gapLength, gapWidth, thickness + 0.2],
    center: [targetXCenter, 0, 0]
  })

  // 5. Execute the final high-performance geometry subtraction
  return subtract(washerRing, positionedSlice)
}

// standard washer
export const Washer = (spec) => {
  const { innerDiameter, outerDiameter, thickness, segments } = spec
  const outerRadius = outerDiameter / 2
  const innerRadius = innerDiameter / 2

  const baseOuterCylinder = cylinder({ radius: outerRadius, height: thickness, segments })
  const baseInnerCylinder = cylinder({ radius: innerRadius, height: thickness + 0.2, segments })

  return subtract(baseOuterCylinder, baseInnerCylinder)
}

export const StarWasher = (spec) => {
  const { isInternal, innerDiameter, outerDiameter, thickness, segments } = spec
  if (isInternal) {
    return generateInternalStarWasher(innerDiameter, outerDiameter, thickness, segments)
  }
  return generateExternalStarWasher(innerDiameter, outerDiameter, thickness, segments)
}
