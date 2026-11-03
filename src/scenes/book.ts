// 03 Process Documentation — "the glass book".
// Built from glass and solids like the org stack. As the visitor scrolls:
// write (pages land on a glass back cover and lines of light draw across),
// record (a glowing play mark drops onto the page), bind (a spine rises and
// the glass front cover swings shut). The contents stay visible through the
// glass. Hovering opens the cover and fans the pages.
import * as THREE from 'three';
import type { ServiceScene } from './types';

const W = 1.3; // book width (x)
const D = 1.7; // book depth (z)
const COVER_T = 0.06;
const PAGE_T = 0.035;
const PAGES = 4;
const HINGE_X = -W / 2;
const BASE_Y = -0.28; // top of the back cover
const VIEW = 1.45; // half the visible height, in scene units

const BLUE = new THREE.Color('#1E76C7');
const TEAL = new THREE.Color('#1FC8A9');
const BRIGHT = new THREE.Color('#2FE0BE');
const IDLE_EDGE = new THREE.Color('#9FB3C4');
const PAGE_EDGE = new THREE.Color('#C9D3DC');

const COVER_OPEN = THREE.MathUtils.degToRad(172); // lying open, off to the left
const COVER_SHUT = THREE.MathUtils.degToRad(7);
const COVER_HOVER = THREE.MathUtils.degToRad(58);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
const easeInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
// 0→1 across a stretch of the scroll.
const span = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(47,224,190,.55)');
  grad.addColorStop(1, 'rgba(47,224,190,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// A glass slab with outlined edges, pivoting on the book's hinge.
function glassSlab(width: number, thick: number, depth: number) {
  const geo = new THREE.BoxGeometry(width, thick, depth).translate(width / 2, thick / 2, 0);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.3,
    clearcoat: 1,
    transparent: true,
    opacity: 0.45,
    emissive: BLUE.clone(),
    emissiveIntensity: 0,
    depthWrite: false,
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: IDLE_EDGE.clone(), transparent: true, opacity: 0.9 });
  const pivot = new THREE.Group();
  pivot.add(new THREE.Mesh(geo, mat), new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
  return { pivot, mat, edgeMat };
}

