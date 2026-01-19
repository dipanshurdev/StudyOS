"use client"

import { useUsageLimit } from "@/hooks/use-usage-limit"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header({ user }: { user?: { name?: string; email?: string } }) {
  const { usage, limit, isLoading } = useUsageLimit()

  const safeUsage = usage || 0
  const safeLimit = limit || 5
  const percentage = Math.min(100, (safeUsage / safeLimit) * 100)
  const remaining = Math.max(0, safeLimit - safeUsage)

  return (
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="px-8 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground drop-shadow-sm">Welcome back, {user?.name || "Student"}</h2>
            <p className="text-sm font-medium text-muted-foreground opacity-70 italic">{user?.email}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right px-5 py-2.5 bg-primary/5 dark:bg-primary/20 rounded-xl border border-primary/10 shadow-inner">
              <p className="text-lg font-black text-primary">
                {isLoading ? "..." : `${remaining}/${safeLimit}`}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions left</p>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="rounded-lg h-9 font-semibold">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Daily AI Intelligence</span>
            </div>
            <span className="text-xs font-black text-foreground">{isLoading ? "SYNCING..." : `${safeUsage}/${safeLimit} USED`}</span>
          </div>
          <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-sm">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {percentage >= 100 ? (
            <div className="flex items-center gap-3 text-xs text-destructive bg-destructive/5 dark:bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="font-medium">
                Daily free limit reached. We're currently building our subscription system! 
                Contact <span className="underline font-bold">dv451197@gmail.com</span> for early access.
              </p>
            </div>
          ) : percentage > 80 ? (
            <div className="flex items-center gap-3 text-xs text-amber-600 bg-amber-500/5 dark:bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">You're approaching your daily limit. Study efficiently!</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
