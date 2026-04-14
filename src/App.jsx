import { useState, useRef, useEffect, useCallback } from "react";

const FLAVOR_MAP = {
  berry: { hue: 340, sat: 80, warmth: 0.3 }, blueberry: { hue: 260, sat: 75, warmth: 0.2 },
  strawberry: { hue: 350, sat: 85, warmth: 0.4 }, raspberry: { hue: 330, sat: 80, warmth: 0.3 },
  cherry: { hue: 355, sat: 78, warmth: 0.5 }, citrus: { hue: 45, sat: 90, warmth: 0.6 },
  lemon: { hue: 55, sat: 92, warmth: 0.5 }, orange: { hue: 30, sat: 88, warmth: 0.7 },
  grapefruit: { hue: 15, sat: 75, warmth: 0.5 }, apple: { hue: 100, sat: 60, warmth: 0.4 },
  peach: { hue: 25, sat: 70, warmth: 0.6 }, apricot: { hue: 35, sat: 72, warmth: 0.6 },
  plum: { hue: 290, sat: 55, warmth: 0.4 }, grape: { hue: 280, sat: 60, warmth: 0.3 },
  tropical: { hue: 50, sat: 85, warmth: 0.8 }, mango: { hue: 40, sat: 88, warmth: 0.8 },
  pineapple: { hue: 52, sat: 82, warmth: 0.7 }, passion: { hue: 48, sat: 80, warmth: 0.7 },
  fig: { hue: 310, sat: 40, warmth: 0.5 }, melon: { hue: 90, sat: 55, warmth: 0.5 },
  red: { hue: 0, sat: 85, warmth: 0.7 }, yellow: { hue: 55, sat: 90, warmth: 0.6 },
  golden: { hue: 42, sat: 80, warmth: 0.7 }, brown: { hue: 25, sat: 50, warmth: 0.6 },
  dark: { hue: 20, sat: 30, warmth: 0.3 }, bright: { hue: 60, sat: 95, warmth: 0.5 },
  jasmine: { hue: 60, sat: 40, warmth: 0.4 }, lavender: { hue: 270, sat: 45, warmth: 0.3 },
  rose: { hue: 345, sat: 55, warmth: 0.4 }, floral: { hue: 310, sat: 50, warmth: 0.4 },
  herbal: { hue: 130, sat: 45, warmth: 0.3 }, mint: { hue: 160, sat: 60, warmth: 0.1 },
  chamomile: { hue: 50, sat: 35, warmth: 0.5 }, tea: { hue: 80, sat: 30, warmth: 0.4 },
  bergamot: { hue: 70, sat: 50, warmth: 0.4 }, hibiscus: { hue: 340, sat: 65, warmth: 0.3 },
  chocolate: { hue: 20, sat: 60, warmth: 0.7 }, cocoa: { hue: 15, sat: 55, warmth: 0.6 },
  caramel: { hue: 35, sat: 70, warmth: 0.8 }, honey: { hue: 42, sat: 75, warmth: 0.7 },
  toffee: { hue: 30, sat: 65, warmth: 0.8 }, vanilla: { hue: 45, sat: 35, warmth: 0.6 },
  nutty: { hue: 30, sat: 45, warmth: 0.6 }, almond: { hue: 35, sat: 40, warmth: 0.5 },
  hazelnut: { hue: 25, sat: 50, warmth: 0.6 }, walnut: { hue: 20, sat: 40, warmth: 0.5 },
  smoky: { hue: 10, sat: 25, warmth: 0.7 }, earthy: { hue: 30, sat: 30, warmth: 0.5 },
  woody: { hue: 25, sat: 35, warmth: 0.5 }, cedar: { hue: 20, sat: 32, warmth: 0.5 },
  spice: { hue: 15, sat: 65, warmth: 0.8 }, cinnamon: { hue: 18, sat: 68, warmth: 0.8 },
  clove: { hue: 12, sat: 55, warmth: 0.7 }, pepper: { hue: 8, sat: 40, warmth: 0.6 },
  ginger: { hue: 38, sat: 65, warmth: 0.7 }, cardamom: { hue: 110, sat: 35, warmth: 0.5 },
  wine: { hue: 350, sat: 50, warmth: 0.5 }, winey: { hue: 350, sat: 50, warmth: 0.5 },
  fermented: { hue: 30, sat: 40, warmth: 0.5 }, butter: { hue: 48, sat: 50, warmth: 0.7 },
  cream: { hue: 42, sat: 25, warmth: 0.6 }, creamy: { hue: 42, sat: 25, warmth: 0.6 },
  sugar: { hue: 45, sat: 20, warmth: 0.5 }, molasses: { hue: 18, sat: 60, warmth: 0.8 },
  maple: { hue: 28, sat: 65, warmth: 0.7 }, sweet: { hue: 40, sat: 55, warmth: 0.6 },
  bitter: { hue: 15, sat: 35, warmth: 0.4 }, sour: { hue: 65, sat: 70, warmth: 0.3 },
  tangy: { hue: 55, sat: 75, warmth: 0.4 }, tart: { hue: 60, sat: 72, warmth: 0.3 },
  crisp: { hue: 180, sat: 40, warmth: 0.2 }, clean: { hue: 190, sat: 30, warmth: 0.3 },
  smooth: { hue: 30, sat: 30, warmth: 0.5 }, bold: { hue: 10, sat: 60, warmth: 0.7 },
  rich: { hue: 15, sat: 55, warmth: 0.7 }, robust: { hue: 10, sat: 50, warmth: 0.7 },
  delicate: { hue: 300, sat: 25, warmth: 0.3 }, juicy: { hue: 0, sat: 70, warmth: 0.5 },
};

