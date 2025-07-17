import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  return (
    <div className="flex items-center space-x-3 bg-blue-600 bg-opacity-30 backdrop-blur-sm rounded-2xl p-2 border border-blue-400 border-opacity-30">
      <Globe className="w-5 h-5 text-blue-300" />
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          currentLanguage === 'en'
            ? 'bg-white text-blue-900 shadow-xl transform scale-105'
            : 'text-blue-200 hover:text-white hover:bg-blue-600 hover:bg-opacity-50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('fr')}
        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          currentLanguage === 'fr'
            ? 'bg-white text-blue-900 shadow-xl transform scale-105'
            : 'text-blue-200 hover:text-white hover:bg-blue-600 hover:bg-opacity-50'
        }`}
      >
        FR
      </button>
    </div>
  );
};