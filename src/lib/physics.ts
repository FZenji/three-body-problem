// Three-body gravitational physics engine using Velocity-Verlet integration

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Body {
  mass: number;
  position: Vec3;
  velocity: Vec3;
  acceleration: Vec3;
  color: string;
  size: number;
  trail: Vec3[];
}

export interface SimulationState {
  bodies: Body[];
  time: number;
  dt: number;
  G: number;
  softening: number;
}

export function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export function vec3Add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function vec3Sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function vec3Scale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

export function vec3Length(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function vec3Dist(a: Vec3, b: Vec3): number {
  return vec3Length(vec3Sub(a, b));
}

/**
 * Compute gravitational acceleration on body i due to all other bodies.
 */
function computeAcceleration(
  bodies: Body[],
  i: number,
  G: number,
  softening: number
): Vec3 {
  let ax = 0,
    ay = 0,
    az = 0;

  for (let j = 0; j < bodies.length; j++) {
    if (i === j) continue;
    const dx = bodies[j].position.x - bodies[i].position.x;
    const dy = bodies[j].position.y - bodies[i].position.y;
    const dz = bodies[j].position.z - bodies[i].position.z;
    const r2 = dx * dx + dy * dy + dz * dz + softening * softening;
    const r = Math.sqrt(r2);
    const f = (G * bodies[j].mass) / (r2 * r);
    ax += f * dx;
    ay += f * dy;
    az += f * dz;
  }

  return { x: ax, y: ay, z: az };
}

/**
 * Velocity-Verlet integration step.
 * More accurate and energy-conserving than basic Euler.
 */
export function step(state: SimulationState): SimulationState {
  const { bodies, dt, G, softening } = state;

  // 1) Update positions using current velocities and accelerations
  const newBodies = bodies.map((body) => {
    const newPos = {
      x: body.position.x + body.velocity.x * dt + 0.5 * body.acceleration.x * dt * dt,
      y: body.position.y + body.velocity.y * dt + 0.5 * body.acceleration.y * dt * dt,
      z: body.position.z + body.velocity.z * dt + 0.5 * body.acceleration.z * dt * dt,
    };
    return { ...body, position: newPos };
  });

  // 2) Compute new accelerations at updated positions
  const newAccelerations = newBodies.map((_, i) =>
    computeAcceleration(newBodies, i, G, softening)
  );

  // 3) Update velocities using average of old and new accelerations
  for (let i = 0; i < newBodies.length; i++) {
    newBodies[i] = {
      ...newBodies[i],
      velocity: {
        x: newBodies[i].velocity.x + 0.5 * (bodies[i].acceleration.x + newAccelerations[i].x) * dt,
        y: newBodies[i].velocity.y + 0.5 * (bodies[i].acceleration.y + newAccelerations[i].y) * dt,
        z: newBodies[i].velocity.z + 0.5 * (bodies[i].acceleration.z + newAccelerations[i].z) * dt,
      },
      acceleration: newAccelerations[i],
    };
  }

  return {
    ...state,
    bodies: newBodies,
    time: state.time + dt,
  };
}

/**
 * Compute total kinetic energy of the system.
 */
export function kineticEnergy(bodies: Body[]): number {
  return bodies.reduce((sum, b) => {
    const v2 = b.velocity.x ** 2 + b.velocity.y ** 2 + b.velocity.z ** 2;
    return sum + 0.5 * b.mass * v2;
  }, 0);
}

/**
 * Compute total gravitational potential energy of the system.
 */
export function potentialEnergy(bodies: Body[], G: number, softening: number): number {
  let pe = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const r = vec3Dist(bodies[i].position, bodies[j].position);
      pe -= (G * bodies[i].mass * bodies[j].mass) / Math.sqrt(r * r + softening * softening);
    }
  }
  return pe;
}

/**
 * Compute the minimum distance between any pair of bodies.
 */
export function minDistance(bodies: Body[]): number {
  let min = Infinity;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const d = vec3Dist(bodies[i].position, bodies[j].position);
      if (d < min) min = d;
    }
  }
  return min;
}

/**
 * Clone a body deeply.
 */
export function cloneBody(body: Body): Body {
  return {
    ...body,
    position: { ...body.position },
    velocity: { ...body.velocity },
    acceleration: { ...body.acceleration },
    trail: [],
  };
}
