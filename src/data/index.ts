// Camada de dados: seleciona a origem via env (default: local/Zustand).
// Futuro: trocar para Supabase sem mexer nas páginas — só implementar supabase.ts.

const source = import.meta.env.VITE_DATA_SOURCE ?? "local";

export async function getSource() {
  if (source === "supabase") {
    // Supabase foi removido, usar dataService diretamente
    throw new Error("Supabase source not available");
  }
  const m = await import("./local");
  return m.api;
}
