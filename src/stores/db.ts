import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { uid } from "@/lib/utils";
import type { Collaborator, Test, Evaluation, Answer } from "@/types";

interface DBState {
  collaborators: Collaborator[];
  tests: Test[];
  evaluations: Evaluation[];
  answers: Answer[];
  seed: () => void;
  clear: () => void; // Nova função para limpar os dados

  // Funções para atualizar o estado com dados do Supabase
  setCollaborators: (collaborators: Collaborator[]) => void;
  setTests: (tests: Test[]) => void;
  setEvaluations: (evaluations: Evaluation[]) => void;

  addCollaborator: (c: Omit<Collaborator, "id">) => void;
  removeCollaborator: (id: string) => void;

  addTest: (t: Omit<Test, "id" | "version">) => void;
  updateTest: (id: string, patch: Partial<Test>) => void;

  createEvaluation: (name: string, testIds: string[], collaboratorIds: string[]) => string;
  upsertAnswer: (ans: Answer) => void;
  completeLink: (evaluationId: string, collaboratorId: string) => void;
  findEvaluationByToken: (token: string) => Evaluation | undefined;
}

const initial: Omit<DBState, "seed" | "clear" | "setCollaborators" | "setTests" | "setEvaluations" | "addCollaborator" | "removeCollaborator" | "addTest" | "updateTest" | "createEvaluation" | "upsertAnswer" | "completeLink" | "findEvaluationByToken"> = {
  collaborators: [],
  tests: [],
  evaluations: [],
  answers: []
};

export const useDB = create<DBState>()(
  persist(
    (set, get) => ({
      ...initial,
      seed: () => {
        // Não carregar dados mockados se estiver usando Supabase
        if (import.meta.env.VITE_DATA_SOURCE === "supabase") return;
        
        if (get().tests.length > 0 || get().collaborators.length > 0) return;
        const c1 = { id: uid("c_"), name: "Ana Lima", email: "ana@empresa.com" };
        const c2 = { id: uid("c_"), name: "Bruno Souza", email: "bruno@empresa.com" };
        const c3 = { id: uid("c_"), name: "Carla Reis", email: "carla@empresa.com" };

        const t1: Test = {
          id: uid("t_"),
          name: "DISC Simplificado",
          description: "Versão Likert 1–5 para traços dominantes.",
          version: 1,
          questions: [
            { id: uid("q_"), text: "Gosto de assumir o controle em situações desafiadoras." },
            { id: uid("q_"), text: "Valorizo harmonia e cooperação no time." },
            { id: uid("q_"), text: "Prefiro seguir processos claros e detalhados." },
            { id: uid("q_"), text: "Tomo decisões rapidamente com base em resultados." }
          ],
          bands: [
            { label: "Baixo", min: 1, max: 2.5 },
            { label: "Médio", min: 2.5, max: 3.7 },
            { label: "Alto", min: 3.7, max: 5 }
          ]
        };

        const t2: Test = {
          id: uid("t_"),
          name: "Estilos de Colaboração",
          description: "Preferências de trabalho em equipe.",
          version: 1,
          questions: [
            { id: uid("q_"), text: "Sinto-me confortável em dar e receber feedbacks francos." },
            { id: uid("q_"), text: "Costumo mediar conflitos de forma paciente." },
            { id: uid("q_"), text: "Organizo e documento tudo que faço." }
          ],
          bands: [
            { label: "Baixo", min: 1, max: 2.3 },
            { label: "Médio", min: 2.3, max: 3.8 },
            { label: "Alto", min: 3.8, max: 5 }
          ]
        };

        set({ collaborators: [c1, c2, c3], tests: [t1, t2] });
      },

      // Nova função para limpar os dados
      clear: () => set({ collaborators: [], tests: [], evaluations: [], answers: [] }),

      // Funções para atualizar o estado com dados do Supabase
      setCollaborators: (collaborators) => set({ collaborators }),
      setTests: (tests) => set({ tests }),
      setEvaluations: (evaluations) => set({ evaluations }),

      addCollaborator: (c) => set((s) => ({ collaborators: [...s.collaborators, { id: uid("c_"), ...c }] })),
      removeCollaborator: (id) => set((s) => ({ collaborators: s.collaborators.filter(x => x.id !== id) })),

      addTest: (t) => set((s) => ({ tests: [...s.tests, { ...t, id: uid("t_"), version: 1 }] })),
      updateTest: (id, patch) => set((s) => ({
        tests: s.tests.map(tt => tt.id === id ? { ...tt, ...patch } : tt)
      })),

      createEvaluation: (name, testIds, collaboratorIds) => {
        const id = uid("e_");
        const links = collaboratorIds.map(cid => ({
          collaboratorId: cid,
          token: uid("tok_"),
          status: "pendente" as const
        }));
        const evaluation: Evaluation = {
          id, name, testIds, collaboratorIds, links, createdAt: new Date().toISOString()
        };
        set((s) => ({ evaluations: [evaluation, ...s.evaluations] }));
        return id;
      },

      upsertAnswer: (ans: Answer) => {
        set((s) => {
          const idx = s.answers.findIndex(a => a.evaluationId === ans.evaluationId && a.collaboratorId === ans.collaboratorId && a.testId === ans.testId);
          if (idx >= 0) {
            const clone = [...s.answers];
            clone[idx] = ans;
            return { answers: clone };
          }
          return { answers: [...s.answers, ans] };
        });
      },

      completeLink: (evaluationId, collaboratorId) => {
        set((s) => ({
          evaluations: s.evaluations.map(ev => {
            if (ev.id !== evaluationId) return ev;
            return {
              ...ev,
              links: ev.links.map(l => l.collaboratorId === collaboratorId ? { ...l, status: "concluida", completedAt: new Date().toISOString() } : l)
            };
          })
        }));
      },

      findEvaluationByToken: (token) => {
        return get().evaluations.find(ev => ev.links.some(l => l.token === token));
      }
    }),
    {
      name: "traitview-db",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
