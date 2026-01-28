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
  TrendingUp,
  Zap,
  FileText,
  Target,
  Brain,
  ArrowLeft,
  MoreHorizontal,
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
      fill: "oklch(0.65 0.18 200)",
    },
    {
      name: "Explain",
      count: actionCounts.explain,
      fill: "oklch(0.75 0.15 150)",
    },
    {
      name: "Practice",
      count: actionCounts.questions,
      fill: "oklch(0.85 0.12 90)",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Analytics Header */}
      <div className="border-b border-border/40 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-lg tracking-tight">
              Learning Insights
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-8 text-[10px] uppercase font-bold tracking-widest bg-background/50"
            >
              Export Report
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-foreground tracking-tighter mb-4">
                Everything you've{" "}
                <span className="text-primary italic">learned.</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Materials",
                  value: stats.totalDocuments,
                  icon: FileText,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "AI Actions",
                  value: stats.totalActionsUsed,
                  icon: Zap,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
                {
                  label: "Study Streak",
                  value: `${stats.studyStreak}d`,
                  icon: Target,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                  subValue: `Longest: ${stats.longestStreak || 0}d`,
                },
              ].map((stat, i) => (
                <Card
                  key={i}
                  className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden relative group"
                >
                  <div
                    className={`absolute top-0 left-0 w-1 h-full ${stat.color.replace("text", "bg")} transition-all group-hover:w-2`}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}
                      >
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-black text-foreground">
                          {stat.value}
                        </p>
                        {stat.subValue && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.subValue}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full border-primary/20 bg-primary/5 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
              <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center mb-6 text-primary-foreground transform group-hover:rotate-6 transition-transform">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Today's Usage</h3>
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
                        364.4 - 364.4 * (stats.actionsToday / 5)
                      }
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">
                      {stats.actionsToday}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Limit {userData?.plan_type === "pro" ? 100 : 10}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground px-4">
                  You've used{" "}
                  {Math.round(
                    (stats.actionsToday /
                      (userData?.plan_type === "pro" ? 100 : 10)) *
                      100,
                  )}
                  % of your {userData?.plan_type === "pro" ? "Pro" : "free"} AI
                  actions for today.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    Weekly Activity
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">
                    Daily AI interaction frequency
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-[10px] font-bold uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-primary ring-2 ring-primary/20 animate-pulse"></div>
                    Last 7 Days
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <WeeklyActivityChart data={weeklyData} />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden flex flex-col">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">
                  Action Type
                </CardTitle>
                <CardDescription className="text-sm font-medium">
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
        <div className="mt-12 p-1 bg-gradient-to-tr from-primary/20 via-border/20 to-accent/20 rounded-[2.5rem]">
          <div className="bg-card rounded-[2.4rem] p-10 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
              <Brain className="w-64 h-64" />
            </div>
            <div className="max-w-2xl relative">
              <h3 className="text-3xl font-black text-foreground mb-6">
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
                    <h4 className="font-bold text-foreground flex items-center gap-2">
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
        </div>
      </main>
    </div>
  );
}
