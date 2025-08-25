import { useState } from 'react'
import { useAuth } from './useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [tipo, setTipo] = useState<'admin' | 'editor' | 'visualizador'>('editor')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('LoginForm: handleSubmit()', { email, password, name, tipo, isSignUp })
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem')
        }
        console.log('LoginForm: Chamando signUp...')
        await signUp(email, password, name, tipo)
        console.log('LoginForm: signUp concluído')
      } else {
        console.log('LoginForm: Chamando signIn...')
        await signIn(email, password)
        console.log('LoginForm: signIn concluído')
      }
    } catch (err: any) {
      console.error('LoginForm: Erro no submit:', err)
      setError(err.message || (isSignUp ? 'Erro ao criar conta' : 'Erro ao fazer login'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">TraitView</h1>
        <p className="text-muted-foreground">
          {isSignUp ? 'Crie sua conta' : 'Faça login para acessar o sistema'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black"
            placeholder="seu@email.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black"
            placeholder="••••••••"
          />
        </div>

        {isSignUp && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-black"
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="text-black"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Usuário</Label>
              <Select value={tipo} onValueChange={(value: any) => setTipo(value)}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="visualizador">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Administrador: Acesso total<br />
                Editor: Cria/edita conteúdo<br />
                Visualizador: Apenas visualiza relatórios
              </p>
            </div>
          </>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? (
            isSignUp ? 'Criando conta...' : 'Entrando...'
          ) : (
            isSignUp ? 'Criar Conta' : 'Entrar'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="outline"
          onClick={() => {
            console.log('LoginForm: Alternando modo signup/login')
            setIsSignUp(!isSignUp)
            setError(null)
          }}
          className="w-full"
        >
          {isSignUp 
            ? 'Já tem uma conta? Faça login' 
            : 'Não tem uma conta? Crie uma'}
        </Button>
      </div>

      {!isSignUp && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Esqueceu sua senha? Contate o administrador do sistema.</p>
        </div>
      )}
    </div>
  )
}