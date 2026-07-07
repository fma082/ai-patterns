import {
  Sparkles,
  ArrowUp,
  Square,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/primitives/chip";
import { LoadingDots } from "@/components/patterns/loading-states/loading-states";
import type { ChatState, ChatEvent } from "@/lib/copilot-statechart";

/**
 * Patrón 1 — Copilot Chat Panel.
 * Presenta los 7 estados del statechart (docs/statechart-copilot-chat-panel.md).
 * Estado como prop; los botones del panel (enviar, cancelar, reintentar, chips)
 * emiten señales vía `onEvent`, que el contenedor pasa por `transition()`.
 */

const CURRENT_Q = "¿Cómo configuro el theming por modo en Tailwind v4?";
const FULL_A =
  "Declarás un custom variant para dark y usás @theme inline: las utilidades apuntan a variables CSS que redefinís bajo :root (light) y .dark. Así el modo invierte en runtime, sin recompilar.";
const PARTIAL_A =
  "Declarás un custom variant para dark y usás @theme inline: las utilidades apuntan a variables CSS que redefinís bajo";

// Conversación de ejemplo para idle/typing: 2 intercambios, así el panel se ve
// lleno e intencional (no un contenedor vacío esperando contenido).
const CONVERSATION: { role: "user" | "ai"; content: string }[] = [
  { role: "user", content: "¿Qué stack usa este proyecto?" },
  {
    role: "ai",
    content:
      "Next.js con App Router, TypeScript, Tailwind v4 y shadcn/ui. Sistema monocromo, light + dark.",
  },
  { role: "user", content: "¿Y cómo maneja los modos claro y oscuro?" },
  {
    role: "ai",
    content:
      "Con tokens semánticos que se redefinen bajo :root y .dark. Las utilidades apuntan a variables CSS, así el modo invierte en runtime, sin recompilar.",
  },
];

const SUGGESTIONS = [
  "Explicá el statechart",
  "¿Qué son los loading states?",
  "Mostrame el smart input",
];

export function CopilotChatPanel({
  state,
  onEvent,
}: {
  state: ChatState;
  onEvent?: (event: ChatEvent) => void;
}) {
  const busy = state === "thinking" || state === "streaming";

  return (
    <div className="flex h-[540px] w-full max-w-[420px] flex-col overflow-hidden rounded-xl border border-edge-default bg-surface-panel shadow-sm">
      {/* Header — solo el nombre; el estado thinking lo comunica la fila inline */}
      <header className="flex items-center gap-2.5 border-b border-edge-subtle px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-md bg-surface-chip">
          <Sparkles size={15} className="text-ink-primary" />
        </span>
        <span className="text-body-sm font-medium text-ink-primary">Asistente</span>
      </header>

      {/* Body */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <Body state={state} onEvent={onEvent} />
      </div>

      {/* Footer / input */}
      <footer className="border-t border-edge-subtle p-3">
        <Footer state={state} busy={busy} onEvent={onEvent} />
      </footer>
    </div>
  );
}

/* ── Body por estado ───────────────────────────────────────────────────── */
function Body({
  state,
  onEvent,
}: {
  state: ChatState;
  onEvent?: (e: ChatEvent) => void;
}) {
  if (state === "empty") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center animate-fade-in">
        <span className="flex size-11 items-center justify-center rounded-lg bg-surface-chip">
          <Sparkles size={20} className="text-ink-primary" />
        </span>
        <div>
          <p className="text-body-md font-medium text-ink-primary">
            ¿En qué te ayudo?
          </p>
          <p className="mt-1 text-body-sm text-ink-secondary">
            Elegí un prompt o escribí el tuyo.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <Chip key={s} onClick={() => onEvent?.("type_text")}>
              {s}
            </Chip>
          ))}
        </div>
      </div>
    );
  }

  if (state === "idle" || state === "typing") {
    return (
      <>
        {CONVERSATION.map((m, i) =>
          m.role === "user" ? (
            <UserBubble key={i}>{m.content}</UserBubble>
          ) : (
            <AiRow key={i}>{m.content}</AiRow>
          ),
        )}
      </>
    );
  }

  // thinking / streaming / complete / error comparten la última pregunta
  return (
    <>
      <UserBubble>{CURRENT_Q}</UserBubble>
      {state === "thinking" && (
        <AiRow>
          <LoadingDots hint="Pensando…" />
        </AiRow>
      )}
      {state === "streaming" && (
        <AiRow>
          <p className="text-body-md text-ink-primary">
            {PARTIAL_A}
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-ink-primary" />
          </p>
        </AiRow>
      )}
      {state === "complete" && (
        <AiRow>
          <p className="text-body-md text-ink-primary">{FULL_A}</p>
          <MessageActions />
        </AiRow>
      )}
      {state === "error" && (
        <AiRow>
          <div className="flex items-start gap-2 rounded-lg border border-edge-error bg-surface-error px-3 py-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-ink-error" />
            <div className="flex flex-col gap-2">
              <p className="text-body-sm text-ink-error">
                Se cortó la conexión con el motor a mitad de la respuesta.
              </p>
              <button
                type="button"
                onClick={() => onEvent?.("retry")}
                className="flex w-fit items-center gap-1.5 rounded-md border border-edge-error px-2.5 py-1 text-body-sm text-ink-error transition-colors hover:bg-surface-chip"
              >
                <RotateCcw size={13} />
                Reintentar
              </button>
            </div>
          </div>
        </AiRow>
      )}
    </>
  );
}

