import { useParams, useNavigate } from "react-router-dom";
import { useDB } from "@/stores/db";
import { useMemo, useState, useEffect } from "react";
import type { Answer } from "@/types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getSource } from "@/data";

export default function AvaliacaoPublica() {
  const { token } = useParams();
  const navigate = useNavigate();
  const db = useDB();

  const evaluation = useMemo(() => db.findEvaluationByToken(token || ""), [db, token]);
  const linkInfo = useMemo(() => evaluation?.links.find(l => l.token === token), [evaluation, token]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const tests = useMemo(() => evaluation ? evaluation.testIds.map(tid => db.tests.find(t => t.id === tid)).filter(Boolean) : [], [evaluation, db.tests]);
  const current = tests[currentIdx];

  const [answers, setAnswers] = useState<Record<string, number>>({}); // questionId -> value

  if (!evaluation || !linkInfo) {
    return <div className="p-10 text-center"><h1 className="text-2xl font-bold mb-2">Link inválido</h1><p>Esta avaliação não foi encontrada.</p></div>;
  }

  function setValue(qid: string, val: number) {
    setAnswers(a => ({ ...a, [qid]: val }));
  }

  async function submitTest() {
    if (!current) return;
    const payload: Answer = {
      evaluationId: evaluation.id,
      collaboratorId: linkInfo.collaboratorId,
      testId: current.id!,
      answers: current.questions.map(q => ({ questionId: q.id, value: answers[q.id] ?? 3 }))
    };

    // Se estiver usando Supabase, chamar a função saveAnswers do Supabase
    if (import.meta.env.VITE_DATA_SOURCE === "supabase") {
      try {
        const source = await getSource();
        await source.saveAnswers(payload);
      } catch (error) {
        console.error("Erro ao salvar respostas:", error);
        alert("Erro ao salvar respostas. Verifique o console para mais detalhes.");
        return;
      }
    } else {
      // Comportamento original para fonte local
      db.upsertAnswer(payload);
    }

    if (currentIdx + 1 < tests.length) {
      setCurrentIdx(idx => idx + 1);
      setAnswers({});
    } else {
      // Se estiver usando Supabase, chamar a função completeLink do Supabase
      if (import.meta.env.VITE_DATA_SOURCE === "supabase") {
        try {
          const source = await getSource();
          await source.completeLink(evaluation.id, linkInfo.collaboratorId);
        } catch (error) {
          console.error("Erro ao marcar link como concluído:", error);
          alert("Erro ao marcar link como concluído. Verifique o console para mais detalhes.");
        }
      } else {
        // Comportamento original para fonte local
        db.completeLink(evaluation.id, linkInfo.collaboratorId);
      }
      
      alert("Obrigado! Respostas registradas.");
      navigate("/");
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4">
          <div className="text-xs text-muted-foreground">Avaliação:</div>
          <div className="text-lg font-semibold">{evaluation.name}</div>
          <div className="text-xs badge mt-1">Progresso: {currentIdx+1}/{tests.length}</div>
        </div>

        {current && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">{current.name}</h2>
            <p className="text-sm text-muted-foreground">{current.description}</p>

            <div className="grid gap-3">
              {current.questions.map((q, i) => (
                <div key={q.id} className="rounded-xl border p-3 hover-card">
                  <div className="font-medium mb-2">{i+1}. {q.text}</div>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(v => (
                      <label key={v} className={"flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer " + (answers[q.id] === v ? "bg-primary" : "bg-white")}>
                        <input type="radio" name={q.id} checked={answers[q.id] === v} onChange={()=>setValue(q.id, v)} className="hidden"/>
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">1 = Discordo totalmente • 5 = Concordo totalmente</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button onClick={submitTest}>Salvar e continuar</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
