"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/primitives/theme-toggle";
import { CopilotChatPanel } from "@/components/patterns/copilot-chat-panel/copilot-chat-panel";
import {
  LoadingState,
  LOADING_VARIANTS,
  type LoadingVariant,
} from "@/components/patterns/loading-states/loading-states";
import {
  SmartInput,
  SMART_INPUT_STATES,
  type SmartInputState,
} from "@/components/patterns/smart-input/smart-input";
import {
  transition,
  availableEvents,
  EVENT_LABEL,
  EVENT_ORIGIN,
  type ChatState,
  type ChatEvent,
  type EventOrigin,
} from "@/lib/copilot-statechart";

export default function Catalog() {
  return (
    <div className="flex-1 bg-surface-page text-ink-primary">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* Header */}
        <header className="mb-12 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-heading-sm font-medium">AI Interface Patterns</h1>
            <p className="mt-1 max-w-md text-body-sm text-ink-secondary">
              3 patrones de UI para interfaces con AI. Estados clickeables,
              monocromo, light + dark.
            </p>
            <Link
              href="/tokens"
              className="mt-2 inline-block text-body-sm text-ink-secondary underline underline-offset-4 transition-colors hover:text-ink-primary"
            >
              Ver sistema de tokens →
            </Link>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-col gap-6">
          <CopilotSection />
          <LoadingSection />
          <SmartInputSection />
        </div>

        <footer className="mt-12 border-t border-edge-subtle pt-4 text-caption-md text-ink-tertiary">
          Fase 2 — patrones con estados clickeables. Track A (estático, sin modelo).
        </footer>
      </div>
    </div>
  );
}

/* ── Patrón 1 — Copilot Chat Panel (statechart en vivo) ────────────────── */
type Machine = { state: ChatState; hasHistory: boolean };

function machineReducer(m: Machine, event: ChatEvent | "reset"): Machine {
  if (event === "reset") return { state: "empty", hasHistory: false };
  const next = transition(m.state, event, { hasHistory: m.hasHistory });
  const hasHistory = m.hasHistory || event === "send" || event === "settle";
  return { state: next, hasHistory };
}

function CopilotSection() {
  // Default lleno (idle con conversación) para que la tarjeta se vea intencional;
  // los estados de poco contenido (thinking, empty) quedan por los controles.
  const [machine, dispatch] = useReducer(machineReducer, {
    state: "idle" as ChatState,
    hasHistory: true,
  });
  const events = availableEvents(machine.state, { hasHistory: machine.hasHistory });
  const grouped = groupByOrigin(events);

  return (
    <PatternCard
      index="01"
      title="Copilot Chat Panel"
      description="7 estados gobernados por el statechart. Cada botón es una señal real (usuario · motor · automática) que pasa por transition()."
      controls={
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-caption-md text-ink-tertiary">Estado:</span>
            <code className="rounded-md bg-surface-chip px-2 py-0.5 font-mono text-caption-sm text-ink-primary">
              {machine.state}
            </code>
            <button
              onClick={() => dispatch("reset")}
              className="ml-auto rounded-md px-2 py-1 text-caption-md text-ink-secondary transition-colors hover:bg-surface-chip hover:text-ink-primary"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {(Object.keys(grouped) as EventOrigin[]).map((origin) =>
              grouped[origin].length ? (
                <div key={origin} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-16 shrink-0 text-caption-sm text-ink-tertiary">
                    {origin}
                  </span>
                  {grouped[origin].map((e) => (
                    <EventButton key={e} onClick={() => dispatch(e)}>
                      {EVENT_LABEL[e]}
                    </EventButton>
                  ))}
                </div>
              ) : null,
            )}
          </div>
        </div>
      }
    >
      <CopilotChatPanel state={machine.state} onEvent={dispatch} />
    </PatternCard>
  );
}

function groupByOrigin(events: ChatEvent[]): Record<EventOrigin, ChatEvent[]> {
  const out: Record<EventOrigin, ChatEvent[]> = {
    usuario: [],
    motor: [],
    automatica: [],
  };
  for (const e of events) out[EVENT_ORIGIN[e]].push(e);
  return out;
}

/* ── Patrón 2 — Loading States ─────────────────────────────────────────── */
function LoadingSection() {
  const [variant, setVariant] = useState<LoadingVariant>("dots");
  return (
    <PatternCard
      index="02"
      title="AI Response Loading States"
      description="4 variantes para la espera y el render en vivo de la respuesta."
      controls={
        <Segmented options={LOADING_VARIANTS} value={variant} onChange={setVariant} />
      }
    >
      <DemoFrame>
        <LoadingState variant={variant} />
      </DemoFrame>
    </PatternCard>
  );
}

/* ── Patrón 3 — Smart Input ────────────────────────────────────────────── */
function SmartInputSection() {
  const [state, setState] = useState<SmartInputState>("suggestions");
  return (
    <PatternCard
      index="03"
      title="Suggested Prompts & Smart Input"
      description="5 estados: sugeridos, recientes, escritura, selección y cambio de contexto."
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <Segmented options={SMART_INPUT_STATES} value={state} onChange={setState} />
          <button
            onClick={() => setState("disabled")}
            className={cn(
              "rounded-pill border px-3 py-1.5 text-body-sm transition-colors",
              state === "disabled"
                ? "border-transparent bg-action-primary text-ink-on-action"
                : "border-edge-default text-ink-secondary hover:text-ink-primary",
            )}
          >
            Disabled{" "}
            <span className="text-caption-sm opacity-70">· secundario</span>
          </button>
        </div>
      }
    >
      <DemoFrame>
        <SmartInput state={state} />
      </DemoFrame>
    </PatternCard>
  );
}

/* ── UI del catálogo ───────────────────────────────────────────────────── */
function PatternCard({
  index,
  title,
  description,
  controls,
  children,
}: {
  index: string;
  title: string;
  description: string;
  controls: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-edge-default bg-surface-panel">
      <div className="border-b border-edge-subtle px-5 py-4">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-caption-sm text-ink-tertiary">{index}</span>
          <h2 className="text-body-lg font-medium text-ink-primary">{title}</h2>
        </div>
        <p className="mt-1 max-w-2xl text-body-sm text-ink-secondary">{description}</p>
      </div>

      {/* Stage unificado: los 3 patrones flotan centrados sobre la misma
          superficie de preview (surface/page), con el mismo padding. */}
      <div className="flex items-center justify-center bg-surface-page px-5 py-8">
        {children}
      </div>

      {/* Controles */}
      <div className="border-t border-edge-subtle px-5 py-4">{controls}</div>
    </section>
  );
}

/**
 * Marco de demo compartido: mismo chrome que el Copilot Panel (border/superficie/
 * radio/sombra), para que los 3 patrones se lean como componentes enmarcados
 * flotando sobre el canvas. Decisión de sistema, no por tarjeta.
 */
function DemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-edge-default bg-surface-panel p-6 shadow-sm">
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-pill border border-edge-default bg-surface-panel p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-pill px-3 py-1.5 text-body-sm transition-colors",
            value === o.value
              ? "bg-action-primary text-ink-on-action"
              : "text-ink-secondary hover:text-ink-primary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EventButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-edge-default px-2.5 py-1 text-body-sm text-ink-primary transition-colors hover:bg-surface-chip"
    >
      {children}
    </button>
  );
}
