import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle2,
  Zap,
  Brain,
  BarChart3,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users,
  Target,
  Clock,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Globe,
  LayoutDashboard,
  LogOut,
  Play,
} from "lucide-react";
import { BiLogoLinkedin, BiLogoTwitter } from "react-icons/bi";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navigation - sticky SaaS-style */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 max-w-7xl mx-auto border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-xl bg-primary/10 p-1 border border-primary/20 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30">
            <img
              src="/logo.png"
              alt="StudyOS Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-black text-foreground tracking-tight">
            Study<span className="text-primary">OS</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="#features" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Features
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button size="sm" className="gap-2 shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/auth/signout">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="gap-2 shadow-sm">
                  Get started free
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-28 max-w-7xl mx-auto text-center">
        <div className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm font-semibold">
              The AI study platform built for serious students
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-[1.1] tracking-tight">
            Turn any material into
            <br />
            <span className="text-primary bg-clip-text">
              exam-ready in minutes
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Summaries, flashcards, mind maps, and an AI tutor—all in one place.
            Join thousands of students who study smarter and score higher.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
                >
                  <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="lg"
                  className="gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
                >
                  Get started free
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            )}
            <a href="#demo">
              <Button
                variant="outline"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto gap-2"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                {user ? "Explore features" : "Watch demo"}
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            No credit card required · 10 free AI actions daily · Cancel anytime
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
              <span className="font-semibold text-foreground">4.9/5</span>
              <span>from 2,400+ reviews</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-foreground">15,000+</span>
              <span>active students</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Trusted by universities worldwide</span>
            </div>
          </div>
        </div>

        {/* Hero Visual - Feature Showcase */}
        <div className="relative mt-16 md:mt-20 mb-16 md:mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl" />
          <div className="relative bg-card/80 border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-10 backdrop-blur-sm shadow-xl md:shadow-2xl">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center md:text-left">
              Everything you need in one workspace
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-3 text-left group p-4 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  One-click summaries
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Long chapters become short, clear summaries. Focus on what
                  actually appears on the exam.
                </p>
              </div>
              <div className="space-y-3 text-left group p-4 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Flashcards that stick
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Spaced repetition built in. Review at the right time so you
                  remember when it matters.
                </p>
              </div>
              <div className="space-y-3 text-left group p-4 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Exam-style practice
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate questions that match your course. Test yourself
                  before the real thing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section
        id="demo"
        className="px-6 py-16 md:py-24 border-t border-border/30 scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
              See StudyOS in action
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Watch how to turn your notes into summaries, flashcards, and more
            </p>
          </div>
          <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-muted/30 aspect-video">
            <iframe
              src="https://www.youtube.com/embed/r7Fy3arW7fI?rel=0&modestbranding=1"
              title="StudyOS - Demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <a
              href="https://www.youtube.com/watch?v=r7Fy3arW7fI"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Watch on YouTube
            </a>
          </p>
        </div>
      </section>

      {/* Live on Peerlist Launchpad */}
      <section className="px-6 py-12 md:py-16 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            As seen on
          </p>
          <a
            href="https://peerlist.io/launchpad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl transition-opacity hover:opacity-90"
            aria-label="StudyOS on Peerlist Launchpad"
          >
            <img
              src="/peerlist-launchpad.png"
              alt="StudyOS - Study Smarter with AI. Live on Peerlist Launchpad."
              className="w-full max-w-2xl mx-auto rounded-xl border border-border/50 shadow-lg object-contain"
              width={672}
              height={280}
            />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-6 py-20 md:py-32 bg-card/30 border-t border-border/30 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Built for the way you actually study
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              One platform. All the tools. No context switching—just better
              outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-16">
            {[
              {
                title: "AI summaries",
                description:
                  "Condense chapters and papers into exam-focused summaries. No more highlighting for hours.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                title: "Smart flashcards",
                description:
                  "Generate cards from your content. Spaced repetition tells you exactly when to review.",
                icon: Brain,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                title: "Practice questions",
                description:
                  "Get questions that match your material. MCQ, short-answer, and essay-style.",
                icon: Target,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                title: "Mind maps",
                description:
                  "Turn dense topics into visual maps. See connections and structure at a glance.",
                icon: Globe,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                title: "AI tutor chat",
                description:
                  "Stuck on a concept? Ask in plain English. Get explanations, examples, and follow-ups.",
                icon: Users,
                color: "text-pink-500",
                bg: "bg-pink-500/10",
              },
              {
                title: "Study analytics",
                description:
                  "Streaks, usage, and progress in one place. Know where you stand and what to do next.",
                icon: TrendingUp,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                title: "PDF import",
                description:
                  "Drop in textbooks and lecture slides. We extract the content so you can study it.",
                icon: BookOpen,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
              },
              {
                title: "Study plans",
                description:
                  "Set your exam date and goals. Get a realistic schedule that adapts to your pace.",
                icon: Clock,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
              },
              {
                title: "Sharing & collaboration",
                description:
                  "Share docs with study groups. One source of truth, fewer last-minute scrambles.",
                icon: Shield,
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-background border border-border/50 rounded-xl p-5 md:p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div
                    className={`w-11 h-11 ${feature.bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
            From notes to exam-ready in three steps
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            No setup. No learning curve. Start in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              step: "1",
              title: "Add your material",
              description:
                "Upload a PDF, paste your notes, or type. One document, all your tools in one place.",
            },
            {
              step: "2",
              title: "Pick your AI tool",
              description:
                "Summarize, generate flashcards, build a mind map, or ask the AI tutor. One click, instant results.",
            },
            {
              step: "3",
              title: "Study and track",
              description:
                "Review, practice, and check your progress. Streaks and analytics keep you on track.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="text-center space-y-4 relative md:last:before:hidden md:last:after:hidden"
            >
              <div className="w-14 h-14 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-center justify-center mx-auto text-xl font-bold text-primary">
                {item.step}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-20 md:py-32 bg-card/30 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Pricing that scales with you
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Start free. No hidden fees. Upgrade when you need more—cancel
              anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:border-border/80 transition-colors">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Try everything. No card required.
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "10 AI actions per day",
                  "Unlimited documents",
                  "Summaries, explanations & questions",
                  "PDF import",
                  "Study analytics & streaks",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Get started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-primary/10 to-background border-2 border-primary/50 rounded-2xl p-8 relative">
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                For students who mean business
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited AI actions",
                  "Advanced flashcards",
                  "Mind maps",
                  "AI tutor chat",
                  "Study plans",
                  "Export to PDF/DOCX",
                  "Priority support",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="block">
                <Button className="w-full">Start Pro trial</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-background border border-border rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Enterprise
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Teams, institutions, and custom needs
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">
                  Custom
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Pro",
                  "Team collaboration",
                  "Admin dashboard",
                  "Custom integrations",
                  "Dedicated support",
                  "SLA guarantee",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Join 15,000+ students studying smarter
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Get your first 10 AI actions free. No credit card. Start in under a
            minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                Get started free
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto"
              >
                View pricing
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Trusted by students at 50+ universities · SOC 2 compliant · Your
            data stays yours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-12 md:py-14 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <img
                  src="/logo.png"
                  alt="StudyOS"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <span className="font-bold text-foreground">
                  Study<span className="text-primary">OS</span>
                </span>
                <p className="text-xs text-muted-foreground">
                  AI study platform for serious students
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Turn any material into exam-ready in minutes. Summaries,
              flashcards, mind maps, and an AI tutor—all in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Built by</h4>
              <p className="text-sm text-muted-foreground mb-3">
                @dipanshurdev
              </p>
              <ul className="flex flex-wrap gap-3">
                <li>
                  <a
                    href="https://linkedin.com/in/dipanshurdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <BiLogoLinkedin size={18} />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/dipanshurdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Twitter profile"
                  >
                    <BiLogoTwitter size={18} />
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 StudyOS. All rights reserved.</p>
            <p className="flex items-center gap-2 flex-wrap justify-center">
              <Shield className="w-4 h-4 shrink-0 text-muted-foreground/70" />
              Secure · Private · Built for students ·{" "}
              <a
                href="mailto:dipanshurdev@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                dipanshurdev@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
