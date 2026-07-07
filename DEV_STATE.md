# DEV_STATE — AI Interface Patterns

## Fase actual
**Fase 3 — COMPLETA (2026-07-07).** Registro en Figma cerrado: Variables +
Primitivos + 3 patrones master + página Examples (comparativo Light/Dark +
2 composiciones de uso: "Admin panel + Copilot" y "Buscador de docs · Smart Input
+ Loading") + nota de pendientes en Documentation. Falta solo acabado manual
(íconos Lucide, caret, rename del archivo) — ver checklist en página Documentation.
Archivo `zXvyuVdR7V2mLibOA7rnBC`
vía Desktop Bridge (figma-console MCP). Hecho: Variables (Primitives 38 modo único +
Semantic 31 Light/Dark) · Primitivos como componentes (Avatar, Action Button, Chip
c/ prop State+Label, Input, Loading/Dots·Skeleton·Steps) · 3 patrones como component
sets (Copilot Chat Panel — State, 7 · AI Response Loading States — Variant, 4 ·
Suggested Prompts & Smart Input — State, 5). Todo consume Variables, validado light+dark.
Nota de pendientes de acabado manual en página Documentation (checklist).
Pendiente manual: renombrar archivo a "AI Interface Patterns" (el bridge no persiste
`figma.root.name`) + acabado de íconos Lucide / caret streaming / ajustes de alto.
Aprendizajes bridge: `resize(w,h)` fuerza sizing-mode a FIXED (setear AUTO después);
NUNCA limpiar con `findAll(startsWith('State='))` — matchea variantes internas de
otros sets (borró el Copilot Panel una vez; usar `page.children` directo).

## Fase 2 (cerrada)
**IMPLEMENTADA + REFINADA (2026-07-06).**
Los 3 patrones como componentes con estados clickeables + catálogo. Compila
(build OK), rutas 200, cero hex hardcodeados. Validado con screenshots headless
en light Y dark (Chrome + playwright-core desde scratchpad).

### Refinamientos aplicados (ronda 1)
1. **Espacio muerto:** default del showcase del Copilot = `idle` con conversación
   de 2 intercambios (se ve lleno/intencional); estados de poco contenido por
   controles. 02 y 03 compactados (sin min-heights que hacían nadar el contenido).
2. **Header sin duplicado:** el Copilot header es solo "Asistente"; el estado
   thinking lo comunica únicamente la fila inline con dots (se sacó `STATUS`).
3. **Encuadre unificado:** los 3 patrones flotan en un marco de demo compartido
   (`DemoFrame` en page.tsx = mismo chrome que el panel: border-edge-default +
   surface-panel + rounded-xl + shadow-sm) sobre el canvas `surface-page`.
4. **Smart Input "smart":** se reemplazó `disabled` protagonista por
   `contextual-shift` (selector de contexto General/Código/Docs que reescribe los
   prompts en vivo). `disabled` quedó como variante secundaria (toggle aparte).
   Los 5 protagonistas: suggestions · recent · typing · selected · contextual-shift.

## Cómo correrlo
- `npm run dev` → http://localhost:3000 (catálogo de patrones, toggle light/dark).
  `/tokens` → showcase del sistema de tokens.
- `npm run build` → build de producción (Turbopack), compila OK.
- Toggle: agrega/saca `.dark` en `<html>` (componente `ThemeToggle`).

## Estructura Fase 2
- `src/lib/copilot-statechart.ts` — máquina de estados pura (transition + eventos).
- `src/components/primitives/` — `chip.tsx`, `theme-toggle.tsx`.
- `src/components/ui/` — shadcn (button, textarea, input, avatar, skeleton, ...).
- `src/components/patterns/`
  - `copilot-chat-panel/` — Patrón 1, 7 estados, cableado al statechart por `onEvent`.
  - `loading-states/` — Patrón 2, 4 variantes (dots, skeleton, streaming, steps).
  - `smart-input/` — Patrón 3, 5 estados (suggestions, recent, typing, selected, disabled).
- `src/app/page.tsx` — catálogo interactivo. `src/app/tokens/page.tsx` — tokens.

### Refinamientos aplicados (ronda 2 — Smart Input, previo a Figma)
1. Copy del subtítulo del 03: "5 estados: sugeridos, recientes, escritura,
   selección y cambio de contexto." (antes mencionaba "bloqueo", ya secundario).
2. Chip `selected` (versión final, suave): la distinción la carga el **fill**
   (`surface/selected`, ahora un paso más prominente que `chip`) + `font-medium`;
   el borde `border/default` es suave y solo acompaña. Se descartó el borde
   `border/input-focus` (negro/blanco pleno) por romper el minimalismo.
   Se **reapuntó el token** `surface/selected` en `globals.css` Y `tokens-spec.md`:
   antes aliasaba `neutral-100/800` (== `chip`); ahora `neutral-200/700` (más
   oscuro en light, más claro en dark). Validado light + dark.

## Decisión abierta (Facundo)
- Smart Input, 5 estados protagonistas: suggestions · recent · typing · selected ·
  **contextual-shift** (diferenciador smart). `disabled` = secundario.

## Flujo
Code-first: el código es la fuente de la verdad; Figma se genera desde el código
vía Desktop Bridge. Un repo, dos capas (Track A activo, Track B dormido).

## Decisiones cerradas
- **Identidad:** monocromo, minimalista. Sin color de marca. Off-white cálido de
  página, superficies blancas que flotan, bordes mínimos, radios generosos.
- **Modos:** Light (hero) + Dark. Acción = negro suave (light) / blanco (dark).
  Rojo y verde solo para estado (error/success), desaturados.
- **Se revierte:** el sistema anterior dark-only + indigo (#6366f1) queda superado.
- **Tokens:** fuente de verdad en `docs/tokens-spec.md`. Primitives constantes;
  Semantic con 2 modos aliasando a Primitives.
- **Stack real instalado:** Next.js **16.2.10** (Turbopack) + React 19 + TS +
  Tailwind v4 + shadcn (base **radix**, preset nova, icon library **lucide**) +
  Inter. npm. (Next 16 tiene breaking changes vs. training; ver `AGENTS.md` y
  `node_modules/next/dist/docs/`.)
- **Repo:** una sola base. Track A (3 patrones, estados clickeables) activo.
  Track B (motor Ollama + streaming) dormido, sin instalar sus dependencias.
- **Fuente:** **Inter** confirmada (variable font, se usan pesos 400/500).
- **Theming Tailwind v4:** `@custom-variant dark (&:where(.dark, .dark *))` +
  `@theme inline` (inlinea la var, así `.dark` invierte en runtime sin recompilar).
  Primitives en `:root` (hex constantes); Semantic en `:root` (light) y `.dark`.
- **shadcn compat:** los tokens de shadcn (`--background`, `--card`, `--primary`,
  `--border`…) están re-cableados a los primitivos monocromo, así los componentes
  de Fase 2 heredan el sistema sin retrabajo.
- **Naming utilidades (código) ↔ Figma:** `surface/*`→`bg-surface-*`,
  `text/*`→`text-ink-*`, `interactive/*`→`bg-action-*`, `border/*`→`border-edge-*`.
  Mismos VALORES; el nombre de la CSS var (`--text-primary`, etc.) = path de Figma.

## Contrato compartido
`docs/statechart-copilot-chat-panel.md` — los 7 estados del Copilot Chat Panel y
la señal que dispara cada transición. Gobierna código y Figma a la vez.

## Anti-patterns
- Reproducir el sistema viejo (dark-only, indigo).
- Hardcodear hex/valores fuera de los tokens.
- Instalar dependencias de Track B en Fase 1.
- Cerrar un componente sin probarlo en light Y dark.

## Próximo
- Fase 2: los 3 patrones como componentes con estados clickeables + showcase.
- Fase 3: registro en Figma vía bridge (variantes complejas ~70%, acabado a mano).
- Fase 4: prender Track B (engine adapter + Ollama + streaming real).

## Fuera de alcance
Buscador de propiedades (intención + re-ranking por perfil) = Fase 3 del plan
personal, vive en OTRO proyecto de Claude. No se mezcla acá.
