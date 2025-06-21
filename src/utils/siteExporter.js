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
  
  // Create assets directory structure
  const assetsDir = zip.folder('assets');
  const cssDir = assetsDir.folder('css');
  const jsDir = assetsDir.folder('js');
  const imagesDir = assetsDir.folder('images');
  
  // Generate and add styles
  const styles = generateStyles();
  cssDir.file('styles.css', cleanCSS(styles));
  
  // Generate and add HTML files
  const indexHtml = generateIndexHtml(siteData);
  zip.file('index.html', cleanHTML(indexHtml));
  
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
  
  // Add robots.txt to the archive (unchanged from root directory)
  try {
    const robotsResponse = await fetch('/robots.txt');
    const robotsContent = await robotsResponse.text();
    zip.file('robots.txt', robotsContent);
    console.log('robots.txt successfully added to export zip');
  } catch (error) {
    console.warn('Could not fetch robots.txt for export, using default content');
    zip.file('robots.txt', 'User-agent: *\nDisallow:');
  }

  // Add sitemap.xml to the archive (dynamically generated with domain from settings)
  try {
    const sitemapContent = generateSitemap(siteData);
    zip.file('sitemap.xml', sitemapContent);
    console.log('sitemap.xml successfully added to export zip with domain:', siteData.headerData?.domain);
  } catch (error) {
    console.error('Error generating sitemap.xml for export:', error);
  }
  
  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  const fileName = generateSafeFileName(siteData);
  saveAs(content, `${fileName}.zip`);
};

const generateIndexHtml = (siteData) => {
  const headerData = siteData.headerData || {};
  return `
    <!DOCTYPE html>
    <html lang="${headerData.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${headerData.description || ''}">
        <title>${headerData.siteName || 'My Site'}</title>
        ${headerData.domain ? `<link rel="canonical" href="https://${headerData.domain}" />` : ''}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="assets/css/styles.css">
        <style>
          /* Основные шрифты */
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aXp-p7K4KLg.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aXp-p7K4KLg.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXp-p7K4KLg.woff2) format('woff2');
          }
        </style>
      </head>
      <body>
        <div id="root">
          ${generateSiteContent(siteData)}
        </div>
        <script>
          ${generateAppJs(siteData)}
        </script>
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
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
      background: #fff;
    }

    /* Для предотвращения конфликтов стилей */
    [data-nocards="true"] * {
      box-sizing: border-box;
    }

    /* Стили для секций без карточек */
    .section-nocards {
      background: #102826;
      padding: 4rem 2rem;
      width: 100%;
      margin: 0;
      position: relative;
      overflow: hidden;
    }
    .section-nocards h2 {
      color: #00e6e6;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
      position: relative;
    }
    .section-nocards h2:after {
      content: '';
      display: block;
      width: 80px;
      height: 3px;
      background: #00e6e6;
      margin: 15px auto;
    }
    .section-nocards > p {
      color: #00e6e6;
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 3rem;
      text-align: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
      font-family: 'Montserrat', sans-serif;
    }
    .section-nocards .service-blocks {
      display: flex;
      flex-direction: column;
      gap: 32px;
      width: 100%;
    }
    .section-nocards .service-block {
      background: rgba(255,255,255,0.03);
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      margin-bottom: 0;
      padding: 2rem;
      text-align: left;
      transition: box-shadow 0.3s;
      animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
    }
    .section-nocards .service-block h3 {
      color: #00e6e6;
      margin-bottom: 1rem;
      font-size: 1.3rem;
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
    }
    .section-nocards .service-block p {
      color: #00e6e6;
      font-size: 1.1rem;
      line-height: 1.7;
      margin: 0;
      font-family: 'Montserrat', sans-serif;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .section-nocards {
        padding: 2rem 0.5rem;
      }
      .section-nocards .service-block {
        padding: 1.2rem;
      }
      .section-nocards h2 {
        font-size: 2rem;
      }
      .section-nocards > p {
        font-size: 1.1rem;
      }
    }
  `;
};

