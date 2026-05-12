import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BaseProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type GradientButtonProps = AnchorProps | ButtonProps;

const baseClasses =
  "group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2";

const primaryClasses =
  "bg-foreground text-background shadow-premium hover:translate-y-[-1px] hover:shadow-premium-lg";

const secondaryClasses =
  "border border-foreground/15 bg-background/90 text-foreground backdrop-blur-md hover:bg-foreground/[0.04]";

export function GradientButton(props: GradientButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const merged = cn(
    baseClasses,
    variant === "primary" ? primaryClasses : secondaryClasses,
    className,
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={merged} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={merged} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
