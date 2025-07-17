import React from 'react';
import { FileText, Mail, Share2 } from 'lucide-react';
import { Language, SimulationResults, SimulationInputs } from '../types';
import { translations } from '../data/translations';
import { exportRevenueToPDF } from '../utils/pdfExport';

interface ActionButtonsProps {
  language: Language;
  results: SimulationResults;
  inputs: SimulationInputs;
  onEmailResults: () => void;
  onShareResults: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  language,
  results,
  inputs,
  onEmailResults,
  onShareResults
}) => {
  const t = translations[language];

  const handleExportPdf = async () => {
    try {
      const success = await exportRevenueToPDF(results, inputs, language);
      if (success) {
        const message = language === 'en' 
          ? 'PDF report exported successfully!' 
          : 'Rapport PDF exporté avec succès!';
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      const errorMessage = language === 'en' 
        ? 'Error generating PDF. Please try again.' 
        : 'Erreur lors de la génération du PDF. Veuillez réessayer.';
      alert(errorMessage);
    }
  };

  const actions = [
    {
      label: language === 'en' ? 'Export PDF Report' : 'Exporter Rapport PDF',
      icon: FileText,
      onClick: handleExportPdf,
      color: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl hover:shadow-blue-200'
    },
    {
      label: language === 'en' ? 'Email Results' : 'Envoyer par Email',
      icon: Mail,
      onClick: onEmailResults,
      color: 'bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white shadow-xl hover:shadow-slate-200'
    },
    {
      label: language === 'en' ? 'Share Analysis' : 'Partager l\'Analyse',
      icon: Share2,
      onClick: onShareResults,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-indigo-200'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-200">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-3">
          {language === 'en' ? 'Export & Share' : 'Exporter & Partager'}
        </h3>
        <p className="text-slate-600 text-lg">
          {language === 'en' ? 'Save or share your revenue analysis' : 'Sauvegardez ou partagez votre analyse de revenus'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 border border-opacity-30`}
          >
            <action.icon className="w-7 h-7" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};