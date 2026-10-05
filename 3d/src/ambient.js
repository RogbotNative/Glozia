// Glozia ambient scene — pearls, gold rings and gold dust drifting behind page headings, with the
// same materials as the hero crown. Pointer parallax, pearls that drift away from the cursor, scroll
// parallax; pauses when off-screen; a single still frame when the visitor prefers reduced motion.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshPhysicalMaterial, SphereGeometry, TorusGeometry,
  BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, CanvasTexture, Color, Vector2, Vector3,
  Raycaster, Plane, PMREMGenerator, DirectionalLight, HemisphereLight, ACESFilmicToneMapping, SRGBColorSpace,
  Fog, MathUtils
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// [x, y] in view units (-1..1), z depth, radius, tint (0 pearl, 1 blush pearl). Left side kept sparse for text.
// Rings: [x, y, z, radius, rotX, rotY]. Sizes are scaled by PEARL_SCALE / RING_SCALE below.
const LAYOUTS = {
  right: {
    pearls: [
      [0.18, 0.62, -1.5, 0.22, 0], [0.46, 0.18, 0.6, 0.34, 0], [0.74, 0.7, -2.2, 0.26, 1], [0.9, -0.08, -0.6, 0.18, 0],
      [0.58, -0.62, 1.0, 0.24, 1], [0.32, -0.32, -2.8, 0.14, 0], [0.84, -0.7, -1.6, 0.3, 0], [0.06, -0.78, -1.0, 0.12, 1],
      [-0.12, 0.84, -3.0, 0.16, 0], [-0.86, -0.82, -2.0, 0.1, 0], [-0.94, 0.72, -2.6, 0.14, 1], [0.64, 0.92, -0.4, 0.1, 0]
    ],
    rings: [[0.62, 0.42, -0.8, 0.46, 0.5, 0.2], [0.26, -0.58, -1.8, 0.32, -0.5, 0.9], [0.96, 0.3, -2.4, 0.28, 1.1, -0.3]]
  },
  // Keeps to the open column between a left-hand heading and a right-hand card, plus the top edge.
  center: {
    pearls: [
      [-0.02, 0.7, -1.2, 0.2, 0], [0.14, 0.42, 0.4, 0.16, 1], [0.22, 0.84, -2.4, 0.12, 0], [0.06, -0.06, -0.6, 0.2, 0],
      [0.2, -0.32, -2.0, 0.14, 1], [-0.06, 0.24, -3.0, 0.1, 0], [0.12, 0.95, -1.6, 0.1, 1], [-0.97, 0.94, -2.6, 0.1, 0],
      [0.97, 0.96, -2.8, 0.12, 1], [0.5, 0.97, -3.2, 0.1, 0], [0.16, -0.7, -1.4, 0.12, 0]
    ],
    rings: [[0.1, 0.6, -1.0, 0.28, 0.6, 0.3], [0.24, 0.06, -2.2, 0.22, -0.4, 0.8]]
  }
};

const PEARL_SCALE = 1.6;
const RING_SCALE = 1.35;

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * opts: { layout?: 'right' | 'center', fog?: CSS colour of the page behind, onReady?: () => void }.
 * Returns { dispose } or null when WebGL is unavailable.
 */
