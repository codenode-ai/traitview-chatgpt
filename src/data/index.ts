// Camada de dados: seleciona a origem via env (default: local/Zustand).
// Futuro: trocar para Supabase sem mexer nas páginas — só implementar supabase.ts.

const source = import.meta.env.VITE_DATA_SOURCE ?? "local";

export async function getSource() {
  if (source === "supabase") {
    const m = await import("./supabase");
    return m.api;
  }
  const m = await import("./local");
  return m.api;
}
