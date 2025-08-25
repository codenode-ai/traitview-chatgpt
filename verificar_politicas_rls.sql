-- Verificar políticas RLS aplicadas
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
  p.polroles as policy_roles
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('usuarios', 'colaboradores', 'testes', 'testes_versoes', 'avaliacoes', 'respostas')
ORDER BY t.tablename, p.polname;

-- Verificar se o usuário tem permissões corretas
SELECT 
  r.rolname as username,
  r.rolsuper as is_superuser,
  r.rolcanlogin as can_login
FROM pg_roles r
WHERE r.rolname = CURRENT_USER;