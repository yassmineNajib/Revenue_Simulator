import React, { useState } from 'react';
import { LogIn, Store, Key, Shield, Loader2, Globe } from 'lucide-react';
import { Language } from '../types';

interface MerchantLoginProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogin: (clientId: string, clientSecret: string) => void;
  loading: boolean;
  error: string | null;
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({
  language,
  onLanguageChange,
  onLogin,
  loading,
  error
}) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId && clientSecret) {
      onLogin(clientId, clientSecret);
    }
  };

  const translations = {
    en: {
      title: 'API Authentication',
      subtitle: 'Connect to your Storeino account',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      clientIdPlaceholder: 'Enter your client ID',
      clientSecretPlaceholder: 'Enter your client secret',
      connectButton: 'Connect to Store',
      connecting: 'Connecting...',
      connectionIssue: 'Connection Issue:',
      getCredentials: 'Get your API credentials from the',
      developerPortal: 'Storeino Developer Portal',
      secureConnection: 'Secure connection to Storeino API'
    },
    fr: {
      title: 'Authentification API',
      subtitle: 'Connectez-vous à votre compte Storeino',
      clientId: 'ID Client',
      clientSecret: 'Secret Client',
      clientIdPlaceholder: 'Entrez votre ID client',
      clientSecretPlaceholder: 'Entrez votre secret client',
      connectButton: 'Se Connecter',
      connecting: 'Connexion...',
      connectionIssue: 'Problème de Connexion:',
      getCredentials: 'Obtenez vos identifiants API depuis le',
      developerPortal: 'Portail Développeur Storeino',
      secureConnection: 'Connexion sécurisée à l\'API Storeino'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-stone-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-stone-200 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
        
        <div className="relative z-10">
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center space-x-2 bg-stone-100 rounded-xl p-1">
              <Globe className="w-4 h-4 text-stone-600 ml-2" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  language === 'fr'
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                FR
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-3 rounded-xl shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                Storeino
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              {t.title}
            </h2>
            <p className="text-stone-600">
              {t.subtitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="text-red-700 text-sm">
                <p className="font-medium mb-2">
                  {t.connectionIssue}
                </p>
                <div className="text-xs break-words space-y-2">
                  <p>{error}</p>
                  {error.includes('backend server') && (
                    <div className="bg-red-100 p-2 rounded border-l-4 border-red-400">
                      <p className="font-medium">💡 Quick Fix:</p>
                      <p>1. Make sure the backend server is running</p>
                      <p>2. Check if port 8080 is accessible</p>
                      <p>3. Verify your Storeino API credentials</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                {t.clientId}
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder={t.clientIdPlaceholder}
                  className="w-full pl-12 pr-4 py-4 border-2 border-stone-300 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-300 bg-stone-50 hover:bg-white text-stone-800 placeholder-stone-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                {t.clientSecret}
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder={t.clientSecretPlaceholder}
                  className="w-full pl-12 pr-4 py-4 border-2 border-stone-300 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-300 bg-stone-50 hover:bg-white text-stone-800 placeholder-stone-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !clientId || !clientSecret}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{t.connecting}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>{t.connectButton}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-stone-700 text-sm font-medium mb-2">
              💡 {t.getCredentials} <a href="https://developer.storeino.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 font-semibold">{t.developerPortal}</a>
            </p>
            <p className="text-stone-600 text-xs flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              {t.secureConnection}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};