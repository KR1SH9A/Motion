"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { drawCover, sourceDimensions } from "@/lib/sequence";

import type { SequenceLoader } from "./SequenceLoader";

interface SequenceCanvasProps {
  loader: SequenceLoader;
  frameIndex: number;
  className?: string;
}

const MAX_DPR = 2;

export function SequenceCanvas({ loader, frameIndex, className }: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDrawnIndex = useRef<number>(-1);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  // Latest requested index — kept in a ref because rAF reads it asynchronously
  // and we never want the closure to capture a stale prop value.
  const requestedIndex = useRef<number>(frameIndex);

  // Track latest requested index without retriggering the mount effect.
  requestedIndex.current = frameIndex;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const scheduleDraw = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const idx = requestedIndex.current;
        const source = loader.get(idx) ?? loader.findNearestLoaded(idx);
        if (!source) return;
        const { w, h } = sizeRef.current;
        if (w === 0 || h === 0) return;
        const { width: sw, height: sh } = sourceDimensions(source);
        // Solid white before drawing so any letterboxed area inherits the
        // page background and never flashes a previous frame's edge.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        drawCover(ctx, source, w, h, sw, sh);
        lastDrawnIndex.current = idx;
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      sizeRef.current = { w, h };
      // Force a redraw on resize regardless of frameIndex equality.
      lastDrawnIndex.current = -1;
      scheduleDraw();
    };

    resize();

    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    // External hook so HeroSequence can poke the canvas after frames load
    // or after the scroll-driven frameIndex changes.
    canvas.dataset.scheduleDraw = "1";
    const node = canvas;
    const handleRedraw = () => {
      // If the requested frame is identical and we've already drawn it,
      // skip — but still schedule when loader streamed in a closer frame.
      if (
        requestedIndex.current === lastDrawnIndex.current &&
        loader.has(requestedIndex.current)
      ) {
        return;
      }
      scheduleDraw();
    };
    node.addEventListener("sequence:redraw", handleRedraw);

    return () => {
      observer.disconnect();
      node.removeEventListener("sequence:redraw", handleRedraw);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [loader]);

  // React to frameIndex changes by dispatching a redraw signal.
  useEffect(() => {
    canvasRef.current?.dispatchEvent(new Event("sequence:redraw"));
  }, [frameIndex]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Scroll-driven animation sequence"
      className={cn("block h-full w-full", className)}
    />
  );
}
