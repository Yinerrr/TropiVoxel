/* Concept-stage indoor model from TROPICAL_VOXEL_ART_STYLE_AND_MICROCLIMATE_SPEC.md. */
(function (root) {
  'use strict';
  const rad = Math.PI / 180, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function analyse(building, environment, options, geometry) {
    const size = options.moduleSize || 3.6;
    const corners = geometry.corners({ ...building, x: 0, z: 0, rotation: 0 });
    const minX = Math.min(...corners.map(p => p[0])), maxX = Math.max(...corners.map(p => p[0]));
    const minZ = Math.min(...corners.map(p => p[1])), maxZ = Math.max(...corners.map(p => p[1]));
    const nx = Math.ceil((maxX - minX) / size), nz = Math.ceil((maxZ - minZ) / size);
    const dx = (maxX - minX) / nx, dz = (maxZ - minZ) / nz;
    const angle = building.rotation * rad, c = Math.cos(angle), s = Math.sin(angle);
    const world = (u, v) => [building.x + u * c - v * s, building.z + u * s + v * c];
    const cells = [], occupied = new Set();
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const u = minX + (i + 0.5) * dx, v = minZ + (j + 0.5) * dz, [x, z] = world(u, v);
      if (geometry.contains(building, x, z)) { cells.push({ i, j, u, v, x, z }); occupied.add(`${i},${j}`); }
    }
    // North is -Z; wind direction is meteorological (where the wind comes from).
    const directions = [[0, -1, 0], [1, 0, 90], [0, 1, 180], [-1, 0, 270]];
    const cf = bearing => {
      const values = [0.95, 1.15, 0.90, 1.40], q = ((bearing % 360) + 360) % 360 / 90;
      return values[Math.floor(q)] * (1 - q % 1) + values[(Math.floor(q) + 1) % 4] * (q % 1);
    };
    const topology = cells.map(cell => ({ ...cell, faces: directions.filter(([di, dj]) => !occupied.has(`${cell.i + di},${cell.j + dj}`)).map(([di, dj, bearing]) => ({
      bearing: (bearing + building.rotation + 360) % 360,
      width: di ? dz : dx,
      x: cell.x + (di * dx * c - dj * dz * s) / 2,
      z: cell.z + (di * dx * s + dj * dz * c) / 2
    })) }));
    const sp = geometry.sun(environment), solar = Math.max(0, Math.sin(sp.elevation * rad)) * Math.pow(1 - environment.cloudCover, 1.2);
    const ambient = options.diurnal ? 29.5 + 4 * Math.cos(2 * Math.PI * (environment.hour - 14.5) / 24) : environment.temperature;
    const neighbours = (options.buildings || []).filter(b => b.id !== building.id);
    const floorHeight = building.height / building.storeys;
    const floors = [];
    for (let level = 1; level <= building.storeys; level++) {
      const elevation = level * floorHeight, voidDeck = level === 1 && building.porosity > 0;
      const garden = level === options.gardenLevel;
      const open = voidDeck || garden;
      const wind = Math.max(0, environment.windSpeed) * Math.pow(elevation / 10, 0.22);
      const samples = topology.map(cell => {
        // Adjoining buildings at this elevation close facade apertures.
        const faces = cell.faces.filter(f => !neighbours.some(b => b.height >= elevation && geometry.contains(b, f.x + Math.sin(f.bearing * rad) * 0.2, f.z - Math.cos(f.bearing * rad) * 0.2)));
        const opposite = faces.some(f => faces.some(g => Math.abs(Math.cos((f.bearing - g.bearing) * rad) + 1) < 0.001));
        const incidence = faces.length ? Math.max(...faces.map(f => Math.abs(Math.cos((environment.windDirection - f.bearing) * rad)))) : 0;
        const opening = faces.length ? 0.22 * Math.min(...faces.map(f => f.width)) * Math.min(size, floorHeight) : 0;
        const volume = 0.85 * dx * dz * floorHeight;
        const venturi = voidDeck ? 1 + 0.75 * building.porosity / 0.8 : 1;
        const q = open ? 0.62 * dx * Math.min(2.8, floorHeight) * wind * venturi * (voidDeck ? building.porosity : 0.8) : opposite ? 0.62 * opening / Math.sqrt(2) * wind * incidence : 0.05 * opening * wind;
        const ach = q * 3600 / volume;
        const indoorWind = open ? wind * venturi * (voidDeck ? building.porosity : 0.8) : opening ? q / opening : 0;
        const gain = solar * (faces.reduce((sum, f) => {
          const sunIncidence = Math.max(0, Math.cos((sp.azimuth - f.bearing) * rad));
          const west = Math.max(0, Math.cos((f.bearing - 270) * rad));
          const penalty = environment.hour >= 13 && environment.hour <= 17.5 ? 1 + 1.6 * west : 1;
          return sum + penalty * cf(f.bearing) * sunIncidence;
        }, 0) + (level === building.storeys ? 1.5 : 0));
        const ventCooling = Math.min(2.8, 0.65 * Math.log1p(0.35 * ach));
        const massCooling = 1.1 * Math.max(0, Math.cos(2 * Math.PI * (environment.hour - 14.5) / 24));
        const bioCooling = garden ? 1.8 : voidDeck ? 1.2 : Math.abs(level - options.gardenLevel) === 1 ? 0.8 : 0.4;
        const temperature = ambient + gain - ventCooling - massCooling - bioCooling;
        const credit = indoorWind >= 0.6 ? 2.2 : indoorWind >= 0.3 ? 1.2 : 0;
        const comfort = clamp(100 - Math.max(0, (temperature - credit - 26.5) * 18), 30, 99);
        const ettv = faces.length ? faces.reduce((sum, f) => sum + 12 * 0.65 * 1.8 + 3.4 * 0.35 * 2.8 + 211 * 0.35 * cf(f.bearing) * 0.45, 0) / faces.length : null;
        return { ...cell, faces: faces.length, mode: open ? (garden ? 'Sky garden' : 'Void deck') : opposite ? 'Cross ventilation' : faces.length ? 'Single sided' : 'Internal', q, ach, wind: indoorWind, temperature, solarGain: gain, ettv, daylight: 0.8 + faces.length * 1.1 + elevation / 30 * 0.8, comfort, target: indoorWind >= 0.6 || ach >= 15 };
      });
      const mean = key => samples.length ? samples.reduce((sum, v) => sum + (v[key] || 0), 0) / samples.length : null;
      const envelopes = samples.filter(v => v.ettv !== null);
      floors.push({ level, elevation, open, samples, temperature: mean('temperature'), ach: mean('ach'), q: mean('q'), wind: mean('wind'), daylight: mean('daylight'), comfort: mean('comfort'), ettv: envelopes.length ? envelopes.reduce((sum, v) => sum + v.ettv, 0) / envelopes.length : null, coverage: samples.length && !open ? samples.filter(v => v.target).length / samples.length * 100 : null });
    }
    return { floors, nx, nz, dx, dz, ambient, moduleSize: size, floorHeight };
  }
  function color(metric, value) {
    if (value === null) return '#d9d7d0';
    if (metric === 'temperature') return value <= 27.5 ? '#62b99d' : value < 29.5 ? '#87c9dc' : value <= 31 ? '#e5bb71' : '#df8e7d';
    const t = metric === 'ach' ? value / 30 : metric === 'daylight' ? value / 4 : value / 100;
    return t >= 0.7 ? '#62b99d' : t >= 0.4 ? '#87c9dc' : '#e5bb71';
  }
  root.TropiMicroclimate = { analyse, color };
  if (typeof module !== 'undefined') module.exports = root.TropiMicroclimate;
})(typeof window !== 'undefined' ? window : globalThis);