export function mountAmbient(canvas, opts) {
  opts = opts || {};
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (err) {
    return null;
  }
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.85;
  scene.fog = new Fog(new Color(opts.fog || '#F6F1EA'), 12, 22);
  scene.add(new DirectionalLight(new Color('#FFE6C4'), 2.0).translateX(-4).translateY(6).translateZ(8));
  scene.add(new HemisphereLight(new Color('#FFF5EA'), new Color('#6B4A2E'), 0.5));

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const gold = new MeshPhysicalMaterial({
    color: new Color('#DCA650'), metalness: 1, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.18, envMapIntensity: 1.25
  });
  const pearlA = new MeshPhysicalMaterial({
    color: new Color('#F5EEE4'), roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.1,
    iridescence: 0.6, iridescenceIOR: 1.35, iridescenceThicknessRange: [160, 440], sheen: 0.5, sheenColor: new Color('#FFF0DA')
  });
  const pearlB = pearlA.clone();
  pearlB.color = new Color('#EBC7BC');

  const layout = LAYOUTS[opts.layout] || LAYOUTS.right;
  const group = new Group();
  scene.add(group);
  const sphereGeo = new SphereGeometry(1, 40, 28);
  const torusGeos = [];
  const items = [];
  layout.pearls.forEach(([x, y, z, r, tint], i) => {
    const m = new Mesh(sphereGeo, tint ? pearlB : pearlA);
    m.scale.setScalar(r * PEARL_SCALE);
    group.add(m);
    items.push({ mesh: m, u: x, v: y, z, off: new Vector2(), vel: new Vector2(), phase: i * 1.37, amp: 0.1 + (i % 4) * 0.04 });
  });
  layout.rings.forEach(([x, y, z, R, rx, ry], i) => {
    const g = new TorusGeometry(R * RING_SCALE, R * RING_SCALE * 0.1, 20, 80);
    torusGeos.push(g);
    const m = new Mesh(g, gold);
    m.rotation.set(rx, ry, 0);
    group.add(m);
    items.push({ mesh: m, u: x, v: y, z, off: new Vector2(), vel: new Vector2(), phase: 2 + i * 2.1, amp: 0.16, spin: 0.22 + i * 0.08 });
  });

  const DUST = 260;
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = MathUtils.randFloatSpread(22);
    dustPos[i * 3 + 1] = MathUtils.randFloatSpread(9);
    dustPos[i * 3 + 2] = MathUtils.randFloat(-5, 2);
    dustSeed[i] = Math.random() * 100;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(dustPos, 3));
  const dotTex = dotTexture();
  const dustMat = new PointsMaterial({
    size: 0.07, map: dotTex, transparent: true, depthWrite: false, color: new Color('#A97A35'), opacity: 0.55, sizeAttenuation: true
  });
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  // ---- layout: map view units to world units at each object's depth ----------------------------
  let halfH = 1, aspect = 1;
  function place() {
    for (const s of items) {
      const dist = camera.position.z - s.z;
      const h = Math.tan(MathUtils.degToRad(camera.fov / 2)) * dist;
      s.home = new Vector3(s.u * h * aspect * 0.94, s.v * h * 0.86, s.z);
    }
  }
  function layoutCanvas() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    place();
    if (!running) renderFrame(0, 0);
  }

  // ---- pointer (listened on window so the canvas never blocks the page) -------------------------
  const pointer = new Vector2(0, 0);
  const pointerSmooth = new Vector2(0, 0);
  const pointerWorld = new Vector3(999, 999, 0);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  let inside = false;
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (inside) {
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, pointerWorld);
    } else {
      pointerWorld.set(999, 999, 0);
    }
  }
  window.addEventListener('pointermove', onMove, { passive: true });

  let scrollShift = 0;
  function onScroll() {
    const r = canvas.getBoundingClientRect();
    scrollShift = MathUtils.clamp(-r.top / (r.height || 1), -1, 1);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- loop -------------------------------------------------------------------------------------
  let raf = 0, running = false, disposed = false, readySent = false, last = performance.now(), time = 0;
  const rest = new Vector2(0, 0);
  function renderFrame(dt, motion) {
    pointerSmooth.lerp(inside ? pointer : rest, Math.min(1, dt * 3));
    group.rotation.y = pointerSmooth.x * 0.08 * motion;
    group.rotation.x = -pointerSmooth.y * 0.05 * motion;
    group.position.y = scrollShift * halfH * 0.35 * motion;
    for (const s of items) {
      if (!s.home) continue;
      const dx = s.home.x + s.off.x - pointerWorld.x;
      const dy = s.home.y + s.off.y - pointerWorld.y;
      const d2 = dx * dx + dy * dy;
      if (motion && d2 < 2.4 && d2 > 1e-4) {
        const d = Math.sqrt(d2), f = (1 - d / 1.55) * 7 * dt;
        if (f > 0) { s.vel.x += (dx / d) * f; s.vel.y += (dy / d) * f; }
      }
      s.vel.x += -s.off.x * 5 * dt; s.vel.y += -s.off.y * 5 * dt;
      s.vel.multiplyScalar(Math.pow(0.08, dt));
      s.off.x += s.vel.x * dt * 6; s.off.y += s.vel.y * dt * 6;
      const fx = Math.sin(time * 0.5 + s.phase) * s.amp * motion;
      const fy = Math.cos(time * 0.42 + s.phase * 1.3) * s.amp * motion;
      s.mesh.position.set(s.home.x + s.off.x + fx, s.home.y + s.off.y + fy, s.home.z);
      if (s.spin) { s.mesh.rotation.y += s.spin * dt * motion; s.mesh.rotation.x += s.spin * 0.4 * dt * motion; }
    }
    const pos = dustGeo.attributes.position.array;
    for (let i = 0; i < DUST; i++) {
      const j = i * 3;
      pos[j + 1] += (0.1 * (0.5 + (dustSeed[i] % 1))) * dt * motion;
      pos[j] += Math.sin(time * 0.4 + dustSeed[i]) * 0.0014 * motion;
      if (pos[j + 1] > 4.6) pos[j + 1] = -4.6;
    }
    dustGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    if (!readySent) { readySent = true; if (opts.onReady) opts.onReady(); }
  }
  function frame(now) {
    raf = 0;
    if (disposed || !running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    renderFrame(dt, 1);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || disposed || reduceMotion) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  let io = null, ro = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => entries.forEach((en) => (en.isIntersecting ? start() : stop())), { threshold: 0.01 });
    io.observe(canvas);
  }
  if ('ResizeObserver' in window) { ro = new ResizeObserver(() => layoutCanvas()); ro.observe(canvas); }
  function onVis() { if (document.hidden) stop(); else if (io) { io.unobserve(canvas); io.observe(canvas); } else start(); }
  document.addEventListener('visibilitychange', onVis);
  function onLost(e) { e.preventDefault(); stop(); }
  canvas.addEventListener('webglcontextlost', onLost);

  layoutCanvas();
  onScroll();
  renderFrame(0, 0);
  if (!io) start();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      sphereGeo.dispose(); torusGeos.forEach((g) => g.dispose()); dustGeo.dispose();
      [gold, pearlA, pearlB, dustMat].forEach((m) => m.dispose());
      dotTex.dispose(); envRT.dispose(); pmrem.dispose(); if (room.dispose) room.dispose();
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch (_) {}
    }
  };
}
