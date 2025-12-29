// PPI Calculation utilities
export function calculatePPI(width, height, diagonal) {
  if (diagonal <= 0) return null;
  const diagonalPixels = Math.sqrt(width * width + height * height);
  return diagonalPixels / diagonal;
}

export function calculateDotPitch(ppi) {
  if (ppi <= 0) return null;
  return 25.4 / ppi; // Convert to mm
}

export function calculateTotalPixels(width, height) {
  return width * height;
}

export function formatNumber(num, decimals = 2) {
  return num.toFixed(decimals);
}

export function formatPixels(pixels) {
  return pixels.toLocaleString();
}
