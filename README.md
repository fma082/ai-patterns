# AI Interface Patterns

Librería de patrones de UI para interfaces **AI-native**. No es un chat app ni un
SaaS: es la materia prima —componentes + estados + tokens + documentación— que se
mete adentro de productos con AI.

**Identidad:** monocromo, minimalista. Sin color de marca. Off-white cálido de
página, superficies blancas que flotan, bordes mínimos, radios generosos.
**Light + Dark**, con light como modo hero. Rojo y verde solo para estado
(error/success), desaturados.

Flujo **code-first**: el código es la fuente de la verdad; Figma se genera *desde*
el código, no al revés.

---

## Los 3 patrones

| # | Patrón | Estados / variantes |
|---|--------|---------------------|
| 1 | **Copilot Chat Panel** | 7 estados: empty · idle · typing · thinking · streaming · complete · error |
| 2 | **AI Response Loading States** | 4 variantes: dots · skeleton · streaming text · step indicator |
| 3 | **Suggested Prompts & Smart Input** | 5 estados: suggestions · recent · typing · selected · contextual-shift |

Todos los estados son **clickeables** en el catálogo, validados en light y dark.

---

## Correrlo

```bash
npm install
npm run dev      # http://localhost:3000 — catálogo de patrones + toggle light/dark
```

- `/` → catálogo interactivo de los 3 patrones.
- `/tokens` → showcase del sistema de tokens.
- `npm run build` → build de producción.

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + TypeScript
- **Tailwind v4** — tokens vía `@theme` en `globals.css`
- **shadcn/ui** (base radix, icon library lucide)
- Fuente **Inter** (pesos 400 / 500)

---

## Estructura

```
docs/
  tokens-spec.md                      fuente de verdad de tokens
  statechart-copilot-chat-panel.md    contrato de estados del Patrón 1
src/
  app/
    globals.css                       tokens (@theme + modos light/dark)
    page.tsx                          catálogo de patrones
    tokens/page.tsx                   showcase de tokens
  components/
    primitives/                       chip, theme-toggle
    ui/                               shadcn (button, input, avatar, skeleton…)
    patterns/
      copilot-chat-panel/
      loading-states/
      smart-input/
  lib/
    copilot-statechart.ts             máquina de estados pura del Patrón 1
```

---

## Arquitectura de tokens

Dos capas: **Primitives** constantes (no cambian por modo) y **Semantic** que
aliasan a los primitivos y cambian entre light/dark. Nunca se hardcodea un color,
spacing o radio: todo sale de los tokens semánticos. La fuente de verdad de todos
los valores es [`docs/tokens-spec.md`](docs/tokens-spec.md).

---

## Estado

- **Track A** (activo): los 3 patrones con estados clickeables + catálogo.
- **Track B** (dormido): motor con streaming real, se prende cuando A esté validado.

Ver [`DEV_STATE.md`](DEV_STATE.md) para el detalle de fases.
