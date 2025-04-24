-- This SQL file contains the database schema for NotesAI

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  user_id UUID NULL,
  is_public BOOLEAN NULL DEFAULT false,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id),
  CONSTRAINT tags_name_key UNIQUE (name)
);

-- Junction table for notes and tags
CREATE TABLE IF NOT EXISTS public.notes_tags (
  note_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  CONSTRAINT notes_tags_pkey PRIMARY KEY (note_id, tag_id),
  CONSTRAINT notes_tags_note_id_fkey FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
  CONSTRAINT notes_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_tags ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY IF NOT EXISTS "Users can view their own notes" 
ON public.notes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own notes" 
ON public.notes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own notes" 
ON public.notes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own notes" 
ON public.notes FOR DELETE 
USING (auth.uid() = user_id);

-- Tags policies - Tags are shared resources
CREATE POLICY IF NOT EXISTS "Anyone can view tags" 
ON public.tags FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can insert tags" 
ON public.tags FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Junction table policies
CREATE POLICY IF NOT EXISTS "Users can view their note tags" 
ON public.notes_tags FOR SELECT 
USING (note_id IN (
  SELECT id FROM public.notes WHERE user_id = auth.uid()
));

CREATE POLICY IF NOT EXISTS "Users can link tags to their notes" 
ON public.notes_tags FOR INSERT 
WITH CHECK (note_id IN (
  SELECT id FROM public.notes WHERE user_id = auth.uid()
));

CREATE POLICY IF NOT EXISTS "Users can unlink tags from their notes" 
ON public.notes_tags FOR DELETE 
USING (note_id IN (
  SELECT id FROM public.notes WHERE user_id = auth.uid()
));
