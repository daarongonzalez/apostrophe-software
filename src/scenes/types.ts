import type { Camera, Scene } from 'three';

// A 3D scene shown inside one of the home page's glass rings.
// ServiceScene.astro handles loading, sizing, scroll progress and pausing;
// each scene only draws itself.
export interface ServiceScene {
  scene: Scene;
  camera: Camera;
  resize(width: number, height: number, dpr: number): void;
  // progress runs 0→1 as the visitor scrolls the row into view.
  // Returns the index of the step label to highlight.
  update(progress: number, dt: number, time: number): number;
  // x and y in -1…1 across the circle; inside is false when the cursor leaves.
  pointer?(x: number, y: number, inside: boolean): void;
}

export interface SceneOptions {
  small: boolean;
}
