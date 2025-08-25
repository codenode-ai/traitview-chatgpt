# TraitView (Completo v2) - Versão Single-Tenant

App React + Vite + TS com Tailwind, UI local estilo shadcn, React Query, RHF + Zod, Recharts, **Framer Motion** (animações) e **Exportar PDF** (html2canvas + jsPDF). **Agora com integração completa com Supabase** — dados são armazenados no banco de dados com autenticação e controle de acesso.

## Rodando localmente
```bash
npm i
npm run dev
# abre http://localhost:3000
```

## Fluxo de teste rápido
1. Acesse a aplicação e crie uma conta no formulário de login
2. Faça login na aplicação
3. Importe colaboradores via CSV ou crie manualmente
4. Crie uma avaliação selecionando testes e atribuindo colaboradores
5. Envie os links gerados para os colaboradores
6. Os colaboradores acessam o link e respondem aos testes
7. Veja os relatórios na aba "Relatórios"

## Arquitetura

### Estrutura de Pastas
```
src/
├── app/                 # Configuração da aplicação e rotas
├── components/          # Componentes reutilizáveis
├── features/            # Funcionalidades principais
│   ├── auth/           # Autenticação e gerenciamento de usuários
│   ├── collaborators/  # Gestão de colaboradores
│   ├── tests/          # Gestão de testes
│   ├── assessments/    # Sistema de avaliações
│   ├── responses/      # Respostas dos colaboradores
│   └── reports/        # Relatórios e exportação
├── hooks/              # Hooks personalizados
├── lib/                # Funções utilitárias e serviços
├── providers/          # Provedores de contexto
├── stores/             # Gerenciamento de estado (se necessário)
├── types/              # Definições de tipos
└── utils/              # Funções utilitárias
```

### Modelo de Dados
- **usuarios** - Usuários da empresa (Admin, Editor, Visualizador)
- **colaboradores** - Colaboradores a serem avaliados
- **testes** - Testes (pré-criados + customizados)
- **testes_versoes** - Histórico de versões dos testes
- **avaliacoes** - Avaliações (conjunto de testes)
- **respostas** - Respostas dos colaboradores com tokens únicos

## Configuração do Supabase
1. Crie um projeto no [Supabase](https://supabase.io/)
2. Obtenha a URL do projeto e a chave anônima
3. Adicione as variáveis de ambiente ao arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   VITE_DATA_SOURCE=supabase
   ```
4. Execute os scripts SQL na seguinte ordem:
   - `sql_atualizado.sql` - Criação das tabelas
   - `supabase_auth.sql` - Configuração de autenticação
   - `seed_dados.sql` - Dados iniciais

## Sistema de Tokens e Links
O sistema gera links únicos para cada colaborador com os seguintes recursos:
- Tokens aleatórios e únicos
- Expiração automática (7 dias)
- Validação server-side via RPC
- Salvamento de respostas com validação de token

## Autenticação e Permissões
- **Admin**: Acesso total, gerencia usuários e configurações
- **Editor**: Cria/edita testes e avaliações, não gerencia usuários
- **Visualizador**: Apenas visualiza relatórios e resultados

## Primeiro Acesso
1. Acesse a aplicação pela primeira vez
2. Clique em "Não tem uma conta? Crie uma"
3. Preencha email e senha
4. O primeiro usuário registrado será automaticamente promovido a Admin
5. Faça login com as credenciais criadas

## Próximos passos
- Implementar importação de colaboradores via CSV
- Adicionar editor de testes customizados
- Implementar relatórios avançados com gráficos
- Adicionar exportação em PDF e CSV
- Implementar envio automático de emails com links
