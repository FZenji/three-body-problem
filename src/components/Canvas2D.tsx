'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Body } from '@/lib/physics';

interface Canvas2DProps {
  bodies: Body[];
  showTrails: boolean;
  width?: number;
  height?: number;
}

export default function Canvas2D({ bodies, showTrails }: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;

    if (w === 0 || h === 0) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Fill background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    // Draw subtle stars
    ctx.save();
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 7919) % w);
      const sy = ((i * 6271) % h);
      const brightness = 0.2 + ((i * 3571) % 100) / 200;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (bodies.length === 0) return;

    // Compute auto-scale: fit all body positions + margin
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    bodies.forEach((b) => {
      const points = showTrails && b.trail.length > 0 ? [b.position, ...b.trail] : [b.position];
      points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });

    const margin = 1;
    minX -= margin;
    maxX += margin;
    minY -= margin;
    maxY += margin;

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scale = Math.min(w / rangeX, h / rangeY) * 0.85;
    const cx = w / 2;
    const cy = h / 2;
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const toScreen = (x: number, y: number): [number, number] => [
      cx + (x - midX) * scale,
      cy + (y - midY) * scale,
    ];

    // Draw trails
    if (showTrails) {
      bodies.forEach((body) => {
        const len = body.trail.length;
        if (len < 2) return;
        for (let i = 0; i < len - 1; i++) {
          const alpha = (i / len) * 0.6;
          const [x1, y1] = toScreen(body.trail[i].x, body.trail[i].y);
          const [x2, y2] = toScreen(body.trail[i + 1].x, body.trail[i + 1].y);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = body.color;
          ctx.lineWidth = 1.5 * dpr;
          ctx.globalAlpha = alpha;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });
    }

    // Draw bodies
    bodies.forEach((body) => {
      const [bx, by] = toScreen(body.position.x, body.position.y);
      const radius = body.size * dpr * 0.5;

      // Glow
      const glow = ctx.createRadialGradient(bx, by, 0, bx, by, radius * 4);
      glow.addColorStop(0, body.color + '60');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(bx - radius * 4, by - radius * 4, radius * 8, radius * 8);

      // Body circle
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(bx - radius * 0.3, by - radius * 0.3, 0, bx, by, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, body.color);
      grad.addColorStop(1, body.color + '80');
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }, [bodies, showTrails]);

  // Set up canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = container.clientWidth + 'px';
      canvas.style.height = container.clientHeight + 'px';
      // Immediately redraw after resize
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Initial sizing + draw
    resize();

    return () => resizeObserver.disconnect();
  }, [draw]);

  // Redraw whenever bodies or trails change
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
