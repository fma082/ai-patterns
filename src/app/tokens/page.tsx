import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/primitives/theme-toggle";

/**
 * Showcase de verificación de tokens.
 * Confirma que al togglear .dark, todo el sistema invierte coherente
 * (page, surface, text, action, border, estados).
 */
export default function TokensPage() {
  return (
    <div className="flex-1 bg-surface-page text-ink-primary">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-1 text-body-sm text-ink-secondary transition-colors hover:text-ink-primary"
            >
              <ArrowLeft size={14} /> Catálogo
            </Link>
            <h1 className="text-heading-sm font-medium">Tokens</h1>
            <p className="mt-1 text-body-sm text-ink-secondary">
              Verificación del sistema · monocromo · light + dark
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-col gap-8">
          <Section title="Surfaces" hint="page vs. panel que flota">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-edge-subtle bg-surface-page p-5">
                <Label>surface/page</Label>
                <p className="text-body-sm text-ink-secondary">Off-white cálido de fondo.</p>
              </div>
              <div className="rounded-lg border border-edge-default bg-surface-panel p-5 shadow-sm">
                <Label>surface/panel</Label>
                <p className="text-body-sm text-ink-secondary">Superficie blanca que flota.</p>
              </div>
            </div>
          </Section>

          <Section title="Text" hint="jerarquía de contenido">
            <div className="rounded-lg border border-edge-default bg-surface-panel p-5">
              <p className="text-body-lg text-ink-primary">
                Primary — el texto principal, máximo contraste.
              </p>
              <p className="mt-2 text-body-md text-ink-secondary">
                Secondary — descripciones y apoyo.
              </p>
              <p className="mt-2 text-body-sm text-ink-tertiary">
                Tertiary — metadatos, timestamps, lo más tenue.
              </p>
            </div>
          </Section>

          <Section title="Action" hint="negro suave en light · blanco en dark">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-edge-default bg-surface-panel p-5">
              <button className="rounded-pill bg-action-primary px-4 py-2 text-body-sm text-ink-on-action transition-colors hover:bg-action-primary-hover">
                Enviar
              </button>
              <button
                disabled
                className="cursor-not-allowed rounded-pill bg-action-disabled px-4 py-2 text-body-sm text-ink-on-action opacity-70"
              >
                Deshabilitado
              </button>
              <span className="text-body-sm text-ink-tertiary">
                La acción invierte con el modo, no usa color de marca.
              </span>
            </div>
          </Section>

          <Section title="Border" hint="bordes mínimos, radios generosos">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-edge-subtle bg-surface-panel p-4 text-center text-body-sm text-ink-secondary">
                edge/subtle
              </div>
              <div className="rounded-lg border border-edge-default bg-surface-panel p-4 text-center text-body-sm text-ink-secondary">
                edge/default
              </div>
              <div className="rounded-lg border-2 border-edge-input-focus bg-surface-panel p-4 text-center text-body-sm text-ink-secondary">
                edge/input-focus
              </div>
            </div>
          </Section>

          <Section title="Estados" hint="ícono + texto, nunca solo color">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-edge-error bg-surface-error px-4 py-3">
                <AlertCircle size={16} className="shrink-0 text-ink-error" />
                <p className="text-body-sm text-ink-error">
                  Error — el motor no respondió. Reintentá.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-edge-default bg-surface-panel px-4 py-3">
                <CheckCircle2 size={16} className="shrink-0 text-ink-success" />
                <p className="text-body-sm text-ink-success">
                  Success — la respuesta se generó completa.
                </p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-body-md font-medium text-ink-primary">{title}</h2>
        <span className="text-caption-md text-ink-tertiary">{hint}</span>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block font-mono text-caption-sm text-ink-tertiary">
      {children}
    </span>
  );
}
