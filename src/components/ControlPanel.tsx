'use client';

import { useCallback, useState } from 'react';
import {
  Play, Pause, RotateCcw, ChevronDown, ChevronUp,
  Settings, X, Eye, EyeOff
} from 'lucide-react';
import { PRESETS, CUSTOM_PRESET_NAME } from '@/lib/presets';
import { Body, Vec3 } from '@/lib/physics';

interface ControlPanelProps {
  isPlaying: boolean;
  speedMultiplier: number;
  trailLength: number;
  showTrails: boolean;
  currentPreset: string;
  dimension: '2D' | '3D';
  bodies: Body[];
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onTrailLengthChange: (length: number) => void;
  onShowTrailsChange: (show: boolean) => void;
  onPresetChange: (name: string) => void;
  onDimensionChange: (dim: '2D' | '3D') => void;
  onBodyUpdate: (index: number, updates: Partial<Pick<Body, 'color' | 'size' | 'mass' | 'position' | 'velocity'>>) => void;
}

function Vec3Input({
  label,
  value,
  onChange,
  min = -10,
  max = 10,
  step = 0.1,
}: {
  label: string;
  value: Vec3;
  onChange: (v: Vec3) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="text-[9px] text-white/30 block mb-1">{label}</label>
      <div className="grid grid-cols-3 gap-1">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <div key={axis} className="relative">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] text-white/25 uppercase">
              {axis}
            </span>
            <input
              type="number"
              value={Number(value[axis].toFixed(2))}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v >= min && v <= max) {
                  onChange({ ...value, [axis]: v });
                }
              }}
              min={min}
              max={max}
              step={step}
              className="w-full bg-white/5 border border-white/10 rounded px-1 pl-5 py-1 text-[10px] text-white/80 outline-none focus:border-white/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ControlPanel({
  isPlaying,
  speedMultiplier,
  trailLength,
  showTrails,
  currentPreset,
  dimension,
  bodies,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onTrailLengthChange,
  onShowTrailsChange,
  onPresetChange,
  onDimensionChange,
  onBodyUpdate,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBodies, setShowBodies] = useState(false);
  const isCustom = currentPreset === CUSTOM_PRESET_NAME;

  const togglePanel = useCallback(() => setIsOpen((o) => !o), []);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={togglePanel}
        className="md:hidden fixed top-4 left-4 z-50 glass-panel p-2.5 rounded-xl hover:bg-white/15 transition-colors"
        aria-label="Toggle controls"
      >
        {isOpen ? <X size={20} /> : <Settings size={20} />}
      </button>

      {/* Panel */}
      <div
        className={`
          fixed top-4 left-4 z-40 glass-panel rounded-2xl overflow-hidden transition-all duration-300
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'}
          w-[min(320px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)]
        `}
      >
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-2rem)] scrollbar-thin">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-white/80">
              Controls
            </h2>
            <button
              onClick={togglePanel}
              className="md:hidden text-white/50 hover:text-white/80"
            >
              <X size={16} />
            </button>
          </div>

          {/* Dimension Toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['2D', '3D'] as const).map((dim) => (
              <button
                key={dim}
                onClick={() => onDimensionChange(dim)}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                  dimension === dim
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="glass-button p-2.5 rounded-xl flex-shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={() => onReset()}
              className="glass-button p-2.5 rounded-xl flex-shrink-0"
              aria-label="Reset"
            >
              <RotateCcw size={18} />
            </button>
            <div className="flex-1 ml-2">
              <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                Speed ×{speedMultiplier.toFixed(1)}
              </label>
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={speedMultiplier}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="slider w-full"
              />
            </div>
          </div>

          {/* Preset Selection */}
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1.5">
              Preset
            </label>
            <select
              value={currentPreset}
              onChange={(e) => onPresetChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 outline-none focus:border-white/30 transition-colors"
            >
              {PRESETS.map((p) => (
                <option key={p.name} value={p.name} className="bg-[#1a1a2e]">
                  {p.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-white/30 mt-1">
              {PRESETS.find((p) => p.name === currentPreset)?.description}
            </p>
          </div>

          {/* Trail Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40 uppercase tracking-wider">
                Trails
              </label>
              <button
                onClick={() => onShowTrailsChange(!showTrails)}
                className="text-white/50 hover:text-white/80 transition-colors"
                aria-label={showTrails ? 'Hide trails' : 'Show trails'}
              >
                {showTrails ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            {showTrails && (
              <div>
                <label className="text-[10px] text-white/30 block mb-1">
                  Length: {trailLength}
                </label>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={trailLength}
                  onChange={(e) => onTrailLengthChange(parseInt(e.target.value))}
                  className="slider w-full"
                />
              </div>
            )}
          </div>

          {/* Body Editors */}
          <div>
            <button
              onClick={() => setShowBodies(!showBodies)}
              className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors w-full"
            >
              Body Settings
              {showBodies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showBodies && (
              <div className="mt-2 space-y-3">
                {bodies.map((body, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: body.color }}
                      />
                      <span className="text-xs text-white/70">Body {i + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-white/30 block">Color</label>
                        <input
                          type="color"
                          value={body.color}
                          onChange={(e) => onBodyUpdate(i, { color: e.target.value })}
                          className="w-full h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/30 block">Size</label>
                        <input
                          type="range"
                          min={2}
                          max={20}
                          step={1}
                          value={body.size}
                          onChange={(e) => onBodyUpdate(i, { size: parseInt(e.target.value) })}
                          className="slider w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-white/30 block">Mass: {body.mass.toFixed(1)}</label>
                      <input
                        type="range"
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={body.mass}
                        onChange={(e) => onBodyUpdate(i, { mass: parseFloat(e.target.value) })}
                        className="slider w-full"
                      />
                    </div>

                    {/* Position & Velocity inputs for Custom preset */}
                    {isCustom && (
                      <>
                        <Vec3Input
                          label="Position"
                          value={body.position}
                          onChange={(v) => onBodyUpdate(i, { position: v })}
                          min={-10}
                          max={10}
                          step={0.1}
                        />
                        <Vec3Input
                          label="Velocity"
                          value={body.velocity}
                          onChange={(v) => onBodyUpdate(i, { velocity: v })}
                          min={-5}
                          max={5}
                          step={0.05}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="border-t border-white/5 pt-3">
            <p className="text-[9px] text-white/25 uppercase tracking-wider mb-2">Shortcuts</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-white/35">
              <span><kbd className="kbd">Space</kbd> Play/Pause</span>
              <span><kbd className="kbd">R</kbd> Reset</span>
              <span><kbd className="kbd">↑↓</kbd> Speed</span>
              <span><kbd className="kbd">M</kbd> Mute</span>
              <span><kbd className="kbd">?</kbd> Math</span>
              <span><kbd className="kbd">2</kbd><kbd className="kbd">3</kbd> Dimension</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={togglePanel}
        />
      )}
    </>
  );
}
