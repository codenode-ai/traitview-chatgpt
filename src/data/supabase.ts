import { dataService } from "@/lib/dataService";
import { uid } from "@/lib/utils";
import type { Organization, Test, Question, Evaluation, Answer } from "@/lib/supabaseClient";
import type { Collaborator, Test as AppTest, Question as AppQuestion, Band, Evaluation as AppEvaluation, EvaluationLink, Answer as AppAnswer } from "@/types";

// Funções auxiliares para mapeamento entre os tipos do Supabase e os tipos da aplicação
const mapOrganizationToCollaborator = (organization: Organization): Collaborator => ({
  id: organization.id,
  name: organization.name,
  email: `${organization.name.replace(/\s+/g, '').toLowerCase()}@traitview.com`, // Email fictício baseado no nome
  role: "admin"
});

const mapTestToAppTest = async (test: Test): Promise<AppTest> => {
  // Carregar perguntas do teste
  const testData = await dataService.loadAssessmentData(test.id);
  
  return {
    id: test.id,
    name: test.name,
    description: test.description || "",
    version: 1, // TODO: Implementar versionamento
    questions: testData.questions.map(q => ({
      id: q.id,
      text: q.text
    })),
    bands: [
      { label: "Baixo", min: 1, max: 2.5 },
      { label: "Médio", min: 2.5, max: 3.7 },
      { label: "Alto", min: 3.7, max: 5 }
    ]
  };
};

const mapEvaluationToAppEvaluation = (evaluation: Evaluation, collaborators: Collaborator[]): AppEvaluation => {
  // Gerar links para cada colaborador
  const links: EvaluationLink[] = collaborators.map(collaborator => ({
    collaboratorId: collaborator.id,
    token: uid("tok_"),
    status: evaluation.status === "completed" ? "concluida" : "pendente"
  }));

  return {
    id: evaluation.id,
    name: evaluation.candidate_name,
    testIds: [evaluation.test_id], // Na nova estrutura, cada avaliação é um teste
    collaboratorIds: collaborators.map(c => c.id),
    links,
    createdAt: evaluation.created_at
  };
};

export const api = {
  // Criar uma nova avaliação (equivalente a createEvaluation)
  async createEvaluation(name: string, testIds: string[], collaboratorIds: string[]) {
    try {
      // Como estamos usando Supabase, vamos criar uma nova avaliação
      // testIds neste contexto seria o ID do teste
      const testId = testIds[0]; // Assumindo que o primeiro ID é o do teste
      
      // Criar a avaliação no Supabase
      // TODO: Obter o ID da organização de alguma forma
      const orgId = "11111111-1111-1111-1111-111111111111"; // ID da organização demo
      
      const evaluation = await dataService.responses.create({
        org_id: orgId,
        test_id: testId,
        candidate_name: name,
        candidate_email: null
      });
      
      console.log("[supabase] Avaliação criada:", evaluation);
      return evaluation.id;
    } catch (error) {
      console.error("[supabase] Erro ao criar avaliação:", error);
      throw error;
    }
  },

  // Obter todas as organizações (como colaboradores)
  async getCollaborators(): Promise<Collaborator[]> {
    try {
      const organizations = await dataService.companies.getAll();
      return organizations.map(mapOrganizationToCollaborator);
    } catch (error) {
      console.error("[supabase] Erro ao buscar colaboradores:", error);
      throw error;
    }
  },

  // Obter todos os testes de uma organização
  async getTests(orgId: string): Promise<AppTest[]> {
    try {
      // TODO: Implementar paginação ou filtro
      const tests = await dataService.assessments.getByCompany(orgId);
      const appTests = await Promise.all(
        tests.map(test => mapTestToAppTest(test))
      );
      return appTests;
    } catch (error) {
      console.error("[supabase] Erro ao buscar testes:", error);
      throw error;
    }
  },

  // Obter um teste específico
  async getTestById(id: string): Promise<AppTest | null> {
    try {
      const test = await dataService.assessments.getById(id);
      if (!test) return null;
      return await mapTestToAppTest(test);
    } catch (error) {
      console.error("[supabase] Erro ao buscar teste:", error);
      throw error;
    }
  },

  // Obter avaliações de uma organização
  async getEvaluations(orgId: string): Promise<AppEvaluation[]> {
    try {
      // TODO: Implementar paginação ou filtro
      // Por enquanto, vamos buscar todas as avaliações da organização
      const { data: evaluations, error } = await dataService.responses.getById(orgId) as any; // Ajustar isso
      
      if (error) {
        throw error;
      }
      
      const collaborators = await this.getCollaborators();
      
      // TODO: Ajustar o mapeamento das avaliações
      return evaluations.map((evaluation: any) => 
        mapEvaluationToAppEvaluation(evaluation, collaborators)
      );
    } catch (error) {
      console.error("[supabase] Erro ao buscar avaliações:", error);
      throw error;
    }
  },

  // Obter uma avaliação específica
  async getEvaluationById(id: string): Promise<AppEvaluation | null> {
    try {
      const evaluation = await dataService.responses.getById(id);
      if (!evaluation) return null;
      
      const collaborators = await this.getCollaborators();
      return mapEvaluationToAppEvaluation(evaluation, collaborators);
    } catch (error) {
      console.error("[supabase] Erro ao buscar avaliação:", error);
      throw error;
    }
  },

  // Salvar respostas
  async saveAnswers(answers: AppAnswer): Promise<void> {
    try {
      // TODO: Obter o ID da organização de alguma forma
      const orgId = "11111111-1111-1111-1111-111111111111"; // ID da organização demo
      
      // Converter as respostas do formato da aplicação para o formato do Supabase
      const responseAnswers = answers.answers.map(answer => ({
        questionId: answer.questionId,
        value: answer.value
      }));

      // Salvar as respostas usando o dataService
      await dataService.saveAssessmentResponse(
        orgId,
        answers.testId,
        null, // Nome do candidato (opcional)
        null, // Email do candidato (opcional)
        responseAnswers
      );
    } catch (error) {
      console.error("[supabase] Erro ao salvar respostas:", error);
      throw error;
    }
  },

  // Marcar link como concluído
  async completeLink(evaluationId: string, collaboratorId: string): Promise<void> {
    try {
      // Marcar a avaliação como concluída no Supabase
      await dataService.responses.completeEvaluation(evaluationId);
    } catch (error) {
      console.error("[supabase] Erro ao marcar link como concluído:", error);
      throw error;
    }
  },

  // Encontrar avaliação por token
  async findEvaluationByToken(token: string): Promise<AppEvaluation | null> {
    try {
      // TODO: Implementar busca de avaliação por token no Supabase
      // Esta implementação requer uma tabela de links de avaliação no Supabase
      // Por enquanto, vamos manter o comportamento mockado
      console.warn("[supabase] findEvaluationByToken não implementado.");
      console.log("Buscar por token:", token);
      return null;
    } catch (error) {
      console.error("[supabase] Erro ao buscar avaliação por token:", error);
      throw error;
    }
  }
};
