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
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
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