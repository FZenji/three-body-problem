'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useSound() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pingGainRef = useRef<GainNode | null>(null);
  const isMutedRef = useRef(true);
  const volumeRef = useRef(0.3);
  const initRef = useRef(false);

  const init = useCallback(() => {
    if (initRef.current) return;
    initRef.current = true;

    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Master gain
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      gainRef.current = master;

      // Drone oscillator — low ambient hum
      const drone = ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = 60;
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.15;
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();
      droneRef.current = drone;

      // Ping gain node for proximity sounds
      const pg = ctx.createGain();
      pg.gain.value = 0;
      pg.connect(master);
      pingGainRef.current = pg;
    } catch {
      // Web Audio not available
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!initRef.current) init();
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (gainRef.current) {
        gainRef.current.gain.setTargetAtTime(
          next ? 0 : volumeRef.current,
          audioCtxRef.current!.currentTime,
          0.1
        );
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return next;
    });
  }, [init]);

  const updateVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolume(v);
    if (gainRef.current && !isMutedRef.current) {
      gainRef.current.gain.setTargetAtTime(v, audioCtxRef.current!.currentTime, 0.1);
    }
  }, []);

  /**
   * Update drone frequency based on system energy.
   */
  const updateDrone = useCallback((energy: number) => {
    if (!droneRef.current || isMutedRef.current) return;
    // Map energy to frequency range 40–200 Hz
    const freq = 40 + Math.min(Math.abs(energy) * 20, 160);
    droneRef.current.frequency.setTargetAtTime(
      freq,
      audioCtxRef.current!.currentTime,
      0.3
    );
  }, []);

  /**
   * Play a proximity ping when bodies get close.
   */
  const playPing = useCallback((closeness: number) => {
    if (!audioCtxRef.current || isMutedRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    // Higher pitch when closer
    osc.frequency.value = 200 + closeness * 800;
    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.05 * volumeRef.current, ctx.currentTime);
    envGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(envGain);
    envGain.connect(gainRef.current!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return {
    isMuted,
    volume,
    toggleMute,
    updateVolume,
    updateDrone,
    playPing,
    init,
  };
}
