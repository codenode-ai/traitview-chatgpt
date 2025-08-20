import { useDB } from "@/stores/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const collaborators = useDB(s => s.collaborators);
  const tests = useDB(s => s.tests);
  const evaluations = useDB(s => s.evaluations);

  const chart1 = [
    { name: "Colabs", value: collaborators.length },
    { name: "Testes", value: tests.length },
    { name: "Avaliações", value: evaluations.length }
  ];

  const radarData = [
    { k: "Confiabilidade", v: 4.1 },
    { k: "Agilidade", v: 3.6 },
    { k: "Colaboração", v: 3.9 },
    { k: "Documentação", v: 3.2 },
    { k: "Autonomia", v: 4.3 }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Status do Sistema</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart1}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Exemplo de Radar</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="k" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar dataKey="v" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
