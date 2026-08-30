import { createFileRoute } from "@tanstack/react-router";
import { AudioWaveform, Banknote, Brain, PhoneCall, ScanLine, ShieldCheck, Vote } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { GlassCard, Section, SectionHeading } from "@/components/site/ui-bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AI Voice Cloning — VoxShield AI" },
      {
        name: "description",
        content:
          "What AI voice cloning is, why it is dangerous, and how VoxShield AI detects synthetic speech with explainable forensics.",
      },
      { property: "og:title", content: "About — VoxShield AI" },
      {
        property: "og:description",
        content: "Understand voice deepfakes and the VoxShield detection pipeline.",
      },
    ],
  }),
  component: About,
});

const dangers = [
  {
    icon: Banknote,
    title: "CEO fraud & wire transfers",
    body: "Attackers clone an executive's voice from a 30-second clip and authorise fraudulent payments over the phone.",
  },
  {
    icon: PhoneCall,
    title: "Family emergency scams",
    body: "A cloned relative's voice pleads for urgent money, bypassing the victim's natural scepticism.",
  },
  {
    icon: Vote,
    title: "Disinformation",
    body: "Fake audio of public figures spreads on social media faster than any fact-check can follow.",
  },
  {
    icon: ShieldCheck,
    title: "Biometric bypass",
    body: "Voice-authentication systems in banking and telecom can be defeated by high-fidelity synthesis.",
  },
];

const pipeline = [
  {
    icon: AudioWaveform,
    step: "01",
    title: "Capture & normalise",
    body: "Audio is resampled, denoised and segmented into overlapping frames for consistent feature extraction.",
  },
  {
    icon: ScanLine,
    step: "02",
    title: "Feature extraction",
    body: "Mel-spectrograms, MFCCs, jitter, shimmer, formant drift and noise-floor continuity are computed.",
  },
  {
    icon: Brain,
    step: "03",
    title: "Neural classification",
    body: "A CNN-transformer ensemble scores each frame for vocoder and diffusion synthesis fingerprints.",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Explainable verdict",
    body: "Frame scores are aggregated into an authenticity score, risk level and per-factor attribution report.",
  },
];

function About() {
  return (
    <SiteShell>
      <Section className="pt-12">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              The rise of <span className="text-gradient">synthetic voices</span>
            </>
          }
          subtitle="Modern text-to-speech and voice-conversion models can reproduce a person's voice from just a few seconds of reference audio — accurately enough to fool family, colleagues and biometric systems."
        />

        <GlassCard className="mt-10">
          <h2 className="text-xl font-bold">What is AI voice cloning?</h2>
          <p className="mt-3 text-muted-foreground">
            Voice cloning uses generative models to learn a speaker's timbre, accent, pacing and
            emotional colouring, then synthesises entirely new sentences in that voice. The output
            is not a recording of anything the person ever said. Because the models are freely
            available and need only a short sample scraped from a video, voicemail or podcast, the
            barrier to impersonation has effectively collapsed.
          </p>
        </GlassCard>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {dangers.map((d) => (
            <GlassCard key={d.title} className="glass-hover">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary/70 text-accent">
                <d.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading
          eyebrow="How it works"
          title="The VoxShield detection pipeline"
          subtitle="Four stages turn raw audio into a defensible verdict."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((p) => (
            <GlassCard key={p.step} className="glass-hover">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <p.icon className="size-5" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">{p.step}</span>
              </div>
              <h3 className="mt-5 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-8">
          <h3 className="text-lg font-semibold">Tamper-evident reporting</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Every report is hashed and anchored to an append-only ledger, so an investigator can
            prove a verdict was produced at a specific time and has not been altered since. That
            matters when audio evidence enters a dispute, an insurance claim or a courtroom.
          </p>
        </GlassCard>
      </Section>
    </SiteShell>
  );
}
