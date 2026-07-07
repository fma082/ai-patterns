import { cn } from "@/lib/utils";

/**
 * Chip — prompt sugerido / opción seleccionable.
 * Tokens: surface/chip, surface/chip-hover, surface/selected, text/suggestion.
 * Padding spec: x = space/3, y = space/2. Radio: pill.
 */
export function Chip({
  children,
  selected = false,
  className,
  ...props
}: React.ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      data-selected={selected || undefined}
      className={cn(
        // borde en base (transparente si no está seleccionado) para evitar salto de layout
        "rounded-pill border px-3 py-2 text-body-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-edge-input-focus",
        selected
          ? // seleccionado en monocromo: la distinción la carga el fill
            // (surface/selected, más prominente que chip) + peso medium; el
            // borde default es suave y solo acompaña, no grita.
            "border-edge-default bg-surface-selected font-medium text-ink-primary"
          : "border-transparent bg-surface-chip text-ink-suggestion hover:bg-surface-chip-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
