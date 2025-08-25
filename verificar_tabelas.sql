-- Verificar se as tabelas existem
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Verificar políticas de segurança (RLS) nas tabelas
SELECT 
    tablename, 
    relrowsecurity as rls_enabled,
    relforcerowsecurity as force_rls
FROM pg_class c
JOIN pg_tables t ON c.relname = t.tablename
WHERE t.schemaname = 'public'
ORDER BY tablename;

-- Verificar políticas definidas para cada tabela
SELECT 
    p.tablename,
    pol.polname as policy_name,
    pol.polcmd as policy_command,
    pol.polroles as policy_roles,
    pol.polqual as policy_qual,
    pol.polwithcheck as policy_with_check
FROM pg_policy pol
JOIN pg_class c ON pol.polrelid = c.oid
JOIN pg_tables p ON c.relname = p.tablename
WHERE p.schemaname = 'public'
ORDER BY p.tablename, pol.polname;