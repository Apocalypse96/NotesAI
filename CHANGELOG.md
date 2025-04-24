# Changelog

## [Unreleased]

### Changed

- **Summary Implementation**: Changed from using a separate database column to embedding summaries directly in note content
  - Summaries are now added to the note content with a "## Summary" markdown header
  - The UI automatically detects and displays the summary in a highlighted section
  - This approach eliminates the need for a separate database column
  - Summaries are preserved when exporting or sharing notes
  - Users can edit the summary if needed, just like any other part of the note

### Added

- Added `renderNoteContent` function to NoteCard component to display notes with embedded summaries
- Added migration script `migrations/remove_summary_column.sql` to remove the summary column from existing databases

### Removed

- Removed `summary` column from the notes table in the database schema
- Removed summary-related code from the useNotes hook
- Simplified the updateNote function to no longer handle the summary field separately

### Updated

- Updated README.md to reflect the new approach to summaries
- Updated the handleSummarizeNote function to embed summaries in note content
