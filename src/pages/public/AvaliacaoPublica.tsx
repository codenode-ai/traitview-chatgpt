import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAvaliacaoPublica } from "@/features/responses/useAvaliacaoPublica";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AvaliacaoPublica() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> value

  // Usar o hook personalizado para gerenciar a avaliação
  const { 
    respostaData, 
    isLoading, 
    error, 
    salvarRespostas, 
    isSalvando 
  } = useAvaliacaoPublica(token);

  if (isLoading) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  if (error) {
    return <div className="p-10 text-center"><h1 className="text-2xl font-bold mb-2">Erro</h1><p>{error}</p></div>;
  }

  if (!respostaData) {
    return <div className="p-10 text-center"><h1 className="text-2xl font-bold mb-2">Link inválido</h1><p>Esta avaliação não foi encontrada.</p></div>;
  }

  const teste = respostaData;
  const perguntas = teste?.teste_perguntas || [];
  const current = perguntas[currentIdx];

  function setValue(qid: number, val: number) {
    setAnswers(a => ({ ...a, [qid]: val }));
  }

  async function submitTest() {
    if (!teste || !token) return;

    try {
      // Se houver mais perguntas, avançar para a próxima
      if (currentIdx + 1 < perguntas.length) {
        setCurrentIdx(idx => idx + 1);
        setAnswers({});
      } else {
        // Preparar as respostas no formato esperado
        const respostasFormatadas = perguntas.map((q: any) => ({
          pergunta_id: q.id,
          resposta: answers[q.id] ?? 3, // Valor padrão 3 (neutro)
          pergunta_texto: q.texto
        }));

        // Salvar respostas validando o token
        salvarRespostas(respostasFormatadas);
        
        // Avaliação concluída
        alert("Obrigado! Respostas registradas.");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Erro ao salvar respostas:", err);
      alert("Erro ao salvar respostas. Verifique o console para mais detalhes.");
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4">
          <div className="text-xs text-muted-foreground">Avaliação para:</div>
          <div className="text-lg font-semibold">{respostaData.colaborador_nome || "Colaborador"}</div>
          <div className="text-xs badge mt-1">Progresso: {currentIdx + 1}/{perguntas.length}</div>
        </div>

        {teste && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">{teste.teste_nome}</h2>
            <p className="text-sm text-muted-foreground">{teste.teste_descricao}</p>

            <div className="grid gap-3">
              {perguntas.map((q: any, i: number) => (
                <div key={q.id} className="rounded-xl border p-3 hover-card">
                  <div className="font-medium mb-2">{i + 1}. {q.texto}</div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <label key={v} className={"flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer " + (answers[q.id] === v ? "bg-primary" : "bg-white")}>
                        <input 
                          type="radio" 
                          name={`question-${q.id}`} 
                          checked={answers[q.id] === v} 
                          onChange={() => setValue(q.id, v)} 
                          className="hidden"
                          disabled={isSalvando}
                        />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">1 = Discordo totalmente • 5 = Concordo totalmente</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button 
                onClick={submitTest} 
                disabled={isSalvando}
              >
                {isSalvando ? "Salvando..." : currentIdx + 1 < perguntas.length ? "Salvar e continuar" : "Concluir avaliação"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}