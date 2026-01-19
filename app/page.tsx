import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Zap, Brain, BarChart3, ChevronRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/10">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-xl bg-primary/5 p-1 border border-primary/10 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/20">
            <img src="/logo.png" alt="StudyOS Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Study<span className="text-primary">OS</span></h2>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="space-y-6 mb-12">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
            <p className="text-sm font-semibold text-primary">Free AI-powered studying</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
            Study faster, not harder
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get AI-powered summaries, explanations, and practice questions instantly. Study smarter and ace your exams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Get started free
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">No credit card needed. Free plan includes 5 AI actions daily.</p>
        </div>

        {/* Hero Visual */}
        <div className="relative mt-16 mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl blur-3xl" />
          <div className="relative bg-card border border-border/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature Demo Cards */}
              <div className="space-y-3 text-left">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Summarize</h3>
                <p className="text-sm text-muted-foreground">Transform long notes into concise summaries instantly</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Explain</h3>
                <p className="text-sm text-muted-foreground">
                  Break down complex topics into easy-to-understand language
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Practice</h3>
                <p className="text-sm text-muted-foreground">Generate exam questions to test your knowledge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-card/30 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why students choose StudyOS</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to study effectively, powered by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Free & Unlimited",
                description: "Start for free with 5 daily AI actions. No credit card required ever.",
                icon: CheckCircle2,
              },
              {
                title: "Instant Results",
                description: "Get summaries, explanations, and practice questions in seconds.",
                icon: Zap,
              },
              {
                title: "Your Study Notes",
                description: "Paste your notes and let AI transform them into study materials.",
                icon: Brain,
              },
              {
                title: "Track Progress",
                description: "See your improvements over time with usage statistics.",
                icon: BarChart3,
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="bg-background border border-border/50 rounded-xl p-8 hover:border-primary/50 transition-colors"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Everyone starts free. Upgrade when you're ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-background border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
            <p className="text-muted-foreground mb-6">Perfect for getting started</p>
            <p className="text-4xl font-bold text-foreground mb-2">$0</p>
            <p className="text-sm text-muted-foreground mb-8">Forever free</p>

            <ul className="space-y-4 mb-8">
              {["5 AI actions per day", "Unlimited documents", "Basic summaries"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full bg-transparent">
              Get started
            </Button>
          </div>

          {/* Pro Plan (Coming Soon) */}
          <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/50 rounded-xl p-8 relative">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Coming Soon
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6">For power students</p>
            <p className="text-4xl font-bold text-foreground mb-2">$9</p>
            <p className="text-sm text-muted-foreground mb-8">/month</p>

            <ul className="space-y-4 mb-8">
              {["Unlimited AI actions", "Advanced explanations", "Interview prep questions", "Export to PDF"].map(
                (item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ),
              )}
            </ul>

            <Button className="w-full" disabled>
              Coming soon
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary/5 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-foreground">Ready to study smarter?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students using AI to ace their exams. No credit card required.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Sign up free
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 StudyOS. All rights reserved.</p>
            <p>Built with care for students, by builders.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
