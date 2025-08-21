import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDB } from "@/stores/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.string().email("E-mail inválido")
});
type FormData = z.infer<typeof schema>;

export default function Colaboradores() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const collaborators = useDB(s => s.collaborators);
  const addCollaborator = useDB(s => s.addCollaborator);
  const removeCollaborator = useDB(s => s.removeCollaborator);

  function onSubmit(data: FormData) {
    addCollaborator(data);
    reset();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Colaboradores</h2>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <THead>
                  <TR>
                    <TH>Nome</TH>
                    <TH>E-mail</TH>
                    <TH className="w-24">Ações</TH>
                  </TR>
                </THead>
                <TBody>
                  {collaborators.map(c => (
                    <TR key={c.id}>
                      <TD>{c.name}</TD>
                      <TD>{c.email}</TD>
                      <TD>
                        <Button variant="outline" onClick={() => removeCollaborator(c.id)}>Remover</Button>
                      </TD>
                    </TR>
                  ))}
                  {collaborators.length === 0 && (
                    <TR><TD colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum colaborador ainda.</TD></TR>
                  )}
                </TBody>
              </Table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Adicionar colaborador</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
              <div className="grid gap-1">
                <Label>Nome</Label>
                <Input placeholder="Ex.: Ana Lima" {...register("name")} className="text-black" />
                {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
              </div>
              <div className="grid gap-1">
                <Label>E-mail</Label>
                <Input placeholder="ana@empresa.com" {...register("email")} className="text-black" />
                {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
              </div>
              <Button type="submit" className="mt-2">Adicionar</Button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
