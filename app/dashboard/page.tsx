import { createClient } from "@/lib/supabase/server"
import { getUserDocuments, getOrCreateUser } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Zap, Brain, BookOpen, BarChart3, ChevronRight, Sparkles, Clock, Calendar, ArrowRight, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/login")
  }

  let userDetails
  try {
     userDetails = await getOrCreateUser({
       id: authUser.id,
       email: authUser.email!,
       display_name: authUser.user_metadata.full_name || authUser.email!.split("@")[0]
     })
  } catch (e) {
     console.error("Failed to fetch user details", e)
     userDetails = { 
       plan_type: "free",
       ai_credits_used_today: 0, 
       display_name: authUser.email!.split("@")[0]
     }
  }

  const documents = await getUserDocuments(authUser.id)
  
  const dailyLimit = userDetails.plan_type === 'pro' ? 50 : 5
  const remainingActions = Math.max(0, dailyLimit - (userDetails.ai_credits_used_today || 0))

  const stats = [
    {
      label: "AI Actions Left",
      value: `${remainingActions} / ${dailyLimit}`,
      subValue: "Resets at midnight",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "Your Documents",
      value: documents.length || 0,
      subValue: "Total materials",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Study Streak",
      value: "1 day", 
      subValue: "Keep it up!",
      icon: Sparkles,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Account Plan",
      value: userDetails.plan_type === "pro" ? "Pro" : "Free",
      subValue: userDetails.plan_type === "pro" ? "Unlimited access" : "Basic usage",
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10"
    },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* Premium Header */}
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-background shadow-md border border-border/50 p-1.5 transition-all group-hover:shadow-lg group-hover:border-primary/20 rotate-3 hover:rotate-0 cursor-pointer">
                <img src="/logo.png" alt="StudyOS" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-2xl tracking-tight text-foreground">
                Study<span className="text-primary italic">OS</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </Link>
              <div className="h-8 w-[1px] bg-border/50 hidden sm:block mx-1" />
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-semibold text-foreground leading-none">{userDetails.display_name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{userDetails.plan_type} Member</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] shadow-md">
                   <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-primary">
                      {userDetails.display_name?.[0]?.toUpperCase()}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Welcome */}
        <div className="relative mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-card border border-border/50 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain className="w-64 h-64 -mr-20 -mt-20" />
            </div>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
                  Welcome Back
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Ready to ace your <span className="text-primary italic">next exam</span>, {userDetails.display_name.split(' ')[0]}?
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Your AI-powered study companion is ready. Summarize documents, extract key concepts, and generate practice questions in seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard/new">
                  <Button size="lg" className="rounded-xl px-8 gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold">
                    <Plus className="w-5 h-5" />
                    New Document
                  </Button>
                </Link>
                {userDetails.plan_type === 'free' && (
                  <Button size="lg" variant="outline" className="rounded-xl px-8 gap-2 bg-background/50 hover:bg-background transition-colors">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Go Pro
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="group hover:border-primary/30 transition-all duration-300 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3 opacity-50" />
                        {stat.subValue}
                      </p>
                    </div>
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Materials */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Recent Materials</h2>
              <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono text-muted-foreground">{documents.length}</span>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <LayoutGrid className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-primary bg-primary/10">
                  <List className="w-4 h-4" />
               </Button>
            </div>
          </div>

          <div className="space-y-4">
            {!documents || documents.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 px-4 bg-muted/20 border-2 border-dashed border-border/50 rounded-3xl text-center">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground/30 ring-8 ring-muted/20 animate-pulse">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No documents found</h3>
                  <p className="text-muted-foreground max-w-sm mb-8">
                    Your study materials will appear here. Start by creating a new document or uploading your notes.
                  </p>
                  <Link href="/dashboard/new">
                    <Button variant="outline" className="rounded-xl gap-2 hover:bg-background transition-colors">
                      <Plus className="w-4 h-4" />
                      Create first document
                    </Button>
                  </Link>
               </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc: any) => (
                  <Link key={doc.id} href={`/dashboard/${doc.id}`} className="group block">
                    <Card className="bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 group-hover:-translate-y-1 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center">
                           {/* Status Indicator Bar */}
                           <div className="h-2 md:h-auto md:w-2 bg-gradient-to-b from-primary/60 to-accent/60 opacity-50"></div>
                           
                           <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                   <h4 className="font-bold text-lg text-foreground truncate">{doc.title}</h4>
                                   <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                      {doc.content?.length || 0} chars
                                   </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1 mb-0 max-w-2xl opacity-70">
                                   {doc.content ? doc.content.substring(0, 150) : "Empty document ready for your notes..."}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                   <p className="text-xs font-semibold text-foreground flex items-center gap-1 justify-end">
                                      <Clock className="w-3 h-3 text-primary/60" />
                                      {doc.created_at ? formatDistanceToNow(new Date(doc.created_at), { addSuffix: true }) : "N/A"}
                                   </p>
                                   <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Last edited</p>
                                </div>
                                <div className="flex gap-2">
                                  <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
                                     <ArrowRight className="w-5 h-5" />
                                  </div>
                                </div>
                              </div>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Credits Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium">StudyOS AI v1.2</p>
           </div>
           <div className="flex gap-8 text-sm text-muted-foreground underline-offset-4 font-medium">
              <Link href="#" className="hover:text-primary hover:underline">Support</Link>
              <Link href="#" className="hover:text-primary hover:underline">API</Link>
              <Link href="#" className="hover:text-primary hover:underline">Upgrade</Link>
           </div>
        </div>
      </div>
    </div>
  )
}
