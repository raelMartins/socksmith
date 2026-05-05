/** Filenames in `public/images/background_images` — used for the landing animated grid. */
export const LANDING_BACKGROUND_FILENAMES = [
  "Box in air.jpg",
  "Green Gradient.jpg",
  "Plain on Rubble Blue.jpg",
  "Plain Pink.jpg",
] as const;

/**
 * Sock photography in `public/images` (excludes `icons/` and `background_images/`).
 * Labels are derived from filenames (extension stripped).
 */
export const SOCK_GALLERY_FILENAMES = [
  "Box in air.jpg",
  "Box in hand 2.jpg",
  "Box in hand.jpg",
  "Box.jpg",
  "Cluster Box.jpg",
  "Cover Face 2.jpg",
  "Cover Face.jpg",
  "Geometric Army Green.jpg",
  "Geometric Burgundy 1.jpg",
  "Geometric Burgundy 2.jpg",
  "Geometric Burgundy 3.jpg",
  "Geometric Burgundy.jpg",
  "Green Gradient.jpg",
  "Plain Blue v2.jpg",
  "Plain Blue.jpg",
  "Plain Green v2.jpg",
  "Plain Green.jpg",
  "Plain on Rubble Blue.jpg",
  "Plain on Rubble Green.jpg",
  "Plain on Rubble.jpg",
  "Plain Orange v2.jpg",
  "Plain Orange.jpg",
  "Plain Pink v2.jpg",
  "Plain Pink.jpg",
  "Smile 2.jpg",
  "Smile 3.jpg",
  "Smile 4.jpg",
  "Smile full.jpg",
  "Smile Pink!.jpg",
  "Smile Pink.jpg",
  "Smile.jpg",
] as const;

export function landingBackgroundSrc(filename: string): string {
  return encodeURI(`/images/background_images/${filename}`);
}

export function sockGallerySrc(filename: string): string {
  return encodeURI(`/images/${filename}`);
}

export function labelFromFilename(filename: string): string {
  return filename.replace(/\.(jpe?g|png|webp)$/i, "");
}
