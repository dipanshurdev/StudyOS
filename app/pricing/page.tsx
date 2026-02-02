import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Zap,
  Crown,
  Building2,
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border/30">
        <Link href="/" className="flex items-center gap-2.5 group">
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
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Sign in</Button>
          </Link>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-primary">
              Simple, transparent pricing
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Choose the plan that fits you
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. No hidden fees. Upgrade or cancel anytime—all plans
            include our core AI tools.
          </p>
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            No credit card required for Free
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
          <div className="bg-gradient-to-br from-primary/10 to-background border-2 border-primary/50 rounded-2xl p-8 relative hover:shadow-xl transition-shadow">
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

            <Link href="/login" className="block">
              <Button className="w-full">Start Pro trial</Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">
              7-day free trial • Cancel anytime
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

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Contact sales
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 border-t border-border/30 pt-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Your data remains safe. You can export everything before canceling, and we keep your data for 30 days after cancellation.",
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes! Students with a valid .edu email get 50% off Pro plans. Contact support to verify your student status.",
              },
              {
                q: "Is there a free trial for Pro?",
                a: "Yes! Pro includes a 7-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
              },
              {
                q: "Can I use StudyOS offline?",
                a: "Currently, StudyOS requires an internet connection for AI features. Offline mode is coming soon for Pro users.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Contact support</Button>
            <Link href="/login">
              <Button>Start free trial</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
