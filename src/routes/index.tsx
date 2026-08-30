import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AudioLines,
  BrainCircuit,
  FileBarChart,
  Fingerprint,
  Lock,
  Mic,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Eyebrow, GlassCard, Section, SectionHeading, Waveform } from "@/components/site/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoxShield AI — AI Voice Cloning & Impersonation Detection" },
      {
        name: "description",
        content:
          "VoxShield AI detects AI-cloned voices and audio impersonation in seconds with explainable forensic scoring.",
      },
      { property: "og:title", content: "VoxShield AI — Voice Cloning Detection" },
      {
        property: "og:description",
        content: "Upload or record audio and get an authenticity score with explainable AI insight.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "98.4%", label: "Detection accuracy", icon: Fingerprint },
  { value: "1.8s", label: "Average scan time", icon: Zap },
  { value: "12M+", label: "Voice samples trained", icon: AudioLines },
  { value: "24/7", label: "Real-time monitoring", icon: Activity },
];

const features = [
  {
    icon: BrainCircuit,
    title: "Deep Spectral Analysis",
    body: "A CNN-transformer hybrid inspects mel-spectrograms for vocoder fingerprints invisible to the human ear.",
  },
  {
    icon: ShieldAlert,
    title: "Impersonation Alerts",
    body: "Risk scoring flags synthetic voices attempting to mimic a trusted speaker in calls or voice notes.",
  },
  {
    icon: Sparkles,
    title: "Explainable Verdicts",
    body: "Every result ships with the exact acoustic factors that drove it — no black-box guessing.",
  },
  {
    icon: Lock,
    title: "Tamper-Proof Reports",
    body: "Each scan is hashed and chained so forensic reports can be verified later without disputes.",
  },
  {
    icon: Mic,
    title: "Record or Upload",
    body: "Drop a WAV/MP3 file or capture live audio straight from the browser microphone.",
  },
  {
    icon: FileBarChart,
    title: "Analytics Dashboard",
    body: "Track detection history, threat trends and confidence distribution across your organisation.",
  },
];

function Home() {
  return (
    <SiteShell>
      <Section className="pt-14 pb-8 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <Eyebrow>Smart India Hackathon · Cybersecurity</Eyebrow>
            <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              Is that voice <span className="text-gradient">real</span>, or an AI clone?
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              VoxShield AI analyses any voice recording for synthetic artefacts and returns an
              authenticity score, risk level and a full explainable breakdown in under two seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/scanner"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              >
                <Mic className="size-4" /> Start Voice Scan
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary/60"
              >
                How it works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-md place-items-center">
            <div className="relative grid size-56 place-items-center sm:size-72">
              <span className="absolute size-40 rounded-full border border-accent/40 animate-pulse-ring sm:size-52" />
              <span
                className="absolute size-40 rounded-full border border-primary/40 animate-pulse-ring sm:size-52"
                style={{ animationDelay: "0.9s" }}
              />
              <span
                className="absolute size-40 rounded-full border border-primary/25 animate-pulse-ring sm:size-52"
                style={{ animationDelay: "1.8s" }}
              />
              <div className="glass animate-float-slow grid size-36 place-items-center rounded-full sm:size-44">
                <span className="grid size-24 place-items-center rounded-full bg-brand text-primary-foreground shadow-[var(--shadow-glow)] sm:size-28">
                  <Mic className="size-11" />
                </span>
              </div>
            </div>
            <GlassCard className="mt-6 w-full">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Live signal preview
              </p>
              <Waveform bars={40} />
            </GlassCard>
          </div>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.label} className="glass-hover">
              <s.icon className="size-6 text-accent" />
              <p className="mt-4 font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          center
          eyebrow="Capabilities"
          title="A complete voice forensics stack"
          subtitle="From capture to court-ready report, VoxShield covers the full detection pipeline."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <GlassCard key={f.title} className="glass-hover">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary/70 text-accent">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14">
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-sweep bg-brand opacity-10" />
          <h2 className="text-3xl font-bold sm:text-4xl">
            Verify a voice before you <span className="text-gradient">trust</span> it
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Deepfake voice fraud costs organisations millions each year. Run your first scan now —
            no account required.
          </p>
          <Link
            to="/scanner"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            <Mic className="size-4" /> Launch Voice Scanner
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
