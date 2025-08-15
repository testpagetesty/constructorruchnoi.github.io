export const exportCookieConsentData = () => {
  const consentData = localStorage.getItem('cookieConsent');
  if (!consentData) return null;

  const data = {
    consent: JSON.parse(consentData),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  return {
    url,
    filename: 'cookie-consent-data.json',
    data
  };
}; 