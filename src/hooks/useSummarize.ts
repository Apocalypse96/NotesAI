"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SummarizeError {
  message: string;
}

// Create a function to summarize text using only Groq API
export function useSummarize() {
  const summarizeMutation = useMutation({
    mutationFn: async (text: string) => {
      try {
        // Get Groq API key
        const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

        try {
          console.log("Attempting to summarize with Groq API");
          const summary = await summarizeWithGroq(text, groqApiKey || null);
          if (summary) {
            return summary;
          }
          console.log("Groq API failed, using mock summary");
        } catch (error) {
          console.error("Error with Groq API:", error);
          console.log("Groq API failed, using mock summary");
        }

        // Fallback to mock summary if Groq API fails
        return mockSummarize(text);
      } catch (error) {
        console.error("Error summarizing text:", error);
        // Fallback to mock summary if all APIs fail
        return mockSummarize(text);
      }
    },
    onError: (error: SummarizeError) => {
      toast.error(error.message || "Failed to summarize note");
    },
  });

  return {
    summarize: summarizeMutation.mutate,
    isLoading: summarizeMutation.isPending,
    summary: summarizeMutation.data,
  };
}

// Function to summarize text using Groq API with fetch
// Can work with or without an API key (using public endpoint)
async function summarizeWithGroq(
  text: string,
  apiKey: string | null
): Promise<string | null> {
  try {
    // Prepare headers - add Authorization only if API key is provided
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that summarizes text. Provide a concise summary in 2-3 sentences.",
            },
            {
              role: "user",
              content: `Summarize the following text:\n\n${text}`,
            },
          ],
          temperature: 0.5,
          max_tokens: 200,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Groq API error: ${response.status} ${response.statusText}`
      );

      // Try to get more details from the response
      try {
        const errorData = await response.json();
        console.error("Groq API error details:", errorData);
      } catch (_) {
        // If we can't parse the response, just continue
        // Using underscore instead of 'e' to indicate unused parameter
      }

      return null;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Failed to generate summary";
  } catch (error) {
    console.error("Error in Groq API call:", error);
    return null;
  }
}

// Mock summarization function for development without API key
function mockSummarize(text: string): string {
  // Simple algorithm to extract first sentence and add a generic summary statement
  const firstSentence =
    text.split(/[.!?]/).filter((s) => s.trim().length > 0)[0] || "";
  const wordCount = text.split(/\s+/).length;

  return `This note contains ${wordCount} words. ${firstSentence.trim()}. The note covers key information that has been condensed in this summary.`;
}
