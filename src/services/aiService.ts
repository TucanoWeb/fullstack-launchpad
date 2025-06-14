import { ProjectConfiguration } from "../types";

// mock
// import { fakeResponse } from "../helper/fakeResponse";

function constructUserPrompt(config: ProjectConfiguration): string {
  return `Você é um assistente especialista em desenvolvimento full-stack e arquitetura de software. Com base nas seleções abaixo, gere um boilerplate conceitual e um guia detalhado para um novo projeto de software.

**IMPORTANTE:** O RETORNO DEVE SER EXCLUSIVAMENTE UM JSON VÁLIDO, sem nenhum texto antes ou depois, nem comentários, nem blocos markdown. O JSON deve conter as seguintes chaves:
- "overview": visão geral do projeto
- "techRationale": racional das escolhas tecnológicas
- "directoryStructure": estrutura de diretórios sugerida (sempre como uma string em formato de árvore, igual ao comando tree, nunca como objeto ou array)
- "frontendGuide": guia de início rápido e configuração do frontend (deve ser EXTREMAMENTE detalhado, passo a passo, incluindo comandos de terminal para instalação dos templates e dependências, explicando cada comando e cada escolha, de modo que um usuário iniciante consiga executar e entender. Considere a biblioteca de estilização escolhida pelo usuário e explique como integrá-la ao projeto.)
- "backendGuide": guia de início rápido e configuração do backend (deve ser EXTREMAMENTE detalhado, passo a passo, incluindo comandos de terminal para instalação dos templates e dependências, explicando cada comando e cada escolha, de modo que um usuário iniciante consiga executar e entender)
- "databaseGuide": guia de configuração do banco de dados
- "dockerGuide": guia de configuração Docker (ou mensagem se não solicitado)
- "nextSteps": próximos passos sugeridos

Exemplo de estrutura de resposta:
{
  "overview": "...",
  "techRationale": "...",
  "directoryStructure": "/meu-projeto\n  |- /frontend/\n  |  |- /src/\n  |  |- package.json\n  |- /backend/\n  |  |- /src/\n  |  |- package.json\n  |- Dockerfile.frontend\n  |- Dockerfile.backend\n  |- docker-compose.yml",
  "frontendGuide": "...",
  "backendGuide": "...",
  "databaseGuide": "...",
  "dockerGuide": "...",
  "nextSteps": "..."
}

Preencha cada campo com o conteúdo detalhado, usando markdown dentro dos valores das propriedades quando necessário (ex: blocos de código, listas, etc). NÃO inclua texto fora do JSON. NÃO use blocos de código markdown no retorno. A chave "directoryStructure" deve ser sempre uma string em formato de árvore, igual ao comando tree, nunca um objeto ou array.

**ATENÇÃO:** Nos campos "frontendGuide" e "backendGuide", forneça comandos de terminal para instalação dos templates e dependências, explique cada comando, cada escolha de ferramenta, e o motivo de serem as melhores opções para o projeto. O passo a passo deve ser detalhado para iniciantes, incluindo dicas de boas práticas e links oficiais para referência. Não assuma nenhum conhecimento prévio do usuário. No frontendGuide, explique e integre a biblioteca de estilização escolhida: ${
    config.stylingLibrary || "Nenhuma"
  }.

Configurações do Projeto Solicitadas:
* Nome do Projeto: ${config.projectName}
* Framework Frontend: ${config.frontendFramework}
* Framework Backend: ${config.backendFramework}
* Banco de Dados: ${config.database}
* Tipo de Modelagem de Dados: ${config.dataModeling}
* Incluir configuração Docker: ${config.dockerize ? "Sim" : "Não"}
* Biblioteca de Estilização: ${config.stylingLibrary || "Nenhuma"}

É fundamental que o retorno seja um JSON válido, sem erros de sintaxe, e que cada campo seja preenchido com informações úteis e práticas para o usuário. O guia deve ser claro, passo a passo, e acessível para iniciantes em desenvolvimento full-stack. 
`;
}

export async function generateBoilerplate(config: ProjectConfiguration): Promise<{ sections: Record<string, string> }> {
  const apiKey = process.env.AI_KEY;
  const endpoint = process.env.AI_ENDPOINT;

  if (!apiKey) {
    throw new Error("Chave da API (AI_KEY) não configurada.");
  }
  if (!endpoint) {
    throw new Error("Endpoint da API (AI_ENDPOINT) não configurado.");
  }

  const userPrompt = constructUserPrompt(config);

  const requestBody = {
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de IA especialista em gerar estruturas de projeto (boilerplates) e guias detalhados para desenvolvimento full-stack. O RETORNO DEVE SER EXCLUSIVAMENTE UM JSON VÁLIDO, sem texto antes ou depois.",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    max_tokens: 7000,
    temperature: 0.6,
    top_p: 0.95,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Erro da API:", errorData);
      throw new Error(
        `Erro da API Azure OpenAI: ${response.status} ${
          errorData.error?.message || errorData.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Resposta inesperada da API:", data);
      throw new Error("A API não retornou o conteúdo esperado.");
    }

    let content = data.choices[0].message.content.trim();
    content = content.replace(/^```json[\s\n]*|^```[\s\n]*|```$/gim, "").trim();

    content = content.replace(/^```json[\s\n]*|^```[\s\n]*|```$/gim, "").trim();
    let sections: Record<string, string> = {};
    try {
      sections = JSON.parse(content);
    } catch (e) {
      console.error("Falha ao fazer parse do JSON retornado pela API:", content);
      throw new Error("O retorno da API não pôde ser interpretado como JSON válido.");
    }
    return { sections };
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    if (error instanceof Error && error.message.startsWith("Erro da API:")) {
      throw error;
    }
    throw new Error("Falha ao se comunicar com a API. Verifique a conexão e as configurações do endpoint.");
  }
}
