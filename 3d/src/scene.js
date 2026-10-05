// Glozia hero scene — a gold crown (extruded from the Glozia logo) floating among
// pearls, gold rings and drifting gold dust. Day / Dusk lighting, pointer-follow,
// drag-to-spin, click-to-shine. Exposes window.GloziaScene.mount(canvas, opts).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshPhysicalMaterial, MeshBasicMaterial,
  ExtrudeGeometry, SphereGeometry, TorusGeometry, PlaneGeometry, BufferGeometry, Float32BufferAttribute,
  Points, PointsMaterial, CanvasTexture, Color, Vector2, Vector3, Raycaster, Plane, PMREMGenerator,
  DirectionalLight, PointLight, HemisphereLight, ACESFilmicToneMapping, SRGBColorSpace, Fog, MathUtils
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import crown from '../crown.json';

const MODES = {
  day:  { fog: '#F4EDE4', env: 0.85, key: 2.2, fill: 0.55, candle: 0,  exposure: 1.0,  dust: '#A97A35', dustOpacity: 0.6, shadow: 0.2 },
  dusk: { fog: '#1C1512', env: 0.3, key: 0.35, fill: 0.08, candle: 16, exposure: 1.02, dust: '#F6D08C', dustOpacity: 1.0, shadow: 0.6 }
};

// Pearl / ring composition, relative to the crown's centre (world units).
const PEARLS = [
  [-2.75, 1.2, 0.8, 0.26, 0], [-2.2, -1.5, 1.2, 0.18, 1], [2.7, 1.7, -0.6, 0.34, 0], [2.9, -1.2, 0.9, 0.22, 1],
  [0.4, 2.3, -1.2, 0.16, 0], [-0.6, -2.1, -0.8, 0.26, 0], [1.4, -2.0, 1.6, 0.12, 1], [-3.4, 2.75, -1.8, 0.2, 0],
  [-5.7, 2.3, -2.6, 0.22, 1], [-4.3, -2.55, -0.6, 0.16, 0], [3.9, 0.4, -2.2, 0.18, 0],
  [-1.9, 1.95, 0.6, 0.1, 1], [0.9, -0.1, 2.3, 0.09, 0], [4.2, -2.4, -1.2, 0.2, 1]
];
const RINGS = [
  [-2.6, 0.2, 1.0, 0.36, 0.04, 0.6, 0.3], [2.3, -1.9, -0.4, 0.5, 0.05, -0.4, 0.8], [4.6, 2.3, -1.8, 0.3, 0.035, 1.1, -0.2]
];

function radialTexture(size, stops) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => grd.addColorStop(o, col));
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function crownGeometry(width, crease, bevelSegments) {
  const [, , vw] = crown.viewBox.split(/\s+/).map(Number);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + crown.viewBox + '"><path fill="#000" fill-rule="evenodd" d="' + crown.d + '"/></svg>';
  const data = new SVGLoader().parse(svg);
  const shapes = [];
  data.paths.forEach((p) => shapes.push(...p.toShapes()));
  let geo = new ExtrudeGeometry(shapes, {
    depth: 30, bevelEnabled: true, bevelThickness: 7, bevelSize: 4.2, bevelSegments: bevelSegments, curveSegments: 10
  });
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -(bb.min.z + bb.max.z) / 2);
  const s = width / vw;
  geo.scale(s, -s, -s); // SVG is y-down; flip y (and z, to keep winding)
  if (crease > 0) geo = toCreasedNormals(geo, MathUtils.degToRad(crease));
  geo.computeBoundingBox();
  return geo;
}

