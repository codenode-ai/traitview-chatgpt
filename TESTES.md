# Testes do TraitView

## Visão Geral

O TraitView utiliza uma combinação de testes unitários, testes de integração e testes end-to-end para garantir a qualidade do código e a funcionalidade da aplicação.

## Estrutura de Testes

```
src/
├── __tests__/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   └── lib/
├── __mocks__/
└── __fixtures__/
```

## Configuração

### Dependências
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest ts-jest @types/jest
npm install --save-dev supabase jest-mock-fetch
```

### Configuração do Jest
`jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### Setup dos testes
`src/__tests__/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

## Testes Unitários

### Componentes

#### Teste de componente simples
```typescript
// src/__tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Hooks

#### Teste de hook personalizado
```typescript
// src/__tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/features/auth/useAuth'

describe('useAuth', () => {
  it('initializes with null user', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
  })

  it('handles login', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password')
    })
    
    expect(result.current.user).not.toBeNull()
  })
})
```

### Serviços

#### Teste de serviço com mock do Supabase
```typescript
// src/__tests__/lib/usuarioService.test.ts
import { usuarioService } from '@/features/auth/usuarioService'
import { supabase } from '@/lib/supabaseClient'

// Mock do cliente Supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis()
  }
}))

describe('usuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches all users', async () => {
    const mockUsers = [
      { id: '1', email: 'test1@example.com', nome: 'Test 1' },
      { id: '2', email: 'test2@example.com', nome: 'Test 2' }
    ]
    
    ;(supabase.from().select().order as jest.Mock).mockResolvedValue({
      data: mockUsers,
      error: null
    })

    const users = await usuarioService.getAll()
    expect(users).toEqual(mockUsers)
  })
})
```

## Testes de Integração

### Testes com React Query

#### Teste de hook com React Query
```typescript
// src/__tests__/hooks/useTestes.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTestes } from '@/features/tests/useTestes'

// Mock do serviço de testes
jest.mock('@/lib/dataService', () => ({
  dataService: {
    testes: {
      getAll: jest.fn()
    }
  }
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTestes', () => {
  it('fetches testes successfully', async () => {
    const mockTestes = [
      { id: '1', nome: 'Teste 1' },
      { id: '2', nome: 'Teste 2' }
    ]
    
    ;(require('@/lib/dataService').dataService.testes.getAll as jest.Mock)
      .mockResolvedValue(mockTestes)

    const { result } = renderHook(() => useTestes(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.testes).toEqual(mockTestes)
    })
  })
})
```

## Testes End-to-End

### Configuração com Cypress

#### Instalação
```bash
npm install --save-dev cypress @testing-library/cypress
```

#### Configuração
`cypress.config.ts`:
```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

#### Teste E2E básico
```typescript
// cypress/e2e/login.cy.ts
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('displays error for invalid credentials', () => {
    cy.get('[data-testid="email"]').type('invalid@example.com')
    cy.get('[data-testid="password"]').type('wrongpassword')
    cy.get('[data-testid="submit"]').click()
    
    cy.contains('Erro ao fazer login').should('be.visible')
  })

  it('redirects to dashboard for valid credentials', () => {
    cy.get('[data-testid="email"]').type('admin@traitview.com')
    cy.get('[data-testid="password"]').type('password123')
    cy.get('[data-testid="submit"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.contains('Dashboard').should('be.visible')
  })
})
```

## Mocks e Fixtures

### Mocks do Supabase

#### Mock de autenticação
```typescript
// src/__mocks__/supabaseAuth.ts
export const mockSupabaseAuth = {
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: {
      subscription: {
        unsubscribe: jest.fn()
      }
    }
  })
}
```

### Fixtures de dados

#### Fixture de usuário
```typescript
// src/__fixtures__/usuario.ts
export const usuarioFixture = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'admin@traitview.com',
  nome: 'Administrador Demo',
  tipo: 'admin',
  ativo: true,
  created_at: '2023-01-01T00:00:00Z'
}
```

## Execução dos Testes

### Scripts npm

#### package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

### Execução

#### Testes unitários
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

#### Testes E2E
```bash
# Executar testes E2E em headless mode
npm run test:e2e

# Abrir interface do Cypress
npm run test:e2e:open
```

## Cobertura de Testes

### Métricas recomendadas
- **Linhas**: 80%+
- **Funções**: 80%+
- **Branches**: 70%+
- **Statements**: 80%+

### Relatório de cobertura
O relatório de cobertura é gerado em `coverage/` após executar `npm run test:coverage`.

## Integração Contínua

### GitHub Actions

#### .github/workflows/test.yml
```yaml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run E2E tests
      run: npm run test:e2e
```

## Melhores Práticas

### Escrevendo testes eficazes

1. **Teste uma coisa por vez**
   ```typescript
   // Bom
   it('displays error message for empty email', () => {
     // ...
   })

   // Ruim
   it('validates form and submits data', () => {
     // ...
   })
   ```

2. **Use nomes descritivos**
   ```typescript
   // Bom
   it('redirects to dashboard after successful login', () => {
     // ...
   })

   // Ruim
   it('works', () => {
     // ...
   })
   ```

3. **Mock apenas o necessário**
   ```typescript
   // Mock apenas o serviço específico, não o cliente inteiro
   jest.mock('@/features/auth/usuarioService')
   ```

4. **Teste comportamentos, não implementações**
   ```typescript
   // Bom - testa o comportamento
   expect(screen.getByText('Usuário criado com sucesso')).toBeInTheDocument()

   // Ruim - testa implementação
   expect(usuarioService.create).toHaveBeenCalledWith(userData)
   ```

### Organização de testes

1. **Estrutura AAA (Arrange, Act, Assert)**
   ```typescript
   it('displays user name after login', () => {
     // Arrange
     const user = { nome: 'João Silva' }
     
     // Act
     render(<UserProfile user={user} />)
     
     // Assert
     expect(screen.getByText('João Silva')).toBeInTheDocument()
   })
   ```

2. **Use beforeEach para setup comum**
   ```typescript
   describe('UserProfile', () => {
     let user: any
     
     beforeEach(() => {
       user = { nome: 'João Silva', email: 'joao@example.com' }
     })
     
     it('displays user name', () => {
       render(<UserProfile user={user} />)
       expect(screen.getByText('João Silva')).toBeInTheDocument()
     })
   })
   ```

3. **Separe testes positivos e negativos**
   ```typescript
   describe('LoginForm', () => {
     describe('success cases', () => {
       // ...
     })
     
     describe('error cases', () => {
       // ...
     })
   })
   ```

## Debugging de Testes

### Erros comuns e soluções

#### "Cannot find module"
- Verifique os paths nos aliases do TypeScript
- Certifique-se de que os mocks estão no diretório correto

#### "Async operations not completed"
- Use `act()` para operações assíncronas
- Use `waitFor()` para esperar mudanças no DOM

#### "Expected mock function to be called"
- Verifique se o mock está no escopo correto
- Certifique-se de que a função mockada está sendo chamada

### Ferramentas de debugging

1. **Console.log nos testes**
   ```typescript
   it('debug test', () => {
     console.log('Debug point 1')
     // ...
     console.log('Debug point 2')
   })
   ```

2. **Jest debugger**
   ```bash
   node --inspect-brk node_modules/.bin/jest --runInBand
   ```

3. **Cypress debugger**
   ```javascript
   cy.get('[data-testid="button"]').debug().click()
   ```