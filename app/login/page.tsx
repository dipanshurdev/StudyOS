"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error("Something went wrong", {
        description: error.message || "Failed to sign in with Google",
      });
      setIsLoading(false);
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        // Supabase returns an empty identities array if the user already exists
        if (
          data.user &&
          data.user.identities &&
          data.user.identities.length === 0
        ) {
          toast.warning("Account exists", {
            description: "Please sign in instead.",
          });
          setIsSignUp(false);
        } else if (data.session) {
          // User confirmed or auto-confirm is on — full redirect so cookies are sent
          window.location.href = "/dashboard";
          return;
        } else {
          // Success, but needs verification
          setCheckEmail(true);
          toast.success("Account created", {
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle common errors
          if (error.message.includes("Email not confirmed")) {
            toast.error("Email not verified", {
              description:
                "Please check your inbox and verify your email address.",
              action: {
                label: "Resend",
                onClick: async () => {
                  await supabase.auth.resend({
                    type: "signup",
                    email: email,
                    options: {
                      emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                  });
                  toast.success("Verification email resent");
                },
              },
            });
            setIsLoading(false);
            return;
          }
          throw error;
        }

        // Full redirect so server sees session cookie
        window.location.href = "/dashboard";
        return;
      }
    } catch (error: any) {
      toast.error(isSignUp ? "Sign up failed" : "Login failed", {
        description:
          error.message === "Invalid login credentials"
            ? "Invalid email or password"
            : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="container relative min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address. Please click
              the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCheckEmail(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md p-1.5 border border-white/30">
            <img
              src="/logo.png"
              alt="StudyOS Logo"
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          <span className="text-2xl font-black tracking-tight">StudyOS</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Summaries, flashcards, and the AI tutor in one place. I
              actually look forward to studying now.&rdquo;
            </p>
            <footer className="text-sm opacity-90">
              — Student, University
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 flex flex-col justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="text-center lg:text-left mb-2">
            <h1 className="text-lg font-semibold text-muted-foreground">
              {isSignUp ? "Join StudyOS" : "Sign in to StudyOS"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isSignUp
                ? "Get 10 free AI actions daily. No credit card required."
                : "Pick up where you left off—your study hub is one click away."}
            </p>
          </div>
          <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">
                {isSignUp ? "Create account" : "Welcome back"}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Use your email or sign in with Google"
                  : "Use your email or sign in with Google"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="google"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                      ></path>
                    </svg>
                  )}
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button disabled={isLoading} className="mt-2">
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                <span className="mr-1">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-primary"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
