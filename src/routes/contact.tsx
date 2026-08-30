import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { GlassCard, Section, SectionHeading } from "@/components/site/ui-bits";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — VoxShield AI" },
      {
        name: "description",
        content:
          "Get in touch with the VoxShield AI team about pilots, demos or voice deepfake incidents.",
      },
      { property: "og:title", content: "Contact — VoxShield AI" },
      { property: "og:description", content: "Reach the VoxShield AI team." },
    ],
  }),
  component: Contact,
});

const channels = [
  { icon: Mail, label: "Email", value: "team@voxshield.ai" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Location", value: "Chennai, Tamil Nadu, India" },
  { icon: MessageSquare, label: "Response time", value: "Within 24 hours" },
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <Section className="pt-12">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Talk to the <span className="text-gradient">VoxShield</span> team
            </>
          }
          subtitle="Pilot programmes, integration questions or an active impersonation incident — we respond fast."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <GlassCard>
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="text-muted-foreground">Full name</span>
                  <input
                    required
                    className="rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-accent"
                    placeholder="Your name"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <input
                    required
                    type="email"
                    className="rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-accent"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">Subject</span>
                <input
                  className="rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-accent"
                  placeholder="Pilot request, demo, incident…"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">Message</span>
                <textarea
                  required
                  rows={6}
                  className="rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-accent"
                  placeholder="Tell us what you need…"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              >
                <Send className="size-4" /> Send message
              </button>
              {sent && (
                <p className="text-sm text-[color:var(--success)]">
                  Thanks — your message has been queued. We'll be in touch shortly.
                </p>
              )}
            </form>
          </GlassCard>

          <div className="grid content-start gap-4">
            {channels.map((c) => (
              <GlassCard key={c.label} className="glass-hover">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary/70 text-accent">
                    <c.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                      {c.label}
                    </p>
                    <p className="truncate text-sm font-medium">{c.value}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
