-- Rezonants Website Database Schema (Idempotent)
-- Complete Auth + Profiles + Consultations + Contact Messages + CMS Catalogs with RLS CRUD Policies

-- Enable UUID generation helpers
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ============================================
-- HELPER FUNCTIONS (UPDATED_AT & NEW AUTH USER)
-- ============================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================
-- PROFILES TABLE (Synced with auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  company text default '',
  phone text default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);
  return new;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================
-- SERVICES TABLE
-- ============================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text not null,
  icon text,
  features text[],
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_services_order on public.services(order_index);
create index if not exists idx_services_active on public.services(is_active);

-- ============================================
-- PROJECTS / PORTFOLIO TABLE
-- ============================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text,
  description text,
  client_name text,
  project_url text,
  github_url text,
  image_url text,
  technologies text[],
  category text,
  featured boolean default false,
  order_index integer default 0,
  is_published boolean default true,
  completed_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_projects_published on public.projects(is_published);
create index if not exists idx_projects_order on public.projects(order_index);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  avatar_url text,
  email text,
  linkedin_url text,
  twitter_url text,
  github_url text,
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_team_order on public.team_members(order_index);
create index if not exists idx_team_active on public.team_members(is_active);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  client_company text,
  client_avatar_url text,
  content text not null,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  project_id uuid references public.projects(id) on delete set null,
  is_featured boolean default false,
  is_published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_testimonials_featured on public.testimonials(is_featured);
create index if not exists idx_testimonials_published on public.testimonials(is_published);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  company text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_messages_user on public.contact_messages(user_id);
create index if not exists idx_messages_status on public.contact_messages(status);
create index if not exists idx_messages_created on public.contact_messages(created_at desc);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  company text,
  service text not null,
  preferred_date date not null,
  preferred_time text not null,
  budget text,
  requirements text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_consultations_user on public.consultations(user_id);
create index if not exists idx_consultations_status on public.consultations(status);
create index if not exists idx_consultations_created on public.consultations(created_at desc);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_settings_key on public.site_settings(key);

-- ============================================
-- BLOG POSTS / PERSPECTIVES TABLE
-- ============================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references public.team_members(id) on delete set null,
  tags text[],
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_blog_slug on public.blog_posts(slug);
create index if not exists idx_blog_published on public.blog_posts(is_published, published_at desc);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.consultations enable row level security;
alter table public.site_settings enable row level security;
alter table public.blog_posts enable row level security;

-- Profiles CRUD (User owns their profile row)
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "Users delete own profile" on public.profiles;
create policy "Users delete own profile" on public.profiles
  for delete to authenticated using (auth.uid() = id or public.is_admin());

-- Public Read + Admin CRUD for catalog/CMS tables
drop policy if exists "Public read services" on public.services;
create policy "Public read services" on public.services
  for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage services" on public.services;
create policy "Admin manage services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects
  for select using (is_published = true or public.is_admin());

drop policy if exists "Admin manage projects" on public.projects;
create policy "Admin manage projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read team" on public.team_members;
create policy "Public read team" on public.team_members
  for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage team" on public.team_members;
create policy "Admin manage team" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials" on public.testimonials
  for select using (is_published = true or public.is_admin());

drop policy if exists "Admin manage testimonials" on public.testimonials;
create policy "Admin manage testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read blog" on public.blog_posts;
create policy "Public read blog" on public.blog_posts
  for select using (is_published = true or public.is_admin());

drop policy if exists "Admin manage blog" on public.blog_posts;
create policy "Admin manage blog" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings
  for select using (true);

drop policy if exists "Admin manage site settings" on public.site_settings;
create policy "Admin manage site settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Contact Messages CRUD: anyone can insert; authenticated users manage their own messages
drop policy if exists "Anyone can insert messages" on public.contact_messages;
create policy "Anyone can insert messages" on public.contact_messages
  for insert to anon, authenticated
  with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Users read own messages" on public.contact_messages;
create policy "Users read own messages" on public.contact_messages
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users update own messages" on public.contact_messages;
create policy "Users update own messages" on public.contact_messages
  for update to authenticated using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users delete own messages" on public.contact_messages;
create policy "Users delete own messages" on public.contact_messages
  for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- Consultations CRUD: authenticated users create, read, update, and delete their own consultations
drop policy if exists "Users insert own consultations" on public.consultations;
create policy "Users insert own consultations" on public.consultations
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users read own consultations" on public.consultations;
create policy "Users read own consultations" on public.consultations
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users update own consultations" on public.consultations;
create policy "Users update own consultations" on public.consultations
  for update to authenticated using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users delete own consultations" on public.consultations;
create policy "Users delete own consultations" on public.consultations
  for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- ============================================
