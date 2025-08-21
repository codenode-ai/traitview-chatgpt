# TraitView (Completo v2)

App React + Vite + TS com Tailwind, UI local estilo shadcn, Zustand (localStorage), React Router, React Query, RHF + Zod, Recharts, **Framer Motion** (animações) e **Exportar PDF** (html2canvas + jsPDF). **Agora com integração opcional com Supabase** — dados podem ser armazenados no banco de dados.

## Rodando localmente
```bash
npm i
npm run dev
# abre http://localhost:3000
```

## Fluxo de teste rápido
1. A seed cria 3 colaboradores e 2 testes de exemplo.
2. Vá em **Avaliações** → crie uma avaliação escolhendo 1+ testes e 1+ colaboradores.
3. Na tabela de avaliações, clique em **Abrir** para acessar o link público (`/avaliacao/:token`).
4. Responda as perguntas (Likert 1–5); ao concluir, o link fica como **concluída**.
5. Veja **Relatórios** → clique em **Exportar PDF** para baixar `relatorio-traitview.pdf`.

## Camada de dados (troca para Supabase)
- `src/data/index.ts` seleciona a fonte via `VITE_DATA_SOURCE` (default: `local`).
- `src/data/local.ts` usa a store do Zustand atual.
- `src/data/supabase.ts` implementa a integração com Supabase usando os serviços em `src/lib`.

## Configuração do Supabase
1. Crie um projeto no [Supabase](https://supabase.io/)
2. Obtenha a URL do projeto e a chave anônima
3. Adicione as variáveis de ambiente ao arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   VITE_DATA_SOURCE=supabase
   ```
4. Crie as tabelas no Supabase usando o schema fornecido

## Animações de UI
- Entradas de página com **Framer Motion** (fade + translateY suave).
- Hovers em cards e botões com leve `-translate-y` e sombra.

## Próximos passos (opcional)
- Integrar Supabase (Auth/RLS/RPC) e mover cálculos de relatório para o servidor/Edge Function.
- Adicionar tema escuro e skeletons de loading.
- Implementar completamente a função `findEvaluationByToken` no Supabase.
