'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-screen starfield behind the page.
 *
 * Performance notes — this runs on every page, so it is deliberately cheap:
 *  · Glows are pre-rendered once into sprite canvases and blitted with
 *    drawImage. `shadowBlur` per star would cost an order of magnitude more.
 *  · Device pixel ratio is capped at 1.75; retina phones gain nothing visible
 *    from 3x but pay 3x the fill rate.
 *  · The loop self-suspends when the tab is hidden, when the user asks for
 *    reduced motion, and when the page sets `data-motion="paused"`.
 */

type Star = {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  layer: 0 | 1 | 2;
  vx: number;
  vy: number;
  twinklePhase: number;
  twinkleAmp: number;
  twinkleSpeed: number;
  sprite: number;
  glow: boolean;
  repelX: number;
  repelY: number;
};

const STAR_COUNT_DESKTOP = 190;
const STAR_COUNT_MOBILE = 70;
const MAX_DPR = 1.75;

/** Far layers barely move; the near layer carries the parallax read. */
const PARALLAX_SCROLL: readonly [number, number, number] = [0.012, 0.028, 0.046];
const PARALLAX_MOUSE: readonly [number, number, number] = [6, 14, 26];
const MOUSE_EASE = 0.045;

/** Cursor repel, matching aisaige-web-v2's GlobalStarfield: a gentle magnetic
 *  nudge that decays back, not a scatter. */
const REPEL_RADIUS = 80;
const REPEL_STRENGTH = 0.22;
const REPEL_MAX = 12;
const REPEL_DECAY = 0.048;

/** The hero keeps its own grid backdrop, so stars only arrive past it. */
const STAR_FADE_START = 0.12;
const STAR_FADE_VIEWPORTS = 0.5;

/** Starlight, violet haze, cosmic violet, neon cyan. */
const PALETTE: readonly [number, number, number][] = [
  [249, 250, 251],
  [199, 210, 254],
  [139, 92, 246],
  [34, 211, 238],
];

function pickSprite(): number {
  const r = Math.random();
  if (r < 0.46) return 0;
  if (r < 0.74) return 1;
  if (r < 0.9) return 2;
  return 3;
}

