# TROPICAL VOXEL SINGAPORE: ART STYLE & INTERIOR MICROCLIMATE SPECIFICATION
**Procedural High-Density Tropical Architecture & Computational Indoor Microclimate Engine**
*Framework: React · Three.js · TypeScript · BCA Green Mark GM:2021 · Singapore NEA Climate Data*

---

## 1. EXECUTIVE SUMMARY & DESIGN PHILOSOPHY

**TropiVoxel Singapore** is an architectural simulation sandbox engineered for high-density, tropical public housing (HDB - Housing & Development Board). It fuses two computational disciplines into a single real-time interactive engine:

1. **The Art Style**: A hybrid of the **Colorfigures Hand-Inked Isometric aesthetic**, **Monument Valley isometric pastel surrealism**, and **Tactile Modular PPVC (Prefabricated Prefinished Volumetric Construction) Brutalism**. The buildings read as tactile, premium collector models—featuring soft chamfered concrete edges, visible stud grids, warm paper backgrounds, ink silhouette outlines, flat blue cast shadows, and an x-ray "See-Through" mode revealing internal living spaces.
2. **The Microclimate Calculation Engine**: A physics-grounded, floor-by-floor and voxel-by-voxel simulation of Singapore's equatorial microclimate. The engine quantifies atmospheric boundary-layer wind velocity profiles, void deck Venturi breezeway acceleration, dual-aspect cross-ventilation flow rates ($Q$), Air Changes per Hour ($\text{ACH}$), Envelope Thermal Transfer Value ($\text{ETTV}$), solar insolation penalties, daylight factors ($\text{DF}\%$), and indoor operative temperature ($T_{op}$) evaluated against the **Singapore Building and Construction Authority (BCA) Green Mark GM:2021 Natural Ventilation** standards.

---

## 2. PART I: THE ART STYLE GUIDE

### 2.1 The Visual Triad
The visual identity is governed by three foundational pillars:
- **Tactile Toy Precision**: Buildings look tangible, like bespoke wooden or matte resin architectural miniatures displayed on a physical drafting plinth. Surfaces possess subtle micro-roughness ($0.38 - 0.52$) and distinct chamfers ($0.08\times$ voxel radius) that catch glancing rim highlights.
- **Monument Valley Isometric Perspective**: Orthographic isometric projection ($35.264^\circ$ tilt angle, $45^\circ$ planar rotation) eliminates perspective distortion, creating crisp parallel lines, geometric interlocking massing, and stepped circulation towers.
- **Colorfigures Hand-Inked Graphic Linework**: Every structural voxel is traced with multi-tier graphic ink edges:
  * *Outer Silhouette Ink* ($\text{weight} \approx 2.8\text{px}$): Delimits the building volume against the pastel background.
  * *Panel & Module Seams* ($\text{weight} \approx 1.8\text{px}$): Marks the structural joints between individual $3.6\text{m}$ PPVC room modules.
  * *Fine Interior Chamfers* ($\text{weight} \approx 0.8 - 1.2\text{px}$): Details internal louvers, breezeway openings, and balustrades.

### 2.2 Color Theory & Singapore Housing Estate Palettes
In Singapore, HDB estates are internationally renowned for their bold, identity-defining chromatic schemes. TropiVoxel translates these into calibrated three-tone palettes (`light / mid / dark` normal-banded tones):

| Estate Palette | Inspiration | Light Hex | Mid Hex | Accent / Shadow Hex | Architectural Signifier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Redhill Vermilion** | Redhill MRT & Bukit Merah slab blocks | `#FF8A80` | `#E53935` | `#B71C1C` / `#2C1820` | Dynamic lift cores, shear walls |
| **Tiong Bahru Mint** | 1930s SIT Streamline Moderne curves | `#B2DFDB` | `#4DB6AC` | `#00796B` / `#162E2B` | Rounded balconies, external staircases |
| **Marine Parade Ultramarine** | East Coast modernist ocean blocks | `#90CAF9` | `#1E88E5` | `#0D47A1` / `#0F1D38` | Cross-breeze sunshades, wave fascias |
| **Tampines Sunburst** | 1980s brick-and-terracotta estates | `#FFE082` | `#FFA000` | `#E65100` / `#362208` | Terracotta gable walls, checkerboard slabs |
| **Tropical Brutalism** | Exposed off-form architectural precast | `#ECEFF1` | `#90A4AE` | `#37474F` / `#1C242B` | Structural columns, deep window hoods |

