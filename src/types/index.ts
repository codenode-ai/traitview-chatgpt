export type Role = "admin" | "editor" | "viewer";

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Question {
  id: string;
  text: string;
}

export interface Band {
  label: string;
  min: number; // inclusive
  max: number; // inclusive
}

export interface Test {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  bands: Band[];
  version: number;
}

export interface EvaluationLink {
  collaboratorId: string;
  token: string;
  status: "pendente" | "em_andamento" | "concluida";
  startedAt?: string;
  completedAt?: string;
}

export interface Evaluation {
  id: string;
  name: string;
  testIds: string[];
  collaboratorIds: string[];
  links: EvaluationLink[];
  createdAt: string;
}

export interface AnswerItem {
  questionId: string;
  value: number; // 1-5 Likert
}

export interface Answer {
  evaluationId: string;
  collaboratorId: string;
  testId: string;
  answers: AnswerItem[];
}
