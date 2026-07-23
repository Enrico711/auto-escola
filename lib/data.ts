export const WHATSAPP_NUMBER = "5548323886576";
export const WHATSAPP_MESSAGE = "Olá! Vim pelo site e quero saber mais sobre como tirar minha CNH na Sul da Ilha.";

export const whatsappLink = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message ?? WHATSAPP_MESSAGE
  )}`;

export const categories = [
  {
    code: "A",
    title: "Categoria A",
    description: "Para quem quer conduzir motocicletas com autonomia e segurança pela cidade e pela ilha.",
    bullets: ["Aulas práticas em veículo próprio da moto", "Instrutores especializados em duas rodas"],
  },
  {
    code: "B",
    title: "Categoria B",
    description: "A habilitação mais procurada de Florianópolis, para dirigir carros no dia a dia e no trabalho.",
    bullets: ["Veículos com duplo comando", "Aulas nos bairros que você já conhece"],
  },
  {
    code: "A+B",
    title: "Categoria A+B",
    description: "As duas habilitações em um processo só, com economia de tempo e de documentação.",
    bullets: ["Cronograma combinado de aulas", "Um único acompanhamento do início ao fim"],
  },
  {
    code: "Renovação",
    title: "Renovação da CNH",
    description: "Sua carteira está vencendo? Cuidamos da renovação sem burocracia e sem filas.",
    bullets: ["Orientação completa sobre exames", "Acompanhamento até a entrega da nova CNH"],
  },
  {
    code: "Reciclagem",
    title: "Reciclagem",
    description: "Para quem precisa retomar pontos ou cumprir determinação do Detran com tranquilidade.",
    bullets: ["Aulas teóricas atualizadas", "Suporte para cada etapa exigida"],
  },
  {
    code: "Mudança",
    title: "Mudança de Categoria",
    description: "Já tem CNH e quer adicionar outra categoria? Aproveitamos seu histórico para agilizar.",
    bullets: ["Processo mais rápido para quem já é habilitado", "Aulas focadas no que você ainda precisa aprender"],
  },
];

export const testimonials = [
  {
    name: "Camila R.",
    service: "Categoria B",
    quote: "Fiz aula com dois instrutores diferentes por causa da minha agenda e os dois foram super pacientes. Nunca me senti pressionada, mesmo nos dias que eu travava no estacionamento.",
    initials: "CR",
  },
  {
    name: "Rodrigo M.",
    service: "Renovação da CNH",
    quote: "Deixei renovar quase até o vencimento por preguiça da burocracia. Na Sul da Ilha resolveram tudo em poucos dias e me avisaram cada passo pelo WhatsApp.",
    initials: "RM",
  },
  {
    name: "Aline S.",
    service: "Categoria A+B",
    quote: "Tirei moto e carro juntos para economizar tempo. O atendimento é rápido de verdade, sempre respondiam minhas dúvidas no mesmo dia.",
    initials: "AS",
  },
  {
    name: "Eduardo T.",
    service: "Reciclagem",
    quote: "Precisava fazer a reciclagem depois de perder pontos e fiquei com receio de julgamento. Fui muito bem tratado, sem sermão, só o suporte que eu precisava.",
    initials: "ET",
  },
  {
    name: "Bianca F.",
    service: "Categoria B",
    quote: "Parcelei em 6x e isso fez toda diferença no meu orçamento. Os carros são novos e o instrutor explicava tudo com muita calma.",
    initials: "BF",
  },
];

export const faqs = [
  {
    question: "Quais documentos eu preciso para começar?",
    answer: "Você precisa de RG ou CNH anterior, CPF, comprovante de residência e uma foto 3x4 recente. Se for renovação ou reciclagem, pode ser necessário um documento adicional.",
  },
  {
    question: "Posso parcelar o curso?",
    answer: "Sim. Todos os nossos serviços podem ser parcelados em até 6 vezes, para caber no seu orçamento.",
  },
  {
    question: "Quanto tempo leva para tirar a CNH?",
    answer: "O prazo varia conforme o Detran e a disponibilidade de exames, mas em geral o processo completo leva algumas semanas.",
  },
  {
    question: "Como funcionam as aulas práticas?",
    answer: "As aulas são individuais, no ritmo de cada aluno, com instrutores pacientes e veículos com duplo comando.",
  },
  {
    question: "Posso renovar minha carteira mesmo estando quase vencida?",
    answer: "Sim, e quanto antes você iniciar, melhor. Cuidamos de toda a orientação.",
  },
  {
    question: "Como funciona a reciclagem da CNH?",
    answer: "A reciclagem envolve aulas teóricas atualizadas e etapas específicas determinadas pelo Detran.",
  },
];

export const differentials = [
  {
    title: "Atendimento rápido",
    description: "Respostas ágeis pelo WhatsApp, sem enrolação.",
  },
  {
    title: "Instrutores pacientes",
    description: "Cada aluno aprende em um ritmo. Nossos instrutores respeitam o seu.",
  },
  {
    title: "Veículos profissionais",
    description: "Frota identificada, revisada e confortável.",
  },
  {
    title: "Parcelamento facilitado",
    description: "Tudo pode ser parcelado em até 6x.",
  },
  {
    title: "Processo simplificado",
    description: "Cuidamos da burocracia para você focar no aprendizado.",
  },
  {
    title: "Suporte humano",
    description: "Você fala com pessoas de verdade, que conhecem a região.",
  },
];
