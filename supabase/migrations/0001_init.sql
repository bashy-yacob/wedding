-- ============================================================================
-- 0001_init.sql — טבלאות הליבה של "עד החתונה"
-- countdowns (ספירות) + blessings (קיר ברכות)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- countdowns — כל ספירה לאחור עם ה-slug הייחודי שלה
-- ----------------------------------------------------------------------------
create table if not exists public.countdowns (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  display_names   text not null,
  wedding_date    date not null,
  wedding_time    time,
  show_gregorian  boolean not null default true,
  blessing        text,
  theme           text not null default 'classic',
  allow_blessings boolean not null default true,
  created_at      timestamptz not null default now(),

  constraint display_names_len check (char_length(display_names) between 1 and 80),
  constraint blessing_len      check (blessing is null or char_length(blessing) <= 280),
  -- ה-whitelist חייב להישאר מסונכרן עם src/lib/themes.ts
  constraint theme_whitelist   check (theme in
    ('classic', 'gold', 'olive', 'blush', 'royal', 'midnight')),
  -- שפיות: לא חתונות בעבר הרחוק או בעתיד אבסורדי
  constraint date_sane check (
    wedding_date between current_date - 1 and current_date + interval '5 years'
  )
);

create index if not exists countdowns_slug_idx on public.countdowns (slug);

-- ----------------------------------------------------------------------------
-- blessings — איחולים שכל מי שיש לו את הקישור יכול לשלוח
-- ----------------------------------------------------------------------------
create table if not exists public.blessings (
  id           uuid primary key default gen_random_uuid(),
  countdown_id uuid not null references public.countdowns (id) on delete cascade,
  author_name  text not null,
  message      text not null,
  created_at   timestamptz not null default now(),

  constraint author_len  check (char_length(author_name) between 1 and 40),
  constraint message_len check (char_length(message) between 1 and 280)
);

create index if not exists blessings_countdown_idx
  on public.blessings (countdown_id, created_at desc);
