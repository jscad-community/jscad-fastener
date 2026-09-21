import { colors, primitives, booleans, transforms } from '@jscad/modeling';

// Assuming createMetricThread is imported or placed in the same file scope
import { createMetricThread, METRIC_COARSE_PITCH, METRIC_FINE_PITCH } from './threads.js';

const { colorize } = colors;
const { cylinderElliptic } = primitives;
const { subtract, union } = booleans;
const { translate } = transforms;

/**
 * Dimensions lookup for standard ISO 4032 hex nuts
 */
export const METRIC_NUT_DIMENSIONS = {
  3:  { S: 5.5,  hStd: 2.4,  hThin: 1.6 },
  4:  { S: 7.0,  hStd: 3.2,  hThin: 2.2 },
  5:  { S: 8.0,  hStd: 4.0,  hThin: 2.7 },
  6:  { S: 10.0, hStd: 5.0,  hThin: 3.2 },
  8:  { S: 13.0, hStd: 6.5,  hThin: 4.0 },
  10: { S: 16.0, hStd: 8.0,  hThin: 5.0 },
  12: { S: 18.0, hStd: 10.0, hThin: 6.0 },
  16: { S: 24.0, hStd: 13.0, hThin: 8.0 },
  20: { S: 30.0, hStd: 16.0, hThin: 10.0 }
};

/**
 * Generates a complete ISO standard Hex Nut with true helical threads and 45° entry cuts
 * @param {number} d - Nominal thread diameter (mm)
 * @param {boolean} isThin - True for Jam/Thin nut, False for a Standard configuration
 * @param {boolean} isFine - True to read from fine thread pitch settings
 * @param {number} tolerance - Radial oversize parameter to ensure easy 3D printing spinning (e.g., 0.15)
 * @param {number} segmentsPerTurn - Radial precision steps
 */
export function createMetricNut(d, isThin = false, isFine = false, tolerance = 0.15, segmentsPerTurn = 48) {
  // 1. Resolve standard mechanical envelope bounding parameters
  const dims = METRIC_NUT_DIMENSIONS[d] || { S: d * 1.6, hStd: d * 0.8, hThin: d * 0.5 };
  const nutHeight = isThin ? dims.hThin : dims.hStd;
  
  // Outer flat-to-flat distance maps directly into the radius properties of cylinderElliptic 
  // We divide by cos(30 deg) so the minimum flat width matches parameter S
  const outerHexRadius = (dims.S / 2) / Math.cos(Math.PI / 6);

  // 2. Generate the outer structural 6-sided solid hex chassis
  const hexBody = translate(
    [0, 0, nutHeight / 2],
    cylinderElliptic({
      startRadius: [outerHexRadius, outerHexRadius],
      endRadius: [outerHexRadius, outerHexRadius],
      height: nutHeight,
      segments: 6 // 6 segments forces a clean hexagonal prism
    })
  );

  // 3. Generate the internal helical negative cutter tool body
  // We make it slightly longer than the nut to ensure a clean through-hole cut
  const extraToolExtension = 1.0; 
  const totalToolLength = nutHeight + extraToolExtension;

  // Call our previous thread function with isInternal = true
  // FIXME thread barfs if aa is true
  let internalThreadTool = createMetricThread(d, totalToolLength, false, isFine, tolerance * 1.5, segmentsPerTurn);

  // Center the cutting tool symmetrically relative to the hex body casing block
  internalThreadTool = translate([0, 0, -extraToolExtension / 2], internalThreadTool);

  // 4. Generate 45° countersink bevel cones to cleanly round the entrance and exit hole edges
  const pitchTable = isFine ? METRIC_FINE_PITCH : METRIC_COARSE_PITCH;
  const pitch = pitchTable[d] || (d * 0.15); 

  const csDepth = pitch * 0.50
  const innerRadius = (d / 2) + tolerance;
  const outerRadius = innerRadius + csDepth;
  
  // Bottom Entry Chamfer Cone (Wide mouth at Z=0, narrowing as it goes up to Z=csDepth)
  const bottomCountersink = translate(
    [0, 0, csDepth / 2],
    cylinderElliptic({
      startRadius: [outerRadius, outerRadius],
      endRadius: [innerRadius, innerRadius],
      height: csDepth,
      segments: segmentsPerTurn
    })
  );

  // Top Exit Chamfer Cone (Narrow at base of cut, widening out to the top face at Z=nutHeight)
  const topCountersink = translate(
    [0, 0, nutHeight - (csDepth / 2)],
    cylinderElliptic({
      startRadius: [innerRadius, innerRadius],
      endRadius: [outerRadius, outerRadius],
      height: csDepth,
      segments: segmentsPerTurn
    })
  );

  // 5. Combine the screw core and the entry bevel shapes into a unified inner clearance master tool
  const completeCutterTool = union(internalThreadTool, bottomCountersink, topCountersink);

  // 6. Subtract the composite tool volume from the solid hex block chassis to hollow out the nut
  const finishedNut = subtract(hexBody, completeCutterTool);

  return finishedNut;
}

export function main() {
  // Demonstration: Render a standard M10 Hex Nut with a 0.15mm gap for structural 3D prints
  const m10StandardNut = createMetricNut(10, false, false, 0.15, 48);
  
  return colorize([0.8, 0.5, 0.2], m10StandardNut);
}

