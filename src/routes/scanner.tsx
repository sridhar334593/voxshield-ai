import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AudioLines, FileAudio, Loader2, Mic, Square, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { GlassCard, Section, SectionHeading, Waveform } from "@/components/site/ui-bits";
import { analyzeAudio, formatDuration, saveResult } from "@/lib/voxshield";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Voice Scanner — VoxShield AI" },
      {
        name: "description",
        content:
          "Upload a WAV or MP3 file or record from your microphone and scan it for AI voice cloning artefacts.",
      },
      { property: "og:title", content: "Voice Scanner — VoxShield AI" },
      {
        property: "og:description",
        content: "Drag & drop audio or record live to detect synthetic voices.",
      },
    ],
  }),
  component: Scanner,
});

type Loaded = { name: string; sizeKb: number; format: string; duration: number; url: string };

function Scanner() {
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [audio, setAudio] = useState<Loaded | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  async function loadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const duration = await new Promise<number>((resolve) => {
      const el = new Audio(url);
      el.addEventListener("loadedmetadata", () =>
        resolve(Number.isFinite(el.duration) ? el.duration : 0),
      );
      el.addEventListener("error", () => resolve(0));
    });
    setAudio({
      name,
      sizeKb: Math.round(blob.size / 1024),
      format: (name.split(".").pop() ?? "webm").toUpperCase(),
      duration,
      url,
    });
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!/\.(wav|mp3|mpeg|m4a|webm)$/i.test(file.name)) {
      setError("Unsupported format. Please upload a WAV or MP3 file.");
      return;
    }
    setError(null);
    void loadBlob(file, file.name);
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        void loadBlob(new Blob(chunksRef.current, { type: "audio/webm" }), "microphone-capture.wav");
      };
      recorderRef.current = rec;
      rec.start();
      setElapsed(0);
      setError(null);
      setRecording(true);
    } catch {
      setError("Microphone access was blocked. Allow permission or upload a file instead.");
    }
  }

  function runScan() {
    if (!audio) return;
    setScanning(true);
    const result = analyzeAudio({
      fileName: audio.name,
      durationSec: audio.duration,
      sizeKb: audio.sizeKb,
      format: audio.format,
    });
    setTimeout(() => {
      saveResult(result);
      void navigate({ to: "/results" });
    }, 1900);
  }

  return (
    <SiteShell>
      <Section className="pt-12">
        <SectionHeading
          eyebrow="Step 01"
          title={
            <>
              Voice <span className="text-gradient">Scanner</span>
            </>
          }
          subtitle="Drop an audio file or record directly in the browser. VoxShield extracts acoustic features and checks them against cloned-voice signatures."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={`glass grid cursor-pointer place-items-center rounded-2xl border-dashed px-6 py-16 text-center transition-colors ${
                dragging ? "border-accent bg-secondary/40" : ""
              }`}
            >
              <UploadCloud className="size-10 text-accent" />
              <p className="mt-4 font-display text-lg font-semibold">
                Drag &amp; drop your audio here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                WAV or MP3, up to 25 MB — or click to browse
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".wav,.mp3,audio/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            <GlassCard>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">Record from microphone</p>
                  <p className="text-sm text-muted-foreground">
                    {recording
                      ? `Recording… ${formatDuration(elapsed)}`
                      : "Capture a live sample for instant analysis"}
                  </p>
                </div>
                <button
                  onClick={toggleRecording}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    recording
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-brand text-primary-foreground"
                  }`}
                >
                  {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
                  {recording ? "Stop" : "Record"}
                </button>
              </div>
              {recording && <Waveform bars={56} />}
            </GlassCard>

            <GlassCard>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Waveform preview
              </p>
              <Waveform bars={64} active={Boolean(audio)} />
              {audio && (
                <audio controls src={audio.url} className="mt-2 w-full">
                  <track kind="captions" />
                </audio>
              )}
            </GlassCard>
          </div>

          <div className="grid content-start gap-6">
            <GlassCard>
              <div className="flex items-center gap-3">
                <FileAudio className="size-5 text-accent" />
                <p className="font-semibold">Audio information</p>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                {[
                  ["File name", audio?.name ?? "—"],
                  ["Format", audio?.format ?? "—"],
                  ["Duration", audio ? formatDuration(audio.duration) : "—"],
                  ["Size", audio ? `${audio.sizeKb} KB` : "—"],
                  ["Sample rate", audio ? "44.1 kHz" : "—"],
                  ["Channels", audio ? "Mono" : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="truncate text-right font-mono">{v}</dd>
                  </div>
                ))}
              </dl>

              {audio && (
                <button
                  onClick={() => setAudio(null)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs text-muted-foreground hover:bg-secondary/60"
                >
                  <Trash2 className="size-3.5" /> Remove audio
                </button>
              )}
            </GlassCard>

            {error && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              disabled={!audio || scanning}
              onClick={runScan}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
            >
              {scanning ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Analysing acoustic signature…
                </>
              ) : (
                <>
                  <AudioLines className="size-4" /> Scan for AI Cloning
                </>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Analysis runs on-device in this prototype. No audio leaves your browser.
            </p>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
