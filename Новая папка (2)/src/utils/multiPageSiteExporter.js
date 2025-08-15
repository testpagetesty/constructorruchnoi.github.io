import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportCookieConsentData } from './cookieConsentExporter';
import { cleanHTML, cleanCSS, cleanJavaScript } from './codeCleanup';
import { generateLiveChatHTML, generateLiveChatCSS, generateLiveChatJS } from './liveChatExporter';

// Экспорт многостраничного сайта (ручной режим)
export const exportMultiPageSite = async (siteData) => {
  console.log('🚀 Exporting multi-page site:', siteData);
  
  const zip = new JSZip();
  
  // Создаем структуру папок
  const assetsDir = zip.folder('assets');
  const cssDir = assetsDir.folder('css');
  const jsDir = assetsDir.folder('js');
  const imagesDir = assetsDir.folder('images');
  
  // Добавляем общие стили
  cssDir.file('styles.css', generateCommonStyles());
  
  // Добавляем общий JavaScript
  jsDir.file('app.js', generateCommonJS(siteData));
  
  // Создаем отдельные HTML страницы
  zip.file('index.html', generateIndexPage(siteData));
  
  // Генерируем страницы для каждой секции
  Object.entries(siteData.sectionsData || {}).forEach(([sectionId, sectionData]) => {
    const fileName = getSectionFileName(sectionId);
    if (fileName) {
      zip.file(`${fileName}.html`, generateSectionPage(siteData, sectionId, sectionData));
    }
  });
  
  // Создаем страницу контактов
  if (siteData.contactData) {
    zip.file('contact.html', generateContactPage(siteData));
  }
  
  // Создаем правовые документы
  if (siteData.legalDocuments) {
    if (siteData.legalDocuments.privacyPolicy?.content) {
      zip.file('privacy-policy.html', generateLegalPage(siteData, 'privacyPolicy'));
    }
    if (siteData.legalDocuments.termsOfService?.content) {
      zip.file('terms-of-service.html', generateLegalPage(siteData, 'termsOfService'));
    }
    if (siteData.legalDocuments.cookiePolicy?.content) {
      zip.file('cookie-policy.html', generateLegalPage(siteData, 'cookiePolicy'));
    }
  }
  
  // Создаем страницу благодарности
  zip.file('merci.html', generateMerciPage(siteData));
  
  // Создаем карту сайта
  zip.file('sitemap.xml', generateMultiPageSitemap(siteData));
  
  // Скачиваем архив
  const content = await zip.generateAsync({ type: 'blob' });
  const fileName = generateSafeFileName(siteData);
  saveAs(content, `${fileName}-multipage.zip`);
};

// Генерация главной страницы (index.html)
const generateIndexPage = (siteData) => {
  const headerData = siteData.headerData || {};
  const heroData = siteData.heroData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <meta name="description" content="${headerData.description || 'Добро пожаловать на наш сайт'}">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateHeroSection(siteData)}
        ${generateSectionsPreview(siteData)}
    </main>
    
    ${generateCommonFooter(siteData)}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

// Генерация страницы секции
const generateSectionPage = (siteData, sectionId, sectionData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  const sectionTitle = sectionData.title || getSectionDisplayName(sectionId, sectionData);
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sectionTitle} - ${siteName}</title>
    <meta name="description" content="${sectionData.description || sectionTitle}">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, sectionId, sectionData)}
        ${generateSectionContent(sectionData, sectionId)}
    </main>
    
    ${generateCommonFooter(siteData)}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

// Генерация общего хедера для всех страниц
const generateCommonHeader = (siteData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  
  return `<header class="site-header">
    <div class="container">
      <div class="header-content">
        <div class="site-branding">
          <h1 class="site-title">
            <a href="index.html">${siteName}</a>
          </h1>
        </div>
        <nav class="site-nav">
          <ul class="nav-menu">
            <li><a href="index.html">Главная</a></li>
            ${generateNavigationLinks(siteData)}
            <li><a href="contact.html">Контакты</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>`;
};

// Генерация навигационных ссылок
const generateNavigationLinks = (siteData) => {
  const sectionsData = siteData.sectionsData || {};
  const links = [];
  
  Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
    const fileName = getSectionFileName(sectionId);
    const displayName = getSectionDisplayName(sectionId, sectionData);
    if (fileName && displayName) {
      links.push(`<li><a href="${fileName}.html">${displayName}</a></li>`);
    }
  });
  
  return links.join('');
};

// Генерация Hero секции
const generateHeroSection = (siteData) => {
  const heroData = siteData.heroData || {};
  
  return `<section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">${heroData.title || 'Добро пожаловать'}</h1>
        <p class="hero-subtitle">${heroData.subtitle || 'На наш сайт'}</p>
        <p class="hero-description">${heroData.description || 'Мы предлагаем лучшие решения'}</p>
        ${heroData.buttonText ? `<a href="contact.html" class="hero-button">${heroData.buttonText}</a>` : ''}
      </div>
    </div>
  </section>`;
};

// Генерация превью секций на главной
const generateSectionsPreview = (siteData) => {
  const sectionsData = siteData.sectionsData || {};
  let html = '<section class="sections-preview"><div class="container"><h2>Наши разделы</h2><div class="preview-grid">';
  
  Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
    const fileName = getSectionFileName(sectionId);
    const displayName = getSectionDisplayName(sectionId, sectionData);
    
    if (fileName && displayName) {
      html += `
        <div class="preview-card">
          <h3>${sectionData.title || displayName}</h3>
          <p>${sectionData.description || 'Узнайте больше в этом разделе'}</p>
          <a href="${fileName}.html" class="preview-link">Подробнее</a>
        </div>
      `;
    }
  });
  
  html += '</div></div></section>';
  return html;
};

