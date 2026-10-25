import { cylinder, cylinderElliptic, subtract, union, centerZ, mirrorZ, translate } from '@jscad/modeling'

/*
 * Nut Generation Module with suport for
 * - HexNut : beveled with optional bearing shoulder
 */

/**
 * Generate a double-beveled hex block with optional bearing shoulder.
 *
 * NOTE: ALL DIMENSIONS ARE IN MILLIMETERS
 *
 * @memberof jscad-fastener
 * @param {Object} spec - hex nut specification, ALL ARE REQUIRED
 * @param {Number} spec.widthAcrossFlats - width across the flats, i.e. wrench size (WAF)
 * @param {Number} spec.height - total thickness/height of the nut (H)
 * @param {Number} spec.bearingFaceHeight - height of the bearing washer step (C). May be zero
 * @param {Number} spec.bearingFaceDiameter - bearing face diameter (dw). May be zero
 * @param {Number} spec.zOffset - Z-axis translation offset to position/center the assembly
 * @param {Number} spec.segments - segments per full rotation
 * @returns {Geom3} - hex nut, centered on XYZ
 */
export const HexNut = (spec) => {
  const {
    widthAcrossFlats,
    height,
    bearingFaceHeight,
    bearingFaceDiameter,
    zOffset,
    segments
  } = spec

  // 1. Structural constants for hex layout
  const HEX_CONSTANT = 1.154700538 // 1 / cos(30 deg)
  const outerRadius = +((widthAcrossFlats * HEX_CONSTANT) / 2).toFixed(3)
  
  const bearingFaceRadius = bearingFaceDiameter * 0.5

  // 2. Adjust core hex body extrusion height to fit total standard thickness H
  const hexBodyHeight = +(height - bearingFaceHeight).toFixed(3)

  // 3. Generate the main hex block body prism using native 6-segment cylinder shortcut
  // Rotate by 30 degrees (Math.PI / 6) to keep flat sides aligned cleanly with coordinate planes
  let hexNutBody = cylinder({
    radius: outerRadius,
    height: hexBodyHeight,
    segments: 6
  })

  // 4. Build the 30-degree top chamfer cutting tool
  const chamferDepth = +(widthAcrossFlats * 0.12).toFixed(3) 
  const rStartTop = outerRadius * 1.1 // Extra clearance safety buffer
  const rEndTop = widthAcrossFlats / 2 // Cut lands exactly on inner edge of hex flats
  
  let topChamferTool = cylinderElliptic({
    height: chamferDepth,
    startRadius: [rStartTop, rStartTop],
    endRadius: [rEndTop, rEndTop],
    segments
  })
  const chamferBlock = cylinder({radius: rStartTop + 1, height: chamferDepth, segments})
  topChamferTool = subtract(chamferBlock, topChamferTool)

  // 4. Align and subtract the tapered cone tool from the top perimeter of the hex body
  let zoffset = (hexBodyHeight / 2) - (chamferDepth / 2)
  const positionedTopTool = translate([0, 0, zoffset], topChamferTool)
  hexNutBody = subtract(hexNutBody, positionedTopTool)

  // 6. Apply Bottom Surface Treatment
  if (bearingFaceHeight > 0 && bearingFaceDiameter > 0) {
    // Add flat bottom washer-face concentric cylinder step
    zoffset = -((hexBodyHeight / 2) + (bearingFaceHeight / 2))
    const bearingFace = cylinder({
      radius: bearingFaceRadius,
      height: bearingFaceHeight,
      center: [0, 0, zoffset],
      segments
    })
    hexNutBody = centerZ(union(hexNutBody, bearingFace))
  } else {
    const bottomChamferTool = mirrorZ(topChamferTool)
    const positionedBottomTool = translate([0, 0, -zoffset], bottomChamferTool)
    hexNutBody = subtract(hexNutBody, positionedBottomTool)
  }

  // 7. Apply ultimate global structural Z-axis translation offset
  return translate([0, 0, zOffset], hexNutBody)
}

// See https://www.fastenersuperstore.com/category/nuts
// TODO add AcornNut
// TODO add CastleNut
// TODO add FlangeNut
// TODO add SquareNut

