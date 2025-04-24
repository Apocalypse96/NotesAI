import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq";use type definitions
import { Groq } from "groq-sdk";
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);Y || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);
// Initialize Groq client
const groqApiKey = process.env.GROQ_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;
export async function POST(request: NextRequest) {
  try {async function POST(request: NextRequest) {
    // Get the request body
    const { text, noteId } = await request.json();
    const { text, noteId } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    } return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const {oken = authHeader.split(" ")[1];
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Generate summary
    let summary: string;
    let summary: string;
    if (groqApiKey) {
      // Disable ESLint for the next line to avoid typing issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-anyg
      const groq = new (Groq as any)({ apiKey: groqApiKey });      const groq = new Groq({ apiKey: groqApiKey });

      const completion = await groq.chat.completions.create({ion = await groq.chat.completions.create({
        messages: [sages: [
          {
            role: "system",ystem",
            content:
              "You are an AI assistant that summarizes text. Provide a concise summary in 2-3 sentences.",  "You are an AI assistant that summarizes text. Provide a concise summary in 2-3 sentences.",
          },,
          {
            role: "user",
            content: `Summarize the following text:\n\n${text}`,content: `Summarize the following text:\n\n${text}`,
          },},
        ],
        model: "llama3-8b-8192",-8192",
        temperature: 0.5,,
        max_tokens: 200,ax_tokens: 200,
      });      });

      summary =
        completion.choices[0]?.message?.content || "Failed to generate summary";letion.choices[0]?.message?.content || "Failed to generate summary";
    } else {
      // Fallback to a simple algorithm if API key is not availablele algorithm if API key is not available
      const firstSentence =
        text.split(/[.!?]/).filter((s) => s.trim().length > 0)[0] || "";).length > 0)[0] || "";
      const wordCount = text.split(/\s+/).length;      const wordCount = text.split(/\s+/).length;

      summary = `This note contains ${wordCount} words. ${firstSentence.trim()}. The note covers key information that has been condensed in this summary.`; summary = `This note contains ${wordCount} words. ${firstSentence.trim()}. The note covers key information that has been condensed in this summary.`;
    }    }

    // If noteId is provided, update the note with the summaryis provided, update the note with the summary
    if (noteId) {
      const { error: updateError } = await supabasepdateError } = await supabase
        .from("notes")
        .update({ summary }) })
        .eq("id", noteId)
        .eq("user_id", user.id);        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating note with summary:", updateError); console.error("Error updating note with summary:", updateError);
      } }
    }    }

    return NextResponse.json({ summary });onse.json({ summary });
  } catch (error) {
    console.error("Error in summarize API:", error);ummarize API:", error);
    return NextResponse.json(
      { error: "Internal server error" },nal server error" },
      { status: 500 }{ status: 500 }
    ); );
  } }
}}

