"use client";

import { useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { useSummarize } from "@/hooks/useSummarize";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "./RichTextEditor";
import { TagsInput } from "./TagsInput";
import { NoteColorPicker } from "./NoteColorPicker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  FileText,
  Flag,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { noteColors, paperTextures } from "@/styles/notes-theme";

interface NoteCardProps {
  note: Note;
  onUpdate: (
    id: string,
    title: string,
    content: string,
    tags: string[],
    color?: string,
    style?: string
  ) => void;
  onDelete: (id: string) => void;
  onSummarize: (id: string, content: string) => void;
}

export default function NoteCard({
  note,
  onUpdate,
  onDelete,
  onSummarize,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [noteColor, setNoteColor] = useState<
    "default" | "cream" | "yellow" | "blue" | "pink" | "green"
  >("default");
  const [noteStyle, setNoteStyle] = useState<
    "lined" | "grid" | "dots" | "aged"
  >("lined");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { summarize, isLoading: isSummarizing } = useSummarize();

  useEffect(() => {
    const metaMatch = note.content.match(
      /<!-- noteColor: (.*?), noteStyle: (.*?) -->/
    );
    if (metaMatch) {
      setNoteColor(metaMatch[1] as any);
      setNoteStyle(metaMatch[2] as any);
    }
  }, [note.content]);

  const handleUpdate = () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    const metadataContent = `<!-- noteColor: ${noteColor}, noteStyle: ${noteStyle} -->\n${content}`;
    onUpdate(note.id, title, metadataContent, tags);
    setIsEditing(false);
  };

  const handleSummarize = () => {
    onSummarize(note.id, note.content);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasSummary = (content: string) => {
    return content.includes("\n\n## Summary\n");
  };

  const renderNoteContent = (content: string) => {
    const summaryMatch = content.match(/\n\n## Summary\n([\s\S]*?)$/);

    if (summaryMatch) {
      const mainContent = content.replace(/\n\n## Summary\n[\s\S]*?$/, "");
      const summary = summaryMatch[1];

      return (
        <>
          <div className="whitespace-pre-wrap mb-4 prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: mainContent }} />
          </div>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 rounded-md border"
            style={{
              background: noteColors.highlighter.yellow,
              borderColor: "rgba(0,0,0,0.05)",
            }}
          >
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <MessageSquare className="h-4 w-4" />
              AI Summary
            </h4>
            <p className="text-sm">{summary}</p>
          </motion.div>
        </>
      );
    }

    return (
      <div className="whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };

  return (
    <div>
      {!isEditing ? (
        <>
          <div className="mb-3">
            <h3 className="text-lg font-medium mb-1 line-clamp-1">
              {note.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(note.created_at)}
              </span>

              {hasSummary(note.content) && (
                <span
                  className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 
                      rounded-full px-2 py-0.5 text-xs inline-flex items-center"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Summarized
                </span>
              )}
            </div>
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="max-h-48 overflow-auto mb-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            {renderNoteContent(note.content)}
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2 text-blue-600 dark:text-blue-400"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              <LoadingButton
                size="sm"
                variant="ghost"
                onClick={handleSummarize}
                isLoading={isSummarizing}
                loadingText="Summarizing..."
                className="h-8 px-2 text-amber-600 dark:text-amber-400"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Summarize
              </LoadingButton>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 px-2 text-red-600 dark:text-red-400"
            >
              <Flag className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </>
      ) : (
        <>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-medium text-lg mb-3 border-dashed focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50"
            placeholder="Note title"
          />

          <div className="mb-3">
            <label className="text-xs font-medium mb-1 flex items-center gap-1 text-muted-foreground">
              <Tag className="h-3 w-3" />
              Tags
            </label>
            <TagsInput
              value={tags}
              onChange={setTags}
              placeholder="Add tags..."
              className="border-dashed focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-3">
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

          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your note here..."
            className="mb-3 border-dashed"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              className="gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        </>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this note?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(note.id);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
