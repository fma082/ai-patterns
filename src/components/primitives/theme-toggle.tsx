"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Toggle light/dark: agrega o saca la clase `.dark` en <html>.
 * Se sincroniza con el estado real del documento al montar, así navegar entre
 * el catálogo y /tokens no desincroniza el modo.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar modo claro/oscuro"
      className="flex items-center gap-2 rounded-pill border border-edge-default bg-surface-panel px-3 py-2 text-body-sm text-ink-primary transition-colors hover:bg-surface-chip"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}
