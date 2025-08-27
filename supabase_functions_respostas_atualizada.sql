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