-- TRIGGERS
-- ============================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
  before update on public.services
  for each row execute function public.handle_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

drop trigger if exists team_updated_at on public.team_members;
create trigger team_updated_at
  before update on public.team_members
  for each row execute function public.handle_updated_at();

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.handle_updated_at();

drop trigger if exists messages_updated_at on public.contact_messages;
create trigger messages_updated_at
  before update on public.contact_messages
  for each row execute function public.handle_updated_at();

drop trigger if exists consultations_updated_at on public.consultations;
create trigger consultations_updated_at
  before update on public.consultations
  for each row execute function public.handle_updated_at();

drop trigger if exists settings_updated_at on public.site_settings;
create trigger settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

drop trigger if exists blog_updated_at on public.blog_posts;
create trigger blog_updated_at
  before update on public.blog_posts
  for each row execute function public.handle_updated_at();

-- Backfill profiles for any existing auth users
insert into public.profiles (id, email, full_name)
select id, coalesce(email, ''), coalesce(raw_user_meta_data->>'full_name', '')
from auth.users
on conflict (id) do nothing;

-- ============================================
-- SEED DATA (Idempotent)
-- ============================================
insert into public.services (slug, title, description, icon, features, order_index) values
('inception-to-deployment', 'Inception To Deployment', 'End-to-end delivery from requirements engineering and UI/UX architecture to production launch and ongoing scaling.', 'Code', ARRAY['Requirements Engineering', 'Architecture Design', 'Full-Stack Build', 'Production Launch'], 1),
('business-process-automation', 'Business Process Automation', 'Automate repetitive operational workflows with intelligent orchestration, approvals, and enterprise integrations.', 'Workflow', ARRAY['Workflow Orchestration', 'RPA & AI Agents', 'API Sync', 'Audit Trails'], 2),
('center-of-excellence', 'Center of Excellence', 'Dedicated engineering governance, reusable accelerators, DevSecOps standards, and architecture review boards.', 'Award', ARRAY['Engineering Standards', 'Reusable Frameworks', 'DevSecOps', 'Quality Governance'], 3),
('custom-development-customization', 'Solution Engineering & Customization', 'Tailored web, mobile, and enterprise applications engineered around your exact business domain.', 'Layers', ARRAY['Web & Mobile Apps', 'API Engineering', 'ERP/CRM Extensions', 'High Scalability'], 4),
('digital-transformation', 'Digital Transformation', 'Modernize operating models, unified data platforms, and omnichannel customer experiences.', 'Sparkles', ARRAY['Strategy Roadmap', 'Data Modernization', 'Customer Experience', 'Agile Delivery'], 5),
('end-to-end-solution-framework', 'End-to-End Solution Framework', 'Unified delivery lifecycle combining strategy, modular architecture, automated QA, and managed operations.', 'ShieldCheck', ARRAY['Modular Stack', 'CI/CD Pipelines', 'Automated Testing', '24/7 Telemetry'], 6),
('migration-modernization', 'Migration & Modernization', 'Zero-downtime cloud migrations across AWS, Azure, and GCP with containerization and Kubernetes.', 'Cloud', ARRAY['Cloud Migration', 'ETL Validation', 'Kubernetes', 'TCO Optimization'], 7),
('poc-pilot-implementation', 'PoC & Pilot Implementation', 'Rapid 2–6 week proof-of-concepts and production pilot rollouts to validate technical feasibility and ROI.', 'Rocket', ARRAY['Rapid Prototyping', 'Technical Validation', 'UX Testing', 'Pilot Rollout'], 8),
('shared-services-managed-operations', 'Shared Services & Managed Operations', 'SLA-backed 24/7 cloud operations, proactive observability, incident management, and continuous improvement.', 'Activity', ARRAY['24/7 SRE Monitoring', 'Incident Response', 'Cost Optimization', 'Managed Releases'], 9)
on conflict (slug) do nothing;

