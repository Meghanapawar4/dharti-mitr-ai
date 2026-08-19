-- Dharti Mitr AI database
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'en',
  location text,
  land_size numeric,
  soil_type text,
  irrigation_type text,
  farming_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crops (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  crop_name text not null,
  planting_date date,
  growth_stage text,
  expected_harvest_date date,
  irrigation_schedule text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null default 'en',
  role text not null check (role in ('user','assistant')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.disease_scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text,
  crop_detected text,
  possible_disease text,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  severity text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.government_schemes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  benefit text,
  eligibility text,
  documents text,
  application_steps jsonb not null default '[]'::jsonb,
  official_url text,
  last_updated date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.crops enable row level security;
alter table public.chat_history enable row level security;
alter table public.disease_scans enable row level security;
alter table public.reminders enable row level security;
alter table public.alerts enable row level security;
alter table public.government_schemes enable row level security;

create policy "Users manage own profile" on public.profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "Users manage own crops" on public.crops for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users manage own chat" on public.chat_history for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users manage own scans" on public.disease_scans for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users manage own reminders" on public.reminders for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users manage own alerts" on public.alerts for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Anyone can read schemes" on public.government_schemes for select using (true);

-- Optional trigger for profile creation
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name','Farmer'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
