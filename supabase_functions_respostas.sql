-- Função para obter todas as respostas de uma avaliação
create or replace function obter_respostas_avaliacao(avaliacao_id uuid)
returns table(
  id uuid,
  teste_id uuid,
  teste_nome text,
  teste_descricao text,
  teste_perguntas jsonb,
  status text
)
language sql
as $function$
  select 
    r.id,
    r.teste_id,
    t.nome as teste_nome,
    t.descricao as teste_descricao,
    t.perguntas as teste_perguntas,
    r.status
  from respostas r
  join testes t on r.teste_id = t.id
  where r.avaliacao_id = $1
$function$;