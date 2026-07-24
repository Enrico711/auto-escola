-- ============================================
-- Auto Escola Sul da Ilha — Setup do banco
-- Cole este script inteiro no SQL Editor do Supabase e clique em RUN
-- ============================================

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  tracking_code text unique not null,
  name text not null,
  cpf text not null,
  phone text,
  address text,
  category text,
  notes text,
  current_phase int not null default 0,
  created_at timestamptz default now()
);

create table if not exists student_documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  label text,
  path text not null,
  created_at timestamptz default now()
);

-- Segurança: bloqueia acesso direto público às tabelas.
-- (O site acessa pelo servidor, com a chave service_role, que ignora estas regras.)
alter table students enable row level security;
alter table student_documents enable row level security;

-- Bucket privado para os documentos dos alunos
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;
