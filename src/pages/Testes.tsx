import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";

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

export default function Testes() {
  const queryClient = useQueryClient();
  
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

  // Buscar testes do Supabase
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['testes'],
    queryFn: () => dataService.testes.getAll()
  });

  // Mutation para criar teste
  const createTestMutation = useMutation({
    mutationFn: (data: Omit<FormData, 'id' | 'created_at' | 'updated_at' | 'versao' | 'ativo' | 'tipo' | 'criado_por' | 'codigo'>) => {
      // Converter dados para o formato esperado pelo Supabase
      const testData = {
        codigo: `TESTE${Date.now()}`, // Código temporário
        nome: data.name,
        descricao: data.description || null,
        categoria: "Customizado",
        perguntas: data.questions.map((q, index) => ({
          id: index + 1,
          texto: q.texto,
          ordem: index + 1
        })),
        faixas_interpretacao: data.bands.map(band => ({
          min: band.min,
          max: band.max,
          label: band.label,
          cor: band.label === "Baixo" ? "#ef4444" : band.label === "Médio" ? "#f59e0b" : "#10b981"
        })),
        tipo: "customizado" as const,
        criado_por: null, // Será preenchido com o ID do usuário logado
        versao: 1,
        ativo: true
      };
      
      return dataService.testes.create(testData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] });
      form.reset();
    }
  });

  function onSubmit(values: FormData) {
    createTestMutation.mutate(values);
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
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Testes</h2>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <THead>
                  <TR>
                    <TH>Nome</TH>
                    <TH>Categoria</TH>
                    <TH>Perguntas</TH>
                  </TR>
                </THead>
                <TBody>
                  {tests.map(t => (
                    <TR key={t.id}>
                      <TD>{t.nome}</TD>
                      <TD>{t.categoria || "Customizado"}</TD>
                      <TD>{t.perguntas?.length || 0}</TD>
                    </TR>
                  ))}
                  {tests.length === 0 && <TR><TD colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum teste ainda.</TD></TR>}
                </TBody>
              </Table>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Criar novo teste</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
              <div className="grid gap-1">
                <Label>Nome</Label>
                <Input {...form.register("name")} placeholder="DISC, Big Five..." className="text-black" />
                {form.formState.errors.name && <span className="text-red-600 text-xs">{form.formState.errors.name.message as string}</span>}
              </div>
              <div className="grid gap-1">
                <Label>Descrição</Label>
                <Input {...form.register("description")} placeholder="Breve descrição" className="text-black" />
              </div>

              <div className="grid gap-2">
                <Label>Perguntas</Label>
                {qFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input 
                      {...form.register(`questions.${idx}.texto` as const)} 
                      placeholder={`Pergunta ${idx + 1}`} 
                      className="text-black" 
                    />
                    <Button type="button" variant="outline" onClick={() => qRemove(idx)}>Remover</Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => qAppend({ id: qFields.length + 1, texto: "", ordem: qFields.length + 1 })}
                >
                  Adicionar pergunta
                </Button>
              </div>

              <div className="grid gap-2">
                <Label>Faixas (interpretação)</Label>
                {bFields.map((field, idx) => (
                  <div key={field.id} className="grid grid-cols-7 gap-2 items-center">
                    <div className="col-span-3">
                      <Input 
                        {...form.register(`bands.${idx}.label` as const)} 
                        placeholder="Rótulo" 
                        className="text-black" 
                      />
                    </div>
                    <div>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...form.register(`bands.${idx}.min` as const)} 
                        placeholder="Min" 
                        className="text-black" 
                      />
                    </div>
                    <div>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...form.register(`bands.${idx}.max` as const)} 
                        placeholder="Max" 
                        className="text-black" 
                      />
                    </div>
                    <div className="col-span-2">
                      <Button type="button" variant="outline" onClick={() => bRemove(idx)}>Remover</Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => bAppend({ label: "", min: 1, max: 5 })}
                >
                  Adicionar faixa
                </Button>
              </div>

              <Button 
                type="submit" 
                className="mt-2"
                disabled={createTestMutation.isPending}
              >
                {createTestMutation.isPending ? 'Salvando...' : 'Salvar teste'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
