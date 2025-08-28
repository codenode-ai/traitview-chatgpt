import { useQuery } from '@tanstack/react-query'
import { dataService } from '@/lib/dataService'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { motion } from "framer-motion"
import { Users, FileText, Clipboard, TrendingUp, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Dashboard() {
  // Buscar dados do Supabase
  const { 
    data: colaboradores = [], 
    isLoading: loadingColaboradores,
    error: errorColaboradores
  } = useQuery({
    queryKey: ['colaboradores'],
    queryFn: () => dataService.colaboradores.getAll()
  })

  const { 
    data: testes = [], 
    isLoading: loadingTestes,
    error: errorTestes
  } = useQuery({
    queryKey: ['testes'],
    queryFn: () => dataService.testes.getAll()
  })

  const { 
    data: avaliacoes = [], 
    isLoading: loadingAvaliacoes,
    error: errorAvaliacoes
  } = useQuery({
    queryKey: ['avaliacoes'],
    queryFn: () => dataService.avaliacoes.getAll()
  })

  const { 
    data: respostas = [], 
    isLoading: loadingRespostas,
    error: errorRespostas
  } = useQuery({
    queryKey: ['respostas'],
    queryFn: () => dataService.respostas.getAll()
  })

  // Verificar se há erros
  if (errorColaboradores || errorTestes || errorAvaliacoes || errorRespostas) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        <h1 className="text-2xl font-bold mb-2">Erro ao carregar dashboard</h1>
        <p>Verifique o console para mais detalhes.</p>
      </motion.div>
    )
  }

  // Mostrar loading enquanto carrega os dados
  if (loadingColaboradores || loadingTestes || loadingAvaliacoes || loadingRespostas) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando dashboard...
      </motion.div>
    )
  }

  // Dados para os cards principais
  const totalColaboradores = colaboradores.length
  const totalTestes = testes.length
  const totalAvaliacoes = avaliacoes.length
  const totalRespostas = respostas.length
  
  // Status das respostas
  const respostasPendentes = respostas.filter(r => r.status === 'pendente').length
  const respostasEmAndamento = respostas.filter(r => r.status === 'iniciada').length
  const respostasConcluidas = respostas.filter(r => r.status === 'concluida').length

  // Dados para os gráficos
  const chartData = [
    { name: "Colaboradores", value: totalColaboradores },
    { name: "Testes", value: totalTestes },
    { name: "Avaliações", value: totalAvaliacoes },
    { name: "Respostas", value: totalRespostas }
  ]

  // Dados para o gráfico de status das respostas
  const statusData = [
    { name: "Pendentes", value: respostasPendentes, color: "#f59e0b" },
    { name: "Em Andamento", value: respostasEmAndamento, color: "#3b82f6" },
    { name: "Concluídas", value: respostasConcluidas, color: "#10b981" }
  ]

  // Últimas avaliações
  const ultimasAvaliacoes = [...avaliacoes]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Dados para o gráfico de radar (métricas do sistema)
  const radarData = [
    { metrica: "Confiabilidade", valor: 4.1 },
    { metrica: "Agilidade", valor: 3.6 },
    { metrica: "Colaboração", valor: 3.9 },
    { metrica: "Documentação", valor: 3.2 },
    { metrica: "Autonomia", valor: 4.3 }
  ]

  // Função para formatar datas
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalColaboradores}</div>
              <p className="text-xs text-muted-foreground">Total cadastrados</p>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTestes}</div>
              <p className="text-xs text-muted-foreground">Testes disponíveis</p>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAvaliacoes}</div>
              <p className="text-xs text-muted-foreground">Avaliações criadas</p>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRespostas}</div>
              <p className="text-xs text-muted-foreground">Total de respostas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de status das respostas */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Status das Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}`, 'Quantidade']}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--card-foreground)' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de métricas do sistema */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Métricas do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="metrica" stroke="var(--muted-foreground)" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="var(--muted-foreground)" />
                    <Radar 
                      name="Métricas" 
                      dataKey="valor" 
                      stroke="var(--primary)" 
                      fill="var(--primary)" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--card-foreground)' 
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Últimas avaliações */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Últimas Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ultimasAvaliacoes.length > 0 ? (
                  ultimasAvaliacoes.map(avaliacao => (
                    <div key={avaliacao.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h3 className="font-medium">{avaliacao.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criada em {formatDate(avaliacao.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          avaliacao.status === 'enviada' ? 'bg-blue-500/20 text-blue-500' :
                          avaliacao.status === 'concluida' ? 'bg-green-500/20 text-green-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {avaliacao.status === 'enviada' ? 'Enviada' : 
                           avaliacao.status === 'concluida' ? 'Concluída' : 'Rascunho'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma avaliação criada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status rápido */}
          <Card>
            <CardHeader>
              <CardTitle>Status Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">{respostasPendentes}</p>
                    <p className="text-xs text-muted-foreground">Respostas Pendentes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{respostasEmAndamento}</p>
                    <p className="text-xs text-muted-foreground">Em Andamento</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{respostasConcluidas}</p>
                    <p className="text-xs text-muted-foreground">Concluídas</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Taxa de Conclusão</h3>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: totalRespostas > 0 
                          ? `${(respostasConcluidas / totalRespostas) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalRespostas > 0 
                      ? `${Math.round((respostasConcluidas / totalRespostas) * 100)}% concluído`
                      : '0% concluído'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}