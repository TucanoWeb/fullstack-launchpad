export interface ProjectConfiguration {
  projectName: string;
  frontendFramework: string;
  backendFramework: string;
  database: string;
  dataModeling: string;
  dockerize: boolean;
  stylingLibrary?: string; 
}

export interface FrameworkOption {
  id: string;
  name: string;
  description?: string; 
}

export type Theme = 'light' | 'dark' | 'system';
