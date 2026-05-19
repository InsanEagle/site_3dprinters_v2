import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  "data-testid"?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover border border-accent hover:border-accent-hover",
  secondary: "bg-white text-ink border border-gray-300 hover:bg-surface",
  ghost: "bg-transparent text-ink border border-line hover:bg-surface"
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles} data-testid={props["data-testid"]}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