### 2.3 Modular Voxel Grid & Precast PPVC Anatomy
1. **Grid Unit Dimensions**:
   - Default Grid Size: $3.6\text{m} \times 3.6\text{m} \times 3.6\text{m}$ ($46.66\text{ m}^3$ volumetric envelope).
   - Dynamic Scalability: User-selectable between $2.4\text{m}$, $3.0\text{m}$, $3.6\text{m}$, $4.2\text{m}$, and $4.8\text{m}$.
   - Clearance Height: $2.8\text{m}$ internal structural clear height with $0.4\text{m}$ slab and service void.
2. **Volumetric PPVC Types**:
   - `void_colonnade`: Ground-floor pilotis / void deck with open breezeway apertures and pilotis columns.
   - `unit_2rm` to `unit_5rm`: Living units equipped with deep recess window reveals ($0.6\text{m}$ solar overhangs).
   - `sky_garden`: Double-height communal green terraces with biophilic plantings, porous planters, and open airflow louvers.
   - `rooftop_solar`: Rooftop photovoltaic pergolas angled at $5^\circ$ South with rain-water catchment trays.
   - `lift_core`: Reinforced concrete structural spine with shear-wall texture.

### 2.4 See-Through Ghost Shell & Cutaway Mechanism
Following the Colorfigures principle of **"See-Through"**, users can inspect internal mechanisms with a single click:
- When toggled, the opaque precast exterior transitions to a frosted ghost shell ($\text{opacity} = 0.18$, refractive index $1.05$, sky-tinted edge glow).
- The internal volume reveals:
  * Furniture arrangement and partition layout.
  * Cross-ventilation airflow paths (blue streamtubes entering windward windows and discharging through leeward corridors).
  * Color-coded thermal voxel cores (emerald green $\le 27.5^\circ\text{C}$, sky blue $28^\circ\text{C} - 29^\circ\text{C}$, amber $30^\circ\text{C}$, coral $> 31^\circ\text{C}$).
- Floor Slicing: Clicking any level (e.g., Level 7) isolates the active slab, elevating floors above by $+12\text{m}$ along the vertical axis for an unobstructed floor-plate sectional perspective.

### 2.5 Lighting, Shadow & Camera Setup
- **Equatorial Sun System**: Mathematically accurate solar path at latitude $1.3521^\circ\text{ N}$. High midday solar altitude ($85^\circ - 88^\circ$ elevation angle) generates short, intense direct solar footprints, while low-angle morning/afternoon sun ($15^\circ - 35^\circ$) casts long diagonal raking shadows across facade panels.
- **Warm Paper Canvas**: The 3D viewport sits on a warm parchment-tinted backdrop (`#1E222B` in dark simulation mode; `#F4EFE6` in print publication mode).
- **Flat Blue Cast Shadow**: Inked shadow planes cast onto the ground plinth with a cyan/deep-navy tint (`rgba(15, 23, 42, 0.45)`), preventing muddy black shadows and evoking classic architectural drafting ink.

### 2.6 Wind CFD Streamline Visuals
- Streamlines are drawn as 3D particle vectors moving at localized velocities ($v(x, y, z)$).
- Particles accelerate through the ground-level void deck (Venturi constriction) and curl gently over sky terrace openings.
- Color gradient maps from deep cyan ($0.2\text{ m/s}$, stagnant) to electric turquoise ($1.2\text{ m/s}$, comfortable breeze) to lime yellow ($> 2.5\text{ m/s}$, accelerated jet).

