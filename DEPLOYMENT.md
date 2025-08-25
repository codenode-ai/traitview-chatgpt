# Deployment do TraitView

## Pré-requisitos

1. Conta no [Supabase](https://supabase.io/)
2. Conta no [Vercel](https://vercel.com/)
3. Variáveis de ambiente configuradas

## Configuração do Supabase

### 1. Criar projeto
1. Acesse o [Supabase Dashboard](https://app.supabase.io/)
2. Clique em "New Project"
3. Preencha as informações do projeto
4. Aguarde a criação do projeto

### 2. Configurar banco de dados
1. No dashboard do projeto, vá para "SQL Editor"
2. Execute os seguintes scripts na ordem:
   - `sql_atualizado.sql` - Criação das tabelas
   - `supabase_auth.sql` - Configuração de autenticação
   - `seed_dados.sql` - Dados iniciais

### 3. Configurar autenticação
1. Vá para "Authentication" → "Settings"
2. Configure os provedores de autenticação desejados
3. Defina as políticas de senha e segurança

### 4. Obter credenciais
1. Vá para "Settings" → "API"
2. Copie a "Project URL" e "anon public key"

## Configuração do Vercel

### 1. Criar projeto
1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Importe o repositório do TraitView

### 2. Configurar variáveis de ambiente
Adicione as seguintes variáveis de ambiente no Vercel:

```
VITE_SUPABASE_URL=*** URL do projeto Supabase ***
VITE_SUPABASE_ANON_KEY=*** Chave pública do Supabase ***
VITE_DATA_SOURCE=supabase
```

### 3. Configurar build settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Deploy Local

### 1. Pré-requisitos
```bash
# Instalar dependências
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=*** URL do projeto Supabase ***
VITE_SUPABASE_ANON_KEY=*** Chave pública do Supabase ***
VITE_DATA_SOURCE=supabase
```

### 3. Build e deploy
```bash
# Build da aplicação
npm run build

# Preview local
npm run preview
```

## Configurações Adicionais

### Domínio personalizado
1. No Vercel, vá para "Settings" → "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções

### SSL
O Vercel configura automaticamente SSL para domínios customizados.

### Environment Branches
Configure diferentes ambientes para staging e produção:

- **staging** - Branch `develop`
- **production** - Branch `main`

## Monitoramento

### Supabase
1. Use o dashboard do Supabase para monitorar:
   - Queries e performance
   - Erros e logs
   - Uso de recursos

### Vercel
1. Use o dashboard do Vercel para monitorar:
   - Deployments e builds
   - Performance e métricas
   - Logs de erro

## Backup e Recuperação

### Supabase
1. O Supabase faz backups automáticos diários
2. Para backup manual:
   ```sql
   -- Exportar dados
   pg_dump -h db.supabase.co -p 5432 -U postgres -d ***project-name*** > backup.sql
   ```

### Recuperação
1. No dashboard do Supabase, vá para "Settings" → "Database"
2. Use a opção "Point in Time Recovery" para restaurar backups

## Atualizações

### Atualizar código
1. Faça push para o branch configurado no Vercel
2. O Vercel fará deploy automático

### Atualizar banco de dados
1. Para migrações, use o SQL Editor do Supabase
2. Crie scripts de migração incrementais
3. Teste em staging antes de aplicar em produção

## Troubleshooting

### Erros comuns

#### "Project not found"
- Verifique se a URL do projeto está correta
- Confirme se o projeto foi criado no Supabase

#### "Invalid API key"
- Verifique se a chave pública está correta
- Confirme se não há espaços extras

#### "CORS errors"
- Verifique se o domínio está adicionado às políticas do Supabase
- Confirme se as variáveis de ambiente estão corretas

### Logs e Debugging

#### Supabase
1. Use o "SQL Editor" para testar queries
2. Verifique "Logs" para erros de autenticação
3. Use "Database" → "Replication" para monitorar atividade

#### Vercel
1. Use "Logs" para ver erros de build e runtime
2. Verifique "Analytics" para métricas de performance
3. Use "Speed Insights" para otimização

## Segurança

### Melhores práticas
1. Use variáveis de ambiente para credenciais
2. Configure RLS (Row Level Security) no Supabase
3. Use autenticação forte e 2FA quando possível
4. Monitore logs regularmente
5. Mantenha dependências atualizadas

### Checklist de segurança
- [ ] Variáveis de ambiente configuradas corretamente
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de autenticação configuradas
- [ ] Backup automático habilitado
- [ ] Monitoramento de logs configurado
- [ ] SSL habilitado para domínios customizados