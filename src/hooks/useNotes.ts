"use client";

import { createSupabaseClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: string[];
};

interface NoteError {
  message: string;
}

export function useNotes() {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();

  // Fetch all notes
  const {
    data: notes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return [];
      }

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Note[];
    },
  });

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async ({
      title,
      content,
    }: {
      title: string;
      content: string;
    }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to create notes");
      }

      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title,
            content,
            user_id: session.user.id,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      return data[0] as Note;
    },
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: NoteError) => {
      toast.error(error.message || "Failed to create note");
    },
  });

  // Update a note
  const updateNoteMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      content,
    }: {
      id: string;
      title: string;
      content: string;
    }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to update notes");
      }

      const { data, error } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select();

      if (error) {
        throw error;
      }

      return data[0] as Note;
    },
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: NoteError) => {
      toast.error(error.message || "Failed to update note");
    },
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to delete notes");
      }

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: NoteError) => {
      toast.error(error.message || "Failed to delete note");
    },
  });

  return {
    notes,
    isLoading,
    error,
    refetch,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
}
