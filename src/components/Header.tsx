import React from 'react';
import { TrendingUp, Globe, LogOut, User } from 'lucide-react';
import { Language, MerchantData } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  merchant?: MerchantData | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, merchant, onLogout }) => {
  return (
    <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600 bg-opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 bg-opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-blue-400 bg-opacity-15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-blue-600 bg-opacity-20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 bg-opacity-30 p-4 rounded-2xl backdrop-blur-sm border border-blue-400 border-opacity-30">
              <TrendingUp className="w-10 h-10 text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Storeino
              </h1>
              <p className="text-blue-300 text-sm font-medium">YOUR COMPANION TOWARDS LEADERSHIP</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {merchant && (
              <div className="flex items-center space-x-3 bg-blue-600 bg-opacity-30 backdrop-blur-sm rounded-2xl p-3 border border-blue-400 border-opacity-30">
                <User className="w-5 h-5 text-blue-300" />
                <span className="text-blue-200 font-medium">{merchant.name}</span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-blue-200 hover:text-white hover:bg-blue-600 hover:bg-opacity-50 p-2 rounded-lg transition-all duration-300"
                    title={language === 'en' ? 'Logout' : 'Déconnexion'}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-3 bg-blue-600 bg-opacity-30 backdrop-blur-sm rounded-2xl p-2 border border-blue-400 border-opacity-30">
              <Globe className="w-5 h-5 text-blue-300" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-blue-900 shadow-xl transform scale-105'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600 hover:bg-opacity-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  language === 'fr'
                    ? 'bg-white text-blue-900 shadow-xl transform scale-105'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600 hover:bg-opacity-50'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center relative z-10">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4">
            {language === 'en' ? 'E-commerce Revenue Simulator' : 'Simulateur de Revenus E-commerce'}
          </h2>
          <p className="text-2xl text-blue-200 font-light mb-8">
            {language === 'en' ? 'Calculate Your Business Potential' : 'Calculez Votre Potentiel Business'}
          </p>
          <div className="bg-blue-600 bg-opacity-20 backdrop-blur-sm rounded-full px-8 py-3 border border-blue-400 border-opacity-30 inline-block">
            <p className="text-blue-200 font-medium">
              {language === 'en' 
                ? '💡 Optimize your e-commerce strategy with data-driven insights' 
                : '💡 Optimisez votre stratégie e-commerce avec des insights data-driven'
              }
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};