import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-5 py-16 sm:py-20", className)}>
      {children}
    </section>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Meter({
  label,
  value,
  tone = "primary",
  suffix = "%",
}: {
  label: string;
  value: number;
  tone?: "primary" | "accent" | "success" | "warning" | "destructive";
  suffix?: string;
}) {
  const toneClass = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  }[tone];

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
        <span className="min-w-0 truncate text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold">
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", toneClass)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export function Waveform({ bars = 48, active = true }: { bars?: number; active?: boolean }) {
  return (
    <div className="flex h-24 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] origin-center rounded-full bg-brand",
            active ? "animate-bar" : "opacity-40",
          )}
          style={{
            height: `${18 + Math.abs(Math.sin(i * 1.7)) * 70}%`,
            animationDelay: `${(i % 12) * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}
