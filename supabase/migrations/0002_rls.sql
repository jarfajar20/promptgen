-- ============================================================
-- Helper (SECURITY DEFINER => bypass RLS, mencegah rekursi policy)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_approved = true
  );
$$;

create or replace function public.is_approved()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_approved = true
  );
$$;

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ( id = auth.uid() );

create policy "profiles_select_admin"
  on public.profiles for select to authenticated
  using ( public.is_admin() );

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ( id = auth.uid() )
  with check ( id = auth.uid() );

create policy "profiles_update_admin"
  on public.profiles for update to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Tidak ada policy INSERT/DELETE: baris hanya lahir dari trigger auth.users.

-- ============================================================
-- GUARD: cegah user menaikkan dirinya sendiri jadi approved/admin
-- ============================================================
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  -- Tanpa JWT subject => konteks tepercaya (service_role / SQL editor)
  if auth.uid() is null then
    return new;
  end if;

  if new.role          is distinct from old.role
     or new.is_approved is distinct from old.is_approved
     or new.approved_at is distinct from old.approved_at
     or new.approved_by is distinct from old.approved_by
     or new.email       is distinct from old.email
     or new.id          is distinct from old.id
  then
    if not public.is_admin() then
      raise exception 'Akses ditolak: hanya admin yang dapat mengubah status persetujuan atau role.'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create trigger profiles_guard_privileges
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();
