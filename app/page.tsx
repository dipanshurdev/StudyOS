import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LandingThemeToggle } from "@/components/landing/theme-toggle";
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
  Linkedin,
  Twitter,
  Quote,
  Building2,
  Crown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { enterpriseMailto, proMailto } from "@/lib/data";
import Hero from "@/components/pages/Hero";

export const dynamic = "force-dynamic";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://studyos.app";
const founderEmail = "dipanshurdev@gmail.com";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-background via-background to-primary/5">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-104 w-104 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
      </div>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow-md"
      >
        Skip to content
      </a>
      {/* Navigation - sticky SaaS-style */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 max-w-7xl mx-auto border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-md bg-primary/10 p-1 border border-primary/20 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30">
            <Image
              src="/logo.png"
              alt="StudyOS Logo"
              width={36}
              height={36}
              priority
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
          <Link href="#testimonials" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Reviews
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>
          <LandingThemeToggle />
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

      <main id="main-content" className="relative">
      {/* Hero Section */}
    <Hero user={user} />

      {/* Trusted by Students and Teams */}
      <section className="px-6 py-10 md:py-14 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
            Trusted by learners from top institutions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[
              "University Programs",
              "Medical Aspirants",
              "Engineering Batches",
              "MBA Cohorts",
              "Bootcamp Teams",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-border/50 bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground/80 backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
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
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
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
            className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md transition-opacity hover:opacity-90"
            aria-label="StudyOS on Peerlist Launchpad"
          >
            <Image
              src="/peerlist-launchpad.png"
              alt="StudyOS - Study Smarter with AI. Live on Peerlist Launchpad."
              className="w-full max-w-2xl mx-auto rounded-md border border-border/50 shadow-lg object-contain"
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
                  className="bg-background border border-border/50 rounded-md p-5 md:p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div
                    className={`w-11 h-11 ${feature.bg} rounded-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shrink-0`}
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
              <div className="w-14 h-14 bg-primary/10 border-2 border-primary/20 rounded-md flex items-center justify-center mx-auto text-xl font-bold text-primary">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-2xl font-bold text-foreground">Free</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Try everything. No card required.
            </p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "10 AI actions per day",
                "Unlimited documents",
                "Basic summaries & explanations",
                "Practice questions",
                "PDF import",
                "Study analytics",
                "Study streaks",
                "Email support",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Get started free
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-linear-to-br from-primary/10 to-background border-2 border-primary/50 rounded-2xl p-8 relative hover:shadow-xl transition-shadow">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Pro</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              For students who mean business
            </p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-foreground">$9</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Unlimited AI actions",
                "Advanced flashcards with spaced repetition",
                "AI-generated mind maps",
                "AI tutor chat (unlimited)",
                "Custom study plans",
                "Export to PDF, DOCX, Markdown",
                "Advanced analytics & insights",
                "Priority support",
                "Early access to new features",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Button asChild className="w-full">
              <a href={proMailto}>Contact founder for Pro</a>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Payments are not live yet • Quick manual onboarding available
            </p>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-2xl font-bold text-foreground">Enterprise</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              For teams & institutions
            </p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-foreground">Custom</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Everything in Pro",
                "Team collaboration & sharing",
                "Admin dashboard & analytics",
                "Custom AI model training",
                "SSO & advanced security",
                "Dedicated account manager",
                "SLA guarantee (99.9% uptime)",
                "Custom integrations",
                "On-premise deployment option",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild variant="outline" className="w-full">
              <a href={enterpriseMailto}>Contact founder</a>
            </Button>
          </div>
        </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="px-6 py-20 md:py-28 border-t border-border/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              Why students keep using StudyOS
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common feedback patterns from early users across exam prep and
              daily revision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                quote:
                  "Large notes become structured summaries faster, so students spend more time revising and less time formatting.",
                name: "Faster revision",
                role: "Most mentioned benefit",
              },
              {
                quote:
                  "The tutor mode helps break difficult topics into simpler explanations with examples and follow-up questions.",
                name: "Better understanding",
                role: "Concept clarity",
              },
              {
                quote:
                  "Practice mode helps identify weak areas early, making revision plans more focused before exams.",
                name: "Focused practice",
                role: "Exam preparation",
              },
            ].map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-border/50 bg-card/70 p-6 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <Quote className="w-5 h-5 text-primary/70 mb-4" />
                <p className="text-sm leading-relaxed text-foreground/90 mb-5">
                  {item.quote}
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-muted-foreground">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 md:py-28 bg-card/30 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              Everything students ask before they switch to StudyOS.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is StudyOS really free to start?",
                a: "Yes. You get 10 AI actions per day on the free plan, with no credit card required.",
              },
              {
                q: "Can I upload PDFs and lecture notes?",
                a: "Yes. Upload PDFs, paste notes, or write directly and generate summaries, questions, and flashcards instantly.",
              },
              {
                q: "Is my study data private?",
                a: "Your workspace is private by default. We use secure infrastructure and never sell your personal data.",
              },
              {
                q: "Who is StudyOS for?",
                a: "High-school and university students, competitive exam aspirants, and cohort-based learning teams.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-md border border-border/50 bg-background px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-medium text-foreground flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
                </summary>
                <p className="text-sm text-muted-foreground pt-3 pr-6 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-32 bg-linear-to-br from-primary/10 via-primary/5 to-background border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Start studying smarter today
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
            Privacy-conscious design · Built for focused learning · Your data
            stays yours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-12 md:py-14 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                <Image
                  src="/logo.png"
                  alt="StudyOS"
                  width={36}
                  height={36}
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
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
                  <Link href="#demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="hover:text-foreground transition-colors">
                    Reviews
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href={`mailto:${founderEmail}?subject=About%20StudyOS`}
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=r7Fy3arW7fI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Product demo
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${founderEmail}?subject=Partnership%20with%20StudyOS`}
                    className="hover:text-foreground transition-colors"
                  >
                    Partnerships
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href={`mailto:${founderEmail}?subject=StudyOS%20Documentation%20Request`}
                    className="hover:text-foreground transition-colors"
                  >
                    Docs request
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Billing & plans
                  </Link>
                </li>
                <li>
                  <a
                    href={`mailto:${founderEmail}?subject=StudyOS%20Support`}
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
                    href={`mailto:${founderEmail}?subject=StudyOS%20Privacy%20Policy%20Request`}
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${founderEmail}?subject=StudyOS%20Terms%20Request`}
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of use
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${founderEmail}?subject=StudyOS%20Security%20Information`}
                    className="hover:text-foreground transition-colors"
                  >
                    Security info
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
                    <Linkedin className="w-4 h-4 shrink-0" />
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
                    <Twitter className="w-4 h-4 shrink-0" />
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
                href={`mailto:${founderEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {founderEmail}
              </a>
            </p>
          </div>
        </div>
      </footer>
      </main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "StudyOS",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            url: appUrl,
            description:
              "AI-powered study platform for summaries, flashcards, mind maps, and AI tutoring.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </div>
  );
}
