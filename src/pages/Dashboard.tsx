import { useQuery } from '@tanstack/react-query'
import { dataService } from '@/lib/dataService'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { motion } from "framer-motion"

export default function Dashboard() {
  // Buscar dados do Supabase
  const { 
    data: colaboradores = [], 
    isLoading: loadingColaboradores,
    error: errorColaboradores
  } = useQuery({
    queryKey: ['colaboradores'],
    queryFn: async () => {
      console.log('Dashboard: Buscando colaboradores...')
      try {
        const result = await dataService.colaboradores.getAll()
        console.log('Dashboard: Colaboradores encontrados:', result)
        return result
      } catch (error) {
        console.error('Dashboard: Erro ao buscar colaboradores:', error)
        throw error
      }
    }
  })

  const { 
    data: testes = [], 
    isLoading: loadingTestes,
    error: errorTestes
  } = useQuery({
    queryKey: ['testes'],
    queryFn: async () => {
      console.log('Dashboard: Buscando testes...')
      try {
        const result = await dataService.testes.getAll()
        console.log('Dashboard: Testes encontrados:', result)
        return result
      } catch (error) {
        console.error('Dashboard: Erro ao buscar testes:', error)
        throw error
      }
    }
  })

  const { 
    data: avaliacoes = [], 
    isLoading: loadingAvaliacoes,
    error: errorAvaliacoes
  } = useQuery({
    queryKey: ['avaliacoes'],
    queryFn: async () => {
      console.log('Dashboard: Buscando avaliações...')
      try {
        const result = await dataService.avaliacoes.getAll()
        console.log('Dashboard: Avaliações encontradas:', result)
        return result
      } catch (error) {
        console.error('Dashboard: Erro ao buscar avaliações:', error)
        throw error
      }
    }
  })

  // Dados para os gráficos
  const chart1 = [
    { name: "Colabs", value: colaboradores.length },
    { name: "Testes", value: testes.length },
    { name: "Avaliações", value: avaliacoes.length }
  ]

  const radarData = [
    { k: "Confiabilidade", v: 4.1 },
    { k: "Agilidade", v: 3.6 },
    { k: "Colaboração", v: 3.9 },
    { k: "Documentação", v: 3.2 },
    { k: "Autonomia", v: 4.3 }
  ]

  // Verificar se há erros
  if (errorColaboradores || errorTestes || errorAvaliacoes) {
    console.error('Dashboard: Erros encontrados:', { errorColaboradores, errorTestes, errorAvaliacoes })
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        <h1 className="text-2xl font-bold mb-2">Erro ao carregar dashboard</h1>
        <p>Verifique o console para mais detalhes.</p>
        {errorColaboradores && <p className="text-red-500 text-sm">{errorColaboradores.message}</p>}
        {errorTestes && <p className="text-red-500 text-sm">{errorTestes.message}</p>}
        {errorAvaliacoes && <p className="text-red-500 text-sm">{errorAvaliacoes.message}</p>}
      </motion.div>
    )
  }

  // Mostrar loading enquanto carrega os dados
  if (loadingColaboradores || loadingTestes || loadingAvaliacoes) {
    console.log('Dashboard: Mostrando tela de carregamento...', { loadingColaboradores, loadingTestes, loadingAvaliacoes })
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

  console.log('Dashboard: Renderizando conteúdo', { colaboradores, testes, avaliacoes })

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Status do Sistema</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart1}>
                  <XAxis dataKey="name" stroke="#a0a0a0" />
                  <YAxis allowDecimals={false} stroke="#a0a0a0" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f3460', 
                      borderColor: '#2a2a4a', 
                      color: '#e6e6e6' 
                    }} 
                  />
                  <Bar dataKey="value" fill="#4a90e2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Exemplo de Radar</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2a4a" />
                  <PolarAngleAxis dataKey="k" stroke="#a0a0a0" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#a0a0a0" />
                  <Radar dataKey="v" fill="#4a90e2" fillOpacity={0.6} stroke="#4a90e2" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