export function mount(canvas, opts) {
  opts = opts || {};
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    if (opts.onError) opts.onError(err);
    return null;
  }
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxDpr || 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.fog = new Fog(new Color(MODES.day.fog), 11, 24);

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  const camBase = new Vector3(0, 1.0, 12.5);
  camera.position.copy(camBase);

  // Lights (the environment does most of the work; these add warmth and a candle at dusk)
  const key = new DirectionalLight(new Color('#FFE6C4'), MODES.day.key);
  key.position.set(-4, 6, 8);
  const fill = new HemisphereLight(new Color('#FFF5EA'), new Color('#6B4A2E'), MODES.day.fill);
  const candle = new PointLight(new Color('#FFB25E'), 0, 14, 1.6);
  const rim = new PointLight(new Color('#FF8F4D'), 0, 16, 1.6);
  scene.add(key, fill, candle, rim);

  // Materials
  const gold = new MeshPhysicalMaterial({
    color: new Color('#DCA650'), metalness: 1, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.18, envMapIntensity: 1.25
  });
  const pearlA = new MeshPhysicalMaterial({
    color: new Color('#F5EEE4'), roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.1,
    iridescence: 0.6, iridescenceIOR: 1.35, iridescenceThicknessRange: [160, 440], sheen: 0.5, sheenColor: new Color('#FFF0DA')
  });
  const pearlB = pearlA.clone();
  pearlB.color = new Color('#EBC7BC');

  // Composition group (crown + satellites), placed by layout()
  const compo = new Group();
  scene.add(compo);

  const crownGeo = crownGeometry(4.6, opts.crease != null ? opts.crease : 0, opts.bevelSegments || 6);
  const crownMesh = new Mesh(crownGeo, gold);
  const crownPivot = new Group();
  crownPivot.add(crownMesh);
  compo.add(crownPivot);

  const shadowTex = radialTexture(256, [[0, 'rgba(46,30,20,0.85)'], [0.45, 'rgba(46,30,20,0.35)'], [1, 'rgba(46,30,20,0)']]);
  const shadowMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: MODES.day.shadow });
  const shadow = new Mesh(new PlaneGeometry(6.4, 2.8), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.75, 0);
  compo.add(shadow);

  const sphereGeo = new SphereGeometry(1, 48, 32);
  const sats = [];
  PEARLS.forEach(([x, y, z, r, tint], i) => {
    const m = new Mesh(sphereGeo, tint ? pearlB : pearlA);
    m.scale.setScalar(r);
    m.position.set(x, y, z);
    compo.add(m);
    sats.push({ mesh: m, home: new Vector3(x, y, z), off: new Vector3(), vel: new Vector3(), phase: i * 1.7, amp: 0.12 + (i % 4) * 0.05, r });
  });
  const torusGeos = [];
  RINGS.forEach(([x, y, z, R, tube, rx, ry], i) => {
    const g = new TorusGeometry(R, tube, 24, 96);
    torusGeos.push(g);
    const m = new Mesh(g, gold);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    compo.add(m);
    sats.push({ mesh: m, home: new Vector3(x, y, z), off: new Vector3(), vel: new Vector3(), phase: 3 + i * 2.3, amp: 0.18, r: R, spin: 0.25 + i * 0.1 });
  });

  // Gold dust
  const DUST = 650;
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = MathUtils.randFloatSpread(17);
    dustPos[i * 3 + 1] = MathUtils.randFloatSpread(9.5);
    dustPos[i * 3 + 2] = MathUtils.randFloat(-5, 3);
    dustSeed[i] = Math.random() * 100;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(dustPos, 3));
  const dotTex = radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.75)'], [1, 'rgba(255,255,255,0)']]);
  const dustMat = new PointsMaterial({
    size: 0.085, map: dotTex, transparent: true, depthWrite: false, color: new Color(MODES.day.dust), opacity: MODES.day.dustOpacity, sizeAttenuation: true
  });
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  // ---- layout -------------------------------------------------------------
  const look = new Vector3();
  let layoutX = 0, layoutY = 0, layoutS = 1;
  function layout() {
    const w = canvas.clientWidth || canvas.width || 1;
    const h = canvas.clientHeight || canvas.height || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const dist = camBase.length();
    const vh = 2 * dist * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const vw = vh * camera.aspect;
    if (opts.layout === 'center' || camera.aspect < 1.05) {
      layoutX = 0; layoutY = vh * (opts.offsetY != null ? opts.offsetY : 0.08); layoutS = Math.min(1, vw / 6.4);
    } else {
      layoutX = vw * (opts.offsetX != null ? opts.offsetX : 0.21); layoutY = vh * (opts.offsetY != null ? opts.offsetY : 0.02); layoutS = 1;
    }
    compo.position.set(layoutX, layoutY, 0);
    candle.position.set(layoutX - 2.6 * layoutS, layoutY + 1.4 * layoutS, 3.4);
    rim.position.set(layoutX + 3.6 * layoutS, layoutY + 2.6 * layoutS, -2.4);
    compo.scale.setScalar(layoutS);
    look.set(layoutX * 0.18, 0.1, 0);
  }

  // ---- interaction ----------------------------------------------------------
  const pointer = new Vector2(0, 0);
  const pointerSmooth = new Vector2(0, 0);
  const pointerWorld = new Vector3(999, 999, 0);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  let pointerDirty = false, hasPointer = false, hoverCrown = false, dragging = false, dragX = 0, downX = 0, downY = 0, downT = 0;
  let spin = 0, spinVel = 0, burst = 0, hoverScale = 1;

  function toNdc(e) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }
  function hitCrown() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(crownMesh, false).length > 0;
  }
  function onMove(e) {
    toNdc(e);
    hasPointer = true;
    pointerDirty = true;
    if (dragging) {
      const dx = e.clientX - dragX;
      dragX = e.clientX;
      spinVel = dx * 0.0065;
      spin += spinVel;
    }
  }
  function onDown(e) {
    toNdc(e);
    hasPointer = true;
    if (hitCrown()) {
      dragging = true;
      dragX = downX = e.clientX; downY = e.clientY; downT = performance.now();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      canvas.style.cursor = 'grabbing';
    }
  }
  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (moved < 6 && performance.now() - downT < 400) shine();
    canvas.style.cursor = hoverCrown ? 'grab' : '';
  }
  function onLeave() { hasPointer = false; pointer.set(0, 0); }
  function shine() { spinVel += reduceMotion ? 0.12 : 0.32; burst = 1; }
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.style.touchAction = 'pan-y';

  let scrollP = 0;
  function onScroll() { scrollP = MathUtils.clamp((window.scrollY || 0) / 900, 0, 1); }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- mode -----------------------------------------------------------------
  let modeK = opts.mode === 'dusk' ? 1 : 0, modeTarget = modeK;
  const cDay = new Color(MODES.day.fog), cDusk = new Color(MODES.dusk.fog);
  const dDay = new Color(MODES.day.dust), dDusk = new Color(MODES.dusk.dust);
  function applyMode(k, t) {
    const L = (a, b) => a + (b - a) * k;
    scene.environmentIntensity = L(MODES.day.env, MODES.dusk.env);
    renderer.toneMappingExposure = L(MODES.day.exposure, MODES.dusk.exposure);
    key.intensity = L(MODES.day.key, MODES.dusk.key);
    fill.intensity = L(MODES.day.fill, MODES.dusk.fill);
    const flicker = reduceMotion ? 1 : 0.9 + 0.06 * Math.sin(t * 9.1) + 0.04 * Math.sin(t * 23.7);
    candle.intensity = MODES.dusk.candle * k * flicker;
    rim.intensity = MODES.dusk.candle * 0.55 * k;
    scene.fog.color.copy(cDay).lerp(cDusk, k);
    dustMat.color.copy(dDay).lerp(dDusk, k);
    dustMat.opacity = L(MODES.day.dustOpacity, MODES.dusk.dustOpacity);
    shadowMat.opacity = L(MODES.day.shadow, MODES.dusk.shadow);
  }

  // ---- loop -----------------------------------------------------------------
  let raf = 0, running = false, disposed = false, readySent = false, last = performance.now(), time = 0;
  const tmp = new Vector3();
  function frame(now) {
    raf = 0;
    if (disposed || !running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    const motion = reduceMotion ? 0 : 1;

    modeK += (modeTarget - modeK) * Math.min(1, dt * 3.2);
    applyMode(modeK, time);

    pointerSmooth.lerp(pointer, Math.min(1, dt * 4));
    if (hasPointer) {
      if (pointerDirty) {
        pointerDirty = false;
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(plane, pointerWorld);
        const h = !dragging && hitCrown();
        if (h !== hoverCrown) { hoverCrown = h; canvas.style.cursor = h ? 'grab' : ''; }
      }
    } else {
      pointerWorld.set(999, 999, 0);
      if (hoverCrown) { hoverCrown = false; canvas.style.cursor = ''; }
    }

    // crown motion
    if (!dragging) { spin += spinVel; spinVel *= Math.pow(0.04, dt); }
    const idle = Math.sin(time * 0.35) * 0.32 * motion;
    crownPivot.rotation.y = idle + spin + pointerSmooth.x * 0.42;
    crownPivot.rotation.x = -0.1 + pointerSmooth.y * -0.16 + scrollP * 0.45;
    crownPivot.position.y = Math.sin(time * 0.8) * 0.08 * motion;
    hoverScale += ((hoverCrown || dragging ? 1.035 : 1) - hoverScale) * Math.min(1, dt * 6);
    crownPivot.scale.setScalar(hoverScale);
    compo.position.y = layoutY - scrollP * 1.3;
    shadow.scale.setScalar(1 - 0.06 * Math.sin(time * 0.8) * motion);

    // satellites: float + spring away from the pointer
    const pw = tmp.copy(pointerWorld).sub(compo.position).divideScalar(layoutS);
    burst *= Math.pow(0.25, dt);
    for (const s of sats) {
      const fx = Math.sin(time * 0.6 + s.phase) * s.amp * motion;
      const fy = Math.cos(time * 0.5 + s.phase * 1.3) * s.amp * motion;
      const px = s.home.x + s.off.x, py = s.home.y + s.off.y;
      const dx = px - pw.x, dy = py - pw.y;
      const d2 = dx * dx + dy * dy;
      const R = 1.7;
      if (d2 < R * R && d2 > 1e-4) {
        const d = Math.sqrt(d2), f = (1 - d / R) * 9 * dt;
        s.vel.x += (dx / d) * f; s.vel.y += (dy / d) * f;
      }
      if (burst > 0.02) { // shine burst pushes satellites outward a little
        const bx = s.home.x, by = s.home.y, bl = Math.hypot(bx, by) || 1;
        s.vel.x += (bx / bl) * burst * 1.6 * dt; s.vel.y += (by / bl) * burst * 1.6 * dt;
      }
      s.vel.x += -s.off.x * 6 * dt; s.vel.y += -s.off.y * 6 * dt; // spring home
      s.vel.multiplyScalar(Math.pow(0.08, dt));
      s.off.x += s.vel.x * dt * 6; s.off.y += s.vel.y * dt * 6;
      s.mesh.position.set(s.home.x + s.off.x + fx, s.home.y + s.off.y + fy, s.home.z);
      if (s.spin) { s.mesh.rotation.y += s.spin * dt * (1 + motion); s.mesh.rotation.x += s.spin * 0.4 * dt * motion; }
    }

    // dust drifts upward and sways; speeds up during a burst
    const pos = dustGeo.attributes.position.array;
    const rise = (0.12 + burst * 1.4) * dt * (motion || 0.0);
    for (let i = 0; i < DUST; i++) {
      const j = i * 3;
      pos[j + 1] += rise * (0.5 + (dustSeed[i] % 1));
      pos[j] += Math.sin(time * 0.4 + dustSeed[i]) * 0.0016 * motion;
      if (pos[j + 1] > 4.9) pos[j + 1] = -4.9;
    }
    dustGeo.attributes.position.needsUpdate = true;
    dust.rotation.y = pointerSmooth.x * 0.05;

    camera.position.set(camBase.x + pointerSmooth.x * 0.35, camBase.y + pointerSmooth.y * 0.2, camBase.z + scrollP * 1.2);
    camera.lookAt(look);
    renderer.render(scene, camera);
    if (!readySent) { readySent = true; if (opts.onReady) opts.onReady(); }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (running || disposed) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  let io = null, ro = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => { entries.forEach((en) => (en.isIntersecting ? start() : stop())); }, { threshold: 0.01 });
    io.observe(canvas);
  }
  if ('ResizeObserver' in window) { ro = new ResizeObserver(() => layout()); ro.observe(canvas); }
  function onVis() { if (document.hidden) stop(); else if (!io) start(); else { io.unobserve(canvas); io.observe(canvas); } }
  document.addEventListener('visibilitychange', onVis);
  function onLost(e) { e.preventDefault(); stop(); }
  canvas.addEventListener('webglcontextlost', onLost);

  layout();
  applyMode(modeK, 0);
  onScroll();
  start();

  return {
    setMode(m) { modeTarget = m === 'dusk' ? 1 : 0; },
    shine,
    renderOnce() { const r = running; running = true; frame(performance.now()); running = r; if (!r && raf) { cancelAnimationFrame(raf); raf = 0; } },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      crownGeo.dispose(); sphereGeo.dispose(); torusGeos.forEach((g) => g.dispose()); dustGeo.dispose();
      shadow.geometry.dispose();
      [gold, pearlA, pearlB, shadowMat, dustMat].forEach((m) => m.dispose());
      [shadowTex, dotTex].forEach((t) => t.dispose());
      envRT.dispose(); pmrem.dispose(); if (room.dispose) room.dispose();
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch (_) {}
    }
  };
}

if (typeof window !== 'undefined') {
  window.GloziaScene = { mount, version: '1.0.0' };
}
