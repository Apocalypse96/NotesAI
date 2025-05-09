"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";

interface AuthError {
  message: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Logged in successfully");
      // Explicitly redirect to notes page instead of root
      router.push("/notes");
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error("Error logging in:", authError.message);
      toast.error(authError.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;

      // The redirect will happen automatically
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || "An error occurred during Google sign in");
      console.error("Google sign in error:", authError);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="flex-1 hidden lg:block relative">
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">Welcome to NotesAI</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your smart note-taking assistant with AI-powered summaries and
              organization.
            </p>
            <Image
              src="/login-illustration.svg"
              alt="NotesAI Illustration"
              width={500}
              height={500}
              className="drop-shadow-md"
              priority
            />
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign In
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sign In Button */}
              <LoadingButton
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                isLoading={googleLoading}
                loadingText="Signing in..."
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </LoadingButton>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <FiMail className="text-primary" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all focus-within:ring-2 focus-within:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <FiLock className="text-primary" />
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="transition-all focus-within:ring-2 focus-within:ring-primary/20"
                  />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2"
                  >
                    <FiAlertCircle />
                    {error}
                  </motion.div>
                )}
                <LoadingButton
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </LoadingButton>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