export function createScene(): ServiceScene {
  const scene = new THREE.Scene();
  // Same orthographic, isometric view as the org stack.
  const camera = new THREE.OrthographicCamera(-VIEW, VIEW, VIEW, -VIEW, 0.1, 50);
  camera.position.set(6, 4.6, 6);
  camera.lookAt(0, -0.1, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6e8f2, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(3, 6, 2);
  scene.add(sun);

  const book = new THREE.Group();
  scene.add(book);

  // ─── Back cover (always there; lights up as pages land) ───
  const back = glassSlab(W, COVER_T, D);
  back.pivot.position.set(HINGE_X, BASE_Y - COVER_T, 0);
  book.add(back.pivot);

  // ─── Pages: solid sheets that pivot on the hinge so they can fan ───
  const pageGeo = new THREE.BoxGeometry(W - 0.08, PAGE_T, D - 0.08).translate((W - 0.08) / 2 + 0.02, PAGE_T / 2, 0);
  const pageEdges = new THREE.EdgesGeometry(pageGeo);
  const pages = Array.from({ length: PAGES }, (_, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: 0xf7fafc, roughness: 0.6, transparent: true, opacity: 0 });
    const edgeMat = new THREE.LineBasicMaterial({ color: PAGE_EDGE, transparent: true, opacity: 0 });
    const pivot = new THREE.Group();
    pivot.add(new THREE.Mesh(pageGeo, mat), new THREE.LineSegments(pageEdges, edgeMat));
    book.add(pivot);
    return { pivot, mat, edgeMat, restY: BASE_Y + i * (PAGE_T + 0.012) };
  });
  const top = pages[PAGES - 1];

  // ─── Write: lines of light drawn across the top page ───
  const lineMat = new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 0.35, roughness: 0.4 });
  const lineSpec: [number, number][] = [[-0.62, 0.78], [-0.48, 0.92], [-0.34, 0.62], [-0.2, 0.84]];
  const lines = lineSpec.map(([z, len]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(len, 0.012, 0.055).translate(len / 2, 0, 0), lineMat);
    bar.position.set(0.2, PAGE_T + 0.008, z);
    bar.scale.x = 0.001;
    top.pivot.add(bar);
    return bar;
  });

  // ─── Record: a glowing play mark inside a frame ───
  const play = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.09, 3),
    new THREE.MeshStandardMaterial({ color: BRIGHT, emissive: TEAL, emissiveIntensity: 0.55, roughness: 0.3 }),
  );
  play.rotation.y = Math.PI / 2; // point toward the reader's right
  const playHome = new THREE.Vector3(0.66, PAGE_T + 0.045, 0.36);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false }));
  halo.scale.setScalar(0.9);
  play.add(halo);
  top.pivot.add(play);

  const frameGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.86, 0.6).rotateX(-Math.PI / 2));
  const frameMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0 });
  const frame = new THREE.LineSegments(frameGeo, frameMat);
  frame.position.set(0.66, PAGE_T + 0.004, 0.36);
  top.pivot.add(frame);
  const rippleMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0 });
  const ripple = new THREE.LineSegments(frameGeo, rippleMat);
  ripple.position.copy(frame.position);
  top.pivot.add(ripple);

  // ─── Bind: spine and glass front cover ───
  const spineMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.3, clearcoat: 1, transparent: true, opacity: 0.5,
    emissive: TEAL.clone(), emissiveIntensity: 0, depthWrite: false,
  });
  const stackH = PAGES * (PAGE_T + 0.012) + COVER_T * 2;
  const spineGeo = new THREE.BoxGeometry(COVER_T, stackH, D).translate(0, stackH / 2, 0);
  const spineEdgeMat = new THREE.LineBasicMaterial({ color: IDLE_EDGE.clone(), transparent: true, opacity: 0.9 });
  const spine = new THREE.Group();
  spine.add(new THREE.Mesh(spineGeo, spineMat), new THREE.LineSegments(new THREE.EdgesGeometry(spineGeo), spineEdgeMat));
  spine.position.set(HINGE_X - COVER_T / 2, BASE_Y - COVER_T, 0);
  book.add(spine);

  const front = glassSlab(W, COVER_T, D);
  front.mat.emissive.copy(TEAL);
  const frontY = BASE_Y + PAGES * (PAGE_T + 0.012) + 0.01;
  front.pivot.position.set(HINGE_X, frontY, 0);
  book.add(front.pivot);

  // Invisible box over the book for hover checks.
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(W, stackH + 0.3, D),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitBox.position.set(0, BASE_Y + stackH / 2, 0);
  book.add(hitBox);

  // ─── Hover ───
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hoverTarget = 0;
  let open = 0;

  return {
    scene,
    camera,
    resize(w, h) {
      const aspect = w / h;
      camera.left = -VIEW * aspect;
      camera.right = VIEW * aspect;
      camera.top = VIEW;
      camera.bottom = -VIEW;
      camera.updateProjectionMatrix();
    },
    pointer(x, y, inside) {
      hoverTarget = 0;
      if (!inside) return;
      ndc.set(x, y);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(hitBox).length) hoverTarget = 1;
    },
    update(progress, dt, t) {
      const bind = span(progress, 0.66, 0.96);
      // Hover only opens the book once it has been bound.
      open += ((hoverTarget && bind > 0.95 ? 1 : 0) - open) * Math.min(1, dt * 4);
      const fan = easeOut(open);

      // Write: pages land one by one, then the lines draw in.
      const write = span(progress, 0.02, 0.24);
      back.mat.emissiveIntensity = write * 0.3;
      back.edgeMat.color.copy(IDLE_EDGE).lerp(BLUE, write);
      pages.forEach((pg, i) => {
        const k = easeOut(span(progress, 0.02 + i * 0.05, 0.12 + i * 0.05));
        pg.pivot.position.set(HINGE_X, pg.restY + (1 - k) * 1.4, 0);
        pg.mat.opacity = k;
        pg.edgeMat.opacity = k;
        // Fan out from the hinge on hover, upper pages more.
        pg.pivot.rotation.z = fan * THREE.MathUtils.degToRad(5 + i * 7);
      });
      lines.forEach((bar, i) => {
        bar.scale.x = Math.max(0.001, easeOut(span(progress, 0.2 + i * 0.03, 0.3 + i * 0.03)));
      });

      // Record: the play mark drops in and its frame ripples.
      const rec = span(progress, 0.36, 0.5);
      play.visible = rec > 0;
      play.position.copy(playHome);
      play.position.y += (1 - easeOut(rec)) * 1.6 + Math.sin(t * 1.6) * 0.012 * rec;
      play.scale.setScalar(Math.max(0.001, clamp01(rec * 3)));
      const framed = span(progress, 0.46, 0.6);
      frameMat.opacity = framed;
      const phase = (t * 0.45) % 1;
      const s = 1 + phase * 0.45;
      ripple.scale.set(s, 1, s);
      rippleMat.opacity = (1 - phase) * framed * 0.8;

      // Bind: the spine rises, then the cover swings shut over the pages.
      const rise = easeOut(span(progress, 0.66, 0.78));
      spine.scale.y = Math.max(0.001, rise);
      spine.visible = rise > 0.002;
      spineMat.emissiveIntensity = rise * 0.3;
      spineEdgeMat.color.copy(IDLE_EDGE).lerp(TEAL, rise);

      const swing = easeInOut(span(progress, 0.7, 0.96));
      front.pivot.visible = swing > 0;
      const shut = COVER_OPEN + (COVER_SHUT - COVER_OPEN) * swing;
      front.pivot.rotation.z = shut + (COVER_HOVER - COVER_SHUT) * fan * bind;
      front.mat.opacity = 0.45 * clamp01(swing * 4);
      front.mat.emissiveIntensity = swing * 0.3;
      front.edgeMat.color.copy(IDLE_EDGE).lerp(TEAL, swing);
      front.edgeMat.opacity = 0.9 * clamp01(swing * 4);

      // A gentle sway so the book reads as 3D.
      book.rotation.y = Math.sin(t * 0.3) * 0.08;

      return progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
    },
  };
}
