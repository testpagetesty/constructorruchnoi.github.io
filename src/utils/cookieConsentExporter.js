// Cookie Consent HTML Generator
export const generateCookieConsentHTML = (language = 'en') => {
  const getTexts = () => {
    const texts = {
      en: {
        title: "Cookie Preferences",
        description: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.",
        acceptAll: "Accept All",
        rejectAll: "Reject All",
        customize: "Customize",
        savePreferences: "Save Preferences",
        necessary: "Necessary Cookies",
        necessaryDesc: "These cookies are essential for the website to function properly. They cannot be disabled.",
        analytics: "Analytics Cookies",
        analyticsDesc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
        marketing: "Marketing Cookies",
        marketingDesc: "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
        preferences: "Preference Cookies",
        preferencesDesc: "These cookies remember your choices and preferences to provide a more personalized experience.",
        privacyPolicy: "Privacy Policy",
        cookiePolicy: "Cookie Policy"
      },
      ru: {
        title: "Настройки файлов cookie",
        description: "Мы используем файлы cookie для улучшения вашего опыта просмотра, предоставления персонализированного контента и анализа нашего трафика. Нажимая 'Принять все', вы соглашаетесь с использованием файлов cookie.",
        acceptAll: "Принять все",
        rejectAll: "Отклонить все",
        customize: "Настроить",
        savePreferences: "Сохранить настройки",
        necessary: "Необходимые файлы cookie",
        necessaryDesc: "Эти файлы cookie необходимы для правильной работы веб-сайта. Их нельзя отключить.",
        analytics: "Аналитические файлы cookie",
        analyticsDesc: "Эти файлы cookie помогают нам понять, как посетители взаимодействуют с нашим веб-сайтом, собирая и сообщая информацию анонимно.",
        marketing: "Маркетинговые файлы cookie",
        marketingDesc: "Эти файлы cookie используются для отслеживания посетителей на веб-сайтах для отображения релевантной и привлекательной рекламы.",
        preferences: "Файлы cookie предпочтений",
        preferencesDesc: "Эти файлы cookie запоминают ваш выбор и предпочтения для обеспечения более персонализированного опыта.",
        privacyPolicy: "Политика конфиденциальности",
        cookiePolicy: "Политика файлов cookie"
      }
    };
    
    return texts[language] || texts.en;
  };

  const texts = getTexts();

  return `
<!-- Cookie Consent Modal -->
<div id="cookie-consent-modal" style="
  position: fixed;
  bottom: 20px;
  left: 20px;
  max-width: 400px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 10000;
  display: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: slideInLeft 0.5s ease-out;
  overflow: hidden;
">
  <div style="padding: 16px;">
    <h3 style="
      margin: 0 0 8px 0;
      font-size: 15px;
      font-weight: 600;
      color: #1976d2;
      line-height: 1.3;
    ">${texts.title}</h3>
    
    <p style="
      margin: 0 0 12px 0;
      font-size: 12px;
      line-height: 1.4;
      color: #495057;
    ">${texts.description}</p>
    
    <div style="
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 12px;
    ">
      <a href="privacy-policy.html" target="_blank" style="
        color: #1976d2;
        text-decoration: none;
        font-size: 11px;
        font-weight: 500;
      " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
        ${texts.privacyPolicy}
      </a>
      <span style="color: #6c757d; font-size: 11px;">•</span>
      <a href="cookie-policy.html" target="_blank" style="
        color: #1976d2;
        text-decoration: none;
        font-size: 11px;
        font-weight: 500;
      " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
        ${texts.cookiePolicy}
      </a>
    </div>
    
    <!-- Buttons -->
    <div style="
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    ">
      <button id="cookie-reject-all" style="
        background: transparent;
        color: #6c757d;
        border: 1px solid #6c757d;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 70px;
      " onmouseover="
        this.style.backgroundColor='#6c757d';
        this.style.color='white';
        this.style.transform='translateY(-1px)';
      " onmouseout="
        this.style.backgroundColor='transparent';
        this.style.color='#6c757d';
        this.style.transform='translateY(0)';
      ">
        ${texts.rejectAll}
      </button>
      
      <button id="cookie-customize" style="
        background: transparent;
        color: #1976d2;
        border: 1px solid #1976d2;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 70px;
      " onmouseover="
        this.style.backgroundColor='#1976d2';
        this.style.color='white';
        this.style.transform='translateY(-1px)';
      " onmouseout="
        this.style.backgroundColor='transparent';
        this.style.color='#1976d2';
        this.style.transform='translateY(0)';
      ">
        ${texts.customize}
      </button>
      
      <button id="cookie-accept-all" style="
        background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 70px;
        box-shadow: 0 2px 6px rgba(25, 118, 210, 0.3);
      " onmouseover="
        this.style.transform='translateY(-1px)';
        this.style.boxShadow='0 3px 10px rgba(25, 118, 210, 0.4)';
        this.style.background='linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)';
      " onmouseout="
        this.style.transform='translateY(0)';
        this.style.boxShadow='0 2px 6px rgba(25, 118, 210, 0.3)';
        this.style.background='linear-gradient(135deg, #1976d2 0%, #1565c0 100%)';
      ">
        ${texts.acceptAll}
      </button>
    </div>
  </div>
</div>

<!-- Cookie Settings Modal -->
<div id="cookie-settings-modal" style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
  z-index: 10001;
  display: none;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
">
  <div style="
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 70vh;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.2);
  ">
    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    ">
      <div style="display: flex; align-items: center; gap: 10px;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">${texts.title}</h2>
      </div>
      <button id="cookie-settings-close" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.3)'" onmouseout="this.style.backgroundColor='rgba(255,255,255,0.2)'">
        ×
      </button>
    </div>
    
    <!-- Content -->
    <div style="padding: 24px; max-height: 60vh; overflow-y: auto;">
      <p style="
        margin: 0 0 24px 0;
        font-size: 14px;
        line-height: 1.6;
        color: #495057;
      ">${texts.description}</p>
      
      <!-- Cookie Categories -->
      <div style="margin-bottom: 24px;">
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          margin-bottom: 16px;
        ">
          <input type="checkbox" id="cookie-necessary" checked disabled style="
            width: 18px;
            height: 18px;
            margin: 0;
            cursor: not-allowed;
          ">
          <div style="flex: 1;">
            <label for="cookie-necessary" style="
              display: block;
              font-weight: 600;
              font-size: 16px;
              color: #212529;
              margin-bottom: 4px;
              cursor: not-allowed;
            ">${texts.necessary}</label>
            <p style="
              margin: 0;
              font-size: 13px;
              color: #6c757d;
              line-height: 1.4;
            ">${texts.necessaryDesc}</p>
          </div>
        </div>
        
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          margin-bottom: 16px;
        ">
          <input type="checkbox" id="cookie-analytics" style="
            width: 18px;
            height: 18px;
            margin: 0;
            cursor: pointer;
          ">
          <div style="flex: 1;">
            <label for="cookie-analytics" style="
              display: block;
              font-weight: 600;
              font-size: 16px;
              color: #212529;
              margin-bottom: 4px;
              cursor: pointer;
            ">${texts.analytics}</label>
            <p style="
              margin: 0;
              font-size: 13px;
              color: #6c757d;
              line-height: 1.4;
            ">${texts.analyticsDesc}</p>
          </div>
        </div>
        
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          margin-bottom: 16px;
        ">
          <input type="checkbox" id="cookie-marketing" style="
            width: 18px;
            height: 18px;
            margin: 0;
            cursor: pointer;
          ">
          <div style="flex: 1;">
            <label for="cookie-marketing" style="
              display: block;
              font-weight: 600;
              font-size: 16px;
              color: #212529;
              margin-bottom: 4px;
              cursor: pointer;
            ">${texts.marketing}</label>
            <p style="
              margin: 0;
              font-size: 13px;
              color: #6c757d;
              line-height: 1.4;
            ">${texts.marketingDesc}</p>
          </div>
        </div>
        
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 12px;
        ">
          <input type="checkbox" id="cookie-preferences" style="
            width: 18px;
            height: 18px;
            margin: 0;
            cursor: pointer;
          ">
          <div style="flex: 1;">
            <label for="cookie-preferences" style="
              display: block;
              font-weight: 600;
              font-size: 16px;
              color: #212529;
              margin-bottom: 4px;
              cursor: pointer;
            ">${texts.preferences}</label>
            <p style="
              margin: 0;
              font-size: 13px;
              color: #6c757d;
              line-height: 1.4;
            ">${texts.preferencesDesc}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="
      background: #f8f9fa;
      padding: 20px 24px;
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    ">
      <button id="cookie-save-preferences" style="
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      " onmouseover="
        this.style.transform='translateY(-2px)';
        this.style.boxShadow='0 6px 20px rgba(40, 167, 69, 0.4)';
        this.style.background='linear-gradient(135deg, #218838 0%, #1ea085 100%)';
      " onmouseout="
        this.style.transform='translateY(0)';
        this.style.boxShadow='0 4px 12px rgba(40, 167, 69, 0.3)';
        this.style.background='linear-gradient(135deg, #28a745 0%, #20c997 100%)';
      ">
        ${texts.savePreferences}
      </button>
    </div>
  </div>
</div>

<style>
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  #cookie-consent-modal {
    left: 10px !important;
    bottom: 10px !important;
    max-width: calc(100vw - 20px) !important;
  }
  
  #cookie-consent-modal > div {
    padding: 14px !important;
  }
  
  #cookie-consent-modal button {
    flex: 1 !important;
    min-width: auto !important;
  }
  
  #cookie-settings-modal > div {
    width: 95% !important;
    margin: 20px !important;
  }
}

@media (max-width: 480px) {
  #cookie-consent-modal {
    left: 8px !important;
    bottom: 8px !important;
    max-width: calc(100vw - 16px) !important;
  }
  
  #cookie-consent-modal h3 {
    font-size: 14px !important;
  }
  
  #cookie-consent-modal p {
    font-size: 11px !important;
  }
  
  #cookie-consent-modal button {
    padding: 5px 10px !important;
    font-size: 11px !important;
  }
  
  #cookie-consent-modal > div {
    padding: 12px !important;
  }
}
</style>

<script>
// Cookie Consent Logic
(function() {
  // Check if already consented
  function isAlreadyConsented() {
    const consent = localStorage.getItem('cookieConsent');
    const consentDate = localStorage.getItem('cookieConsentDate');
    
    if (consent && consentDate) {
      const date = new Date(consentDate);
      const now = new Date();
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
      
      // Consent is valid for 365 days
      return daysDiff < 365;
    }
    
    return false;
  }

  // Show cookie consent if not already consented
  if (!isAlreadyConsented()) {
    document.getElementById('cookie-consent-modal').style.display = 'block';
  }

  // Event listeners
  document.getElementById('cookie-accept-all').addEventListener('click', function() {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    document.getElementById('cookie-consent-modal').style.display = 'none';
  });

  document.getElementById('cookie-reject-all').addEventListener('click', function() {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    document.getElementById('cookie-consent-modal').style.display = 'none';
  });

  document.getElementById('cookie-customize').addEventListener('click', function() {
    document.getElementById('cookie-settings-modal').style.display = 'flex';
  });

  document.getElementById('cookie-settings-close').addEventListener('click', function() {
    document.getElementById('cookie-settings-modal').style.display = 'none';
  });

  document.getElementById('cookie-save-preferences').addEventListener('click', function() {
    const preferences = {
      necessary: true, // Always true
      analytics: document.getElementById('cookie-analytics').checked,
      marketing: document.getElementById('cookie-marketing').checked,
      preferences: document.getElementById('cookie-preferences').checked
    };
    
    localStorage.setItem('cookieConsent', 'customized');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    document.getElementById('cookie-settings-modal').style.display = 'none';
    document.getElementById('cookie-consent-modal').style.display = 'none';
  });

  // Close settings modal when clicking outside
  document.getElementById('cookie-settings-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });
})();
</script>
`;
}; 