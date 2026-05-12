import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-foreground/65 uppercase">
          <span className="h-px w-8 bg-brand" />
          <span className="text-brand">{eyebrow}</span>
        </span>
      ) : null}
      <h2
        className="text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-[clamp(2.5rem,5vw,4rem)]"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
      >
        {title}
      </h2>
      {description ? (
        <p className="text-balance text-base leading-relaxed text-foreground/65 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
