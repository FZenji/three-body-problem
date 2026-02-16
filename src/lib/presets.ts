import { Body, vec3 } from './physics';

export interface Preset {
  name: string;
  description: string;
  bodies: Omit<Body, 'trail' | 'acceleration'>[];
  dt: number;
  recommended2D: boolean;
}

const DEFAULT_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d'];
const DEFAULT_SIZES = [8, 8, 8];

/**
 * Figure-eight orbit (Chenciner & Montgomery, 2000)
 * Three equal-mass bodies follow a single figure-8 curve.
 */
const figureEight: Preset = {
  name: 'Figure Eight',
  description: 'Three equal masses trace a shared figure-8 path (Chenciner & Montgomery, 2000).',
  dt: 0.001,
  recommended2D: true,
  bodies: [
    {
      mass: 1,
      position: vec3(-0.97000436, 0.24308753, 0),
      velocity: vec3(0.4662036850, 0.4323657300, 0),
      color: DEFAULT_COLORS[0],
      size: DEFAULT_SIZES[0],
    },
    {
      mass: 1,
      position: vec3(0.97000436, -0.24308753, 0),
      velocity: vec3(0.4662036850, 0.4323657300, 0),
      color: DEFAULT_COLORS[1],
      size: DEFAULT_SIZES[1],
    },
    {
      mass: 1,
      position: vec3(0, 0, 0),
      velocity: vec3(-0.93240737, -0.86473146, 0),
      color: DEFAULT_COLORS[2],
      size: DEFAULT_SIZES[2],
    },
  ],
};

/**
 * Lagrange equilateral triangle (L4/L5 type)
 * Three equal masses orbit their common center in an equilateral triangle.
 */
const lagrangeTriangle: Preset = {
  name: 'Lagrange Triangle',
  description: 'Three equal masses orbit in an equilateral triangle configuration.',
  dt: 0.002,
  recommended2D: true,
  bodies: [
    {
      mass: 1,
      position: vec3(1, 0, 0),
      velocity: vec3(0, 0.5, 0),
      color: DEFAULT_COLORS[0],
      size: DEFAULT_SIZES[0],
    },
    {
      mass: 1,
      position: vec3(-0.5, Math.sqrt(3) / 2, 0),
      velocity: vec3(-Math.sqrt(3) / 4, -0.25, 0),
      color: DEFAULT_COLORS[1],
      size: DEFAULT_SIZES[1],
    },
    {
      mass: 1,
      position: vec3(-0.5, -Math.sqrt(3) / 2, 0),
      velocity: vec3(Math.sqrt(3) / 4, -0.25, 0),
      color: DEFAULT_COLORS[2],
      size: DEFAULT_SIZES[2],
    },
  ],
};

/**
 * Broucke A-2 orbit
 * A periodic orbit where two bodies oscillate while a third loops around.
 */
const brouckeA2: Preset = {
  name: 'Broucke A-2',
  description: 'A periodic orbit where two bodies oscillate symmetrically while the third loops.',
  dt: 0.001,
  recommended2D: true,
  bodies: [
    {
      mass: 1,
      position: vec3(-0.9892620043, 0, 0),
      velocity: vec3(0, 1.9169244185, 0),
      color: DEFAULT_COLORS[0],
      size: DEFAULT_SIZES[0],
    },
    {
      mass: 1,
      position: vec3(2.2096177241, 0, 0),
      velocity: vec3(0, -0.1070055128, 0),
      color: DEFAULT_COLORS[1],
      size: DEFAULT_SIZES[1],
    },
    {
      mass: 1,
      position: vec3(-1.2203557197, 0, 0),
      velocity: vec3(0, -1.8099189057, 0),
      color: DEFAULT_COLORS[2],
      size: DEFAULT_SIZES[2],
    },
  ],
};

/**
 * Chaotic default — an unstable setup that quickly diverges.
 */
const chaotic: Preset = {
  name: 'Chaotic',
  description: 'An unstable configuration that quickly devolves into chaotic motion.',
  dt: 0.002,
  recommended2D: false,
  bodies: [
    {
      mass: 1,
      position: vec3(1, 3, 0),
      velocity: vec3(0, 0, 0),
      color: DEFAULT_COLORS[0],
      size: DEFAULT_SIZES[0],
    },
    {
      mass: 2,
      position: vec3(-2, -1, 0),
      velocity: vec3(0, 0, 0.5),
      color: DEFAULT_COLORS[1],
      size: DEFAULT_SIZES[1],
    },
    {
      mass: 1,
      position: vec3(1, -1, 0),
      velocity: vec3(0, 0, -0.5),
      color: DEFAULT_COLORS[2],
      size: DEFAULT_SIZES[2],
    },
  ],
};

/**
 * Butterfly orbit
 */
const butterfly: Preset = {
  name: 'Butterfly',
  description: 'A butterfly-shaped periodic orbit with three equal masses.',
  dt: 0.001,
  recommended2D: true,
  bodies: [
    {
      mass: 1,
      position: vec3(-1, 0, 0),
      velocity: vec3(0.30689, 0.12551, 0),
      color: DEFAULT_COLORS[0],
      size: DEFAULT_SIZES[0],
    },
    {
      mass: 1,
      position: vec3(1, 0, 0),
      velocity: vec3(0.30689, 0.12551, 0),
      color: DEFAULT_COLORS[1],
      size: DEFAULT_SIZES[1],
    },
    {
      mass: 1,
      position: vec3(0, 0, 0),
      velocity: vec3(-0.61378, -0.25102, 0),
      color: DEFAULT_COLORS[2],
      size: DEFAULT_SIZES[2],
    },
  ],
};

/**
 * Custom — user-defined initial conditions
 */
const custom: Preset = {
  name: 'Custom',
  description: 'Set your own initial positions, velocities, and masses.',
  dt: 0.002,
  recommended2D: false,
  bodies: [
    {
      mass: 1,
      position: vec3(1, 0, 0),
      velocity: vec3(0, 0.5, 0),
      color: DEFAULT_COLORS[0],
      size: DEFAULT_SIZES[0],
    },
    {
      mass: 1,
      position: vec3(-1, 0, 0),
      velocity: vec3(0, -0.5, 0),
      color: DEFAULT_COLORS[1],
      size: DEFAULT_SIZES[1],
    },
    {
      mass: 1,
      position: vec3(0, 1, 0),
      velocity: vec3(-0.5, 0, 0),
      color: DEFAULT_COLORS[2],
      size: DEFAULT_SIZES[2],
    },
  ],
};

export const CUSTOM_PRESET_NAME = 'Custom';

export const PRESETS: Preset[] = [
  figureEight,
  lagrangeTriangle,
  brouckeA2,
  butterfly,
  chaotic,
  custom,
];

export function getPresetByName(name: string): Preset | undefined {
  return PRESETS.find((p) => p.name === name);
}
