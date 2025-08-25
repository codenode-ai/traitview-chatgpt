# API do TraitView

## Visão Geral

A API do TraitView é baseada em chamadas diretas ao Supabase usando o cliente JavaScript. A autenticação é gerenciada pelo Supabase Auth, e as operações de dados são realizadas através de chamadas às tabelas do banco de dados.

## Autenticação

### Login
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@exemplo.com',
  password: 'senha123'
})
```

### Logout
```javascript
const { error } = await supabase.auth.signOut()
```

### Registro
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@exemplo.com',
  password: 'senha123'
})
```

## Usuários

### Obter todos os usuários
```javascript
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .order('nome')
```

### Obter usuário por ID
```javascript
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .eq('id', 'uuid-do-usuario')
  .single()
```

### Criar usuário
```javascript
const { data, error } = await supabase
  .from('usuarios')
  .insert({
    email: 'usuario@exemplo.com',
    nome: 'Nome do Usuário',
    tipo: 'editor',
    ativo: true
  })
  .select()
```

### Atualizar usuário
```javascript
const { data, error } = await supabase
  .from('usuarios')
  .update({
    nome: 'Novo Nome',
    tipo: 'admin'
  })
  .eq('id', 'uuid-do-usuario')
  .select()
```

### Deletar usuário
```javascript
const { error } = await supabase
  .from('usuarios')
  .delete()
  .eq('id', 'uuid-do-usuario')
```

## Colaboradores

### Obter todos os colaboradores
```javascript
const { data, error } = await supabase
  .from('colaboradores')
  .select('*')
  .order('nome')
```

### Obter colaborador por ID
```javascript
const { data, error } = await supabase
  .from('colaboradores')
  .select('*')
  .eq('id', 'uuid-do-colaborador')
  .single()
```

### Criar colaborador
```javascript
const { data, error } = await supabase
  .from('colaboradores')
  .insert({
    nome: 'Nome do Colaborador',
    email: 'colaborador@exemplo.com',
    cargo: 'Cargo',
    departamento: 'Departamento',
    ativo: true
  })
  .select()
```

### Atualizar colaborador
```javascript
const { data, error } = await supabase
  .from('colaboradores')
  .update({
    nome: 'Novo Nome',
    cargo: 'Novo Cargo'
  })
  .eq('id', 'uuid-do-colaborador')
  .select()
```

### Deletar colaborador
```javascript
const { error } = await supabase
  .from('colaboradores')
  .delete()
  .eq('id', 'uuid-do-colaborador')
```

## Testes

### Obter todos os testes
```javascript
const { data, error } = await supabase
  .from('testes')
  .select('*')
  .order('nome')
```

### Obter teste por ID
```javascript
const { data, error } = await supabase
  .from('testes')
  .select('*')
  .eq('id', 'uuid-do-teste')
  .single()
```

### Criar teste
```javascript
const { data, error } = await supabase
  .from('testes')
  .insert({
    codigo: 'TESTE01',
    nome: 'Nome do Teste',
    descricao: 'Descrição do teste',
    categoria: 'Categoria',
    perguntas: [
      { id: 1, texto: 'Pergunta 1', ordem: 1 },
      { id: 2, texto: 'Pergunta 2', ordem: 2 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: 'Baixo', cor: '#ef4444' },
      { min: 2.5, max: 3.7, label: 'Médio', cor: '#f59e0b' },
      { min: 3.7, max: 5, label: 'Alto', cor: '#10b981' }
    ],
    tipo: 'customizado',
    versao: 1,
    ativo: true
  })
  .select()
```

### Atualizar teste
```javascript
const { data, error } = await supabase
  .from('testes')
  .update({
    nome: 'Novo Nome',
    descricao: 'Nova descrição'
  })
  .eq('id', 'uuid-do-teste')
  .select()
```

### Deletar teste
```javascript
const { error } = await supabase
  .from('testes')
  .delete()
  .eq('id', 'uuid-do-teste')
```

## Avaliações

### Obter todas as avaliações
```javascript
const { data, error } = await supabase
  .from('avaliacoes')
  .select('*')
  .order('created_at', { ascending: false })
```

### Obter avaliação por ID
```javascript
const { data, error } = await supabase
  .from('avaliacoes')
  .select('*')
  .eq('id', 'uuid-da-avaliacao')
  .single()
```

### Criar avaliação
```javascript
const { data, error } = await supabase
  .from('avaliacoes')
  .insert({
    nome: 'Nome da Avaliação',
    descricao: 'Descrição da avaliação',
    criado_por: 'uuid-do-usuario',
    testes_ids: ['uuid-do-teste1', 'uuid-do-teste2'],
    status: 'rascunho'
  })
  .select()
```

### Atualizar avaliação
```javascript
const { data, error } = await supabase
  .from('avaliacoes')
  .update({
    nome: 'Novo Nome',
    status: 'enviada'
  })
  .eq('id', 'uuid-da-avaliacao')
  .select()
```

### Deletar avaliação
```javascript
const { error } = await supabase
  .from('avaliacoes')
  .delete()
  .eq('id', 'uuid-da-avaliacao')
```

## Respostas

### Obter todas as respostas de uma avaliação
```javascript
const { data, error } = await supabase
  .from('respostas')
  .select('*')
  .eq('avaliacao_id', 'uuid-da-avaliacao')
```

### Obter resposta por ID
```javascript
const { data, error } = await supabase
  .from('respostas')
  .select('*')
  .eq('id', 'uuid-da-resposta')
  .single()
```

### Obter resposta por link de acesso
```javascript
const { data, error } = await supabase
  .from('respostas')
  .select('*')
  .eq('link_acesso', 'token-unico')
  .single()
```

### Criar resposta
```javascript
const { data, error } = await supabase
  .from('respostas')
  .insert({
    avaliacao_id: 'uuid-da-avaliacao',
    colaborador_id: 'uuid-do-colaborador',
    teste_id: 'uuid-do-teste',
    teste_versao: 1,
    link_acesso: 'token-unico',
    status: 'pendente'
  })
  .select()
```

### Atualizar resposta
```javascript
const { data, error } = await supabase
  .from('respostas')
  .update({
    respostas: [
      { pergunta_id: 1, resposta: 4, pergunta_texto: 'Pergunta 1' },
      { pergunta_id: 2, resposta: 3, pergunta_texto: 'Pergunta 2' }
    ],
    status: 'concluida',
    concluido_em: new Date().toISOString()
  })
  .eq('id', 'uuid-da-resposta')
  .select()
```

### Deletar resposta
```javascript
const { error } = await supabase
  .from('respostas')
  .delete()
  .eq('id', 'uuid-da-resposta')
```

## RPCs (Funções do Servidor)

### Validar token e obter dados da resposta
```javascript
const { data, error } = await supabase
  .rpc('validar_token_resposta', {
    token: 'token-unico'
  })
```

### Salvar respostas validando token
```javascript
const { data, error } = await supabase
  .rpc('salvar_respostas_com_token', {
    token: 'token-unico',
    respostas_json: JSON.stringify([
      { pergunta_id: 1, resposta: 4, pergunta_texto: 'Pergunta 1' },
      { pergunta_id: 2, resposta: 3, pergunta_texto: 'Pergunta 2' }
    ])
  })
```