import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { TestFormData } from "@/features/tests/testUtils";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bandSchema = z.object({
  label: z.string().min(1),
  min: z.coerce.number().min(1).max(5),
  max: z.coerce.number().min(1).max(5)
});

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  questions: z.array(z.object({ 
    id: z.number(), 
    texto: z.string().min(2),
    ordem: z.number()
  })),
  bands: z.array(bandSchema).min(1)
});

type FormData = z.infer<typeof schema>;

export default function EditarTeste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  
  // Buscar teste existente se estiver editando
  const { data: existingTest, isLoading: loadingTest } = useQuery({
    queryKey: ['teste', id],
    queryFn: async () => {
      if (!id) return null;
      return await dataService.testes.getById(id);
    },
    enabled: isEditing
  });
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      questions: [{ id: 1, texto: "", ordem: 1 }],
      bands: [
        { label: "Baixo", min: 1, max: 2.5 },
        { label: "Médio", min: 2.5, max: 3.7 },
        { label: "Alto", min: 3.7, max: 5 }
      ]
    }
  });
  
  const { fields: qFields, append: qAppend, remove: qRemove } = useFieldArray({ 
    control: form.control, 
    name: "questions" 
  });
  
  const { fields: bFields, append: bAppend, remove: bRemove } = useFieldArray({ 
    control: form.control, 
    name: "bands" 
  });
  
  // Preencher o formulário com dados existentes quando carregar
  useEffect(() => {
    if (existingTest && isEditing) {
      form.reset({
        name: existingTest.nome,
        description: existingTest.descricao || "",
        questions: existingTest.perguntas || [{ id: 1, texto: "", ordem: 1 }],
        bands: existingTest.faixas_interpretacao || [
          { label: "Baixo", min: 1, max: 2.5 },
          { label: "Médio", min: 2.5, max: 3.7 },
          { label: "Alto", min: 3.7, max: 5 }
        ]
      });
    }
  }, [existingTest, isEditing, form]);
  
  // Mutation para criar ou atualizar teste
  const createTestMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const testData = {
        codigo: `CUSTOM${Date.now()}`,
        nome: data.name,
        descricao: data.description,
        categoria: "Customizado",
        perguntas: data.questions,
        faixas_interpretacao: data.bands,
        tipo: "customizado",
        versao: 1,
        ativo: true
      };
      
      if (isEditing && id) {
        return await dataService.testes.update(id, testData);
      } else {
        return await dataService.testes.create(testData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] });
      navigate('/testes');
    }
  });
  
  function onSubmit(data: FormData) {
    createTestMutation.mutate(data);
  }
  
  if (loadingTest && isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando teste...
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.25 }}
      className="container-page"
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/testes')}
          className="mb-4"
        >
          ← Voltar para testes
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Teste" : "Criar Novo Teste"}
        </h1>
      </div>
      
      <div className="bg-card border border-border rounded-2xl p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input 
                {...form.register("name")} 
                placeholder="Nome do teste" 
                className="text-black" 
              />
              {form.formState.errors.name && (
                <span className="text-red-600 text-xs">
                  {form.formState.errors.name.message as string}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input 
                {...form.register("description")} 
                placeholder="Descrição do teste" 
                className="text-black" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Perguntas</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => qAppend({ 
                    id: qFields.length + 1, 
                    texto: "", 
                    ordem: qFields.length + 1 
                  })}
                >
                  Adicionar pergunta
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto p-3 border border-border rounded-lg bg-muted">
                {qFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center p-2 bg-background rounded">
                    <div className="w-8 text-center text-muted-foreground text-sm">
                      {idx + 1}.
                    </div>
                    <Input 
                      {...form.register(`questions.${idx}.texto` as const)} 
                      placeholder={`Pergunta ${idx + 1}`} 
                      className="text-black flex-1" 
                    />
                    {qFields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => qRemove(idx)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Faixas (interpretação)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => bAppend({ label: "", min: 1, max: 5 })}
                >
                  Adicionar faixa
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto p-3 border border-border rounded-lg bg-muted">
                {bFields.map((field, idx) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-background rounded">
                    <div className="col-span-5">
                      <Input 
                        {...form.register(`bands.${idx}.label` as const)} 
                        placeholder="Rótulo" 
                        className="text-black" 
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...form.register(`bands.${idx}.min` as const)} 
                        placeholder="Min" 
                        className="text-black" 
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...form.register(`bands.${idx}.max` as const)} 
                        placeholder="Max" 
                        className="text-black" 
                      />
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => bRemove(idx)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/testes')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createTestMutation.isPending}
            >
              {createTestMutation.isPending ? 'Salvando...' : 'Salvar teste'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}