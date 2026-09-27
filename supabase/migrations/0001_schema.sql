-- ============================================================
-- Tipe & tabel
-- ============================================================
create type public.user_role as enum ('user', 'admin');

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text        not null default '',
  email        text        not null,
  role         public.user_role not null default 'user',
  is_approved  boolean     not null default false,
  approved_at  timestamptz,
  approved_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

comment on table public.profiles is 'Profil user + status persetujuan manual admin.';

create index profiles_pending_idx
  on public.profiles (created_at desc)
  where is_approved = false;

-- ============================================================
-- Trigger: auto-create profile saat user baru daftar
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email,''), '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