/** One radial-gradient disc per palette colour, drawn once and reused. */
function buildSprites(): HTMLCanvasElement[] {
  return PALETTE.map(([r, g, b]) => {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g2d = c.getContext('2d');
    if (g2d) {
      const grad = g2d.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grad.addColorStop(0.18, `rgba(${r},${g},${b},0.65)`);
      grad.addColorStop(0.45, `rgba(${r},${g},${b},0.18)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      g2d.fillStyle = grad;
      g2d.fillRect(0, 0, size, size);
    }
    return c;
  });
}

function makeStar(w: number, h: number): Star {
  const roll = Math.random();
  const layer: 0 | 1 | 2 = roll < 0.55 ? 0 : roll < 0.85 ? 1 : 2;
  const cfg = [
    { sz: [0.3, 0.85], op: [0.1, 0.26], spd: 0.008 },
    { sz: [0.7, 1.5], op: [0.16, 0.42], spd: 0.018 },
    { sz: [1.2, 2.3], op: [0.26, 0.68], spd: 0.036 },
  ][layer] as { sz: [number, number]; op: [number, number]; spd: number };

  const angle = Math.random() * Math.PI * 2;
  const speed = cfg.spd * (0.6 + Math.random() * 0.8);
  const size = cfg.sz[0] + Math.random() * (cfg.sz[1] - cfg.sz[0]);
  const baseOpacity = cfg.op[0] + Math.random() * (cfg.op[1] - cfg.op[0]);

  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size,
    baseOpacity,
    layer,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleAmp: 0.05 + Math.random() * 0.12,
    twinkleSpeed: 0.004 + Math.random() * 0.012,
    sprite: pickSprite(),
    glow: size > 1.25 && baseOpacity > 0.3,
    repelX: 0,
    repelY: 0,
  };
}

export function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const sprites = buildSprites();
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let clock = 0;
    let lastFrame = 0;

    const scroll = { y: 0 };
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
    const mouse = { x: -9999, y: -9999 };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ── Sizing ──────────────────────────────────────────────────────────────
    const resize = () => {
      const prevW = width || window.innerWidth;
      const prevH = height || window.innerHeight;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = width < 768 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
      if (stars.length === 0) {
        stars = Array.from({ length: target }, () => makeStar(width, height));
      } else {
        // Keep the field evenly spread instead of bunching after a resize.
        for (const s of stars) {
          s.x = (s.x / prevW) * width;
          s.y = (s.y / prevH) * height;
        }
        if (stars.length < target) {
          stars.push(...Array.from({ length: target - stars.length }, () => makeStar(width, height)));
        } else if (stars.length > target) {
          stars.length = target;
        }
      }
    };

    const drawStars = (t: number, ox: number, oy: number, animate: boolean) => {
      // Hidden behind the hero, fading in as the page scrolls past it.
      const fade = Math.max(
        0,
        Math.min(1, (scroll.y - height * STAR_FADE_START) / (height * STAR_FADE_VIEWPORTS)),
      );
      if (fade <= 0.01) return;

      for (const s of stars) {
        if (animate) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -6) s.x = width + 6;
          else if (s.x > width + 6) s.x = -6;
          if (s.y < -6) s.y = height + 6;
          else if (s.y > height + 6) s.y = -6;
          s.twinklePhase += s.twinkleSpeed;
        }

        const opacity = animate
          ? Math.max(0.04, s.baseOpacity + Math.sin(s.twinklePhase) * s.twinkleAmp)
          : s.baseOpacity;

        const px = s.x + ox * (PARALLAX_MOUSE[s.layer] / PARALLAX_MOUSE[2]);
        const py = s.y + oy * (PARALLAX_MOUSE[s.layer] / PARALLAX_MOUSE[2]) + scroll.y * PARALLAX_SCROLL[s.layer];
        // Wrap vertically so scrolling never drains the top of the field.
        const wy = ((py % (height + 12)) + height + 12) % (height + 12) - 6;

        if (animate) {
          const dx = px + s.repelX - mouse.x;
          const dy = wy + s.repelY - mouse.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < REPEL_RADIUS * REPEL_RADIUS && dist2 > 0.25) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            s.repelX += (dx / dist) * force;
            s.repelY += (dy / dist) * force;
          }
          s.repelX = Math.max(-REPEL_MAX, Math.min(REPEL_MAX, s.repelX * (1 - REPEL_DECAY)));
          s.repelY = Math.max(-REPEL_MAX, Math.min(REPEL_MAX, s.repelY * (1 - REPEL_DECAY)));
        }

        const dx = px + s.repelX;
        const dy = wy + s.repelY;

        ctx.globalAlpha = opacity * fade;
        if (s.glow) {
          const r = s.size * 4.5;
          ctx.drawImage(sprites[s.sprite], dx - r, dy - r, r * 2, r * 2);
        } else {
          const [r, g, b] = PALETTE[s.sprite];
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.arc(dx, dy, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const render = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);
      if (animate) {
        pointer.x += (pointer.tx - pointer.x) * MOUSE_EASE;
        pointer.y += (pointer.ty - pointer.y) * MOUSE_EASE;
      }
      drawStars(clock, pointer.x, pointer.y, animate);
    };

    const tick = (t: number) => {
      if (!running) return;
      const paused = document.documentElement.dataset.motion === 'paused';
      // A clock that only advances while running, so pausing truly freezes the
      // scene instead of letting it jump forward on resume.
      if (lastFrame && !paused) clock += Math.min(t - lastFrame, 50);
      lastFrame = t;
      render(!paused);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // ── Listeners ───────────────────────────────────────────────────────────
    const onResize = () => {
      resize();
      if (reduceMotion.matches) render(false);
    };
    const onScroll = () => {
      scroll.y = window.scrollY;
    };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / width - 0.5) * -PARALLAX_MOUSE[2];
      pointer.ty = (e.clientY / height - 0.5) * -PARALLAX_MOUSE[2];
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduceMotion.matches) start();
    };
    const onMotionPref = () => {
      if (reduceMotion.matches) {
        stop();
        render(false);
      } else {
        start();
      }
    };

    resize();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    reduceMotion.addEventListener('change', onMotionPref);

    if (reduceMotion.matches) render(false);
    else start();

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', onMotionPref);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1] block h-screen w-screen"
    />
  );
}
