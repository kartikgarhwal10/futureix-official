-- ========================================================
-- FUTUREIX CMS Database Migration
-- Version: 20261013000000
-- Description: Complete schema for blog management, media,
--              categories, tags, admin profiles, and hardened
--              Row Level Security (RLS) policies.
-- ========================================================

-- 1. Admin Profiles Table (Enterprise Role Management)
create table if not exists public.admin_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    role text not null check (role in ('superadmin', 'admin', 'editor')),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 2. Categories Table
create table if not exists public.categories (
    id text primary key,
    name text not null,
    slug text not null unique,
    description text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_categories_slug on public.categories(slug);

-- 3. Tags Table
create table if not exists public.tags (
    id text primary key,
    name text not null,
    slug text not null unique,
    created_at timestamptz default now() not null
);

create index if not exists idx_tags_slug on public.tags(slug);

-- 4. Blogs Table
create table if not exists public.blogs (
    id text primary key,
    slug text not null unique,
    title text not null,
    meta_title text,
    meta_description text,
    excerpt text,
    content_html text,
    content_raw text,
    category text not null,
    read_time text default '5 min read',
    published_at timestamptz,
    scheduled_at timestamptz,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    deleted_at timestamptz,
    author jsonb not null,
    tags text[] default '{}'::text[],
    featured boolean default false,
    theme_gradient text default 'from-electric-blue/20 to-purple/20',
    image text not null,
    image_alt text,
    primary_keyword text,
    secondary_keywords text[] default '{}'::text[],
    canonical_url text,
    og_title text,
    og_description text,
    og_image text,
    status text not null default 'draft' check (status in ('draft', 'published', 'scheduled', 'archived')),
    sections jsonb default '[]'::jsonb,
    faqs jsonb default '[]'::jsonb,
    related_service jsonb
);

-- Indexes for optimal performance
create index if not exists idx_blogs_slug on public.blogs(slug);
create index if not exists idx_blogs_status on public.blogs(status);
create index if not exists idx_blogs_published_at on public.blogs(published_at);
create index if not exists idx_blogs_scheduled_at on public.blogs(scheduled_at);
create index if not exists idx_blogs_category on public.blogs(category);
create index if not exists idx_blogs_featured on public.blogs(featured);
create index if not exists idx_blogs_deleted_at on public.blogs(deleted_at);

-- 5. Media Table
create table if not exists public.media (
    id text primary key,
    filename text not null,
    url text not null,
    alt_text text,
    size bigint default 0,
    mime_type text,
    created_at timestamptz default now() not null
);

-- 6. CMS Settings Table
create table if not exists public.cms_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now() not null
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) HARDENING
-- ========================================================

alter table public.admin_profiles enable row level security;
alter table public.blogs enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.media enable row level security;
alter table public.cms_settings enable row level security;

-- Security Definer Function to verify administrator privileges
-- This function runs with security definer privileges and prevents self-escalation
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and role in ('superadmin', 'admin')
  );
$$;

-- 1. Admin Profiles RLS Policies:
-- Only authenticated users who are ALREADY verified admins can inspect or modify admin profiles.
-- Regular authenticated users and anonymous users CANNOT read or write admin profiles.
create policy "Admins can view admin profiles"
    on public.admin_profiles
    for select
    to authenticated
    using (public.is_admin());

create policy "Admins can manage admin profiles"
    on public.admin_profiles
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 2. Blogs RLS Policies:
-- A. Public (anon and regular authenticated users) can ONLY read published, non-deleted, non-scheduled posts
create policy "Public can read published blogs"
    on public.blogs
    for select
    to anon, authenticated
    using (
        status = 'published'
        and (scheduled_at is null or scheduled_at <= now())
        and deleted_at is null
    );

-- B. Verified administrators can read ALL posts (including drafts, scheduled, deleted)
create policy "Admins can read all blogs"
    on public.blogs
    for select
    to authenticated
    using (public.is_admin());

-- C. ONLY verified administrators can insert, update, or delete blogs
create policy "Admins can insert blogs"
    on public.blogs
    for insert
    to authenticated
    with check (public.is_admin());

create policy "Admins can update blogs"
    on public.blogs
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "Admins can delete blogs"
    on public.blogs
    for delete
    to authenticated
    using (public.is_admin());

-- 3. Categories RLS Policies:
create policy "Public can read categories"
    on public.categories
    for select
    to anon, authenticated
    using (true);

create policy "Admins can manage categories"
    on public.categories
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 4. Tags RLS Policies:
create policy "Public can read tags"
    on public.tags
    for select
    to anon, authenticated
    using (true);

create policy "Admins can manage tags"
    on public.tags
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 5. Media Table RLS Policies:
create policy "Public can read media metadata"
    on public.media
    for select
    to anon, authenticated
    using (true);

create policy "Admins can manage media metadata"
    on public.media
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 6. CMS Settings RLS Policies:
create policy "Public can read public settings"
    on public.cms_settings
    for select
    to anon, authenticated
    using (true);

create policy "Admins can manage settings"
    on public.cms_settings
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- ========================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION & POLICIES
-- ========================================================

-- Create or update public storage bucket for blog media
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'blog-media',
    'blog-media',
    true,
    5242880, -- 5MB limit
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
on conflict (id) do update set
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

-- Storage RLS: Public can view assets
create policy "Public can read blog media"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'blog-media');

-- Storage RLS: ONLY verified administrators can upload, update, or delete
create policy "Admins can upload blog media"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'blog-media' and public.is_admin());

create policy "Admins can update blog media"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'blog-media' and public.is_admin());

create policy "Admins can delete blog media"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'blog-media' and public.is_admin());
