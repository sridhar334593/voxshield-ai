import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Gauge, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { GlassCard, Meter, Section, SectionHeading } from "@/components/site/ui-bits";
import { formatDuration, loadLatest, type ScanResult } from "@/lib/voxshield";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Scan Results — VoxShield AI" },
      {
        name: "description",
        content:
          "Authenticity score, AI vs human probability, confidence and risk meters with explainable AI reasoning.",
      },
      { property: "og:title", content: "Scan Results — VoxShield AI" },
      {
        property: "og:description",
        content: "Explainable verdicts for every voice sample you scan.",
      },
    ],
  }),
  component: Results,
});

function ScoreRing({ value, verdict }: { value: number; verdict: ScanResult["verdict"] }) {
  const tone =
    verdict === "Authentic"
      ? "var(--success)"
      : verdict === "Suspicious"
        ? "var(--warning)"
        : "var(--destructive)";
  return (
    <div
      className="relative grid size-52 place-items-center rounded-full"
      style={{
        background: `conic-gradient(${tone} ${value * 3.6}deg, var(--secondary) 0deg)`,
      }}
    >
      <div className="grid size-40 place-items-center rounded-full bg-card">
        <p className="font-display text-5xl font-bold">{value}</p>
        <p className="text-xs tracking-widest text-muted-foreground uppercase">Authenticity</p>
      </div>
    </div>
  );
}

function Results() {
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => setResult(loadLatest()), []);

  function downloadReport() {
    if (!result) return;
    const lines = [
      "VOXSHIELD AI — VOICE AUTHENTICITY REPORT",
      "=========================================",
      `Report ID       : ${result.id}`,
      `Generated       : ${new Date(result.createdAt).toLocaleString()}`,
      `File            : ${result.fileName} (${result.format}, ${result.sizeKb} KB)`,
      `Duration        : ${formatDuration(result.durationSec)}`,
      "",
      `Verdict         : ${result.verdict}`,
      `Authenticity    : ${result.authenticityScore}%`,
      `Human prob.     : ${result.humanProbability}%`,
      `AI prob.        : ${result.aiProbability}%`,
      `Confidence      : ${result.confidence}%`,
      `Risk level      : ${result.risk}%`,
      "",
      "EXPLAINABLE FACTORS",
      ...result.factors.map((f) => `- ${f.label} (${f.impact}%): ${f.detail}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([lines], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `voxshield-report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!result) {
    return (
      <SiteShell>
        <Section className="pt-20">
          <GlassCard className="mx-auto max-w-lg text-center">
            <Gauge className="mx-auto size-8 text-accent" />
            <h1 className="mt-4 text-2xl font-bold">No scan results yet</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Run a scan in the Voice Scanner and your detailed report will appear here.
            </p>
            <Link
              to="/scanner"
              className="mt-6 inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Go to Scanner
            </Link>
          </GlassCard>
        </Section>
      </SiteShell>
    );
  }

  const cloned = result.verdict !== "Authentic";

  return (
    <SiteShell>
      <Section className="pt-12">
        <SectionHeading
          eyebrow={`Report ${result.id}`}
          title={
            <>
              Detection <span className="text-gradient">Results</span>
            </>
          }
          subtitle={`${result.fileName} · ${result.format} · ${formatDuration(result.durationSec)}`}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="grid place-items-center gap-6 py-10">
            <ScoreRing value={result.authenticityScore} verdict={result.verdict} />
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                cloned
                  ? "bg-destructive/15 text-destructive"
                  : "bg-success/15 text-[color:var(--success)]"
              }`}
            >
              {cloned ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
              {result.verdict}
            </span>
            <button
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              <Download className="size-4" /> Download Report
            </button>
          </GlassCard>

          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard>
                <p className="text-sm text-muted-foreground">Human Probability</p>
                <p className="mt-2 font-display text-4xl font-bold text-[color:var(--success)]">
                  {result.humanProbability}%
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-sm text-muted-foreground">AI Probability</p>
                <p className="mt-2 font-display text-4xl font-bold text-destructive">
                  {result.aiProbability}%
                </p>
              </GlassCard>
            </div>
            <GlassCard className="grid gap-5">
              <Meter label="Confidence Meter" value={result.confidence} tone="accent" />
              <Meter
                label="Risk Meter"
                value={result.risk}
                tone={result.risk > 60 ? "destructive" : result.risk > 35 ? "warning" : "success"}
              />
              <Meter label="Authenticity Score" value={result.authenticityScore} tone="primary" />
            </GlassCard>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-accent" />
            <h2 className="text-xl font-bold">Explainable AI</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {result.factors.map((f) => (
              <GlassCard key={f.label} className="glass-hover">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h3 className="min-w-0 truncate font-semibold">{f.label}</h3>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 font-mono text-xs">
                    {f.impact}%
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{f.detail}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-brand" style={{ width: `${f.impact}%` }} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