const generateAppJs = (siteData) => {
  const headerData = siteData.headerData || {};
  
  return cleanJavaScript(`
    document.addEventListener('DOMContentLoaded', function() {
      // Set CSS variables
      const root = document.documentElement;
      root.style.setProperty('--header-bg-color', '${headerData.backgroundColor || '#ffffff'}');
      root.style.setProperty('--header-title-color', '${headerData.titleColor || '#000000'}');
      root.style.setProperty('--header-link-color', '${headerData.linksColor || '#000000'}');
      
      initializeScripts();
      initializeAnimations();
      
      // Add a small delay to ensure DOM is fully loaded
      setTimeout(() => {
        console.log('Starting autoDisplayDomain function...');
        autoDisplayDomain();
        console.log('Finished autoDisplayDomain function');
      }, 100);
      
      // Also try without delay for immediate execution
      autoDisplayDomain();
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

    function initializeAnimations() {
      // Create intersection observer for sections
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              
              // Ensure child elements get proper staggered animations
              const section = entry.target;
              const contentBlocks = section.querySelectorAll('.content-block');
              contentBlocks.forEach((block, index) => {
                block.style.setProperty('--index', index);
              });
              
              // Only unobserve if all animations are complete
              const lastDelay = contentBlocks.length * 0.15 + 1.8; // Maximum animation delay
              setTimeout(() => {
                sectionObserver.unobserve(entry.target);
              }, lastDelay * 1000);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px'
        }
      );

      // Observe all sections except no-cards sections (they have their own animations)
      document.querySelectorAll('.section:not([data-nocards="true"])').forEach(section => {
        // Reset any existing animations
        section.classList.remove('animate');
        
        // Start observing
        sectionObserver.observe(section);
        
        // Handle images loading
        const images = section.querySelectorAll('img');
        if (images.length > 0) {
          Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve; // Handle error case gracefully
            });
          })).then(() => {
            // Re-trigger animation after images are loaded
            if (section.classList.contains('animate')) {
              section.classList.remove('animate');
              requestAnimationFrame(() => {
                section.classList.add('animate');
              });
            }
          });
        }
      });
    }

    function autoDisplayDomain() {
      // Get current domain from browser
      const currentDomain = window.location.hostname;
      
      // Skip if localhost or IP address
      if (currentDomain === 'localhost' || 
          currentDomain === '127.0.0.1' || 
          currentDomain.includes('192.168.') ||
          currentDomain.includes('10.0.') ||
          /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(currentDomain)) {
        console.log('Skipping domain display for localhost/IP');
        return;
      }
      
      console.log('Auto-displaying domain:', currentDomain);
      
      // Find domain display element in header
      const domainElement = document.querySelector('.domain, .site-domain');
      
      if (domainElement) {
        // Update existing domain element
        domainElement.textContent = currentDomain;
        domainElement.style.display = 'block';
        console.log('Updated header domain element');
      } else {
        // Create new domain element if it doesn't exist
        const sitebranding = document.querySelector('.site-branding');
        if (sitebranding) {
          const domainDiv = document.createElement('div');
          domainDiv.className = 'domain';
          domainDiv.textContent = currentDomain;
          domainDiv.style.cssText = 'color: inherit; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;';
          sitebranding.appendChild(domainDiv);
          console.log('Created new header domain element');
        }
      }
      
      // Update contact domain elements
      const allContactDomainElements = document.querySelectorAll('.contact-domain');
      console.log('Found contact domain elements:', allContactDomainElements.length);
      
      allContactDomainElements.forEach((domainElement, index) => {
        const oldText = domainElement.textContent;
        domainElement.textContent = currentDomain;
        domainElement.style.display = 'block'; // Show the element like in header
        console.log('Updated contact domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
      });
      
      // Update footer domain elements
      const allFooterDomainElements = document.querySelectorAll('.footer-domain');
      console.log('Found footer domain elements:', allFooterDomainElements.length);
      
      allFooterDomainElements.forEach((domainElement, index) => {
        const oldText = domainElement.textContent;
        domainElement.textContent = currentDomain;
        domainElement.style.display = 'block'; // Show the element like in header
        console.log('Updated footer domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
      });
      
      // Update any other domain references on the page
      const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');
      domainPlaceholders.forEach(element => {
        element.textContent = currentDomain;
      });
      
      // Update contact email if it contains placeholder domain
      const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');
      emailElements.forEach(element => {
        const href = element.getAttribute('href') || '';
        const text = element.textContent || '';
        
        if (href.includes('@example.com') || text.includes('@example.com')) {
          const newHref = href.replace('@example.com', \`@\${currentDomain}\`);
          const newText = text.replace('@example.com', \`@\${currentDomain}\`);
          
          if (href !== newHref) element.setAttribute('href', newHref);
          if (text !== newText) element.textContent = newText;
        }
      });
    }
  `);
};

