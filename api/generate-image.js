import { generateImage } from "ai";

const getVisualMapping = (value, labels) => {
  if (value > 5) return labels.high;
  if (value < 3) return labels.low;
  return labels.medium;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { flavorNotes = "", sweetness = 4, acidity = 4, complexity = 4 } = req.body || {};

  const sweetnessVisual = getVisualMapping(sweetness, {
    high: "saturated amber and honey tones",
    low: "muted, earthy, and dry colors",
    medium: "warm, balanced golden hues",
  });

  const acidityVisual = getVisualMapping(acidity, {
    high: "sharp neon accents and high contrast",
    low: "soft blurred gradients and pastel tones",
    medium: "clean edges with moderate contrast",
  });

  const complexityVisual = getVisualMapping(complexity, {
    high: "fractal patterns and many fine lines",
    low: "bold single-subject focal point",
    medium: "structured layering with balanced detail",
  });

  const prompt = `Non-objective abstract expressionism masterpiece. Thick impasto oil paint texture with heavy palette knife strokes.
Dominant colors: Deep crimson, creamy avocado green, bright sun-yellow, swirling in a dynamic vortex.
Emotional intensity based on: Sweetness ${sweetness}/7 (${sweetnessVisual}), Acidity ${acidity}/7 (${acidityVisual}), Complexity ${complexity}/7 (${complexityVisual}).
Features: Rhythmic organic patterns, visceral sensory experience, ethereal lighting, pure abstraction with no literal objects, no fruit, no recognizable forms.
Style: Impressionistic energy, dynamic movement and emotion expressed through color and texture. 8k resolution masterpiece.`;

  try {
    const result = await generateImage({
      model: "google/gemini-3.1-flash-image-preview",
      prompt: prompt,
      size: "1600x2000",
    });

    if (!result.image) {
      throw new Error("No image data returned from Nano Banana API");
    }

    // Convert image data to base64 data URL
    const base64Image = Buffer.from(result.image).toString("base64");
    res.status(200).json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generation failed", details: error.message });
  }
}
