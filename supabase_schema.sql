-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  email text,
  avatar_url text,
  domains text, -- comma separated keywords
  location_1 text,
  location_2 text,
  location_3 text,
  daily_limit integer default 20,
  remote_only boolean default false,
  status text default 'active', -- 'active' or 'paused'
  emails_sent integer default 0,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies (using do block to avoid errors if they exist)
do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Public profiles are viewable by everyone.' and tablename = 'profiles') then
    create policy "Public profiles are viewable by everyone." on profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert their own profile.' and tablename = 'profiles') then
    create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile.' and tablename = 'profiles') then
    create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Create a table for activity logs
create table if not exists activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  action text not null,
  status text not null, -- 'success', 'info', 'warning', 'danger'
  details text,
  created_at timestamp with time zone default now()
);

alter table activity_logs enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own logs.' and tablename = 'activity_logs') then
    create policy "Users can view their own logs." on activity_logs for select using (auth.uid() = user_id);
  end if;
end $$;

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger first to ensure clean recreation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper to add missing columns to existing profiles table if needed
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='email') then
    alter table profiles add column email text;
  end if;
end $$;
