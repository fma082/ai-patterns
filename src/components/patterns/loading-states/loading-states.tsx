import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Patrón 2 — AI Response Loading States.
 * 4 variantes: dots · skeleton · streaming text · step indicator.
 * Todo sale de tokens (surface/loading, accent/shimmer, text/loading-hint,
 * text/step-active, text/step-complete). Animaciones definidas en globals.css.
 */

export type LoadingVariant = "dots" | "skeleton" | "streaming" | "steps";

export const LOADING_VARIANTS: { value: LoadingVariant; label: string }[] = [
  { value: "dots", label: "Dots" },
  { value: "skeleton", label: "Skeleton" },
  { value: "streaming", label: "Streaming text" },
  { value: "steps", label: "Step indicator" },
];

/* ── Dots ──────────────────────────────────────────────────────────────── */
export function LoadingDots({ hint }: { hint?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-dot-bounce rounded-full bg-ink-loading-hint"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      {hint && <span className="text-body-sm text-ink-loading-hint">{hint}</span>}
    </div>
  );
}

/* ── Skeleton (con shimmer) ────────────────────────────────────────────── */
export function LoadingSkeleton({
  lines = ["100%", "92%", "60%"],
}: {
  lines?: string[];
}) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {lines.map((w, i) => (
        <div
          key={i}
          className="relative h-3 overflow-hidden rounded-sm bg-surface-loading"
          style={{ width: w }}
        >
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, var(--accent-shimmer) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Streaming text (con caret) ────────────────────────────────────────── */
export function StreamingText({
  text = "Claro — para configurar el entorno primero instalás las dependencias y después",
}: {
  text?: string;
}) {
  return (
    <p className="text-body-md text-ink-primary">
      {text}
      <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-ink-primary" />
    </p>
  );
}

/* ── Step indicator ────────────────────────────────────────────────────── */
export type Step = { label: string; status: "complete" | "active" | "pending" };

const DEFAULT_STEPS: Step[] = [
  { label: "Analizando la consulta", status: "complete" },
  { label: "Buscando en la documentación", status: "active" },
  { label: "Redactando la respuesta", status: "pending" },
];

export function StepIndicator({ steps = DEFAULT_STEPS }: { steps?: Step[] }) {
  return (
    <ol className="flex flex-col gap-2.5">
      {steps.map((step, i) => (
        <li key={i} className="flex items-center gap-2.5">
          <StepIcon status={step.status} />
          <span
            className={cn(
              "text-body-sm",
              step.status === "active" && "font-medium text-ink-step-active",
              step.status === "complete" && "text-ink-step-complete",
              step.status === "pending" && "text-ink-tertiary",
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StepIcon({ status }: { status: Step["status"] }) {
  if (status === "complete") {
    return <Check size={15} className="shrink-0 text-ink-step-complete" />;
  }
  if (status === "active") {
    return (
      <Loader2 size={15} className="shrink-0 animate-spin text-ink-step-active" />
    );
  }
  return (
    <span className="size-[15px] shrink-0 rounded-full border border-edge-default" />
  );
}

/* ── Wrapper por variante (para el catálogo) ───────────────────────────── */
export function LoadingState({ variant }: { variant: LoadingVariant }) {
  switch (variant) {
    case "dots":
      return <LoadingDots hint="Pensando…" />;
    case "skeleton":
      return <LoadingSkeleton />;
    case "streaming":
      return <StreamingText />;
    case "steps":
      return <StepIndicator />;
  }
}
