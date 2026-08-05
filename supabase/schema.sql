-- UZHOU Hán Ngữ — database setup
-- Run this in Supabase > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id text primary key,
  name text not null,
  description text,
  active boolean not null default true
);

create table if not exists public.user_courses (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

insert into public.courses (id,name,description)
values
 ('hsk1','HSK 1','Khóa HSK 1'),
 ('hsk2','HSK 2','Khóa HSK 2'),
 ('hsk3','HSK 3','Khóa HSK 3'),
 ('hsk4','HSK 4','Khóa HSK 4')
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.user_courses enable row level security;

-- Students can read their own profile.
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

-- Students can read courses they are enrolled in.
create policy "user_courses_select_own"
on public.user_courses for select
to authenticated
using (user_id = auth.uid());

create policy "courses_select_authenticated"
on public.courses for select
to authenticated
using (true);

-- Create a profile automatically after signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- IMPORTANT:
-- Admin management policies should be added only after you have created
-- your own admin account. The starter intentionally avoids an unsafe
-- "everyone can edit permissions" policy.
