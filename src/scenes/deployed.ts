// 02 Forward deployed — "the org stack".
// Three frosted layers stand for leadership, managers and teams. A glowing
// cube (the engineer) drops onto the top layer, then a beam of light runs
// down through the stack, lighting each level in turn: top to bottom.
// Hovering spreads the layers apart and highlights the one under the cursor.
import * as THREE from 'three';
import type { ServiceScene } from './types';

const LAYERS = 3;
const SIZE = 1.5;
const THICK = 0.1;
const GAP = 0.5;
const GAP_OPEN = 0.72;
const CUBE = 0.26;
const VIEW = 1.75; // half the visible height, in scene units
const DROP_FROM = 3.2; // cube starts above the circle

const BLUE = new THREE.Color('#1E76C7');
const TEAL = new THREE.Color('#1FC8A9');
const BRIGHT = new THREE.Color('#2FE0BE');
const IDLE_EDGE = new THREE.Color('#9FB3C4');

// Progress points where the cube lands and the beam reaches each layer.
const LAND = 0.4;
const reach = (i: number) => LAND + 0.55 * (i / (LAYERS - 1));

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

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

export function createScene(): ServiceScene {
  const scene = new THREE.Scene();
  // Orthographic so the stack reads as isometric, like the hero grid.
  const camera = new THREE.OrthographicCamera(-VIEW, VIEW, VIEW, -VIEW, 0.1, 50);
  camera.position.set(6, 4.6, 6);
  camera.lookAt(0, -0.05, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6e8f2, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(3, 6, 2);
  scene.add(sun);

  // ─── Layers ───
  const stack = new THREE.Group();
  scene.add(stack);
  const slabGeo = new THREE.BoxGeometry(SIZE, THICK, SIZE);
  const edgeGeo = new THREE.EdgesGeometry(slabGeo);
  const rippleGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(SIZE, SIZE).rotateX(-Math.PI / 2));

  const layers = Array.from({ length: LAYERS }, (_, i) => {
    const tint = BLUE.clone().lerp(TEAL, i / (LAYERS - 1));
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.35,
      clearcoat: 1,
      transparent: true,
      opacity: 0.5,
      emissive: tint,
      emissiveIntensity: 0,
      depthWrite: false,
    });
    const slab = new THREE.Mesh(slabGeo, glassMat);
    const edgeMat = new THREE.LineBasicMaterial({ color: IDLE_EDGE.clone(), transparent: true, opacity: 0.85 });
    const rippleMat = new THREE.LineBasicMaterial({ color: tint, transparent: true, opacity: 0 });
    const ripple = new THREE.LineSegments(rippleGeo, rippleMat);
    ripple.position.y = THICK / 2 + 0.003;

    const group = new THREE.Group();
    group.add(slab, new THREE.LineSegments(edgeGeo, edgeMat), ripple);
    stack.add(group);
    return { group, slab, glassMat, edgeMat, ripple, rippleMat, tint, hover: 0 };
  });

  // ─── The engineer: a glowing cube with a soft halo ───
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(CUBE, CUBE, CUBE),
    new THREE.MeshStandardMaterial({ color: BRIGHT, emissive: TEAL, emissiveIntensity: 0.55, roughness: 0.3 }),
  );
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false }));
  halo.scale.setScalar(1.2);
  cube.add(halo);
  scene.add(cube);

  // Beam grows downward from the top layer; its origin sits at the top.
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 1, 12).translate(0, -0.5, 0),
    new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.8 }),
  );
  scene.add(beam);

  // ─── Hover ───
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let inside = false;
  let hovered = -1;
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
    pointer(x, y, isInside) {
      inside = isInside;
      hovered = -1;
      if (!isInside) return;
      ndc.set(x, y);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(layers.map((l) => l.slab))[0];
      if (hit) hovered = layers.findIndex((l) => l.slab === hit.object);
    },
    update(progress, dt, t) {
      open += ((inside ? 1 : 0) - open) * Math.min(1, dt * 5);
      const gap = GAP + (GAP_OPEN - GAP) * easeOut(open);
      const layerY = (i: number) => (1 - i) * gap;

      // Cube drops in and settles on the top layer.
      const land = clamp01(progress / LAND);
      const restY = layerY(0) + THICK / 2 + CUBE / 2;
      cube.position.y = DROP_FROM + (restY - DROP_FROM) * easeOut(land);
      cube.scale.setScalar(Math.max(0.001, clamp01(progress / 0.08)));
      cube.rotation.y = (1 - easeOut(land)) * Math.PI * 1.5 + Math.sin(t * 0.8) * 0.06;
      cube.position.y += Math.sin(t * 1.6) * 0.02 * land;

      // Beam runs from the top layer to the bottom one.
      const run = clamp01((progress - LAND) / (reach(LAYERS - 1) - LAND));
      const length = run * (layerY(0) - layerY(LAYERS - 1));
      beam.visible = length > 0.002;
      beam.position.y = layerY(0);
      beam.scale.y = Math.max(0.001, length);

      let step = 0;
      layers.forEach((l, i) => {
        l.group.position.y = layerY(i);
        const lit = THREE.MathUtils.smoothstep(progress, reach(i) - 0.05, reach(i) + 0.02);
        if (lit > 0.5) step = i;
        l.hover += ((hovered === i ? 1 : 0) - l.hover) * Math.min(1, dt * 8);

        l.glassMat.emissiveIntensity = lit * 0.42 + l.hover * 0.25;
        l.glassMat.opacity = 0.5 + lit * 0.22;
        l.edgeMat.color.copy(IDLE_EDGE).lerp(l.tint, Math.max(lit, l.hover));

        // Training spreads across each lit level in soft ripples.
        const phase = (t * 0.45 + i * 0.3) % 1;
        const s = 0.15 + 0.85 * phase;
        l.ripple.scale.set(s, 1, s);
        l.rippleMat.opacity = (1 - phase) * lit * 0.9;
      });
      // A gentle sway so the stack reads as 3D.
      stack.rotation.y = Math.sin(t * 0.3) * 0.08;

      return hovered >= 0 ? hovered : step;
    },
  };
}
