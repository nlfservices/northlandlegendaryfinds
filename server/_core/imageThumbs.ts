/**
 * On-demand JPEG thumbs for set grids.
 * Only /studios /mcs /mint2026 /mint-backs /cbh. Full scans stay untouched.
 * Activated by ?w=80..800. Cached on disk. Falls through to static if anything fails.
 */
import fs from "fs";
import os from "os";
import path from "path";
import type { Express, Request, Response, NextFunction } from "express";
import sharp from "sharp";

const FOLDERS = new Set(["studios", "mcs", "mint2026", "mint-backs", "cbh"]);
const MIN_W = 80;
const MAX_W = 800;
const CACHE_DIR = path.join(os.tmpdir(), "nlf-card-thumbs");

function publicRoots(): string[] {
  return [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "client", "public"),
    path.resolve(import.meta.dirname, "public"),
    path.resolve(import.meta.dirname, "..", "..", "client", "public"),
    path.resolve(import.meta.dirname, "..", "..", "dist", "public"),
  ];
}

function findSource(rel: string): string | null {
  for (const root of publicRoots()) {
    const full = path.resolve(root, rel);
    if (!full.startsWith(path.resolve(root))) continue;
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

export function registerImageThumbs(app: Express): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {
    /* ignore */
  }

  app.get(
    /^\/(studios|mcs|mint2026|mint-backs|cbh)\/.+\.(?:jpe?g|png)$/i,
    (req: Request, res: Response, next: NextFunction) => {
      void handleThumb(req, res, next);
    }
  );
}

async function handleThumb(req: Request, res: Response, next: NextFunction): Promise<void> {
  const rawW = Number(req.query.w);
  if (!Number.isFinite(rawW)) {
    next();
    return;
  }
  const width = Math.round(rawW);
  if (width < MIN_W || width > MAX_W) {
    next();
    return;
  }

  const rel = decodeURIComponent(req.path.replace(/^\/+/, ""));
  const folder = rel.split("/")[0];
  if (!FOLDERS.has(folder) || rel.includes("..")) {
    next();
    return;
  }

  const src = findSource(rel);
  if (!src) {
    next();
    return;
  }

  const cacheName = `${rel.replace(/[\\/]/g, "__")}_w${width}.jpg`;
  const dest = path.join(CACHE_DIR, cacheName);

  try {
    const srcMtime = fs.statSync(src).mtimeMs;
    let fresh = false;
    if (fs.existsSync(dest)) {
      fresh = fs.statSync(dest).mtimeMs >= srcMtime;
    }
    if (!fresh) {
      await sharp(src)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 72, mozjpeg: true })
        .toFile(dest);
    }
    res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(dest);
  } catch {
    next();
  }
}
