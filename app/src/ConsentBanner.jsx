import React, { useState } from 'react';
import { Cookie, Shield, X } from 'lucide-react';

/**
 * Cookie Consent Banner Component for GDPR/Swiss Data Protection Compliance
 * Implements Google Consent Mode V2 for Switzerland audience
 */
const ConsentBanner = () => {
  // Initialize state by checking localStorage directly
  const [showBanner, setShowBanner] = useState(() => {
    const consentChoice = localStorage.getItem('cookie-consent');
    return !consentChoice;
  });
  const [showDetails, setShowDetails] = useState(false);

  const handleAcceptAll = () => {
    // Grant all consents
    updateConsent({
      analytics_storage: 'granted',
      ad_storage: 'denied', // We don't use ads
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted'
    });
    
    localStorage.setItem('cookie-consent', JSON.stringify({
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    // Deny analytics but allow necessary cookies
    updateConsent({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });
    
    localStorage.setItem('cookie-consent', JSON.stringify({
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    
    setShowBanner(false);
  };

  const handleSavePreferences = (analytics) => {
    if (analytics) {
      handleAcceptAll();
    } else {
      handleRejectAll();
    }
    setShowDetails(false);
  };

  const updateConsent = (consentSettings) => {
    if (window.gtag) {
      window.gtag('consent', 'update', consentSettings);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-4xl mx-4 mb-4 animate-slide-up">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden">
          {/* Main Banner */}
          {!showDetails ? (
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Wir respektieren Ihre Privatsphäre
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und anonymisierte 
                    Nutzungsstatistiken zu erfassen. Alle Daten werden gemäss Schweizer 
                    Datenschutzgesetz und DSGVO verarbeitet. Ihre IP-Adresse wird anonymisiert.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Alle akzeptieren
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                    >
                      Nur notwendige
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                    >
                      Einstellungen anpassen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Detailed Settings */
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Cookie-Einstellungen
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                {/* Necessary Cookies */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">Notwendige Cookies</h4>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                      Immer aktiv
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich, 
                    wie z.B. das Speichern Ihres Lernfortschritts und Ihrer Spracheinstellungen.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">Analyse-Cookies</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="analytics-toggle"
                        defaultChecked={false}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-slate-600">
                    Diese Cookies helfen uns zu verstehen, wie Sie unsere App nutzen, damit wir sie 
                    verbessern können. Alle Daten werden anonymisiert (IP-Anonymisierung) und gemäss 
                    Schweizer Datenschutzgesetz verarbeitet.
                  </p>
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded">
                    <strong>Verwendete Dienste:</strong> Google Analytics 4 (mit IP-Anonymisierung)
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const analyticsEnabled = document.getElementById('analytics-toggle').checked;
                    handleSavePreferences(analyticsEnabled);
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Einstellungen speichern
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConsentBanner;
