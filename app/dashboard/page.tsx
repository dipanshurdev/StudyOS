import { createClient } from "@/lib/supabase/server";
import { getUserDocuments, getOrCreateUser } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Zap,
  Brain,
  BookOpen,
  BarChart3,
  ChevronRight,
  Sparkles,
  Clock,
  Calendar,
  ArrowRight,
  TrendingUp,
  CreditCard,
  GitBranch,
  MessageSquare,
  Crown,
  Flame,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  let userDetails;
  try {
    userDetails = await getOrCreateUser({
      id: authUser.id,
      email: authUser.email!,
      display_name:
        authUser.user_metadata.full_name || authUser.email!.split("@")[0],
    });
  } catch (e) {
    console.error("Failed to fetch user details", e);
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
  const remainingActions = Math.max(
    0,
    dailyLimit - (userDetails.ai_credits_used_today || 0),
  );
  const usagePercentage = Math.min(
    100,
    ((userDetails.ai_credits_used_today || 0) / dailyLimit) * 100,
  );

  const stats = [
    {
      label: "AI Actions Left",
      value: `${remainingActions}`,
      subValue: `of ${dailyLimit} today`,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Your Documents",
      value: documents.length || 0,
      subValue: "Total materials",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Study Streak",
      value: `${userDetails.study_streak || 0}`,
      subValue: `Longest: ${userDetails.longest_streak || 0} days`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "Account Plan",
      value: userDetails.plan_type === "pro" ? "Pro" : "Free",
      subValue:
        userDetails.plan_type === "pro"
          ? "Unlimited access"
          : "Upgrade available",
      icon: userDetails.plan_type === "pro" ? Crown : Sparkles,
      color:
        userDetails.plan_type === "pro"
          ? "text-primary"
          : "text-muted-foreground",
      bg: userDetails.plan_type === "pro" ? "bg-primary/10" : "bg-muted/50",
      border:
        userDetails.plan_type === "pro"
          ? "border-primary/20"
          : "border-border/50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome back,{" "}
                {userDetails.display_name?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Link href="/dashboard/new">
              <Button size="lg" className="gap-2 shadow-lg">
                <Plus className="w-5 h-5" />
                New Document
              </Button>
            </Link>
          </div>
        </div>

        {/* Usage Progress Bar */}
        {userDetails.plan_type === "free" && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Daily AI Actions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userDetails.ai_credits_used_today || 0} of {dailyLimit}{" "}
                      used today
                    </p>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade
                  </Button>
                </Link>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={i}
                className={`group hover:shadow-lg transition-all duration-300 border ${stat.border} bg-card/50 backdrop-blur-sm overflow-hidden relative`}
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${stat.bg.replace("bg", "bg-gradient-to-b").replace("/10", "/20")} transition-all group-hover:w-1.5`}
                ></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {stat.subValue}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Create Flashcards",
                description: "Generate flashcards from your notes",
                icon: CreditCard,
                href: "/dashboard/new",
                color: "from-blue-500/10 to-blue-500/5",
                iconColor: "text-blue-500",
              },
              {
                title: "Generate Mind Map",
                description: "Visualize concepts and relationships",
                icon: GitBranch,
                href: "/dashboard/new",
                color: "from-purple-500/10 to-purple-500/5",
                iconColor: "text-purple-500",
              },
              {
                title: "Chat with AI Tutor",
                description: "Get instant answers to your questions",
                icon: MessageSquare,
                href: "/dashboard/new",
                color: "from-emerald-500/10 to-emerald-500/5",
                iconColor: "text-emerald-500",
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <Card
                    className={`bg-gradient-to-br ${action.color} border-border/50 hover:border-primary/30 transition-all cursor-pointer group h-full`}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-6 h-6 ${action.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Recent Documents
            </h2>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm" className="gap-2">
                View Analytics
                <BarChart3 className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {!documents || documents.length === 0 ? (
            <Card className="border-2 border-dashed border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No documents yet
                </h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  Start your learning journey by creating your first document.
                  Upload PDFs, paste notes, or start typing.
                </p>
                <Link href="/dashboard/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create your first document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.slice(0, 6).map((doc: any) => (
                <Link
                  key={doc.id}
                  href={`/dashboard/${doc.id}`}
                  className="group block"
                >
                  <Card className="bg-card/50 hover:bg-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group-hover:-translate-y-0.5 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                                {doc.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {doc.content
                                  ? doc.content.substring(0, 100) + "..."
                                  : "Empty document"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-foreground flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {doc.created_at
                                ? formatDistanceToNow(
                                    new Date(doc.created_at),
                                    {
                                      addSuffix: true,
                                    },
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-background border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-lg">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {documents.length > 6 && (
                <div className="text-center pt-4">
                  <Link href="/dashboard/analytics">
                    <Button variant="outline" className="gap-2">
                      View all {documents.length} documents
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
