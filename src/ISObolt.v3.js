import { cylinder, torus, union, intersect, translate } from '@jscad/modeling';

import { createThread } from './threads.v3.js'


/**
 * Calculates ISO 4014 Standard Thread Length (b)
 */
const calculateISO4014ThreadLength = (d, l) => {
  if (l <= 125) return (2 * d) + 6;
  if (l <= 200) return (2 * d) + 12;
  return (2 * d) + 25;
}

/**
 * Generator for ISO Hex Metric Bolts.
 *
 * NOTE: All calculations and outputs are natively in millimeters (mm).
 * 
 * @param {Object} params - Sizing parameters passed from your ISO parsers
 */
export const generateISOBolt = (options = {}) => {
  const {
    nominalDiameter,  // 'd' (e.g., 12)
    totalLength,      // 'l' (e.g., 50)
    widthAcrossFlats, // 's' (e.g., 18)
    headHeight,       // 'k' (e.g., 7.5)
    standard,         // String: "ISO 4017" or "ISO 4014"
  +  threadSeries,     // String: "Coarse" or "Fine"
  +  threadTolerance,  // String: "6g"
    segments = 32
  } = options

  // 1. GENERATE THE BASE HEX HEAD
  // Circumscribed Radius = Inscribed Radius (s/2) / cos(30 deg)
  const inscribedRadius = widthAcrossFlats / 2;
  const circumscribedRadius = inscribedRadius / Math.cos(Math.PI / 6);
  
  let rawHexHead = cylinder({
    radius: circumscribedRadius,
    height: headHeight,
    segments: 6,
    center: [0, 0, headHeight / 2] // Bottom of head sits right at Z=0
  });
return rawHexHead

  // 2. APPLY THE 30-DEGREE TOP CHAMFER CONE INTERSECTION
  // The cutting cone's surface must touch the inscribed flat boundary (s/2) at the very top plane (Z = headHeight)
  const chamferAngleRad = (30 * Math.PI) / 180;
  
  // Calculate the required extra height of the cone tip peaking past the head face
  // tan(30) = inscribedRadius / extraConeHeight -> extraConeHeight = inscribedRadius / tan(30)
  const extraConeHeight = inscribedRadius / Math.tan(chamferAngleRad);
  const totalConeHeight = headHeight + extraConeHeight;

  // Compute the total base radius of the cutting cone at the bottom plane (Z=0)
  const coneBaseRadius = totalConeHeight * Math.tan(chamferAngleRad);

  const chamferCone = cylinder({
    radiusStart: coneBaseRadius, // Wide base at Z=0
    radiusEnd: 0,                // Pointed vertex at the top
    height: totalConeHeight,
    segments,
    center: [0, 0, totalConeHeight / 2] // Bottom of cone flush with bottom of head (Z=0)
  });

  // Intersect cuts off only the outermost apex tips, shaping a perfect 30° beveled hex crown
  const finishedHexHead = intersect(rawHexHead, chamferCone);

  // 3. CALCULATE THREAD SEGMENT BOUNDARIES
  let threadLength = totalLength; 
  if (standard === "ISO 4014") {
    const standardB = calculateISO4014ThreadLength(nominalDiameter, totalLength);
    threadLength = Math.min(standardB, totalLength);
  }
  const unthreadedLength = totalLength - threadLength;

  const assemblyParts = [finishedHexHead];

  // 4. GENERATE THE UNDER-HEAD ROUND FILLET (TORUS)
  const filletRadius = Math.max(0.2, Number((nominalDiameter * 0.05).toFixed(2))); 
  const shaftRadius = nominalDiameter / 2;
  const torusMajorRadius = shaftRadius + filletRadius;

  const cornerFillet = torus({
    innerRadius: shaftRadius,
    outerRadius: torusMajorRadius,
    innerSegments: 16,
    outerSegments: 32
  });

  const positionedFillet = translate([0, 0, -filletRadius], cornerFillet);
  assemblyParts.push(positionedFillet);

  // 5. GENERATE SHAFT SEGMENTS
  // A. Smooth Shoulder Segment (For partial ISO 4014 threading)
  if (unthreadedLength > 0) {
    const smoothShank = cylinder({
      radius: shaftRadius,
      height: unthreadedLength,
      segments,
      center: [0, 0, -unthreadedLength / 2]
    });
    assemblyParts.push(smoothShank);
  }

  // B. Helical Thread Segment Integration
  if (threadLength > 0) {
    const toleranceOffset = threadTolerance === '6g' ? -0.03 : 0.0; 

    const threadMesh = createThread(nominalDiameter, threadLength, {
      standard: 'ISO',
      isInternal: false,
      isFine: (threadSeries === 'Fine'),
      tolerance: toleranceOffset,
      segments
    });

    const positionedThread = translate(
      [0, 0, -unthreadedLength - (threadLength / 2)], 
      threadMesh
    );
    
    assemblyParts.push(positionedThread);
  }

  // 6. COMBINE AND RETURN FINAL METRIC GEOMETRY
  return union(...assemblyParts);
}

