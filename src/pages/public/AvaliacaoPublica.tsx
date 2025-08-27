import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMultiTestSession } from "@/features/responses/useMultiTestSession";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Play, RotateCcw } from "lucide-react";

export default function AvaliacaoPublica() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [currentTestIdx, setCurrentTestIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>({});
  const [timeLeft, setTimeLeft] = useState<number>(60 * 30); // 30 minutos em segundos
  const [testStarted, setTestStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Usar o hook personalizado para gerenciar a sessão de múltiplos testes
  const { 
    sessionData, 
    isLoading, 
    error, 
    salvarRespostas, 
    isSalvando 
  } = useMultiTestSession(token);

  // Timer para o teste
  useEffect(() => {
    if (!testStarted || timeLeft <= 0 || sessionCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, sessionCompleted]);

  // Formatar tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  if (error) {
    return <div className="p-10 text-center"><h1 className="text-2xl font-bold mb-2">Erro</h1><p>{error}</p></div>;
  }

  if (!sessionData || sessionData.testes.length === 0) {
    return <div className="p-10 text-center"><h1 className="text-2xl font-bold mb-2">Link inválido</h1><p>Esta avaliação não foi encontrada.</p></div>;
  }

  const testes = sessionData.testes;
  const currentTest = testes[currentTestIdx];
  const perguntas = currentTest?.teste_perguntas || [];
  const currentQuestion = perguntas[currentQuestionIdx];

  // Verificar se todos os testes foram concluídos
  const allTestsCompleted = testes.every((teste: any) => 
    teste.status_resposta === 'concluida'
  );

  function setValue(questionId: number, val: number) {
    setAnswers(prev => ({
      ...prev,
      [currentTest.teste_id]: {
        ...(prev[currentTest.teste_id] || {}),
        [questionId]: val
      }
    }));
  }

  function startTest() {
    setTestStarted(true);
  }

  function nextQuestion() {
    if (currentQuestionIdx + 1 < perguntas.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Se for a última pergunta, salvar respostas e ir para o próximo teste
      saveAndNextTest();
    }
  }

  async function saveAndNextTest() {
    if (!currentTest || !token) return;

    try {
      // Preparar as respostas no formato esperado
      const respostasFormatadas = perguntas.map((q: any) => ({
        pergunta_id: q.id,
        resposta: answers[currentTest.teste_id]?.[q.id] ?? 3, // Valor padrão 3 (neutro)
        pergunta_texto: q.texto
      }));

      // Salvar respostas do teste atual
      await salvarRespostas({
        respostaId: currentTest.resposta_id,
        respostas: respostasFormatadas
      });

      // Atualizar o status do teste atual localmente
      const updatedTestes = [...testes];
      updatedTestes[currentTestIdx].status_resposta = 'concluida';
      
      // Ir para o próximo teste ou finalizar sessão
      if (currentTestIdx + 1 < testes.length) {
        setCurrentTestIdx(prev => prev + 1);
        setCurrentQuestionIdx(0);
        // Resetar timer para o próximo teste
        setTimeLeft(60 * 30);
      } else {
        // Todos os testes concluídos
        setSessionCompleted(true);
      }
    } catch (err: any) {
      console.error("Erro ao salvar respostas:", err);
      alert("Erro ao salvar respostas. Verifique o console para mais detalhes.");
    }
  }

  function restartTest() {
    setCurrentQuestionIdx(0);
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentTest.teste_id];
      return newAnswers;
    });
    setTimeLeft(60 * 30);
  }

  // Se todos os testes foram concluídos
  if (allTestsCompleted || sessionCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="max-w-2xl mx-auto p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Avaliação concluída!</h1>
        <p className="text-muted-foreground mb-6">
          Obrigado por completar todos os testes. Suas respostas foram registradas com sucesso e os resultados serão processados.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate("/")}>Voltar para início</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                window.location.href = "/";
              }
            }}
            className="mt-2"
          >
            Fechar página
          </Button>
        </div>
      </motion.div>
    );
  }

  // Se o tempo acabou
  if (timeLeft === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="max-w-2xl mx-auto p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <Clock size={64} className="text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Tempo esgotado!</h1>
        <p className="text-muted-foreground mb-6">
          O tempo limite para conclusão do teste foi atingido.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate("/")}>Voltar para início</Button>
          <Button onClick={restartTest} variant="outline">
            <RotateCcw size={16} className="mr-2" />
            Reiniciar teste
          </Button>
        </div>
      </motion.div>
    );
  }

  // Tela inicial antes de começar o primeiro teste
  if (!testStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Você foi convidado para fazer testes de personalidade</h1>
          <p className="text-muted-foreground">
            Você fará {testes.length} testes diferentes
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {testes.map((teste: any, idx: number) => (
            <div key={teste.teste_id} className="rounded-xl border p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{teste.teste_nome}</h3>
                {teste.status_resposta === 'concluida' && (
                  <span className="badge bg-green-500 text-white">Concluído</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {teste.teste_descricao || "Descrição não disponível"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span>{teste.teste_perguntas?.length || 0} perguntas</span>
                <span>•</span>
                <span>~{Math.ceil((teste.teste_perguntas?.length || 0) * 30 / 60)} min</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground mb-6">
          <p className="mb-2">Instruções:</p>
          <ul className="list-disc pl-5 space-y-1 text-left">
            <li>Você terá 30 minutos para completar cada teste</li>
            <li>Responda com honestidade</li>
            <li>Não há respostas certas ou erradas</li>
            <li>Classifique cada afirmação de 1 a 5</li>
          </ul>
        </div>
        
        <Button 
          onClick={startTest}
          className="w-full"
        >
          <Play size={16} className="mr-2" />
          Começar testes
        </Button>
      </motion.div>
    );
  }

  // Interface para responder às perguntas
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-muted-foreground">Teste {currentTestIdx + 1} de {testes.length}</div>
            <div className="text-lg font-semibold">{currentTest.teste_nome}</div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs badge">
            Pergunta {currentQuestionIdx + 1} de {perguntas.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-vibrant-blue h-2 rounded-full" 
              style={{ width: `${((currentQuestionIdx + 1) / perguntas.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-xl border p-4">
            <div className="font-medium text-lg mb-4">{currentQuestion?.texto}</div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => setValue(currentQuestion?.id, v)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    answers[currentTest.teste_id]?.[currentQuestion?.id] === v 
                      ? "border-vibrant-blue bg-vibrant-blue/10" 
                      : "border-border hover:border-vibrant-blue/50"
                  }`}
                  disabled={isSalvando}
                >
                  <div className="font-semibold text-lg">{v}</div>
                  <div className="text-xs mt-1">
                    {v === 1 && "Discordo totalmente"}
                    {v === 2 && "Discordo"}
                    {v === 3 && "Neutro"}
                    {v === 4 && "Concordo"}
                    {v === 5 && "Concordo totalmente"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={nextQuestion} 
              disabled={isSalvando || !answers[currentTest.teste_id]?.[currentQuestion?.id]}
              className="w-full"
            >
              {isSalvando ? "Salvando..." : 
               currentQuestionIdx + 1 < perguntas.length ? "Próxima pergunta" : "Concluir teste"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}