import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { TestForm } from "@/components/TestForm";
import { Plus, Edit } from "lucide-react";
import { Teste } from "@/lib/supabaseClient";
import { convertTestToFormData, convertFormDataToTest, TestFormData } from "@/features/tests/testUtils";

export default function Testes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Teste | null>(null);
  const queryClient = useQueryClient();
  
  // Buscar testes do Supabase
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['testes'],
    queryFn: async () => {
      console.log('Testes: Buscando testes...');
      try {
        const result = await dataService.testes.getAll();
        console.log('Testes: Testes encontrados:', result);
        return result;
      } catch (error) {
        console.error('Testes: Erro ao buscar testes:', error);
        throw error;
      }
    }
  });

  // Mutation para criar teste
  const createTestMutation = useMutation({
    mutationFn: async (data: TestFormData) => {
      console.log('Testes: Criando novo teste...', data);
      
      // Converter dados para o formato esperado pelo Supabase
      const testData = convertFormDataToTest(data);
      
      try {
        const result = await dataService.testes.create(testData);
        console.log('Testes: Teste criado com sucesso:', result);
        return result;
      } catch (error) {
        console.error('Testes: Erro ao criar teste:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Testes: Teste criado com sucesso, atualizando cache...');
      queryClient.invalidateQueries({ queryKey: ['testes'] });
      setIsModalOpen(false);
      setEditingTest(null);
    },
    onError: (error) => {
      console.error('Testes: Erro na mutation de criação de teste:', error);
    }
  });

  // Mutation para atualizar teste
  const updateTestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestFormData }) => {
      console.log('Testes: Atualizando teste...', id, data);
      
      // Converter dados para o formato esperado pelo Supabase
      const testData = convertFormDataToTest(data, editingTest?.codigo);
      
      try {
        const result = await dataService.testes.update(id, testData);
        console.log('Testes: Teste atualizado com sucesso:', result);
        return result;
      } catch (error) {
        console.error('Testes: Erro ao atualizar teste:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Testes: Teste atualizado com sucesso, atualizando cache...');
      queryClient.invalidateQueries({ queryKey: ['testes'] });
      setIsModalOpen(false);
      setEditingTest(null);
    },
    onError: (error) => {
      console.error('Testes: Erro na mutation de atualização de teste:', error);
    }
  });

  function handleCreateTest(values: TestFormData) {
    console.log('Testes: onSubmit()', values);
    createTestMutation.mutate(values);
  }

  function handleUpdateTest(values: TestFormData) {
    if (!editingTest) return;
    console.log('Testes: onUpdate()', editingTest.id, values);
    updateTestMutation.mutate({ id: editingTest.id, data: values });
  }

  function handleEditTest(test: Teste) {
    setEditingTest(test);
    setIsModalOpen(true);
  }

  function handleOpenCreateModal() {
    setEditingTest(null);
    setIsModalOpen(true);
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando testes...
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Testes</h2>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Teste
          </Button>
        </div>
        
        <div className="overflow-auto rounded-xl border">
          <Table>
            <THead>
              <TR>
                <TH>Nome</TH>
                <TH>Categoria</TH>
                <TH>Perguntas</TH>
                <TH className="text-right">Ações</TH>
              </TR>
            </THead>
            <TBody>
              {tests.map(t => (
                <TR key={t.id}>
                  <TD>{t.nome}</TD>
                  <TD>{t.categoria || "Customizado"}</TD>
                  <TD>{t.perguntas?.length || 0}</TD>
                  <TD className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditTest(t)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TD>
                </TR>
              ))}
              {tests.length === 0 && (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum teste cadastrado ainda.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTest(null);
        }} 
        title={editingTest ? "Editar Teste" : "Criar Novo Teste"}
        size="lg"
      >
        <TestForm 
          onSubmit={editingTest ? handleUpdateTest : handleCreateTest} 
          isSubmitting={createTestMutation.isPending || updateTestMutation.isPending}
          initialData={editingTest ? convertTestToFormData(editingTest) : undefined}
        />
      </Modal>
    </motion.div>
  );
}
