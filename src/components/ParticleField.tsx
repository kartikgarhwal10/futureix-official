"use client";

import { useEffect, useRef } from "react";

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect user reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    const isMobile = window.innerWidth < 768;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulse: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Drastically reduce particle count on mobile (16 on mobile vs 40 on desktop)
    const count = isMobile
      ? Math.min(18, Math.floor(window.innerWidth / 24))
      : Math.min(45, Math.floor(window.innerWidth / 30));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
        vy: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
        size: Math.random() * (isMobile ? 1.5 : 2) + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const mouse = { x: -1000, y: -1000 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Only attach mousemove on desktop non-touch devices
    if (!isMobile) {
      window.addEventListener("mousemove", onMouse, { passive: true });
    }

    // Pause rendering when tab is hidden or element is out of view
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting && !document.hidden;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const animate = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const len = particles.length;
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.012;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          if (!isMobile) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 22500) { // 150^2
              p.vx -= dx * 0.00006;
              p.vy -= dy * 0.00006;
            }
          }

          const pulsedOpacity = p.opacity + Math.sin(p.pulse) * 0.12;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(13, 13, 10, ${pulsedOpacity * 0.45})`;
          ctx.fill();

          // Skip O(N^2) connection lines on mobile to preserve 60 FPS
          if (!isMobile) {
            for (let j = i + 1; j < len; j++) {
              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < 14400) { // 120^2
                const d = Math.sqrt(distSq);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(13, 13, 10, ${0.05 * (1 - d / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (!isMobile) window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
