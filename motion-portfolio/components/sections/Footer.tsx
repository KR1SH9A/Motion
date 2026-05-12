import { CodeXml, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative w-full border-t border-foreground/10 bg-background py-12"
      aria-label="Footer"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-xs font-semibold tracking-tight text-brand-foreground">
            K
          </span>
          <div className="leading-tight">
            <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
              KMotion · KR1SH9A
            </p>
            <p className="text-xs text-foreground/50">
              A scroll animation playground
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-5 text-sm text-foreground/65">
          <a
            href="https://github.com/KR1SH9A/Motion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <CodeXml className="size-4" aria-hidden />
            Source
          </a>
          <a
            href="https://dotogether.purpl.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" aria-hidden />
            Projects
          </a>
          <span className="text-xs text-foreground/40">
            © {new Date().getFullYear()} KR1SH9A
          </span>
        </nav>
      </div>
    </footer>
  );
}
