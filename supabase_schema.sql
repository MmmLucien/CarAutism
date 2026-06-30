-- ═══════════════════════════════════════════════════════
-- CarAutism — Schéma Supabase
-- À exécuter dans l'éditeur SQL de Supabase
-- ═══════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Table users (profils publics) ────────────────────
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  username    text not null unique,
  avatar      text not null default '🏎️',
  is_premium  boolean not null default false,
  total_xp    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Index sur username pour les recherches de disponibilité
create index users_username_idx on public.users (lower(username));

-- ── Table scores ──────────────────────────────────────
create table public.scores (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade,
  score       integer not null,
  correct     integer not null,
  total       integer not null,
  level       smallint not null check (level between 1 and 4),
  sujets      text[] not null,
  played_at   timestamptz not null default now()
);

create index scores_user_id_idx on public.scores (user_id);
create index scores_score_idx on public.scores (score desc);
create index scores_played_at_idx on public.scores (played_at desc);

-- ── Table contestations ───────────────────────────────
create table public.contestations (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete set null,
  question_id text not null,
  reason      text not null,
  comment     text,
  status      text not null default 'pending' check (status in ('pending', 'reviewed', 'fixed')),
  created_at  timestamptz not null default now()
);

-- ── RLS (Row Level Security) ──────────────────────────
alter table public.users enable row level security;
alter table public.scores enable row level security;
alter table public.contestations enable row level security;

-- Users : lecture publique, écriture propriétaire
create policy "users_select_all" on public.users for select using (true);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- Scores : lecture publique, insertion authentifiée
create policy "scores_select_all" on public.scores for select using (true);
create policy "scores_insert_auth" on public.scores for insert
  with check (auth.uid() = user_id or user_id is null);

-- Contestations : lecture admin, insertion libre
create policy "contestations_insert" on public.contestations for insert with check (true);
create policy "contestations_select_own" on public.contestations for select
  using (auth.uid() = user_id);

-- ── Fonction : mise à jour total_xp après un score ───
create or replace function update_user_total_xp()
returns trigger as $$
begin
  update public.users
  set total_xp = (
    select coalesce(sum(score), 0)
    from public.scores
    where user_id = NEW.user_id
  )
  where id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_score_insert
  after insert on public.scores
  for each row execute function update_user_total_xp();

-- ── Table subject_progress ───────────────────────────
-- XP et stats par utilisateur par sujet
create table public.subject_progress (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  sujet        text not null,
  xp           integer not null default 0,
  correct      integer not null default 0,
  total        integer not null default 0,
  updated_at   timestamptz not null default now(),
  unique(user_id, sujet)
);

create index subject_progress_user_idx on public.subject_progress (user_id);

alter table public.subject_progress enable row level security;
create policy "sp_select_own" on public.subject_progress for select using (auth.uid() = user_id);
create policy "sp_upsert_own" on public.subject_progress for insert with check (auth.uid() = user_id);
create policy "sp_update_own" on public.subject_progress for update using (auth.uid() = user_id);

-- ── Table user_quests ──────────────────────────────────
create table public.user_quests (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  quest_id     text not null,
  quest_type   text not null check (quest_type in ('daily','progression','mastery')),
  status       text not null default 'active' check (status in ('locked','active','completed','claimed')),
  progress     integer not null default 0,
  completed_at timestamptz,
  claimed_at   timestamptz,
  expires_at   timestamptz,    -- Pour les quêtes journalières
  created_at   timestamptz not null default now(),
  unique(user_id, quest_id)
);

create index user_quests_user_idx on public.user_quests (user_id);
create index user_quests_status_idx on public.user_quests (user_id, status);

alter table public.user_quests enable row level security;
create policy "uq_select_own" on public.user_quests for select using (auth.uid() = user_id);
create policy "uq_insert_own" on public.user_quests for insert with check (auth.uid() = user_id);
create policy "uq_update_own" on public.user_quests for update using (auth.uid() = user_id);

-- ── Table user_badges ──────────────────────────────────
create table public.user_badges (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  badge_key    text not null,
  earned_at    timestamptz not null default now(),
  unique(user_id, badge_key)
);

alter table public.user_badges enable row level security;
create policy "ub_select_all" on public.user_badges for select using (true);
create policy "ub_insert_own" on public.user_badges for insert with check (auth.uid() = user_id);

-- ── Fonction : mise à jour subject_progress après score ──
create or replace function update_subject_progress()
returns trigger as $$
declare
  r record;
begin
  -- results_json est un jsonb array de {sujet, xp, correct, total}
  -- À adapter selon la structure réelle envoyée
  return NEW;
end;
$$ language plpgsql security definer;

-- ── Vue : leaderboard global ───────────────────────────
create or replace view public.leaderboard_global as
  select
    u.id as user_id,
    u.username,
    u.avatar,
    u.total_xp,
    count(s.id) as parties_jouees,
    max(s.score) as meilleur_score,
    sum(s.correct)::integer as total_correct,
    sum(s.total)::integer as total_questions
  from public.users u
  left join public.scores s on s.user_id = u.id
  group by u.id, u.username, u.avatar, u.total_xp
  order by u.total_xp desc;

-- ── Trigger : créer profil à l'inscription ────────────
-- (déclenché côté frontend via signUp pour plus de contrôle)
