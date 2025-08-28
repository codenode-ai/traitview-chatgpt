-- ===========================================
-- SEED DE DADOS INICIAIS
-- ===========================================

-- ===========================================
-- USUÁRIO ADMIN DEMO
-- ===========================================
insert into usuarios (id, email, nome, tipo, ativo, created_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'admin@traitview.com',
  'Administrador Demo',
  'admin',
  true,
  now()
)
on conflict (email) do nothing;

-- ===========================================
-- COLABORADORES DEMO
-- ===========================================
insert into colaboradores (id, nome, email, cargo, departamento, ativo, created_at)
values 
  ('11111111-1111-1111-1111-111111111111', 'Ana Lima', 'ana@empresa.com', 'Gerente de RH', 'Recursos Humanos', true, now()),
  ('22222222-2222-2222-2222-222222222222', 'Bruno Souza', 'bruno@empresa.com', 'Desenvolvedor Sênior', 'Tecnologia', true, now()),
  ('33333333-3333-3333-3333-333333333333', 'Carla Reis', 'carla@empresa.com', 'Analista de Marketing', 'Marketing', true, now())
on conflict (email) do nothing;

-- ===========================================
-- TESTES OFICIAIS (serão inseridos pelo frontend)
-- ===========================================
-- Os testes oficiais serão inseridos automaticamente pelo frontend
-- quando o sistema for iniciado pela primeira vez

-- ===========================================
-- AVALIAÇÕES DEMO
-- ===========================================
-- As avaliações serão criadas pelo usuário através da interface