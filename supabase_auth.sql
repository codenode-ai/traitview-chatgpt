-- ===========================================
-- CONFIGURAÇÃO DO SUPABASE AUTH
-- ===========================================

-- ===========================================
-- TRIGGERS E FUNCTIONS PARA SINCRONIZAR AUTH.USERS COM USUARIOS
-- ===========================================

-- Trigger function para criar perfil quando usuário é criado no auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Inserir registro na tabela usuarios apenas se não existir
  insert into public.usuarios (id, email, nome, tipo, ativo, created_at)
  values (
    new.id, 
    new.email, 
    split_part(new.email, '@', 1), -- Nome temporário do email
    'editor', -- Tipo padrão
    true, 
    new.created_at
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para executar a função quando usuário é criado
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===========================================
-- POLICIES DE SEGURANÇA PARA AUTH
-- ===========================================

-- Usuários só podem ler/editar seu próprio registro
drop policy if exists usuarios_self_select on usuarios;
drop policy if exists usuarios_self_update on usuarios;

create policy usuarios_self_select
on usuarios
for select
using (id = auth.uid());

create policy usuarios_self_update
on usuarios
for update
using (id = auth.uid())
with check (id = auth.uid());

-- ===========================================
-- FUNÇÕES DE AUTENTICAÇÃO
-- ===========================================

-- Função para verificar se usuário é admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo = 'admin' 
      and ativo = true
  );
end;
$$ language plpgsql security definer;

-- Função para verificar se usuário é editor
create or replace function public.is_editor()
returns boolean as $$
begin
  return exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  );
end;
$$ language plpgsql security definer;

-- Função para verificar se usuário é visualizador
create or replace function public.is_visualizador()
returns boolean as $$
begin
  return exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor', 'visualizador') 
      and ativo = true
  );
end;
$$ language plpgsql security definer;

-- ===========================================
-- POLICIES PARA AS DEMAIS TABELAS
-- ===========================================

-- Colaboradores - todos os usuários ativos podem ler
drop policy if exists colaboradores_select on colaboradores;
create policy colaboradores_select
on colaboradores
for select
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and ativo = true
  )
);

-- Colaboradores - apenas admins e editors podem inserir/atualizar
drop policy if exists colaboradores_write on colaboradores;
create policy colaboradores_write
on colaboradores
for all
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
)
with check (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
);

-- Testes - todos os usuários ativos podem ler
drop policy if exists testes_select on testes;
create policy testes_select
on testes
for select
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and ativo = true
  )
);

-- Testes - apenas admins e editors podem inserir/atualizar
drop policy if exists testes_write on testes;
create policy testes_write
on testes
for all
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
)
with check (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
);

-- Avaliações - todos os usuários ativos podem ler
drop policy if exists avaliacoes_select on avaliacoes;
create policy avaliacoes_select
on avaliacoes
for select
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and ativo = true
  )
);

-- Avaliações - apenas admins e editors podem inserir/atualizar
drop policy if exists avaliacoes_write on avaliacoes;
create policy avaliacoes_write
on avaliacoes
for all
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
)
with check (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
);

-- Respostas - todos os usuários ativos podem ler
drop policy if exists respostas_select on respostas;
create policy respostas_select
on respostas
for select
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and ativo = true
  )
);

-- Respostas - apenas admins e editors podem inserir/atualizar
drop policy if exists respostas_write on respostas;
create policy respostas_write
on respostas
for all
using (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
)
with check (
  exists (
    select 1 
    from usuarios 
    where id = auth.uid() 
      and tipo in ('admin', 'editor') 
      and ativo = true
  )
);