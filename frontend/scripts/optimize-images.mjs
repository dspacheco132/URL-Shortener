#!/usr/bin/env node
/**
 * Optimizes ink-logo.png and ink-icon.png for web.
 * Creates WebP (primary) and PNG (fallback) versions with appropriate sizes.
 * Run: node scripts/optimize-images.mjs
 */

import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "../public");

const FAVICON_SIZES = [16, 32, 48, 180, 192];
const LOGO_WIDTH = 300;
const ICON_WIDTH = 64;

async function optimizeImages() {
  const logoPath = join(PUBLIC_DIR, "ink-logo-big.png");
  const iconPath = join(PUBLIC_DIR, "ink-icon.png");

  // Optimize logo - for header (logo)
  await sharp(logoPath)
    .resize(LOGO_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(join(PUBLIC_DIR, "ink-logo.webp"));

  await sharp(logoPath)
    .resize(LOGO_WIDTH, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC_DIR, "ink-logo-optimized.png"));

  console.log("Created ink-logo.webp and ink-logo-optimized.png");

  // Optimize icon - favicon and various sizes
  for (const size of FAVICON_SIZES) {
    await sharp(iconPath)
      .resize(size, size)
      .webp({ quality: 90 })
      .toFile(join(PUBLIC_DIR, `favicon-${size}.webp`));

    await sharp(iconPath)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(PUBLIC_DIR, `favicon-${size}.png`));
  }

  // Create favicon.png (32x32) - modern browsers support PNG favicon
  await sharp(iconPath)
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC_DIR, "favicon.png"));

  // Apple touch icon (180x180)
  await sharp(iconPath)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC_DIR, "apple-touch-icon.png"));

  // Icon for header (small)
  await sharp(iconPath)
    .resize(ICON_WIDTH, ICON_WIDTH)
    .webp({ quality: 90 })
    .toFile(join(PUBLIC_DIR, "ink-icon.webp"));

  await sharp(iconPath)
    .resize(ICON_WIDTH, ICON_WIDTH)
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC_DIR, "ink-icon-optimized.png"));

  console.log("Created favicon sizes, ink-icon.webp, ink-icon-optimized.png");
  console.log("Done!");
}

optimizeImages().catch(console.error);
