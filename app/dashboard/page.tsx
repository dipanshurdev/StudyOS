import { createClient } from "@/lib/supabase/server";
import { getUserDocuments, getOrCreateUser } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Zap,
  Brain,
  BookOpen,
  BarChart3,
  ChevronRight,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  GitBranch,
  MessageSquare,
  Crown,
  Flame,
  FileText,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  let userDetails;
  try {
    userDetails = await getOrCreateUser({
      id: authUser.id,
      email: authUser.email!,
      display_name:
        authUser.user_metadata.full_name || authUser.email!.split("@")[0],
    });
  } catch (e) {
    userDetails = {
      plan_type: "free",
      ai_credits_used_today: 0,
      display_name: authUser.email!.split("@")[0],
      study_streak: 0,
      longest_streak: 0,
    };
  }

  const documents = await getUserDocuments(authUser.id);

  const dailyLimit = userDetails.plan_type === "pro" ? 100 : 10;
  const used = userDetails.ai_credits_used_today || 0;
  const remaining = Math.max(0, dailyLimit - used);
  const usagePct = Math.min(100, (used / dailyLimit) * 100);
  const isPro = userDetails.plan_type === "pro";

  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";
  const firstName = userDetails.display_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background texture */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/4 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {greeting}, {firstName}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/analytics">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Activity className="w-3.5 h-3.5" />
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard/new">
              <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                New document
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "AI actions left",
              value: remaining,
              sub: `${used} used today`,
              icon: Zap,
              color: "text-amber-500",
              iconBg: "bg-amber-500/10",
              accent: remaining === 0 ? "border-red-200 dark:border-red-900" : "",
            },
            {
              label: "Documents",
              value: documents.length || 0,
              sub: "in workspace",
              icon: BookOpen,
              color: "text-blue-500",
              iconBg: "bg-blue-500/10",
              accent: "",
            },
            {
              label: "Study streak",
              value: `${userDetails.study_streak || 0}d`,
              sub: `Best: ${userDetails.longest_streak || 0} days`,
              icon: Flame,
              color: "text-orange-500",
              iconBg: "bg-orange-500/10",
              accent: "",
            },
            {
              label: "Plan",
              value: isPro ? "Pro" : "Free",
              sub: isPro ? "Unlimited AI" : "10 actions/day",
              icon: isPro ? Crown : Sparkles,
              color: isPro ? "text-primary" : "text-muted-foreground",
              iconBg: isPro ? "bg-primary/10" : "bg-muted",
              accent: isPro ? "border-primary/20" : "",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={cn(
                  "bg-card border rounded-xl p-4 space-y-3 transition-shadow hover:shadow-sm",
                  stat.accent || "border-border"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.iconBg)}>
                  <Icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Usage bar (free users) ─────────────────────────── */}
        {!isPro && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Daily AI usage</p>
                  <p className="text-xs text-muted-foreground">
                    {remaining} of {dailyLimit} actions remaining · resets at midnight UTC
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                  <Crown className="w-3 h-3" />
                  Upgrade
                </Button>
              </Link>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  usagePct >= 90
                    ? "bg-red-500"
                    : usagePct >= 70
                    ? "bg-amber-500"
                    : "bg-primary"
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Quick actions ─────────────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Start with AI</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Flashcards",
                description: "Turn any material into study cards",
                icon: CreditCard,
                color: "text-blue-500",
                bg: "bg-blue-500/8",
                hover: "hover:border-blue-300 dark:hover:border-blue-800",
              },
              {
                title: "Mind Map",
                description: "Visualize concepts and connections",
                icon: GitBranch,
                color: "text-violet-500",
                bg: "bg-violet-500/8",
                hover: "hover:border-violet-300 dark:hover:border-violet-800",
              },
              {
                title: "AI Tutor",
                description: "Ask anything about your notes",
                icon: MessageSquare,
                color: "text-emerald-500",
                bg: "bg-emerald-500/8",
                hover: "hover:border-emerald-300 dark:hover:border-emerald-800",
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href="/dashboard/new">
                  <div
                    className={cn(
                      "group bg-card border border-border rounded-xl p-4 cursor-pointer transition-all duration-150",
                      "hover:shadow-sm",
                      action.hover
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", action.bg)}>
                      <Icon className={cn("w-4.5 h-4.5", action.color)} />
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Recent documents ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Recent documents</h2>
            {documents.length > 0 && (
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                  View all
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            )}
          </div>

          {!documents || documents.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-xl py-14 flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/15">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Your workspace is empty</h3>
              <p className="text-xs text-muted-foreground max-w-xs mb-5 leading-relaxed">
                Create a document, paste your notes or upload a PDF, then let AI do the rest.
              </p>
              <Link href="/dashboard/new">
                <Button size="sm" className="gap-1.5 text-xs h-8">
                  <Plus className="w-3.5 h-3.5" />
                  Create first document
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
              {documents.slice(0, 7).map((doc: any) => (
                <Link key={doc.id} href={`/dashboard/${doc.id}`} className="group block">
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors duration-100">
                    <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {doc.content
                          ? doc.content.substring(0, 72) + "…"
                          : "Empty document"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-muted-foreground hidden sm:block">
                        {doc.created_at
                          ? formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })
                          : "—"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" />
                    </div>
                  </div>
                </Link>
              ))}
              {documents.length > 7 && (
                <div className="px-4 py-2.5 text-center">
                  <Link href="/dashboard/analytics">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                      +{documents.length - 7} more documents
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Local cn helper (avoids extra import for this file if needed)
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}
