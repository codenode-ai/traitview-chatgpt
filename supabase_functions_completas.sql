-- Excluir a função existente primeiro
DROP FUNCTION IF EXISTS validar_token_resposta(text);

-- Função para validar token e obter dados da resposta (versão mais simples)
CREATE OR REPLACE FUNCTION validar_token_resposta(token text)
RETURNS TABLE(
  resposta_id uuid,
  avaliacao_id uuid,
  teste_id uuid,
  teste_nome text,
  teste_descricao text,
  teste_perguntas jsonb,
  status_resposta text,
  expirado boolean
) 
LANGUAGE sql
AS $function$
  SELECT 
    r.id as resposta_id,
    r.avaliacao_id,
    t.id as teste_id,
    t.nome as teste_nome,
    t.descricao as teste_descricao,
    t.perguntas as teste_perguntas,
    r.status as status_resposta,
    (now() > (r.created_at + interval '7 days')) as expirado
  FROM respostas r
  JOIN testes t ON r.teste_id = t.id
  WHERE r.link_acesso = $1
$function$;

-- Função para obter todas as respostas de uma avaliação
CREATE OR REPLACE FUNCTION obter_respostas_avaliacao(avaliacao_id uuid)
RETURNS TABLE(
  id uuid,
  teste_id uuid,
  teste_nome text,
  teste_descricao text,
  teste_perguntas jsonb,
  status text
)
LANGUAGE sql
AS $function$
  SELECT 
    r.id,
    r.teste_id,
    t.nome as teste_nome,
    t.descricao as teste_descricao,
    t.perguntas as teste_perguntas,
    r.status
  FROM respostas r
  JOIN testes t ON r.teste_id = t.id
  WHERE r.avaliacao_id = $1
$function$;