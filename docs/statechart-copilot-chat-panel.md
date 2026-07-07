# Statechart — Copilot Chat Panel

Contrato compartido entre código y Figma. En código = máquina de estados pura
(`transition(estado, evento) -> estado`). En Figma = variantes del componente master
con propiedad "State". Un solo vocabulario, dos soportes.

Las transiciones se clasifican por **origen de la señal**:
- **usuario** — el humano dispara (escribir, enviar, cancelar, reintentar)
- **motor** — el modelo emite (first-token, delta, done, error)
- **automática** — el sistema transiciona solo

---

## Los 7 estados

| # | Estado | Descripción |
|---|--------|-------------|
| 1 | `empty` | Primera vez, sin historial. Muestra prompts sugeridos. |
| 2 | `idle` | Hay historial, input disponible. (`empty` = `idle` sin historial: se deriva de `messages.length`, no se duplica.) |
| 3 | `typing` | El usuario escribió algo; botón enviar activo. |
| 4 | `thinking` | Se despachó al motor; esperando el primer token. Loading. |
| 5 | `streaming` | Llegan tokens; se renderiza en vivo token por token. |
| 6 | `complete` | Respuesta terminada (o cancelada, con parcial conservado). Aparecen acciones. |
| 7 | `error` | El motor falló (timeout o fallo a mitad de stream). Mensaje + retry. |

---

## Transiciones

| Desde | Evento (señal) | Origen | Hacia |
|-------|----------------|--------|-------|
| `empty` / `idle` | usuario escribe texto | usuario | `typing` |
| `typing` | usuario borra todo | usuario | `empty` / `idle` (según historial) |
| `typing` | enviar (despacha al motor) | usuario | `thinking` |
| `thinking` | `first-token` | motor | `streaming` |
| `streaming` | `delta` | motor | `streaming` (se mantiene) |
| `streaming` | `done` | motor | `complete` |
| `thinking` | `error` / timeout | motor | `error` |
| `streaming` | `error` (corte de stream) | motor | `error` |
| `thinking` / `streaming` | cancelar (conserva parcial) | usuario | `complete` |
| `error` | reintentar | usuario | `thinking` |
| `complete` | asienta / nuevo turno | automática | `idle` |
| `complete` | usuario escribe (follow-up) | usuario | `typing` |

---

## Notas de diseño

- **`first-token` dispara `streaming`, no un timer.** El sistema entra a streaming en
  el momento exacto en que llega el primer token real. Esto solo se tunea contra
  latencia real (Track B); en Track A (estático) se simula con un botón/estado.
- **`error` entra desde dos lugares** (`thinking` y `streaming`): el motor puede fallar
  antes de empezar (timeout) o a mitad del stream (conexión cae). Dos señales, mismo destino.
- **cancel es acción del usuario, no error.** Aborta el stream y conserva lo generado
  hasta ese punto como respuesta parcial -> `complete`. Es una transición de gobernanza
  (control del usuario sobre el motor). En Track A puede quedar diseñada pero mínima;
  cobra sentido pleno en Track B.
- En Track A (sin modelo), las transiciones del motor se disparan con controles del
  showcase (botones para saltar entre estados). En Track B, las dispara Ollama.
