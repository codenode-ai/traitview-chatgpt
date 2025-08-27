-- ===========================================
-- FUNÇÕES RPC PARA O SISTEMA DE AVALIAÇÕES
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
as $function$
declare
  resposta_record record;
  agora timestamp with time zone := now();
  data_expiracao timestamp with time zone;
begin
  -- Buscar resposta pelo token
  select r.id,
         r.avaliacao_id,
         c.nome as colaborador_nome,
         c.email as colaborador_email,
         t.id as teste_id,
         t.nome as teste_nome,
         t.descricao as teste_descricao,
         t.perguntas as teste_perguntas,
         r.status,
         r.created_at
  into resposta_record
  from respostas r
  left join colaboradores c on r.colaborador_id = c.id
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
$function$;

-- Função para salvar respostas validando token
create or replace function salvar_respostas_com_token(token text, respostas_json jsonb)
returns boolean
language plpgsql
as $function$
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
$function$;

-- Função para marcar resposta como iniciada via token
create or replace function marcar_resposta_iniciada(token text)
returns boolean
language plpgsql
as $function$
declare
  resposta_id uuid;
  resposta_status text;
begin
  -- Verificar se o token é válido e obter o ID da resposta
  select r.id, r.status 
  into resposta_id, resposta_status
  from respostas r
  where r.link_acesso = token 
    and r.status = 'pendente'
    and r.created_at + interval '7 days' > now();
  
  -- Se não encontrou resposta válida
  if not found then
    raise exception 'Token inválido ou expirado';
  end if;
  
  -- Atualizar resposta para iniciada
  update respostas 
  set status = 'iniciada',
      iniciado_em = now()
  where id = resposta_id;
  
  return true;
end;
$function$;