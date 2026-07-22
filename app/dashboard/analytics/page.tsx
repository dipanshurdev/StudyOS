import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Zap,
  FileText,
  Target,
  ArrowLeft,
  Info,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ActionBreakdownChart, WeeklyActivityChart } from "./charts";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Real stats from DB
  const { count: totalDocuments } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: userData } = await supabase
    .from("users")
    .select("ai_credits_used_today, plan_type, study_streak, longest_streak")
    .eq("id", user.id)
    .single();

  const { data: aiRequests } = await supabase
    .from("ai_requests")
    .select("action_type, created_at")
    .eq("user_id", user.id);

  // Map real AI requests to charts
  const actionCounts = {
    summarize:
      aiRequests?.filter((r) => r.action_type === "summarize").length || 0,
    explain: aiRequests?.filter((r) => r.action_type === "explain").length || 0,
    questions:
      aiRequests?.filter((r) => r.action_type === "questions").length || 0,
  };

  const actionBreakdown = [
    {
      name: "Summarize",
      count: actionCounts.summarize,
      fill: "var(--chart-1)",
    },
    {
      name: "Explain",
      count: actionCounts.explain,
      fill: "var(--chart-2)",
    },
    {
      name: "Practice",
      count: actionCounts.questions,
      fill: "var(--chart-3)",
    },
  ];

  // Mock weekly data if none exists, or derive from real logs
  const weeklyData = [
    { day: "Mon", actions: 0 },
    { day: "Tue", actions: 0 },
    { day: "Wed", actions: 0 },
    { day: "Thu", actions: 0 },
    { day: "Fri", actions: 0 },
    { day: "Sat", actions: 0 },
    { day: "Sun", actions: 0 },
  ];

  // Basic mapping of last 7 days (simplified)
  aiRequests?.forEach((req) => {
    const day = new Date(req.created_at).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const dayObj = weeklyData.find((d) => d.day === day);
    if (dayObj) dayObj.actions++;
  });

  const stats = {
    totalDocuments: totalDocuments || 0,
    totalActionsUsed: aiRequests?.length || 0,
    actionsToday: userData?.ai_credits_used_today || 0,
    studyStreak: userData?.study_streak || 0,
    longestStreak: userData?.longest_streak || 0,
  };
  const dailyLimit = userData?.plan_type === "pro" ? 100 : 10;
  const usagePercent = Math.min(100, Math.round((stats.actionsToday / dailyLimit) * 100));

  return (
    <div className="relative min-h-screen bg-background">
      {/* Analytics Header */}
      <div className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <h1 className="font-semibold text-sm text-foreground">
              Learning Insights
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
            >
              Export Report
            </Button> */}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-4">
                Everything you've{" "}
                <span className="text-primary">learned.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                You've processed{" "}
                <span className="font-bold text-foreground">
                  {stats.totalActionsUsed} AI requests
                </span>{" "}
                across{" "}
                <span className="font-bold text-foreground">
                  {stats.totalDocuments} documents
                </span>
                . Here's a deep dive into your study habits.
              </p>
            </div>

            <div className="bg-card border border-border rounded-none grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {[
                {
                  label: "Total Materials",
                  value: stats.totalDocuments,
                  icon: FileText,
                  primary: false,
                },
                {
                  label: "AI Actions",
                  value: stats.totalActionsUsed,
                  icon: Zap,
                  primary: true,
                },
                {
                  label: "Study Streak",
                  value: `${stats.studyStreak}d`,
                  icon: Target,
                  primary: false,
                  subValue: `Longest: ${stats.longestStreak || 0}d`,
                },
              ].map((stat, i) => (
                <div key={i} className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <stat.icon
                      className={`w-4 h-4 ${stat.primary ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-mono font-semibold text-foreground tabular-nums">
                      {stat.value}
                    </p>
                    {stat.subValue && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subValue}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full border-border bg-card relative overflow-hidden shadow-xs">
              <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full">
                <div className="w-12 h-12 rounded-none bg-muted border border-border flex items-center justify-center mb-6 text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base mb-4">Today's Usage</h3>
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-primary/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364.4}
                      strokeDashoffset={
                        364.4 - 364.4 * (Math.min(stats.actionsToday, dailyLimit) / dailyLimit)
                      }
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-mono font-semibold tabular-nums">
                      {stats.actionsToday}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                      Limit {userData?.plan_type === "pro" ? 100 : 10}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground px-4">
                  You've used{" "}
                  {usagePercent}% of your {userData?.plan_type === "pro" ? "Pro" : "free"} AI
                  actions for today.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-border bg-card rounded-none overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    Weekly Activity
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Daily AI interaction frequency
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Last 7 Days
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <WeeklyActivityChart data={weeklyData} />
            </CardContent>
          </Card>

          <Card className="border-border bg-card rounded-none overflow-hidden flex flex-col">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">
                  Action Type
                </CardTitle>
                <CardDescription className="text-sm">
                  Breakdown of AI usage
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Info className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-8 pt-4 flex-1 flex flex-col justify-center">
              <ActionBreakdownChart data={actionBreakdown} />
            </CardContent>
          </Card>
        </div>

        {/* Learning Tips Section */}
        <div className="mt-12 bg-card border border-border rounded-none p-10 md:p-12 relative overflow-hidden">
            <div className="max-w-2xl relative">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Optimization Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Active Recall",
                    desc: "Use 'Practice Questions' more frequently to move information into long-term memory.",
                  },
                  {
                    title: "Compression",
                    desc: "Your 'Summarize' ratio is 18:1. You're successfully distilling large notes into key points.",
                  },
                  {
                    title: "Deep Explanation",
                    desc: "You use 'Explain' mostly for complex topics. This is great for scaffolding knowledge.",
                  },
                  {
                    title: "Study Consistency",
                    desc: "Morning study sessions (8am-10am) are when you use AI the most effectively.",
                  },
                ].map((insight, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
