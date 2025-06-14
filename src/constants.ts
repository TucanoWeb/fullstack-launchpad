import { FrameworkOption } from "./types";

export const FRONTEND_FRAMEWORKS: FrameworkOption[] = [
  {
    id: "React (Vite)",
    name: "React (Vite)",
    description:
      "Uma biblioteca JavaScript popular para construir interfaces de usuário com um ecossistema robusto e foco em componentização. Vite oferece um desenvolvimento extremamente rápido.",
  },
  {
    id: "Vue (Vite)",
    name: "Vue (Vite)",
    description:
      "Um framework progressivo para construir interfaces de usuário. Conhecido por sua curva de aprendizado suave e excelente documentação. Vite otimiza o build.",
  },
  {
    id: "Angular",
    name: "Angular",
    description:
      "Uma plataforma e framework para construir aplicações de página única (SPAs) complexas, mantido pelo Google. Oferece uma estrutura opinativa e completa.",
  },
  {
    id: "SvelteKit",
    name: "SvelteKit",
    description:
      "Um framework que compila seu código para JavaScript otimizado em tempo de build, resultando em aplicações muito performáticas. SvelteKit é o framework full-stack oficial.",
  },
];

export const BACKEND_FRAMEWORKS: FrameworkOption[] = [
  {
    id: "Node.js/Express",
    name: "Node.js/Express",
    description:
      "Um framework minimalista e flexível para Node.js, amplamente utilizado para construir APIs RESTful e aplicações web. Grande comunidade e muitos middlewares.",
  },
  {
    id: "NestJS",
    name: "NestJS (Node.js)",
    description:
      "Um framework Node.js para construir aplicações do lado do servidor eficientes, escaláveis e baseadas em TypeScript. Usa arquitetura inspirada no Angular.",
  },
  {
    id: "Python/Flask",
    name: "Python/Flask",
    description:
      "Um microframework leve para Python, fácil de começar e altamente extensível. Ideal para APIs e aplicações menores ou como parte de uma arquitetura de microsserviços.",
  },
  {
    id: "Python/Django",
    name: "Python/Django",
    description:
      'Um framework Python de alto nível que encoraja desenvolvimento rápido e design limpo e pragmático. Inclui muitas funcionalidades "out-of-the-box".',
  },
  {
    id: "Java/Spring Boot",
    name: "Java/Spring Boot",
    description:
      "Um framework popular no ecossistema Java para criar aplicações standalone e de nível de produção. Focado em convenção sobre configuração.",
  },
];

export const DATABASES: FrameworkOption[] = [
  {
    id: "PostgreSQL",
    name: "PostgreSQL",
    description:
      "Um poderoso sistema de gerenciamento de banco de dados relacional de objeto, conhecido por sua robustez, extensibilidade e conformidade com SQL.",
  },
  {
    id: "MongoDB",
    name: "MongoDB",
    description:
      "Um banco de dados NoSQL orientado a documentos, popular para aplicações que necessitam de escalabilidade e flexibilidade no esquema de dados.",
  },
  {
    id: "MySQL",
    name: "MySQL",
    description:
      "Um sistema de gerenciamento de banco de dados relacional de código aberto amplamente utilizado, conhecido por sua confiabilidade e facilidade de uso.",
  },
  {
    id: "Nenhum",
    name: "Nenhum",
    description: "Não incluir configuração específica de banco de dados no boilerplate inicial.",
  },
];

export const DATA_MODELING_OPTIONS: FrameworkOption[] = [
  {
    id: "Relacional",
    name: "Relacional",
    description:
      "Estrutura dados em tabelas com linhas e colunas, com relações predefinidas entre elas. Ideal para dados estruturados e consistência (ACID). Ex: PostgreSQL, MySQL.",
  },
  {
    id: "Documental",
    name: "Documental (NoSQL)",
    description:
      "Armazena dados em documentos flexíveis (ex: JSON, BSON). Bom para dados semiestruturados ou com esquemas que evoluem rapidamente. Ex: MongoDB.",
  },
  {
    id: "Grafo (NoSQL)",
    name: "Grafo (NoSQL)",
    description:
      "Usa nós, arestas e propriedades para representar e armazenar dados. Excelente para modelar relações complexas e realizar consultas de conectividade. Ex: Neo4j.",
  },
  {
    id: "Chave-Valor (NoSQL)",
    name: "Chave-Valor (NoSQL)",
    description:
      "Armazena dados como uma coleção de pares chave-valor. Extremamente rápido para leituras e escritas simples. Ex: Redis, DynamoDB.",
  },
];

export const STYLING_LIBRARIES: FrameworkOption[] = [
  {
    id: "TailwindCSS",
    name: "Tailwind CSS",
    description:
      "Framework utilitário para estilização rápida e responsiva, muito popular em projetos modernos.",
  },
  {
    id: "ChakraUI",
    name: "Chakra UI",
    description:
      "Biblioteca de componentes React acessível e pronta para produção, com foco em DX e acessibilidade.",
  },
  {
    id: "MaterialUI",
    name: "Material UI",
    description:
      "Implementação dos componentes Material Design para React, muito utilizada em projetos corporativos.",
  },
  {
    id: "StyledComponents",
    name: "Styled Components",
    description:
      "CSS-in-JS para React, permite criar estilos encapsulados em componentes.",
  },
  {
    id: "Nenhuma",
    name: "Nenhuma",
    description:
      "Não incluir biblioteca de estilização no boilerplate inicial.",
  },
];
