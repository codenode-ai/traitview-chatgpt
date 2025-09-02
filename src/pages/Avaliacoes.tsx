import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { LinksAcesso } from "@/components/LinksAcesso";
import { getLocalOrigin } from "@/utils/getLocalIP";
import { Copy, Link as LinkIcon } from "lucide-react";

export default function Avaliacoes() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [generatedLinks, setGeneratedLinks] = useState<any[]>([]);
  const [localOrigin, setLocalOrigin] = useState<string>('http://localhost:3001');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Obter o IP local quando o componente montar
  useEffect(() => {
    getLocalOrigin().then(setLocalOrigin).catch(console.error);
  }, []);

  // Buscar dados do Supabase
  const { data: tests = [], isLoading: loadingTests, error: testsError } = useQuery({
    queryKey: ['testes'],
    queryFn: () => dataService.testes.getAll()
  });

  // Função para alternar seleção de teste
  const toggleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId) 
        : [...prev, testId]
    );
  };

  // Mutation para gerar links de acesso
  const generateLinksMutation = useMutation({
    mutationFn: async () => {
      if (selectedTests.length === 0) {
        throw new Error("Selecione pelo menos um teste.");
      }

      try {
        setIsGenerating(true);
        
        // Criar a avaliação
        const avaliacao = await dataService.avaliacoes.create({
          nome: `Avaliação para ${email || 'candidato'}`,
          descricao: null,
          criado_por: null, // Não há usuário logado no single-tenant
          testes_ids: selectedTests
          // status será 'rascunho' por padrão, atualizaremos depois
        });

        // Atualizar status para 'enviada'
        await dataService.avaliacoes.update(avaliacao.id, { status: 'enviada' });

        // Criar respostas para cada teste selecionado
        const respostasPromises = selectedTests.map(testeId => 
          dataService.respostas.create({
            avaliacao_id: avaliacao.id,
            colaborador_id: null, // Não há colaborador associado
            teste_id: testeId,
            teste_versao: 1, // TODO: Obter versão correta do teste
            respostas: null,
            resultado: null
          })
        );

        const respostas = await Promise.all(respostasPromises);

        // Formatar links para exibição (apenas um link para todos os testes)
        // Usamos o link da primeira resposta, mas todas as respostas estão associadas à mesma avaliação
        const linkData = {
          id: respostas[0].id,
          testName: `${selectedTests.length} testes selecionados`,
          link: `${localOrigin}/avaliacao/${respostas[0].link_acesso}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias a partir de agora
        };
        
        console.log("🔗 Link gerado:", linkData);
        console.log("🌐 Local origin:", localOrigin);
        console.log("🔑 Link acesso:", respostas[0].link_acesso);
        
        return [linkData];
      } catch (error: any) {
        console.error("Erro ao gerar links:", error);
        throw new Error(error.message || "Erro ao gerar links. Verifique o console para mais detalhes.");
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: (links) => {
      setGeneratedLinks(links);
      alert("Links gerados com sucesso! Copie-os abaixo para enviar aos candidatos.");
    },
    onError: (error: any) => {
      console.error("Erro ao gerar links:", error);
      alert(error.message || "Erro ao gerar links. Verifique o console para mais detalhes.");
    }
  });

  // Função para copiar todos os links
  const copyAllLinks = () => {
    const linksText = generatedLinks.map(link => 
      `${link.testName}: ${link.link}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(linksText);
    alert("Todos os links foram copiados para a área de transferência!");
  };

  // Mostrar loading enquanto carrega os dados
  if (loadingTests) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando testes...
      </motion.div>
    );
  }

  // Mostrar erro se houver problemas
  if (testsError) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        <div className="text-red-500">
          Erro ao carregar testes: {testsError?.message}
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Recarregar página
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seção de geração de links */}
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Gerar Links para Testes</h2>
            
            <div className="grid gap-4">
              <div>
                <Label>E-mail do candidato (opcional)</Label>
                <Input 
                  type="email" 
                  placeholder="exemplo@candidato.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div>
                <Label>Selecione os testes</Label>
                <div className="border rounded-xl p-3 max-h-60 overflow-y-auto">
                  {Array.isArray(tests) && tests.map(test => (
                    <div key={test.id} className="flex items-center mb-2 last:mb-0">
                      <input
                        type="checkbox"
                        id={`test-${test.id}`}
                        checked={selectedTests.includes(test.id)}
                        onChange={() => toggleTestSelection(test.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`test-${test.id}`} className="text-sm">
                        {test.nome}
                      </label>
                    </div>
                  ))}
                  {(!Array.isArray(tests) || tests.length === 0) && (
                    <div className="text-sm text-muted-foreground">
                      Nenhum teste disponível
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => generateLinksMutation.mutate()}
                disabled={generateLinksMutation.isPending || isGenerating || selectedTests.length === 0}
                className="w-full"
              >
                {generateLinksMutation.isPending || isGenerating ? 'Gerando links...' : 'Gerar Links de Acesso'}
              </Button>
            </div>
          </div>
          
          {/* Seção de links gerados */}
          <div className="border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Links Gerados</h2>
              {generatedLinks.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyAllLinks}
                  className="flex items-center gap-1"
                >
                  <Copy size={16} />
                  Copiar Todos
                </Button>
              )}
            </div>
            
            {generatedLinks.length > 0 ? (
              <LinksAcesso links={generatedLinks} />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <LinkIcon size={48} className="mx-auto mb-3 text-muted-foreground/30" />
                <p>Nenhum link gerado ainda.</p>
                <p className="text-sm mt-1">Selecione testes e clique em "Gerar Links de Acesso".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}