import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle2, Sparkles, ArrowLeft, Zap, Crown, Building2, ArrowRight,
} from "lucide-react";
import { enterpriseMailto, founderEmail, proMailto } from "@/lib/data";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "10 AI actions per day",
  "Unlimited documents",
  "Summaries & explanations",
  "Practice questions",
  "PDF import",
  "Study analytics & streaks",
  "Email support",
];

const PRO_FEATURES = [
  "Unlimited AI actions",
  "Advanced spaced repetition",
  "AI-generated mind maps",
  "AI tutor chat (unlimited)",
  "Custom study plans",
  "Export to PDF, DOCX, Markdown",
  "Advanced analytics",
  "Priority support",
  "Early access to new features",
];

const ENT_FEATURES = [
  "Everything in Pro",
  "Team collaboration & sharing",
  "Admin dashboard",
  "Custom AI model configuration",
  "SSO & SAML integration",
  "Dedicated account manager",
  "99.9% uptime SLA",
  "Custom integrations & API",
  "On-premise option",
];

const FAQS = [
  { q: "Can I change plans anytime?", a: "Yes. Upgrade or downgrade instantly. Changes take effect immediately with no penalties." },
  { q: "What happens to my data if I cancel?", a: "Your data stays safe for 30 days after cancellation. Export everything before you go." },
  { q: "Do you offer student discounts?", a: "Yes — students with a valid .edu email get 50% off Pro. Contact us to verify." },
  { q: "Is there a free trial for Pro?", a: "Payments are launching soon. Contact the founder for early access and manual onboarding." },
  { q: "What payment methods do you accept?", a: "Payment options are being finalized. Reach out and we'll share available methods." },
  { q: "Can I use StudyOS offline?", a: "AI features require internet. Offline note editing for Pro users is coming soon." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-none bg-muted flex items-center justify-center border border-border">
              <img src="/logo.png" alt="StudyOS" className="w-4 h-4 object-contain" />
            </div>
            <span className="font-bold text-[15px] text-foreground tracking-tight">
              Study<span className="text-primary">OS</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/"><Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs"><ArrowLeft className="w-3.5 h-3.5" />Home</Button></Link>
            <Link href="/login"><Button size="sm" className="h-8 text-xs">Sign in</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            The right plan for every student
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            Start free. No hidden fees. Upgrade when you need more — cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            No credit card required for Free plan
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Free */}
          <div className="bg-card border border-border rounded-none p-7 space-y-6 hover:border-foreground/20 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-base font-semibold text-foreground">Free</h3>
              </div>
              <p className="text-xs text-muted-foreground">Try everything. No card required.</p>
            </div>
            <div>
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full h-10 text-sm font-medium">
                Get started free
              </Button>
            </Link>
          </div>

          {/* Pro — highlighted */}
          <div className="bg-card border border-primary/60 rounded-none p-7 space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Pro</h3>
              </div>
              <p className="text-xs text-muted-foreground">For students who mean business.</p>
            </div>
            <div>
              <span className="text-4xl font-bold text-foreground">$9</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{f}
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <Button asChild className="w-full h-10 text-sm font-semibold">
                <a href={proMailto}>Contact founder for Pro</a>
              </Button>
              <p className="text-center text-[11px] text-muted-foreground/60">
                Payments launching soon · Manual onboarding available
              </p>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-card border border-border rounded-none p-7 space-y-6 hover:border-foreground/20 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-base font-semibold text-foreground">Enterprise</h3>
              </div>
              <p className="text-xs text-muted-foreground">For teams and institutions.</p>
            </div>
            <div>
              <span className="text-4xl font-bold text-foreground">Custom</span>
            </div>
            <ul className="space-y-2.5">
              {ENT_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="w-full h-10 text-sm font-medium">
              <a href={enterpriseMailto}>Contact us</a>
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">Frequently asked questions</h2>
            <p className="text-sm text-muted-foreground">Everything you need to know before getting started.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-muted/30 border border-border rounded-none p-10 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Still have questions?</h2>
          <p className="text-sm text-muted-foreground">Our team is here to help you get started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="h-10 text-sm gap-1.5">
              <a href={`mailto:${founderEmail}?subject=StudyOS%20Pricing%20Question`}>Contact founder</a>
            </Button>
            <Link href="/login">
              <Button className="h-10 text-sm gap-1.5">
                Start free <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
