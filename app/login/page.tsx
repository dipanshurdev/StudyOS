"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Loader2, Mail, CheckCircle2, Eye, EyeOff,
  Sparkles, Brain, Zap, GitBranch
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Zap, text: "AI summaries in seconds" },
  { icon: Brain, text: "Smart flashcards & spaced repetition" },
  { icon: GitBranch, text: "Mind maps from any topic" },
  { icon: Sparkles, text: "Unlimited AI tutor chat" },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      const productionUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://studyos-ai.vercel.app";
      const callbackUrl =
        typeof window !== "undefined" && !window.location.hostname.includes("localhost")
          ? `${productionUrl}/auth/callback`
          : `${location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error("Sign in failed", { description: err.message });
      setIsLoading(false);
    }
  }

  async function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsLoading(true);
    const target = e.target as typeof e.target & { email: { value: string }; password: { value: string } };
    const email = target.email.value;
    const password = target.password.value;
    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });
        if (error) throw error;
        if (data.user?.identities?.length === 0) {
          toast.warning("Account exists", { description: "Please sign in instead." });
          setIsSignUp(false);
        } else if (data.session) {
          window.location.href = "/dashboard";
          return;
        } else {
          setCheckEmail(true);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast.error("Email not verified", {
              description: "Check your inbox.",
              action: {
                label: "Resend",
                onClick: async () => {
                  await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
                  toast.success("Verification email resent");
                },
              },
            });
            setIsLoading(false);
            return;
          }
          throw error;
        }
        window.location.href = "/dashboard";
        return;
      }
    } catch (err: any) {
      toast.error(isSignUp ? "Sign up failed" : "Sign in failed", {
        description: err.message === "Invalid login credentials" ? "Invalid email or password" : err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Check your inbox</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent a verification link to your email. Click it to activate your account.
          </p>
          <Button variant="outline" size="sm" onClick={() => setCheckEmail(false)} className="gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col relative bg-[oklch(0.115_0.016_264)] dark:bg-[oklch(0.09_0.016_264)] overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full dot-grid opacity-20" />
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-500/15 blur-[80px]" />
        </div>
        {/* Logo */}
        <div className="relative z-10 p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
              <img src="/logo.png" alt="StudyOS" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">StudyOS</span>
          </Link>
        </div>
        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Study smarter,<br />
            <span className="text-primary">not harder.</span>
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-xs">
            AI-powered tools that turn your notes into summaries, flashcards, and exam prep — in seconds.
          </p>
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-white/8 flex items-center justify-center border border-white/10 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-white/75">{text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Social proof */}
        <div className="relative z-10 px-10 pb-8">
          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-sm text-white/75 italic leading-relaxed mb-3">
              "Summaries, flashcards, and the AI tutor in one place. I actually look forward to studying now."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-white">S</div>
              <span className="text-xs text-white/50">Student, University</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="StudyOS" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold text-foreground">StudyOS</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Free to start · No credit card required" : "Sign in to continue to your workspace"}
            </p>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-10 gap-2.5 font-medium"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 488 512" fill="currentColor">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required disabled={isLoading} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password" name="password" type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required disabled={isLoading} className="h-10 pr-10"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-10 font-semibold" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              {isSignUp ? "Sign in" : "Sign up free"}
            </button>
          </p>

          {isSignUp && (
            <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link href="#" className="underline underline-offset-2">Terms</Link> and{" "}
              <Link href="#" className="underline underline-offset-2">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
