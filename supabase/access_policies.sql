-- UZHOU: secure course-access policies
-- Run AFTER the base schema.sql.

-- Students can read only their own course grants.
drop policy if exists "user_courses_select_own" on public.user_courses;
create policy "user_courses_select_own"
on public.user_courses
for select
to authenticated
using (user_id = auth.uid());

-- Helper function: does the current logged-in user have an active course grant?
create or replace function public.has_active_course_access(p_course_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.user_courses uc
    where uc.user_id = auth.uid()
      and uc.course_id = p_course_id
      and (uc.expires_at is null or uc.expires_at > now())
  );
$$;

revoke all on function public.has_active_course_access(text) from public;
grant execute on function public.has_active_course_access(text) to authenticated;

-- Admin helper: checks the role stored in profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Admins can view all profiles and course grants.
drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "user_courses_admin_all" on public.user_courses;
create policy "user_courses_admin_all"
on public.user_courses for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
