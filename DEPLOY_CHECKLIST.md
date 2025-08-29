# Checklist de Deploy para Vercel

## ✅ Pré-requisitos
- [x] Projeto React + Vite configurado
- [x] Dependências instaladas
- [x] Variáveis de ambiente configuradas
- [x] Build testado e funcionando

## ✅ Arquivos de Configuração
- [x] vercel.json criado
- [x] .env.example atualizado
- [x] README.md com instruções de deploy
- [x] Scripts de deploy criados

## ✅ Integrações
- [x] Supabase configurado
- [x] Rotas configuradas
- [x] Health check endpoint criado

## ✅ Pronto para Deploy
- [ ] Testar build local
- [ ] Verificar variáveis de ambiente
- [ ] Fazer deploy na Vercel
- [ ] Testar aplicação em produção

## 🚀 Próximos Passos

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Deploy na Vercel**:
   ```bash
   npm run deploy
   # ou
   vercel --prod
   ```

3. **Configurar domínio personalizado** (opcional):
   - Acesse o dashboard da Vercel
   - Vá em Settings > Domains
   - Adicione seu domínio personalizado

4. **Configurar variáveis de ambiente na Vercel**:
   - Acesse o dashboard da Vercel
   - Vá em Settings > Environment Variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Ativar SSL automático**:
   - Automático na Vercel
   - Certificados renovados automaticamente

## 📞 Suporte

Se encontrar problemas durante o deploy:
1. Verifique o console do Vercel para erros de build
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique a conexão com o Supabase
4. Consulte a documentação oficial da Vercel