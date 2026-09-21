import { primitives, booleans, transforms } from '@jscad/modeling';

const { cylinder, torus } = primitives;
const { union, intersect } = booleans;
const { translate } = transforms;

/**
 * Calculates standard thread length (b) for imperial bolts per ASME guidelines
 * @param {number} d - Nominal Diameter (inches)
 * @param {number} l - Overall Bolt Length (inches)
 * @returns {number} Standard thread length allocation (inches)
 */
function calculateASMEThreadLength(d, l) {
  if (l <= 6.0) return (2 * d) + 0.25;
  return (2 * d) + 0.50;
}

/**
 * Main Generator for Imperial UTS Hex Bolts using JSCAD V3 with a 30-degree Top Chamfer
 * Workspace: All calculations and output primitives are strictly in Millimeters (mm).
 * 
 * @param {Object} params - Sizing parameters passed from your UTS parsers (in inches)
 * @param {Function} createThread - Your external thread generation module
 */
export function generateUTSBoltInMM(params, createThread) {
  // --- INCH TO MM WORKSPACE CONVERSION ---
  const MM_PER_INCH = 25.4;

  const nominalDiameter = params.nominalDiameter * MM_PER_INCH; // 'd'
  const totalLength     = params.totalLength * MM_PER_INCH;     // 'l'
  const widthAcrossFlats= params.widthAcrossFlats * MM_PER_INCH;// 's'
  const headHeight      = params.headHeight * MM_PER_INCH;      // 'k'
  
  const { threadSeries, threadTolerance, tpi } = params;

  // 1. GENERATE THE BASE HEX HEAD
  // Circumscribed Radius = Inscribed Radius (s/2) / cos(30 deg)
  const inscribedRadius = widthAcrossFlats / 2;
  const circumscribedRadius = inscribedRadius / Math.cos(Math.PI / 6);
  
  let rawHexHead = cylinder({
    radius: circumscribedRadius,
    height: headHeight,
    segments: 6,
    center: [0, 0, headHeight / 2] // Bottom of head sits at Z=0
  });

  // 2. APPLY THE 30-DEGREE TOP CHAMFER CONE INTERSECTION
  // To create a perfect chamfer where the circle hits the flat wrench faces, 
  // the cutting cone base radius must match the inscribed radius (s/2) at the top surface (Z = headHeight)
  const chamferAngleRad = (30 * Math.PI) / 180;
  
  // Calculate the required extra height of the cone tip above the head face
  // tan(30) = inscribedRadius / extraConeHeight -> extraConeHeight = inscribedRadius / tan(30)
  const extraConeHeight = inscribedRadius / Math.tan(chamferAngleRad);
  const totalConeHeight = headHeight + extraConeHeight;

  // The base radius of the complete cone at Z=0 is totalConeHeight * tan(30)
  const coneBaseRadius = totalConeHeight * Math.tan(chamferAngleRad);

  const chamferCone = cylinder({
    radiusStart: coneBaseRadius, // Base radius at the bottom
    radiusEnd: 0,                // Pointed tip at the top
    height: totalConeHeight,
    segments: 64,                // Smooth rounding
    center: [0, 0, totalConeHeight / 2] // Align bottom of cone flush with bottom of head (Z=0)
  });

  // The intersection of the hex prism and the bounding cone creates a perfect 30-degree chamfer crown
  const finishedHexHead = intersect(rawHexHead, chamferCone);

  // 3. CALCULATE INCH BOUNDS FOR PARTIAL THREADING AND CONVERT
  const standardB_Inches = calculateASMEThreadLength(params.nominalDiameter, params.totalLength);
  const threadLength_Inches = (params.totalLength <= standardB_Inches) ? params.totalLength : standardB_Inches;
  
  const threadLength = threadLength_Inches * MM_PER_INCH;
  const unthreadedLength = totalLength - threadLength;

  const assemblyParts = [finishedHexHead];

  // 4. GENERATE THE UNDER-HEAD ROUND FILLET (TORUS)
  const filletRadius = Math.max(0.4, Number((nominalDiameter * 0.04).toFixed(2))); // Safe min of 0.4mm
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

  // 5. GENERATE SHAFT SEGMENTS (IN MM)
  // A. Smooth Shoulder Segment
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
    // Pass parameters converted to mm or keep native if your thread module handles scale flags
    const threadMesh = createThread(nominalDiameter, threadLength, {
      standard: 'UTS',
      isInternal: false,
      isFine: (threadSeries === 'UNF'),
      tolerance: 0.0,
      segmentsPerTurn: 32
    });

    const positionedThread = translate(
      [0, 0, -unthreadedLength - (threadLength / 2)], 
      threadMesh
    );
    
    assemblyParts.push(positionedThread);
  }

  // 6. COMBINE AND RETURN SOLID IN MM
  return union(...assemblyParts);
}