/* ── Footer por estado ─────────────────────────────────────────────────── */
function Footer({
  state,
  busy,
  onEvent,
}: {
  state: ChatState;
  busy: boolean;
  onEvent?: (e: ChatEvent) => void;
}) {
  const draft = state === "typing" ? "¿Y para los estados de error?" : "";
  const canSend = state === "typing";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-surface-input px-3 py-2 transition-colors",
        canSend ? "border-edge-input-focus" : "border-edge-input",
        busy && "opacity-60",
      )}
    >
      <input
        readOnly
        value={draft}
        disabled={busy}
        placeholder="Escribí un mensaje…"
        className="min-w-0 flex-1 bg-transparent text-body-md text-ink-primary outline-none placeholder:text-ink-placeholder disabled:cursor-not-allowed"
      />
      {busy ? (
        <button
          type="button"
          onClick={() => onEvent?.("cancel")}
          aria-label="Cancelar"
          className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-action-primary text-ink-on-action transition-colors hover:bg-action-primary-hover"
        >
          <Square size={13} className="fill-current" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onEvent?.("send")}
          disabled={!canSend}
          aria-label="Enviar"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-pill transition-colors",
            canSend
              ? "bg-action-primary text-ink-on-action hover:bg-action-primary-hover"
              : "cursor-not-allowed bg-action-disabled text-ink-on-action",
          )}
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  );
}

/* ── Piezas ────────────────────────────────────────────────────────────── */
function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end animate-fade-in">
      <div className="max-w-[85%] rounded-lg rounded-br-sm bg-surface-message-user px-3 py-2 text-body-md text-ink-primary">
        {children}
      </div>
    </div>
  );
}

function AiRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 animate-fade-in">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-chip">
        <Sparkles size={14} className="text-ink-primary" />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function MessageActions() {
  const actions = [
    { icon: Copy, label: "Copiar" },
    { icon: RotateCcw, label: "Regenerar" },
    { icon: ThumbsUp, label: "Útil" },
    { icon: ThumbsDown, label: "No útil" },
  ];
  return (
    <div className="mt-2 flex items-center gap-1">
      {actions.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="flex size-7 items-center justify-center rounded-md text-ink-tertiary transition-colors hover:bg-surface-chip hover:text-ink-secondary"
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
