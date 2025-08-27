-- Função para validar token e obter dados da resposta (versão mais simples)
create or replace function validar_token_resposta(token text)
returns table(
  resposta_id uuid,
  avaliacao_id uuid,
  teste_id uuid,
  teste_nome text,
  teste_descricao text,
  teste_perguntas jsonb,
  status_resposta text,
  expirado boolean
) 
language sql
as $function$
  select 
    r.id as resposta_id,
    r.avaliacao_id,
    t.id as teste_id,
    t.nome as teste_nome,
    t.descricao as teste_descricao,
    t.perguntas as teste_perguntas,
    r.status as status_resposta,
    (now() > (r.created_at + interval '7 days')) as expirado
  from respostas r
  join testes t on r.teste_id = t.id
  where r.link_acesso = $1
$function$;