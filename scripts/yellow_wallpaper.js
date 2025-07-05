const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const Jimp = require('jimp');
const wallpaper = require('wallpaper');

function hslToRgb(h, s, l) {
  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return { r, g, b };
}

async function setYellowTones() {
  const total = 512;
  const width = 1920;
  const height = 1080;
  for (let i = 0; i < total; i++) {
    const hue = 50 / 360 + (15 / 360) * (i / total); // range roughly around yellow
    const { r, g, b } = hslToRgb(hue, 1, 0.5);
    const color = Jimp.rgbaToInt(r, g, b, 255);
    const img = new Jimp(width, height, color);
    const file = path.join(os.tmpdir(), `yellow_tone_${i}.png`);
    await img.writeAsync(file);
    await wallpaper.set(file);
    await new Promise(res => setTimeout(res, 100));
    try { await fs.unlink(file); } catch (_) {}
  }
}

setYellowTones();
