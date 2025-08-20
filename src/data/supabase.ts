// Stubs para futura integração com Supabase.
// Implementar aqui selects/inserts, RLS, RPCs e troca de getSource() para 'supabase'.

export const api = {
  async createEvaluation(name: string, testIds: string[], collaboratorIds: string[]) {
    // TODO: Inserir avaliação e gerar links via Edge Function
    console.warn("[supabase] createEvaluation não implementado.");
    return "not-implemented";
  }
};
