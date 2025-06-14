import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProjectConfiguration, Theme } from "./types";
import { generateBoilerplate } from "./services/aiService";
import ProjectConfigurator from "./components/ProjectConfigurator";
import GeneratedCodeViewer from "./components/GeneratedCodeViewer";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { RootState, AppDispatch } from "./store/store";
import { setTheme as setThemeAction } from "./store/themeSlice";
import { Github } from "lucide-react";

const App: React.FC = () => {
  const [projectConfig, setProjectConfig] = useState<ProjectConfiguration>({
    projectName: "meu-projeto-genial",
    frontendFramework: "React (Vite)",
    backendFramework: "Node.js/Express",
    database: "PostgreSQL",
    dataModeling: "Relacional",
    stylingLibrary: "Tailwind CSS",
    dockerize: true,
  });
  const [boilerplateSections, setBoilerplateSections] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

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

  const handleConfigChange = useCallback((newConfig: Partial<ProjectConfiguration>) => {
    setProjectConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setBoilerplateSections(null);

    if (!process.env.VITE_BACKEND_URL) {
      setError(
        "O endpoint para seu backend não está configurado nas variáveis de ambiente (VITE_BACKEND_URL). Esta aplicação requer que estas chaves estejam disponíveis no ambiente de execução e não devem ser inseridas ou gerenciadas pela UI."
      );
      setIsLoading(false);
      return;
    }

    try {
      const { sections } = await generateBoilerplate(projectConfig);
      setBoilerplateSections(sections);
    } catch (err) {
      console.error("Erro ao gerar boilerplate:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao se comunicar com a API.");
    } finally {
      setIsLoading(false);
    }
  };

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
                <strong>Full-Stack Launchpad AI Pro</strong> é uma plataforma open source que utiliza Inteligência
                Artificial para gerar <strong>boilerplates</strong> completos e guias detalhados para projetos web
                modernos.
              </p>
              <h3 className="text-base font-semibold mt-4 mb-1 text-gh_accent_blue">O que são boilerplates?</h3>
              <p className="mb-2 text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm">
                Boilerplates são estruturas de código base, já organizadas e configuradas, que servem como ponto de
                partida para novos projetos. Eles economizam tempo, evitam erros comuns e garantem boas práticas desde o
                início, permitindo que você foque no que realmente importa: as funcionalidades do seu produto.
              </p>
              <h3 className="text-base font-semibold mt-4 mb-1 text-gh_accent_blue">Como funciona?</h3>
              <ul className="list-disc pl-5 mb-2 text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm">
                <li>Você escolhe as tecnologias (frontend, backend, banco de dados, modelagem, estilização, etc).</li>
                <li>
                  A IA gera uma estrutura de diretórios, guias de configuração e comandos prontos para você iniciar seu
                  projeto.
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
          <div className="xl:col-span-4">
            {" "}
            {/* Adjusted for better balance */}
            <ProjectConfigurator
              config={projectConfig}
              onConfigChange={handleConfigChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              hasBoilerplate={!!boilerplateSections}
            />
          </div>
          <div className="xl:col-span-6 min-h-[500px] xl:min-h-0">
            {" "}
            {/* Adjusted for better balance */}
            <GeneratedCodeViewer boilerplateSections={boilerplateSections} isLoading={isLoading} error={error} />
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
