import React, { useState } from 'react';
import { MerchantLogin } from './components/MerchantLogin';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { RevenueChart } from './components/RevenueChart';
import { ActionButtons } from './components/ActionButtons';
import { useAuth } from './hooks/useAuth';
import { SimulationInputs, SimulationResults, Language } from './types';
import { calculateRevenue } from './utils/calculations';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const { isAuthenticated, merchant, loading, error, login, logout } = useAuth();
  const [inputs, setInputs] = useState<SimulationInputs>({
    monthlyVisitors: 0,
    conversionRate: 0,
    averageCartValue: 0,
    storeinoFees: 0,
    otherCosts: 0
  });
  const [results, setResults] = useState<SimulationResults | null>(null);

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <MerchantLogin
        language={language}
        onLogin={login}
        loading={loading}
        error={error}
      />
    );
  }

  const handleInputChange = (field: keyof SimulationInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    const calculatedResults = calculateRevenue(inputs);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setInputs({
      monthlyVisitors: 0,
      conversionRate: 0,
      averageCartValue: 0,
      storeinoFees: 0,
      otherCosts: 0
    });
    setResults(null);
  };

  const handleEmailResults = () => {
    const subject = language === 'en' 
      ? 'E-commerce Revenue Analysis Results' 
      : 'Résultats d\'Analyse de Revenus E-commerce';
    const body = results 
      ? `Revenue Analysis Results:\nGross Revenue: ${results.grossRevenue.toLocaleString()} MAD\nNet Revenue: ${results.netRevenue.toLocaleString()} MAD\nProfit Margin: ${results.profitMargin.toFixed(1)}%`
      : '';
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleShareResults = () => {
    if (navigator.share && results) {
      navigator.share({
        title: language === 'en' ? 'Revenue Analysis Results' : 'Résultats Analyse Revenus',
        text: `Net Revenue: ${results.netRevenue.toLocaleString()} MAD, Profit Margin: ${results.profitMargin.toFixed(1)}%`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'en' ? 'Link copied to clipboard!' : 'Lien copié dans le presse-papiers!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header 
        language={language} 
        onLanguageChange={setLanguage}
        merchant={merchant}
        onLogout={logout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <InputForm
          inputs={inputs}
          onInputChange={handleInputChange}
          onCalculate={handleCalculate}
          onReset={handleReset}
          language={language}
        />
        
        {results && (
          <>
            <ResultsDisplay results={results} language={language} />
            <RevenueChart results={results} language={language} />
            <ActionButtons
              language={language}
              results={results}
              inputs={inputs}
              onEmailResults={handleEmailResults}
              onShareResults={handleShareResults}
            />
          </>
        )}
      </main>
      
      <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h4 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Storeino
            </h4>
            <p className="text-blue-300 text-sm font-medium mt-2">YOUR COMPANION TOWARDS LEADERSHIP</p>
          </div>
          <p className="text-blue-200 mb-3 text-lg">
            © 2024 Storeino. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
          </p>
          <p className="text-blue-300">
            {language === 'en' 
              ? 'Optimize your e-commerce strategy with data-driven insights.' 
              : 'Optimisez votre stratégie e-commerce avec des insights data-driven.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;