const generateSiteContent = (siteData) => {
  const headerData = siteData.headerData || {};
  const headerStyles = [];
  
  if (headerData.backgroundColor) {
    headerStyles.push(`--header-bg-color: ${headerData.backgroundColor}`);
  }
  if (headerData.titleColor) {
    headerStyles.push(`--header-title-color: ${headerData.titleColor}`);
  }
  if (headerData.linksColor) {
    headerStyles.push(`--header-link-color: ${headerData.linksColor}`);
  }

  return cleanHTML(`    <div class="site-container">
      <header class="site-header" style="${headerStyles.join('; ')}">
        <div class="header-content">
          <div class="site-branding">
            <h1 class="site-title">${headerData.siteName || 'My Site'}</h1>
            <div class="site-domain" style="display: none;">${headerData.domain || ''}</div>
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
  return cleanHTML(`    <header>
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

const generateSitemap = (siteData) => {
  const domain = siteData.headerData?.domain || 'example.com';
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const currentDate = new Date().toISOString().replace('Z', '+00:00');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
};

const generateSafeFileName = (siteData) => {
  let fileName = '';
  
  // Приоритет: домен, затем название сайта
  if (siteData.headerData?.domain && siteData.headerData.domain.trim()) {
    fileName = siteData.headerData.domain.trim();
    // Убираем протокол если есть
    fileName = fileName.replace(/^https?:\/\//, '');
    // Убираем www. если есть
    fileName = fileName.replace(/^www\./, '');
  } else if (siteData.headerData?.siteName && siteData.headerData.siteName.trim()) {
    fileName = siteData.headerData.siteName.trim();
  } else {
    fileName = 'site';
  }
  
  // Заменяем недопустимые символы для имени файла
  fileName = fileName
    .replace(/[<>:"/\\|?*]/g, '') // Убираем недопустимые символы Windows
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-\.]/g, '') // Оставляем только буквы (включая кириллицу), цифры, дефисы и точки
    .replace(/--+/g, '-') // Убираем множественные дефисы
    .replace(/^-+|-+$/g, ''); // Убираем дефисы в начале и конце
  
  return fileName || 'site';
};

const generateSitemapPHP = (siteData) => {
  const domain = siteData.headerData?.domain || 'example.com';
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const currentDate = new Date().toISOString().replace('Z', '+00:00');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.php</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
};

const generateSections = (siteData) => {
  return siteData.sectionsData.map(section => generateSectionHTML(section)).join('');
};

function generateSectionHTML(section) {
  // РАДИКАЛЬНО ИЗМЕНЕННЫЙ КОД ДЛЯ ТЕСТИРОВАНИЯ
  if (section.cardType === 'none') {
    // Очень заметный красный фон
    return `
      <section style="background: #ff0000; padding: 20px; color: white; border: 10px solid yellow;">
        <h1 style="color: white; font-size: 36px; text-align: center;">⚠️ ИЗМЕНЕНО ⚠️</h1>
        <h2 style="color: yellow; font-size: 24px;">${section.title || 'СЕКЦИЯ ИЗМЕНЕНА'}</h2>
        ${section.description ? `<p style="color: white; font-size: 18px;">${section.description}</p>` : ''}
        <div style="margin-top: 20px;">
          ${(section.cards || []).map(card => `
            <div style="background: rgba(0,0,0,0.5); padding: 15px; margin: 10px 0; border-radius: 10px;">
              <h3 style="color: yellow; font-size: 20px;">${card.title || 'ЗАГОЛОВОК'}</h3>
              <p style="color: white;">${card.text || card.content || 'ТЕКСТ ИЗМЕНЕН'}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="section">
      <div class="section-content">
        <h2 class="section-title">${section.title || ''}</h2>
        ${section.description ? `
          <p class="section-description">${section.description}</p>
        ` : ''}
        <div class="cards-container">
          ${section.cards.map((card, index) => generateCardHTML(card, section.cardType, index)).join('')}
        </div>
      </div>
    </section>
  `;
}

function generateCardHTML(card, cardType, index) {
  const cardStyles = [];
  
  if (card.backgroundColor) {
    cardStyles.push(`--card-bg-color: ${card.backgroundColor}`);
  } else if (card.gradientStart && card.gradientEnd) {
    cardStyles.push(`--card-gradient-start: ${card.gradientStart}`);
    cardStyles.push(`--card-gradient-end: ${card.gradientEnd}`);
  }

  if (card.titleColor) {
    cardStyles.push(`--card-title-color: ${card.titleColor}`);
  }
  if (card.textColor) {
    cardStyles.push(`--card-text-color: ${card.textColor}`);
  }

  cardStyles.push(`--index: ${index}`);

  return `
    <div class="card" data-card-id="${card.id || ''}" style="${cardStyles.join('; ')}">
      ${card.imagePath ? `
        <div class="card-image">
          <img src="${card.imagePath}" alt="${card.title || ''}" loading="lazy">
        </div>
      ` : ''}
      <div class="card-content">
        ${card.title ? `<h3 class="card-title">${card.title}</h3>` : ''}
        ${card.text ? `<p class="card-text">${card.text}</p>` : ''}
        ${card.buttonText ? `
          <a href="${card.buttonLink || '#'}" class="card-button">
            ${card.buttonText}
          </a>
        ` : ''}
      </div>
    </div>
  `;
}





