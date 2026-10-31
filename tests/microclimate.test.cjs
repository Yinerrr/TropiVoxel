const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const engine = require('../microclimate.js');
// Exercise the actual bundled geometry and UI components without a build dependency.
const bundle = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const mount = '  clientExports.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));';
assert.ok(bundle.includes(mount));
const context = vm.createContext({ console, TropiMicroclimate: engine, setTimeout, clearTimeout });
vm.runInContext(bundle.replace(mount, 'globalThis.subject = { containsPoint, footprintCorners, sunPosition, generateLayout, DEFAULT_LAYOUT, DEFAULT_ENV, reactExports, FloorMicroclimate, App, StudioCanvas, Group };'), context);
const api = context.subject;
const geometry = { contains: api.containsPoint, corners: api.footprintCorners, sun: api.sunPosition };
const env = { ...api.DEFAULT_ENV, temperature: 30, windSpeed: 3, windDirection: 0 };
const b = { id: 'test', x: 70, z: 70, width: 14.4, depth: 14.4, height: 30, storeys: 10, rotation: 0, porosity: 0 };
const run = (building = b, weather = env, options = {}) => engine.analyse(building, weather, { moduleSize: 3.6, gardenLevel: 0, ...options }, geometry);

test('floor height and footprint grid follow actual building geometry', () => {
  const a = run(); assert.equal(a.floors.length, 10); assert.equal(a.floors[9].elevation, 30);
  assert.equal(a.floors[0].samples.length, 16);
  assert.ok(a.floors[0].samples.some(v => v.mode === 'Internal' && v.q === 0));
  for (const f of a.floors) for (const v of f.samples) {
    for (const key of ['q', 'ach', 'wind', 'temperature', 'daylight', 'comfort']) assert.ok(Number.isFinite(v[key]), key);
    assert.ok(Math.abs(v.ach - v.q * 3600 / (0.85 * a.dx * a.dz * a.floorHeight)) < 1e-9);
  }
});
test('wind increases with elevation; calm wind removes all airflow', () => {
  const a = run(); assert.ok(a.floors[9].ach > a.floors[0].ach);
  const calm = run(b, { ...env, windSpeed: 0 });
  assert.ok(calm.floors.every(f => f.ach === 0 && f.wind === 0 && f.coverage === 0));
});
test('cross ventilation respects wind incidence and exceeds single-sided flow', () => {
  const narrow = { ...b, depth: 3.6 };
  const aligned = run(narrow), oblique = run(narrow, { ...env, windDirection: 90 });
  const inner = a => a.floors[0].samples.find(v => v.i === 1);
  assert.equal(inner(aligned).mode, 'Cross ventilation');
  assert.ok(inner(aligned).ach > inner(oblique).ach * 100);
  assert.ok(inner(aligned).ach > run().floors[0].ach);
});
test('void deck and sky garden are excluded from habitable screening', () => {
  const a = run({ ...b, porosity: 0.8 }, env, { gardenLevel: 6 });
  assert.equal(a.floors[0].coverage, null); assert.equal(a.floors[5].coverage, null);
  assert.ok(a.floors[0].wind > a.floors[1].wind);
  assert.ok(a.floors[5].temperature < run().floors[5].temperature);
});
test('night has no solar gain, and diurnal mode follows the explicit equation', () => {
  const night = run(b, { ...env, hour: 2.5 }, { diurnal: true });
  assert.equal(night.ambient, 25.5);
  assert.ok(night.floors.every(f => f.samples.every(v => v.solarGain === 0)));
  assert.equal(run(b, { ...env, hour: 14.5 }, { diurnal: true }).ambient, 33.5);
});
test('mapped rotated footprints sample only occupied cells and touching context closes openings', () => {
  const mapped = { ...b, footprint: [[-7.2,-7.2],[7.2,-7.2],[7.2,0],[0,0],[0,7.2],[-7.2,7.2]], rotation: 35 };
  const a = run(mapped);
  assert.ok(a.floors[0].samples.length < 16);
  assert.ok(a.floors[0].samples.every(v => geometry.contains(mapped, v.x, v.z)));
  const blocked = run(b, env, { buildings: [{ ...b, id: 'neighbour', width: 100, depth: 100 }] });
  assert.equal(blocked.floors[0].ach, 0);
});
test('all module sizes and maximum storeys produce finite values', () => {
  for (const size of [2.4, 3, 3.6, 4.2, 4.8]) {
    const a = run({ ...b, storeys: 100, height: 299.5 }, env, { moduleSize: size });
    assert.equal(a.floors.length, 100); assert.equal(a.floors[99].elevation, 299.5);
    assert.ok(a.floors.every(f => Number.isFinite(f.temperature)));
  }
});
test('floor inspector renders every level and module using bundled React', () => {
  const react = api.reactExports;
  const internals = react.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  internals.H = { useState: v => [v, () => {}], useEffect: () => {} };
  const analysis = run();
  const element = api.FloorMicroclimate({ analysis, level: 10, onLevel() {}, metric: 'temperature', onMetric() {}, options: { moduleSize: 3.6, gardenLevel: 0 }, onOptions() {}, slice: true, onSlice() {}, building: b, environment: env });
  let text = '', buttons = 0;
  function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node) return;
    if (typeof node !== 'object') { text += String(node); return; }
    if (node.type === 'button') buttons++;
    walk(node.props?.children);
  }
  walk(element);
  assert.ok(text.includes('Floor-by-floor analysis'));
  assert.ok(text.includes('Level 10'));
  assert.ok(text.includes('Export all floors'));
  assert.ok(buttons >= 27);
  internals.H = null;
});

