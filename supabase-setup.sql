-- ============================================
-- Auto Escola Sul da Ilha — Setup do banco (v3)
-- Cole este script inteiro no SQL Editor do Supabase e clique em RUN.
-- Pode rodar mais de uma vez sem problema.
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

-- Dias (e horários) disponíveis por etapa
create table if not exists phase_availability (
  id uuid primary key default gen_random_uuid(),
  phase int not null,
  date date not null,
  created_at timestamptz default now()
);

alter table phase_availability add column if not exists slot_time text not null default '';

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'phase_availability_phase_date_key') then
    alter table phase_availability drop constraint phase_availability_phase_date_key;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'phase_av_unique') then
    alter table phase_availability add constraint phase_av_unique unique (phase, date, slot_time);
  end if;
end $$;

-- Informações de cada etapa (endereço, instruções, link) definidas pelos gestores
create table if not exists phase_settings (
  phase int primary key,
  address text,
  instructions text,
  link text,
  updated_at timestamptz default now()
);

-- Itens com endereço e valor próprios (ex: exame médico e exame psicológico)
create table if not exists phase_items (
  id uuid primary key default gen_random_uuid(),
  phase int not null,
  label text not null,
  address text,
  price text,
  created_at timestamptz default now()
);

-- Agendamento escolhido pelo aluno
alter table students add column if not exists appointment_date date;
alter table students add column if not exists appointment_phase int;
alter table students add column if not exists appointment_time text;

-- Textos iniciais das etapas que não dependem de configuração
insert into phase_settings (phase, instructions) values
  (0, 'Sua matrícula foi realizada com sucesso. Em breve seguimos para a próxima etapa.'),
  (1, 'O curso teórico é feito online, pela plataforma CNH do Brasil.'),
  (7, 'Sua CNH está em fase de emissão. Entre em contato com a auto escola para combinar a retirada.')
on conflict (phase) do nothing;

-- Segurança
alter table students enable row level security;
alter table student_documents enable row level security;
alter table phase_availability enable row level security;
alter table phase_settings enable row level security;
alter table phase_items enable row level security;

-- Bucket privado para documentos
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;
