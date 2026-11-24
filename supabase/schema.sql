-- ==============================================================================
-- Shortlist AI Supabase PostgreSQL Database Schema
-- Version: 1.1.0
-- Architecture: Row Level Security (RLS) with strict User Isolation
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Master personal details)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null default '',
  email text not null default '',
  phone text default '',
  location text default '',
  professional_title text default '',
  professional_summary text default '',
  linkedin_url text default '',
  github_url text default '',
  portfolio_url text default '',
  other_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Education Table
create table if not exists public.education (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  degree text not null,
  institution text not null,
  field_of_study text default '',
  start_date text not null default '',
  end_date text not null default '',
  grade text default '',
  description text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Skills Table
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text check (category in ('technical', 'soft', 'tools')) not null default 'technical',
  level text check (level in ('beginner', 'intermediate', 'advanced')) default 'intermediate',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Experience Table
create table if not exists public.experience (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  job_title text not null,
  start_date text not null default '',
  end_date text not null default '',
  duration text default '',
  responsibilities text[] default array[]::text[],
  achievements text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Projects Table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text not null default '',
  technologies text[] default array[]::text[],
  project_link text default '',
  start_date text default '',
  end_date text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Certifications Table
create table if not exists public.certifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  issuing_org text not null default '',
  issue_date text not null default '',
  credential_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Resumes Table (Generated & Job-Matched Resumes)
create table if not exists public.resumes (
  id text primary key default uuid_generate_v4()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled Resume',
  target_job_title text default '',
  job_description text default '',
  template_id text not null default 'ats-classic',
  personal jsonb not null default '{}'::jsonb,
  education jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  ats_score integer default 0,
  matched_keywords text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- Indexes for High Performance Querying
-- ==============================================================================
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_education_user_id on public.education(user_id);
create index if not exists idx_skills_user_id on public.skills(user_id);
create index if not exists idx_experience_user_id on public.experience(user_id);
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_certifications_user_id on public.certifications(user_id);
create index if not exists idx_resumes_user_id on public.resumes(user_id);

-- ==============================================================================
-- Enable Row Level Security (RLS) on all tables
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.resumes enable row level security;

-- ==============================================================================
-- RLS Policies: Strict Isolation (Users can ONLY view/edit their own data)
-- ==============================================================================

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- Education Policies
create policy "Users can view own education"
  on public.education for select
  using (auth.uid() = user_id);

create policy "Users can insert own education"
  on public.education for insert
  with check (auth.uid() = user_id);

create policy "Users can update own education"
  on public.education for update
  using (auth.uid() = user_id);

create policy "Users can delete own education"
  on public.education for delete
  using (auth.uid() = user_id);

-- Skills Policies
create policy "Users can view own skills"
  on public.skills for select
  using (auth.uid() = user_id);

create policy "Users can insert own skills"
  on public.skills for insert
  with check (auth.uid() = user_id);

create policy "Users can update own skills"
  on public.skills for update
  using (auth.uid() = user_id);

create policy "Users can delete own skills"
  on public.skills for delete
  using (auth.uid() = user_id);

-- Experience Policies
create policy "Users can view own experience"
  on public.experience for select
  using (auth.uid() = user_id);

create policy "Users can insert own experience"
  on public.experience for insert
  with check (auth.uid() = user_id);

create policy "Users can update own experience"
  on public.experience for update
  using (auth.uid() = user_id);

create policy "Users can delete own experience"
  on public.experience for delete
  using (auth.uid() = user_id);

-- Projects Policies
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Certifications Policies
create policy "Users can view own certifications"
  on public.certifications for select
  using (auth.uid() = user_id);

create policy "Users can insert own certifications"
  on public.certifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own certifications"
  on public.certifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own certifications"
  on public.certifications for delete
  using (auth.uid() = user_id);

-- Resumes Policies
create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- Automatic User Profile Creation Trigger on Signup
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
