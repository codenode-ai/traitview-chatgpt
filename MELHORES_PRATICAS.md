# Melhores Práticas do TraitView

## Arquitetura e Estrutura

### Separação de Responsabilidades

#### Princípio da Única Responsabilidade (SRP)
Cada componente, hook e serviço deve ter uma única responsabilidade bem definida:

```typescript
// Bom - Componente com responsabilidade única
const UserList: React.FC = () => {
  const { users, loading } = useUsers()
  
  if (loading) return <LoadingSpinner />
  
  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}

// Ruim - Componente com múltiplas responsabilidades
const UserList: React.FC = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])
  
  // Lógica de filtragem embutida
  const [filter, setFilter] = useState('')
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  // Lógica de paginação embutida
  const [page, setPage] = useState(1)
  const paginatedUsers = filteredUsers.slice((page - 1) * 10, page * 10)
  
  return (
    // ... renderização complexa
  )
}
```

### Arquitetura em Camadas

#### Separação clara de camadas:
1. **Componentes UI** - Apenas apresentação
2. **Hooks** - Lógica de estado e efeitos
3. **Serviços** - Comunicação com APIs e lógica de negócio
4. **Utils** - Funções utilitárias reutilizáveis

```typescript
// services/userService.ts - Camada de serviço
export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw new Error(error.message)
    return data || []
  }
}

// hooks/useUsers.ts - Camada de hook
export const useUsers = () => {
  return useQuery(['users'], () => userService.getUsers())
}

// components/UserList.tsx - Camada de UI
const UserList: React.FC = () => {
  const { data: users, isLoading } = useUsers()
  
  if (isLoading) return <LoadingSpinner />
  
  return (
    <ul>
      {users?.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}
```

## Tipagem e TypeScript

### Tipos Explícitos

#### Defina interfaces para objetos complexos:
```typescript
// types/user.ts
export interface User {
  id: string
  email: string
  nome: string
  tipo: 'admin' | 'editor' | 'visualizador'
  ativo: boolean
  created_at: string
}

export interface UserFormData {
  email: string
  nome: string
  tipo: User['tipo']
}
```

#### Evite `any`:
```typescript
// Bom
const processUser = (user: User): string => {
  return `${user.nome} (${user.email})`
}

// Ruim
const processUser = (user: any): any => {
  return user.name + ' (' + user.email + ')'
}
```

### Generics para reutilização

```typescript
// hooks/useApi.ts
export const useApi = <T>(endpoint: string) => {
  return useQuery<T>([endpoint], async () => {
    const response = await fetch(endpoint)
    return response.json()
  })
}

// Uso específico
const { data: users } = useApi<User[]>('/api/users')
const { data: tests } = useApi<Test[]>('/api/tests')
```

## Componentes

### Componentes Funcionais

#### Prefira componentes funcionais com hooks:
```typescript
// Bom
const Counter: React.FC = () => {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}

// Ruim - Classe componente desnecessária
class Counter extends React.Component {
  state = { count: 0 }
  
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    )
  }
}
```

### Props e Children

#### Tipagem de props:
```typescript
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false 
}) => {
  // ...
}
```

#### Desestruturação de props:
```typescript
// Bom
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <h2>{user.nome}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// Aceitável para props simples
const Button: React.FC<ButtonProps> = (props) => {
  const { children, variant, size, onClick, disabled } = props
  // ...
}
```

## Hooks

### Hooks Customizados

#### Extraia lógica repetida:
```typescript
// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
```

#### Hooks compostos:
```typescript
// hooks/useUserManagement.ts
export const useUserManagement = () => {
  const { data: users, isLoading } = useUsers()
  const { mutate: createUser } = useCreateUser()
  const { mutate: updateUser } = useUpdateUser()
  const { mutate: deleteUser } = useDeleteUser()

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser
  }
}
```

## Gerenciamento de Estado

### Estado Local vs Global

