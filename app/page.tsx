import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LandingThemeToggle } from "@/components/landing/theme-toggle";
import {
  CheckCircle2,
  Zap,
  BarChart3,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  ListChecks,
  GitBranch,
  MessageSquare,
  Shield,
  LayoutDashboard,
  LogOut,
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
    <div className="relative isolate min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded-none focus:bg-background focus:px-3 focus:py-2 focus:shadow-md"
      >
        Skip to content
      </a>
      {/* Navigation - sticky SaaS-style */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 max-w-7xl mx-auto border-b border-border  backdrop-blur-xl bg-transparent">
        <div className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-none bg-muted p-1 border border-border transition-colors group-hover:border-foreground/20">
            <Image
              src="/logo.png"
              alt="StudyOS Logo"
              width={36}
              height={36}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
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
                <Button size="sm" className="gap-2">
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
                <Button size="sm" className="gap-2">
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

      {/* Who it's for */}
      <section className="px-6 py-10 md:py-14 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
            Built for every kind of studying
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[
              "University courses",
              "Medical & NEET prep",
              "Engineering exams",
              "MBA & GMAT",
              "Bootcamp cohorts",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground/80"
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
        className="px-6 py-16 md:py-24 scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="tracking-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              See StudyOS in action
            </h2>
            <p className="text-muted-foreground text-base">
              Watch how to turn your notes into summaries, flashcards, and more
            </p>
          </div>
          <div className="product-shadow relative w-full rounded-[18px] overflow-hidden border border-border bg-card aspect-video">
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
      <section className="px-6 py-12 md:py-16 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            As seen on
          </p>
          <a
            href="https://peerlist.io/launchpad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-none transition-opacity hover:opacity-90"
            aria-label="StudyOS on Peerlist Launchpad"
          >
            <Image
              src="/peerlist-launchpad.png"
              alt="StudyOS - Study Smarter with AI. Live on Peerlist Launchpad."
              className="product-shadow w-full max-w-2xl mx-auto rounded-[18px] border border-border/50 object-contain"
              width={672}
              height={280}
            />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-6 py-20 md:py-32 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs font-medium uppercase tracking-wider text-primary mb-3">
              Everything in one workspace
            </p>
            <h2 className="tracking-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              Six tools that work on the{" "}
              <span className="text-primary">same document</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Import once, then summarize, drill, and review from a single
              source of truth. No re-uploading, no context switching.
            </p>
          </div>

          {/* Two lead capabilities with inline product visuals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
            {/* AI summaries */}
            <div className="group rounded-none border border-border bg-card p-6 md:p-8 hover:border-foreground/20 transition-colors">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="inline-flex size-9 items-center justify-center rounded-none bg-primary/10 text-primary">
                  <Sparkles className="size-4.5" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  AI summaries
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Condense chapters and papers into exam-focused notes. Every
                point traces back to a line in your source.
              </p>
              <div className="rounded-none border border-border bg-muted/40 p-4 space-y-2.5">
                {[
                  "Photosynthesis converts light into chemical energy.",
                  "Light reactions occur in the thylakoid membrane.",
                  "The Calvin cycle fixes CO\u2082 into glucose.",
                ].map((line) => (
                  <div key={line} className="flex gap-2 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI tutor chat */}
            <div className="group rounded-none border border-border bg-card p-6 md:p-8 hover:border-foreground/20 transition-colors">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="inline-flex size-9 items-center justify-center rounded-none bg-primary/10 text-primary">
                  <MessageSquare className="size-4.5" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  AI tutor chat
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Stuck on a concept? Ask in plain English and get grounded
                explanations, examples, and follow-up questions.
              </p>
              <div className="space-y-2.5">
                <div className="ml-auto max-w-[80%] rounded-none rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                  Explain the Calvin cycle simply.
                </div>
                <div className="max-w-[85%] rounded-none rounded-bl-sm border border-border bg-muted/40 px-3.5 py-2 text-sm text-foreground/90">
                  It&rsquo;s the &ldquo;sugar factory&rdquo; of photosynthesis&mdash;using energy
                  from light reactions to turn CO₂ into glucose.
                </div>
              </div>
            </div>
          </div>

          {/* Hairline-divided grid of remaining tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-none border border-border bg-border">
            {[
              {
                title: "Smart flashcards",
                description:
                  "Auto-generated cards with spaced repetition that tells you exactly when to review.",
                icon: Layers,
              },
              {
                title: "Practice questions",
                description:
                  "MCQ, short-answer, and essay prompts matched to your own material.",
                icon: ListChecks,
              },
              {
                title: "Mind maps",
                description:
                  "Turn dense topics into visual maps and see structure at a glance.",
                icon: GitBranch,
              },
              {
                title: "Study analytics",
                description:
                  "Streaks, usage, and progress in one place so you know what to do next.",
                icon: BarChart3,
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-card p-6 hover:bg-accent/40 transition-colors"
                >
                  <Icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">
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
      <section className="bg-secondary px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <h2 className="tracking-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3">
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
              <div className="w-14 h-14 bg-card border border-border rounded-none flex items-center justify-center mx-auto text-xl font-semibold text-foreground">
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
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="tracking-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3">
              Pricing that scales with you
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Start free. No hidden fees. Upgrade when you need more—cancel
              anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-card border border-border rounded-none p-8 hover:border-foreground/20 transition-colors">
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
          <div className="bg-card border border-primary/60 rounded-none p-8 relative">
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
          <div className="bg-card border border-border rounded-none p-8 hover:border-foreground/20 transition-colors">
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
        className="px-6 py-20 md:py-28 bg-secondary"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="tracking-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
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
                className="rounded-none border border-border bg-card p-6 hover:border-foreground/20 transition-colors"
              >
                <Quote className="w-5 h-5 text-muted-foreground mb-4" />
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
      <section className="px-6 py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="tracking-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
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
                className="group rounded-none border border-border bg-card px-5 py-4"
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
      <section className="px-6 py-24 md:py-36 bg-tile-dark text-on-dark">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="tracking-display text-3xl md:text-4xl lg:text-5xl font-semibold text-on-dark">
            Start studying smarter today
          </h2>
          <p className="text-lg md:text-xl text-on-dark-muted">
            Get your first 10 AI actions free. No credit card. Start in under a
            minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 text-base bg-white text-tile-dark hover:bg-white/90"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="text-base border-white/25 bg-transparent text-on-dark hover:bg-white/10 hover:text-on-dark hover:border-white/40"
              >
                View pricing
              </Button>
            </Link>
          </div>
          <p className="text-xs text-on-dark-muted pt-2">
            Privacy-conscious design · Built for focused learning · Your data
            stays yours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 md:py-14 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-muted flex items-center justify-center border border-border">
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