insert into public.projects (title, slug, short_description, description, client_name, technologies, category, featured, order_index) values
('FinTech Dashboard', 'fintech-dashboard', 'Real-time financial analytics platform', 'Built a comprehensive dashboard handling 1M+ transactions daily with sub-second analytics.', 'FinanceFlow Inc', ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'], 'Web App', true, 1),
('E-commerce Platform', 'ecommerce-platform', 'Headless commerce with multi-vendor support', 'Scalable e-commerce solution supporting 500+ vendors and 100k+ monthly orders.', 'ShopSphere', ARRAY['Next.js', 'GraphQL', 'Kubernetes'], 'E-commerce', true, 2),
('Enterprise Analytics Portal', 'enterprise-analytics-portal', 'Unified cloud intelligence and reporting hub', 'Real-time operational reporting and automated executive KPI visibility across regions.', 'GlobalRetail Co', ARRAY['React', 'Python', 'PostgreSQL', 'Cloud'], 'Analytics', true, 3)
on conflict (slug) do nothing;

insert into public.team_members (name, role, bio, order_index)
select v.name, v.role, v.bio, v.order_index
from (values
  ('Engineering Leadership', 'Architecture & Delivery', 'Specialists in distributed cloud platforms, enterprise software, and AI engineering since 2012.', 1),
  ('Cloud & DevOps Practice', 'Infrastructure & SRE', 'Certified multi-cloud architects managing AWS, Azure, GCP, and Kubernetes deployments.', 2),
  ('AI & Automation Practice', 'Applied AI & Data', 'Builders of enterprise copilots, workflow orchestration, and predictive intelligence.', 3)
) as v(name, role, bio, order_index)
where not exists (select 1 from public.team_members limit 1);

insert into public.testimonials (client_name, client_role, client_company, content, rating, is_featured)
select v.client_name, v.client_role, v.client_company, v.content, v.rating, v.is_featured
from (values
  ('Alex Thompson', 'VP Engineering', 'TechCorp', 'Rezonants delivered our core platform 3 months ahead of schedule. Their technical depth is unmatched.', 5, true),
  ('Maria Santos', 'Founder', 'StartupXYZ', 'Best engineering partnership we have ever had. They think like product owners, not just contractors.', 5, true),
  ('James Wilson', 'CTO', 'EnterpriseCo', 'The team''s expertise in cloud architecture saved us 40% on infrastructure costs.', 5, false)
) as v(client_name, client_role, client_company, content, rating, is_featured)
where not exists (select 1 from public.testimonials limit 1);

insert into public.site_settings (key, value, description) values
('site_title', '"Rezonants — Rezonant Solutions Private Limited"', 'Site title for SEO and header'),
('site_description', '"Custom software, web and mobile applications, cloud infrastructure, AI and automation engineered to scale."', 'Meta description for SEO'),
('contact_email', '"info@rezonants.com"', 'Primary contact email'),
('contact_phone', '"18004103299"', 'Toll-free support phone number'),
('social_links', '{"twitter": "https://twitter.com/rezonants", "linkedin": "https://www.linkedin.com/company/rezonants/", "instagram": "https://www.instagram.com/rezonants_/"}', 'Social media links'),
('hero', '{"headline": "Software & Digital Products, Engineered to Scale", "cta_text": "Book a Consultation", "cta_link": "/book-consultation"}', 'Hero section settings')
on conflict (key) do update set value = excluded.value, description = excluded.description;

insert into public.blog_posts (title, slug, excerpt, content, tags, is_published, published_at) values
('Modernizing Business Applications for a Data-Driven Enterprise', 'business-transformation', 'Turning disconnected enterprise applications into unified, analytics-ready digital cores.', 'Full perspective published at /perspectives/business-transformation.', ARRAY['Business Transformation', 'Data Integration', 'Architecture'], true, now()),
('How AI Is Reshaping Enterprise Applications', 'artificial-intelligence', 'Moving from standalone demos to production AI copilots and intelligent workflow automation.', 'Full perspective published at /perspectives/artificial-intelligence.', ARRAY['Artificial Intelligence', 'Automation', 'Copilots'], true, now()),
('Accelerating Business Transformation with Modern ERP', 'modern-erp', 'Unifying finance, procurement, supply chain, inventory, and operations on modern ERP platforms.', 'Full perspective published at /perspectives/modern-erp.', ARRAY['Modern ERP', 'Operations', 'Finance'], true, now()),
('Building Cyber Resilience in a Connected Enterprise', 'cybersecurity', 'Zero Trust architecture, identity governance, cloud security, and continuous resilience.', 'Full perspective published at /perspectives/cybersecurity.', ARRAY['Cybersecurity', 'Zero Trust', 'Cloud Security'], true, now()),
('Modernizing Legacy Applications for the Cloud', 'cloud-modernization', 'Pragmatic rehosting, replatforming, and refactoring patterns for legacy cloud migrations.', 'Full perspective published at /perspectives/cloud-modernization.', ARRAY['Cloud', 'Modernization', 'Migration'], true, now())
on conflict (slug) do nothing;

-- ============================================
-- HELPFUL VIEWS
-- ============================================
create or replace view public.featured_projects as
  select * from public.projects
  where is_published = true and featured = true
  order by order_index;

create or replace view public.published_blog as
  select * from public.blog_posts
  where is_published = true
  order by published_at desc;

create or replace view public.active_services as
  select * from public.services
  where is_active = true
  order by order_index;
