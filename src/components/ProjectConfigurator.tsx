import React from 'react';
import { ProjectConfiguration, FrameworkOption } from '../types';
import { FRONTEND_FRAMEWORKS, BACKEND_FRAMEWORKS, DATABASES, DATA_MODELING_OPTIONS, STYLING_LIBRARIES } from '../constants';
import Tooltip from './Tooltip';
import { SlidersHorizontal, Package, Database, Cpu, Palette, FileJson, Feather, Code2 } from 'lucide-react';

interface ProjectConfiguratorProps {
  config: ProjectConfiguration;
  onConfigChange: (newConfig: Partial<ProjectConfiguration>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasBoilerplate: boolean;
}

const SelectGroup: React.FC<{
  label: string;
  id: string; 
  value: string;
  options: FrameworkOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
}> = ({ label, id, value, options, onChange, icon }) => (
  <div className="mb-4">
    <label htmlFor={id} className="flex items-center text-xs font-medium text-gh_light_text_secondary dark:text-gh_dark_text_secondary mb-1">
      {icon}
      <span className="ml-1.5">{label}</span>
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="form-select gh-input-base input-animate rounded-lg border border-gh_light_border dark:border-gh_dark_border bg-white dark:bg-gh_dark_input_bg text-gh_light_text_primary dark:text-gh_dark_text_primary shadow-sm focus:ring-2 focus:ring-gh_accent_green/70 focus:border-gh_accent_green/70 transition-all duration-200 p-2"
      aria-label={label}
    >
      {options.map(option => (
        <option key={option.id} value={option.id} className="bg-gh_light_card dark:bg-gh_dark_card text-gh_light_text_primary dark:text-gh_dark_text_primary">
          {option.name}
        </option>
      ))}
    </select>
     {options.find(opt => opt.id === value)?.description && (
        <div className="mt-1.5 flex justify-start">
          <Tooltip text={options.find(opt => opt.id === value)?.description || ''} />
        </div>
      )}
  </div>
);


const ProjectConfigurator: React.FC<ProjectConfiguratorProps> = ({ config, onConfigChange, onSubmit, isLoading, hasBoilerplate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    onConfigChange({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="gh-card p-5 md:p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gh_light_text_primary dark:text-gh_dark_text_primary mb-5 flex items-center border-b border-gh_light_border dark:border-gh_dark_border pb-3">
        <SlidersHorizontal size={18} className="mr-2 text-gh_light_icon dark:text-gh_dark_icon" /> Configurações do Projeto
      </h2>
      
      <div className="mb-4">
        <label htmlFor="projectName" className="block text-xs font-medium text-gh_light_text_secondary dark:text-gh_dark_text_secondary mb-1">
          Nome do Projeto
        </label>
        <input
          type="text"
          name="projectName"
          id="projectName"
          value={config.projectName}
          onChange={handleChange}
          className="form-input gh-input-base input-animate rounded-lg border border-gh_light_border dark:border-gh_dark_border bg-white dark:bg-gh_dark_input_bg text-gh_light_text_primary dark:text-gh_dark_text_primary shadow-sm focus:ring-2 focus:ring-gh_accent_green/70 focus:border-gh_accent_green/70 transition-all duration-200 p-2 w-full"
          placeholder="ex: meu-app-incrivel"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <SelectGroup
          label="Framework Frontend"
          id="frontendFramework"
          value={config.frontendFramework}
          options={FRONTEND_FRAMEWORKS}
          onChange={handleChange}
          icon={<Palette size={14} className="text-gh_light_icon dark:text-gh_dark_icon" />}
        />

        <SelectGroup
          label="Framework Backend"
          id="backendFramework"
          value={config.backendFramework}
          options={BACKEND_FRAMEWORKS}
          onChange={handleChange}
          icon={<Cpu size={14} className="text-gh_light_icon dark:text-gh_dark_icon" />}
        />
        
        <SelectGroup
          label="Banco de Dados"
          id="database"
          value={config.database}
          options={DATABASES}
          onChange={handleChange}
          icon={<Database size={14} className="text-gh_light_icon dark:text-gh_dark_icon" />}
        />

        <SelectGroup
          label="Tipo de Modelagem"
          id="dataModeling"
          value={config.dataModeling}
          options={DATA_MODELING_OPTIONS}
          onChange={handleChange}
          icon={<FileJson size={14} className="text-gh_light_icon dark:text-gh_dark_icon" />}
        />

        <SelectGroup
          label="Biblioteca de Estilização"
          id="stylingLibrary"
          value={config.stylingLibrary || ''}
          options={STYLING_LIBRARIES}
          onChange={handleChange}
          icon={<Feather size={14} className="text-gh_light_icon dark:text-gh_dark_icon" />}
        />
      </div>

      <div className="mt-3 mb-5">
        <label htmlFor="dockerize" className="flex items-center cursor-pointer group">
          <input
            id="dockerize"
            name="dockerize"
            type="checkbox"
            checked={config.dockerize}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-gh_accent_green border-gh_light_border dark:border-gh_dark_border focus:ring-gh_accent_green/70 focus:ring-offset-0 transition duration-200 ease-in-out"
          />
          <span className="ml-2 text-sm text-gh_light_text_primary dark:text-gh_dark_text_primary group-hover:text-gh_accent_green transition">
            Incluir configuração Docker?
          </span>
          <Package size={14} className="ml-1.5 text-gh_light_icon dark:text-gh_dark_icon group-hover:text-gh_accent_green transition" />
        </label>
      </div>

      <div className="mt-auto pt-4"> {/* Pushes button to bottom */}
        {isLoading || hasBoilerplate ? (
          <div className="w-full flex flex-col items-center justify-center text-center p-4 rounded-lg bg-gh_light_input_bg dark:bg-gh_dark_input_bg border border-gh_light_border dark:border-gh_dark_border mt-2 animate-fade-in">
            <span className="text-base font-semibold text-gh_accent_green mb-1">Obrigado por usar o Full-Stack Launchpad AI Pro!</span>
            <span className="text-sm text-gh_light_text_secondary dark:text-gh_dark_text_secondary mb-2">Este projeto é <strong>open source</strong> e você pode contribuir ou acompanhar novidades no GitHub.</span>
            <a
              href="https://github.com/TucanoWeb/fullstack-launchpad.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 px-4 py-2 rounded-md bg-gh_accent_blue text-white font-medium shadow-sm hover:bg-gh_accent_blue-hover transition-colors text-sm"
            >
              ⭐ Conheça e contribua no GitHub
            </a>
          </div>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="btn btn-primary w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-200 hover:bg-gh_accent_green/90 disabled:opacity-50 disabled:cursor-not-allowed group relative focus:outline-none focus:ring-2 focus:ring-gh_accent_green/70 focus:ring-offset-2 rounded-lg shadow-sm border border-transparent bg-gh_accent_green hover:bg-gh_accent_green/90"
            aria-label="Gerar boilerplate com Inteligência Artificial"
            style={{ letterSpacing: '0.01em' }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/30 via-transparent to-white/10 pointer-events-none" style={{filter:'blur(2px)'}}></span>
            <span className="relative flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                <>
                  <Code2 size={18} className="mr-2 drop-shadow-sm" />
                  Gerar Boilerplate com IA
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectConfigurator;