import React from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="group relative flex items-center">
      <Info size={14} className="text-gh_light_icon dark:text-gh_dark_icon cursor-help group-hover:text-gh_accent_blue transition-colors" />
      <span 
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[280px] p-2
                   text-xs text-gh_dark_text_primary bg-slate-800 dark:bg-slate-700 
                   rounded-md shadow-lg 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20
                   pointer-events-none"
        role="tooltip"
      >
        {text}
        {/* Simple triangle for GitHub-like tooltip arrow */}
        <span className="absolute left-1/2 -translate-x-1/2 top-full -mt-[1px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-slate-800 dark:border-t-slate-700"></span>
      </span>
    </div>
  );
};

export default Tooltip;