---

## 3. PART II: MATHEMATICAL FORMULATIONS & MICROCLIMATE PHYSICS

### 3.1 Singapore Climatological Framework
Singapore has a tropical rainforest climate (Köppen *Af*) characterized by high uniform temperatures, high relative humidity ($70\% - 95\%$), abundant rainfall, and low average wind speeds ($1.5 - 3.5\text{ m/s}$) punctuated by seasonal monsoons.

The diurnal ambient dry-bulb temperature $T_{amb}(t)$ is modeled as a sinusoidal wave peaking at 14:30 SGT:

$$T_{amb}(t) = \bar{T} + A_T \cdot \cos\left( \frac{2\pi (t - 14.5)}{24} \right)$$

Where:
- $t$: Hour of the day in SGT ($0.0 \le t \le 24.0$).
- $\bar{T} = 29.5^\circ\text{C}$: Mean annual Singapore ambient temperature.
- $A_T = 4.0^\circ\text{C}$: Diurnal thermal amplitude ($T_{min} = 25.5^\circ\text{C}$ at 06:30, $T_{max} = 33.5^\circ\text{C}$ at 14:30).

**Monsoon Regimes**:
1. *Northeast (NE) Monsoon (Dec – Mar)*: Predominant wind direction $\theta_{wind} \approx 40^\circ$ (NNE), steady average speeds $\bar{V}_{ref} \approx 3.2\text{ m/s}$.
2. *Southwest (SW) Monsoon (Jun – Sep)*: Predominant wind direction $\theta_{wind} \approx 215^\circ$ (SSW), gusty average speeds $\bar{V}_{ref} \approx 2.4\text{ m/s}$.
3. *Inter-Monsoon (Apr – May, Oct – Nov)*: Light and variable breezes, $\bar{V}_{ref} \approx 1.6\text{ m/s}$, high thermal convective instability.

---

### 3.2 Atmospheric Boundary Layer & Wind Velocity Profile
Wind speed increases with height above ground due to diminished ground-friction shear stress. For Singapore suburban and high-density urban environments, the wind velocity at elevation $z$ (meters) follows the **Power Law wind profile** (Singapore Code of Practice CP 11 / Eurocode 1 Category III/IV):

$$V(z) = V_{10} \cdot \left( \frac{z}{z_{10}} \right)^\alpha$$

Where:
- $z_{10} = 10.0\text{ m}$: Standard meteorological reference height.
- $V_{10} = \text{Monsoon free-stream velocity at } 10\text{m}$ ($2.4 - 3.2\text{ m/s}$).
- $\alpha = 0.22$: Terrain roughness exponent for suburban/high-rise residential fabric.
- $z$: Unit elevation in meters, computed from voxel floor index $y$:
  $$z(y) = (y + 1) \cdot S_{voxel}$$
  where $S_{voxel}$ is the module edge length ($3.6\text{m}$).

---

### 3.3 Building Porosity, Pressure Differential & Venturi Void Decks
Air movement through a residential building envelope is driven by the surface wind pressure coefficient differential ($\Delta C_p$) across opposite facades:

$$\Delta P = \frac{1}{2} \rho_{air} \cdot V(z)^2 \cdot \Delta C_p$$

$$\Delta C_p = C_{p,windward} - C_{p,leeward}$$

For a standard orthogonal Singapore block:
- Windward facade ($0^\circ$ incidence): $C_{p,windward} \approx +0.65$ to $+0.75$.
- Leeward facade (suction wake): $C_{p,leeward} \approx -0.25$ to $-0.35$.
- Normal net differential: $\Delta C_p \approx 0.90 - 1.10$.

**The Void Deck Venturi Amplification**:
The traditional Singapore HDB ground-level "Void Deck" leaves the entire ground floor open between pilotis columns. This converts the base of the tower into an aerodynamic nozzle. The air velocity through the void colonnade $V_{void}$ experiences a Venturi constriction bonus:

