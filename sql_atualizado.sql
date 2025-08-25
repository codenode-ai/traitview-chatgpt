-- ===========================================
-- ATUALIZAÇÃO DO MODELO DE DADOS PARA O PRD
-- ===========================================

-- ===========================================
-- EXTENSIONS necessárias
-- ===========================================
create extension if not exists "uuid-ossp";

-- ===========================================
-- USUÁRIOS DA EMPRESA
-- ===========================================
create table if not exists usuarios (
  id uuid primary key default uuid_generate_v4(),
  email varchar(255) unique not null,
  nome varchar(255) not null,
  tipo varchar(20) check (tipo in ('admin', 'editor', 'visualizador')) default 'editor',
  ativo boolean default true,
  created_at timestamp with time zone default now()
);

-- ===========================================
-- COLABORADORES A SEREM AVALIADOS
-- ===========================================
create table if not exists colaboradores (
  id uuid primary key default uuid_generate_v4(),
  nome varchar(255) not null,
  email varchar(255) unique not null,
  cargo varchar(255),
  departamento varchar(255),
  ativo boolean default true,
  created_at timestamp with time zone default now()
);

-- ===========================================
-- TESTES (PRÉ-CRIADOS + CUSTOMIZADOS)
-- ===========================================
create table if not exists testes (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar(50) unique not null,
  nome varchar(255) not null,
  descricao text,
  categoria varchar(100),
  perguntas jsonb not null, -- [{id: 1, texto: "...", ordem: 1}]
  faixas_interpretacao jsonb not null, -- [{min: 1, max: 2, label: "Baixo", cor: "#red"}]
  tipo varchar(20) default 'customizado' check (tipo in ('oficial', 'customizado')),
  criado_por uuid references usuarios(id),
  versao integer default 1,
  ativo boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ===========================================
-- HISTÓRICO DE VERSÕES DOS TESTES
-- ===========================================
create table if not exists testes_versoes (
  id uuid primary key default uuid_generate_v4(),
  teste_id uuid references testes(id),
  versao integer not null,
  alterado_por uuid references usuarios(id),
  alteracoes text, -- Descrição das mudanças
  snapshot_teste jsonb not null, -- Backup completo da versão anterior
  created_at timestamp with time zone default now()
);

-- ===========================================
-- AVALIAÇÕES (CONJUNTO DE TESTES)
-- ===========================================
create table if not exists avaliacoes (
  id uuid primary key default uuid_generate_v4(),
  nome varchar(255) not null,
  descricao text,
  criado_por uuid references usuarios(id),
  testes_ids uuid[] not null,
  status varchar(20) default 'rascunho' check (status in ('rascunho', 'enviada', 'concluida')),
  created_at timestamp with time zone default now()
);

-- ===========================================
-- RESPOSTAS DOS COLABORADORES
-- ===========================================
create table if not exists respostas (
  id uuid primary key default uuid_generate_v4(),
  avaliacao_id uuid references avaliacoes(id),
  colaborador_id uuid references colaboradores(id),
  teste_id uuid references testes(id),
  teste_versao integer not null, -- Para garantir consistência histórica
  link_acesso varchar(255) unique not null, -- Token único para acesso
  respostas jsonb, -- [{pergunta_id: 1, resposta: 4, pergunta_texto: "..."}]
  resultado jsonb, -- {score: 85, faixa: "Alto", interpretacao: "..."}
  status varchar(20) default 'pendente' check (status in ('pendente', 'iniciada', 'concluida')),
  iniciado_em timestamp with time zone,
  concluido_em timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ===========================================
-- INDEXES PARA MELHOR PERFORMANCE
-- ===========================================
create index if not exists idx_respostas_link_acesso on respostas(link_acesso);
create index if not exists idx_respostas_avaliacao_id on respostas(avaliacao_id);
create index if not exists idx_respostas_colaborador_id on respostas(colaborador_id);
create index if not exists idx_testes_codigo on testes(codigo);
create index if not exists idx_testes_tipo on testes(tipo);
create index if not exists idx_avaliacoes_criado_por on avaliacoes(criado_por);
create index if not exists idx_colaboradores_email on colaboradores(email);

-- ===========================================
-- CONSTRAINTS E RELACIONAMENTOS
-- ===========================================
alter table testes_versoes 
  add constraint fk_testes_versoes_teste_id 
  foreign key (teste_id) references testes(id) on delete cascade;

alter table avaliacoes 
  add constraint fk_avaliacoes_criado_por 
  foreign key (criado_por) references usuarios(id) on delete set null;

alter table respostas 
  add constraint fk_respostas_avaliacao_id 
  foreign key (avaliacao_id) references avaliacoes(id) on delete cascade;

alter table respostas 
  add constraint fk_respostas_colaborador_id 
  foreign key (colaborador_id) references colaboradores(id) on delete cascade;

alter table respostas 
  add constraint fk_respostas_teste_id 
  foreign key (teste_id) references testes(id) on delete cascade;

alter table testes 
  add constraint fk_testes_criado_por 
  foreign key (criado_por) references usuarios(id) on delete set null;

-- ===========================================
-- RLS (Row Level Security) - Para single-tenant
-- ===========================================
alter table usuarios enable row level security;
alter table colaboradores enable row level security;
alter table testes enable row level security;
alter table testes_versoes enable row level security;
alter table avaliacoes enable row level security;
alter table respostas enable row level security;

-- Para respostas públicas, permitir leitura sem autenticação
-- Mas para operações de escrita, será validado pelo token

-- ===========================================
-- FUNCTIONS E RPCs
-- ===========================================

-- Função para validar token e obter dados da resposta
create or replace function validar_token_resposta(token text)
returns table(
  resposta_id uuid,
  avaliacao_id uuid,
  colaborador_nome text,
  colaborador_email text,
  teste_id uuid,
  teste_nome text,
  teste_descricao text,
  teste_perguntas jsonb,
  status_resposta text,
  expirado boolean
) 
language plpgsql
as $$
declare
  resposta_record record;
  agora timestamp with time zone := now();
  data_expiracao timestamp with time zone;
begin
  -- Buscar resposta pelo token
  select r.*, 
         c.nome as colaborador_nome,
         c.email as colaborador_email,
         t.id as teste_id,
         t.nome as teste_nome,
         t.descricao as teste_descricao,
         t.perguntas as teste_perguntas
  into resposta_record
  from respostas r
  join colaboradores c on r.colaborador_id = c.id
  join testes t on r.teste_id = t.id
  where r.link_acesso = token;
  
  -- Se não encontrou resposta
  if not found then
    return;
  end if;
  
  -- Verificar se expirou (7 dias de validade)
  data_expiracao := resposta_record.created_at + interval '7 days';
  
  -- Retornar dados
  return query select 
    resposta_record.id,
    resposta_record.avaliacao_id,
    resposta_record.colaborador_nome,
    resposta_record.colaborador_email,
    resposta_record.teste_id,
    resposta_record.teste_nome,
    resposta_record.teste_descricao,
    resposta_record.teste_perguntas,
    resposta_record.status,
    (agora > data_expiracao);
end;
$$;

-- Função para salvar respostas validando token
create or replace function salvar_respostas_com_token(token text, respostas_json jsonb)
returns boolean
language plpgsql
as $$
declare
  resposta_id uuid;
  resposta_status text;
begin
  -- Verificar se o token é válido e obter o ID da resposta
  select r.id, r.status 
  into resposta_id, resposta_status
  from respostas r
  where r.link_acesso = token 
    and r.status != 'concluida'
    and r.created_at + interval '7 days' > now();
  
  -- Se não encontrou resposta válida
  if not found then
    raise exception 'Token inválido ou expirado';
  end if;
  
  -- Atualizar resposta
  update respostas 
  set respostas = respostas_json,
      status = 'concluida',
      concluido_em = now()
  where id = resposta_id;
  
  return true;
end;
$$;