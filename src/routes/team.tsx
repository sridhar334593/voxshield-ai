import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { GlassCard, Section, SectionHeading } from "@/components/site/ui-bits";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — VoxShield AI" },
      {
        name: "description",
        content:
          "Meet the VoxShield AI team building voice deepfake detection for Smart India Hackathon.",
      },
      { property: "og:title", content: "Team — VoxShield AI" },
      { property: "og:description", content: "The engineers and researchers behind VoxShield AI." },
    ],
  }),
  component: Team,
});

const team = [
  {
    name: "Sridhar R",
    role: "Team Lead & ML Engineer",
    focus: "Model architecture, spectral feature research",
  },
  { name: "Ananya Iyer", role: "Audio Signal Researcher", focus: "MFCC, jitter & prosody analysis" },
  { name: "Rahul Verma", role: "Frontend Engineer", focus: "React interface & data visualisation" },
  { name: "Meera Nair", role: "Backend Engineer", focus: "Inference APIs & report pipeline" },
  { name: "Aditya Sharma", role: "Blockchain Engineer", focus: "Tamper-evident report anchoring" },
  { name: "Priya Menon", role: "Security Analyst", focus: "Threat modelling & red-team testing" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function Team() {
  return (
    <SiteShell>
      <Section className="pt-12">
        <SectionHeading
          center
          eyebrow="Team"
          title={
            <>
              The people behind <span className="text-gradient">VoxShield</span>
            </>
          }
          subtitle="A six-member Smart India Hackathon team spanning machine learning, audio forensics, security and full-stack engineering."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <GlassCard key={m.name} className="glass-hover text-center">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand font-display text-xl font-bold text-primary-foreground">
                {initials(m.name)}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
              <p className="mt-1 text-sm text-accent">{m.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{m.focus}</p>
              <div className="mt-5 flex justify-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground">
                  <Linkedin className="size-4" />
                </span>
                <span className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground">
                  <Github className="size-4" />
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
