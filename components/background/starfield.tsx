"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: [number, number, number];
}

const STAR_COLORS: [number, number, number][] = [
  [255, 255, 255],     // white
  [200, 180, 255],     // light purple
  [170, 130, 255],     // purple
  [220, 200, 255],     // pale lavender
];

export default function Starfield() {
  // region [Hooks]
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 2000);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.15 + 0.02,
        twinkleSpeed: Math.random() * 0.005 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.2
          ? STAR_COLORS[Math.floor(Math.random() * 3) + 1]
          : STAR_COLORS[0],
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.75 + twinkle * 0.25);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        const [r, g, b] = star.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
        ctx.fill();

        // Glow effect for larger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.15})`;
          ctx.fill();
        }

        // Slow upward drift
        star.y -= star.speed;
        if (star.y < -star.size) {
          star.y = canvas.height + star.size;
          star.x = Math.random() * canvas.width;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  // endregion

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Milky way gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(120,80,200,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(60,100,220,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_80%,rgba(100,50,180,0.08),transparent_50%)]" />
    </div>
  );
}
