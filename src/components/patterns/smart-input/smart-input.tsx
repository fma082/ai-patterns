"use client";

import { useState } from "react";
import { ArrowUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/primitives/chip";

/**
 * Patrón 3 — Suggested Prompts & Smart Input.
 * 5 estados protagonistas (estado como prop, sin modelo real):
 *   suggestions       — vacío con prompts sugeridos (chips).
 *   recent            — enfocado y vacío: muestra búsquedas recientes.
 *   typing            — el usuario escribió; enviar activo, chips ocultos.
 *   selected          — un prompt sugerido queda seleccionado.
 *   contextual-shift  — los prompts cambian según el contexto activo. Es el
 *                       diferenciador "smart": un selector de contexto reescribe
 *                       las sugerencias en vivo.
 * `disabled` queda como variante secundaria (input bloqueado mientras responde
 * el motor), no como uno de los 5 protagonistas.
 */

export type SmartInputState =
  | "suggestions"
  | "recent"
  | "typing"
  | "selected"
  | "contextual-shift"
  | "disabled";

export const SMART_INPUT_STATES: { value: SmartInputState; label: string }[] = [
  { value: "suggestions", label: "Suggestions" },
  { value: "recent", label: "Recent" },
  { value: "typing", label: "Typing" },
  { value: "selected", label: "Selected" },
  { value: "contextual-shift", label: "Contextual shift" },
];

const SUGGESTIONS = [
  "Resumí este documento",
  "Escribí un test para esta función",
  "Explicá el error del build",
];

const RECENT = [
  "cómo configurar Tailwind v4",
  "diferencia entre thinking y streaming",
];

// El contexto activo reescribe los prompts sugeridos: eso es lo "smart".
const CONTEXTS: { id: string; label: string; prompts: string[] }[] = [
  {
    id: "general",
    label: "General",
    prompts: ["Resumí esto", "Traducí al inglés", "Hacé una lista de acciones"],
  },
  {
    id: "code",
    label: "Código",
    prompts: ["Explicá este error", "Escribí un test", "Refactorizá la función"],
  },
  {
    id: "docs",
    label: "Docs",
    prompts: ["Buscá en la doc", "¿Cómo configuro esto?", "Dame un ejemplo"],
  },
];

export function SmartInput({ state }: { state: SmartInputState }) {
  const [contextId, setContextId] = useState(CONTEXTS[0].id);

  const disabled = state === "disabled";
  const focused =
    state === "typing" || state === "recent" || state === "selected";
  const value =
    state === "typing"
      ? "Explicá el error del build"
      : state === "selected"
        ? "Escribí un test para esta función"
        : "";
  const canSend = value.length > 0 && !disabled;
  const activeContext =
    CONTEXTS.find((c) => c.id === contextId) ?? CONTEXTS[0];

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {/* Zona superior según estado */}
      {(state === "suggestions" || state === "selected") && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Chip key={s} selected={state === "selected" && s === value}>
              {s}
            </Chip>
          ))}
        </div>
      )}

      {state === "recent" && (
        <ul className="flex flex-col gap-1">
          {RECENT.map((r) => (
            <li key={r}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-body-sm text-ink-recent transition-colors hover:bg-surface-chip"
              >
                <Clock size={14} className="shrink-0 text-ink-tertiary" />
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}

      {state === "contextual-shift" && (
        <div className="flex flex-col gap-2.5">
          {/* Selector de contexto */}
          <div className="flex items-center gap-2">
            <span className="text-caption-md text-ink-tertiary">Contexto</span>
            <div className="inline-flex gap-1 rounded-pill border border-edge-default p-1">
              {CONTEXTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContextId(c.id)}
                  className={cn(
                    "rounded-pill px-2.5 py-1 text-body-sm transition-colors",
                    c.id === contextId
                      ? "bg-action-primary text-ink-on-action"
                      : "text-ink-secondary hover:text-ink-primary",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {/* Prompts que cambian con el contexto */}
          <div key={activeContext.id} className="flex flex-wrap gap-2 animate-fade-in">
            {activeContext.prompts.map((p) => (
              <Chip key={p}>{p}</Chip>
            ))}
          </div>
        </div>
      )}

      {/* Input + enviar */}
      <div
        className={cn(
          "flex items-end gap-2 rounded-md border bg-surface-input p-3 transition-colors",
          focused ? "border-edge-input-focus" : "border-edge-input",
          disabled && "opacity-60",
        )}
      >
        <input
          readOnly
          value={value}
          disabled={disabled}
          placeholder={
            disabled ? "Esperando la respuesta…" : "Preguntá lo que necesites…"
          }
          className="min-w-0 flex-1 bg-transparent text-body-md text-ink-primary outline-none placeholder:text-ink-placeholder disabled:cursor-not-allowed"
        />
        <button
          type="button"
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
      </div>
    </div>
  );
}
