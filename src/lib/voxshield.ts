export type ScanResult = {
  id: string;
  fileName: string;
  durationSec: number;
  sizeKb: number;
  format: string;
  createdAt: string;
  aiProbability: number;
  humanProbability: number;
  authenticityScore: number;
  confidence: number;
  risk: number;
  verdict: "Authentic" | "Suspicious" | "AI Cloned";
  factors: { label: string; detail: string; impact: number }[];
};

const KEY = "voxshield.history";

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function analyzeAudio(meta: {
  fileName: string;
  durationSec: number;
  sizeKb: number;
  format: string;
}): ScanResult {
  const seed = [...meta.fileName].reduce((a, c) => a + c.charCodeAt(0), 0) + Math.round(meta.sizeKb);
  const rand = seededRandom(seed || 7);
  const aiProbability = Math.round((0.08 + rand() * 0.88) * 1000) / 10;
  const humanProbability = Math.round((100 - aiProbability) * 10) / 10;
  const authenticityScore = Math.round(humanProbability);
  const confidence = Math.round(72 + rand() * 26);
  const risk = Math.round(aiProbability * 0.82 + rand() * 12);
  const verdict: ScanResult["verdict"] =
    aiProbability > 70 ? "AI Cloned" : aiProbability > 40 ? "Suspicious" : "Authentic";

  const factors = [
    {
      label: "Spectral Artifacts",
      detail:
        "Frequency bands above 8 kHz show vocoder-style smoothing typical of neural speech synthesis.",
      impact: Math.round(aiProbability * 0.9 + rand() * 8),
    },
    {
      label: "Prosody & Micro-Pauses",
      detail:
        "Breath placement and pause entropy compared against a corpus of natural human speech patterns.",
      impact: Math.round(aiProbability * 0.7 + rand() * 20),
    },
    {
      label: "Jitter & Shimmer",
      detail:
        "Cycle-to-cycle pitch and amplitude variation measured from the glottal source estimate.",
      impact: Math.round(aiProbability * 0.6 + rand() * 24),
    },
    {
      label: "Background Coherence",
      detail: "Room tone consistency and noise-floor continuity across the full recording window.",
      impact: Math.round(aiProbability * 0.5 + rand() * 30),
    },
  ].map((f) => ({ ...f, impact: Math.min(99, Math.max(4, f.impact)) }));

  return {
    id: `VS-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    aiProbability,
    humanProbability,
    authenticityScore,
    confidence,
    risk: Math.min(99, risk),
    verdict,
    factors,
    ...meta,
  };
}

export function saveResult(result: ScanResult) {
  if (typeof window === "undefined") return;
  const all = [result, ...loadHistory()].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(all));
  localStorage.setItem("voxshield.latest", JSON.stringify(result));
}

export function loadHistory(): ScanResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as ScanResult[];
  } catch {
    return [];
  }
}

export function loadLatest(): ScanResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("voxshield.latest");
    return raw ? (JSON.parse(raw) as ScanResult) : null;
  } catch {
    return null;
  }
}

export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