// Генерация контента секции
const generateSectionContent = (sectionData, sectionId) => {
  const title = sectionData.title || getSectionDisplayName(sectionId, sectionData);
  const description = sectionData.description || '';
  const cards = sectionData.cards || [];
  
  let html = `<section class="section-content">
    <div class="container">
      <h1 class="section-title">${title}</h1>
      ${description ? `<p class="section-description">${description}</p>` : ''}
      <div class="cards-grid">`;
  
  cards.forEach(card => {
    html += `
      <div class="card">
        <h3 class="card-title">${card.title || ''}</h3>
        <p class="card-content">${card.content || ''}</p>
      </div>
    `;
  });
  
  html += '</div></div></section>';
  return html;
};

// Генерация страницы контактов
const generateContactPage = (siteData) => {
  const headerData = siteData.headerData || {};
  const contactData = siteData.contactData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Контакты - ${siteName}</title>
    <meta name="description" content="Свяжитесь с нами">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, 'contact')}
        <section class="contact-section">
          <div class="container">
            <h1>${contactData.title || 'Контакты'}</h1>
            ${contactData.description ? `<p>${contactData.description}</p>` : ''}
            <div class="contact-info">
              ${contactData.phone ? `<p><strong>Телефон:</strong> ${contactData.phone}</p>` : ''}
              ${contactData.email ? `<p><strong>Email:</strong> ${contactData.email}</p>` : ''}
              ${contactData.address ? `<p><strong>Адрес:</strong> ${contactData.address}</p>` : ''}
            </div>
          </div>
        </section>
    </main>
    
    ${generateCommonFooter(siteData)}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

// Утилиты - убираем жесткую привязку к названиям
const getSectionFileName = (sectionId) => {
  // Преобразуем любой ID секции в безопасное имя файла
  if (!sectionId) return null;
  return sectionId.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // заменяем специальные символы на дефисы
    .replace(/-+/g, '-')         // убираем повторяющиеся дефисы
    .replace(/^-|-$/g, '');      // убираем дефисы в начале и конце
};

const getSectionDisplayName = (sectionId, sectionData) => {
  // Используем заголовок секции или ID как fallback
  return sectionData?.title || sectionId || 'Раздел';
};

// Простые заглушки для остальных функций
const generateBreadcrumbs = (siteData, currentSection, sectionData = null) => {
  let displayName = 'Контакты';
  if (currentSection === 'contact') {
    displayName = 'Контакты';
  } else if (sectionData) {
    displayName = getSectionDisplayName(currentSection, sectionData);
  } else {
    displayName = currentSection;
  }
  
  return `<nav class="breadcrumbs"><div class="container">
    <a href="index.html">Главная</a> > <span>${displayName}</span>
  </div></nav>`;
};

const generateCommonFooter = (siteData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  return `<footer class="site-footer">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${siteName}. Все права защищены.</p>
    </div>
  </footer>`;
};

const generateLegalPage = (siteData, docType) => {
  const doc = siteData.legalDocuments[docType];
  return `<!DOCTYPE html><html><head><title>${doc.title}</title></head><body>${doc.content}</body></html>`;
};

const generateMerciPage = (siteData) => {
  return `<!DOCTYPE html><html><head><title>Спасибо</title></head><body><h1>Спасибо за ваше обращение!</h1></body></html>`;
};

const generateCommonStyles = () => `/* Базовые стили для многостраничного сайта */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; line-height: 1.6; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.site-header { background: #fff; padding: 1rem 0; border-bottom: 1px solid #eee; }
.hero-section { background: #f8f9fa; padding: 4rem 0; text-align: center; }
.section-content { padding: 3rem 0; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
.card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.site-footer { background: #333; color: #fff; text-align: center; padding: 2rem 0; }`;

const generateCommonJS = (siteData) => `// Общий JavaScript для многостраничного сайта
console.log('Multi-page site loaded');`;

const generateMultiPageSitemap = (siteData) => {
  const domain = siteData.headerData?.domain || 'example.com';
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const currentDate = new Date().toISOString().replace('Z', '+00:00');
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/index.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Добавляем страницы секций
  const sectionsData = siteData.sectionsData || {};
  Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
    const fileName = getSectionFileName(sectionId);
    if (fileName) {
      sitemap += `
  <url>
    <loc>${baseUrl}/${fileName}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  });

  // Добавляем страницу контактов
  sitemap += `
  <url>
    <loc>${baseUrl}/contact.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  // Добавляем правовые документы
  if (siteData.legalDocuments) {
    if (siteData.legalDocuments.privacyPolicy?.content) {
      sitemap += `
  <url>
    <loc>${baseUrl}/privacy-policy.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    }
    if (siteData.legalDocuments.termsOfService?.content) {
      sitemap += `
  <url>
    <loc>${baseUrl}/terms-of-service.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    }
    if (siteData.legalDocuments.cookiePolicy?.content) {
      sitemap += `
  <url>
    <loc>${baseUrl}/cookie-policy.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    }
  }

  // Добавляем страницу благодарности
  sitemap += `
  <url>
    <loc>${baseUrl}/merci.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  return sitemap;
};

const generateSafeFileName = (siteData) => {
  const siteName = siteData.headerData?.siteName || 'my-site';
  return siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
}; 