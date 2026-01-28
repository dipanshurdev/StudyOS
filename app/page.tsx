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
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border/30">
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
        <div className="flex items-center gap-4">
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="gap-2">
              Get started
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <div className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-primary">
              AI-Powered Study Platform
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
            Study smarter, not harder
            <br />
            <span className="text-primary">with AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Transform your study materials into flashcards, mind maps,
            summaries, and practice questions. Ace your exams with AI-powered
            study tools trusted by thousands of students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 h-auto">
                Start studying free
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              Watch demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            ✨ No credit card needed • 5 free AI actions daily • Upgrade anytime
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-foreground">4.9/5</span>
              <span>from 1,200+ students</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>10,000+ active users</span>
            </div>
          </div>
        </div>

        {/* Hero Visual - Feature Showcase */}
        <div className="relative mt-20 mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl" />
          <div className="relative bg-card border border-border/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Demo Cards */}
              <div className="space-y-4 text-left group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  AI Summaries
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transform long notes into concise summaries instantly. Focus
                  on what matters most.
                </p>
              </div>

              <div className="space-y-4 text-left group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  Smart Flashcards
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Auto-generate flashcards with spaced repetition. Remember
                  more, forget less.
                </p>
              </div>

              <div className="space-y-4 text-left group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  Practice Questions
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate exam-style questions and test your knowledge before
                  the real exam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 md:py-32 bg-card/30 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need to ace your exams
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed specifically for students. Study
              faster, retain more, score higher.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "AI-Powered Summaries",
                description:
                  "Turn lengthy notes into concise summaries. Save hours of reading time.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                title: "Smart Flashcards",
                description:
                  "Auto-generate flashcards with spaced repetition algorithm. Remember everything.",
                icon: Brain,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                title: "Practice Questions",
                description:
                  "Generate exam-style questions. Test yourself before the real exam.",
                icon: Target,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                title: "Mind Maps",
                description:
                  "Visualize complex topics with AI-generated mind maps. See the big picture.",
                icon: Globe,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                title: "AI Tutor Chat",
                description:
                  "Ask questions anytime. Get instant explanations from your AI study partner.",
                icon: Users,
                color: "text-pink-500",
                bg: "bg-pink-500/10",
              },
              {
                title: "Study Analytics",
                description:
                  "Track your progress, study streaks, and performance over time.",
                icon: TrendingUp,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                title: "PDF Import",
                description:
                  "Upload PDFs, textbooks, and lecture notes. Extract content instantly.",
                icon: BookOpen,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
              },
              {
                title: "Study Plans",
                description:
                  "AI-generated study schedules tailored to your exam dates and goals.",
                icon: Clock,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
              },
              {
                title: "Collaboration",
                description:
                  "Share documents with classmates. Study together, succeed together.",
                icon: Shield,
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-background border border-border/50 rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. No complex setup, no learning curve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload or paste your notes",
              description:
                "Import PDFs, paste text, or type directly. We support all formats.",
            },
            {
              step: "2",
              title: "Choose your AI tool",
              description:
                "Summarize, explain, create flashcards, generate questions, or chat with AI tutor.",
            },
            {
              step: "3",
              title: "Study smarter",
              description:
                "Review AI-generated content, practice with flashcards, and track your progress.",
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-20 md:py-32 bg-card/30 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free. Upgrade when you're ready to unlock unlimited power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-background border border-border rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">
                Perfect for getting started
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "5 AI actions per day",
                  "Unlimited documents",
                  "Basic summaries & explanations",
                  "PDF import",
                  "Study analytics",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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
              <p className="text-muted-foreground mb-6">For serious students</p>
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
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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
              <p className="text-muted-foreground mb-6">
                For teams & institutions
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
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to transform your study routine?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students using AI to ace their exams. Start free,
            upgrade anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 h-auto">
                Start studying free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-12 bg-card/30">
        <div className="max-w-7xl mx-auto">
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
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 StudyOS. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Built with ❤️ for students worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
