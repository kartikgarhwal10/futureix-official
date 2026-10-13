-- ========================================================
-- FUTUREIX CMS Database Migration
-- Version: 20261013000000
-- Description: Complete schema for blog management, media,
--              categories, tags, and Row Level Security (RLS)
-- ========================================================

-- 1. Categories Table
create table if not exists public.categories (
    id text primary key,
    name text not null,
    slug text not null unique,
    description text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_categories_slug on public.categories(slug);

-- 2. Tags Table
create table if not exists public.tags (
    id text primary key,
    name text not null,
    slug text not null unique,
    created_at timestamptz default now() not null
);

create index if not exists idx_tags_slug on public.tags(slug);

-- 3. Blogs Table
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
create index if not exists idx_blogs_category on public.blogs(category);
create index if not exists idx_blogs_featured on public.blogs(featured);
create index if not exists idx_blogs_deleted_at on public.blogs(deleted_at);

-- 4. Media Table
create table if not exists public.media (
    id text primary key,
    filename text not null,
    url text not null,
    alt_text text,
    size bigint default 0,
    mime_type text,
    created_at timestamptz default now() not null
);

-- 5. CMS Settings Table
create table if not exists public.cms_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now() not null
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

alter table public.blogs enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.media enable row level security;
alter table public.cms_settings enable row level security;

-- Blogs RLS
-- A. Public can read ONLY published, non-deleted, non-scheduled posts
create policy "Public can read published blogs"
    on public.blogs
    for select
    to anon, authenticated
    using (
        status = 'published'
        and (scheduled_at is null or scheduled_at <= now())
        and deleted_at is null
    );

-- B. Authenticated admin users can perform all operations
create policy "Authenticated users can manage all blogs"
    on public.blogs
    for all
    to authenticated
    using (true)
    with check (true);

-- Categories RLS
create policy "Public can read categories"
    on public.categories
    for select
    to anon, authenticated
    using (true);

create policy "Authenticated users can manage categories"
    on public.categories
    for all
    to authenticated
    using (true)
    with check (true);

-- Tags RLS
create policy "Public can read tags"
    on public.tags
    for select
    to anon, authenticated
    using (true);

create policy "Authenticated users can manage tags"
    on public.tags
    for all
    to authenticated
    using (true)
    with check (true);

-- Media RLS
create policy "Public can read media"
    on public.media
    for select
    to anon, authenticated
    using (true);

create policy "Authenticated users can manage media"
    on public.media
    for all
    to authenticated
    using (true)
    with check (true);

-- Settings RLS
create policy "Public can read settings"
    on public.cms_settings
    for select
    to anon, authenticated
    using (true);

create policy "Authenticated users can manage settings"
    on public.cms_settings
    for all
    to authenticated
    using (true)
    with check (true);

-- ========================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ========================================================

-- Insert storage bucket if not exists
insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', true)
on conflict (id) do update set public = true;

-- Storage RLS: Public read
create policy "Public can read blog media"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'blog-media');

-- Storage RLS: Authenticated write
create policy "Authenticated users can upload blog media"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'blog-media');

create policy "Authenticated users can update blog media"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'blog-media');

create policy "Authenticated users can delete blog media"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'blog-media');
