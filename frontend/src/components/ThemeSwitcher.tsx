import React from 'react';
import { Theme } from '../types';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const themes: { name: Theme; icon: React.ReactNode }[] = [
    { name: 'light', icon: <Sun size={16} /> },
    { name: 'dark', icon: <Moon size={16} /> },
    { name: 'system', icon: <Laptop size={16} /> },
  ];

  return (
    <div className="flex items-center space-x-1 p-0.5 bg-gh_light_input_bg dark:bg-gh_dark_input_bg rounded-md border border-gh_light_border dark:border-gh_dark_border">
      {themes.map(theme => (
        <button
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          className={`p-1.5 rounded-[5px] transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-gh_accent_blue/70 
            ${currentTheme === theme.name 
              ? 'bg-gh_light_card dark:bg-gh_btn_secondary_bg_dark text-gh_light_text_primary dark:text-gh_dark_text_primary shadow-sm border border-gh_light_border dark:border-gh_dark_border' 
              : 'text-gh_light_icon dark:text-gh_dark_icon hover:text-gh_light_text_primary dark:hover:text-gh_dark_text_primary'
            }`}
          aria-label={`Mudar para tema ${theme.name}`}
          title={`Tema ${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}`}
        >
          {theme.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;