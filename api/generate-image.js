import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });

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

  const prompt = `Specialty coffee label artwork.
Notes: ${flavorNotes}.
Visual intensity: Sweetness ${sweetness}/7 (${sweetnessVisual}),
Acidity ${acidity}/7 (${acidityVisual}),
Complexity ${complexity}/7 (${complexityVisual}).
Style: Modern, minimalist boutique coffee brand design.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const base64Image = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Image) {
      throw new Error("No image data returned from generative API");
    }

    res.status(200).json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generation failed", details: error.message });
  }
}