$$V_{void} = V(z_{ground}) \cdot K_{venturi} \cdot \left( \frac{A_{gross}}{A_{throat}} \right)$$

Where $K_{venturi} \approx 1.65$ to $1.85$, accelerating ground breezes to $2.2 - 3.2\text{ m/s}$ and purging stagnant heat islands.

---

### 3.4 Cross-Ventilation vs Single-Sided Airflow Rates ($Q$ and $\text{ACH}$)

#### A. Dual-Aspect Cross-Ventilation
When a unit possesses window openings on opposite exterior facades (e.g. North and South exterior exposures), the volumetric cross-ventilation flow rate $Q_{cross}$ ($\text{m}^3/\text{s}$) is calculated using the orifice discharge formula:

$$Q_{cross} = C_d \cdot A_{eff} \cdot V(z) \cdot \sqrt{\Delta C_p} \cdot \cos(\theta_{rel})$$

Where:
- $C_d \approx 0.62$: Window discharge coefficient for standard louvered/casement openings.
- $A_{eff}$: Effective opening area ($\text{m}^2$), defined by harmonic mean of inlet and outlet areas:
  $$A_{eff} = \frac{A_{in} \cdot A_{out}}{\sqrt{A_{in}^2 + A_{out}^2}}$$
  For balanced $3.6\text{m}$ modules: $A_{in} \approx A_{out} \approx 0.22 \cdot S_{voxel}^2 \approx 2.85\text{ m}^2 \implies A_{eff} \approx 2.01\text{ m}^2$.
- $\theta_{rel}$: Relative angle between wind approach vector and facade normal vector.

#### B. Single-Sided Ventilation
Units with only one exposed facade rely on wind turbulence and thermal buoyancy (stack effect):

$$Q_{single} = 0.05 \cdot A_{window} \cdot V(z)$$

#### C. Air Changes per Hour ($\text{ACH}$)
Air Changes per Hour evaluates the freshness and ventilation rate of the indoor room volume $V_{room}$:

$$\text{ACH} = \frac{Q \cdot 3600}{V_{room}}$$

Where $V_{room} = 0.85 \cdot S_{voxel}^3$ (deducting $15\%$ for structural slabs and internal wall partitions).
- **Single-Sided Flat**: Typically yields $4 - 8\text{ ACH}$.
- **Dual-Aspect Cross-Ventilated Flat**: Yields $18 - 38\text{ ACH}$, rapidly removing metabolic heat and humidity.

---

### 3.5 Envelope Thermal Transfer Value (ETTV) & Solar Gain
The Singapore BCA ETTV standard limits heat conduction and solar radiation through building facades. For any given voxel facade:

$$\text{ETTV} = 12 \cdot (1 - \text{WWR}) \cdot U_w + 3.4 \cdot \text{WWR} \cdot U_f + 211 \cdot \text{WWR} \cdot \text{CF} \cdot \text{SC}$$

Where:
- $\text{WWR}$: Window-to-Wall Ratio ($\approx 0.35$ for standard HDB PPVC units).
- $U_w$: Thermal transmittance of precast concrete wall ($1.8\text{ W/m}^2\text{K}$).
- $U_f$: Fenestration U-value ($2.8\text{ W/m}^2\text{K}$).
- $\text{SC}$: Shading coefficient of glazing ($0.45$).
- $\text{CF}$: Solar Correction Factor based on facade orientation:
  * North: $\text{CF} = 0.95$
  * South: $\text{CF} = 0.90$
  * East: $\text{CF} = 1.15$ (Morning insolation)
  * West: $\text{CF} = 1.40$ (Harsh equatorial afternoon solar insolation)

The hourly solar heat penalty $\Delta T_{solar}$ added to the voxel is:

$$\Delta T_{solar} = \left( \frac{I_{direct}(t)}{920} \right) \cdot \sum_{faces} w_{face} \cdot \text{CF}_{face}$$

