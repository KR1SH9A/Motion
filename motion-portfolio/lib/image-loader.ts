/**
 * Image fetch + decode helpers for the canvas frame sequence.
 *
 * Prefers `createImageBitmap` because:
 *   - decoding happens off the main thread,
 *   - the resulting bitmap is GPU-friendly for `drawImage`,
 *   - we never insert <img> nodes into the DOM.
 *
 * Falls back to `HTMLImageElement` for browsers without ImageBitmap
 * (mostly older Safari, but the project targets Chrome/Edge/Firefox 111+
 * and Safari 16.4+ per Next 16, so the fallback is defensive only).
 */

import type { CanvasBitmapSource } from "./sequence";

type LoadResult = CanvasBitmapSource;

const inflight = new Map<string, Promise<LoadResult>>();

const canUseImageBitmap =
  typeof window !== "undefined" && typeof window.createImageBitmap === "function";

async function loadViaBitmap(url: string, signal?: AbortSignal): Promise<ImageBitmap> {
  const response = await fetch(url, { signal, cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const blob = await response.blob();
  return await createImageBitmap(blob, {
    imageOrientation: "from-image",
    premultiplyAlpha: "premultiply",
  });
}

function loadViaImageElement(url: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = url;
    const onAbort = () => {
      img.src = "";
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal) {
      if (signal.aborted) return onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
  });
}

export function loadFrame(url: string, signal?: AbortSignal): Promise<LoadResult> {
  const existing = inflight.get(url);
  if (existing) return existing;

  const promise = (canUseImageBitmap ? loadViaBitmap(url, signal) : loadViaImageElement(url, signal))
    .catch((err) => {
      // Allow retry next time something requests this URL.
      inflight.delete(url);
      throw err;
    });

  inflight.set(url, promise);
  return promise;
}

export interface PreloadOptions {
  /** First N urls are awaited before the returned promise resolves. */
  priorityFirstN?: number;
  /** Maximum simultaneous fetch+decode jobs. */
  concurrency?: number;
  signal?: AbortSignal;
  onLoaded?: (url: string, source: LoadResult, index: number) => void;
  onError?: (url: string, err: unknown, index: number) => void;
}

/**
 * Preloads `urls` with a bounded concurrency pool.
 *
 * - The first `priorityFirstN` results are awaited (so the caller knows the
 *   opening frames are ready before allowing scroll-driven playback).
 * - Remaining loads continue in the background; `onLoaded` reports progress.
 * - The returned promise resolves once *all* loads have settled.
 */
export async function preloadSequence(
  urls: readonly string[],
  options: PreloadOptions = {},
): Promise<void> {
  const {
    priorityFirstN = 0,
    concurrency = 6,
    signal,
    onLoaded,
    onError,
  } = options;

  // Eagerly resolve the priority batch.
  if (priorityFirstN > 0) {
    const priorityBatch = urls.slice(0, priorityFirstN);
    await Promise.all(
      priorityBatch.map(async (url, i) => {
        try {
          const source = await loadFrame(url, signal);
          onLoaded?.(url, source, i);
        } catch (err) {
          if ((err as DOMException)?.name === "AbortError") return;
          onError?.(url, err, i);
        }
      }),
    );
  }

  const rest = urls.slice(priorityFirstN);
  if (rest.length === 0) return;

  let cursor = 0;
  const worker = async () => {
    while (true) {
      if (signal?.aborted) return;
      const next = cursor++;
      if (next >= rest.length) return;
      const restUrl = rest[next];
      const absoluteIndex = priorityFirstN + next;
      try {
        const source = await loadFrame(restUrl, signal);
        onLoaded?.(restUrl, source, absoluteIndex);
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
        onError?.(restUrl, err, absoluteIndex);
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, rest.length) }, () => worker());
  await Promise.all(workers);
}
