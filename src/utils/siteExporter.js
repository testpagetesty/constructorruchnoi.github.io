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
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteData.headerData?.siteName || 'My Site'}</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div id="root"></div>
        <script src="app.js"></script>
      </body>
    </html>
  `;
};

const generateStyles = () => {
  return `
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
  `;
};

const generateAppJs = (siteData) => {
  return cleanJavaScript(`
    document.addEventListener('DOMContentLoaded', function() {
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = \`${generateSiteContent(siteData)}\`;
        initializeScripts();
      }
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
  // Generate site content HTML
  return cleanHTML(`
    <div class="site-container">
      ${generateHeader(siteData)}
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