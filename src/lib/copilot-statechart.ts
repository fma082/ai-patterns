/**
 * Statechart — Copilot Chat Panel (máquina de estados pura).
 * Contrato: docs/statechart-copilot-chat-panel.md
 *
 * Es una función pura `transition(state, event, ctx) -> state`. No conoce React
 * ni Ollama. En Track A la disparan botones del showcase; en Track B, el motor.
 *
 * `empty` no se duplica: es `idle` sin historial. Se deriva de `ctx.hasHistory`
 * en las transiciones que vuelven a "listo para escribir".
 */

export type ChatState =
  | "empty"
  | "idle"
  | "typing"
  | "thinking"
  | "streaming"
  | "complete"
  | "error";

/** Señales que disparan transiciones, agrupadas por origen. */
export type ChatEvent =
  // usuario
  | "type_text"
  | "clear_text"
  | "send"
  | "cancel"
  | "retry"
  // motor
  | "first_token"
  | "delta"
  | "done"
  | "engine_error"
  // automática
  | "settle";

export type EventOrigin = "usuario" | "motor" | "automatica";

export const EVENT_ORIGIN: Record<ChatEvent, EventOrigin> = {
  type_text: "usuario",
  clear_text: "usuario",
  send: "usuario",
  cancel: "usuario",
  retry: "usuario",
  first_token: "motor",
  delta: "motor",
  done: "motor",
  engine_error: "motor",
  settle: "automatica",
};

/** Etiqueta legible de cada señal (para el showcase). */
export const EVENT_LABEL: Record<ChatEvent, string> = {
  type_text: "escribir",
  clear_text: "borrar todo",
  send: "enviar",
  cancel: "cancelar",
  retry: "reintentar",
  first_token: "first-token",
  delta: "delta",
  done: "done",
  engine_error: "error",
  settle: "asentar / nuevo turno",
};

export interface ChatContext {
  /** Hay mensajes en el historial. Distingue `empty` de `idle`. */
  hasHistory: boolean;
}

const DEFAULT_CTX: ChatContext = { hasHistory: false };

/**
 * Transición pura. Si la señal no aplica al estado actual, devuelve el estado
 * sin cambios (transición no-op), como una máquina de estados bien portada.
 */
export function transition(
  state: ChatState,
  event: ChatEvent,
  ctx: ChatContext = DEFAULT_CTX,
): ChatState {
  switch (state) {
    case "empty":
    case "idle":
      if (event === "type_text") return "typing";
      return state;

    case "typing":
      if (event === "clear_text") return ctx.hasHistory ? "idle" : "empty";
      if (event === "send") return "thinking";
      return state;

    case "thinking":
      if (event === "first_token") return "streaming";
      if (event === "engine_error") return "error";
      if (event === "cancel") return "complete"; // conserva parcial (vacío aún)
      return state;

    case "streaming":
      if (event === "delta") return "streaming"; // se mantiene
      if (event === "done") return "complete";
      if (event === "engine_error") return "error"; // corte de stream
      if (event === "cancel") return "complete"; // conserva parcial
      return state;

    case "complete":
      if (event === "settle") return "idle";
      if (event === "type_text") return "typing"; // follow-up
      return state;

    case "error":
      if (event === "retry") return "thinking";
      return state;

    default:
      return state;
  }
}

/** Señales que producen un cambio real de estado desde `state`. */
export function availableEvents(
  state: ChatState,
  ctx: ChatContext = DEFAULT_CTX,
): ChatEvent[] {
  const all = Object.keys(EVENT_ORIGIN) as ChatEvent[];
  return all.filter((e) => transition(state, e, ctx) !== state);
}
