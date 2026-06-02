-- Table activités
create table if not exists creaactif_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  subject text,
  class_level text,
  content jsonb default '{}',
  created_at timestamptz default now()
);

alter table creaactif_activities enable row level security;

create policy "owner only" on creaactif_activities
  for all using (auth.uid() = user_id);

-- Table résultats
create table if not exists creaactif_results (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references creaactif_activities not null,
  student_code text not null,
  profile text[] default '{}',
  score numeric,
  answers jsonb default '{}',
  submitted_at timestamptz default now()
);

alter table creaactif_results enable row level security;

create policy "owner via activity" on creaactif_results
  for all using (
    exists (
      select 1 from creaactif_activities a
      where a.id = activity_id and a.user_id = auth.uid()
    )
  );