Where $w_{west} = 2.6^\circ\text{C}$ penalty during afternoon hours ($13:00 - 17:30$), and top roof slabs receive a direct downward solar flux penalty $w_{roof} = 1.5^\circ\text{C}$.

---

### 3.6 Indoor Operative Temperature ($T_{op}$) Energy Balance
The indoor operative temperature $T_{op}$ is the definitive metric of thermal comfort experienced by occupants, balancing mean air temperature $T_a$ and mean radiant temperature $\bar{T}_r$:

$$T_{op} = \frac{T_a + \bar{T}_r}{2}$$

In TropiVoxel's discretized calculation, $T_{op}$ is resolved through a thermodynamic heat balance equation:

$$T_{op} = T_{amb}(t) + \Delta T_{solar} - \Delta T_{vent} - \Delta T_{mass} - \Delta T_{bio}$$

Where:
1. **$T_{amb}(t)$**: Singapore ambient outdoor dry-bulb temperature ($25.5^\circ\text{C} - 33.5^\circ\text{C}$).
2. **$\Delta T_{solar}$**: Facade orientation and roof solar insolation gain ($0.0^\circ\text{C}$ to $+3.8^\circ\text{C}$).
3. **$\Delta T_{vent}$**: Convective sensible heat removal through natural ventilation:
   $$\Delta T_{vent} = \min\left(2.8^\circ\text{C}, 0.65 \cdot \ln(1 + 0.35 \cdot \text{ACH})\right)$$
4. **$\Delta T_{mass}$**: Structural thermal inertia damping from precast reinforced concrete PPVC modules ($1.1^\circ\text{C}$ attenuation of midday peak).
5. **$\Delta T_{bio}$**: Biophilic evapotranspirative microclimate cooling:
   - Base units: $0.4^\circ\text{C}$
   - Void colonnade breezeway: $1.2^\circ\text{C}$
   - Sky garden terrace: $1.8^\circ\text{C}$ (cooling adjacent floor levels via shaded vegetated moisture plumes).

---

### 3.7 Daylight Factor ($\text{DF}\%$) & Visual Comfort
The Daylight Factor indicates the percentage of outdoor horizontal illuminance reaching indoor living areas under an overcast CIE standard sky:

$$\text{DF}\% = \frac{E_{indoor}}{E_{outdoor}} \times 100\%$$

Calculated procedurally for each voxel:

$$\text{DF}\% = 0.8\% + N_{exterior\_faces} \cdot 1.1\% + \left( \frac{z}{30} \right) \cdot 0.8\%$$

- Internal core / corridor units: $\text{DF} \approx 0.8\%$ (requires supplemental task illumination).
- Standard single-facade flat: $\text{DF} \approx 1.9\% - 2.5\%$ (exceeds BCA Green Mark minimum of $1.5\%$).
- Dual-aspect / corner flat: $\text{DF} \approx 3.0\% - 4.2\%$ (optimal natural daylighting without excessive glare).

---

### 3.8 Singapore BCA Green Mark GM:2021 & ASHRAE 55 Adaptive Comfort
Under **BCA Green Mark 2021: Health and Wellbeing (CNV - Natural Ventilation)**:
1. **Spatial Wind Velocity Criterion**: At least $70\%$ of habitable living areas must achieve an indoor wind speed of:
   $$v_{indoor} \ge 0.60\text{ m/s}$$
   or maintain an air exchange rate of:
   $$\text{ACH} \ge 15.0\text{ h}^{-1}$$