#### Use estado local para dados component-specific:
```typescript
// Bom - Estado local para formulário
const UserForm: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  
  const handleSubmit = () => {
    // ...
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

#### Use estado global para dados compartilhados:
```typescript
// stores/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // ...
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  }
}))
```

## Performance

### Memoização

#### Use `React.memo` para componentes:
```typescript
// Bom - Componente memoizado
const UserItem: React.FC<{ user: User }> = React.memo(({ user }) => {
  return (
    <div>
      <h3>{user.nome}</h3>
      <p>{user.email}</p>
    </div>
  )
})
```

#### Use `useMemo` e `useCallback`:
```typescript
const UserList: React.FC = () => {
  const { users } = useUsers()
  
  // Memoiza cálculos pesados
  const expensiveValue = useMemo(() => {
    return users.reduce((acc, user) => acc + user.score, 0)
  }, [users])
  
  // Memoiza callbacks
  const handleUserClick = useCallback((userId: string) => {
    // ...
  }, [])
  
  return (
    <div>
      <p>Total Score: {expensiveValue}</p>
      {users.map(user => (
        <UserItem 
          key={user.id} 
          user={user} 
          onClick={handleUserClick}
        />
      ))}
    </div>
  )
}
```

### Lazy Loading

#### Carregue componentes sob demanda:
```typescript
// routes.tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Users = lazy(() => import('@/pages/Users'))

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Suspense>
  )
}
```

## Estilização

### Componentes de UI Reutilizáveis

#### Crie componentes primitivos:
```typescript
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### CSS Modules ou Tailwind

#### Prefira utilitários de classe:
```typescript
// Bom - Tailwind
const Card: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Título</h3>
      <p className="text-gray-600">Conteúdo do card</p>
    </div>
  )
}

// Ruim - CSS inline
const Card: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
      }}>Título</h3>
      <p style={{ color: '#4b5563' }}>Conteúdo do card</p>
    </div>
  )
}
```

## Tratamento de Erros

### Tratamento Global

#### Crie um provedor de erros:
```typescript
// providers/ErrorProvider.tsx
interface ErrorContextType {
  error: Error | null
  setError: (error: Error | null) => void
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {}
})

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null)

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      {error && (
        <ErrorModal 
          error={error} 
          onClose={() => setError(null)} 
        />
      )}
    </ErrorContext.Provider>
  )
}

export const useError = () => useContext(ErrorContext)
```

### Tratamento de Erros em Async Operations

#### Use try/catch com feedback ao usuário:
```typescript
const UserForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (data: UserFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      await userService.createUser(data)
      
      // Sucesso
      toast.success('Usuário criado com sucesso!')
    } catch (err) {
      // Erro
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    // ...
  )
}
```

## Testabilidade

### Código Testável

#### Evite lógica complexa em componentes:
```typescript
// Bom - Lógica extraída para hook
const useFilteredUsers = (users: User[], filter: string) => {
  return useMemo(() => {
    if (!filter) return users
    return users.filter(user => 
      user.nome.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    )
  }, [users, filter])
}

const UserList: React.FC = () => {
  const { users } = useUsers()
  const [filter, setFilter] = useState('')
  const filteredUsers = useFilteredUsers(users, filter)
  
  return (
    // ...
  )
}

// Ruim - Lógica complexa no componente
const UserList: React.FC = () => {
  const { users } = useUsers()
  const [filter, setFilter] = useState('')
  
  // Lógica complexa no componente
  const filteredUsers = users.filter(user => {
    // Múltiplas condições complexas
    if (!filter) return true
    
    const nameMatch = user.nome.toLowerCase().includes(filter.toLowerCase())
    const emailMatch = user.email.toLowerCase().includes(filter.toLowerCase())
    const departmentMatch = user.department?.toLowerCase().includes(filter.toLowerCase())
    
    return nameMatch || emailMatch || departmentMatch
  })
  
  return (
    // ...
  )
}
```