function parseFlavorNotes(text) {
  const lower = text.toLowerCase();
  const matches = [];
  const sortedKeys = Object.keys(FLAVOR_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) matches.push({ key, ...FLAVOR_MAP[key] });
  }
  return matches;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

function rng(seed, i) {
  let x = Math.sin(seed * 0.001 + i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

// Apply blur by redrawing the canvas onto itself with CSS filter
function blurCanvas(canvas, amount) {
  if (amount < 1) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  // Use multiple passes of moderate blur for better quality
  const passes = Math.ceil(amount / 10);
  const perPass = Math.min(amount / passes, 12);
  for (let p = 0; p < passes; p++) {
    ctx.save();
    ctx.filter = "blur(" + perPass + "px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }
}

function generateImage(canvas, notes, sweetRaw, acidRaw, complexRaw, randomSeed) {
  const W = 1600, H = 2000;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const sweetness = (sweetRaw - 1) / 6;
  const acidity = (acidRaw - 1) / 6;
  const complexity = (complexRaw - 1) / 6;
  const flavors = parseFlavorNotes(notes);
  const seed = hashStr(notes || "coffee") + randomSeed;
  const r = (i) => rng(seed, i);

  // Build palette
  let palette = flavors.length > 0
    ? flavors.map((f) => ({ hue: f.hue, sat: Math.max(55, f.sat), light: 45 + f.warmth * 15 }))
    : [{ hue: 25, sat: 45, light: 40 }, { hue: 15, sat: 40, light: 35 }, { hue: 35, sat: 50, light: 45 }];

  const deduped = [palette[0]];
  for (let i = 1; i < palette.length; i++) {
    if (!deduped.some((d) => Math.abs(d.hue - palette[i].hue) < 15)) deduped.push(palette[i]);
  }
  palette = deduped;

  const sweetSat = sweetness * 20;
  const sweetLight = sweetness * 12;
  const sharpness = acidity;
  const gradSpread = 1.6 - sharpness * 1.3;
  const layers = Math.floor(3 + complexity * 8);
  const kFold = Math.floor(2 + complexity * 6);

  // Background — solid color from first flavor note or blended mix
  // Use the first palette entry as the dominant base, at medium-high lightness
  let bgH, bgS, bgL;
  if (palette.length === 1) {
    bgH = palette[0].hue;
    bgS = Math.min(70, palette[0].sat * 0.7 + sweetness * 10);
    bgL = 45 + sweetness * 15; // bright, not dark
  } else {
    // Blend first two hues using circular average
    const h1 = palette[0].hue, h2 = palette[1].hue;
    const ax = Math.cos(h1 * Math.PI / 180) + Math.cos(h2 * Math.PI / 180);
    const ay = Math.sin(h1 * Math.PI / 180) + Math.sin(h2 * Math.PI / 180);
    bgH = ((Math.atan2(ay, ax) * 180 / Math.PI) + 360) % 360;
    bgS = Math.min(65, (palette[0].sat + palette[1].sat) * 0.35 + sweetness * 10);
    bgL = 42 + sweetness * 16;
  }
  ctx.fillStyle = `hsl(${bgH}, ${bgS}%, ${bgL}%)`;
  ctx.fillRect(0, 0, W, H);

  // Subtle secondary wash for depth — lighter, not darker
  if (palette.length > 1) {
    const wash = ctx.createLinearGradient(0, 0, W, H);
    wash.addColorStop(0, `hsla(${palette[1].hue}, ${palette[1].sat * 0.5}%, ${bgL + 6}%, 0.3)`);
    wash.addColorStop(1, `hsla(${palette[Math.min(2, palette.length - 1)].hue}, ${palette[0].sat * 0.4}%, ${bgL - 5}%, 0.25)`);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);
  }

  // Shape layers — diverse abstract elements
  for (let l = 0; l < layers; l++) {
    const t = l / layers;
    const p = palette[l % palette.length];
    const hue = (p.hue + r(l) * 20 - 10 + 360) % 360;
    const sat = Math.min(100, p.sat + sweetSat);
    const light = Math.min(85, p.light + sweetLight + t * 15);
    const alpha = (0.15 + (1 - t) * 0.2) * (0.5 + sweetness * 0.5);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(((Math.PI * 2) / kFold) * (l % kFold) + r(l + 50) * 0.3);
    ctx.translate((r(l * 3 + 1) - 0.5) * W * 0.6, (r(l * 3 + 2) - 0.5) * H * 0.6);
    const sc = 0.3 + r(l * 7) * 0.7 + complexity * 0.3;
    ctx.scale(sc, sc * (1 + (r(l * 11) - 0.5) * 0.4));

    const nb = palette[(l + 1) % palette.length];
    const h2 = (nb.hue + 20) % 360;
    const shapeType = Math.floor(r(l * 97) * 5); // 0-4: blob, line, arc, triangle, diamond

    if (shapeType === 0) {
      // Organic blob (original)
      const pts = Math.floor(5 + complexity * 10);
      const rad = 200 + r(l * 5) * 500 + sweetness * 160;
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rad * Math.max(0.3, gradSpread));
      if (sharpness > 0.7) {
        grd.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 2})`);
        grd.addColorStop(0.9, `hsla(${h2}, ${Math.min(100, nb.sat + sweetSat)}%, ${light}%, ${alpha * 1.5})`);
        grd.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.6})`);
      } else {
        grd.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.4})`);
        grd.addColorStop(0.4, `hsla(${h2}, ${Math.min(100, nb.sat + sweetSat)}%, ${light}%, ${alpha * 0.7})`);
        grd.addColorStop(1, `hsla(${hue}, ${sat * 0.4}%, ${light * 0.4}%, 0)`);
      }
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const wobble = 1 + Math.sin(a * (2 + l) + r(l + i) * 6) * (0.2 + complexity * 0.3);
        const rr = rad * wobble;
        const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py);
        else {
          const cpA = ((i - 0.5) / pts) * Math.PI * 2;
          const cpR = rad * (1 + Math.sin(cpA * 3 + r(l * 2 + i) * 5) * 0.35);
          ctx.quadraticCurveTo(Math.cos(cpA) * cpR, Math.sin(cpA) * cpR, px, py);
        }
      }
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();

    } else if (shapeType === 1) {
      // Flowing lines / strokes
      const lineCount = Math.floor(2 + r(l * 19) * 5);
      for (let li = 0; li < lineCount; li++) {
        const len = 150 + r(l * 13 + li) * 600;
        const angle = r(l * 29 + li) * Math.PI * 2;
        const cx1 = Math.cos(angle + 0.5) * len * 0.5;
        const cy1 = Math.sin(angle + 0.3) * len * 0.5;
        ctx.beginPath();
        ctx.moveTo(-Math.cos(angle) * len * 0.5, -Math.sin(angle) * len * 0.5);
        ctx.quadraticCurveTo(cx1, cy1, Math.cos(angle) * len * 0.5, Math.sin(angle) * len * 0.5);
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.2})`;
        ctx.lineWidth = (1 + r(l * 37 + li) * 8) * (sharpness > 0.5 ? 1 : 2);
        ctx.lineCap = "round";
        ctx.stroke();
      }

    } else if (shapeType === 2) {
      // Arcs / crescents
      const rad = 100 + r(l * 5) * 400;
      const startA = r(l * 61) * Math.PI * 2;
      const sweep = 0.5 + r(l * 67) * 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, rad, startA, startA + sweep);
      ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.5})`;
      ctx.lineWidth = 3 + r(l * 43) * 15 * (sharpness > 0.5 ? 0.6 : 1.5);
      ctx.lineCap = "round";
      ctx.stroke();
      // Double arc at offset
      if (complexity > 0.3) {
        ctx.beginPath();
        ctx.arc(0, 0, rad * (0.7 + r(l * 71) * 0.2), startA + 0.3, startA + sweep - 0.3);
        ctx.strokeStyle = `hsla(${h2}, ${Math.min(100, nb.sat + sweetSat)}%, ${light}%, ${alpha})`;
        ctx.lineWidth = 2 + r(l * 47) * 8;
        ctx.stroke();
      }

    } else if (shapeType === 3) {
      // Triangles
      const size = 100 + r(l * 5) * 350 + sweetness * 100;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + r(l * 53) * 0.5;
        const rr = size * (0.8 + r(l * 31 + i) * 0.4);
        const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (r(l * 83) > 0.5) {
        // Filled triangle
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, size * Math.max(0.3, gradSpread));
        grd.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.5})`);
        grd.addColorStop(1, `hsla(${h2}, ${sat * 0.5}%, ${light * 0.6}%, ${sharpness > 0.5 ? alpha * 0.5 : 0})`);
        ctx.fillStyle = grd;
        ctx.fill();
      } else {
        // Stroked triangle
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.8})`;
        ctx.lineWidth = 2 + r(l * 39) * 6;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

    } else {
      // Diamond / rhombus
      const size = 80 + r(l * 5) * 300 + sweetness * 80;
      const stretch = 1 + r(l * 77) * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * stretch);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size * stretch);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      const grd = ctx.createLinearGradient(-size, -size * stretch, size, size * stretch);
      grd.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.4})`);
      grd.addColorStop(1, `hsla(${h2}, ${Math.min(100, nb.sat + sweetSat)}%, ${light}%, ${sharpness > 0.5 ? alpha : alpha * 0.3})`);
      ctx.fillStyle = grd;
      ctx.fill();
      if (sharpness > 0.6) {
        ctx.strokeStyle = `hsla(${hue}, ${sat * 0.8}%, ${Math.min(85, light + 10)}%, ${(sharpness - 0.6) * 0.5})`;
        ctx.lineWidth = 1 + (sharpness - 0.6) * 3;
        ctx.stroke();
      }
    }

    // Edge stroke for sharp acidity (applies to blobs only via shapeType check)
    if (shapeType === 0 && sharpness > 0.6) {
      ctx.strokeStyle = `hsla(${hue}, ${sat * 0.9}%, ${Math.min(80, light + 5)}%, ${(sharpness - 0.6) * 0.5})`;
      ctx.lineWidth = 1 + (sharpness - 0.6) * 5;
      ctx.stroke();
    }

    // Kaleidoscope mirror
    if (complexity > 0.3 && (shapeType === 0 || shapeType === 3 || shapeType === 4)) {
      ctx.scale(-1, 1);
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // Accent lines — long sweeping curves across the canvas
  const accentCount = Math.floor(2 + complexity * 5);
  for (let i = 0; i < accentCount; i++) {
    const ap = palette[i % palette.length];
    const x1 = r(i * 113) * W, y1 = r(i * 117) * H;
    const x2 = r(i * 123) * W, y2 = r(i * 127) * H;
    const cpx = r(i * 131) * W, cpy = r(i * 137) * H;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpx, cpy, x2, y2);
    ctx.strokeStyle = `hsla(${ap.hue}, ${Math.min(100, ap.sat + sweetSat)}%, ${Math.min(80, ap.light + sweetLight)}%, ${0.08 + r(i * 141) * 0.15})`;
    ctx.lineWidth = 1 + r(i * 143) * 5 * (sharpness > 0.5 ? 0.7 : 1.5);
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Depth overlay — subtle, palette-tinted, not darkening
  const dg = ctx.createRadialGradient(W / 2, H / 2, W * 0.05, W / 2, H / 2, W * 0.75);
  const mp = palette[Math.floor(palette.length / 2)];
  dg.addColorStop(0, `hsla(${mp.hue}, ${mp.sat * 0.5}%, ${bgL + 8}%, ${0.06 + sweetness * 0.05})`);
  dg.addColorStop(1, `hsla(${bgH}, ${bgS * 0.6}%, ${Math.max(20, bgL - 15)}%, ${0.15 + complexity * 0.08})`);
  ctx.fillStyle = dg;
  ctx.fillRect(0, 0, W, H);

  // Particles
  if (complexity > 0.2) {
    const cnt = Math.floor(80 + complexity * 400);
    for (let i = 0; i < cnt; i++) {
      const pp = palette[i % palette.length];
      ctx.beginPath();
      ctx.arc(r(i * 13 + 7) * W, r(i * 17 + 3) * H, 1 + r(i * 23) * 4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(pp.hue + r(i * 7) * 15) % 360}, ${Math.min(100, pp.sat + sweetSat)}%, ${Math.min(80, pp.light + sweetLight)}%, ${0.1 + r(i * 31) * 0.25})`;
      ctx.fill();
    }
  }

  // Rings
  if (complexity > 0.2) {
    const rings = Math.floor(2 + complexity * 6);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    for (let i = 0; i < rings; i++) {
      const rp = palette[i % palette.length];
      ctx.beginPath();
      ctx.arc(0, 0, 120 + i * (360 / rings) + r(i * 41) * 80, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${rp.hue}, ${rp.sat * 0.8}%, ${45 + sweetness * 20}%, ${0.06 + complexity * 0.08})`;
      ctx.lineWidth = sharpness > 0.7 ? 1 + complexity * 2 : 3 + (1 - sharpness) * 5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Vignette — gentle, tinted to bg color, not black
  const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.85);
  vig.addColorStop(0, "transparent");
  vig.addColorStop(1, `hsla(${bgH}, ${bgS * 0.6}%, ${Math.max(15, bgL - 20)}%, 0.35)`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Blur for low acidity (soft edges)
  const blurAmt = Math.max(0, (1 - sharpness) * 28);
  if (blurAmt > 1) blurCanvas(canvas, blurAmt);

  // Grain
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  const ga = 6 + complexity * 10;
  for (let i = 0; i < d.length; i += 8) {
    const n = (Math.random() - 0.5) * ga;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
    d[i + 4] += n; d[i + 5] += n; d[i + 6] += n;
  }
  ctx.putImageData(imgData, 0, 0);
}

const DotSelector = ({ label, value, onChange, hint }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a0917e" }}>{label}</span>
      <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b5d4f" }}>{value} / 7</span>
    </div>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
        <button
          key={dot}
          onClick={() => onChange(dot)}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            border: dot <= value ? "2px solid #a0917e" : "2px solid #3a3228",
            background: dot <= value ? "#a0917e" : "transparent",
            cursor: "pointer", padding: 0, transition: "all 0.15s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label={`${label} ${dot}`}
        >
          <span style={{
            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
            background: dot <= value ? "#1a1612" : "#3a3228",
          }} />
        </button>
      ))}
    </div>
    {hint && <div style={{ fontSize: 10, color: "#6b5d4f", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{hint}</div>}
  </div>
);

export default function CoffeeCuppingViz() {
  const canvasRef = useRef(null);
  const [notes, setNotes] = useState("");
  const [sweetness, setSweetness] = useState(4);
  const [acidity, setAcidity] = useState(4);
  const [complexity, setComplexity] = useState(4);
  const [generated, setGenerated] = useState(false);
  const [seed, setSeed] = useState(0);

  const generate = useCallback(() => {
    if (!canvasRef.current) return;
    const newSeed = Date.now();
    setSeed(newSeed);
    generateImage(canvasRef.current, notes, sweetness, acidity, complexity, newSeed);
    setGenerated(true);
  }, [notes, sweetness, acidity, complexity]);

  useEffect(() => {
    if (generated) {
      generateImage(canvasRef.current, notes, sweetness, acidity, complexity, seed);
    }
  }, [sweetness, acidity, complexity]);

  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "cupping-" + Date.now() + ".png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    }, "image/png");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#1a1612", color: "#d4c5b3",
      fontFamily: "'DM Mono', monospace",
      display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px",
    }}>

      <header style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 4000" style={{ width: 56, height: 56, marginBottom: 10, display: "block" }}>
          <g transform="translate(0,4000) scale(1,-1)" fill="#e8ddd0" stroke="none">
            <path d="M1601 3668 c-89 -243 -320 -933 -314 -938 9 -9 165 -61 169 -57 5 5 323 925 326 943 2 15 -12 24 -72 46 -93 33 -99 33 -109 6z M1175 3438 c-3 -7 -58 -168 -124 -358 -98 -284 -117 -346 -105 -353 33 -19 158 -57 164 -50 9 10 242 683 244 702 0 9 -27 25 -74 42 -85 32 -99 34 -105 17z M1885 3438 c-3 -7 -58 -168 -124 -358 -86 -247 -116 -347 -108 -352 27 -17 161 -57 167 -50 7 7 238 676 242 701 2 9 -23 24 -72 42 -85 32 -99 34 -105 17z M2138 2694 c-5 -4 -8 -114 -8 -244 l0 -237 41 -7 c136 -22 244 -163 224 -294 -18 -123 -127 -231 -232 -232 l-33 0 0 -397 c0 -394 -1 -398 -23 -438 -30 -53 -76 -82 -143 -90 l-54 -7 0 -225 0 -225 523 5 c578 5 604 8 804 78 228 81 347 172 423 323 53 108 70 179 70 302 0 120 -24 226 -72 317 -46 86 -155 194 -255 252 l-81 47 73 73 c92 92 140 185 157 304 40 276 -112 526 -384 631 -136 52 -223 62 -643 67 -209 3 -383 2 -387 -3z m662 -505 c66 -14 139 -64 164 -113 25 -50 32 -142 16 -201 -17 -61 -69 -117 -132 -146 -43 -19 -75 -24 -170 -27 l-118 -4 0 251 0 251 95 0 c51 0 117 -5 145 -11z m93 -954 c167 -44 267 -146 267 -275 0 -110 -67 -192 -187 -231 -55 -17 -100 -22 -240 -27 l-173 -5 0 275 c0 151 3 278 8 283 11 12 261 -3 325 -20z M270 1575 c0 -1085 1 -1117 19 -1154 29 -56 81 -97 141 -110 34 -7 254 -11 655 -11 l605 0 0 225 0 225 -385 0 c-431 0 -467 4 -525 56 -75 68 -70 0 -70 993 l0 891 -220 0 -220 0 0 -1115z"/>
          </g>
        </svg>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, color: "#e8ddd0", margin: 0, letterSpacing: "0.02em" }}>Cupping Canvas</h1>
      </header>

      <div style={{
        display: "flex", gap: 32, maxWidth: 1100, width: "100%",
        justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start",
      }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block", fontSize: 11, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "#a0917e", marginBottom: 8,
            }}>Flavor Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={"e.g. blueberry, dark chocolate,\ncaramel, floral, jasmine, citrus..."}
              rows={4}
              style={{
                width: "100%", background: "#231f1a", border: "1px solid #3a3228",
                borderRadius: 6, padding: "10px 12px", color: "#d4c5b3",
                fontFamily: "'DM Mono', monospace", fontSize: 12, resize: "vertical",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <DotSelector label="Sweetness" value={sweetness} onChange={setSweetness} hint="Saturation & warmth" />
          <DotSelector label="Acidity" value={acidity} onChange={setAcidity} hint="1 = soft & blurred · 7 = sharp edges" />
          <DotSelector label="Complexity" value={complexity} onChange={setComplexity} hint="Layers & detail" />

          <button onClick={generate} style={{
            width: "100%", padding: "12px 0", background: "#a0917e", color: "#1a1612",
            border: "none", borderRadius: 6, fontFamily: "'DM Mono', monospace",
            fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", marginBottom: 10,
          }}>Generate</button>

          {generated && (
            <button onClick={download} style={{
              width: "100%", padding: "12px 0", background: "transparent", color: "#a0917e",
              border: "1px solid #3a3228", borderRadius: 6, fontFamily: "'DM Mono', monospace",
              fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
            }}>↓ Download PNG</button>
          )}

          {generated && notes && (() => {
            const detected = Object.keys(FLAVOR_MAP).filter((k) => notes.toLowerCase().includes(k));
            if (detected.length === 0) return null;
            return (
              <div style={{
                marginTop: 20, padding: "12px 14px", background: "#231f1a",
                borderRadius: 6, border: "1px solid #2a2520",
              }}>
                <div style={{ fontSize: 10, color: "#6b5d4f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Detected notes</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {detected.map((k) => (
                    <span key={k} style={{
                      fontSize: 10, padding: "3px 8px",
                      background: "hsla(" + FLAVOR_MAP[k].hue + ", " + FLAVOR_MAP[k].sat + "%, 40%, 0.25)",
                      borderRadius: 20,
                      color: "hsl(" + FLAVOR_MAP[k].hue + ", " + (FLAVOR_MAP[k].sat * 0.7) + "%, 70%)",
                      border: "1px solid hsla(" + FLAVOR_MAP[k].hue + ", " + FLAVOR_MAP[k].sat + "%, 40%, 0.3)",
                    }}>{k}</span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{
          borderRadius: 8, overflow: "hidden",
          border: generated ? "1px solid #2a2520" : "1px dashed #2a2520",
          background: "#131110", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {!generated && (
            <div style={{
              width: 360, height: 450, display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column", gap: 8,
            }}>
              <span style={{ fontSize: 28, opacity: 0.2 }}>◉</span>
              <span style={{ fontSize: 11, color: "#4a4038", textTransform: "uppercase", letterSpacing: "0.08em" }}>Enter notes & generate</span>
            </div>
          )}
          <canvas ref={canvasRef} style={{
            display: generated ? "block" : "none", width: 360, height: 450, borderRadius: 7,
          }} />
        </div>
      </div>

      <footer style={{
        marginTop: 48, paddingTop: 20, borderTop: "1px solid #2a2520",
        textAlign: "center", width: "100%", maxWidth: 500,
      }}>
        <p style={{
          fontSize: 10, color: "#5a4f43", letterSpacing: "0.06em",
          fontFamily: "'DM Mono', monospace", margin: 0, lineHeight: 1.6,
        }}>
          by Jan Marlowe Gargaran of Resonate Design PH
        </p>
      </footer>
    </div>
  );
}
