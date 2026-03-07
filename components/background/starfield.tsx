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

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  size: number;
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
    let comets: Comet[] = [];
    let nextCometTime = Math.random() * 6000 + 4000;

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

    const spawnComet = () => {
      const angle = (Math.random() * 20 + 25) * (Math.PI / 180); // 25~45도
      const speed = Math.random() * 8 + 10;
      comets.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 120 + 80,
        opacity: Math.random() * 0.5 + 0.5,
        size: Math.random() * 1.5 + 0.5,
      });
    };

    const drawComets = () => {
      comets = comets.filter((comet) => {
        const tailX = comet.x - (comet.vx / Math.hypot(comet.vx, comet.vy)) * comet.length;
        const tailY = comet.y - (comet.vy / Math.hypot(comet.vx, comet.vy)) * comet.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, comet.x, comet.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.7, `rgba(200, 180, 255, ${comet.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${comet.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(comet.x, comet.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = comet.size;
        ctx.lineCap = "round";
        ctx.stroke();

        // 머리 글로우
        const glowGradient = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, comet.size * 4);
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${comet.opacity * 0.8})`);
        glowGradient.addColorStop(1, `rgba(200, 180, 255, 0)`);
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        comet.x += comet.vx;
        comet.y += comet.vy;

        return comet.x < canvas.width + comet.length && comet.y < canvas.height + comet.length;
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 혜성 스폰: 4~10초 간격
      if (time > nextCometTime) {
        spawnComet();
        nextCometTime = time + Math.random() * 6000 + 4000;
      }
      drawComets();

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

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(draw);
      }
    };

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
