/**
 * Frame sequence math. Pure functions, no DOM, no allocations on hot paths.
 */

export const TOTAL_FRAMES = 162;
export const FIRST_FRAME_INDEX = 0;
export const LAST_FRAME_INDEX = TOTAL_FRAMES - 1;

export function frameUrl(index: number): string {
  const clamped = Math.min(LAST_FRAME_INDEX, Math.max(0, index));
  const padded = String(clamped + 1).padStart(4, "0");
  return `/frames/frame_${padded}.webp`;
}

export function frameIndexFromProgress(progress: number): number {
  if (!Number.isFinite(progress)) return 0;
  if (progress <= 0) return 0;
  if (progress >= 1) return LAST_FRAME_INDEX;
  // floor instead of round: matches the visual position the user is already past.
  return Math.min(LAST_FRAME_INDEX, Math.floor(progress * TOTAL_FRAMES));
}

/**
 * Draw `source` into the 2D context using object-fit:cover semantics.
 * Caller passes canvas backing-store size (already DPR-scaled).
 * No per-call allocations; safe to invoke 60 times per second.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  canvasW: number,
  canvasH: number,
  sourceW: number,
  sourceH: number,
): void {
  if (canvasW === 0 || canvasH === 0 || sourceW === 0 || sourceH === 0) return;

  const canvasRatio = canvasW / canvasH;
  const sourceRatio = sourceW / sourceH;

  let drawW: number;
  let drawH: number;

  if (sourceRatio > canvasRatio) {
    // Source is wider: match height, crop horizontally.
    drawH = canvasH;
    drawW = drawH * sourceRatio;
  } else {
    // Source is taller (or equal): match width, crop vertically.
    drawW = canvasW;
    drawH = drawW / sourceRatio;
  }

  const dx = (canvasW - drawW) * 0.5;
  const dy = (canvasH - drawH) * 0.5;
  ctx.drawImage(source, dx, dy, drawW, drawH);
}

export type CanvasBitmapSource = ImageBitmap | HTMLImageElement;

export function sourceDimensions(source: CanvasBitmapSource): {
  width: number;
  height: number;
} {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  return { width: source.width, height: source.height };
}
