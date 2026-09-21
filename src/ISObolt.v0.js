import { primitives, booleans, transforms } from '@jscad/modeling';

const { cylinder } = primitives;
const { union } = booleans;
const { translate } = transforms;

/**
 * Procedural function calculating ISO 4014 Standard Thread Length (b)
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
 * @param {Object} params - Sizing and configuration parameters
 */
export function generateISO0Bolt(params) {
  const {
    nominalDiameter, // 'd' (e.g., 12 for M12)
    totalLength,     // 'l' (e.g., 50 for M12x50)
    widthAcrossFlats,// 's' (Wrench flat size, e.g., 18 for M12)
    headHeight,      // 'k' (e.g., 7.5 for M12)
    standard         // String: "ISO 4017" or "ISO 4014"
  } = params;

  // 1. GENERATE THE HEX HEAD
  // In JSCAD, a cylinder with 6 segments forms a perfect hex prism centered at [0,0,0]
  // Note: Cylinder radius acts as the circumscribed radius. Wrench size (s) is the inscribed diameter.
  // Inscribed Radius = s / 2. Circumscribed Radius = Inscribed / cos(30 deg)
  const circumscribedRadius = (widthAcrossFlats / 2) / Math.cos(Math.PI / 6);
  
  const hexHead = cylinder({
    radius: circumscribedRadius,
    height: headHeight,
    segments: 6,
    center: [0, 0, headHeight / 2] // Align head bottom flush against Z=0
  });

  // 2. COMPUTE THREAD REGIONS VS SHANK SPACE
  let threadLength = totalLength; // ISO 4017 Default (Full thread)
  
  if (standard === "ISO 4014") {
    const standardB = calculateISO4014ThreadLength(nominalDiameter, totalLength);
    // Safety handling if bolt length requested is shorter than the standard thread length assignment
    threadLength = Math.min(standardB, totalLength); 
  }
  
  const unthreadedLength = totalLength - threadLength;

  // 3. GENERATE THE SHANK SEGMENTS
  const shankSegments = [];

  // Smooth unthreaded shoulder portion (For ISO 4014)
  if (unthreadedLength > 0) {
    const smoothShank = cylinder({
      radius: nominalDiameter / 2,
      height: unthreadedLength,
      segments: 32,
      center: [0, 0, -unthreadedLength / 2] // Extrude downward from under-head plane (Z=0)
    });
    shankSegments.push(smoothShank);
  }

  // Threaded body envelope portion (Simplified representation)
  if (threadLength > 0) {
    const threadedShank = cylinder({
      radius: nominalDiameter / 2,
      height: threadLength,
      segments: 32,
      center: [0, 0, -unthreadedLength - (threadLength / 2)] // Position directly under the shoulder
    });
    shankSegments.push(threadedShank);
  }

  // 4. COMBINE PRIMITIVES
  return union(hexHead, ...shankSegments);
}

// === EXPORT DEFAULT INTEGRATION ENTRY POINT FOR JSCAD UI ===
export default function main() {
  // Simulating an M12 x 50 Partially Threaded Bolt configuration
  const m12BoltProps = {
    nominalDiameter: 12,
    totalLength: 50,
    widthAcrossFlats: 18,
    headHeight: 7.5,
    standard: "ISO 4014" 
  };

  return generateISO0Bolt(m12BoltProps);
}

