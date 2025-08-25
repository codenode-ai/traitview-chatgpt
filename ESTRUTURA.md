# Estrutura do Projeto

## Visão Geral

```
src/
├── app/                    # Configuração da aplicação e rotas
├── components/             # Componentes reutilizáveis
│   ├── layout/             # Componentes de layout
│   └── ui/                 # Componentes de interface
├── features/               # Funcionalidades principais
│   ├── auth/               # Autenticação e gerenciamento de usuários
│   ├── collaborators/       # Gestão de colaboradores
│   ├── tests/              # Gestão de testes
│   ├── assessments/         # Sistema de avaliações
│   ├── responses/          # Respostas dos colaboradores
│   └── reports/            # Relatórios e exportação
├── hooks/                  # Hooks personalizados
├── lib/                    # Funções utilitárias e serviços
├── providers/              # Provedores de contexto
├── stores/                 # Gerenciamento de estado (se necessário)
├── types/                  # Definições de tipos
└── utils/                  # Funções utilitárias
```

## Detalhamento por Pasta

### `app/`
- Configuração da aplicação
- Rotas principais
- Layouts globais

### `components/`
Componentes reutilizáveis em toda a aplicação:

#### `components/layout/`
- `AppLayout.tsx` - Layout principal da aplicação
- `Header.tsx` - Cabeçalho da aplicação
- `Sidebar.tsx` - Barra lateral de navegação
- `Footer.tsx` - Rodapé da aplicação

#### `components/ui/`
Componentes de interface reutilizáveis:
- `Button.tsx` - Botões estilizados
- `Input.tsx` - Campos de entrada
- `Label.tsx` - Rótulos de formulários
- `Table.tsx` - Componentes de tabela
- `Card.tsx` - Cards de conteúdo
- `Modal.tsx` - Modais e diálogos

### `features/`
Funcionalidades principais da aplicação, organizadas por domínio:

#### `features/auth/`
- `LoginForm.tsx` - Formulário de login
- `useAuth.ts` - Hook para gerenciamento de autenticação
- `AuthProvider.tsx` - Provider de contexto de autenticação
- `usuarioService.ts` - Serviço para operações com usuários

#### `features/collaborators/`
- `CollaboratorList.tsx` - Lista de colaboradores
- `CollaboratorForm.tsx` - Formulário de cadastro/edição
- `colaboradorService.ts` - Serviço para operações com colaboradores

#### `features/tests/`
- `TestList.tsx` - Lista de testes
- `TestForm.tsx` - Formulário de criação/edição de testes
- `TestEditor.tsx` - Editor avançado de testes
- `testeService.ts` - Serviço para operações com testes
- `testeVersaoService.ts` - Serviço para versionamento de testes
- `testesOficiais.ts` - Biblioteca de testes pré-configurados
- `seedTestesOficiais.ts` - Função para semear testes oficiais

#### `features/assessments/`
- `AssessmentList.tsx` - Lista de avaliações
- `AssessmentForm.tsx` - Formulário de criação/edição de avaliações
- `AssessmentDetail.tsx` - Detalhes da avaliação
- `avaliacaoService.ts` - Serviço para operações com avaliações
- `useAvaliacoes.ts` - Hook para gerenciamento de avaliações

#### `features/responses/`
- `AvaliacaoPublica.tsx` - Interface pública para responder avaliações
- `respostaService.ts` - Serviço para operações com respostas
- `useRespostas.ts` - Hook para gerenciamento de respostas
- `validarTokenRPC.ts` - Funções para validação de tokens e salvamento de respostas

#### `features/reports/`
- `ReportList.tsx` - Lista de relatórios
- `ReportDetail.tsx` - Detalhes do relatório
- `ReportChart.tsx` - Componentes de gráficos
- `reportService.ts` - Serviço para geração de relatórios

### `hooks/`
- `useAuth.ts` - Hook para gerenciamento de autenticação
- `useTestes.ts` - Hook para gerenciamento de testes
- `useAvaliacoes.ts` - Hook para gerenciamento de avaliações
- `useRespostas.ts` - Hook para gerenciamento de respostas

### `lib/`
- `supabaseClient.ts` - Cliente do Supabase
- `dataService.ts` - Serviço agregador de dados
- `utils.ts` - Funções utilitárias

### `providers/`
- `AuthProvider.tsx` - Provider de contexto de autenticação

### `stores/`
- Gerenciamento de estado (se necessário)

### `types/`
- Definições de tipos TypeScript

### `utils/`
- Funções utilitárias reutilizáveis

## Padrões de Nomenclatura

### Componentes
- Nome em PascalCase: `Button.tsx`, `UserForm.tsx`
- Sufixo do tipo de componente: `List`, `Form`, `Detail`, `Editor`

### Serviços
- Nome do recurso + "Service": `usuarioService.ts`, `testeService.ts`

### Hooks
- Prefixo "use": `useAuth.ts`, `useTestes.ts`

### Arquivos de estilo
- Mesmo nome do componente: `Button.tsx` e `Button.css`

## Convenções de Código

### Componentes
```typescript
// Componente funcional com tipagem
import React from 'react'

interface Props {
  title: string
  onClick: () => void
}

const Button: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button onClick={onClick}>
      {title}
    </button>
  )
}

export default Button
```

### Serviços
```typescript
// Serviço com funções assíncronas
import { supabase } from '@/lib/supabaseClient'
import type { Usuario } from '@/lib/supabaseClient'

export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
    
    if (error) throw error
    return data || []
  }
}
```

### Hooks
```typescript
// Hook com React Query
import { useQuery } from '@tanstack/react-query'
import { usuarioService } from '@/lib/usuarioService'

export const useUsuarios = () => {
  return useQuery(['usuarios'], () => usuarioService.getAll())
}
```