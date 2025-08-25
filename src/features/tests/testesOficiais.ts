// Biblioteca com 10 testes profissionais pré-configurados conforme o PRD

export const TESTES_OFICIAIS = [
  {
    codigo: "LIDERANCA01",
    nome: "Liderança",
    descricao: "Avalia as competências essenciais de liderança",
    categoria: "Liderança",
    perguntas: [
      { id: 1, texto: "Incentivo à Equipe", ordem: 1 },
      { id: 2, texto: "Tomada de Decisão", ordem: 2 },
      { id: 3, texto: "Visão Estratégica", ordem: 3 },
      { id: 4, texto: "Comunicação Clara", ordem: 4 },
      { id: 5, texto: "Delegação Eficaz", ordem: 5 },
      { id: 6, texto: "Desenvolvimento de Talentos", ordem: 6 },
      { id: 7, texto: "Gestão de Conflitos", ordem: 7 },
      { id: 8, texto: "Adaptabilidade", ordem: 8 },
      { id: 9, texto: "Inteligência Emocional", ordem: 9 },
      { id: 10, texto: "Responsabilidade", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "COMUNICACAO01",
    nome: "Comunicação",
    descricao: "Avalia a eficácia nas habilidades de comunicação",
    categoria: "Comunicação",
    perguntas: [
      { id: 1, texto: "Clareza na Expressão", ordem: 1 },
      { id: 2, texto: "Escuta Ativa", ordem: 2 },
      { id: 3, texto: "Feedback Construtivo", ordem: 3 },
      { id: 4, texto: "Apresentações", ordem: 4 },
      { id: 5, texto: "Negociação", ordem: 5 },
      { id: 6, texto: "Comunicação Não Verbal", ordem: 6 },
      { id: 7, texto: "Adaptação ao Público", ordem: 7 },
      { id: 8, texto: "Redação", ordem: 8 },
      { id: 9, texto: "Mediação", ordem: 9 },
      { id: 10, texto: "Empatia", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "EQUIPE01",
    nome: "Trabalho em Equipe",
    descricao: "Avalia a capacidade de trabalhar em equipe",
    categoria: "Trabalho em Equipe",
    perguntas: [
      { id: 1, texto: "Colaboração", ordem: 1 },
      { id: 2, texto: "Respeito", ordem: 2 },
      { id: 3, texto: "Cooperação", ordem: 3 },
      { id: 4, texto: "Apoio Mútuo", ordem: 4 },
      { id: 5, texto: "Compartilhamento de Conhecimento", ordem: 5 },
      { id: 6, texto: "Resolução de Conflitos", ordem: 6 },
      { id: 7, texto: "Compromisso com Metas Comuns", ordem: 7 },
      { id: 8, texto: "Flexibilidade", ordem: 8 },
      { id: 9, texto: "Celebração de Conquistas", ordem: 9 },
      { id: 10, texto: "Construção de Confiança", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "ADAPTABILIDADE01",
    nome: "Adaptabilidade",
    descricao: "Avalia a capacidade de adaptação a mudanças",
    categoria: "Adaptabilidade",
    perguntas: [
      { id: 1, texto: "Resiliência", ordem: 1 },
      { id: 2, texto: "Abertura a Novas Ideias", ordem: 2 },
      { id: 3, texto: "Gestão do Estresse", ordem: 3 },
      { id: 4, texto: "Aprendizado Contínuo", ordem: 4 },
      { id: 5, texto: "Flexibilidade", ordem: 5 },
      { id: 6, texto: "Iniciativa", ordem: 6 },
      { id: 7, texto: "Proatividade", ordem: 7 },
      { id: 8, texto: "Criatividade", ordem: 8 },
      { id: 9, texto: "Visão de Futuro", ordem: 9 },
      { id: 10, texto: "Tomada de Riscos Calculados", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "RESULTADOS01",
    nome: "Orientação a Resultados",
    descricao: "Avalia o foco em resultados e metas",
    categoria: "Orientação a Resultados",
    perguntas: [
      { id: 1, texto: "Foco em Metas", ordem: 1 },
      { id: 2, texto: "Qualidade do Trabalho", ordem: 2 },
      { id: 3, texto: "Eficiência", ordem: 3 },
      { id: 4, texto: "Produtividade", ordem: 4 },
      { id: 5, texto: "Cumprimento de Prazos", ordem: 5 },
      { id: 6, texto: "Busca por Excelência", ordem: 6 },
      { id: 7, texto: "Responsabilidade", ordem: 7 },
      { id: 8, texto: "Determinação", ordem: 8 },
      { id: 9, texto: "Autonomia", ordem: 9 },
      { id: 10, texto: "Iniciativa", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "DECISAO01",
    nome: "Tomada de Decisão",
    descricao: "Avalia a capacidade de tomar decisões eficazes",
    categoria: "Tomada de Decisão",
    perguntas: [
      { id: 1, texto: "Análise de Informações", ordem: 1 },
      { id: 2, texto: "Raciocínio Lógico", ordem: 2 },
      { id: 3, texto: "Velocidade de Decisão", ordem: 3 },
      { id: 4, texto: "Consideração de Riscos", ordem: 4 },
      { id: 5, texto: "Base em Evidências", ordem: 5 },
      { id: 6, texto: "Consultoria Adequada", ordem: 6 },
      { id: 7, texto: "Responsabilidade pelas Decisões", ordem: 7 },
      { id: 8, texto: "Adaptação às Consequências", ordem: 8 },
      { id: 9, texto: "Aprendizado com Erros", ordem: 9 },
      { id: 10, texto: "Visão de Longo Prazo", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "CONFLITOS01",
    nome: "Gestão de Conflitos",
    descricao: "Avalia a capacidade de gerir conflitos de forma eficaz",
    categoria: "Gestão de Conflitos",
    perguntas: [
      { id: 1, texto: "Identificação Precoce de Conflitos", ordem: 1 },
      { id: 2, texto: "Mediação", ordem: 2 },
      { id: 3, texto: "Comunicação Assertiva", ordem: 3 },
      { id: 4, texto: "Empatia", ordem: 4 },
      { id: 5, texto: "Negociação", ordem: 5 },
      { id: 6, texto: "Busca por Soluções Win-Win", ordem: 6 },
      { id: 7, texto: "Controle Emocional", ordem: 7 },
      { id: 8, texto: "Construção de Consenso", ordem: 8 },
      { id: 9, texto: "Prevenção de Conflitos", ordem: 9 },
      { id: 10, texto: "Aprendizado com Conflitos", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "INOVACAO01",
    nome: "Inovação",
    descricao: "Avalia a capacidade de inovar e pensar criativamente",
    categoria: "Inovação",
    perguntas: [
      { id: 1, texto: "Pensamento Criativo", ordem: 1 },
      { id: 2, texto: "Questionamento de Processos", ordem: 2 },
      { id: 3, texto: "Proposição de Melhorias", ordem: 3 },
      { id: 4, texto: "Abertura a Mudanças", ordem: 4 },
      { id: 5, texto: "Experimentação", ordem: 5 },
      { id: 6, texto: "Visão de Futuro", ordem: 6 },
      { id: 7, texto: "Aprendizado Contínuo", ordem: 7 },
      { id: 8, texto: "Colaboração para Inovação", ordem: 8 },
      { id: 9, texto: "Raciocínio Lateral", ordem: 9 },
      { id: 10, texto: "Implementação de Ideias", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "EMOCIONAL01",
    nome: "Inteligência Emocional",
    descricao: "Avalia a inteligência emocional e controle emocional",
    categoria: "Inteligência Emocional",
    perguntas: [
      { id: 1, texto: "Autoconsciência", ordem: 1 },
      { id: 2, texto: "Autogestão", ordem: 2 },
      { id: 3, texto: "Empatia", ordem: 3 },
      { id: 4, texto: "Habilidades Sociais", ordem: 4 },
      { id: 5, texto: "Controle do Estresse", ordem: 5 },
      { id: 6, texto: "Motivação", ordem: 6 },
      { id: 7, texto: "Resiliência", ordem: 7 },
      { id: 8, texto: "Comunicação Emocional", ordem: 8 },
      { id: 9, texto: "Reconhecimento de Emoções Alheias", ordem: 9 },
      { id: 10, texto: "Adaptação Emocional", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  },
  {
    codigo: "RESILIENCIA01",
    nome: "Resiliência",
    descricao: "Avalia a capacidade de se recuperar de adversidades",
    categoria: "Resiliência",
    perguntas: [
      { id: 1, texto: "Recuperação de Setbacks", ordem: 1 },
      { id: 2, texto: "Adaptação a Mudanças", ordem: 2 },
      { id: 3, texto: "Manutenção do Otimismo", ordem: 3 },
      { id: 4, texto: "Busca por Soluções", ordem: 4 },
      { id: 5, texto: "Aprendizado com Falhas", ordem: 5 },
      { id: 6, texto: "Controle do Estresse", ordem: 6 },
      { id: 7, texto: "Persistência", ordem: 7 },
      { id: 8, texto: "Flexibilidade Mental", ordem: 8 },
      { id: 9, texto: "Autoconfiança", ordem: 9 },
      { id: 10, texto: "Foco em Objetivos", ordem: 10 }
    ],
    faixas_interpretacao: [
      { min: 1, max: 2.5, label: "Baixo", cor: "#ef4444" },
      { min: 2.5, max: 3.7, label: "Médio", cor: "#f59e0b" },
      { min: 3.7, max: 5, label: "Alto", cor: "#10b981" }
    ]
  }
];