test('app selection connects floor analysis, slicing and weather to the current building', () => {
  const react = api.reactExports;
  const internals = react.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  const states = []; let cursor = 0;
  internals.H = {
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial; return [states[i], next => { states[i] = typeof next === 'function' ? next(states[i]) : next; }]; },
    useRef: v => ({ current: v }), useEffect() {}, useMemo: fn => fn(), useCallback: fn => fn
  };
  const render = () => { cursor = 0; return api.App(); };
  const find = (node, predicate) => {
    if (Array.isArray(node)) { for (const v of node) { const result = find(v, predicate); if (result) return result; } return; }
    if (!node || typeof node !== 'object') return;
    if (predicate(node)) return node;
    return find(node.props?.children, predicate);
  };
  let tree = render();
  find(tree, n => n.type === 'button' && n.props.children === 'Building').props.onClick();
  tree = render();
  const picker = find(tree, n => n.props['aria-label'] === 'Select individual building');
  const id = states[0].buildings[0].id;
  picker.props.onChange({ target: { value: id } });
  tree = render();
  const panel = find(tree, n => n.type?.name === 'FloorMicroclimate');
  assert.equal(panel.props.analysis.floors.length, states[0].buildings[0].storeys);
  panel.props.onLevel(3); panel.props.onSlice(true); panel.props.onMetric('ach');
  tree = render();
  const studio = find(tree, n => n.type?.name === 'StudioCanvas');
  assert.equal(studio.props.microLevel, 3);
  assert.equal(studio.props.microMetric, 'ach');
  assert.ok(studio.props.microAnalysis);
  // Shrinking the selected building clamps a stale active level.
  states[0] = { ...states[0], buildings: states[0].buildings.map(v => v.id === id ? { ...v, storeys: 1, height: 3 } : v) };
  tree = render();
  assert.equal(find(tree, n => n.type?.name === 'StudioCanvas').props.microLevel, 1);
  internals.H = null;
});

test('3D slice produces module tiles and lifts the upper shell by 12 m', () => {
  const internals = api.reactExports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  const group = new api.Group(), effects = []; let ref = 0;
  internals.H = {
    useState: v => [v, () => {}],
    useRef(v) { const index = ref++; return { current: index === 2 ? group : v }; },
    useEffect: fn => effects.push(fn)
  };
  const analysis = run();
  api.StudioCanvas({ blocks: [], buildings: [b], selectedId: b.id, showContext: false, microAnalysis: analysis, microLevel: 3, microMetric: 'temperature' });
  effects[2](); // Geometry rebuild; does not create a DOM renderer.
  const node = group.children[0];
  assert.ok(node);
  const shells = node.children.filter(v => v.material?.opacity === 0.18);
  assert.equal(shells.length, 2);
  assert.equal(shells[1].position.y, (analysis.floors[2].elevation + 12) / 4 + 0.04);
  const tiles = node.children.filter(v => v.geometry?.type === 'BoxGeometry');
  assert.equal(tiles.length, analysis.floors[2].samples.length);
  assert.ok(tiles.every(v => Math.abs(v.position.y - 1.58) < 1e-9));
  internals.H = null;
});
