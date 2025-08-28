import { Teste } from "@/lib/supabaseClient";

export interface TestFormData {
  name: string;
  description?: string;
  questions: Array<{ id: number; texto: string; ordem: number }>;
  bands: Array<{ label: string; min: number; max: number }>;
}

export const convertTestToFormData = (test: Teste): TestFormData => {
  return {
    name: test.nome,
    description: test.descricao || "",
    questions: test.perguntas || [],
    bands: test.faixas_interpretacao?.map(faixa => ({
      label: faixa.label,
      min: faixa.min,
      max: faixa.max
    })) || []
  };
};

export const convertFormDataToTest = (formData: TestFormData, codigo?: string): Omit<Teste, 'id' | 'created_at' | 'updated_at' | 'versao' | 'ativo'> => {
  return {
    codigo: codigo || `TESTE${Date.now()}`,
    nome: formData.name,
    descricao: formData.description || null,
    categoria: "Customizado",
    perguntas: formData.questions,
    faixas_interpretacao: formData.bands.map((band, index) => ({
      min: band.min,
      max: band.max,
      label: band.label,
      cor: band.label === "Baixo" ? "#ef4444" : band.label === "Médio" ? "#f59e0b" : "#10b981"
    })),
    tipo: "customizado",
    criado_por: null
  };
};