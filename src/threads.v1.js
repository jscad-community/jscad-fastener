import { colors, primitives, booleans, extrusions, transforms } from '@jscad/modeling';

const { colorize } = colors;
const { cylinderElliptic, polygon } = primitives;
const { intersect, union, subtract } = booleans;
const { extrudeHelical } = extrusions;
const { translate } = transforms;

/**
 * Standard ISO Metric Coarse Pitch Lookup Table
 */
const METRIC_COARSE_PITCH = {
  3: 0.5,   // M3
  4: 0.7,   // M4
  5: 0.8,   // M5
  6: 1.0,   // M6
  8: 1.25,  // M8
  10: 1.5,  // M10
  12: 1.75, // M12
  16: 2.0,  // M16
  20: 2.5   // M20
};

/**
 * Standard ISO Metric Fine Pitch Lookup Table (Most common variations)
 */
const METRIC_FINE_PITCH = {
  3: 0.35,  // M3 x 0.35
  4: 0.5,   // M4 x 0.5
  5: 0.5,   // M5 x 0.5
  6: 0.75,  // M6 x 0.75
  8: 1.0,   // M8 x 1.0
  10: 1.25, // M10 x 1.25 (Note: 1.0 is also common)
  12: 1.25, // M12 x 1.25 (Note: 1.5 is also common)
  16: 1.5,  // M16 x 1.5
  20: 1.5   // M20 x 1.5
};

/**
 * Generates a true spiral Metric Thread Segment with a precise 45° top chamfer
 * @param {number} d - Nominal Major Diameter (mm)
 * @param {number} length - Total length of the thread (mm)
 * @param {boolean} isInternal - False for bolt/external, True for nut/internal
 * @param {boolean} isFine - True to look up the Fine pitch table, False for Coarse
 * @param {number} segmentsPerTurn - Level of detail (radial steps per 360° turn)
 */
export function createMetricThread(d, length, isInternal = false, isFine = false, segmentsPerTurn = 32) {
  // 1. Resolve Pitch from the selected lookup table
  const pitchTable = isFine ? METRIC_FINE_PITCH : METRIC_COARSE_PITCH;
  const pitch = pitchTable[d] || (d * 0.15); // Dynamic proportional fallback if size isn't mapped
  
  // 2. ISO Thread Profile Calculations (H = 0.866025 * P)
  const H = 0.866025 * pitch;
  const majorRadius = d / 2;
  const minorRadius = majorRadius - (5/8 * H); 
  
  // Define chamfer height proportional to pitch (0.75P)
  const chamferHeight = pitch * 0.75;
  
  // Add 2 extra turns to ensure full structural coverage before bounding trim
  const totalTurns = (length / pitch) + 2;
  const totalAngle = totalTurns * 2 * Math.PI;
  
  // 3. Define the 60-degree V-profile 2D cross-section
  const profilePoints = [
    [minorRadius, 0],
    [majorRadius, pitch * 0.375], // Standard truncation windows
    [majorRadius, pitch * 0.625],
    [minorRadius, pitch]
  ];
  
  const ridge2D = polygon({ points: profilePoints });
  
  // 4. Extrude using true helical calculation
  let threadedHelix = extrudeHelical({
    angle: totalAngle,
    pitch: pitch,
    endAngle: totalAngle,
    segments: segmentsPerTurn
  }, ridge2D);

  // 5. Shift the thread up to correct the baseline start phase
  threadedHelix = translate([0, 0, pitch], threadedHelix);

  // 6. Define a precise bounding volume to trim uneven helical endings perfectly to [0, length]
  const cleanBounds = translate(
    [0, 0, length / 2],
    cylinderElliptic({ 
      startRadius: [majorRadius + 1, majorRadius + 1], 
      endRadius: [majorRadius + 1, majorRadius + 1], 
      height: length, 
      segments: segmentsPerTurn 
    })
  );
  
  // Apply intersection to ensure crisp flat ends at the X/Y plane and the top length limit
  const trimmedHelix = intersect(cleanBounds, threadedHelix);
  
  // 7. Assemble the core body
  let finalThreadedObject;
  if (!isInternal) {
    // External Bolt: Merge spiral ribbon to solid core cylinder shaft
    const shiftedCore = translate(
      [0, 0, length / 2],
      cylinderElliptic({ 
        startRadius: [minorRadius, minorRadius], 
        endRadius: [minorRadius, minorRadius], 
        height: length, 
        segments: segmentsPerTurn 
      })
    );
    finalThreadedObject = union(shiftedCore, trimmedHelix);
  } else {
    // Internal Nut Hole: Create the positive tool block geometry
    const shiftedOuter = translate(
      [0, 0, length / 2],
      cylinderElliptic({ 
        startRadius: [majorRadius, majorRadius], 
        endRadius: [majorRadius, majorRadius], 
        height: length, 
        segments: segmentsPerTurn 
      })
    );
    finalThreadedObject = union(shiftedOuter, trimmedHelix);
  }

  // 8. Apply the 45-degree top entry chamfer cutting tool
  // Create an oversized waste cylinder enclosing the top area
  const positionedCutterBox = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({ 
      startRadius: [majorRadius + 2, majorRadius + 2], 
      endRadius: [majorRadius + 2, majorRadius + 2], 
      height: chamferHeight + 0.1, 
      segments: segmentsPerTurn 
    })
  );
  
  // Precise Cone Tool mapping the 45-degree envelope slope (Delta R == Delta Z)
  const cRadius2 = majorRadius - chamferHeight;
  const positionedCone = translate(
    [0, 0, length - (chamferHeight / 2)],
    cylinderElliptic({
      startRadius: [majorRadius, majorRadius], // Bottom radius of the chamfer window
      endRadius: [cRadius2, cRadius2],         // Top radius of the chamfer window
      height: chamferHeight + 0.1,
      segments: segmentsPerTurn
    })
  );
  
  // Cut the cone shape out of the waste box to construct the inverse sleeve tool
  const chamferTool = subtract(positionedCutterBox, positionedCone);
  
  // Shave the inverse sleeve tool off the raw threaded body to form the clean lead-in bevel
  const chamferedBolt = subtract(finalThreadedObject, chamferTool);

  return chamferedBolt;
}

export function main() {
  // Demonstration: Render a true spiral M10 FINE thread bolt (M10 x 1.25)
  // Parameters: diameter=10, length=20, isInternal=false, isFine=true, segments=48
  const m10FineBolt = createMetricThread(10, 20, false, true, 48);
  
  return colorize([0.3, 0.6, 0.9], m10FineBolt);
}

