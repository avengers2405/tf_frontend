import { cn } from "@/lib/utils"

interface SkillBadgeProps {
  skill: string
  variant?: "default" | "matched" | "missing"
  className?: string
}

export function SkillBadge({ skill, variant = "default", className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        {
          "bg-secondary text-secondary-foreground": variant === "default",
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400": variant === "matched",
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400": variant === "missing",
        },
        className,
      )}
    >
      {skill}
    </span>
  )
}
