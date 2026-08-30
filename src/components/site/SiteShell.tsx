import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/scanner", label: "Scanner" },
  { to: "/results", label: "Results" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 lg:flex lg:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <span className="truncate font-display text-lg font-bold tracking-tight">
              Vox<span className="text-gradient">Shield</span> AI
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                activeProps={{ className: "bg-secondary/80 text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/scanner"
              className="ml-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              Scan Voice
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <nav className="grid gap-1 border-t border-border px-5 py-3 lg:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                activeProps={{ className: "bg-secondary/80 text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="relative">{children}</main>

      <footer className="relative mt-24 border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold">
              Vox<span className="text-gradient">Shield</span> AI
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Detecting AI voice cloning and audio impersonation in real time. Built for Smart India
              Hackathon — Blockchain &amp; Cybersecurity.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Product</p>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/scanner">Voice Scanner</Link>
              </li>
              <li>
                <Link to="/results">Results</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/team">Team</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Status</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-success" />
              Detection engine online
            </p>
          </div>
        </div>
        <div className="border-t border-border/60 px-5 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VoxShield AI — Prototype for demonstration purposes.
        </div>
      </footer>
    </div>
  );
}
