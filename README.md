# TraitView (Completo v2)

App React + Vite + TS com Tailwind, UI local estilo shadcn, Zustand (localStorage), React Router, React Query, RHF + Zod, Recharts, **Framer Motion** (animações) e **Exportar PDF** (html2canvas + jsPDF). **Sem Supabase** por enquanto — dados ficam no navegador.

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
- `src/data/supabase.ts` é um stub com TODOs para você conectar quando decidir migrar.

## Animações de UI
- Entradas de página com **Framer Motion** (fade + translateY suave).
- Hovers em cards e botões com leve `-translate-y` e sombra.

## Próximos passos (opcional)
- Integrar Supabase (Auth/RLS/RPC) e mover cálculos de relatório para o servidor/Edge Function.
- Adicionar tema escuro e skeletons de loading.
