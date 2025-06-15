import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProjectConfiguration, Theme } from "./types";
import { requestBoilerplate, getBoilerplateStatus } from "./services/aiService";
import ProjectConfigurator from "./components/ProjectConfigurator";
import GeneratedCodeViewer from "./components/GeneratedCodeViewer";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { RootState, AppDispatch } from "./store/store";
import { setTheme as setThemeAction } from "./store/themeSlice";
import { Github } from "lucide-react";
import LoadingSpinner from "./components/LoadingSpinner";

const PARTS = [
    { key: "overview", label: "Visão Geral" },
    { key: "tech_rationale", label: "Racional Tecnológico" },
    { key: "directory_structure", label: "Estrutura de Diretórios" },
    { key: "frontend_guide", label: "Guia Frontend" },
    { key: "backend_guide", label: "Guia Backend" },
    { key: "database_guide", label: "Guia Banco de Dados" },
    { key: "docker_guide", label: "Guia Docker" },
    { key: "next_steps", label: "Próximos Passos" }
];

const App: React.FC = () => {
    const [projectConfig, setProjectConfig] = useState<ProjectConfiguration>({
        projectName: "meu-projeto-genial",
        frontendFramework: "React (Vite)",
        backendFramework: "Node.js/Express",
        database: "PostgreSQL",
        dataModeling: "Relacional",
        stylingLibrary: "Tailwind CSS",
        dockerize: true
    });
    const [boilerplateSections, setBoilerplateSections] = useState<Record<string, string> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(false);
    const [requestId, setRequestId] = useState<string>("");
    const [progress, setProgress] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<string>("");
    const [manualId, setManualId] = useState<string>("");
    const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
    const [copy, setCopy] = useState<boolean>(false);

    // start block ==== THEME
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (currentTheme === "system") {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", systemPrefersDark);
        } else {
            document.documentElement.classList.toggle("dark", currentTheme === "dark");
        }
    }, [currentTheme]);

    useEffect(() => {
        if (currentTheme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = (e: MediaQueryListEvent) => {
                document.documentElement.classList.toggle("dark", e.matches);
            };
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [currentTheme]);

    const handleThemeChange = (theme: Theme) => {
        dispatch(setThemeAction(theme));
    };
    // end block ==== THEME

    const handleConfigChange = useCallback((newConfig: Partial<ProjectConfiguration>) => {
        setProjectConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
    }, []);

    // create new request
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setBoilerplateSections(null);
        setRequestId("");
        setProgress({});
        setStatus("");
        if (polling) clearInterval(polling);

        try {
            const { id } = await requestBoilerplate(projectConfig);
            setRequestId(id);
            pollStatus(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao se comunicar com a API.");
            setIsLoading(false);
        }
    };

    // send request by id
    const handleManualIdSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualId) return;

        setRequestId(manualId);
        setBoilerplateSections(null);
        setProgress({});
        setStatus("");
        pollStatus(manualId);
        setCopy(false);
    };

    const pollStatus = (id: string) => {
        setIsLoading(true);
        setError(null);

        const interval = setInterval(async () => {
            try {
                const data = await getBoilerplateStatus(id);
                setStatus(data.status);
                const prog: Record<string, boolean> = {};
                PARTS.forEach((p) => {
                    prog[p.key] = !!data[p.key];
                });
                setProgress(prog);
                if (data.status === "done") {
                    clearInterval(interval);
                    setPolling(null);
                    setIsLoading(false);
                    setBoilerplateSections({
                        overview: data.overview,
                        techRationale: data.tech_rationale,
                        directoryStructure: data.directory_structure,
                        frontendGuide: data.frontend_guide,
                        backendGuide: data.backend_guide,
                        databaseGuide: data.database_guide,
                        dockerGuide: data.docker_guide,
                        nextSteps: data.next_steps
                    });
                } else if (data.status === "error") {
                    clearInterval(interval);
                    setPolling(null);
                    setIsLoading(false);
                    setError(data.error || "Erro desconhecido ao gerar boilerplate.");
                }
            } catch (err) {
                clearInterval(interval);
                setPolling(null);
                setIsLoading(false);
                setError("Erro ao consultar status da requisição.");
            }
        }, 10000);
    };

    useEffect(() => {
        return () => {
            if (polling) clearInterval(polling);
        };
    }, [polling]);

    // render
    return (
        <div className="min-h-screen flex flex-col bg-gh_light_bg dark:bg-gh_dark_bg pt-4">
            <header className="gh-header top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
                    <div className="flex items-center">
                        <Github size={28} className="text-gh_light_text_primary dark:text-gh_dark_text_primary mr-3" />
                        <h1 className="text-xl font-semibold text-gh_light_text_primary dark:text-gh_dark_text_primary">
                            Full-Stack Launchpad <span className="text-gh_accent_blue">AI Pro</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={handleThemeChange} />
                        <a
                            href="https://github.com/TucanoWeb/fullstack-launchpad.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ver repositório no GitHub"
                            className="ml-2 p-1.5 rounded-md hover:bg-gh_light_border dark:hover:bg-gh_dark_border transition-colors"
                        >
                            <Github
                                size={22}
                                className="text-gh_light_icon dark:text-gh_dark_icon hover:text-gh_accent_blue transition-colors"
                            />
                        </a>
                    </div>
                </div>
            </header>

            <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6 md:mb-8 flex items-center justify-center sm:justify-start gap-2">
                    <p className="text-base text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-center sm:text-left m-0">
                        Gere boilerplates full-stack com IA e explicações detalhadas.
                    </p>
                    <button
                        onClick={() => setShowAbout(true)}
                        className="ml-2 px-2 py-1 rounded-md text-gh_accent_blue border border-gh_accent_blue/30 bg-gh_light_input_bg dark:bg-gh_dark_input_bg text-xs font-medium hover:bg-gh_accent_blue/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gh_accent_blue/40"
                        aria-label="Sobre o projeto"
                    >
                        O que são boilerplates?
                    </button>
                </div>
                {showAbout && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-gh_light_card dark:bg-gh_dark_card rounded-lg shadow-xl max-w-lg w-full p-6 border border-gh_light_border dark:border-gh_dark_border animate-fade-in relative">
                            <button
                                onClick={() => setShowAbout(false)}
                                className="absolute top-3 right-3 text-gh_light_icon dark:text-gh_dark_icon hover:text-gh_accent_blue text-lg font-bold focus:outline-none"
                                aria-label="Fechar modal"
                            >
                                ×
                            </button>
                            <h2 className="text-xl font-bold mb-2 text-gh_light_text_primary dark:text-gh_dark_text_primary">
                                Sobre o Full-Stack Launchpad AI Pro
                            </h2>
                            <p className="mb-2 text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm">
                                <strong>Full-Stack Launchpad AI Pro</strong> é uma plataforma open source que utiliza
                                Inteligência Artificial para gerar <strong>boilerplates</strong> completos e guias
                                detalhadas para projetos web modernos.
                            </p>
                            <h3 className="text-base font-semibold mt-4 mb-1 text-gh_accent_blue">
                                O que são boilerplates?
                            </h3>
                            <p className="mb-2 text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm">
                                Boilerplates são estruturas de código base, já organizadas e configuradas, que servem
                                como ponto de partida para novos projetos. Eles economizam tempo, evitam erros comuns e
                                garantem boas práticas desde o início, permitindo que você foque no que realmente
                                importa: as funcionalidades do seu produto.
                            </p>
                            <h3 className="text-base font-semibold mt-4 mb-1 text-gh_accent_blue">Como funciona?</h3>
                            <ul className="list-disc pl-5 mb-2 text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm">
                                <li>
                                    Você escolhe as tecnologias (frontend, backend, banco de dados, modelagem,
                                    estilização, etc).
                                </li>
                                <li>
                                    A IA gera uma estrutura de diretórios, guias de configuração e comandos prontos para
                                    você iniciar seu projeto.
                                </li>
                                <li>Tudo é explicado passo a passo, inclusive para quem nunca usou as ferramentas.</li>
                                <li>
                                    O projeto é open source:{" "}
                                    <a
                                        href="https://github.com/TucanoWeb/fullstack-launchpad.git"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gh_accent_blue underline"
                                    >
                                        contribua ou acompanhe no GitHub
                                    </a>
                                    .
                                </li>
                            </ul>
                            <p className="text-xs text-gh_light_text_secondary dark:text-gh_dark_text_secondary mt-3">
                                Dúvidas, sugestões ou quer contribuir?{" "}
                                <a
                                    href="https://github.com/TucanoWeb/fullstack-launchpad.git"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gh_accent_blue underline"
                                >
                                    Acesse o repositório
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                )}
                <main className="grid grid-cols-1 xl:grid-cols-10 gap-6 xl:gap-8">
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <ProjectConfigurator
                            config={projectConfig}
                            onConfigChange={handleConfigChange}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            hasBoilerplate={!!boilerplateSections}
                            status={status}
                        />
                        {/* Bloco de progresso e consulta por ID */}
                        <div className="bg-gh_light_card dark:bg-gh_dark_card p-4 rounded-lg shadow-md border border-gh_light_border dark:border-gh_dark_border">
                            {/* Exibe o ID gerado */}
                            {requestId && (
                                <div className="text-xs font-semibold text-gh_accent_yellow mb-1">
                                    <strong>ID da requisição:</strong> {requestId}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(requestId);
                                            setCopy(true);
                                        }}
                                        className="ml-2 text-gh_accent_green hover:text-gh_accent_green/80 transition-colors "
                                        aria-label="Copiar ID para a área de transferência"
                                    >
                                        {!copy ? "📋 Copiar" : "✅ Copiado"}
                                    </button>
                                </div>
                            )}
                            {/* Progresso das partes */}
                            {status && status !== "done" && status !== "error" && (
                                <div>
                                    <h4 className="text-xs font-semibold mb-2 mt-4 text-gh_accent_green">
                                        Progresso da geração
                                    </h4>
                                    <ul className="space-y-1 mb-2">
                                        {PARTS.map((p) => (
                                            <li key={p.key} className="flex items-center gap-2 text-xs">
                                                <span
                                                    className={
                                                        progress[p.key]
                                                            ? "text-gh_accent_green"
                                                            : "text-xs font-medium text-gh_light_text_secondary dark:text-gh_dark_text_secondary mb-1"
                                                    }
                                                >
                                                    {progress[p.key] && status !== "pending" ? (
                                                        "✔️"
                                                    ) : progress[p.key] ? (
                                                        "✅"
                                                    ) : (
                                                        <LoadingSpinner />
                                                    )}
                                                </span>
                                                <span
                                                    className={
                                                        "text-xs font-medium text-gh_light_text_secondary dark:text-gh_dark_text_secondary mb-1"
                                                    }
                                                >
                                                    {p.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Campo para consulta manual por ID */}
                            {!isLoading && status !== "processing" ? (
                                <form onSubmit={handleManualIdSubmit} className="flex flex-col gap-1">
                                    <label
                                        htmlFor="manualId"
                                        className="text-xs text-gh_light_text_secondary dark:text-gh_dark_text_secondary font-medium mb-1"
                                    >
                                        Consulte o boilerplate por ID:
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="manualId"
                                            type="text"
                                            value={manualId}
                                            onChange={(e) => setManualId(e.target.value)}
                                            placeholder="Cole o ID da requisição aqui"
                                            className="gh-input-base rounded border px-2 py-1 flex-1 text-xs"
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs text-white transition-colors duration-200 hover:bg-gh_accent_green/90 disabled:opacity-50 disabled:cursor-not-allowed group relative focus:outline-none focus:ring-2 focus:ring-gh_accent_green/70 focus:ring-offset-2 rounded-lg shadow-sm border border-transparent bg-gh_accent_green hover:bg-gh_accent_green/90"
                                        >
                                            Consultar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div className="xl:col-span-6 min-h-[500px] xl:min-h-0">
                        <GeneratedCodeViewer
                            boilerplateSections={boilerplateSections}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </main>
            </div>
            <footer className="w-full mt-auto py-6 text-center text-xs text-gh_light_text_secondary dark:text-gh_dark_text_secondary border-t border-gh_light_border dark:border-gh_dark_border">
                <p>Potencializado e atualizado com IA.</p>
                <p>&copy; {new Date().getFullYear()} Full-Stack Launchpad AI Pro.</p>
            </footer>
        </div>
    );
};

export default App;
