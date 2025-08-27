import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Relatorios() {
  const ref = useRef<HTMLDivElement>(null);
  const [filtroTeste, setFiltroTeste] = useState<string>("todos");
  const [filtroEmail, setFiltroEmail] = useState<string>("");
  const [filtroFaixa, setFiltroFaixa] = useState<string>("todas");

  // Buscar dados do Supabase
  const { data: respostas = [], isLoading: loadingRespostas } = useQuery({
    queryKey: ['respostas'],
    queryFn: () => dataService.respostas.getAll()
  });

  const { data: testes = [], isLoading: loadingTestes } = useQuery({
    queryKey: ['testes'],
    queryFn: () => dataService.testes.getAll()
  });

  // Mostrar loading enquanto carrega os dados
  if (loadingRespostas || loadingTestes) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando relatórios...
      </motion.div>
    );
  }

  // Verificar erros
  if (!respostas || !testes) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
        <p className="text-muted-foreground">
          Não foi possível carregar os relatórios. Por favor, tente novamente.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Recarregar página
        </Button>
      </motion.div>
    );
  }

  // Processar os dados para exibição
  const rows = respostas
    .filter(resposta => resposta.status === 'concluida') // Apenas respostas concluídas
    .map(resposta => {
      const teste = testes.find(t => t.id === resposta.teste_id);
      
      // Obter score e faixa do resultado calculado
      let score = 0;
      let faixa = "Não definida";
      
      if (resposta.resultado) {
        score = resposta.resultado.score;
        faixa = resposta.resultado.faixa || "Não definida";
      } else if (resposta.respostas && Array.isArray(resposta.respostas) && resposta.respostas.length > 0) {
        // Calcular score se não estiver calculado ainda
        const total = resposta.respostas.reduce((sum, resp) => sum + resp.resposta, 0);
        score = resposta.respostas.length > 0 ? total / resposta.respostas.length : 0;
        
        // Determinar faixa com base no score
        if (score >= 3.7) faixa = "Alto";
        else if (score >= 2.5) faixa = "Médio";
        else faixa = "Baixo";
      }
      
      return {
        id: resposta.id,
        testeNome: teste?.nome || "—",
        testeId: teste?.id || "",
        email: resposta.colaborador_id || "destinatario@exemplo.com", // Usar o ID do colaborador ou e-mail padrão
        score: score.toFixed(2),
        faixa: faixa,
        data: new Date(resposta.concluido_em || resposta.created_at).toLocaleDateString()
      };
    })
    .filter(row => {
      // Aplicar filtros
      if (filtroTeste !== "todos" && row.testeId !== filtroTeste) return false;
      if (filtroEmail && !row.email.toLowerCase().includes(filtroEmail.toLowerCase())) return false;
      if (filtroFaixa !== "todas" && row.faixa !== filtroFaixa) return false;
      return true;
    })
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score)); // Ordenar por score descendente

  // Obter lista única de testes para o filtro
  const testesUnicos = respostas
    .filter(r => r.status === 'concluida')
    .map(r => {
      const teste = testes.find(t => t.id === r.teste_id);
      return teste ? { id: teste.id, nome: teste.nome } : null;
    })
    .filter(Boolean)
    .filter((teste, index, self) => 
      index === self.findIndex(t => t?.id === teste?.id)
    ) as { id: string; nome: string }[];

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

  // Calcular estatísticas gerais
  const totalRespostas = rows.length;
  const mediaGeral = totalRespostas > 0 
    ? (rows.reduce((sum, row) => sum + parseFloat(row.score), 0) / totalRespostas).toFixed(2)
    : "0.00";

  const distribuicaoFaixas = {
    Alto: rows.filter(r => r.faixa === "Alto").length,
    Médio: rows.filter(r => r.faixa === "Médio").length,
    Baixo: rows.filter(r => r.faixa === "Baixo").length,
    "Não definida": rows.filter(r => r.faixa === "Não definida").length
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <p className="text-muted-foreground">
              {totalRespostas} resposta(s) concluída(s)
            </p>
          </div>
          <Button 
            onClick={exportPDF} 
            disabled={rows.length === 0}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Exportar PDF
          </Button>
        </div>

        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground">Média Geral</div>
            <div className="text-2xl font-bold">{mediaGeral}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground">Faixa Alta</div>
            <div className="text-2xl font-bold text-green-500">{distribuicaoFaixas.Alto}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground">Faixa Média</div>
            <div className="text-2xl font-bold text-yellow-500">{distribuicaoFaixas.Médio}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground">Faixa Baixa</div>
            <div className="text-2xl font-bold text-red-500">{distribuicaoFaixas.Baixo}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Filtrar por teste</label>
              <Select value={filtroTeste} onValueChange={setFiltroTeste}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um teste" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="todos">Todos os testes</SelectItem>
                  {testesUnicos.map(teste => (
                    <SelectItem key={teste.id} value={teste.id}>
                      {teste.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Filtrar por e-mail</label>
              <Input 
                placeholder="Digite o e-mail..." 
                value={filtroEmail}
                onChange={(e) => setFiltroEmail(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Filtrar por faixa</label>
              <Select value={filtroFaixa} onValueChange={setFiltroFaixa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma faixa" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="todas">Todas as faixas</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela de resultados */}
        <div ref={ref} className="overflow-auto rounded-xl border bg-white p-2 text-black">
          <Table>
            <THead>
              <TR>
                <TH>Teste</TH>
                <TH>E-mail</TH>
                <TH>Score médio (1–5)</TH>
                <TH>Faixa</TH>
                <TH>Data</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => (
                <TR key={r.id}>
                  <TD>{r.testeNome}</TD>
                  <TD>{r.email}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <span>{r.score}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-vibrant-blue h-2 rounded-full" 
                          style={{ width: `${(parseFloat(r.score) / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <span className={`badge ${
                      r.faixa === "Baixo" ? "bg-red-500" : 
                      r.faixa === "Médio" ? "bg-yellow-500" : 
                      r.faixa === "Alto" ? "bg-green-500" : "bg-gray-500"
                    } text-white`}>
                      {r.faixa}
                    </span>
                  </TD>
                  <TD>{r.data}</TD>
                </TR>
              ))}
              {rows.length === 0 && (
                <TR>
                  <TD colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma resposta encontrada com os filtros aplicados.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
        
        <p className="text-xs text-muted-foreground">
          * Para PDF com mais fidelidade tipográfica, mover para renderização server-side no futuro.
        </p>
      </div>
    </motion.div>
  );
}