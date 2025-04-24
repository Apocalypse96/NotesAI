"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NoteCard from "@/components/NoteCard";
import { useSummarize } from "@/hooks/useSummarize";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagsInput } from "@/components/TagsInput";
import { SearchBar } from "@/components/SearchBar";
import { motion } from "framer-motion";
import { PaperCard } from "@/components/ui/PaperCard";
import { notesAnimations } from "@/styles/notes-theme";
import { BookOpen, FileText, Plus, Search, Book, Sparkles } from "lucide-react";
import { NoteColorPicker } from "@/components/NoteColorPicker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EmptyNotesState } from "@/components/EmptyNotesState";
import { enhancedAnimations } from "@/styles/enhanced-theme";
import { paperTextures } from "@/styles/paper-textures";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  tags?: string[]; // This is not a database column, but a derived property
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [noteColor, setNoteColor] = useState<
    "default" | "cream" | "yellow" | "blue" | "pink" | "green"
  >("default");
  const [noteStyle, setNoteStyle] = useState<
    "lined" | "grid" | "dots" | "aged"
  >("lined");
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const supabase = createSupabaseClient();
  const router = useRouter();
  const { summarize, isLoading: isSummarizing } = useSummarize();

  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || []))
  ).sort();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, redirecting to login");
        router.push("/login");
        return;
      }
      console.log("Session found:", session.user);
      fetchNotes();
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    let result = [...notes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.tags &&
            note.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    if (activeTag) {
      result = result.filter(
        (note) => note.tags && note.tags.includes(activeTag)
      );
    }

    result = sortNotes(result, sortBy);

    setFilteredNotes(result);
  }, [notes, searchQuery, activeTag, sortBy]);

  const sortNotes = (
    notesToSort: Note[],
    sortType: "newest" | "oldest" | "title"
  ) => {
    switch (sortType) {
      case "newest":
        return [...notesToSort].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return [...notesToSort].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "title":
        return [...notesToSort].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return notesToSort;
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setNotes([]);
        setFilteredNotes([]);
        return;
      }

      try {
        await supabase.from("notes").select("*").limit(1);
      } catch (error) {
        console.error("Notes table might not exist:", error);
        toast.error(
          "Database setup required. Please run the schema.sql file in Supabase."
        );
        return;
      }

      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("user_id", session.user.id);

      if (notesError) throw notesError;

      if (!notesData || notesData.length === 0) {
        setNotes([]);
        setFilteredNotes([]);
        return;
      }

      const noteIds = notesData.map((note) => note.id);

      const { data: noteTagsData, error: noteTagsError } = await supabase
        .from("notes_tags")
        .select("note_id, tags(id, name)")
        .in("note_id", noteIds);

      if (noteTagsError) throw noteTagsError;

      const noteTags: Record<string, string[]> = {};

      if (noteTagsData) {
        noteTagsData.forEach((relation) => {
          if (!noteTags[relation.note_id]) {
            noteTags[relation.note_id] = [];
          }
          if (relation.tags && relation.tags.name) {
            noteTags[relation.note_id].push(relation.tags.name);
          }
        });
      }

      const notesWithTags = notesData.map((note) => ({
        ...note,
        tags: noteTags[note.id] || [],
      }));

      setNotes(notesWithTags);
      setFilteredNotes(sortNotes(notesWithTags, sortBy));
    } catch (error: any) {
      console.error("Error fetching notes:", error.message);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setIsCreating(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("You must be logged in to create notes");
        return;
      }

      // Add the color and style as metadata in the content
      const metadataContent = `<!-- noteColor: ${noteColor}, noteStyle: ${noteStyle} -->\n${content}`;

      const { data: noteData, error: noteError } = await supabase
        .from("notes")
        .insert([
          {
            title,
            content: metadataContent,
            user_id: session.user.id,
          },
        ])
        .select();

      if (noteError) throw noteError;
      if (!noteData || noteData.length === 0)
        throw new Error("Failed to create note");

      const newNote = noteData[0];

      if (tags.length > 0) {
        for (const tagName of tags) {
          const { data: existingTags, error: tagQueryError } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tagName.toLowerCase())
            .maybeSingle();

          if (tagQueryError) throw tagQueryError;

          let tagId;

          if (!existingTags) {
            const { data: newTag, error: tagCreateError } = await supabase
              .from("tags")
              .insert([{ name: tagName.toLowerCase() }])
              .select("id")
              .single();

            if (tagCreateError) throw tagCreateError;
            tagId = newTag.id;
          } else {
            tagId = existingTags.id;
          }

          const { error: junctionError } = await supabase
            .from("notes_tags")
            .insert([
              {
                note_id: newNote.id,
                tag_id: tagId,
              },
            ]);

          if (junctionError) throw junctionError;
        }
      }

      toast.success("Note created successfully");
      setTitle("");
      setContent("");
      setTags([]);
      setNoteColor("default");
      setNoteStyle("lined");
      fetchNotes();
    } catch (error: any) {
      console.error("Error creating note:", error.message);
      toast.error("Failed to create note");
    } finally {
      setIsCreating(false);
    }
  };

  const extractNoteStyles = (content: string) => {
    const metaMatch = content.match(
      /<!-- noteColor: (.*?), noteStyle: (.*?) -->/
    );
    if (metaMatch) {
      return {
        color: metaMatch[1] as
          | "default"
          | "cream"
          | "yellow"
          | "blue"
          | "pink"
          | "green",
        style: metaMatch[2] as "lined" | "grid" | "dots" | "aged",
        contentWithoutMeta: content
          .replace(/<!-- noteColor: (.*?), noteStyle: (.*?) -->/, "")
          .trim(),
      };
    }
    return {
      color: "default" as const,
      style: "lined" as const,
      contentWithoutMeta: content,
    };
  };

  const updateNote = async (
    id: string,
    title: string,
    content: string,
    tagArray: string[]
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("You must be logged in to update notes");
        return;
      }

      const { error: noteUpdateError } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (noteUpdateError) throw noteUpdateError;

      const { error: deleteJunctionError } = await supabase
        .from("notes_tags")
        .delete()
        .eq("note_id", id);

      if (deleteJunctionError) throw deleteJunctionError;

      if (tagArray.length > 0) {
        for (const tagName of tagArray) {
          const { data: existingTags, error: tagQueryError } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tagName.toLowerCase())
            .maybeSingle();

          if (tagQueryError) throw tagQueryError;

          let tagId;

          if (!existingTags) {
            const { data: newTag, error: tagCreateError } = await supabase
              .from("tags")
              .insert([{ name: tagName.toLowerCase() }])
              .select("id")
              .single();

            if (tagCreateError) throw tagCreateError;
            tagId = newTag.id;
          } else {
            tagId = existingTags.id;
          }

          const { error: junctionError } = await supabase
            .from("notes_tags")
            .insert([
              {
                note_id: id,
                tag_id: tagId,
              },
            ]);

          if (junctionError) throw junctionError;
        }
      }

      toast.success("Note updated successfully");
      fetchNotes();
    } catch (error: any) {
      console.error("Error updating note:", error.message);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("You must be logged in to delete notes");
        return;
      }

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast.success("Note deleted successfully");
      fetchNotes();
    } catch (error: any) {
      console.error("Error deleting note:", error.message);
      toast.error("Failed to delete note");
    }
  };

  const handleSummarizeNote = (id: string, content: string) => {
    if (!content.trim()) {
      toast.error("Note content is empty, nothing to summarize");
      return;
    }

    toast.info("Generating summary...");

    summarize(content, {
      onSuccess: (summary) => {
        const note = notes.find((note) => note.id === id);
        if (!note) {
          toast.error("Note not found");
          return;
        }

        const summaryHeader = "\n\n## Summary\n";
        const summaryRegex = /\n\n## Summary\n[\s\S]*$/;

        let newContent;
        if (content.match(summaryRegex)) {
          newContent = content.replace(summaryRegex, summaryHeader + summary);
        } else {
          newContent = content + summaryHeader + summary;
        }

        updateNote(id, note.title, newContent, note.tags || []);

        toast.success("Summary added to your note");
      },
    });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-full">
            <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold">My Notes</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Create and organize your thoughts with AI-powered assistance
        </p>
      </motion.div>

      {/* Create New Note Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <PaperCard
          variant={noteStyle}
          color={noteColor}
          className="p-6"
          hasClip={true}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold">Create New Note</h2>
          </div>

          <form onSubmit={createNote} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your note here..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <TagsInput
                value={tags}
                onChange={setTags}
                placeholder="Add tags (press Enter after each tag)..."
              />
            </div>

            {/* Note appearance options */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div>
                <label className="text-xs font-medium block mb-1 text-muted-foreground">
                  Note Color
                </label>
                <NoteColorPicker value={noteColor} onChange={setNoteColor} />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1 text-muted-foreground">
                  Paper Style
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 h-8 px-2 border-dashed"
                    >
                      <div
                        className="h-3 w-3 rounded-sm border border-gray-300"
                        style={{
                          backgroundImage: paperTextures[noteStyle],
                          backgroundSize: "cover",
                        }}
                      />
                      <span className="capitalize">{noteStyle}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setNoteStyle("lined")}>
                      Lined Paper
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setNoteStyle("grid")}>
                      Grid Paper
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setNoteStyle("dots")}>
                      Dot Paper
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setNoteStyle("aged")}>
                      Aged Paper
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex justify-end">
              <LoadingButton
                type="submit"
                isLoading={isCreating}
                loadingText="Creating..."
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Create Note
              </LoadingButton>
            </div>
          </form>
        </PaperCard>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <SearchBar
          onSearch={setSearchQuery}
          onFilterByTag={setActiveTag}
          onSortChange={setSortBy}
          availableTags={allTags}
          className="w-full md:max-w-xl mx-auto border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm"
        />
      </motion.div>

      {/* Notes Collection */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Book className="h-5 w-5 text-blue-500" />
          Your Notes
        </h2>
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}{" "}
          found
        </div>
      </div>

      {/* Notes Grid with Staggered Animation */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={notesAnimations.staggerContainer}
        initial="initial"
        animate="animate"
      >
        {loading ? (
          // Loading skeletons
          Array(6)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={enhancedAnimations.noteAppear}
                className="h-64 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900 animate-pulse relative overflow-hidden"
              >
                {/* Decorative loading elements */}
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded absolute top-4 left-4"></div>
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-800 rounded absolute top-10 left-4"></div>
                <div className="h-32 w-5/6 bg-gray-200 dark:bg-gray-800 rounded absolute top-16 left-4"></div>
              </motion.div>
            ))
        ) : filteredNotes.length === 0 ? (
          // Empty state
          <EmptyNotesState
            message={
              activeTag || searchQuery
                ? "No matching notes found"
                : "No notes yet"
            }
          />
        ) : (
          // Notes list
          filteredNotes.map((note, index) => {
            const { color, style, contentWithoutMeta } = extractNoteStyles(
              note.content
            );
            const noteWithCleanContent = {
              ...note,
              content: contentWithoutMeta,
            };

            return (
              <motion.div
                key={note.id}
                variants={notesAnimations.listItem}
                layoutId={note.id}
              >
                <PaperCard
                  onClick={() => {}} // For ripple effect
                  className="h-full"
                  variant={style}
                  color={color}
                  index={index}
                  hasRipple
                  hasClip={index % 3 === 0} // Add paper clip to every third note
                >
                  <NoteCard
                    note={noteWithCleanContent}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                    onSummarize={handleSummarizeNote}
                  />
                </PaperCard>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
