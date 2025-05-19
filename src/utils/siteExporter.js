import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportCookieConsentData } from './cookieConsentExporter';
import { cleanHTML, cleanCSS, cleanJavaScript } from './codeCleanup';

// Function to remove all comments from code
const removeComments = (code) => {
  if (!code) return code;
  return code
    // Remove single-line comments
    .replace(/\/\/.*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove empty lines
    .replace(/^\s*[\r\n]/gm, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

export const exportSite = async (siteData) => {
  const zip = new JSZip();
  
  // Add site files with cleaned code
  zip.file('index.html', cleanHTML(generateIndexHtml(siteData)));
  zip.file('styles.css', cleanCSS(generateStyles()));
  zip.file('app.js', cleanJavaScript(generateAppJs(siteData)));
  
  // Add merci.html to root
  const merciHtml = await fetch('/merci.html').then(res => res.text());
  zip.file('merci.html', cleanHTML(merciHtml));
  
  // Add cookie consent data
  const cookieData = exportCookieConsentData();
  if (cookieData) {
    zip.file('cookie-consent-data.json', JSON.stringify(cookieData.data, null, 2));
  }
  
  // Add other necessary files
  zip.file('privacy-policy.html', cleanHTML(generatePrivacyPolicy(siteData)));
  zip.file('cookie-policy.html', cleanHTML(generateCookiePolicy(siteData)));
  zip.file('terms-of-service.html', cleanHTML(generateTermsOfService(siteData)));
  
  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'site.zip');
};

const generateIndexHtml = (siteData) => {
  const headerData = siteData.headerData || {};
  return `
    <!DOCTYPE html>
    <html lang="${headerData.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerData.siteName || 'My Site'}</title>
        ${headerData.domain ? `<link rel="canonical" href="https://${headerData.domain}" />` : ''}
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div id="root">
          <header class="site-header">
            <div class="header-content">
              <div class="site-branding">
                <h1 class="site-title">${headerData.siteName || 'My Site'}</h1>
                ${headerData.domain ? `<div class="site-domain" style="color: ${headerData.titleColor || '#000000'}; opacity: 0.8; font-size: 0.9rem; margin-top: 0.25rem;">${headerData.domain}</div>` : ''}
              </div>
              <nav class="site-nav">
                ${(headerData.menuItems || []).map(item => `
                  <a href="${item.url || '#'}" class="nav-link">${item.text || item.title}</a>
                `).join('')}
              </nav>
            </div>
          </header>
          ${generateMainContent(siteData)}
          ${generateFooter(siteData)}
        </div>
        <script src="app.js"></script>
      </body>
    </html>
  `;
};

const generateStyles = () => {
  return `
    /* Reset and base styles */
    * {
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      line-height: 1.6 !important;
      color: #333 !important;
    }

    /* Section styles */
    .section {
      position: relative !important;
      padding: 2rem !important;
      margin: 2rem 0 !important;
      overflow: visible !important;
    }

    .section-content {
      position: relative !important;
      z-index: 2 !important;
    }

    .section-title {
      font-size: 2rem !important;
      font-weight: 600 !important;
      margin-bottom: 1rem !important;
      color: #1a237e !important;
    }

    .section-description {
      font-size: 1.1rem !important;
      color: #455a64 !important;
      margin-bottom: 2rem !important;
    }

    /* Base card styles */
    .card {
      display: flex !important;
      flex-direction: column !important;
      width: 100% !important;
      max-width: 280px !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      height: auto !important;
      position: relative !important;
      z-index: 2 !important;
      transition: all 0.3s ease-in-out !important;
      padding: 1.5rem !important;
    }

    /* Simple Card */
    .card.simple {
      background-color: transparent !important;
      border: 3px solid #e0e0e0 !important;
    }

    .card.simple:hover {
      transform: scale(1.2) !important;
      z-index: 3 !important;
    }

    /* Elevated Card */
    .card.elevated {
      background-color: #ffffff !important;
      border: 3px solid #e0e0e0 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .card.elevated:hover {
      transform: rotate(3deg) scale(1.05) !important;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
      z-index: 3 !important;
    }

    .card.elevated:hover .card-title {
      color: #1976d2 !important;
      transform: translateX(4px) !important;
    }

    .card.elevated:hover .card-text {
      color: #333 !important;
    }

    /* Outlined Card */
    .card.outlined {
      background: linear-gradient(to right, #e8f5e9, #c8e6c9) !important;
      border: 3px solid #e0e0e0 !important;
    }

    .card.outlined:hover {
      transform: skew(-5deg) translateY(-5px) !important;
      border-color: #1976d2 !important;
      z-index: 3 !important;
    }

    .card.outlined:hover .card-title {
      color: #1976d2 !important;
    }

    .card.outlined:hover .card-text {
      color: #333 !important;
    }

    /* Accent Card */
    .card.accent {
      background-color: #ffffff !important;
      border: 3px solid #e0e0e0 !important;
      position: relative !important;
    }

    .card.accent::before {
      content: "" !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      bottom: 0 !important;
      width: 4px !important;
      background: linear-gradient(to bottom, #1976d2, #42a5f5) !important;
      transition: width 0.3s ease-in-out !important;
      z-index: 1 !important;
    }

    .card.accent:hover {
      transform: translateX(10px) translateY(-5px) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      z-index: 3 !important;
    }

    .card.accent:hover::before {
      width: 6px !important;
    }

    .card.accent:hover .card-title {
      color: #1976d2 !important;
    }

    .card.accent:hover .card-text {
      color: #333 !important;
    }

    /* Gradient Card */
    .card.gradient {
      background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%) !important;
      border: 3px solid #e0e0e0 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .card.gradient:hover {
      transform: rotate(-5deg) scale(1.1) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      z-index: 3 !important;
    }

    /* Card content styles */
    .card-content {
      padding: 1.5rem !important;
      flex-grow: 1 !important;
    }

    .card-title {
      color: #1a237e !important;
      margin-bottom: 0.7rem !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      transition: all 0.3s ease-in-out !important;
    }

    .card-text {
      color: #455a64 !important;
      font-size: 1rem !important;
      line-height: 1.6 !important;
      transition: all 0.3s ease-in-out !important;
    }

    /* Cards container */
    .cards-container {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      gap: 2rem !important;
      padding: 2rem !important;
      position: relative !important;
      z-index: 2 !important;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .cards-container {
        grid-template-columns: 1fr !important;
        padding: 1rem !important;
      }
    }

    /* Header styles */
    .site-header {
      background-color: var(--header-bg-color, #ffffff);
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      padding: 1rem 0;
      position: relative;
      z-index: 1000;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .site-branding {
      display: flex;
      flex-direction: column;
    }

    .site-title {
      color: var(--title-color, #000000);
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.2;
    }

    .site-domain {
      color: var(--title-color, #000000);
      opacity: 0.8;
      font-size: 0.9rem;
      margin-top: 0.25rem;
      font-weight: 400;
      letter-spacing: 0.01em;
      display: block;
      line-height: 1.2;
    }

    .site-nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: var(--links-color, #000000);
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s ease;
    }

    .nav-link:hover {
      opacity: 0.8;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .site-branding {
        align-items: center;
      }

      .site-nav {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `;
};

const generateAppJs = (siteData) => {
  const headerData = siteData.headerData || {};
  
  return cleanJavaScript(`
    document.addEventListener('DOMContentLoaded', function() {
      // Установка CSS переменных
      document.documentElement.style.setProperty('--header-bg-color', '${headerData.backgroundColor || '#ffffff'}');
      document.documentElement.style.setProperty('--title-color', '${headerData.titleColor || '#000000'}');
      document.documentElement.style.setProperty('--links-color', '${headerData.linksColor || '#000000'}');
      
      initializeScripts();
    });

    function initializeScripts() {
      // Initialize menu toggle
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.querySelector('.nav-menu');
      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
          menuToggle.classList.toggle('active');
          navMenu.classList.toggle('active');
        });
      }

      // Initialize smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      });
    }
  `);
};

const generateSiteContent = (siteData) => {
  const headerData = siteData.headerData || {};
  return cleanHTML(`
    <div class="site-container">
      <header class="site-header">
        <div class="header-content">
          <div class="site-branding">
            <h1 class="site-title">${headerData.siteName || 'My Site'}</h1>
            ${headerData.domain ? `<div class="site-domain" style="color: ${headerData.titleColor || '#000000'}; opacity: 0.8; font-size: 0.9rem; margin-top: 0.25rem;">${headerData.domain}</div>` : ''}
          </div>
          <nav class="site-nav">
            ${(headerData.menuItems || []).map(item => `
              <a href="${item.url || '#'}" class="nav-link">${item.text || item.title}</a>
            `).join('')}
          </nav>
        </div>
      </header>
      ${generateMainContent(siteData)}
      ${generateFooter(siteData)}
    </div>
  `);
};

const generateHeader = (siteData) => {
  return cleanHTML(`
    <header>
      <nav>
        ${generateNavigation(siteData)}
      </nav>
    </header>
  `);
};

const generateMainContent = (siteData) => {
  return cleanHTML(`
    <main>
      ${generateSections(siteData)}
    </main>
  `);
};

const generateFooter = (siteData) => {
  return cleanHTML(`
    <footer>
      ${generateFooterContent(siteData)}
    </footer>
  `);
};

const generatePrivacyPolicy = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <title>Privacy Policy</title>
      </head>
      <body>
        <!-- Add privacy policy content -->
      </body>
    </html>
  `;
};

const generateCookiePolicy = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <title>Cookie Policy</title>
      </head>
      <body>
        <!-- Add cookie policy content -->
      </body>
    </html>
  `;
};

const generateTermsOfService = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <title>Terms of Service</title>
      </head>
      <body>
        <!-- Add terms of service content -->
      </body>
    </html>
  `;
};

const generateSections = (siteData) => {
  return siteData.sectionsData.map(section => `
    <section class="section" style="background-color: ${section.backgroundColor || '#ffffff'};">
      <div class="section-content">
        ${section.title ? `<h2 class="section-title">${section.title}</h2>` : ''}
        ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
        <div class="cards-container">
          ${section.cards.map(card => `
            <div class="card ${card.type}" data-card-id="${card.id}">
              <div class="card-content">
                ${card.title ? `<h3 class="card-title">${card.title}</h3>` : ''}
                ${card.text ? `<p class="card-text">${card.text}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `).join('');
}; 