### Mocks para Testes

#### Estruture código para fácil mocking:
```typescript
// services/apiClient.ts
export const apiClient = {
  get: <T>(url: string): Promise<T> => {
    return fetch(url).then(res => res.json())
  },
  
  post: <T>(url: string, data: any): Promise<T> => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  }
}

// services/userService.ts
import { apiClient } from './apiClient'

export const userService = {
  getUsers: (): Promise<User[]> => {
    return apiClient.get('/api/users')
  },
  
  createUser: (user: UserFormData): Promise<User> => {
    return apiClient.post('/api/users', user)
  }
}

// __mocks__/userService.ts
export const userService = {
  getUsers: jest.fn().mockResolvedValue([]),
  createUser: jest.fn().mockResolvedValue({})
}
```

## Segurança

### Proteção contra XSS

#### Sanitize dados do usuário:
```typescript
// utils/sanitize.ts
export const sanitize = (input: string): string => {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

// components/UserContent.tsx
const UserContent: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = useMemo(() => sanitize(content), [content])
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  )
}
```

### Proteção de Rotas

#### Verifique permissões:
```typescript
// components/ProtectedRoute.tsx
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode
  requiredRole?: UserRole 
}> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />
  }
  
  return <>{children}</>
}
```

## Documentação

### Comentários Úteis

#### Documente decisões complexas:
```typescript
// Por que usamos debounce aqui?
// Para evitar chamadas excessivas à API durante a digitação
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    setSearchQuery(query)
  }, 300),
  []
)

useEffect(() => {
  debouncedSearch(searchTerm)
  
  // Cleanup do debounce
  return () => debouncedSearch.cancel()
}, [searchTerm, debouncedSearch])
```

### JSDoc para Funções Complexas

```typescript
/**
 * Calcula o score de compatibilidade de um usuário com base em suas respostas
 * 
 * @param answers - Array de respostas do usuário
 * @param profile - Perfil de referência para comparação
 * @param weights - Pesos para cada dimensão (opcional)
 * @returns Score de compatibilidade entre 0 e 100
 * 
 * @example
 * ```typescript
 * const score = calculateCompatibilityScore(
 *   userAnswers,
 *   referenceProfile,
 *   { leadership: 0.3, communication: 0.7 }
 * )
 * ```
 */
export const calculateCompatibilityScore = (
  answers: Answer[],
  profile: Profile,
  weights?: Record<string, number>
): number => {
  // ...
}
```

## Manutenibilidade

### Código Legível

#### Use nomes descritivos:
```typescript
// Bom
const calculateAverageResponseTime = (responses: Response[]): number => {
  if (responses.length === 0) return 0
  
  const totalTime = responses.reduce((sum, response) => {
    return sum + (response.completedAt.getTime() - response.startedAt.getTime())
  }, 0)
  
  return totalTime / responses.length
}

// Ruim
const calcAvg = (resps: any[]): number => {
  if (resps.length === 0) return 0
  
  const tt = resps.reduce((s, r) => {
    return s + (r.c.getTime() - r.s.getTime())
  }, 0)
  
  return tt / resps.length
}
```

### Refatoração Contínua

#### Extraia funções complexas:
```typescript
// Antes - Função complexa
const processTestResults = (responses: Response[]) => {
  // 50 linhas de lógica complexa
}

// Depois - Funções menores e mais focadas
const calculateIndividualScores = (responses: Response[]) => {
  // ...
}

const generateReportData = (scores: Score[]) => {
  // ...
}

const processTestResults = (responses: Response[]) => {
  const scores = calculateIndividualScores(responses)
  return generateReportData(scores)
}
```

## Conclusão

Seguir estas melhores práticas ajudará a manter o código do TraitView limpo, testável, escalável e fácil de manter. Lembre-se de que estas são diretrizes, não regras absolutas - use seu julgamento para aplicá-las de forma apropriada ao contexto específico de cada situação.