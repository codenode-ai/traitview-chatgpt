-- Verificar políticas RLS aplicadas às tabelas
SELECT 
    t.tablename,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as force_rls
FROM pg_class c
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY t.tablename;

-- Verificar políticas definidas para cada tabela
SELECT 
    t.tablename,
    p.polname as policy_name,
    p.polcmd as policy_command,
    p.polroles as policy_roles,
    p.polqual as policy_qual,
    p.polwithcheck as policy_with_check
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY t.tablename, p.polname;

-- Verificar triggers associados às tabelas
SELECT 
    tg.tgname as trigger_name,
    t.tablename,
    p.proname as function_name,
    tg.tgtype as trigger_type
FROM pg_trigger tg
JOIN pg_class c ON tg.tgrelid = c.oid
JOIN pg_tables t ON c.relname = t.tablename
JOIN pg_proc p ON tg.tgfoid = p.oid
WHERE t.schemaname = 'public'
  AND t.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY t.tablename, tg.tgname;