2. **ASHRAE Standard 55 Tropical Adaptive Comfort Model**:
   The $80\%$ comfortable indoor operative temperature limit $T_{c,80\%}$ for naturally conditioned buildings in the humid tropics is:
   $$T_{c,80\%} = 17.8 + 0.31 \cdot \bar{T}_{pma(out)} + \Delta T_{elevated\_airspeed}$$
   Where $\bar{T}_{pma(out)} \approx 28.2^\circ\text{C}$ is Singapore's prevailing mean outdoor air temperature, establishing a base comfort neutrality of $26.54^\circ\text{C}$.
   When indoor air movement is elevated, occupants experience physiological cooling from sweat evaporation:
   - For $v_{indoor} \ge 0.60\text{ m/s}$: $\Delta T_{elevated\_airspeed} = +2.2^\circ\text{C}$ comfort credit (expanding comfortable operative room temperatures up to $29.8^\circ\text{C}$).
   - For $0.30 \le v_{indoor} < 0.60\text{ m/s}$: $\Delta T_{elevated\_airspeed} = +1.2^\circ\text{C}$ comfort credit.

The **Adaptive Comfort Score** ($0 - 100\%$) is then computed as:

$$\text{Score} = \text{clamp}\left( 100 - \max(0, (T_{effective} - 26.5) \cdot 18), 30\%, 99\% \right)$$

---

## 4. PART III: PROCEDURAL IMPLEMENTATION ARCHITECTURE

```
+-------------------------------------------------------------+
|                      USER INTERACTION                       |
|   Select Preset · Toggle Floor · Change Grid · Rotate Sun   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|            NEIGHBORHOOD ADJACENCY GRAPH (VOXELS)            |
|   Spatial 3D Hash Set: check (x±1, y±1, z±1) for Facades    |
|   Identify: North/South Openings, East/West, Roof Exposure  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|           INTERIOR MICROCLIMATE CALCULATION ENGINE          |
|   1. Singapore Atmospheric Boundary Layer Wind Profile      |
|   2. Orifice Cross-Ventilation Q (m³/s) & ACH               |
|   3. Diurnal Ambient Temp & West-Facade Solar Penalty       |
|   4. Convective Cooling, Mass Damping, Sky Garden Buffer   |
|   5. BCA Green Mark GM:2021 Spatial Velocity Threshold      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|               COLORFIGURES THREE.JS RENDERER                |
|   1. Chamfered Box Geometries (Instance Buffers)            |
|   2. Hand-Inked Contour Edges (EdgesGeometry + LineSegments)|
|   3. See-Through Ghost Shell Shader (Fresnel + Opacity 0.18)|
|   4. Floor-by-Floor Elevator Slice Isolation (+12m Stacking)|
|   5. 3D Particle CFD Streamlines & Interactive Floor Badges |
+-------------------------------------------------------------+
```

---

## 5. SUMMARY SPECIFICATION CHEAT SHEET

| Parameter | Value / Formula | Regulatory / Physical Benchmark |
| :--- | :--- | :--- |
| **Grid Cube Size** | $3.6\text{m} \times 3.6\text{m} \times 3.6\text{m}$ (default) | Standard BCA precast PPVC module clearance |
| **Wind Profile** | $V(z) = V_{10} \cdot (z / 10)^{0.22}$ | Singapore CP 11 / Eurocode Category III |
| **Venturi Void Deck** | $1.65\times - 1.85\times$ speed multiplier | Traditional Singapore ground pilotis design |
| **Cross-Vent Flow** | $Q = C_d A_{eff} V(z) \sqrt{\Delta C_p}$ | Orifice equation ($C_d = 0.62$, $\Delta C_p = 1.0$) |
| **BCA GM:2021 Threshold** | $v_{indoor} \ge 0.60\text{ m/s}$ or $\text{ACH} \ge 15$ | Green Mark Natural Ventilation Platinum Credit |
| **West Facade Penalty** | $+2.6^\circ\text{C}$ solar heating at 14:30 SGT | Peak afternoon equatorial horizontal solar flux |
| **Sky Garden Credit** | $-1.8^\circ\text{C}$ thermal buffer | Biophilic evapotranspiration & shade buffer |
| **Visual Style** | Colorfigures Hand-Inked Isometric | Multi-tone banded shading with ink contours |

---
*TropiVoxel SG Architectural Engineering Core · Generated for Research, Education, and Design Compliance.*
