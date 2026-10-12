## Objects

<dl>
<dt><a href="#jscad-fastener/asme">jscad-fastener/asme</a> : <code>object</code></dt>
<dd><p>ASME Fasteners with UTS threads</p>
</dd>
<dt><a href="#jscad-fasteners">jscad-fasteners</a> : <code>object</code></dt>
<dd><p>Create ASME and ISO fasteners for JSCAD designs.</p>
</dd>
<dt><a href="#jscad-fastener/iso">jscad-fastener/iso</a> : <code>object</code></dt>
<dd><p>ISO Fasteners</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#HexHead">HexHead</a> ⇒ <code>Geom3</code></dt>
<dd><p>Generate a Bolt Hex Head with beveled hex block and optional bearing sholder.</p>
<p>NOTE: ALL DIMENSIONS ARE IN MILLIMETERS</p>
</dd>
<dt><a href="#Shank">Shank</a> ⇒ <code>Geom3</code></dt>
<dd><p>Generate a Bolt Shank extending downwards from the Z plane.</p>
<p>NOTE: ALL DIMENSIONS ARE IN MILLIMETERS</p>
</dd>
<dt><a href="#HexNut">HexNut</a> ⇒ <code>geom3</code></dt>
<dd><p>Generate a double-beveled hex block with optional bearing shoulder.</p>
<p>NOTE: ALL DIMENSIONS ARE IN MILLIMETERS</p>
</dd>
<dt><a href="#generateThread">generateThread</a> ⇒ <code>Geom3</code></dt>
<dd><p>Create a thread segment supporting ISO and UTS thread standards.</p>
<p>NOTE: All dimensions are in millimeters.</p>
</dd>
</dl>

<a name="jscad-fastener/asme"></a>

## jscad-fastener/asme : <code>object</code>
ASME Fasteners with UTS threads

**Kind**: global namespace  

