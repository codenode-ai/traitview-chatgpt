-- ===========================================
-- FUNÇÕES RPC PARA VALIDAÇÃO DE TOKENS E SALVAMENTO DE RESPOSTAS
-- ===========================================

-- Primeiro, deletar funções existentes se houver
DROP FUNCTION IF EXISTS validar_token_resposta(text);
DROP FUNCTION IF EXISTS salvar_respostas_com_token(text, jsonb);
DROP FUNCTION IF EXISTS marcar_resposta_iniciada(text);

-- Função para validar token e obter dados da resposta
CREATE OR REPLACE FUNCTION validar_token_resposta(token text)
RETURNS TABLE(
  resposta_id uuid,
  avaliacao_id uuid,
  colaborador_nome text,
  colaborador_email text,
  teste_id uuid,
  teste_nome text,
  teste_descricao text,
  teste_categoria text,
  teste_perguntas jsonb,
  teste_faixas jsonb,
  status_resposta text,
  expirado boolean
) 
LANGUAGE plpgsql
AS $function$
DECLARE
  resposta_record RECORD;
  agora TIMESTAMP WITH TIME ZONE := NOW();
  data_expiracao TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Buscar resposta pelo token
  SELECT r.*, 
         c.nome AS colaborador_nome,
         c.email AS colaborador_email,
         t.id AS teste_id,
         t.nome AS teste_nome,
         t.descricao AS teste_descricao,
         t.categoria AS teste_categoria,
         t.perguntas AS teste_perguntas,
         t.faixas_interpretacao AS teste_faixas
  INTO resposta_record
  FROM respostas r
  JOIN colaboradores c ON r.colaborador_id = c.id
  JOIN testes t ON r.teste_id = t.id
  WHERE r.link_acesso = token;
  
  -- Se não encontrou resposta
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Verificar se expirou (7 dias de validade)
  data_expiracao := resposta_record.created_at + INTERVAL '7 days';
  
  -- Retornar dados
  RETURN QUERY SELECT 
    resposta_record.id,
    resposta_record.avaliacao_id,
    resposta_record.colaborador_nome,
    resposta_record.colaborador_email,
    resposta_record.teste_id,
    resposta_record.teste_nome,
    resposta_record.teste_descricao,
    resposta_record.teste_categoria,
    resposta_record.teste_perguntas,
    resposta_record.teste_faixas,
    resposta_record.status,
    (agora > data_expiracao);
END;
$function$;

-- Função para salvar respostas validando token
CREATE OR REPLACE FUNCTION salvar_respostas_com_token(token text, respostas_json jsonb)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
  resposta_id uuid;
  resposta_status text;
BEGIN
  -- Verificar se o token é válido e obter o ID da resposta
  SELECT r.id, r.status 
  INTO resposta_id, resposta_status
  FROM respostas r
  WHERE r.link_acesso = token 
    AND r.status != 'concluida'
    AND r.created_at + INTERVAL '7 days' > NOW();
  
  -- Se não encontrou resposta válida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Token inválido ou expirado';
  END IF;
  
  -- Atualizar resposta
  UPDATE respostas 
  SET respostas = respostas_json,
      status = 'concluida',
      concluido_em = NOW()
  WHERE id = resposta_id;
  
  RETURN TRUE;
END;
$function$;

-- Função para marcar resposta como iniciada
CREATE OR REPLACE FUNCTION marcar_resposta_iniciada(token text)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
  resposta_id uuid;
BEGIN
  -- Verificar se o token é válido e obter o ID da resposta
  SELECT r.id
  INTO resposta_id
  FROM respostas r
  WHERE r.link_acesso = token 
    AND r.status = 'pendente'
    AND r.created_at + INTERVAL '7 days' > NOW();
  
  -- Se não encontrou resposta válida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Token inválido ou expirado';
  END IF;
  
  -- Marcar como iniciada
  UPDATE respostas 
  SET status = 'iniciada',
      iniciado_em = NOW()
  WHERE id = resposta_id;
  
  RETURN TRUE;
END;
$function$;