import { ProjectConfiguration } from "../types";

// mock
// import { fakeResponse } from "../helper/fakeResponse";

function constructUserPrompt(config: ProjectConfiguration): string {
    return `Você é um assistente especialista em desenvolvimento full-stack e arquitetura de software. Com base nas seleções abaixo, gere um boilerplate conceitual e um guia detalhado para um novo projeto de software.

**IMPORTANTE:** O RETORNO DEVE SER EXCLUSIVAMENTE DO CAMPO INFORMADO NA SEÇÃO CAMPO A SER RESPONDIDO:
- "overview": visão geral do projeto
- "techRationale": racional das escolhas tecnológicas
- "directoryStructure": estrutura de diretórios sugerida (sempre como uma string em formato de árvore, igual ao comando tree, nunca como objeto ou array)
- "frontendGuide": guia de início rápido e configuração do frontend (deve ser EXTREMAMENTE detalhado, passo a passo, incluindo comandos de terminal para instalação dos templates e dependências, explicando cada comando e cada escolha, de modo que um usuário iniciante consiga executar e entender. Considere a biblioteca de estilização escolhida pelo usuário e explique como integrá-la ao projeto.)
- "backendGuide": guia de início rápido e configuração do backend (deve ser EXTREMAMENTE detalhado, passo a passo, incluindo comandos de terminal para instalação dos templates e dependências, explicando cada comando e cada escolha, de modo que um usuário iniciante consiga executar e entender)
- "databaseGuide": guia de configuração do banco de dados
- "dockerGuide": guia de configuração Docker (ou mensagem se não solicitado)
- "nextSteps": próximos passos sugeridos

Todas as respostas devem ser claras, passo a passo, e acessíveis para iniciantes em desenvolvimento full-stack. O guia deve ser prático e útil, com links oficiais para referência quando possível.

O campo "directoryStructure", caso seja o campo a ser respondido na seção "CAMPO A SER RESPONDIDO" deve ser sempre uma string em formato de árvore, igual ao comando tree, nunca um objeto ou array. Além disso, certifique-se de que a estrutura de diretórios seja adequada para o framework frontend e backend escolhidos, que siga boas práticas de organização de código e que tenha uma estrutura lógica e intuitiva. O usuário precisa ver a estrutura de diretórios como uma árvore, com cada nível representando um diretório ou subdiretório, e os arquivos listados dentro de seus respectivos diretórios.

Preencha por enquanto somente o campo selecionado mais abaixo, usando markdown dentro dos valores das propriedades quando necessário (ex: blocos de código, listas, etc). NÃO inclua outros textos que não estejam no contexto, pois esse texto será mostrado para o usuário no frontend. A chave "directoryStructure" deve ser sempre uma string em formato de árvore, igual ao comando tree, nunca um objeto ou array.

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

É fundamental que a resposta seja sem erros de sintaxe, e que cada campo seja preenchido com informações úteis e práticas para o usuário. O guia deve ser claro, passo a passo, e acessível para iniciantes em desenvolvimento full-stack. 

Certifique-se de não envolver a resposta em um bloco markdown. Apenas utilize o markdown para formatação da resposta, como blocos de código, listas, etc.

CAMPO A SER RESPONDIDO:

`;
}

export async function generateBoilerplate(config: ProjectConfiguration): Promise<{ sections: Record<string, string> }> {
    const endpoint = process.env.VITE_BACKEND_URL;

    if (!endpoint) {
        throw new Error("Endpoint da API (VITE_BACKEND_URL) não configurado.");
    }

    try {
        const response = await fetch(`${endpoint}/api/v1/ai`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: constructUserPrompt(config) })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(
                `Erro do backend: ${response.status} ${
                    errorData.error?.message || errorData.message || response.statusText
                }`
            );
        }

        const data = await response.json();
        if (!data.sections) {
            throw new Error("O backend não retornou o conteúdo esperado.");
        }
        return { sections: data.sections };
    } catch (error) {
        throw new Error("Falha ao se comunicar com o backend. Verifique a conexão e as configurações do endpoint.");
    }
}

export async function requestBoilerplate(config: ProjectConfiguration): Promise<{ id: string }> {
    const endpoint = process.env.VITE_BACKEND_URL;
    if (!endpoint) {
        throw new Error("Endpoint da API (VITE_BACKEND_URL) não configurado.");
    }
    const response = await fetch(`${endpoint}/api/v1/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: constructUserPrompt(config) }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(
            `Erro do backend: ${response.status} ${errorData.error?.message || errorData.message || response.statusText}`
        );
    }
    const data = await response.json();
    if (!data.id) {
        throw new Error("O backend não retornou o id da requisição.");
    }
    return { id: data.id };
}

export async function getBoilerplateStatus(id: string) {
    const endpoint = process.env.VITE_BACKEND_URL;
    if (!endpoint) {
        throw new Error("Endpoint da API (VITE_BACKEND_URL) não configurado.");
    }
    const response = await fetch(`${endpoint}/api/v1/ai/${id}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(
            `Erro do backend: ${response.status} ${errorData.error?.message || errorData.message || response.statusText}`
        );
    }
    return await response.json();
}
