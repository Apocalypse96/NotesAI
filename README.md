# NotesAI - Smart Note Taking App

NotesAI is a full-stack application that allows users to create, edit, and manage notes with AI-powered summarization capabilities.

## Features

- **Authentication**: Sign up and log in with email/password or Google OAuth
- **Notes Management**: Create, edit, and delete notes
- **AI Summarization**: Automatically summarize your notes with one click
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Supabase (Authentication, Database)
- **State Management**: React Query
- **AI Integration**: Groq API for summarization
- **Deployment**: Vercel

## Project Structure

```
notesai/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── api/              # API routes
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── notes/            # Notes page
│   │   └── profile/          # User profile page
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and libraries
│   └── middleware.ts         # Next.js middleware for auth protection
├── public/                   # Static assets
├── schema.sql                # Database schema for Supabase
└── .env.local                # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/notesai.git
cd notesai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

- Create a new Supabase project
- Run the `schema.sql` file in the Supabase SQL editor to set up the database tables
- If you're upgrading from a previous version, run the `migrations/remove_summary_column.sql` script to remove the summary column from the notes table
- Set up Google OAuth in the Supabase Auth settings (optional)

4. **Configure environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key (for AI summarization)
```

Note: For AI summarization, the application uses the Groq API. If the API key is not provided, a simple fallback summarization method will be used.

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## AI Summarization Implementation

The AI summarization feature uses the Groq API to generate concise summaries of note content. The implementation follows these steps:

1. When a user clicks the "Summarize" button on a note, the note content is sent to the Groq API.
2. The API processes the text using a large language model (LLama3-8B) and returns a concise summary.
3. The summary is embedded directly into the note content with a "## Summary" markdown header.
4. The note is updated with the new content that includes the summary section.
5. The UI automatically detects and displays the summary in a highlighted section.

This approach has several advantages:

- No need for a separate database column to store summaries
- Summaries are preserved when exporting or sharing notes
- Users can edit the summary if needed, just like any other part of the note
- The markdown format makes it easy to distinguish the summary section

If the Groq API key is not available, a fallback mechanism generates a simple summary based on the first sentence and word count.

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the application


