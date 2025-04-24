-- Add summary column to notes table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'notes'
        AND column_name = 'summary'
    ) THEN
        ALTER TABLE notes ADD COLUMN summary TEXT;
    END IF;
END $$;