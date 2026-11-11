-- Log unanswered chatbot questions without storing any personal data.
-- Public visitors (anon / authenticated) can ONLY insert `question`;
-- reading, updating, and deleting are denied by RLS and column grants.

create table if not exists public.chat_unanswered (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(trim(question)) > 0 and char_length(question) <= 1000),
  created_at timestamptz not null default now()
);

alter table public.chat_unanswered enable row level security;

drop policy if exists "Public can insert unanswered chat questions" on public.chat_unanswered;
create policy "Public can insert unanswered chat questions"
  on public.chat_unanswered
  for insert
  to anon, authenticated
  with check (
    char_length(trim(question)) > 0
    and char_length(question) <= 1000
  );

revoke all on table public.chat_unanswered from anon, authenticated;
grant insert (question) on table public.chat_unanswered to anon, authenticated;

