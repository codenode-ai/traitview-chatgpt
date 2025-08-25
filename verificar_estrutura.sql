-- ===========================================
-- VERIFICAÇÃO DA ESTRUTURA DAS TABELAS
-- ===========================================

-- Verificar se as tabelas existem
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY tablename;

-- Verificar estrutura da tabela usuarios
\d usuarios

-- Verificar estrutura da tabela colaboradores
\d colaboradores

-- Verificar estrutura da tabela testes
\d testes

-- Verificar estrutura da tabela testes_versoes
\d testes_versoes

-- Verificar estrutura da tabela avaliacoes
\d avaliacoes

-- Verificar estrutura da tabela respostas
\d respostas

-- Verificar se há dados nas tabelas
SELECT 'usuarios' as tabela, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'colaboradores' as tabela, COUNT(*) as registros FROM colaboradores
UNION ALL
SELECT 'testes' as tabela, COUNT(*) as registros FROM testes
UNION ALL
SELECT 'testes_versoes' as tabela, COUNT(*) as registros FROM testes_versoes
UNION ALL
SELECT 'avaliacoes' as tabela, COUNT(*) as registros FROM avaliacoes
UNION ALL
SELECT 'respostas' as tabela, COUNT(*) as registros FROM respostas
ORDER BY tabela;

-- Verificar se há políticas RLS aplicadas
SELECT 
    t.tablename,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as force_rls
FROM pg_class c
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY t.tablename;

-- Verificar políticas definidas
SELECT 
    t.tablename,
    p.polname as policy_name,
    p.polcmd as policy_command
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY t.tablename, p.polname;