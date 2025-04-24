"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Sparkles,
  BrainCog,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  // Check if user is already logged in
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // If logged in, redirect to notes page
        router.push("/notes");
      } else {
        setLoading(false);
      }
    }

    checkSession();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <BookOpen className="mx-auto h-10 w-10 text-blue-500 mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to NotesAI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your intelligent note-taking companion. Create, organize, and
              enhance your notes with AI assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm"
            >
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
              <p className="text-muted-foreground">
                Automatically categorize and tag your notes for easy retrieval.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm"
            >
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                <BrainCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistance</h3>
              <p className="text-muted-foreground">
                Get suggestions, summaries, and enhancements powered by AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm"
            >
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Sync</h3>
              <p className="text-muted-foreground">
                Access your notes from any device with real-time
                synchronization.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to upgrade your note-taking?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who already use NotesAI.
          </p>
          <Button asChild size="lg" variant="secondary" className="group">
            <Link href="/signup">
              Get Started Now{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
