/**
 * Owns the in-memory cache of decoded frames for the hero canvas.
 *
 * Why a dedicated class (not just a Map):
 *   - We need O(1) `findNearestLoaded(i)` for graceful fallback while frames stream in.
 *   - Cache size bookkeeping lets us reason about memory (162 × 1920×1080 bitmaps ≈
 *     162 × ~8 MB raw, but ImageBitmap typically lives in GPU memory).
 *   - Single abort signal coordinates teardown across many in-flight fetches.
 */

import { loadFrame, preloadSequence } from "@/lib/image-loader";
import {
  TOTAL_FRAMES,
  frameUrl,
  type CanvasBitmapSource,
} from "@/lib/sequence";

export interface SequenceLoaderEvents {
  onProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
}

export class SequenceLoader {
  private readonly total: number;
  private readonly cache: Map<number, CanvasBitmapSource> = new Map();
  private readonly abort: AbortController = new AbortController();
  private readiness = false;

  constructor(total: number = TOTAL_FRAMES) {
    this.total = total;
  }

  get size(): number {
    return this.cache.size;
  }

  get isReady(): boolean {
    return this.readiness;
  }

  has(index: number): boolean {
    return this.cache.has(index);
  }

  get(index: number): CanvasBitmapSource | undefined {
    return this.cache.get(index);
  }

  /**
   * Returns the loaded frame closest to `target` (preferring earlier frames).
   * Used by the canvas to avoid flashes when the exact frame isn't decoded yet.
   */
  findNearestLoaded(target: number): CanvasBitmapSource | undefined {
    if (this.cache.has(target)) return this.cache.get(target);
    for (let radius = 1; radius < this.total; radius++) {
      const before = target - radius;
      if (before >= 0 && this.cache.has(before)) return this.cache.get(before);
      const after = target + radius;
      if (after < this.total && this.cache.has(after)) return this.cache.get(after);
    }
    return undefined;
  }

  /**
   * Awaits the first `priorityCount` frames, then streams the remainder
   * in the background. Returns once the priority batch is decoded.
   */
  async start(events: SequenceLoaderEvents = {}, priorityCount = 8): Promise<void> {
    const urls = Array.from({ length: this.total }, (_, i) => frameUrl(i));
    const { onProgress, onReady } = events;

    // Priority pass: block until the opening frames are decoded so the first
    // paint of the canvas is always a real frame (no blank flash).
    await Promise.all(
      urls.slice(0, priorityCount).map(async (url, i) => {
        try {
          const source = await loadFrame(url, this.abort.signal);
          this.cache.set(i, source);
          onProgress?.(this.cache.size, this.total);
        } catch (err) {
          if ((err as DOMException)?.name !== "AbortError") {
            console.warn(`[SequenceLoader] priority frame ${i} failed`, err);
          }
        }
      }),
    );

    this.readiness = true;
    onReady?.();

    // Background pass: stream the rest with bounded concurrency.
    void preloadSequence(urls, {
      priorityFirstN: priorityCount,
      concurrency: 6,
      signal: this.abort.signal,
      onLoaded: (_url, source, index) => {
        if (this.abort.signal.aborted) return;
        this.cache.set(index, source);
        onProgress?.(this.cache.size, this.total);
      },
    });
  }

  destroy(): void {
    this.abort.abort();
    for (const source of this.cache.values()) {
      if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
        source.close();
      }
    }
    this.cache.clear();
  }
}
