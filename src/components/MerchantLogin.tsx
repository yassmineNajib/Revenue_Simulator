import React, { useState } from 'react';
import { LogIn, Store, Key, Shield, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface MerchantLoginProps {
  language: Language;
  onLogin: (clientId: string, clientSecret: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({
  language,
  onLogin,
  loading,
  error
}) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId && clientSecret) {
      await onLogin(clientId, clientSecret);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Storeino
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {language === 'en' ? 'API Authentication' : 'Authentification API'}
            </h2>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Enter your API credentials to access store data' 
                : 'Entrez vos identifiants API pour accéder aux données'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="text-red-700 text-sm">
                <p className="font-medium mb-2">Login Error:</p>
                <p className="text-xs break-words">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {language === 'en' ? 'Client ID' : 'ID Client'}
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder={language === 'en' ? 'your-client-id' : 'votre-id-client'}
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-slate-50 hover:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {language === 'en' ? 'Client Secret' : 'Secret Client'}
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder={language === 'en' ? 'your-client-secret' : 'votre-secret-client'}
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-slate-50 hover:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !clientId || !clientSecret}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{language === 'en' ? 'Authenticating...' : 'Authentification...'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>{language === 'en' ? 'Authenticate' : 'S\'Authentifier'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-700 text-sm font-medium mb-2">
              {language === 'en' ? '🔐 API Credentials:' : '🔐 Identifiants API:'}
            </p>
            <p className="text-blue-600 text-xs">
              {language === 'en' 
                ? 'Use your Storeino API Client ID and Client Secret' 
                : 'Utilisez votre ID Client et Secret Client de l\'API Storeino'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};