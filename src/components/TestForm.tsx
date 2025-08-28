import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TestFormData } from "@/features/tests/testUtils";

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

interface TestFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  initialData?: TestFormData;
}

export function TestForm({ onSubmit, isSubmitting, initialData }: TestFormProps) {
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

  // Preencher o formulário com dados iniciais se fornecidos
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input {...form.register("name")} placeholder="DISC, Big Five..." className="text-black" />
          {form.formState.errors.name && <span className="text-red-600 text-xs">{form.formState.errors.name.message as string}</span>}
        </div>
        
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Input {...form.register("description")} placeholder="Breve descrição" className="text-black" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Perguntas</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => qAppend({ id: qFields.length + 1, texto: "", ordem: qFields.length + 1 })}
            >
              Adicionar
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-border rounded-lg">
            {qFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-center">
                <div className="w-8 text-center text-muted-foreground text-sm">{idx + 1}.</div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
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
              Adicionar
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-border rounded-lg">
            {bFields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar teste' : 'Salvar teste'}
        </Button>
      </div>
    </form>
  );
}