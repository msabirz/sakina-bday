import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ kicker, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center", className)}>
      {kicker && (
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">{kicker}</p>
      )}
      <h2 className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">{title}</h2>
      {description && <p className="max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">{description}</p>}
    </div>
  );
}
