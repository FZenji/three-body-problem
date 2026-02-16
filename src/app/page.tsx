'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { useSound } from '@/hooks/useSound';
import { useKeyboard } from '@/hooks/useKeyboard';
import { kineticEnergy, potentialEnergy, minDistance } from '@/lib/physics';
import ControlPanel from '@/components/ControlPanel';
import MathModal from '@/components/MathModal';
import Canvas2D from '@/components/Canvas2D';

// Dynamic import for 3D scene (Three.js needs client-side only)
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
      Loading 3D scene…
    </div>
  ),
});

export default function Home() {
  const sim = useSimulation();
  const sound = useSound();
  const [mathOpen, setMathOpen] = useState(false);
  const lastPingRef = useRef(0);
  const [resetSignal, setResetSignal] = useState(0);

  // Keyboard shortcuts
  const keyboardActions = useMemo(
    () => ({
      togglePlay: () => (sim.isPlaying ? sim.pause() : sim.play()),
      reset: () => {
        sim.reset();
        setResetSignal((s) => s + 1);
      },
      speedUp: () => sim.updateSpeed(Math.min(sim.speedMultiplier + 0.5, 5)),
      speedDown: () => sim.updateSpeed(Math.max(sim.speedMultiplier - 0.5, 0.1)),
      toggleMute: () => sound.toggleMute(),
      openModal: () => setMathOpen((o) => !o),
      setDimension: (dim: '2D' | '3D') => sim.setDimension(dim),
    }),
    [sim, sound]
  );

  useKeyboard(keyboardActions);

  // Sound updates based on physics state
  useEffect(() => {
    if (sim.isPlaying && sim.bodies.length > 0) {
      const ke = kineticEnergy(sim.bodies);
      const pe = potentialEnergy(sim.bodies, 1, 0.01);
      sound.updateDrone(ke + pe);

      const dist = minDistance(sim.bodies);
      const now = Date.now();
      if (dist < 0.5 && now - lastPingRef.current > 300) {
        const closeness = Math.max(0, 1 - dist / 0.5);
        sound.playPing(closeness);
        lastPingRef.current = now;
      }
    }
  }, [sim.bodies, sim.isPlaying, sound]);

  // Pause/resume sound when simulation pauses/plays
  useEffect(() => {
    sound.setSoundPaused(!sim.isPlaying);
  }, [sim.isPlaying, sound]);

  // Close math modal with Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mathOpen) setMathOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mathOpen]);

  // Init sound on first user interaction
  const handleInteraction = useCallback(() => {
    sound.init();
  }, [sound]);

  const handleReset = useCallback(() => {
    sim.reset();
    setResetSignal((s) => s + 1);
  }, [sim]);

  return (
    <main
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]"
      onClick={handleInteraction}
    >
      {/* Renderer */}
      {sim.dimension === '2D' ? (
        <Canvas2D bodies={sim.bodies} showTrails={sim.showTrails} />
      ) : (
        <Scene3D bodies={sim.bodies} showTrails={sim.showTrails} resetSignal={resetSignal} />
      )}

      {/* Control Panel */}
      <ControlPanel
        isPlaying={sim.isPlaying}
        speedMultiplier={sim.speedMultiplier}
        trailLength={sim.trailLength}
        showTrails={sim.showTrails}
        currentPreset={sim.currentPreset}
        dimension={sim.dimension}
        bodies={sim.bodies}
        onPlay={sim.play}
        onPause={sim.pause}
        onReset={handleReset}
        onSpeedChange={sim.updateSpeed}
        onTrailLengthChange={sim.updateTrailLength}
        onShowTrailsChange={sim.updateShowTrails}
        onPresetChange={sim.selectPreset}
        onDimensionChange={sim.setDimension}
        onBodyUpdate={sim.updateBody}
      />

      {/* Top-right buttons */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Sound toggle */}
        <button
          onClick={sound.toggleMute}
          className="glass-button p-2.5 rounded-xl"
          aria-label={sound.isMuted ? 'Unmute' : 'Mute'}
        >
          {sound.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Math modal trigger */}
        <button
          onClick={() => setMathOpen(true)}
          className="glass-button p-2.5 rounded-xl"
          aria-label="Show mathematics"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Math Modal */}
      <MathModal isOpen={mathOpen} onClose={() => setMathOpen(false)} />

      {/* Footer credit */}
      <div className="fixed bottom-3 right-4 z-30 text-[10px] text-white/15 tracking-wider select-none">
        Developed by Henry Tolenaar
      </div>
    </main>
  );
}
