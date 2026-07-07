# AI Interface Patterns — Tokens Spec (Página 1)

Dirección visual: **monocromo, minimalista, light como modo hero**. Sin color de
marca. Acciones en negro suave (light) / blanco (dark). Rojo y verde solo para
estado (error/success), desaturados. Off-white cálido, superficies blancas que
flotan, bordes mínimos, radios generosos.

Este documento es la fuente de la verdad para que Claude Code cree las Variables
en Figma vía el Desktop Bridge. Orden de ejecución: primero **Primitives**
(valores crudos), después **Semantic** (aliasan a Primitives, con 2 modos).

---

## Collection 1 — Primitives

Modo único (`Value`). Son los valores crudos. Nadie los usa directo en componentes:
solo los referencian los tokens Semantic.

### Neutral (rampa cálida)
| Variable | Tipo | Valor |
|---|---|---|
| `neutral/0` | color | #FFFFFF |
| `neutral/25` | color | #FBFAF9 |
| `neutral/50` | color | #F6F5F2 |
| `neutral/100` | color | #EEEDE9 |
| `neutral/200` | color | #E2E0DB |
| `neutral/300` | color | #D1CFC9 |
| `neutral/400` | color | #ADABA3 |
| `neutral/500` | color | #86847C |
| `neutral/600` | color | #66645C |
| `neutral/700` | color | #4A4842 |
| `neutral/800` | color | #302F2B |
| `neutral/900` | color | #1C1B18 |
| `neutral/950` | color | #121110 |
| `neutral/975` | color | #0C0C0B |
| `neutral/1000` | color | #000000 |

### Red (estado — error, desaturado)
| Variable | Tipo | Valor |
|---|---|---|
| `red/50` | color | #FBEBE9 |
| `red/300` | color | #EDA79E |
| `red/400` | color | #E0736A |
| `red/600` | color | #C0483E |
| `red/800` | color | #57201B |
| `red/950` | color | #2A0F0C |

### Green (estado — success, desaturado)
| Variable | Tipo | Valor |
|---|---|---|
| `green/400` | color | #5DA383 |
| `green/600` | color | #3C7A5B |
| `green/800` | color | #21422F |

---

## Collection 2 — Semantic

Dos modos: **Light** (hero) y **Dark**. Cada valor es un **alias** a un primitivo
(no un hex). Al cambiar de modo, solo cambia a qué primitivo apunta.

### Surface
| Variable | Light → | Dark → |
|---|---|---|
| `surface/page` | `neutral/50` | `neutral/975` |
| `surface/panel` | `neutral/0` | `neutral/900` |
| `surface/message-user` | `neutral/100` | `neutral/800` |
| `surface/message-ai` | `neutral/0` | `neutral/900` |
| `surface/input` | `neutral/50` | `neutral/800` |
| `surface/chip` | `neutral/100` | `neutral/800` |
| `surface/chip-hover` | `neutral/200` | `neutral/700` |
| `surface/loading` | `neutral/100` | `neutral/800` |
| `surface/selected` | `neutral/200` | `neutral/700` |
| `surface/error` | `red/50` | `red/950` |

> `surface/message-ai` iguala a `surface/panel`: en v1 los mensajes de la IA no
> tienen fill propio (minimalismo). El token existe para theming futuro.
>
> `surface/selected` es **un paso más prominente que `surface/chip`** (más oscuro
> en light, más claro en dark) para que el estado "seleccionado" del chip lo
> cargue el fill, con un borde `border/default` suave que solo acompaña. Antes
> aliasaba el mismo primitivo que `chip` y no se distinguía.

### Text
| Variable | Light → | Dark → |
|---|---|---|
| `text/primary` | `neutral/900` | `neutral/50` |
| `text/secondary` | `neutral/600` | `neutral/400` |
| `text/tertiary` | `neutral/400` | `neutral/600` |
| `text/placeholder` | `neutral/400` | `neutral/600` |
| `text/suggestion` | `neutral/600` | `neutral/400` |
| `text/recent` | `neutral/500` | `neutral/500` |
| `text/loading-hint` | `neutral/500` | `neutral/500` |
| `text/step-active` | `neutral/900` | `neutral/50` |
| `text/step-complete` | `neutral/500` | `neutral/500` |
| `text/error` | `red/600` | `red/400` |
| `text/success` | `green/600` | `green/400` |
| `text/on-action` | `neutral/0` | `neutral/900` |

### Interactive (acción = negro en light, blanco en dark)
| Variable | Light → | Dark → |
|---|---|---|
| `interactive/primary` | `neutral/900` | `neutral/0` |
| `interactive/primary-hover` | `neutral/1000` | `neutral/200` |
| `interactive/disabled` | `neutral/200` | `neutral/800` |
| `accent/shimmer` | `neutral/200` | `neutral/700` |

### Border
| Variable | Light → | Dark → |
|---|---|---|
| `border/subtle` | `neutral/100` | `neutral/800` |
| `border/default` | `neutral/200` | `neutral/700` |
| `border/input` | `neutral/200` | `neutral/700` |
| `border/input-focus` | `neutral/900` | `neutral/0` |
| `border/error` | `red/300` | `red/800` |

---

## Radius (Primitives, número)
| Variable | Valor |
|---|---|
| `radius/xs` | 4 |
| `radius/sm` | 8 |
| `radius/md` | 12 |
| `radius/lg` | 16 |
| `radius/xl` | 24 |
| `radius/pill` | 999 |

Uso: input y chips → `radius/md` / `radius/pill` · panel/card → `radius/lg` ·
overlay grande → `radius/xl` · botón enviar redondo → `radius/pill`.

## Spacing (Primitives, número, base 4)
| Variable | Valor |
|---|---|
| `space/1` | 4 |
| `space/2` | 8 |
| `space/3` | 12 |
| `space/4` | 16 |
| `space/5` | 20 |
| `space/6` | 24 |
| `space/8` | 32 |
| `space/10` | 40 |

Semantic de patrón: `spacing/panel-padding` → `space/5` · `spacing/message-gap`
→ `space/4` · `spacing/input-padding` → `space/3` · `spacing/chip-padding-x` →
`space/3` · `spacing/chip-padding-y` → `space/2` · `spacing/chip-gap` → `space/2`.

## Tipografía
Fuente propuesta: **Inter** (o Geist). Dos pesos: 400 regular, 500 medium.
| Variable | Size / Line / Weight |
|---|---|
| `type/heading-sm` | 14 / 1.3 / 500 |
| `type/body-lg` | 16 / 1.6 / 400 |
| `type/body-md` | 14 / 1.6 / 400 |
| `type/body-sm` | 13 / 1.5 / 400 |
| `type/caption-md` | 12 / 1.4 / 400 |
| `type/caption-sm` | 11 / 1.4 / 500 |

## Animación (número, ms)
| Variable | Valor |
|---|---|
| `animation/shimmer-duration` | 1500 |
| `animation/fade-in` | 200 |
| `animation/dot-bounce` | 1400 |

---

## Notas de ejecución para CC
1. Crear **Primitives** primero (todas las rampas + radius + spacing + animation).
2. Crear **Semantic** con 2 modos (Light, Dark) y aliasar cada variable a su
   primitivo según las dos columnas. No pegar hex en Semantic.
3. Verificar en el navegador/Figma que al togglear el modo, todo el sistema
   invierte de forma coherente (page, surface, text, action).
4. Antipatrón: hardcodear un hex en un componente. Todo sale de Semantic.
