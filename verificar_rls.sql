-- Verificar se as tabelas têm RLS habilitado
SELECT 
    tablename,
    relrowsecurity as rls_enabled,
    relforcerowsecurity as force_rls
FROM pg_class c
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY tablename;

-- Verificar políticas definidas para as tabelas principais
SELECT 
    p.tablename,
    pol.polname as policy_name,
    pol.polcmd as policy_command,
    pol.polroles as policy_roles
FROM pg_policy pol
JOIN pg_class c ON pol.polrelid = c.oid
JOIN pg_tables p ON c.relname = p.tablename
WHERE p.schemaname = 'public'
  AND p.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY p.tablename, pol.polname;

-- Verificar se o usuário tem permissões corretas
SELECT 
    r.rolname as username,
    r.rolsuper as is_superuser,
    r.rolcanlogin as can_login
FROM pg_roles r
WHERE r.rolname = CURRENT_USER;