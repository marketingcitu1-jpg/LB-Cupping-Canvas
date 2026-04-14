# Cupping Canvas

Turn coffee cupping flavor notes into procedurally generated abstract art.

Built for specialty coffee roasters to visualize flavor profiles as downloadable 4:5 images (1600×2000px).

## Features

- **Flavor note parsing** — recognizes 60+ terms (fruits, herbs, chocolate, spice, etc.) and maps each to a unique color
- **Three controls** — Sweetness (saturation & warmth), Acidity (edge sharpness), Complexity (layers & detail) on a 1–7 dot scale
- **Diverse abstract shapes** — organic blobs, flowing lines, arcs, triangles, diamonds, and accent curves
- **Regenerate** — each press of Generate creates a unique composition from the same inputs
- **PNG export** — download at full 1600×2000 resolution

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo
4. Vercel auto-detects Vite — click **Deploy**
5. Done. Your app is live.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output is in `dist/`.

---

by Jan Marlowe Gargaran of Resonate Design PH
