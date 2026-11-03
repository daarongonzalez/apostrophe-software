// 01 Enablement sprints — "noise to signal".
// A cloud of drifting particles (the noise) settles as the visitor scrolls:
// observe → audit → strategize, ending as the three connected nodes of the
// sprints icon. The cursor clears a patch of noise like a lens.
import * as THREE from 'three';
import type { SceneOptions, ServiceScene } from './types';

// Icon layout: left node, top-right node, bottom-right node.
const NODES: [number, number][] = [[-0.95, 0], [0.75, 0.85], [0.75, -0.85]];
const EDGES: [number, number][] = [[0, 1], [0, 2]];
const NODE_R = 0.22;
const BLUE = [0x1e / 255, 0x76 / 255, 0xc7 / 255];
const TEAL = [0x1f / 255, 0xc8 / 255, 0xa9 / 255];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const vertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aRole;   // 0 noise, 1 node, 2 edge
  attribute float aSeed;
  uniform float uPhase;
  uniform float uObserve;
  uniform float uAudit;
  uniform float uForm;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  uniform float uPixel;
  varying float vAlpha;
  varying vec3 vColor;

  const vec3 NOISE_COL = vec3(0.64, 0.71, 0.77);
  const vec3 BLUE = vec3(${BLUE.join(',')});
  const vec3 TEAL = vec3(${TEAL.join(',')});

  void main() {
    float s = aSeed * 6.2831;
    vec3 p = position + vec3(
      sin(uPhase * 0.6 + s) * 0.25,
      cos(uPhase * 0.5 + s * 1.3) * 0.25,
      sin(uPhase * 0.4 + s * 0.7) * 0.2
    );
    // Observing: the cloud calms and draws in a little.
    p.xy *= mix(1.0, 0.86, uObserve);

    bool noise = aRole < 0.5;
    float f = smoothstep(0.0, 1.0, clamp((uForm - aSeed * 0.3) / 0.7, 0.0, 1.0));

    if (noise) {
      // Cut the noise: drift out of frame as the plan forms.
      p.xy *= 1.0 + uForm * 0.7;
    } else {
      vec3 wobble = vec3(sin(uPhase * 0.9 + s), cos(uPhase * 0.8 + s), 0.0) * 0.015;
      p = mix(p, aTarget + wobble, f);
    }

    // Cursor lens pushes particles aside until the shape has formed.
    vec2 d = p.xy - uMouse;
    float len = length(d);
    float lens = 0.75;
    if (len < lens && len > 0.0001) {
      float push = (lens - len) * 0.9 * uMouseOn * (1.0 - f);
      p.xy += normalize(d) * push;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = 5.0;
    vec3 brand = mix(BLUE, TEAL, clamp((aTarget.x + 1.2) / 2.2, 0.0, 1.0));
    if (noise) {
      size *= mix(1.0, 0.65, uAudit);
      vAlpha = mix(0.55, 0.16, uAudit) * (1.0 - uForm);
      vColor = NOISE_COL;
    } else {
      size *= mix(1.0, 1.3, uAudit);
      vAlpha = mix(0.55, 0.95, uAudit);
      vColor = mix(NOISE_COL, brand, uAudit);
    }
    gl_PointSize = size * uPixel * (8.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = vAlpha * smoothstep(0.5, 0.32, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export function createScene({ small }: SceneOptions): ServiceScene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 8);
  const halfView = Math.tan(THREE.MathUtils.degToRad(15)) * 8;

  // ─── Particles ───
  const count = small ? 520 : 900;
  const pos = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const role = new Float32Array(count);
  const seed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 2.0;
    pos.set([Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 2], i * 3);
    seed[i] = Math.random();

    const pick = Math.random();
    if (pick < 0.22) {
      // Node cluster: points spread over a small sphere.
      const [nx, ny] = NODES[i % 3];
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const rr = NODE_R * Math.cbrt(Math.random()) * 0.95;
      target.set([nx + rr * Math.sin(v) * Math.cos(u), ny + rr * Math.sin(v) * Math.sin(u), rr * Math.cos(v)], i * 3);
      role[i] = 1;
    } else if (pick < 0.4) {
      // Edge: points along a connecting line, clear of the nodes.
      const [ia, ib] = EDGES[i % 2];
      const t = 0.15 + Math.random() * 0.7;
      const [ax, ay] = NODES[ia];
      const [bx, by] = NODES[ib];
      target.set([ax + (bx - ax) * t, ay + (by - ay) * t, (Math.random() - 0.5) * 0.04], i * 3);
      role[i] = 2;
    } else {
      target.set([pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]], i * 3);
      role[i] = 0;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
  geo.setAttribute('aRole', new THREE.BufferAttribute(role, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

  const uniforms = {
    uPhase: { value: 0 },
    uObserve: { value: 0 },
    uAudit: { value: 0 },
    uForm: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uMouseOn: { value: 0 },
    uPixel: { value: 1 },
  };
  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthWrite: false }),
  );
  scene.add(points);

  // ─── Glass nodes that settle in at the end ───
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe6f2, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(2, 3, 5);
  scene.add(sun);

  const sphereGeo = new THREE.SphereGeometry(NODE_R, 40, 24);
  const spheres = NODES.map(([x, y]) => {
    const t = clamp01((x + 1.2) / 2.2);
    const color = new THREE.Color().setRGB(
      BLUE[0] + (TEAL[0] - BLUE[0]) * t,
      BLUE[1] + (TEAL[1] - BLUE[1]) * t,
      BLUE[2] + (TEAL[2] - BLUE[2]) * t,
    );
    const mesh = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15, transparent: true, opacity: 0.92 }),
    );
    mesh.position.set(x, y, 0);
    mesh.scale.setScalar(0.001);
    scene.add(mesh);
    return mesh;
  });

  let mouseTarget = 0;

  return {
    scene,
    camera,
    resize(w, h, dpr) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Keep point sizes consistent with the 316px design circle.
      uniforms.uPixel.value = dpr * (h / 316);
    },
    pointer(x, y, inside) {
      if (inside) uniforms.uMouse.value.set(x * halfView * camera.aspect, y * halfView);
      mouseTarget = inside ? 1 : 0;
    },
    update(progress, dt, t) {
      const observe = clamp01(progress / 0.33);
      const audit = clamp01((progress - 0.33) / 0.33);
      const form = clamp01((progress - 0.66) / 0.34);

      uniforms.uObserve.value = observe;
      uniforms.uAudit.value = audit;
      uniforms.uForm.value = form;
      uniforms.uPhase.value += dt * (1 - observe * 0.65);
      uniforms.uMouseOn.value += (mouseTarget - uniforms.uMouseOn.value) * Math.min(1, dt * 6);

      const grow = THREE.MathUtils.smoothstep(form, 0.75, 1);
      spheres.forEach((m, i) => {
        m.scale.setScalar(Math.max(0.001, grow));
        m.position.z = Math.sin(t * 1.2 + i * 2) * 0.05 * grow;
      });
      // A slow turn so the cloud reads as 3D, settling flat once formed.
      points.rotation.y = Math.sin(t * 0.25) * 0.35 * (1 - form);

      return progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
    },
  };
}
