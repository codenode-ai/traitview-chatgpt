-- ===========================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA USUÁRIOS
-- ===========================================

-- Verificar se as políticas existem
SELECT polname, polcmd, polroles 
FROM pg_policy 
WHERE polname LIKE '%usuarios%';

-- Dropar políticas existentes para usuários (se houver)
DROP POLICY IF EXISTS usuarios_self_select ON usuarios;
DROP POLICY IF EXISTS usuarios_self_update ON usuarios;
DROP POLICY IF EXISTS usuarios_admin_write ON usuarios;

-- Política: Usuários só podem ler seu próprio registro
CREATE POLICY usuarios_self_select
ON usuarios
FOR SELECT
USING (id = auth.uid());

-- Política: Usuários só podem atualizar seu próprio registro
CREATE POLICY usuarios_self_update
ON usuarios
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Política: Admins podem criar/editar/apagar usuários
CREATE POLICY usuarios_admin_write
ON usuarios
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo = 'admin' 
      AND u.ativo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo = 'admin' 
      AND u.ativo = true
  )
);

-- Habilitar RLS na tabela de usuários
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA COLABORADORES
-- ===========================================

-- Dropar políticas existentes para colaboradores (se houver)
DROP POLICY IF EXISTS colaboradores_select ON colaboradores;
DROP POLICY IF EXISTS colaboradores_write ON colaboradores;

-- Política: Todos os usuários ativos podem ler colaboradores
CREATE POLICY colaboradores_select
ON colaboradores
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.ativo = true
  )
);

-- Política: Apenas admins e editors podem criar/editar/apagar colaboradores
CREATE POLICY colaboradores_write
ON colaboradores
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
);

-- Habilitar RLS na tabela de colaboradores
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA TESTES
-- ===========================================

-- Dropar políticas existentes para testes (se houver)
DROP POLICY IF EXISTS testes_select ON testes;
DROP POLICY IF EXISTS testes_write ON testes;

-- Política: Todos os usuários ativos podem ler testes
CREATE POLICY testes_select
ON testes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.ativo = true
  )
);

-- Política: Apenas admins e editors podem criar/editar/apagar testes
CREATE POLICY testes_write
ON testes
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
);

-- Habilitar RLS na tabela de testes
ALTER TABLE testes ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA AVALIAÇÕES
-- ===========================================

-- Dropar políticas existentes para avaliações (se houver)
DROP POLICY IF EXISTS avaliacoes_select ON avaliacoes;
DROP POLICY IF EXISTS avaliacoes_write ON avaliacoes;

-- Política: Todos os usuários ativos podem ler avaliações
CREATE POLICY avaliacoes_select
ON avaliacoes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.ativo = true
  )
);

-- Política: Apenas admins e editors podem criar/editar/apagar avaliações
CREATE POLICY avaliacoes_write
ON avaliacoes
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
);

-- Habilitar RLS na tabela de avaliações
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA RESPOSTAS
-- ===========================================

-- Dropar políticas existentes para respostas (se houver)
DROP POLICY IF EXISTS respostas_select ON respostas;
DROP POLICY IF EXISTS respostas_write ON respostas;

-- Política: Todos os usuários ativos podem ler respostas
CREATE POLICY respostas_select
ON respostas
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.ativo = true
  )
);

-- Política: Apenas admins e editors podem criar/editar/apagar respostas
CREATE POLICY respostas_write
ON respostas
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM usuarios u 
    WHERE u.id = auth.uid() 
      AND u.tipo IN ('admin', 'editor') 
      AND u.ativo = true
  )
);

-- Habilitar RLS na tabela de respostas
ALTER TABLE respostas ENABLE ROW LEVEL SECURITY;