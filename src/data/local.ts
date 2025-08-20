import { useDB } from "@/stores/db";

export const api = {
  createEvaluation(name: string, testIds: string[], collaboratorIds: string[]) {
    const id = useDB.getState().createEvaluation(name, testIds, collaboratorIds);
    return id;
  }
};
