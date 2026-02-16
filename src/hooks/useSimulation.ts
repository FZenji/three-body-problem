'use client';

import { useCallback, useRef, useState } from 'react';
import { Body, SimulationState, cloneBody, step, vec3 } from '@/lib/physics';
import { PRESETS, Preset } from '@/lib/presets';

export interface SimulationConfig {
  trailLength: number;
  showTrails: boolean;
  speedMultiplier: number;
}

export function useSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [trailLength, setTrailLength] = useState(500);
  const [showTrails, setShowTrails] = useState(true);
  const [currentPreset, setCurrentPreset] = useState<string>(PRESETS[0].name);
  const [dimension, setDimension] = useState<'2D' | '3D'>('2D');
  const [, setTick] = useState(0); // Force re-renders

  const stateRef = useRef<SimulationState>(initFromPreset(PRESETS[0]));
  const bodiesRef = useRef<Body[]>(stateRef.current.bodies);
  const animFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const speedRef = useRef(1);
  const trailLengthRef = useRef(500);
  const showTrailsRef = useRef(true);
  const stepsPerFrameRef = useRef(10);

  // Sync refs with state
  const updateSpeed = useCallback((s: number) => {
    speedRef.current = s;
    setSpeedMultiplier(s);
  }, []);

  const updateTrailLength = useCallback((l: number) => {
    trailLengthRef.current = l;
    setTrailLength(l);
  }, []);

  const updateShowTrails = useCallback((s: boolean) => {
    showTrailsRef.current = s;
    setShowTrails(s);
  }, []);

  const loop = useCallback(() => {
    if (!isPlayingRef.current) return;

    const stepsPerFrame = stepsPerFrameRef.current;
    const speed = speedRef.current;
    const maxTrail = trailLengthRef.current;
    const trails = showTrailsRef.current;

    for (let i = 0; i < stepsPerFrame * speed; i++) {
      stateRef.current = step(stateRef.current);
    }

    // Update trails
    stateRef.current.bodies.forEach((body) => {
      if (trails) {
        body.trail.push({ ...body.position });
        if (body.trail.length > maxTrail) {
          body.trail.splice(0, body.trail.length - maxTrail);
        }
      }
    });

    bodiesRef.current = stateRef.current.bodies;
    setTick((t) => t + 1);

    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  const play = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    animFrameRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const reset = useCallback(
    (presetName?: string) => {
      pause();
      const preset = PRESETS.find((p) => p.name === (presetName || currentPreset)) || PRESETS[0];
      stateRef.current = initFromPreset(preset);
      bodiesRef.current = stateRef.current.bodies;
      if (presetName) setCurrentPreset(presetName);
      setTick((t) => t + 1);
    },
    [pause, currentPreset]
  );

  const selectPreset = useCallback(
    (name: string) => {
      reset(name);
    },
    [reset]
  );

  const updateBody = useCallback(
    (index: number, updates: Partial<Pick<Body, 'color' | 'size' | 'mass' | 'position' | 'velocity'>>) => {
      const bodies = stateRef.current.bodies;
      if (index < 0 || index >= bodies.length) return;
      stateRef.current = {
        ...stateRef.current,
        bodies: bodies.map((b, i) =>
          i === index ? { ...b, ...updates } : b
        ),
      };
      bodiesRef.current = stateRef.current.bodies;
      setTick((t) => t + 1);
    },
    []
  );

  return {
    bodies: bodiesRef.current,
    stateRef,
    isPlaying,
    speedMultiplier,
    trailLength,
    showTrails,
    currentPreset,
    dimension,
    setDimension,
    play,
    pause,
    reset,
    selectPreset,
    updateSpeed,
    updateTrailLength,
    updateShowTrails,
    updateBody,
  };
}

function initFromPreset(preset: Preset): SimulationState {
  const bodies: Body[] = preset.bodies.map((b) => ({
    ...cloneBody({
      ...b,
      acceleration: vec3(0, 0, 0),
      trail: [],
    }),
    trail: [],
  }));

  return {
    bodies,
    time: 0,
    dt: preset.dt,
    G: 1,
    softening: 0.01,
  };
}
