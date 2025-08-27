-- Função para verificar a estrutura dos testes
create or replace function verificar_teste(teste_id uuid)
returns json
language sql
as $function$
  select 
    row_to_json(t)
  from (
    select 
      id,
      nome,
      descricao,
      perguntas,
      jsonb_array_length(perguntas) as total_perguntas
    from testes 
    where id = $1
  ) t
$function$;