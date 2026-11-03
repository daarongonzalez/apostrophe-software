// 03 Process Documentation — "the living library".
// Content cards fly in and settle onto three glass shelves as the visitor
// scrolls: how-tos, then recordings, then guides. Hovering a card slides it
// out from its shelf and highlights its type in the labels.
import * as THREE from 'three';
import type { ServiceScene } from './types';

type Kind = 'howto' | 'recording' | 'guide';
const ROWS: Kind[] = ['howto', 'recording', 'guide'];
const PER_ROW = 3;

const CARD_W = 0.5;
const CARD_H = 0.62;
const CARD_D = 0.035;
const SHELF_W = 1.95;
const SHELF_D = 0.5;
const SHELF_T = 0.06;
const ROW_STEP = 0.82;
const VIEW = 1.78; // half the visible height, in scene units

const BLUE = new THREE.Color('#1E76C7');
const TEAL = new THREE.Color('#1FC8A9');
const IDLE_EDGE = new THREE.Color('#9FB3C4');

// Each row flies in over its own stretch of the scroll.
const rowStart = (r: number) => 0.06 + r * 0.3;
const ROW_SPAN = 0.3;
const CARD_STAGGER = 0.07;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutBack = (v: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2);
};

// Simple card faces drawn on a canvas: numbered steps, a video, a bookmarked page.
function faceTexture(kind: Kind, tint: THREE.Color) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 160;
  const g = c.getContext('2d')!;
  const hex = `#${tint.getHexString()}`;
  const line = '#D3DCE4';

  g.fillStyle = '#FFFFFF';
  g.fillRect(0, 0, 128, 160);
  g.fillStyle = hex;
  g.fillRect(0, 0, 128, 14);

  if (kind === 'howto') {
    for (let i = 0; i < 4; i++) {
      const y = 32 + i * 30;
      g.fillStyle = hex;
      g.fillRect(14, y, 14, 14);
      g.fillStyle = line;
      g.fillRect(36, y + 1, 76 - (i % 2) * 18, 5);
      g.fillRect(36, y + 9, 52, 4);
    }
  } else if (kind === 'recording') {
    g.fillStyle = tint.clone().lerp(new THREE.Color('#FFFFFF'), 0.82).getStyle();
    g.fillRect(14, 28, 100, 66);
    g.fillStyle = hex;
    g.beginPath();
    g.moveTo(54, 46);
    g.lineTo(54, 76);
    g.lineTo(78, 61);
    g.closePath();
    g.fill();
    g.fillStyle = line;
    g.fillRect(14, 108, 100, 5);
    g.fillRect(14, 120, 72, 5);
    g.fillStyle = hex;
    g.fillRect(14, 138, 40, 4);
  } else {
    g.fillStyle = hex;
    g.beginPath();
    g.moveTo(92, 14);
    g.lineTo(110, 14);
    g.lineTo(110, 46);
    g.lineTo(101, 38);
    g.lineTo(92, 46);
    g.closePath();
    g.fill();
    g.fillStyle = line;
    g.fillRect(14, 32, 64, 7);
    for (let i = 0; i < 6; i++) g.fillRect(14, 58 + i * 15, i === 5 ? 58 : 100, 5);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createScene(): ServiceScene {
  const scene = new THREE.Scene();
  // Orthographic, closer to front-on than the stack so the card faces read.
  const camera = new THREE.OrthographicCamera(-VIEW, VIEW, VIEW, -VIEW, 0.1, 50);
  camera.position.set(3.2, 2.2, 6);
  camera.lookAt(0, -0.02, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6e8f2, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(2, 4, 5);
  scene.add(sun);

  const library = new THREE.Group();
  scene.add(library);

  const shelfGeo = new THREE.BoxGeometry(SHELF_W, SHELF_T, SHELF_D);
  const shelfEdgeGeo = new THREE.EdgesGeometry(shelfGeo);
  const cardGeo = new THREE.BoxGeometry(CARD_W, CARD_H, CARD_D);

  const rows = ROWS.map((kind, r) => {
    const tint = BLUE.clone().lerp(TEAL, r / (ROWS.length - 1));
    const y = (1 - r) * ROW_STEP - CARD_H / 2;

    // Glass shelf, styled like the org stack layers.
    const shelfMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.35,
      clearcoat: 1,
      transparent: true,
      opacity: 0.55,
      emissive: tint,
      emissiveIntensity: 0,
      depthWrite: false,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, y, 0);
    const edgeMat = new THREE.LineBasicMaterial({ color: IDLE_EDGE.clone(), transparent: true, opacity: 0.85 });
    const edges = new THREE.LineSegments(shelfEdgeGeo, edgeMat);
    edges.position.copy(shelf.position);
    library.add(shelf, edges);

    // Box faces: +x, -x, +y, -y, +z (front), -z.
    const side = new THREE.MeshStandardMaterial({ color: tint.clone().lerp(new THREE.Color('#FFFFFF'), 0.35), roughness: 0.5 });
    // Unlit front so the card faces stay crisp and white at any angle.
    const front = new THREE.MeshBasicMaterial({ map: faceTexture(kind, tint) });
    const mats = [side, side, side, side, front, side];

    const cards = Array.from({ length: PER_ROW }, (_, c) => {
      const mesh = new THREE.Mesh(cardGeo, mats);
      const home = new THREE.Vector3((c - (PER_ROW - 1) / 2) * 0.62, y + SHELF_T / 2 + CARD_H / 2, 0.02);
      // Start somewhere off to the side and above, tumbling.
      const from = new THREE.Vector3(
        (Math.random() < 0.5 ? -1 : 1) * (2.4 + Math.random() * 1.2),
        1.8 + Math.random() * 1.6,
        (Math.random() - 0.5) * 2,
      );
      const spin = new THREE.Euler((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2.4);
      library.add(mesh);
      return { mesh, home, from, spin, row: r, index: c, hover: 0 };
    });

    return { kind, tint, shelfMat, edgeMat, cards };
  });

  const allCards = rows.flatMap((r) => r.cards);
  const pickable = allCards.map((c) => c.mesh);

  // ─── Hover ───
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered: (typeof allCards)[number] | null = null;

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
      hovered = null;
      if (!inside) return;
      ndc.set(x, y);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(pickable)[0];
      if (hit) hovered = allCards.find((c) => c.mesh === hit.object) || null;
    },
    update(progress, dt, t) {
      rows.forEach((row, r) => {
        let placed = 0;
        row.cards.forEach((card) => {
          const start = rowStart(r) + card.index * CARD_STAGGER;
          const k = clamp01((progress - start) / (ROW_SPAN - CARD_STAGGER * (PER_ROW - 1) * 0.5));
          const e = easeOutBack(k);
          placed += k;

          card.hover += ((hovered === card && k >= 1 ? 1 : 0) - card.hover) * Math.min(1, dt * 9);
          const m = card.mesh;
          m.visible = k > 0;
          m.position.lerpVectors(card.from, card.home, e);
          // Hovered cards slide out from the shelf toward the viewer.
          m.position.z += card.hover * 0.32;
          m.position.y += card.hover * 0.06;
          const settle = 1 - Math.min(1, e);
          m.rotation.set(card.spin.x * settle, card.spin.y * settle + card.hover * -0.18, card.spin.z * settle);
          m.scale.setScalar(0.6 + 0.4 * Math.min(1, k * 1.4));
        });

        const fill = placed / PER_ROW;
        row.shelfMat.emissiveIntensity = fill * 0.35;
        row.edgeMat.color.copy(IDLE_EDGE).lerp(row.tint, fill);
      });
      // A gentle sway so the shelves read as 3D.
      library.rotation.y = Math.sin(t * 0.3) * 0.1;

      if (hovered) return hovered.row;
      return progress < rowStart(1) ? 0 : progress < rowStart(2) ? 1 : 2;
    },
  };
}
