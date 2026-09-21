import { primitives, booleans, transforms } from '@jscad/modeling';

const { cylinder, torus } = primitives;
const { union } = booleans;
const { translate } = transforms;

/**
 * Calculates ISO 4014 Standard Thread Length (b)
 */
function calculateISO4014ThreadLength(d, l) {
  if (l <= 125) return (2 * d) + 6;
  if (l <= 200) return (2 * d) + 12;
  return (2 * d) + 25;
}

/**
 * Main Generator for Standard Hex Bolts using JSCAD V3 with a rounded fillet
 * @param {Object} params - Sizing parameters passed from your parsers
 * @param {Function} createThread - Your external thread generation module
 */
export function generateISO0Bolt(params, createThread) {
  const {
    nominalDiameter,  // 'd' (e.g., 12)
    totalLength,      // 'l' (e.g., 50)
    widthAcrossFlats, // 's' (e.g., 18)
    headHeight,       // 'k' (e.g., 7.5)
    standard,         // String: "ISO 4017" or "ISO 4014"
    threadSeries,     // String: "Coarse" or "Fine"
    threadTolerance   // String: "6g"
  } = params;

  // 1. GENERATE THE HEX HEAD
  const circumscribedRadius = (widthAcrossFlats / 2) / Math.cos(Math.PI / 6);
  
  const hexHead = cylinder({
    radius: circumscribedRadius,
    height: headHeight,
    segments: 6,
    center: [0, 0, headHeight / 2] // Bottom of head sits right at Z=0
  });

  // 2. CALCULATE SEGMENT BOUNDARIES
  let threadLength = totalLength; 
  if (standard === "ISO 4014") {
    const standardB = calculateISO4014ThreadLength(nominalDiameter, totalLength);
    threadLength = Math.min(standardB, totalLength);
  }
  const unthreadedLength = totalLength - threadLength;

  const assemblyParts = [hexHead];

  // 3. GENERATE THE ROUND FILLET (TORUS)
  // Structural fillet radius calculation rule (~5% of bolt diameter)
  const filletRadius = Math.max(0.2, Number((nominalDiameter * 0.05).toFixed(2))); 
  
  // The torus center radius aligns with the outer edge of the shaft + the cross-section radius
  const shaftRadius = nominalDiameter / 2;
  const torusMajorRadius = shaftRadius + filletRadius;

  const cornerFillet = torus({
    innerRadius: shaftRadius,
    outerRadius: torusMajorRadius,
    innerSegments: 16,
    outerSegments: 32
  });

  // Align the torus so its top half smoothly transitions into the underside of the head (Z=0)
  const positionedFillet = translate([0, 0, -filletRadius], cornerFillet);
  assemblyParts.push(positionedFillet);

  // 4. GENERATE SHAFT SEGMENTS
  // A. Smooth Shoulder Segment (For ISO 4014)
  if (unthreadedLength > 0) {
    const smoothShank = cylinder({
      radius: shaftRadius,
      height: unthreadedLength,
      segments: 32,
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
      segmentsPerTurn: 32
    });

    const positionedThread = translate(
      [0, 0, -unthreadedLength - (threadLength / 2)], 
      threadMesh
    );
    
    assemblyParts.push(positionedThread);
  }

  // 5. COMBINE AND RETURN FINAL COMPOSITE SOLID
  return union(...assemblyParts);
}

