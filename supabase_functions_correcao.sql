-- Função para validar token e obter dados da resposta (versão simplificada)
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
  select r.id as resposta_id,
         r.avaliacao_id,
         c.nome as colaborador_nome,
         c.email as colaborador_email,
         t.id as teste_id,
         t.nome as teste_nome,
         t.descricao as teste_descricao,
         t.perguntas as teste_perguntas,
         r.status as status_resposta,
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
  resposta_record.expirado := (agora > data_expiracao);
  
  -- Retornar dados
  resposta_id := resposta_record.resposta_id;
  avaliacao_id := resposta_record.avaliacao_id;
  colaborador_nome := resposta_record.colaborador_nome;
  colaborador_email := resposta_record.colaborador_email;
  teste_id := resposta_record.teste_id;
  teste_nome := resposta_record.teste_nome;
  teste_descricao := resposta_record.teste_descricao;
  teste_perguntas := resposta_record.teste_perguntas;
  status_resposta := resposta_record.status_resposta;
  expirado := resposta_record.expirado;
  
  return next;
end;
$function$;