* [jscad-fastener/asme](#jscad-fastener/asme) : <code>object</code>
    * [.exports.ASME_B18_2_1_CAP_SCREW](#jscad-fastener/asme.exports.ASME_B18_2_1_CAP_SCREW) : <code>Object</code>
    * [.exports.ASME_B18_2_6_STRUCTURAL](#jscad-fastener/asme.exports.ASME_B18_2_6_STRUCTURAL) : <code>Object</code>
    * [.exports.ASME_B18_2_1_HEAVY_BOLT](#jscad-fastener/asme.exports.ASME_B18_2_1_HEAVY_BOLT) : <code>Object</code>
    * [.exports.ASME_B18_6_3_MACHINE](#jscad-fastener/asme.exports.ASME_B18_6_3_MACHINE) : <code>Object</code>
    * [.exports.ASME_B18_2_1_HEX_BOLT](#jscad-fastener/asme.exports.ASME_B18_2_1_HEX_BOLT) : <code>Object</code>
    * [.exports.ASME_B18_2_1_TAP_BOLT](#jscad-fastener/asme.exports.ASME_B18_2_1_TAP_BOLT) : <code>Object</code>
    * [.exports.getHexBoltDimensions](#jscad-fastener/asme.exports.getHexBoltDimensions)
    * [.exports.generateHexBolt](#jscad-fastener/asme.exports.generateHexBolt) ⇒ <code>Geom3</code>
    * [.exports.ASME_B18_2_2_HEX_STANDARD](#jscad-fastener/asme.exports.ASME_B18_2_2_HEX_STANDARD) : <code>Object</code>
    * [.exports.ASME_B18_2_2_HEX_HEAVY](#jscad-fastener/asme.exports.ASME_B18_2_2_HEX_HEAVY) : <code>Object</code>
    * [.exports.ASME_B18_2_2_SQUARE](#jscad-fastener/asme.exports.ASME_B18_2_2_SQUARE) : <code>Object</code>
    * [.exports.ASME_B18_2_2_HEX_THIN_JAM](#jscad-fastener/asme.exports.ASME_B18_2_2_HEX_THIN_JAM) : <code>Object</code>
    * [.exports.ASME_B18_2_2_HEX_HEAVY_JAM](#jscad-fastener/asme.exports.ASME_B18_2_2_HEX_HEAVY_JAM) : <code>Object</code>
    * [.exports.ASME_B18_2_6_HEX_STRUCTURAL](#jscad-fastener/asme.exports.ASME_B18_2_6_HEX_STRUCTURAL) : <code>Object</code>
    * [.exports.ASME_B18_16_6_HEX_LOCK_STANDARD](#jscad-fastener/asme.exports.ASME_B18_16_6_HEX_LOCK_STANDARD) : <code>Object</code>
    * [.exports.ASME_B18_16_6_HEX_LOCK_THIN](#jscad-fastener/asme.exports.ASME_B18_16_6_HEX_LOCK_THIN) : <code>Object</code>
    * [.exports.getNutDimensions](#jscad-fastener/asme.exports.getNutDimensions) ⇒ <code>Object</code>
    * [.exports.generateNut](#jscad-fastener/asme.exports.generateNut) ⇒ <code>Geom3</code>
    * [.exports.ASME_B18_2_8_CLEARANCE_HOLES](#jscad-fastener/asme.exports.ASME_B18_2_8_CLEARANCE_HOLES) : <code>Object</code>
    * [.exports.parseBoltSpec](#jscad-fastener/asme.exports.parseBoltSpec) ⇒ <code>Object</code>
    * [.exports.parseNutSpec](#jscad-fastener/asme.exports.parseNutSpec) ⇒ <code>Object</code>
    * [.exports.parseWasherSpec](#jscad-fastener/asme.exports.parseWasherSpec) ⇒ <code>Object</code>
    * [.exports.ASME_B18_21_1_TYPE_A_NARROW](#jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_A_NARROW) : <code>Object</code>
    * [.exports.ASME_B18_21_1_TYPE_A_WIDE](#jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_A_WIDE) : <code>Object</code>
    * [.exports.ASTM_F436_STRUCTURAL](#jscad-fastener/asme.exports.ASTM_F436_STRUCTURAL) : <code>Object</code>
    * [.exports.ASME_B18_21_1_LOCK_REGULAR](#jscad-fastener/asme.exports.ASME_B18_21_1_LOCK_REGULAR) : <code>Object</code>
    * [.exports.ASME_B18_21_1_LOCK_HEAVY](#jscad-fastener/asme.exports.ASME_B18_21_1_LOCK_HEAVY) : <code>Object</code>
    * [.exports.ASME_B18_21_1_TOOTH_EXTERNAL](#jscad-fastener/asme.exports.ASME_B18_21_1_TOOTH_EXTERNAL) : <code>Object</code>
    * [.exports.ASME_B18_21_1_TOOTH_INTERNAL](#jscad-fastener/asme.exports.ASME_B18_21_1_TOOTH_INTERNAL) : <code>Object</code>
    * [.exports.ASME_B18_21_1_TYPE_B_REGULAR](#jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_B_REGULAR) : <code>Object</code>
    * [.exports.ASME_B18_21_1_TYPE_B_NARROW](#jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_B_NARROW) : <code>Object</code>
    * [.exports.ASME_B18_21_1_TYPE_B_WIDE](#jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_B_WIDE) : <code>Object</code>
    * [.exports.getWasherDimensions](#jscad-fastener/asme.exports.getWasherDimensions) ⇒ <code>Object</code>
    * [.exports.generateWasher](#jscad-fastener/asme.exports.generateWasher)
    * [.exports.UTS_THREADS](#jscad-fastener/asme.exports.UTS_THREADS) : <code>Object</code>
    * [.exports.getThreadSpec](#jscad-fastener/asme.exports.getThreadSpec) ⇒ <code>Object</code>

<a name="jscad-fastener/asme.exports.ASME_B18_2_1_CAP_SCREW"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_1\_CAP\_SCREW : <code>Object</code>
ASME B18.2.1: Hex Cap Screws (Inch Series).

DESIGN NOTES:
- Governs precision-finished fasteners with tight dimensional tolerances.
- Intended to thread directly into precision-tapped holes or use with precision nuts.
- Shorter nominal lengths are often fully threaded, transitioning to partial threads as lengths scale.
- Features a mandatory, precision-machined circular washer face (dw) on the head underside to prevent corner gouging.
- Standard sizes range from 1/4" up to 3" within typical commercial inventory catalogs.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_6_STRUCTURAL"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_6\_STRUCTURAL : <code>Object</code>
ASME B18.2.6: Fasteners for Use in Structural Applications - Heavy Hex Structural Bolts.

DESIGN NOTES:
- High-strength fasteners explicitly engineered for structural steel-to-steel building connections.
- Governs specialized material classifications such as ASTM F3125 (Grade A325 or A490) high-strength variations.
- Shares the same extra-wide Width Across Flats (WAF) as the heavy hex bolt family to avoid surface indentation.
- Features a tightly controlled, flat underside washer-faced bearing surface (dw) to control perpendicularity.
- Size scope is structurally capped by the standard from 1/2" up to 1-1/2" diameters.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_1_HEAVY_BOLT"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_1\_HEAVY\_BOLT : <code>Object</code>
ASME B18.2.1: Heavy Hex Bolts (Inch Series).

DESIGN NOTES:
- Specifies heavy-duty, unrefined fasteners utilized in heavy machinery and structural assemblies.
- Features a significantly wider Width Across Flats (WAF) footprint than general-purpose bolts to maximize bearing area.
- Head heights (k) are noticeably thicker to withstand massive high-preload clamping stresses.
- Lacks an isolated circular washer face step under the head, bounding dw directly to the broad hex profile.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_6_3_MACHINE"></a>

### jscad-fastener/asme.exports.ASME\_B18\_6\_3\_MACHINE : <code>Object</code>
ASME B18.6.3: Machine Screws - Hexagon Head Variant (Inch Series).

DESIGN NOTES:
- Governs small-diameter mechanical and electronic assembly fasteners.
- Covers the minor numbered gauge parameters (#2 through #12) along with small fractional sizes up to 3/4".
- Features a radically different head geometric footprint that does not scale with heavy structural profiles.
- Head profiles can be indented hex or flat hex configurations depending on specified sub-manufacturing codes.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_1_HEX_BOLT"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_1\_HEX\_BOLT : <code>Object</code>
ASME B18.2.1: Hex Bolts - General Purpose (Inch Series).

DESIGN NOTES:
- Governs raw, general-use commercial hex fasteners with relaxed manufacturing tolerances.
- Primarily intended to pass through standard clearance holes and be secured with a nut.
- Features a flat head underside that is NOT precision-machined with an isolated washer face step.
- Under engineering practice, the bearing surface diameter (dw) is bounded directly to the basic width across flats (s).
- Standard sizes range from 1/4" up to 3" diameters.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_1_TAP_BOLT"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_1\_TAP\_BOLT : <code>Object</code>
ASME B18.2.1: Hex Tap Bolts - Fully Threaded (Inch Series).

DESIGN NOTES:
- Governs general-use hexagon fasteners that are continuously threaded all the way to the head.
- Acts as the raw, full-thread alternative to a general-purpose hex bolt.
- Head dimensions (WAF and height) align completely with standard raw Hex Bolts rather than Cap Screws.
- Head underside is non-machined, bounding the bearingFaceDiameter (dw) directly to the width across flats (s).

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.getHexBoltDimensions"></a>

### jscad-fastener/asme.exports.getHexBoltDimensions
getHexBoldD

NOTE: All dimensions are inches.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.generateHexBolt"></a>

### jscad-fastener/asme.exports.generateHexBolt ⇒ <code>Geom3</code>
Generate ASME Hex Bolt from the given specification.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Geom3</code> - ASME bolt, centered on X-Y, head above Z, shank below Z  
**See**: getHexBoltDimensions()  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | bolt specification |
| spec.size | <code>String</code> | Dimension identifier (e.g., '#1' or `1/2`) |
| spec.standard | <code>String</code> | Bolt standard; ASME_B18_2_1_CAP_SCREW, etc |
| spec.threadSeries | <code>String</code> | Thread series of bolt; UNF or UNC |

<a name="jscad-fastener/asme.exports.ASME_B18_2_2_HEX_STANDARD"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_2\_HEX\_STANDARD : <code>Object</code>
ASME B18.2.2 Hex Standard Nut (Finished Hex Nut) 

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_2_HEX_HEAVY"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_2\_HEX\_HEAVY : <code>Object</code>
ASME B18.2.2 Hex Heavy Nut

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_2_SQUARE"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_2\_SQUARE : <code>Object</code>
ASME B18.2.2 Regular Square Nut

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]
Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_2_HEX_THIN_JAM"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_2\_HEX\_THIN\_JAM : <code>Object</code>
ASME B18.2.2 Thin Jam Nut

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_2_HEX_HEAVY_JAM"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_2\_HEX\_HEAVY\_JAM : <code>Object</code>
ASME B18.2.2 Heavy Jam Nut

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_2_6_HEX_STRUCTURAL"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_6\_HEX\_STRUCTURAL : <code>Object</code>
ASME B18.2.6 Heavy Hex Nuts

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_16_6_HEX_LOCK_STANDARD"></a>

### jscad-fastener/asme.exports.ASME\_B18\_16\_6\_HEX\_LOCK\_STANDARD : <code>Object</code>
ASME B18.16.6 Style NE Standard Nylon-Insert Lock Nuts

Schema Layout: "Designation": [widthAcrossFlats (W), hex height (min), total height(max)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_16_6_HEX_LOCK_THIN"></a>

### jscad-fastener/asme.exports.ASME\_B18\_16\_6\_HEX\_LOCK\_THIN : <code>Object</code>
ASME B18.16.6 Style NE Thin Nylon-Insert Lock Nuts

Schema Layout: "Designation": [widthAcrossFlats (W), hex height (min), total height(max)]

Maintained in precise decimal inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.getNutDimensions"></a>

### jscad-fastener/asme.exports.getNutDimensions ⇒ <code>Object</code>
Get the hex nut dimensions for the given ASME nut specification.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Object</code> - hex nut dimensions; widthAcrossFlats, height, bearingFaceHeight (mm)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | specification for construction |
| [spec.size] | <code>String</code> |  | required, size of ASME nut, see lists above |
| [spec.standard] | <code>String</code> |  | ASME standard or none (use other specs to choose) |
| [spec.isHeavy] | <code>Boolean</code> | <code>false</code> | generate nuts with heavy dimensions |
| [spec.isThin] | <code>Boolean</code> | <code>false</code> | generate nuts with thin (jam) dimensions |
| [spec.flatOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |
| [spec.heightOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |

<a name="jscad-fastener/asme.exports.generateNut"></a>

### jscad-fastener/asme.exports.generateNut ⇒ <code>Geom3</code>
Generate a ASME Nut from the given specification.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Geom3</code> - hex nut, centered on XYZ  
**See**: getNutDimensions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | specification for construction |
| spec.widthAcrossFlats | <code>Number</code> |  | width across the flats, i.e. wrench size (WAF) |
| spec.height | <code>Number</code> |  | total thickness/height of the nut (H) |
| spec.bearingFaceHeight | <code>Number</code> |  | height of the bottom washer step (C), may be zero |
| spec.segments | <code>Number</code> | <code>36</code> | number of segments per full turn |

**Example**  
```js
const spec = getHexNutDimensions({size: 'M10', isHeavy: true})
const nut = generateHexNut(spec)
```
<a name="jscad-fastener/asme.exports.ASME_B18_2_8_CLEARANCE_HOLES"></a>

### jscad-fastener/asme.exports.ASME\_B18\_2\_8\_CLEARANCE\_HOLES : <code>Object</code>
ASME B18.2.8 Bolt Clearance Hole Diameters (all values in inches)

Sourced natively from #0 to 1-1/2", scaled proportionally to 4" 
based on standard ASME structural allowance thresholds.

Formatted with explicit keys for: close, normal, and loose fit conditions.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.parseBoltSpec"></a>

### jscad-fastener/asme.exports.parseBoltSpec ⇒ <code>Object</code>
Parses ASME bolt specifications.

NOTE: All returned specifications are inches.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Object</code> - Standardized token payload  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>string</code> | specification |

<a name="jscad-fastener/asme.exports.parseNutSpec"></a>

### jscad-fastener/asme.exports.parseNutSpec ⇒ <code>Object</code>
Parses ASME nut specification.

NOTE: All returned specifications are inches.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Object</code> - Perfectly structured token array with metric drilling limits  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>string</code> | specification |

<a name="jscad-fastener/asme.exports.parseWasherSpec"></a>

### jscad-fastener/asme.exports.parseWasherSpec ⇒ <code>Object</code>
Parses ASME washer specification.

NOTE: All returned specifications are inches.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Object</code> - Clean token matching the exact structure of your ISO washer parser.  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>string</code> | specification |

<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_A_NARROW"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TYPE\_A\_NARROW : <code>Object</code>
ASME B18.22.1 is now a combined standard, it contains several different dimensions depending on the washer type.

ASME B18.22.1 Type A (Narrow / SAE)

NOTE: Dimensions are in inches

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_A_WIDE"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TYPE\_A\_WIDE : <code>Object</code>
ASME B18.22.1 is now a combined standard, it contains several different dimensions depending on the washer type.

ASME B18.22.1 Type A (Wide / USS)

NOTE: Dimensions are in inches

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASTM_F436_STRUCTURAL"></a>

### jscad-fastener/asme.exports.ASTM\_F436\_STRUCTURAL : <code>Object</code>
ASTM F436 - Standard Specification for Hardened Steel Washers

Profile Geometry: Chamfered outer edge angled between 35° and 45° on at least one face

Dimensions: Structural series. The inner diameter is sized to clear high-strength bolt shanks,
while the outer diameter and heavy thickness are scaled to match heavy structural bolt heads.

NOTE: Dimensions are in inches

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_LOCK_REGULAR"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_LOCK\_REGULAR : <code>Object</code>
ASME B18.21.1 Regular Series Helical Spring Lock Washers

Range Covered: #0 to 4" (Extrapolated using heavy mechanical metrics past 3")

Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]

Maintained in precise decimal Inches (in).

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_LOCK_HEAVY"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_LOCK\_HEAVY : <code>Object</code>
ASME B18.21.1 Heavy Series Helical Spring Lock Washers

Range Covered: #0 to 4" (Includes heavy machinery scaled boundary allocations)

Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]

Features expanded outside diameters and massive thickness walls to handle high torque.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TOOTH_EXTERNAL"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TOOTH\_EXTERNAL : <code>Object</code>
ASME B18.21.1 External Tooth Lock (Star) Washers

Range Covered: #2 to 1-3/4" (Complete Official Standard Bounds)

Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]

Maintained in precise decimal Inches (in).

Outer diameter bounds map to the furthest biting tooth perimeter apex.

Note: Sizes #0, #1, and sizes larger than 1-3/4" do not exist under ASME B18.21.1.

Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TOOTH_INTERNAL"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TOOTH\_INTERNAL : <code>Object</code>
ASME B18.21.1 Internal Tooth Lock (Star) Washers

Range Covered: #2 to 1-3/4" (Complete Official Standard Bounds)

Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]

Maintained in precise decimal Inches (in).

Note: Sizes #0, #1, and sizes larger than 1-3/4" do not exist under ASME B18.21.1.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_B_REGULAR"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TYPE\_B\_REGULAR : <code>Object</code>
**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_B_NARROW"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TYPE\_B\_NARROW : <code>Object</code>
**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.ASME_B18_21_1_TYPE_B_WIDE"></a>

### jscad-fastener/asme.exports.ASME\_B18\_21\_1\_TYPE\_B\_WIDE : <code>Object</code>
**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
<a name="jscad-fastener/asme.exports.getWasherDimensions"></a>

### jscad-fastener/asme.exports.getWasherDimensions ⇒ <code>Object</code>
Get the overall washer dimensions for the given specification.

NOTE: Returned dimensions are millimeters.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Object</code> - washer dimensions: innerRadius, outerRadius, thickness (mm)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | specification for construction |
| [spec.size] | <code>String</code> |  | required, size of ASME washer, see lists above |
| [spec.isHeavy] | <code>Boolean</code> | <code>false</code> | get dimensions for heavy washers |
| [spec.isLocking] | <code>Boolean</code> | <code>false</code> | get locking washer dimensions |
| [spec.isInternal] | <code>Boolean</code> | <code>false</code> | get locking washer with internal stars |
| [spec.isExternal] | <code>Boolean</code> | <code>false</code> | get locking washer with external stars |
| [spec.idOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |
| [spec.odOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |
| [spec.thicknessOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |

<a name="jscad-fastener/asme.exports.generateWasher"></a>

### jscad-fastener/asme.exports.generateWasher
Generate a solid washer manifold using the given dimensions.

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**See**: getWasherDimensions  

| Param | Type | Description |
| --- | --- | --- |
| specifications | <code>object</code> | washer specifications |

<a name="jscad-fastener/asme.exports.UTS_THREADS"></a>

### jscad-fastener/asme.exports.UTS\_THREADS : <code>Object</code>
UTS (Unified Thread Standard) Dimensions (inches)

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**See**: https://www.engineeringtoolbox.com/unified-screw-threads-unc-unf-d_1809.html

NOTE: All dimensions are in inches

Array mapping per size: [ majorDiameter, coarseTPI, fineTPI ]

Note: Uses `null` where a specific coarse/fine TPI does not officially exist.  
<a name="jscad-fastener/asme.exports.getThreadSpec"></a>

### jscad-fastener/asme.exports.getThreadSpec ⇒ <code>Object</code>
Get the thread specification for the given size and thread series.

NOTE: All dimensions are inches

**Kind**: static constant of [<code>jscad-fastener/asme</code>](#jscad-fastener/asme)  
**Returns**: <code>Object</code> - specification with majorDiameter, pitch, isFine  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>Number</code> \| <code>String</code> | Dimension identifier; #0 or '1/2' |
| threadSeries | <code>String</code> | Thread series of bolt; UNC or UNF |

<a name="jscad-fasteners"></a>

## jscad-fasteners : <code>object</code>
Create ASME and ISO fasteners for JSCAD designs.

**Kind**: global namespace  
**Requires**: <code>module:@jscad/modeling@^3.0.0</code>  
**License**: MIT  
<a name="jscad-fastener/iso"></a>

## jscad-fastener/iso : <code>object</code>
ISO Fasteners

**Kind**: global namespace  

* [jscad-fastener/iso](#jscad-fastener/iso) : <code>object</code>
    * [.exports.parseISOAssembly](#jscad-fastener/iso.exports.parseISOAssembly)
    * [.exports.generateISOAssembly3D](#jscad-fastener/iso.exports.generateISOAssembly3D) ⇒ <code>Object</code>
    * [.exports.ISO_4014_HEX_BOLT](#jscad-fastener/iso.exports.ISO_4014_HEX_BOLT) : <code>Object</code>
    * [.exports.ISO_4016_HEX_BOLT_C](#jscad-fastener/iso.exports.ISO_4016_HEX_BOLT_C) : <code>Object</code>
    * [.exports.ISO_4017_HEX_SCREW](#jscad-fastener/iso.exports.ISO_4017_HEX_SCREW) : <code>Object</code>
    * [.exports.ISO_7411_HEX_STRUCTURAL](#jscad-fastener/iso.exports.ISO_7411_HEX_STRUCTURAL) : <code>Object</code>
    * [.exports.ISO_7045_PAN_MACHINE](#jscad-fastener/iso.exports.ISO_7045_PAN_MACHINE) : <code>Object</code>
    * [.exports.DIN_601_HEX_BOLT_C](#jscad-fastener/iso.exports.DIN_601_HEX_BOLT_C) : <code>Object</code>
    * [.exports.DIN_931_HEX_BOLT](#jscad-fastener/iso.exports.DIN_931_HEX_BOLT) : <code>Object</code>
    * [.exports.DIN_933_HEX_SCREW](#jscad-fastener/iso.exports.DIN_933_HEX_SCREW) : <code>Object</code>
    * [.exports.DIN_6914_HEX_STRUCTURAL](#jscad-fastener/iso.exports.DIN_6914_HEX_STRUCTURAL) : <code>Object</code>
    * [.exports.DIN_7985_PAN_MACHINE](#jscad-fastener/iso.exports.DIN_7985_PAN_MACHINE) : <code>Object</code>
    * [.exports.getHexBoltDimensions](#jscad-fastener/iso.exports.getHexBoltDimensions) ⇒ <code>Object</code>
    * [.exports.generateHexBolt](#jscad-fastener/iso.exports.generateHexBolt) ⇒ <code>Geom3</code>
    * [.exports.ISO_4032_HEX_STANDARD](#jscad-fastener/iso.exports.ISO_4032_HEX_STANDARD) : <code>Object</code>
    * [.exports.ISO_7414_HEX_STRUCTURAL_HEAVY](#jscad-fastener/iso.exports.ISO_7414_HEX_STRUCTURAL_HEAVY) : <code>Object</code>
    * [.exports.ISO_4033_HEX_HIGH_NUTS](#jscad-fastener/iso.exports.ISO_4033_HEX_HIGH_NUTS) : <code>Object</code>
    * [.exports.ISO_4035_HEX_THIN_JAM](#jscad-fastener/iso.exports.ISO_4035_HEX_THIN_JAM) : <code>Object</code>
    * [.exports.ISO_7040_LOCK_STANDARD](#jscad-fastener/iso.exports.ISO_7040_LOCK_STANDARD) : <code>Object</code>
    * [.exports.ISO_10511_LOCK_THIN](#jscad-fastener/iso.exports.ISO_10511_LOCK_THIN) : <code>Object</code>
    * [.exports.ISO_7041_LOCK_HIGH](#jscad-fastener/iso.exports.ISO_7041_LOCK_HIGH) : <code>Object</code>
    * [.exports.DIN_557_SQUARE](#jscad-fastener/iso.exports.DIN_557_SQUARE) : <code>Object</code>
    * [.exports.getNutDimensions](#jscad-fastener/iso.exports.getNutDimensions) ⇒ <code>Object</code>
    * [.exports.generateNut](#jscad-fastener/iso.exports.generateNut) ⇒ <code>Geom3</code>
    * [.exports.ISO_273_CLEARANCE_HOLES](#jscad-fastener/iso.exports.ISO_273_CLEARANCE_HOLES) : <code>Object</code>
    * [.exports.parseBoltSpec](#jscad-fastener/iso.exports.parseBoltSpec)
    * [.exports.parseNutSpec](#jscad-fastener/iso.exports.parseNutSpec)
    * [.exports.parseWasherSpec](#jscad-fastener/iso.exports.parseWasherSpec) ⇒ <code>Object</code>
    * [.exports.parseISOFastener](#jscad-fastener/iso.exports.parseISOFastener)
    * [.exports.validateISOMetricAssembly](#jscad-fastener/iso.exports.validateISOMetricAssembly)
    * [.exports.ISO_THREADS](#jscad-fastener/iso.exports.ISO_THREADS) : <code>Object</code>
    * [.exports.getThreadSpec](#jscad-fastener/iso.exports.getThreadSpec) ⇒ <code>Object</code>
    * [.exports.ISO_7089](#jscad-fastener/iso.exports.ISO_7089) : <code>Object</code>
    * [.exports.ISO_7090](#jscad-fastener/iso.exports.ISO_7090) : <code>Object</code>
    * [.exports.ISO_7091](#jscad-fastener/iso.exports.ISO_7091) : <code>Object</code>
    * [.exports.ISO_7092](#jscad-fastener/iso.exports.ISO_7092) : <code>Object</code>
    * [.exports.ISO_7093](#jscad-fastener/iso.exports.ISO_7093) : <code>Object</code>
    * [.exports.DIN_6797_A](#jscad-fastener/iso.exports.DIN_6797_A) : <code>Object</code>
    * [.exports.DIN_6797_J](#jscad-fastener/iso.exports.DIN_6797_J) : <code>Object</code>
    * [.exports.DIN_7980](#jscad-fastener/iso.exports.DIN_7980) : <code>Object</code>
    * [.exports.EN_14399_6](#jscad-fastener/iso.exports.EN_14399_6) : <code>Object</code>
    * [.exports.DIN_127_B](#jscad-fastener/iso.exports.DIN_127_B) : <code>Object</code>
    * [.exports.ISO_7094](#jscad-fastener/iso.exports.ISO_7094) : <code>Object</code>
    * [.exports.getWasherDimensions](#jscad-fastener/iso.exports.getWasherDimensions) ⇒ <code>Object</code>
    * [.exports.generateWasher](#jscad-fastener/iso.exports.generateWasher)

<a name="jscad-fastener/iso.exports.parseISOAssembly"></a>

### jscad-fastener/iso.exports.parseISOAssembly
Full Assembly Parser for ISO / Metric Systems
Takes a compound engineering stack description and breaks it into parsed tokens.
Supported Formats:
 - "Hexagon head bolt ISO 4014 - M12 x 80 - 8.8, with Plain washer ISO 7090, Hex nut ISO 4032"
 - "M6 x 0.75 x 40 Bolt + ISO 7092 Washer + ISO 4032 Nut"
 - "ISO 4017 Bolt M16 x 60 - 10.9 HDG Finish; ISO 7090 Washer; ISO 4032 Nut"

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.generateISOAssembly3D"></a>

### jscad-fastener/iso.exports.generateISOAssembly3D ⇒ <code>Object</code>
Procedural 3D Assembly Generator for ISO Fastener Stack in JSCAD V3
Handles optional washers and nuts seamlessly without crashing.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Object</code> - Unified 3D assembly mesh  

| Param | Type | Description |
| --- | --- | --- |
| assemblyConfig | <code>Object</code> | Specifications for each component (bolt required; washer/nut optional) |
| clampThickness | <code>number</code> | Total material thickness being joined together (mm) |
| modules | <code>Object</code> | Reference pointers to your 3D creation functions |

<a name="jscad-fastener/iso.exports.ISO_4014_HEX_BOLT"></a>

### jscad-fastener/iso.exports.ISO\_4014\_HEX\_BOLT : <code>Object</code>
ISO 4014: Hexagon head bolts - Product grades A and B.

DESIGN NOTES:
- This standard governs partially threaded bolts featuring a plain, unthreaded body shank.
- Grade A applies to sizes M1.6 to M24 (lengths <= 150mm); Grade B applies to sizes > M24 or lengths > 150mm.
- Features modern ISO Width Across Flats (WAF) specifications for M10 (16mm), M12 (18mm), and M14 (21mm).
- Incorporates a precision-machined, circular underside bearing face (dw).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_4016_HEX_BOLT_C"></a>

### jscad-fastener/iso.exports.ISO\_4016\_HEX\_BOLT\_C : <code>Object</code>
ISO 4016: Hexagon head bolts - Product grade C.

DESIGN NOTES:
- This standard defines "rough" or heavy black finish bolts with broad dimensional tolerances.
- Intended for low-preload architectural steel staging, agricultural setups, and heavy non-precision framing.
- Typically limited to low carbon-steel property classes (e.g., 4.6 or 5.6).
- Does NOT feature a machined circular bearing face underside; dw is bounded to the full flat profile footprint.
- Historically equivalent to the legacy DIN 601 structural standard.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_4017_HEX_SCREW"></a>

### jscad-fastener/iso.exports.ISO\_4017\_HEX\_SCREW : <code>Object</code>
ISO 4017: Hexagon head screws - Product grades A and B.

DESIGN NOTES:
- This standard governs fully threaded fasteners (screws threaded completely to the head).
- It acts as the direct metric equivalent to an ASME B18.2.1 Tap Bolt or fully threaded Cap Screw.
- Grade A applies to sizes M1.6 to M24 (lengths <= 150mm); Grade B applies to sizes > M24 or lengths > 150mm.
- Features standard ISO Width Across Flats (WAF) specifications for M10 (16mm), M12 (18mm), and M14 (21mm).
- Incorporates a precision-machined, circular underside bearing face (dw).

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7411_HEX_STRUCTURAL"></a>

### jscad-fastener/iso.exports.ISO\_7411\_HEX\_STRUCTURAL : <code>Object</code>
ISO 7411: Hexagon bolts for high-strength structural bolting with large width across flats.

DESIGN NOTES:
- This standard governs heavy-duty structural steel fasteners designed for high preloads.
- Features significantly wider Width Across Flats (WAF) envelopes than precision ISO 4014 bolts 
  to maximize the joint's bearing area and prevent thread stripping.
- Natively corresponds to the legacy structural DIN 6914 standard profile.
- Product scope traditionally spans strictly from M12 to M36.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7045_PAN_MACHINE"></a>

### jscad-fastener/iso.exports.ISO\_7045\_PAN\_MACHINE : <code>Object</code>
ISO 7045: Pan head screws with type H or type Z cross recess - Product grade A.

DESIGN NOTES:
- This standard governs precision, cross-recessed pan head machine screws.
- Used exclusively for smaller mechanical and electronic assemblies (M1.6 up to M10).
- Because it is a circular head profile, the 2nd slot [1] tracks Head Diameter (dk).
- The 4th slot [3] tracks the flat underside bearing surface diameter (dw) per ISO 7045 Grade A geometric limits.
- Supersedes and aligns closely with the historical legacy DIN 7985 standard profile.

Pattern: [majorDiameter (d), headDiameter (s/dk), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_601_HEX_BOLT_C"></a>

### jscad-fastener/iso.exports.DIN\_601\_HEX\_BOLT\_C : <code>Object</code>
DIN 601: Hexagon head bolts with nut - Product grade C.

DESIGN NOTES:
- This standard defines "rough" or heavy unmachined black/galvanized bolts with wide tolerances.
- Incorporates traditional legacy DIN spanner/WAF exceptions for M10 (17mm), M12 (19mm), and M14 (22mm).
- Because it lacks a machined circular relief step, dw tracks the full flat hex profile.
- This standard serves as the functional downstream analog to ISO_4016_HEX_BOLT_C.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_931_HEX_BOLT"></a>

### jscad-fastener/iso.exports.DIN\_931\_HEX\_BOLT : <code>Object</code>
DIN 931: Hexagon head bolts with shank - Metric coarse thread.

MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_4014_HEX_BOLT

DESIGN NOTES:
- This standard governs precision partially threaded bolts featuring a plain unthreaded body shank.
- Preserves the legacy DIN wrench/WAF spanner contact sizes for M10 (17mm), M12 (19mm), M14 (22mm), and M22 (32mm).
- Incorporates a precision-machined circular underside washer bearing face step (dw).

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_933_HEX_SCREW"></a>

### jscad-fastener/iso.exports.DIN\_933\_HEX\_SCREW : <code>Object</code>
DIN 933: Hexagon head screws - Threaded up to the head, metric coarse.

MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_4017_HEX_SCREW

DESIGN NOTES:
- This standard governs precision fully threaded screws (threaded completely up to the head).
- Preserves the legacy DIN wrench/WAF spanner contact sizes for M10 (17mm), M12 (19mm), M14 (22mm), and M22 (32mm).
- Incorporates a precision circular underside washer bearing face step (dw).

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_6914_HEX_STRUCTURAL"></a>

### jscad-fastener/iso.exports.DIN\_6914\_HEX\_STRUCTURAL : <code>Object</code>
DIN 6914: Hexagon bolts for high-strength structural bolting (HV bolts).

MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_7411_HEX_STRUCTURAL

DESIGN NOTES:
- This standard governs heavy-duty structural steel fasteners designed for high preloads.
- Features wider Width Across Flats (WAF) envelopes than standard bolts to maximize contact area.
- Product scope spans strictly from M12 to M36.

Pattern: [majorDiameter (d), widthAcrossFlats (s), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_7985_PAN_MACHINE"></a>

### jscad-fastener/iso.exports.DIN\_7985\_PAN\_MACHINE : <code>Object</code>
DIN 7985: Cross recessed pan head screws.

MAPS TO FUNCTIONAL DOWNSTREAM EQUIVALENT: ISO_7045_PAN_MACHINE

DESIGN NOTES:
- This standard governs precision, cross-recessed pan head machine screws.
- Used exclusively for smaller mechanical and electronic assemblies (M2 up to M10).
- Because it is a circular head profile, the 2nd slot tracks Head Diameter (dk).
- The 4th slot tracks the flat underside bearing surface diameter (dw) per DIN geometric limits.

Pattern: [majorDiameter (d), headDiameter (s/dk), headHeight (k), bearingFaceDiameter (dw), filletRadius (r)]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.getHexBoltDimensions"></a>

### jscad-fastener/iso.exports.getHexBoltDimensions ⇒ <code>Object</code>
Get the ISO Hex Bolt dimensions for the given specification.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Object</code> - full ISO bolt specification with dimensions  
**See**: parseBoltSpec()

If the standard is not provided then a standard will be select using the isHeavy and isTap options.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | bolt specifications |
| spec.size | <code>String</code> |  | Dimension identifier (e.g., 'M6' for M6 ISO) |
| [spec.standard] | <code>String</code> | <code></code> | Bolt standard; null or valid ISO standard |
| [spec.threadSeries] | <code>String</code> | <code>&#x27;COARSE&#x27;</code> | Thread series of bolt; coarse or fine |

<a name="jscad-fastener/iso.exports.generateHexBolt"></a>

### jscad-fastener/iso.exports.generateHexBolt ⇒ <code>Geom3</code>
Generate ISO Hex Bolt from the given specification.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Geom3</code> - ISO bolt, centered on X-Y, head above Z, shank below Z  
**See**: getHexBoltDimensions() for obtaining the specifications  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | bolt specifications |
| spec.size | <code>String</code> | Dimension identifier (e.g., 'M6' for M6 ISO) |
| spec.standard | <code>String</code> | Bolt standard; ISO 4014 or ISO 4017 |
| spec.threadSeries | <code>String</code> | Thread series of bolt; coarse or fine |

<a name="jscad-fastener/iso.exports.ISO_4032_HEX_STANDARD"></a>

### jscad-fastener/iso.exports.ISO\_4032\_HEX\_STANDARD : <code>Object</code>
ISO 4032 Hex Standard Nuts

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7414_HEX_STRUCTURAL_HEAVY"></a>

### jscad-fastener/iso.exports.ISO\_7414\_HEX\_STRUCTURAL\_HEAVY : <code>Object</code>
ISO 7414 Hex Structual Heavy Nuts

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_4033_HEX_HIGH_NUTS"></a>

### jscad-fastener/iso.exports.ISO\_4033\_HEX\_HIGH\_NUTS : <code>Object</code>
ISO 4033 Style 2 Hex High-Clamping Nuts

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_4035_HEX_THIN_JAM"></a>

### jscad-fastener/iso.exports.ISO\_4035\_HEX\_THIN\_JAM : <code>Object</code>
ISO 4035 Style 0 Hex Standard Nut (Metric Coarse)

NOTE: ISO 8675 defines the same dimensions but uses metric fine pitch threads.

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7040_LOCK_STANDARD"></a>

### jscad-fastener/iso.exports.ISO\_7040\_LOCK\_STANDARD : <code>Object</code>
**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_10511_LOCK_THIN"></a>

### jscad-fastener/iso.exports.ISO\_10511\_LOCK\_THIN : <code>Object</code>
**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7041_LOCK_HIGH"></a>

### jscad-fastener/iso.exports.ISO\_7041\_LOCK\_HIGH : <code>Object</code>
**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_557_SQUARE"></a>

### jscad-fastener/iso.exports.DIN\_557\_SQUARE : <code>Object</code>
DIN 557 Square Standard Nut

Schema Layout: "Designation": [widthAcrossFlats (W), height (H)]

Maintained in precise millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.getNutDimensions"></a>

### jscad-fastener/iso.exports.getNutDimensions ⇒ <code>Object</code>
Get the hex nut dimensions for the given ISO specification.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Object</code> - hex nut dimensions; widthAcrossFlats, height, bearingFaceHeight (mm)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | specification for construction |
| [spec.size] | <code>String</code> |  | required, size of ISO nut, see lists above |
| [spec.isHeavy] | <code>Boolean</code> | <code>false</code> | generate nuts with heavy dimensions |
| [spec.isThin] | <code>Boolean</code> | <code>false</code> | generate nuts with thin (jam) dimensions |
| [spec.flatOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |
| [spec.heightOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |

<a name="jscad-fastener/iso.exports.generateNut"></a>

### jscad-fastener/iso.exports.generateNut ⇒ <code>Geom3</code>
Generate a ISO Hex from the given specification.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Geom3</code> - hex nut, centered on XYZ  
**See**: getNutDimensions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | specification for construction |
| spec.widthAcrossFlats | <code>Number</code> |  | width across the flats, i.e. wrench size (WAF) |
| spec.height | <code>Number</code> |  | total thickness/height of the nut (H) |
| spec.bearingFaceHeight | <code>Number</code> |  | height of the bottom bearing step (C), may be zero |
| spec.segments | <code>Number</code> | <code>36</code> | number of segments per full turn |

**Example**  
```js
const spec = getNutDimensions({size: 'M10', isHeavy: true})
const nut = generateNut(spec)
```
<a name="jscad-fastener/iso.exports.ISO_273_CLEARANCE_HOLES"></a>

### jscad-fastener/iso.exports.ISO\_273\_CLEARANCE\_HOLES : <code>Object</code>
ISO 273 Bolt Clearance Hole Diameters (all values in mm)

Map structure optimized for clean, semantic UI and geometry engine routing.

Formatted with explicit keys for: close (H12), normal (H13), and loose (H14) fit conditions.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.parseBoltSpec"></a>

### jscad-fastener/iso.exports.parseBoltSpec
Procedural function calculating bolt specifications.

Dynamically appends ISO 273 clearance hole guidelines based on the nominal size.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.parseNutSpec"></a>

### jscad-fastener/iso.exports.parseNutSpec
TBW

Dynamically outputs tap drill hole sizing with absolute structural limits.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.parseWasherSpec"></a>

### jscad-fastener/iso.exports.parseWasherSpec ⇒ <code>Object</code>
Parses metric/ISO/DIN washer specification strings.
Maintained strictly in millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Object</code> - Clean token matching the unified formatting footprint of the system.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | e.g., "Plain Washer, ISO 7089, M12, 200HV, Zinc" |

<a name="jscad-fastener/iso.exports.parseISOFastener"></a>

### jscad-fastener/iso.exports.parseISOFastener
**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.validateISOMetricAssembly"></a>

### jscad-fastener/iso.exports.validateISOMetricAssembly
METRIC ISO ASSEMBLY VALIDATION ENGINE WITH TOLERANCE CHECKS

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_THREADS"></a>

### jscad-fastener/iso.exports.ISO\_THREADS : <code>Object</code>
ISO Metric Threads (ISO 261 / ISO 724)

NOTE: All dimensions are in millimeters.

"Designation": [Major_Diameter, Coarse_TPI, Fine_TPI]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.getThreadSpec"></a>

### jscad-fastener/iso.exports.getThreadSpec ⇒ <code>Object</code>
Get the thread specification for the given size and thread series.

NOTE: All dimensions are in millimeters

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Object</code> - specification with majorDiameter, pitch, isFine  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>Number</code> \| <code>String</code> | Dimension identifier; 6 or 'M6' |
| threadSeries | <code>String</code> | Thread series of bolt; coarse or fine |

<a name="jscad-fastener/iso.exports.ISO_7089"></a>

### jscad-fastener/iso.exports.ISO\_7089 : <code>Object</code>
ISO 7089 - Plain washers — Normal series — Product grade A

Replaces DIN 125 A

Profile Geometry: Flat, square outer edge (No chamfer)

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7090"></a>

### jscad-fastener/iso.exports.ISO\_7090 : <code>Object</code>
ISO 7090 - Plain washers with chamfer — Normal series — Product grade A

Replaces DIN 125 B

Profile Geometry: Chamfered (beveled/sloped) outer edge

Dimensions: Normal series. (Outer diameter ≈ 2× nominal thread size)

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7091"></a>

### jscad-fastener/iso.exports.ISO\_7091 : <code>Object</code>
ISO 7091 - Plain washers — Normal series — Product grade C

Replaces DIN 126

Profile Geometry: Flat, square outer edge (No chamfer)

Dimensions: Normal series. The outer diameter matches ISO 7089/7090,
but the inner diameter is punched significantly looser (larger tolerances) to accommodate lower-grade fasteners.

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7092"></a>

### jscad-fastener/iso.exports.ISO\_7092 : <code>Object</code>
ISO 7092 - Plain washers — Small series — Product grade A

Replaces DIN 433

Profile Geometry: Flat, square outer edge (No chamfer)

Dimensions: Small series. The outer diameter is tightly constrained, roughly 1.5× to 1.8× the thread size

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7093"></a>

### jscad-fastener/iso.exports.ISO\_7093 : <code>Object</code>
ISO 7093 - Plain washers — Large series — Product grade A and C

Replaces DIN 9021

Profile Geometry: Flat, square outer edge (No chamfer)

Dimensions: Large series. The outer diameter is dramatically enlarged, roughly 3× the nominal thread size

"Designation": [insideDiameter, outsideDiameter, thickness]

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_6797_A"></a>

### jscad-fastener/iso.exports.DIN\_6797\_A : <code>Object</code>
DIN 6797 Form A External Tooth Lock (Star) Washers

Range Covered: M1.6 to M30 (Complete Official German Standard Bounds)

Schema Layout: "Designation": [insideDiameter (d1), outsideDiameter (d2), thickness (s)]

Maintained strictly in precise decimal Millimeters (mm).

Note: Sizes below M1.6 and sizes larger than M30 do not exist under DIN 6797.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_6797_J"></a>

### jscad-fastener/iso.exports.DIN\_6797\_J : <code>Object</code>
DIN 6797 Form J Internal Tooth Lock (Star) Washers

Range Covered: M2 to M30 (Complete Official German Standard Bounds)

Schema Layout: "Designation": [insideDiameter (d1), outsideDiameter (d2), thickness (s)]

Maintained strictly in precise decimal Millimeters (mm).

Note: Per the official DIN standard authority limits:
  - Sizes M1, M1.2, and M1.6 are completely omitted as internal tooth geometry
    at micro-scales causes structural metal stress fractures.
  - Sizes larger than M30 do not exist because thin internal tabs easily 
    flatten or strip out under heavy industrial structural preload torques.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_7980"></a>

### jscad-fastener/iso.exports.DIN\_7980 : <code>Object</code>
Complete Official DIN 7980 High-Collar Lock Washer Registry

Exact Sizing Envelope Range: M2 to M48 (All standard physical sizes)

Schema Layout: "Designation": [insideDiameter, outsideDiameter, thickness]

Maintained strictly in precise decimal Millimeters (mm).

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.EN_14399_6"></a>

### jscad-fastener/iso.exports.EN\_14399\_6 : <code>Object</code>
EN 14399-6 (Formerly DIN 6916) High-Strength Preload Structural Washers

Schema Layout: "Designation": [insideDiameter (d1), outsideDiameter (d2), thickness (h)]

Maintained strictly in precise decimal Millimeters (mm).

Note: These washers feature an explicit external perimeter chamfer and 
are tightly bounded between M12 and M64 due to heavy engineering rules.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.DIN_127_B"></a>

### jscad-fastener/iso.exports.DIN\_127\_B : <code>Object</code>
DIN 127 B Helical Spring Split Lock Washers with square ends

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.ISO_7094"></a>

### jscad-fastener/iso.exports.ISO\_7094 : <code>Object</code>
ISO 7094 Plain washers — Extra large series — Product grade C

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
<a name="jscad-fastener/iso.exports.getWasherDimensions"></a>

### jscad-fastener/iso.exports.getWasherDimensions ⇒ <code>Object</code>
Get the overall washer dimensions for the given specification.

NOTE: Returned dimensions are millimeters.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**Returns**: <code>Object</code> - washer dimensions: innerRadius, outerRadius, thickness (mm)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  | specification for construction |
| [spec.size] | <code>String</code> |  | required, size of ISO / ASME washer, see lists above |
| [spec.standard] | <code>String</code> | <code></code> | ISO standard or none |
| [spec.isHeavy] | <code>Boolean</code> | <code>false</code> | get dimensions for heavy washers |
| [spec.isLocking] | <code>Boolean</code> | <code>false</code> | get locking washer dimensions |
| [spec.isInternal] | <code>Boolean</code> | <code>false</code> | get locking washer with internal stars |
| [spec.isExternal] | <code>Boolean</code> | <code>false</code> | get locking washer with external stars |
| [spec.idOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |
| [spec.odOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |
| [spec.thicknessOffset] | <code>Number</code> | <code>0</code> | clearance for oversized cutouts |

<a name="jscad-fastener/iso.exports.generateWasher"></a>

### jscad-fastener/iso.exports.generateWasher
Generate a solid washer manifold using the given dimensions.

**Kind**: static constant of [<code>jscad-fastener/iso</code>](#jscad-fastener/iso)  
**See**: getWasherDimensions  

| Param | Type | Description |
| --- | --- | --- |
| specifications | <code>object</code> | washer specifications |

<a name="HexHead"></a>

## HexHead ⇒ <code>Geom3</code>
Generate a Bolt Hex Head with beveled hex block and optional bearing sholder.

NOTE: ALL DIMENSIONS ARE IN MILLIMETERS

**Kind**: global constant  
**Returns**: <code>Geom3</code> - bolt hex head sitting above Z=0  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | The head specification |
| spec.widthAcrossFlats | <code>Number</code> | Wrench size across flats (s) in mm |
| spec.headHeight | <code>Number</code> | Total standard head height (k) in mm |
| spec.bearingFaceDiameter | <code>Number</code> | Bearing face diameter (dw) in mm |
| spec.filletRadius | <code>Number</code> | Fillet radius (f) in mm |
| spec.majorDiameter | <code>Number</code> | Nominal (major) diameter (d) in mm |
| spec.segments | <code>Number</code> | Segments per full rotation |

<a name="Shank"></a>

## Shank ⇒ <code>Geom3</code>
Generate a Bolt Shank extending downwards from the Z plane.

NOTE: ALL DIMENSIONS ARE IN MILLIMETERS

**Kind**: global constant  
**Returns**: <code>Geom3</code> - bolt shank, centered on X-Y, extending downwards from Z  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | The shank specifications |
| spec.threadLength | <code>Number</code> | Length of the threaded section (b) in mm |
| spec.unthreadedLength | <code>Number</code> | Length of smooth shank section in mm |
| spec.segments | <code>Number</code> | Segments per full rotation |

<a name="HexNut"></a>

## HexNut ⇒ <code>geom3</code>
Generate a double-beveled hex block with optional bearing shoulder.

NOTE: ALL DIMENSIONS ARE IN MILLIMETERS

**Kind**: global constant  
**Returns**: <code>geom3</code> - - A valid 3D JSCAD V3 solid geometry object.  

| Param | Type | Description |
| --- | --- | --- |
| widthAcrossFlats | <code>number</code> | Width across the flats, i.e. wrench size (WAF) |
| height | <code>number</code> | Total thickness/height of the nut (H) |
| bearingFaceHeight | <code>number</code> | Height of the bearing washer step (C). May be zero. |
| zOffset | <code>number</code> | Z-axis translation offset to position/center the assembly |

<a name="generateThread"></a>

## generateThread ⇒ <code>Geom3</code>
Create a thread segment supporting ISO and UTS thread standards.

NOTE: All dimensions are in millimeters.

**Kind**: global constant  
**Returns**: <code>Geom3</code> - thread body, extending up from Z  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | Generation configurations |
| spec.isInternal | <code>Boolean</code> | False for bolt/external, True for nut/internal |
| spec.majorDiameter | <code>Number</code> | Major diameter of thread body |
| spec.pitch | <code>Number</code> | Pitch of threads |
| spec.tolerance | <code>Number</code> | Radial offset value in mm (e.g. 0.15 for 3D prints) |
| spec.segments | <code>Number</code> | Segments per full rotation |
| length | <code>Number</code> | Total length of the thread to generate |

