"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLanguage } from "@/components/language-provider";

const githubLink = "https://github.com/Aprivity";
const projectsLink = "/projects";
const revealLifetime = 3000;
const maxRevealPoints = 120;
const minRevealDistance = 10;
const maxRevealSegmentGap = 240;
const revealCoreRadius = 46;
const revealFeatherRadius = 84;
const revealOuterRadius = 118;

type RevealPoint = {
  x: number;
  y: number;
  createdAt: number;
};

export function HeroSection() {
  const { messages } = useLanguage();
  const hero = messages.hero;
  const revealCardRef = useRef<HTMLDivElement>(null);
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  const revealCursorRef = useRef<HTMLDivElement>(null);
  const revealPointsRef = useRef<RevealPoint[]>([]);
  const lastRevealPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasRevealTrailRef = useRef(false);
  const [isRevealActive, setIsRevealActive] = useState(false);
  const [hasRevealTrail, setHasRevealTrail] = useState(false);

  const syncRevealTrailState = (nextValue: boolean) => {
    if (hasRevealTrailRef.current === nextValue) {
      return;
    }

    hasRevealTrailRef.current = nextValue;
    setHasRevealTrail(nextValue);
  };

  const resizeRevealCanvas = () => {
    const canvas = revealCanvasRef.current;
    const card = revealCardRef.current;

    if (!canvas || !card) {
      return null;
    }

    const rect = card.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const scaledWidth = Math.round(width * pixelRatio);
    const scaledHeight = Math.round(height * pixelRatio);

    if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    return { canvas, width, height, pixelRatio };
  };

  const paintRevealOverlay = () => {
    const canvasState = resizeRevealCanvas();

    if (!canvasState) {
      animationFrameRef.current = null;
      return;
    }

    const { canvas, width, height, pixelRatio } = canvasState;
    const context = canvas.getContext("2d");

    if (!context) {
      animationFrameRef.current = null;
      return;
    }

    const now = performance.now();
    const isLightTheme = document.documentElement.dataset.theme === "light";
    const activePoints = revealPointsRef.current.filter(
      (point) => now - point.createdAt < revealLifetime,
    );

    revealPointsRef.current = activePoints;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const baseGradient = context.createLinearGradient(0, 0, width, height);

    if (isLightTheme) {
      baseGradient.addColorStop(0, "#f9fbff");
      baseGradient.addColorStop(0.46, "#edf4ff");
      baseGradient.addColorStop(1, "#f2eeff");
    } else {
      baseGradient.addColorStop(0, "#030716");
      baseGradient.addColorStop(0.5, "#07122a");
      baseGradient.addColorStop(1, "#130b2a");
    }

    context.fillStyle = baseGradient;
    context.fillRect(0, 0, width, height);

    const blueGlow = context.createRadialGradient(width * 0.25, height * 0.18, 0, width * 0.25, height * 0.18, width * 0.68);
    blueGlow.addColorStop(0, isLightTheme ? "rgba(96,165,250,0.14)" : "rgba(37,99,235,0.16)");
    blueGlow.addColorStop(0.42, isLightTheme ? "rgba(125,211,252,0.05)" : "rgba(14,165,233,0.07)");
    blueGlow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = blueGlow;
    context.fillRect(0, 0, width, height);

    const violetGlow = context.createRadialGradient(width * 0.86, height * 0.82, 0, width * 0.86, height * 0.82, width * 0.72);
    violetGlow.addColorStop(0, isLightTheme ? "rgba(167,139,250,0.1)" : "rgba(147,51,234,0.14)");
    violetGlow.addColorStop(0.48, isLightTheme ? "rgba(196,181,253,0.04)" : "rgba(99,102,241,0.06)");
    violetGlow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = violetGlow;
    context.fillRect(0, 0, width, height);

    if (activePoints.length > 0) {
      const latestPoint = activePoints[activePoints.length - 1];
      const drawRevealStroke = (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        widthValue: number,
        alpha: number,
      ) => {
        if (alpha <= 0 || widthValue <= 0) {
          return;
        }

        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = widthValue;
        context.strokeStyle = `rgba(0,0,0,${alpha})`;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
      };

      context.save();
      context.globalCompositeOperation = "destination-out";

      for (let index = 1; index < activePoints.length; index += 1) {
        const previousPoint = activePoints[index - 1];
        const point = activePoints[index];
        const segmentAge = now - point.createdAt;
        const timeGap = point.createdAt - previousPoint.createdAt;

        if (timeGap > maxRevealSegmentGap) {
          continue;
        }

        const deltaX = point.x - previousPoint.x;
        const deltaY = point.y - previousPoint.y;
        const segmentLength = Math.hypot(deltaX, deltaY);

        if (segmentLength < 1) {
          continue;
        }

        const progress = Math.min(segmentAge / revealLifetime, 1);
        const fade = progress < 0.72 ? 1 : Math.max(0, 1 - (progress - 0.72) / 0.28);
        const directionX = deltaX / segmentLength;
        const directionY = deltaY / segmentLength;
        const forwardExtension = Math.min(88, Math.max(30, segmentLength * 1.7));
        const backwardExtension = Math.min(26, Math.max(10, segmentLength * 0.5));
        const startX = previousPoint.x - directionX * backwardExtension;
        const startY = previousPoint.y - directionY * backwardExtension;
        const endX = point.x + directionX * forwardExtension;
        const endY = point.y + directionY * forwardExtension;

        drawRevealStroke(startX, startY, endX, endY, 162 + progress * 12, 0.12 * fade);
        drawRevealStroke(startX, startY, endX, endY, 124 + progress * 10, 0.24 * fade);
        drawRevealStroke(startX, startY, endX, endY, revealCoreRadius * 2 + progress * 6, 0.82 * fade);
      }

      for (const point of activePoints) {
        const age = now - point.createdAt;
        const progress = Math.min(age / revealLifetime, 1);
        const fade = progress < 0.72 ? 1 : Math.max(0, 1 - (progress - 0.72) / 0.28);
        const isLatestPoint = point === latestPoint;
        const clearRadius = revealCoreRadius + progress * 4;
        const featherRadius = revealFeatherRadius + progress * 10;
        const radius = revealOuterRadius + progress * 16;
        const eraseGradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        const clearStop = clearRadius / radius;
        const featherStop = featherRadius / radius;
        const coreAlpha = (isLatestPoint ? 1 : 0.94) * fade;

        eraseGradient.addColorStop(0, `rgba(0,0,0,${coreAlpha})`);
        eraseGradient.addColorStop(clearStop, `rgba(0,0,0,${coreAlpha})`);
        eraseGradient.addColorStop(featherStop, `rgba(0,0,0,${0.18 * fade})`);
        eraseGradient.addColorStop(1, "rgba(0,0,0,0)");

        context.fillStyle = eraseGradient;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();

      if (latestPoint) {
        const age = now - latestPoint.createdAt;
        const progress = Math.min(age / revealLifetime, 1);
        const fade = progress < 0.72 ? 1 : Math.max(0, 1 - (progress - 0.72) / 0.28);

        context.save();
        context.globalCompositeOperation = "source-over";

        const glowRadius = 132 + progress * 16;
        const glowGradient = context.createRadialGradient(
          latestPoint.x,
          latestPoint.y,
          0,
          latestPoint.x,
          latestPoint.y,
          glowRadius,
        );
        const glowInnerStop = (revealCoreRadius + 2 + progress * 4) / glowRadius;
        const glowEdgeStop = (revealFeatherRadius - 4 + progress * 8) / glowRadius;

        glowGradient.addColorStop(0, "rgba(0,0,0,0)");
        glowGradient.addColorStop(Math.max(0, glowInnerStop - 0.08), "rgba(0,0,0,0)");
        glowGradient.addColorStop(glowInnerStop, `rgba(125,211,252,${0.018 * fade})`);
        glowGradient.addColorStop(glowEdgeStop, `rgba(96,165,250,${0.028 * fade})`);
        glowGradient.addColorStop(Math.min(1, glowEdgeStop + 0.14), `rgba(168,85,247,${0.012 * fade})`);
        glowGradient.addColorStop(1, "rgba(0,0,0,0)");

        context.fillStyle = glowGradient;
        context.beginPath();
        context.arc(latestPoint.x, latestPoint.y, glowRadius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      syncRevealTrailState(true);
    } else {
      syncRevealTrailState(false);
    }

    if (activePoints.length > 0) {
      animationFrameRef.current = requestAnimationFrame(paintRevealOverlay);
    } else {
      animationFrameRef.current = null;
    }
  };

  const startRevealAnimation = () => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(paintRevealOverlay);
    }
  };

  useEffect(() => {
    paintRevealOverlay();

    const card = revealCardRef.current;

    if (!card || typeof ResizeObserver === "undefined") {
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      paintRevealOverlay();
    });

    resizeObserver.observe(card);

    return () => {
      resizeObserver.disconnect();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const addRevealPoint = (x: number, y: number) => {
    const now = performance.now();
    const lastPoint = lastRevealPointRef.current;
    const shouldAddPoint =
      !lastPoint ||
      Math.hypot(x - lastPoint.x, y - lastPoint.y) > minRevealDistance ||
      now - lastPoint.time > 80;

    if (!shouldAddPoint) {
      return;
    }

    lastRevealPointRef.current = { x, y, time: now };
    revealPointsRef.current = [
      ...revealPointsRef.current.slice(-(maxRevealPoints - 1)),
      { x, y, createdAt: now },
    ];
    syncRevealTrailState(true);
    startRevealAnimation();
  };

  const updateRevealInteraction = (event: MouseEvent<HTMLDivElement>) => {
    const card = revealCardRef.current;

    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (revealCursorRef.current) {
      revealCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    addRevealPoint(x, y);
  };

  return (
    <section
      id="home"
      className="hero-section relative flex min-h-[calc(100vh-96px)] items-center py-16 md:py-20"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-8%] top-[10%] h-72 w-72 rounded-full bg-sky-500/16 blur-[120px]" />
        <div className="section-ambient-violet absolute right-[-10%] top-[2%] h-80 w-80 rounded-full bg-violet-500/14 blur-[140px]" />
        <div className="section-ambient-cyan absolute bottom-[4%] left-[30%] h-64 w-64 rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="section-ambient-wash absolute inset-0 bg-[linear-gradient(120deg,rgba(8,15,34,0.2)_0%,rgba(29,78,216,0.06)_36%,rgba(147,51,234,0.08)_68%,rgba(10,14,28,0.08)_100%)]" />
        <div className="section-ambient-grid absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
      </div>

      <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hero-copy relative animate-fade-up">
          <div className="section-badge hero-badge mb-6 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.12)] backdrop-blur">
            {hero.badge}
          </div>

          <h1 className="hero-title max-w-3xl font-[family-name:var(--font-space-grotesk)] text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-[5.25rem]">
            {hero.titlePrefix}{" "}
            <span className="text-glow relative inline-block bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Aprivity_
            </span>
          </h1>

          <p className="hero-description mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {hero.intro}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={projectsLink}
              className="primary-cta hover-smooth group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-7 py-3.5 font-medium text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:-translate-y-1 hover:scale-[1.025] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400 hover:shadow-[0_0_70px_rgba(96,165,250,0.45)]"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_15%,rgba(255,255,255,0.24)_50%,transparent_85%)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
              <span className="relative">{hero.projectsButton}</span>
              <span className="hover-smooth relative ml-2 group-hover:translate-x-1">
                -&gt;
              </span>
            </a>

            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-cta hover-smooth group inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
            >
              <span className="hover-smooth bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent group-hover:from-sky-200 group-hover:to-violet-200">
                {hero.blogButton}
              </span>
            </a>
          </div>

          <div className="mt-14 flex items-center gap-8 text-sm text-slate-400">
            {hero.metrics.map((metric, index) => (
              <div className="contents" key={metric.label}>
                {index > 0 ? <div className="hero-metric-divider h-10 w-px bg-white/10" /> : null}
                <div className="hero-metric">
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p>{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-fade-up-delayed">
          <div className="pointer-events-none absolute inset-0">
            <div className="energy-ring absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/20" />
            <div className="energy-ring-delayed absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/20" />
            <div className="floating-orb absolute -left-6 top-14 h-24 w-24 rounded-full border border-sky-400/20 bg-sky-400/10 blur-sm" />
            <div className="floating-orb-delayed absolute -right-4 top-10 h-32 w-32 rounded-full bg-violet-500/18 blur-2xl" />
            <div className="floating-orb absolute bottom-14 right-8 h-14 w-14 rounded-full border border-cyan-300/25 bg-cyan-300/10" />
            <div className="absolute bottom-12 left-0 h-px w-28 bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-80" />
            <div className="absolute right-0 top-20 h-28 w-px bg-gradient-to-b from-transparent via-violet-300 to-transparent opacity-80" />
            <div className="floating-orb-delayed absolute left-6 top-28 h-0 w-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-sky-300/70 opacity-70" />
            <div className="floating-orb absolute bottom-20 right-16 h-16 w-16 rounded-full border border-white/8">
              <div className="absolute inset-2 rounded-full border border-white/8" />
              <div className="absolute inset-4 rounded-full border border-sky-300/15" />
            </div>
          </div>

          <div
            ref={revealCardRef}
            onMouseEnter={(event) => {
              setIsRevealActive(true);
              updateRevealInteraction(event);
            }}
            onMouseMove={updateRevealInteraction}
            onMouseLeave={() => {
              setIsRevealActive(false);
              lastRevealPointRef.current = null;
            }}
            className={`hero-visual hero-card reveal-card hover-smooth group glow-border card-glow relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.06] p-3 shadow-[0_30px_100px_rgba(2,6,23,0.72)] backdrop-blur-xl hover:-translate-y-1.5 hover:scale-[1.012] hover:border-sky-300/18 hover:shadow-[0_46px_130px_rgba(37,99,235,0.24)] ${isRevealActive ? "is-revealing" : ""} ${hasRevealTrail ? "has-reveal-trail" : ""}`}
          >
            <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(125,211,252,0.18),transparent_30%),radial-gradient(circle_at_80%_90%,rgba(167,139,250,0.18),transparent_32%)] opacity-80 group-hover:opacity-100" />
            <div className="card-aura absolute inset-[-18px] -z-10 rounded-[3.25rem]" />

            <div className="hero-card-shell relative flex min-h-[540px] items-center justify-center overflow-hidden rounded-[2.2rem] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_34%),linear-gradient(180deg,rgba(10,18,36,0.96),rgba(5,8,22,1))] px-8 py-10">
              <div className="absolute left-6 top-6 flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400/80 shadow-[0_0_12px_rgba(56,189,248,0.85)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400/70 shadow-[0_0_12px_rgba(167,139,250,0.65)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
              </div>

              <div className="absolute inset-x-10 top-14 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute inset-y-16 left-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="absolute inset-y-16 right-8 w-px bg-gradient-to-b from-transparent via-sky-300/10 to-transparent" />
              <div className="absolute left-16 top-24 h-14 w-14 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur-sm" />
              <div className="absolute bottom-20 left-12 h-px w-20 bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
              <div className="absolute right-14 top-32 h-16 w-16 rounded-full border border-sky-300/10" />

              <div className="hero-avatar-shell hover-smooth relative flex h-[372px] w-[292px] items-center justify-center overflow-hidden rounded-[999px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.84),rgba(30,41,59,0.6))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_45px_rgba(59,130,246,0.18)] group-hover:border-sky-300/16 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_72px_rgba(96,165,250,0.3)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(125,211,252,0.22),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.24),transparent_32%)]" />
                <div className="hover-smooth absolute inset-3 rounded-[999px] border border-sky-300/10 group-hover:border-sky-300/20" />
                <div className="hover-smooth absolute inset-6 rounded-[999px] border border-violet-300/10 group-hover:border-violet-300/20" />

                <div className="relative flex h-[78%] w-[78%] flex-col items-center justify-center rounded-[999px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.98),rgba(19,27,46,0.95))] px-5 text-center shadow-[inset_0_0_24px_rgba(96,165,250,0.08)]">
                  <div className="relative mb-5 h-32 w-32 overflow-hidden rounded-full border border-sky-300/25 shadow-[0_0_30px_rgba(96,165,250,0.18)] ring-1 ring-white/10">
                    <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.22))]" />
                    <Image
                      src="/avatar.jpg"
                      alt={hero.avatarAlt}
                      fill
                      sizes="128px"
                      className="object-cover object-center"
                      priority
                    />
                  </div>

                  <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-white">
                    Aprivity_
                  </p>
                  <p className="mt-2 text-sm tracking-[0.25em] text-slate-400">
                    {hero.role}
                  </p>
                </div>
              </div>

              <div className="hero-status-card hover-smooth absolute bottom-10 right-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.35)] group-hover:border-sky-300/20 group-hover:bg-white/[0.07] group-hover:shadow-[0_16px_36px_rgba(37,99,235,0.16)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {hero.statusLabel}
                </p>
                <p className="mt-1 text-sky-300">{hero.statusValue}</p>
              </div>
            </div>

            <canvas
              ref={revealCanvasRef}
              className="reveal-canvas pointer-events-none absolute inset-0 z-30 rounded-[2.75rem]"
              aria-hidden="true"
            />
            <div className="reveal-hint pointer-events-none absolute inset-0 z-40 flex items-center justify-center rounded-[2.75rem] px-8 text-center">
              <div className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-xs font-medium uppercase tracking-[0.32em] text-sky-100/90 shadow-[0_0_28px_rgba(96,165,250,0.18)] backdrop-blur-md">
                {hero.revealHint}
              </div>
            </div>
            <div ref={revealCursorRef} className="reveal-cursor pointer-events-none absolute left-0 top-0 z-50" />
          </div>
        </div>
      </div>
    </section>
  );
}
