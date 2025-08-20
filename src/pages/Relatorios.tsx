import { useDB } from "@/stores/db";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a,b)=>a+b,0)/values.length;
}

export default function Relatorios() {
  const answers = useDB(s => s.answers);
  const tests = useDB(s => s.tests);
  const evaluations = useDB(s => s.evaluations);
  const ref = useRef<HTMLDivElement>(null);

  const rows = answers.map(ans => {
    const test = tests.find(t => t.id === ans.testId);
    const evalName = evaluations.find(e => e.id === ans.evaluationId)?.name ?? "—";
    const score = average(ans.answers.map(a => a.value));
    return {
      evalName,
      testName: test?.name ?? "—",
      collaboratorId: ans.collaboratorId.slice(0,8) + "…",
      score: score.toFixed(2)
    }
  });

  async function exportPDF() {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Dimensionar a imagem mantendo aspecto
    const imgWidth = pageWidth - 60;
    const imgHeight = canvas.height * (imgWidth / canvas.width);
    const y = (pageHeight - imgHeight) / 2;
    pdf.addImage(imgData, "PNG", 30, Math.max(30, y), imgWidth, imgHeight);
    pdf.save("relatorio-traitview.pdf");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Relatórios</h2>
        <Button onClick={exportPDF}>Exportar PDF</Button>
      </div>

      <div ref={ref} className="overflow-auto rounded-xl border bg-white p-2">
        <Table>
          <THead>
            <TR>
              <TH>Avaliação</TH>
              <TH>Teste</TH>
              <TH>Colaborador</TH>
              <TH>Score médio (1–5)</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r, i) => (
              <TR key={i}>
                <TD>{r.evalName}</TD>
                <TD>{r.testName}</TD>
                <TD>{r.collaboratorId}</TD>
                <TD>{r.score}</TD>
              </TR>
            ))}
            {rows.length === 0 && <TR><TD colSpan={4} className="text-center py-6 text-muted-foreground">Sem respostas ainda.</TD></TR>}
          </TBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">* Para PDF com mais fidelidade tipográfica, mover para renderização server-side no futuro.</p>
    </motion.div>
  );
}
