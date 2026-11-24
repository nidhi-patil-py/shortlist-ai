# Supabase Database Setup & Configuration

This directory contains the database schema and Row Level Security (RLS) setup for **Shortlist AI**.

## Step 1: Create a Supabase Project
1. Visit [https://supabase.com](https://supabase.com) and create a free project named `shortlist-ai`.
2. Navigate to **Project Settings > API**.
3. Copy your:
   - **Project URL** (`https://<project-id>.supabase.co`)
   - **anon public key** (`eyJ...`)

## Step 2: Apply the Database Schema
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the entire contents of `supabase/schema.sql`.
4. Click **Run**.

This script sets up:
- 7 relational tables (`profiles`, `education`, `skills`, `experience`, `projects`, `certifications`, `resumes`)
- Foreign key constraints with `on delete cascade`
- Performance indexes on `user_id`
- Row Level Security (RLS) policies guaranteeing that users can only select, insert, update, or delete their own data.
- Trigger `handle_new_user` to automatically populate a user profile upon registration.

## Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Local Demo Mode
If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are omitted or left empty, Shortlist AI automatically switches to **Local Demo Mode** using local browser storage with strict user isolation, allowing offline evaluation without configuring a database.
