"use client";

import { useEffect, useRef, useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};

const MAX_RIPPLES = 20;
const MIN_DISTANCE = 24;
const MIN_INTERVAL = 96;

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export function RippleBackground() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef(0);
  const nextIdRef = useRef(0);
  const timeoutIdsRef = useRef<number[]>([]);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseMove = (event: MouseEvent) => {
      if (reduceMotionRef.current) {
        return;
      }

      const now = performance.now();
      const nextPoint = { x: event.clientX, y: event.clientY };
      const lastPoint = lastPointRef.current;

      if (now - lastTimeRef.current < MIN_INTERVAL) {
        return;
      }

      if (
        lastPoint &&
        Math.hypot(nextPoint.x - lastPoint.x, nextPoint.y - lastPoint.y) < MIN_DISTANCE
      ) {
        return;
      }

      lastTimeRef.current = now;
      lastPointRef.current = nextPoint;

      const ripple: Ripple = {
        id: nextIdRef.current,
        x: nextPoint.x,
        y: nextPoint.y,
        size: randomBetween(120, 210),
        duration: randomBetween(1250, 1680),
      };

      nextIdRef.current += 1;

      setRipples((current) => [...current.slice(-(MAX_RIPPLES - 1)), ripple]);

      const timeoutId = window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== ripple.id));
        timeoutIdsRef.current = timeoutIdsRef.current.filter((item) => item !== timeoutId);
      }, ripple.duration + 80);

      timeoutIdsRef.current.push(timeoutId);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      for (const timeoutId of timeoutIdsRef.current) {
        window.clearTimeout(timeoutId);
      }
      timeoutIdsRef.current = [];
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="ripple-node animate-background-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: `${ripple.duration}ms`,
          }}
        >
          <div className="ripple-core" />
          <div className="ripple-highlight" />
        </div>
      ))}
    </div>
  );
}
