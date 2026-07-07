# CLAUDE.md — AI Interface Patterns

Instrucciones operativas para Claude Code en este repo. El código es la fuente de
la verdad; Figma se genera *desde* el código, no al revés.

---

## ⚠ Cambio de identidad — leer primero

Si aparece cualquier referencia a un sistema **dark-only con acento indigo
(#6366f1)** o tokens `surface/page #08080b` en assets viejos (ej. `ai-patterns.jsx`):
**está superado. No reproducir.** El sistema vigente es:

- **Monocromo.** Sin color de marca.
- **Light + Dark**, con **light como modo hero**.
- Acción (botones, send) = **negro suave en light / blanco en dark**.
- Rojo y verde **solo para estado** (error/success), desaturados.
- Off-white cálido de página, superficies blancas que flotan, bordes mínimos,
  radios generosos. Tesis: descanso visual, anti-saturación.

La fuente de verdad de todos los valores es `docs/tokens-spec.md`.

---

## Qué es esto

Librería de patrones de UI para interfaces con AI. NO es un chat app ni un SaaS:
es la materia prima (componentes + estados + tokens + documentación) que se mete
adentro de productos AI-native. v1 = 3 patrones documentados como freebie.

Los 3 patrones:
1. **Copilot Chat Panel** — 7 estados (empty, idle, typing, thinking, streaming, complete, error)
2. **AI Response Loading States** — 4 variantes (dots, skeleton, streaming text, step indicator)
3. **Suggested Prompts & Smart Input** — 5 estados

El statechart del Patrón 1 (estados + señal que dispara cada transición) está en
`docs/statechart-copilot-chat-panel.md`. Es el contrato compartido entre código y Figma.

---

## Flujo de trabajo (code-first)

`Código (fuente de verdad) → Figma (registro/espejo vía Desktop Bridge)`

1. Tokens en `src/app/globals.css` desde `docs/tokens-spec.md`.
2. Los 3 patrones como componentes React/shadcn con **estados clickeables** (todavía
   sin modelo real). Validar corriendo en el navegador, en light Y dark.
3. Recién con el código sólido, replicar en Figma vía bridge: primero Variables,
   después componentes. Techo conocido: las variantes complejas quedan al ~70% y
   necesitan acabado a mano en Figma. Esperado.

---

## Un repo, dos capas

- **Track A (activo ahora):** los 3 patrones con estados clickeables. Es lo que
  valida el mercado. Todo el trabajo actual es acá.
- **Track B (dormido):** el chasis vivo — máquina de estados cableada a Ollama con
  streaming real. Comparte tokens/componentes/statechart con A. **No instalar sus
  dependencias todavía** (nada de Ollama, Vercel AI SDK, engine adapters). Se prende
  cuando A esté validado.

No mezclar el buscador de propiedades (Fase 3): vive en otro proyecto, fuera de acá.

---

## Stack

- Next.js (App Router) + TypeScript
- Tailwind **v4** (tokens vía `@theme` en `globals.css`)
- shadcn/ui
- Fuente: Inter (400 regular, 500 medium — dos pesos, coherente con el minimalismo)
- Package manager: npm
- Deploy target futuro: Vercel (no ahora)

---

## Estructura del repo

```
CLAUDE.md
DEV_STATE.md
docs/
  tokens-spec.md                      <- fuente de verdad de tokens
  statechart-copilot-chat-panel.md    <- contrato de estados
src/
  app/
    globals.css                       <- tokens (@theme + modos)
    layout.tsx
    page.tsx                          <- showcase/catálogo de los patrones
  components/
    primitives/                       <- shadcn + custom (avatar, chip, input, loading…)
    patterns/
      copilot-chat-panel/
      loading-states/
      smart-input/
  lib/                                <- (Track B dormido; vacío por ahora)
```

---

## Reglas duras

- **Tokens primero. Nunca hardcodear un color, spacing o radio.** Todo sale de los
  tokens semánticos. Si falta un token, se agrega al sistema, no se hardcodea.
- **Light y dark, ambos, siempre.** Cada componente se valida en los dos modos antes
  de darlo por cerrado. El toggle vive en el showcase.
- **Arquitectura de tokens:** Primitives constantes (no cambian por modo); Semantic
  cambia entre light/dark aliasando a Primitives. En CSS: primitivos como variables
  fijas, semánticos redefinidos bajo `:root` (light) y `.dark` (dark), y las
  utilidades de Tailwind apuntan a los semánticos. *Verificar la sintaxis vigente de
  Tailwind v4 para theming por modo antes de implementar.*
- **En error states: ícono + texto, nunca solo color.** El sistema es monocromo; el
  color no puede ser el único portador de significado (accesibilidad).
- Componentes chicos, tipados, reutilizables. Estados como props, no duplicación.
- Validar en el navegador antes de cerrar algo. No asumir que corre sin haberlo corrido.

---

## Fases de instalación (instalar por necesidad, no por anticipación)

**Fase 1 (ahora):** `create-next-app` (TS, Tailwind v4, App Router, src-dir) ->
init shadcn -> fuente Inter -> tokens en `globals.css` desde `tokens-spec.md`.
Nada más. Sin Ollama, sin AI SDK, sin engine.

**Fase 2:** los 3 patrones como componentes con estados clickeables + showcase con
toggle light/dark.

**Fase 3:** registro en Figma vía bridge.

**Fase 4 (Track B, después de validar A):** engine adapter + Ollama + streaming.

---

## Primera tarea

1. Scaffoldear el proyecto (Fase 1).
2. Implementar `globals.css` con los tokens de `docs/tokens-spec.md`: Primitives
   constantes + Semantic con light/dark.
3. Montar un showcase mínimo en `page.tsx` con un toggle de modo, para verificar que
   al cambiar light<->dark todo el sistema invierte coherente (page, surface, text,
   action, border).

Antes de escribir código, leer `docs/tokens-spec.md` completo.

---

## Anti-patterns

- Reproducir el sistema viejo (dark-only, indigo).
- Hardcodear un hex/valor fuera de los tokens.
- Instalar dependencias de Track B en esta fase.
- Que un componente hable con un modelo (todavía no hay modelo; Track A es estático).
- Dar un componente por cerrado sin probarlo en light y dark.

---

## Cómo trabajar

- Responder en **español (argentino, informal)**.
- Facundo decide lo visual y de producto; vos proponés y ejecutás.
- Ante una bifurcación de arquitectura, plantearla antes de avanzar, no asumir.
- Explicar el *porqué* de las decisiones, breve, con tradeoffs cuando importe.
- Pensar en cómo se ve en el navegador (espaciado, ritmo, estados), no solo en que
  funcione. Facundo es design-systems senior: el acabado importa.
- Mantener `DEV_STATE.md` actualizado al cerrar cada fase o tras una decisión de arquitectura.
