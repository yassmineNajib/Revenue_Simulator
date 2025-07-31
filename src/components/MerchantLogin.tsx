import React, { useState } from 'react';
import { LogIn, Store, Key, Shield, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface MerchantLoginProps {
  language: Language;
  onLogin: (clientId: string, clientSecret: string) => void;
  loading: boolean;
  error: string | null;
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({
  language,
  onLogin,
  loading,
  error
}) => {
  // Demo credentials that work
  const [clientId, setClientId] = useState('demo_client_id_12345');
  const [clientSecret, setClientSecret] = useState('demo_secret_abcdef67890');

  // Auto-login with demo credentials on mount
  React.useEffect(() => {
    if (!loading && clientId && clientSecret) {
      // Small delay to show the form briefly
      const timer = setTimeout(() => {
        onLogin(clientId, clientSecret);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onLogin, loading, clientId, clientSecret]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId && clientSecret) {
      onLogin(clientId, clientSecret);
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
                ? 'Connecting to your store data...' 
                : 'Connexion à vos données de magasin...'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="text-red-700 text-sm">
                <p className="font-medium mb-2">
                  {language === 'en' ? 'Connection Issue:' : 'Problème de Connexion:'}
                </p>
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
                  <span>{language === 'en' ? 'Connecting...' : 'Connexion...'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>{language === 'en' ? 'Connect to Store' : 'Se Connecter'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-700 text-sm font-medium mb-2">
              {language === 'en' ? '✅ Demo Mode Active' : '✅ Mode Démo Actif'}
            </p>
            <p className="text-green-600 text-xs">
              {language === 'en' 
                ? 'Using demo credentials for testing. Auto-connecting...' 
                : 'Utilisation des identifiants de démonstration. Connexion automatique...'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};