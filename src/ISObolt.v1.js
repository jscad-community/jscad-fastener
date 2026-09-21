import { primitives, booleans, transforms } from '@jscad/modeling';

const { cylinder } = primitives;
const { union } = booleans;
const { translate } = transforms;

/**
 * Calculates ISO 4014 Standard Thread Length (b)
 * @param {number} d - Nominal Diameter (mm)
 * @param {number} l - Overall Bolt Length (mm)
 * @returns {number} Standard thread length allocation
 */
function calculateISO4014ThreadLength(d, l) {
  if (l <= 125) return (2 * d) + 6;
  if (l <= 200) return (2 * d) + 12;
  return (2 * d) + 25;
}

/**
 * Main Generator for Standard Hex Bolts using JSCAD V3
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
  // Circumscribed Radius = Inscribed Radius (s/2) / cos(30 deg)
  const circumscribedRadius = (widthAcrossFlats / 2) / Math.cos(Math.PI / 6);
  
  const hexHead = cylinder({
    radius: circumscribedRadius,
    height: headHeight,
    segments: 6,
    center: [0, 0, headHeight / 2] // Bottom of head sits at Z=0
  });

  // 2. CALCULATE SEGMENT BOUNDARIES
  let threadLength = totalLength; // Default for ISO 4017 (Full thread)
  
  if (standard === "ISO 4014") {
    const standardB = calculateISO4014ThreadLength(nominalDiameter, totalLength);
    threadLength = Math.min(standardB, totalLength);
  }
  
  const unthreadedLength = totalLength - threadLength;

  // 3. GENERATE CORE BODIES
  const assemblyParts = [hexHead];

  // A. Smooth Shoulder Segment (For ISO 4014)
  if (unthreadedLength > 0) {
    const smoothShank = cylinder({
      radius: nominalDiameter / 2,
      height: unthreadedLength,
      segments: 32,
      center: [0, 0, -unthreadedLength / 2] // Extends down from under-head plane
    });
    assemblyParts.push(smoothShank);
  }

  // B. Helical Thread Segment Integration
  if (threadLength > 0) {
    // Standard numerical tolerance fallback translation based on ISO 965 limits if needed
    const toleranceOffset = threadTolerance === '6g' ? -0.03 : 0.0; 

    // Invoke your pre-existing thread module
    const threadMesh = createThread(nominalDiameter, threadLength, {
      standard: 'ISO',
      isInternal: false,
      isFine: (threadSeries === 'Fine'),
      tolerance: toleranceOffset,
      segmentsPerTurn: 32
    });

    // Move the thread module down to the bottom of the unthreaded shank shoulder.
    // Assumes your thread module builds from its local [0,0,0] downward or is centered; 
    // adjusting below assumes a model centering strategy matching JSCAD primitive conventions.
    const positionedThread = translate(
      [0, 0, -unthreadedLength - (threadLength / 2)], 
      threadMesh
    );
    
    assemblyParts.push(positionedThread);
  }

  // 4. COMBINE AND RETURN COMPOSITE SOLIDS
  return union(...assemblyParts);
}

