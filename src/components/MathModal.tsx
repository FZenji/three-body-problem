'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import katex from 'katex';

interface MathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const equations = [
  {
    title: "Newton's Law of Universal Gravitation",
    description: 'The gravitational force between two masses is proportional to the product of their masses and inversely proportional to the square of the distance between them.',
    latex: '\\vec{F}_{ij} = -G \\frac{m_i m_j}{|\\vec{r}_j - \\vec{r}_i|^3} (\\vec{r}_j - \\vec{r}_i)',
  },
  {
    title: 'Equations of Motion',
    description: 'Each body accelerates due to the gravitational pull of all other bodies. For body i:',
    latex: '\\vec{a}_i = \\sum_{j \\neq i} G \\frac{m_j}{(|\\vec{r}_j - \\vec{r}_i|^2 + \\epsilon^2)^{3/2}} (\\vec{r}_j - \\vec{r}_i)',
  },
  {
    title: 'Softening Parameter (ε)',
    description: 'A small softening parameter ε prevents numerical singularities when bodies pass very close to each other, regularising the force calculation.',
    latex: 'r_{\\text{soft}} = \\sqrt{|\\vec{r}|^2 + \\epsilon^2}',
  },
  {
    title: 'Velocity-Verlet Integration',
    description: 'We use the Velocity-Verlet algorithm, a symplectic integrator that conserves energy better than simple Euler integration:',
    latex: '\\begin{aligned} \\vec{r}(t + \\Delta t) &= \\vec{r}(t) + \\vec{v}(t) \\Delta t + \\tfrac{1}{2} \\vec{a}(t) \\Delta t^2 \\\\ \\vec{v}(t + \\Delta t) &= \\vec{v}(t) + \\tfrac{1}{2} [\\vec{a}(t) + \\vec{a}(t + \\Delta t)] \\Delta t \\end{aligned}',
  },
  {
    title: 'Why Three Bodies?',
    description: 'Unlike the two-body problem, which has a closed-form analytical solution (Kepler orbits), the three-body problem is chaotic — no general analytical solution exists. Tiny perturbations in initial conditions lead to exponentially diverging trajectories, making long-term prediction impossible.',
    latex: '',
  },
];

function RenderedLatex({ latex }: { latex: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && latex) {
      try {
        katex.render(latex, ref.current, {
          displayMode: true,
          throwOnError: false,
          trust: true,
        });
      } catch {
        if (ref.current) ref.current.textContent = latex;
      }
    }
  }, [latex]);

  if (!latex) return null;

  return <div ref={ref} className="overflow-x-auto py-2" />;
}

export default function MathModal({ isOpen, onClose }: MathModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative glass-panel rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 pb-2 bg-[#0a0a1a]/80 backdrop-blur-xl rounded-t-2xl border-b border-white/5">
          <h2 className="text-lg font-semibold text-white/90">The Mathematics</h2>
          <button
            onClick={onClose}
            className="glass-button p-2 rounded-lg"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {equations.map((eq, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-sm font-semibold text-white/80">{eq.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{eq.description}</p>
              <RenderedLatex latex={eq.latex} />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <p className="text-[10px] text-white/25 text-center">
            Press <kbd className="kbd">?</kbd> or <kbd className="kbd">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
