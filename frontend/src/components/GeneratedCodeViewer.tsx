import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ContentRenderer from "./ContentRenderer";
import { AlertTriangle, FileText, Terminal, Folder, File } from "lucide-react";

interface GeneratedCodeViewerProps {
  boilerplateSections: Record<string, string> | null;
  isLoading: boolean;
  error: string | null;
}

interface ParsedSection {
  title: string;
  content: string;
}

const sectionTitles: Record<string, string> = {
  overview: "🚀 Visão Geral do Projeto",
  techRationale: "Racional das Escolhas Tecnológicas",
  directoryStructure: "Estrutura de Diretórios Sugerida",
  frontendGuide: "Guia de Início Rápido e Configuração (Frontend)",
  backendGuide: "Guia de Início Rápido e Configuração (Backend)",
  databaseGuide: "Guia de Configuração do Banco de Dados",
  dockerGuide: "Configuração Docker",
  nextSteps: "Próximos Passos Sugeridos",
};

const GeneratedCodeViewer: React.FC<GeneratedCodeViewerProps> = ({ boilerplateSections, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="gh-card p-6 md:p-8 text-center h-full flex flex-col justify-center items-center">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gh_accent_green">A IA está elaborando seu boilerplate...</p>
        <p className="text-sm text-gh_light_text_secondary dark:text-gh_dark_text_secondary">
          Este processo pode levar alguns instantes.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gh-card p-5 md:p-6 border-danger-border_light dark:border-danger-border_dark bg-danger-bg_light dark:bg-danger-bg_dark text-danger-text_light dark:text-danger-text_dark h-full">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-danger">
          <AlertTriangle size={20} className="mr-2" /> Oops! Algo deu errado.
        </h3>
        <p className="mb-1 text-sm">{error}</p>
        <p className="mt-3 text-xs opacity-80">
          Por favor, verifique se suas chaves de API estão corretamente configuradas. Se o problema persistir, a API
          pode estar temporariamente indisponível ou suas configurações podem estar incorretas.
        </p>
      </div>
    );
  }

  if (!boilerplateSections) {
    return (
      <div className="gh-card p-6 md:p-8 text-center h-full flex flex-col justify-center items-center border-2 border-dashed border-gh_light_border dark:border-gh_dark_border bg-transparent shadow-none">
        <Terminal
          size={48}
          className="text-gh_light_text_secondary dark:text-gh_dark_text_secondary mb-4"
          strokeWidth={1.5}
        />
        <h3 className="text-xl font-medium text-gh_light_text_primary dark:text-gh_dark_text_primary mb-2">
          Seu Boilerplate Gerado Aparecerá Aqui
        </h3>
        <p className="text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm max-w-sm">
          Configure as opções do seu projeto ao lado e clique em "Gerar Boilerplate" para ver a mágica acontecer!
        </p>
      </div>
    );
  }

  const parsedSections: ParsedSection[] = Object.entries(boilerplateSections).map(([key, content]) => {
    let value: string;
    if (key === "directoryStructure" && typeof content === "object" && content !== null) {
      if (Array.isArray(content) && (content as any[]).every((item: any) => typeof item === "string")) {
        value = (content as any[]).join("\n");
      } else {
        value = JSON.stringify(content, null, 2);
      }
    } else {
      value = String(content ?? "").trim();
    }
    return {
      title: sectionTitles[key] || key,
      content: value,
    };
  });

  if (parsedSections.length === 0) {
    return (
      <div className="gh-card p-6 md:p-8 text-center h-full flex flex-col justify-center items-center bg-transparent shadow-none border-2 border-dashed border-orange-500/30">
        <AlertTriangle size={48} className="text-orange-400 dark:text-orange-500 mb-4" />
        <h3 className="text-xl font-medium text-gh_light_text_primary dark:text-gh_dark_text_primary mb-2">
          Conteúdo Não Pôde Ser Processado
        </h3>
        <p className="text-gh_light_text_secondary dark:text-gh_dark_text_secondary text-sm mb-4">
          A IA retornou um resultado, mas não foi possível dividi-lo em seções. Exibindo o conteúdo bruto abaixo:
        </p>
        <div className="w-full text-left overflow-x-auto border border-gh_light_border dark:border-gh_dark_border rounded-md p-4 bg-gh_light_input_bg dark:bg-gh_dark_input_bg max-h-[400px] simple-scrollbar">
          <pre className="text-xs text-gh_light_text_primary dark:text-gh_dark_text_primary whitespace-pre-wrap break-words">
            <code>{JSON.stringify(boilerplateSections, null, 2)}</code>
          </pre>
        </div>
      </div>
    );
  }

  const DirectoryTreeRenderer: React.FC<{ tree: string }> = ({ tree }) => {
    const lines = tree.split(/\r?\n/).filter((line) => line.trim() !== "");
    const getLevel = (line: string) => {
      const match = line.match(/^(\s*([\|`\- ]+))/);
      if (match) {
        const raw = match[1];
        const pipes = (raw.match(/\|/g) || []).length;
        const dashes = (raw.match(/\-/g) || []).length;
        const spaces = (raw.match(/ /g) || []).length;
        return Math.floor(spaces / 2) + pipes + dashes;
      }
      return 0;
    };
    return (
      <pre className="font-mono text-[16px] md:text-[18px] leading-relaxed bg-transparent p-0 m-0 border-0 whitespace-pre-wrap">
        {lines.map((line, idx) => {
          const level = getLevel(line);
          let isDir = /[\w\-.]+\/$/.test(line.trim());
          if (!isDir && idx < lines.length - 1) {
            const nextLevel = getLevel(lines[idx + 1]);
            if (nextLevel > level) {
              isDir = true;
            }
          }
          const nameMatch = line.match(/([\w\-.]+\/?)(\s*)$/);
          const name = nameMatch ? nameMatch[1] : line.trim();
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 select-text ${isDir ? "font-semibold" : "font-normal"} ${
                isDir ? "text-gh_accent_green" : "text-gh_light_text_primary dark:text-gh_dark_text_primary"
              }`}
              style={{
                marginLeft: `${level * 22}px`,
                textShadow: "0 1px 2px rgba(0,0,0,0.10)",
              }}
            >
              {isDir ? (
                <Folder size={18} className="text-gh_accent_green mr-1.5" aria-label="Pasta" />
              ) : (
                <File size={17} className="text-gh_light_icon dark:text-gh_dark_icon mr-1.5" aria-label="Arquivo" />
              )}
              <span>{name}</span>
            </div>
          );
        })}
      </pre>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto simple-scrollbar p-5">
      {parsedSections.map((section, index) => {
        const [open, setOpen] = useState(false);
        return (
          <div
            key={`section-card-${index}-${section.title.replace(/\s+/g, "-")}`}
            className="gh-card flex flex-col card-animate"
          >
            <button
              className="w-full text-left px-4 py-2.5 border-b border-gh_light_border dark:border-gh_dark_border bg-gh_light_header dark:bg-gh_dark_header rounded-t-md focus:outline-none focus:ring-2 focus:ring-gh_accent_green flex items-center justify-between group transition-colors"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls={`section-content-${index}`}
            >
              <span className="text-base font-semibold text-gh_light_text_primary dark:text-gh_dark_text_primary flex items-center">
                <FileText size={16} className="mr-2 text-gh_light_icon dark:text-gh_dark_icon" /> {section.title}
              </span>
              <span
                className={`ml-2 transition-transform text-gh_light_icon dark:text-gh_dark_icon ${
                  open ? "rotate-90" : ""
                }`}
              >
                ▶
              </span>
            </button>
            {open && (
              <div id={`section-content-${index}`} className="p-4 md:p-5 flex-grow min-h-0 animate-fade-in">
                {section.title === sectionTitles.directoryStructure ? (
                  <DirectoryTreeRenderer tree={section.content} />
                ) : (
                  <ContentRenderer markdownContent={section.content} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GeneratedCodeViewer;
