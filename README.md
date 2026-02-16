# Three-Body Problem Simulator

An interactive, real-time simulation of the gravitational three-body problem — one of the most fascinating unsolved problems in classical mechanics. Built with Next.js 15, Three.js, and the Web Audio API.

## ✨ Features

- **Dual Renderers** — Switch seamlessly between a 2D canvas view and a fully interactive 3D scene with orbit controls
- **Real-Time Physics** — Velocity-Verlet integration for accurate, energy-conserving orbital mechanics
- **Preset Orbits** — Explore famous stable configurations: Figure-Eight (Chenciner & Montgomery), Lagrange Triangle, Broucke A-2, Butterfly, and a chaotic default
- **Full Customisation** — Adjust body mass, size, colour, playback speed, trail length, and trail effects in real time
- **Sound Design** — Ambient drone that shifts with system energy, proximity pings when bodies approach each other
- **Mathematics Modal** — KaTeX-rendered equations explaining Newton's law, the Velocity-Verlet algorithm, and why the three-body problem is chaotic
- **Keyboard Shortcuts** — Space (play/pause), R (reset), ↑/↓ (speed), M (mute), ? (math modal), 2/3 (dimension toggle)
- **Responsive Design** — Fully optimised for desktop, tablet, and mobile with collapsible controls
- **SEO Optimised** — Open Graph, Twitter Cards, Schema.org JSON-LD (WebApplication + EducationalResource)

## 🧮 The Physics

The simulation uses **Velocity-Verlet integration**, a symplectic integrator that conserves energy better than simple Euler methods. A **softening parameter** prevents numerical singularities during close encounters. The gravitational constant and timestep are tuned per-preset to balance accuracy with visual appeal.

### Why is it chaotic?

Unlike the two-body problem (which yields clean Kepler orbits), the three-body problem has no general closed-form solution. Tiny differences in initial conditions lead to exponentially diverging trajectories — a hallmark of deterministic chaos.

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | React framework, App Router |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Declarative Three.js for 3D rendering |
| [Drei](https://github.com/pmndrs/drei) | R3F helpers (OrbitControls, Stars, Line) |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [KaTeX](https://katex.org) | LaTeX math rendering |
| [Lucide React](https://lucide.dev) | Icon library |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Sound design |

## 🎨 Favicon Prompt

> A minimal, dark favicon depicting three glowing celestial bodies in orbital motion against a deep space background. The bodies are coloured coral-red, teal, and golden-yellow with subtle glow effects. Trails of light trace their curved paths. The style is clean, geometric, and modern — suitable for a 32×32 or 512×512 icon. Dark background (#0a0a0f).

## 👤 Credits

Developed by **Henry Tolenaar**.
