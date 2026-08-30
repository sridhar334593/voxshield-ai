import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SiteShell } from "@/components/site/SiteShell";
import { GlassCard, Section, SectionHeading } from "@/components/site/ui-bits";
import { loadHistory, type ScanResult } from "@/lib/voxshield";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Detection Dashboard — VoxShield AI" },
      {
        name: "description",
        content:
          "Track voice detection history, threat trends, confidence analytics and recent forensic reports.",
      },
      { property: "og:title", content: "Detection Dashboard — VoxShield AI" },
      {
        property: "og:description",
        content: "Analytics and history for every VoxShield voice scan.",
      },
    ],
  }),
  component: Dashboard,
});

const trend = [
  { day: "Mon", scans: 18, cloned: 4 },
  { day: "Tue", scans: 26, cloned: 7 },
  { day: "Wed", scans: 21, cloned: 5 },
  { day: "Thu", scans: 34, cloned: 12 },
  { day: "Fri", scans: 42, cloned: 15 },
  { day: "Sat", scans: 29, cloned: 9 },
  { day: "Sun", scans: 37, cloned: 11 },
];

const sources = [
  { name: "Phone calls", value: 42 },
  { name: "Voice notes", value: 28 },
  { name: "Video audio", value: 19 },
  { name: "Broadcast", value: 11 },
];

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--foreground)",
};

function Dashboard() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  useEffect(() => setHistory(loadHistory()), []);

  const total = history.length;
  const flagged = history.filter((h) => h.verdict !== "Authentic").length;
  const avgConfidence = total
    ? Math.round(history.reduce((a, h) => a + h.confidence, 0) / total)
    : 0;
  const avgAuth = total
    ? Math.round(history.reduce((a, h) => a + h.authenticityScore, 0) / total)
    : 0;

  const cards = [
    { label: "Total scans", value: total, icon: Activity },
    { label: "Threats flagged", value: flagged, icon: AlertTriangle },
    { label: "Avg. confidence", value: `${avgConfidence}%`, icon: TrendingUp },
    { label: "Avg. authenticity", value: `${avgAuth}%`, icon: ShieldCheck },
  ];

  return (
    <SiteShell>
      <Section className="pt-12">
        <SectionHeading
          eyebrow="Operations"
          title={
            <>
              Detection <span className="text-gradient">Dashboard</span>
            </>
          }
          subtitle="Monitor scan volume, cloned-voice detections and reporting activity at a glance."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <GlassCard key={c.label} className="glass-hover">
              <c.icon className="size-5 text-accent" />
              <p className="mt-4 font-display text-3xl font-bold">{c.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <GlassCard>
            <p className="font-semibold">Weekly scan activity</p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    stroke="var(--chart-1)"
                    fill="url(#g1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <p className="font-semibold">Audio source mix</p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sources} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {sources.map((s, i) => (
                      <Cell key={s.name} fill={pieColors[i]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {sources.map((s, i) => (
                <span key={s.name} className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: pieColors[i] }}
                  />
                  {s.name}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="mt-6">
          <p className="font-semibold">Cloned voices detected per day</p>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="cloned" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <p className="font-semibold">Detection history</p>
            {history.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No scans recorded yet.{" "}
                <Link to="/scanner" className="text-accent">
                  Run your first scan
                </Link>
                .
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {history.slice(0, 6).map((h) => (
                  <div
                    key={h.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{h.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        h.verdict === "Authentic"
                          ? "bg-success/15 text-[color:var(--success)]"
                          : h.verdict === "Suspicious"
                            ? "bg-warning/15 text-[color:var(--warning)]"
                            : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {h.verdict}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <p className="font-semibold">Recent reports</p>
            <div className="mt-4 grid gap-3">
              {(history.length ? history.slice(0, 5) : []).map((h) => (
                <div
                  key={h.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <FileText className="size-4 shrink-0 text-accent" />
                  <p className="min-w-0 truncate font-mono text-xs">{h.id}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {h.authenticityScore}% auth
                  </span>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Reports generated from scans will be listed here.
                </p>
              )}
            </div>
          </GlassCard>
        </div>
      </Section>
    </SiteShell>
  );
}
