import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportCookieConsentData } from './cookieConsentExporter';
import { cleanHTML, cleanCSS, cleanJavaScript } from './codeCleanup';
import { generateLiveChatHTML, generateLiveChatCSS, generateLiveChatJS } from './liveChatExporter';
import { imageCacheService } from './imageCacheService';

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
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
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
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
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
  const elements = sectionData.elements || [];
  
  let html = `<section class="section-content">
    <div class="container">
      <h1 class="section-title">${title}</h1>
      ${description ? `<p class="section-description">${description}</p>` : ''}
      <div class="section-elements">`;
  
  // Генерируем элементы контента
  elements.forEach(element => {
    html += generateContentElementHTML(element);
  });
  
  html += '</div></div></section>';
  return html;
};

// Новая функция для генерации HTML элементов контента с правильными стилями
const generateContentElementHTML = (element) => {
  const elementId = `element-${element.id}`;
  const elementData = element.data || element;
  
  // Функция для применения настроек цветов из ColorSettings
  const applyColorSettings = (colorSettings, defaultStyles = {}) => {
    let containerStyles = { ...defaultStyles };
    let styles = {};
    
    // Применяем настройки фона секции
    if (colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = colorSettings;
      if (sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        containerStyles.backgroundColor = sectionBackground.solidColor;
      }
      containerStyles.opacity = sectionBackground.opacity || 1;
      containerStyles.border = `${colorSettings.borderWidth || 1}px solid ${colorSettings.borderColor || '#e0e0e0'}`;
      containerStyles.borderRadius = `${colorSettings.borderRadius || 8}px`;
      containerStyles.padding = `${colorSettings.padding || 16}px`;
      if (colorSettings.boxShadow) {
        containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }
    
    // Применяем цвета текстовых полей
    if (colorSettings?.textFields) {
      Object.keys(colorSettings.textFields).forEach(fieldName => {
        styles[`${fieldName}Color`] = colorSettings.textFields[fieldName];
      });
    }
    
    return { containerStyles, textStyles: styles };
  };
  
  switch (element.type) {
    case 'typography':
      const headingTag = elementData.headingType || 'h2';
      const { containerStyles: typographyContainerStyles, textStyles: typographyTextStyles } = applyColorSettings(elementData.colorSettings, {
        margin: '1rem 0'
      });
      
      const typographyTextColor = typographyTextStyles.textColor || elementData.textColor || '#333333';
      
      const typographyContent = `
        <${headingTag} style="
          color: ${typographyTextColor};
          text-align: ${elementData.textAlign || 'left'};
          font-family: ${elementData.fontFamily || 'inherit'};
          font-weight: ${elementData.fontWeight || 'normal'};
          font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : 'inherit'};
          margin: 0;
        ">${elementData.text || 'Заголовок или текст'}</${headingTag}>
      `;
      
      // Если есть настройки фона, оборачиваем в контейнер
      if (elementData.colorSettings?.sectionBackground?.enabled) {
        return `
          <div id="${elementId}" class="content-element typography" style="${Object.entries(typographyContainerStyles).map(([key, value]) => `${key}: ${value}`).join('; ')}">
            ${typographyContent}
          </div>
        `;
      }
      
      return `<div id="${elementId}" class="content-element typography" style="margin: 1rem 0;">${typographyContent}</div>`;

    case 'rich-text':
      const parseMarkdown = (text) => {
        if (!text) return '';
        return text
          .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
          .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>');
      };
      
      const { containerStyles: richContainerStyles, textStyles: richTextStyles } = applyColorSettings(elementData.colorSettings, {
        margin: '1.5rem 0',
        padding: elementData.padding ? `${elementData.padding}px` : '1rem',
        background: elementData.backgroundColor || '#fafafa',
        borderRadius: elementData.borderRadius ? `${elementData.borderRadius}px` : '8px',
        borderLeft: `4px solid ${elementData.borderColor || '#1976d2'}`
      });
      
      const richTitleColor = richTextStyles.titleColor || elementData.titleColor || '#1976d2';
      const richTextColor = richTextStyles.textColor || elementData.textColor || '#333333';
      
      const richTextContent = `
        ${elementData.showTitle !== false ? `
          <h3 style="
            color: ${richTitleColor};
            font-family: ${elementData.fontFamily || 'inherit'};
            font-size: ${elementData.titleFontSize ? elementData.titleFontSize + 'px' : '1.25rem'};
            margin: 0 0 1rem 0;
          ">${elementData.title || 'Богатый текст'}</h3>
        ` : ''}
        <div class="rich-content" style="
          color: ${richTextColor};
          font-family: ${elementData.fontFamily || 'inherit'};
          font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : '1rem'};
          text-align: ${elementData.textAlign || 'left'};
          line-height: 1.6;
        ">
          <p>${parseMarkdown(elementData.content || 'Текст с **жирным**, *курсивом*, ***жирным курсивом***\n\nВторой абзац с [ссылкой](https://example.com)')}</p>
        </div>
      `;
      
      return `
        <div id="${elementId}" class="content-element rich-text" style="${Object.entries(richContainerStyles).map(([key, value]) => `${key}: ${value}`).join('; ')}">
          ${richTextContent}
        </div>
      `;

    case 'blockquote':
      const borderClass = `border-${elementData.borderPosition || 'left'}`;
      const gradientStyle = elementData.useGradient ? 
        `background: linear-gradient(${elementData.gradientDirection || 'to right'}, ${elementData.gradientColor1 || '#f8f9fa'}, ${elementData.gradientColor2 || '#ffffff'});` : 
        `background: ${elementData.backgroundColor || '#f8f9fa'};`;
      
      return `
        <div id="${elementId}" class="content-element blockquote ${borderClass}" style="
          ${gradientStyle}
          border-color: ${elementData.borderColor || '#dee2e6'};
          border-width: ${elementData.borderWidth || 4}px;
          padding: ${elementData.padding || 20}px;
          text-align: ${elementData.textAlign || 'left'};
          font-family: ${elementData.fontFamily || 'Georgia'};
        ">
          <blockquote>
            ${elementData.showTitle && elementData.title ? `
              <div class="quote-title" style="color: ${elementData.titleColor || elementData.quoteColor || '#555555'};">${elementData.title}</div>
            ` : ''}
            <p class="quote-text" style="
              color: ${elementData.quoteColor || '#555555'};
              font-size: ${elementData.quoteFontSize || 18}px;
              font-style: ${elementData.italic !== false ? 'italic' : 'normal'};
            ">"${elementData.quote || 'Это цитата для демонстрации'}"</p>
            ${elementData.showAuthor && elementData.author ? `
              <footer class="quote-author" style="
                color: ${elementData.authorColor || '#888888'};
                font-size: ${elementData.authorFontSize || 14}px;
              ">
                — ${elementData.author}${elementData.showSource && elementData.source ? ', ' + elementData.source : ''}
              </footer>
            ` : ''}
          </blockquote>
        </div>
      `;

    case 'list':
      const listTag = elementData.listType === 'numbered' ? 'ol' : 'ul';
      const items = elementData.items || elementData.initialItems || ['Первый элемент', 'Второй элемент', 'Третий элемент'];
      const spacingClass = `spacing-${elementData.spacing || 'normal'}`;
      const bulletClass = elementData.listType === 'bulleted' ? `bullet-${elementData.bulletStyle || 'circle'}` : '';
      const numberClass = elementData.listType === 'numbered' ? `number-${elementData.numberStyle || 'decimal'}` : '';
      
      return `
        <div id="${elementId}" class="content-element list ${spacingClass} ${bulletClass} ${numberClass}">
          <${listTag} style="
            color: ${elementData.itemColor || '#333333'};
            font-family: ${elementData.fontFamily || 'inherit'};
            font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : 'inherit'};
          ">
            ${items.map(item => `<li style="
              ${elementData.customColors && elementData.accentColor ? `color: ${elementData.accentColor};` : ''}
            ">${item}</li>`).join('')}
          </${listTag}>
        </div>
      `;

    case 'callout':
      const calloutIcons = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌',
        success: '✅',
        note: '📝',
        tip: '💡',
        question: '❓',
        important: '⭐',
        security: '🔒'
      };
      const calloutType = elementData.type || 'info';
      const icon = calloutIcons[calloutType] || 'ℹ️';
      
      return `
        <div id="${elementId}" class="content-element callout callout-${calloutType}" style="
          ${elementData.customColors && elementData.backgroundColor ? `background: ${elementData.backgroundColor};` : ''}
          ${elementData.customColors && elementData.borderColor ? `border-color: ${elementData.borderColor};` : ''}
          ${elementData.padding ? `padding: ${elementData.padding}px;` : ''}
        ">
          <div class="callout-header">
            ${elementData.showIcon !== false ? `
              <span class="callout-icon">${icon}</span>
            ` : ''}
            <div class="callout-content">
              <h4 class="callout-title" style="
                ${elementData.customColors && elementData.textColor ? `color: ${elementData.textColor};` : ''}
                font-family: ${elementData.fontFamily || 'inherit'};
                font-size: ${elementData.titleFontSize ? elementData.titleFontSize + 'px' : '1.1rem'};
              ">${elementData.title || 'Важная информация'}</h4>
              <p class="callout-text" style="
                ${elementData.customColors && elementData.textColor ? `color: ${elementData.textColor};` : ''}
                font-family: ${elementData.fontFamily || 'inherit'};
                font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : '0.95rem'};
              ">${elementData.content || 'Это важная информация, которую пользователи должны заметить.'}</p>
            </div>
          </div>
        </div>
      `;

    case 'code-block':
      const codeLines = (elementData.code || 'function hello() {\n  console.log("Hello, World!");\n}').split('\n');
      const showLineNumbers = elementData.showLineNumbers !== false;
      const lineNumbersClass = showLineNumbers ? 'show-line-numbers' : '';
      
      return `
        <div id="${elementId}" class="content-element code-block ${lineNumbersClass}">
          ${elementData.showTitle !== false ? `
            <div class="code-header">
              <span>📄</span>
              ${elementData.title || 'Блок кода'} (${elementData.language || 'javascript'})
            </div>
          ` : ''}
          <div class="code-content">
            ${showLineNumbers ? `
              <div class="line-numbers">
                ${codeLines.map((_, i) => `<div>${i + 1}</div>`).join('')}
              </div>
            ` : ''}
            <pre><code style="
              font-family: ${elementData.fontFamily || "'Courier New', Monaco, monospace"};
              font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : '0.9rem'};
            ">${codeLines.join('\n')}</code></pre>
          </div>
        </div>
      `;

    case 'timeline-component':
      // Получаем данные из element.data если есть, иначе из element
      const timelineEvents = elementData.events || elementData.items || [
        { date: '2024', title: 'Запуск проекта', description: 'Начало разработки', status: 'completed' },
        { date: '2024', title: 'Тестирование', description: 'Проверка функций', status: 'in-progress' },
        { date: '2024', title: 'Релиз', description: 'Публикация', status: 'pending' }
      ];

      // Получаем цвета из colorSettings
      const timelineColorSettings = elementData.colorSettings || {};
      const timelineTitleColor = timelineColorSettings.textFields?.title || '#000000';
      const timelineDateColor = timelineColorSettings.textFields?.date || '#666666';
      const timelineTextColor = timelineColorSettings.textFields?.text || '#333333';
      const timelineLineColor = timelineColorSettings.textFields?.line || '#e0e0e0';
      const timelineCompletedColor = timelineColorSettings.textFields?.completed || '#4caf50';
      const timelineInProgressColor = timelineColorSettings.textFields?.inProgress || '#ff9800';
      const timelinePendingColor = timelineColorSettings.textFields?.pending || '#2196f3';

      // Функция для получения цвета статуса
      const getStatusColor = (status) => {
        switch (status) {
          case 'completed': return timelineCompletedColor;
          case 'in-progress': return timelineInProgressColor;
          case 'pending': return timelinePendingColor;
          default: return timelinePendingColor;
        }
      };

      // Функция для получения иконки статуса
      const getStatusIcon = (status) => {
        switch (status) {
          case 'completed': return '✓';
          case 'in-progress': return '⟳';
          case 'pending': return '○';
          default: return '○';
        }
      };

      // Стили контейнера из colorSettings
      let timelineContainerStyles = `
        margin: 2rem 0;
      `;

      // Применяем настройки фона из sectionBackground
      if (timelineColorSettings.sectionBackground?.enabled) {
        const { sectionBackground } = timelineColorSettings;
        if (sectionBackground.useGradient) {
          timelineContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
        } else {
          timelineContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
        }
        timelineContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
      }

      // Применяем настройки границы
      if (timelineColorSettings.borderColor) {
        timelineContainerStyles += ` border: ${timelineColorSettings.borderWidth || 1}px solid ${timelineColorSettings.borderColor};`;
      }

      // Применяем радиус углов
      if (timelineColorSettings.borderRadius !== undefined) {
        timelineContainerStyles += ` border-radius: ${timelineColorSettings.borderRadius}px;`;
      } else {
        timelineContainerStyles += ` border-radius: 8px;`;
      }

      // Применяем внутренние отступы
      if (timelineColorSettings.padding !== undefined) {
        timelineContainerStyles += ` padding: ${timelineColorSettings.padding}px;`;
      } else {
        timelineContainerStyles += ` padding: 16px;`;
      }

      // Применяем тень
      if (timelineColorSettings.boxShadow) {
        timelineContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }

      return `
        <div id="${elementId}" class="content-element timeline-component" style="${timelineContainerStyles}">
          <h4 style="
            margin-bottom: 24px;
            text-align: center;
            color: ${timelineTitleColor};
            font-size: 2rem;
          ">${elementData.title || 'Временная шкала'}</h4>
          <div style="position: relative;">
            ${timelineEvents.map((event, index) => `
              <div style="
                display: flex;
                margin-bottom: 24px;
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 16px;
                ">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${getStatusColor(event.status)};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                  ">${getStatusIcon(event.status)}</div>
                  ${index < timelineEvents.length - 1 ? `
                    <div style="
                      width: 2px;
                      height: 40px;
                      background-color: ${timelineLineColor};
                      margin-top: 8px;
                    "></div>
                  ` : ''}
                </div>
                <div style="flex: 1;">
                  <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                  ">
                    <h6 style="
                      margin: 0;
                      margin-right: 8px;
                      color: ${timelineTextColor};
                      font-size: 1.25rem;
                    ">${event.title}</h6>
                    <span style="
                      background-color: ${getStatusColor(event.status)};
                      color: white;
                      padding: 4px 8px;
                      border-radius: 12px;
                      font-size: 12px;
                      font-weight: 500;
                    ">${event.status}</span>
                  </div>
                  <p style="
                    margin: 0 0 8px 0;
                    color: ${timelineDateColor};
                    font-size: 14px;
                  ">${event.date}</p>
                  <p style="
                    margin: 0;
                    color: ${timelineTextColor};
                    line-height: 1.5;
                  ">${event.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'data-table':
      console.log('[multiPageSiteExporter] DataTable element data:', { elementData, element });
      // Получаем данные из различных возможных источников
      let tableData = [];
      
      // Приоритет 1: rows из elementData
      if (elementData.rows && Array.isArray(elementData.rows)) {
        tableData = elementData.rows;
      }
      // Приоритет 2: data из elementData
      else if (elementData.data && Array.isArray(elementData.data)) {
        tableData = elementData.data;
      }
      // Приоритет 3: rows из element
      else if (element.rows && Array.isArray(element.rows)) {
        tableData = element.rows;
      }
      // Приоритет 4: data из element
      else if (element.data && Array.isArray(element.data)) {
        tableData = element.data;
      }
      // Приоритет 5: initialRows из elementData
      else if (elementData.initialRows && Array.isArray(elementData.initialRows)) {
        // Преобразуем initialRows в формат для таблицы
        const headers = elementData.initialColumns || elementData.columns || [
          { id: 'name', label: 'Название' },
          { id: 'value', label: 'Значение' },
          { id: 'description', label: 'Описание' }
        ];
        
        // Создаем заголовки
        const headerRow = headers.map(col => col.label);
        tableData = [headerRow];
        
        // Добавляем данные
        elementData.initialRows.forEach(row => {
          const dataRow = headers.map(col => row[col.id] || '');
          tableData.push(dataRow);
        });
      }
              // Fallback: дефолтные данные
        else {
          tableData = [
            ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'],
            ['Данные 1', 'Данные 2', 'Данные 3'],
            ['Данные 4', 'Данные 5', 'Данные 6']
          ];
        }
        
        console.log('[multiPageSiteExporter] DataTable final data:', tableData);
      
        // Получаем настройки таблицы
        const tableSettings = elementData.tableSettings || {};
        const isStriped = tableSettings.striped !== undefined ? tableSettings.striped : true;
        const isBordered = tableSettings.bordered !== undefined ? tableSettings.bordered : true;
        const isHover = tableSettings.hover !== undefined ? tableSettings.hover : true;
        const isDense = tableSettings.dense !== undefined ? tableSettings.dense : false;
        const isSortable = tableSettings.sortable !== undefined ? tableSettings.sortable : true;
        const sortConfig = tableSettings.sortConfig || { key: null, direction: 'asc' };

        // Получаем цвета из colorSettings
        const tableColorSettings = elementData.colorSettings || {};
      const tableStyles = elementData.customStyles || {};
      const tableBackgroundColor = tableColorSettings.textFields?.background || tableStyles.backgroundColor || 'white';
              const tableTitleColor = tableColorSettings.textFields?.title || tableColorSettings.textFields?.headerText || '#333333';
      const tableHeaderColor = tableColorSettings.textFields?.headerText || '#ffffff';
      const tableCellColor = tableColorSettings.textFields?.text || '#333333';
      const tableHeaderBg = tableColorSettings.textFields?.headerBg || '#1976d2';
      const tableBorderColor = tableColorSettings.textFields?.border || '#c41e3a';
      const tableHoverColor = tableColorSettings.textFields?.hover || 'rgba(196,30,58,0.15)';

      // Стили контейнера из colorSettings
      let tableContainerStyles = `
        margin: 2rem 0;
        max-width: 1000px;
        margin-left: auto;
        margin-right: auto;
      `;

      // Применяем настройки фона из sectionBackground
      if (tableColorSettings.sectionBackground?.enabled) {
        const { sectionBackground } = tableColorSettings;
        if (sectionBackground.useGradient) {
          tableContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
        } else {
          tableContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
        }
        tableContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
      }

      // Применяем настройки границы
      if (tableColorSettings.borderColor) {
        tableContainerStyles += ` border: ${tableColorSettings.borderWidth || 1}px solid ${tableColorSettings.borderColor};`;
      }

      // Применяем радиус углов
      if (tableColorSettings.borderRadius !== undefined) {
        tableContainerStyles += ` border-radius: ${tableColorSettings.borderRadius}px;`;
      }

      // Применяем внутренние отступы
      if (tableColorSettings.padding !== undefined) {
        tableContainerStyles += ` padding: ${tableColorSettings.padding}px;`;
      } else {
        tableContainerStyles += ` padding: ${tableStyles.padding || 0}px;`;
      }

      // Применяем тень
      if (tableColorSettings.boxShadow) {
        tableContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }

      return `
        <div id="${elementId}" class="content-element data-table" style="${tableContainerStyles}">
          ${(elementData.title || element.title || elementData.headers?.[0]?.label) ? `
            <h3 style="
              text-align: center;
              color: ${tableTitleColor};
              margin-bottom: 2rem;
              font-size: 1.5rem;
              font-weight: bold;
              font-family: 'Montserrat', sans-serif;
              background-color: ${tableColorSettings.textFields?.headerBg || 'transparent'};
              padding: 1rem;
              border-radius: 8px;
              border: ${tableColorSettings.textFields?.border ? `2px solid ${tableColorSettings.textFields.border}` : 'none'};
            ">${elementData.title || element.title || elementData.headers?.[0]?.label}</h3>
          ` : ''}
          <div style="
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            background: ${tableBackgroundColor};
            border: 1px solid ${tableBorderColor};
            max-width: 100%;
          ">
            <table id="${elementId}" style="
              width: 100%;
              min-width: 600px;
              border-collapse: collapse;
              background: ${tableBackgroundColor};
              font-family: 'Montserrat', sans-serif;
              table-layout: fixed;
            ">
              ${tableData.map((row, rowIndex) => `
                <tr style="
                  ${rowIndex === 0 ? `
                    background: ${tableHeaderBg};
                    background-image: linear-gradient(135deg, ${tableHeaderBg} 0%, ${tableHeaderBg}DD 100%);
                  ` : `
                    background: ${isStriped && rowIndex % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent'};
                  `}
                  border-bottom: ${isBordered ? (rowIndex === 0 ? `2px solid ${tableBorderColor}` : `1px solid ${tableBorderColor}40`) : 'none'};
                  transition: background-color 0.2s ease;
                " ${rowIndex > 0 && isHover ? `onmouseover="this.style.backgroundColor='${tableHoverColor}'" onmouseout="this.style.backgroundColor='${isStriped && rowIndex % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent'}'"` : ''}>
                  ${row.map((cell, cellIndex) => `
                    <${rowIndex === 0 ? 'th' : 'td'} style="
                      padding: ${rowIndex === 0 ? (isDense ? '12px 16px' : '16px 20px') : (isDense ? '8px 16px' : '14px 20px')};
                      text-align: ${rowIndex === 0 ? 'center' : 'left'};
                      color: ${rowIndex === 0 ? tableHeaderColor : tableCellColor};
                      font-weight: ${rowIndex === 0 ? 'bold' : 'normal'};
                      font-size: ${rowIndex === 0 ? (isDense ? '13px' : '14px') : (isDense ? '12px' : '13px')};
                      ${rowIndex === 0 ? 'text-transform: uppercase; letter-spacing: 0.5px;' : ''}
                      ${cellIndex === 0 && rowIndex > 0 ? 'font-weight: 500;' : ''}
                      border-right: ${isBordered && cellIndex < row.length - 1 ? `1px solid ${tableBorderColor}40` : 'none'};
                      ${rowIndex === 0 && isSortable ? 'cursor: pointer; user-select: none;' : ''}
                      word-wrap: break-word;
                      overflow-wrap: break-word;
                      max-width: 0;
                      white-space: normal;
                    " ${rowIndex === 0 && isSortable ? `onclick="sortTable('${elementId}', ${cellIndex})"` : ''}>${cell}${rowIndex === 0 && isSortable && cellIndex === 0 ? ' ↕' : ''}</${rowIndex === 0 ? 'th' : 'td'}>
                  `).join('')}
                </tr>
              `).join('')}
            </table>
          </div>
          
          <!-- Дополнительная информация удалена из экспорта -->
          
          <style>
            @media (max-width: 768px) {
              #${elementId} {
                min-width: 400px !important;
              }
              #${elementId} th,
              #${elementId} td {
                padding: 8px 12px !important;
                font-size: 12px !important;
              }
            }
            @media (max-width: 480px) {
              #${elementId} {
                min-width: 300px !important;
              }
              #${elementId} th,
              #${elementId} td {
                padding: 6px 8px !important;
                font-size: 11px !important;
              }
            }
          </style>
          
          ${isSortable ? `
          <script>
            // Функция сортировки таблицы
            function sortTable(tableId, columnIndex) {
              const table = document.getElementById(tableId);
              const tbody = table.querySelector('tbody') || table;
              const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // Пропускаем заголовок
              const headerRow = tbody.querySelector('tr');
              
              // Определяем направление сортировки (по умолчанию desc - обратный порядок)
              const currentDirection = table.getAttribute('data-sort-direction') || 'desc';
              const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
              
              // Сортируем строки
              rows.sort((a, b) => {
                const aValue = a.cells[columnIndex]?.textContent || '';
                const bValue = b.cells[columnIndex]?.textContent || '';
                
                // Пытаемся преобразовать в числа для числовой сортировки
                const aNum = parseFloat(aValue);
                const bNum = parseFloat(bValue);
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                  return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
                }
                
                // Строковая сортировка
                return newDirection === 'asc' 
                  ? aValue.localeCompare(bValue, 'ru') 
                  : bValue.localeCompare(aValue, 'ru');
              });
              
              // Обновляем таблицу
              rows.forEach(row => tbody.appendChild(row));
              table.setAttribute('data-sort-direction', newDirection);
              
              // Обновляем заголовки - стрелка переходит к активному столбцу
              const headers = headerRow.querySelectorAll('th');
              headers.forEach((header, index) => {
                const baseText = header.textContent.replace(/ [↑↓↕]/g, ''); // Убираем все стрелки
                if (index === columnIndex) {
                  // Активный столбец показывает направление сортировки
                  header.innerHTML = baseText + (newDirection === 'asc' ? ' ↑' : ' ↓');
                } else {
                  // Остальные столбцы без стрелок
                  header.innerHTML = baseText;
                }
              });
            }
            
            // Автоматическая сортировка при загрузке страницы
            document.addEventListener('DOMContentLoaded', function() {
              const table = document.getElementById('${elementId}');
              if (table) {
                // Автоматически сортируем по первому столбцу при загрузке
                setTimeout(() => sortTable('${elementId}', 0), 100);
              }
            });
          </script>
              const table = document.getElementById(tableId);
              const tbody = table.querySelector('tbody') || table;
              const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // Пропускаем заголовок
              const headerRow = tbody.querySelector('tr');
              
              // Определяем направление сортировки
              const currentDirection = table.getAttribute('data-sort-direction') || 'asc';
              const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
              
              // Сортируем строки
              rows.sort((a, b) => {
                const aValue = a.cells[columnIndex]?.textContent || '';
                const bValue = b.cells[columnIndex]?.textContent || '';
                
                // Пытаемся преобразовать в числа для числовой сортировки
                const aNum = parseFloat(aValue);
                const bNum = parseFloat(bValue);
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                  return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
                }
                
                // Строковая сортировка
                return newDirection === 'asc' 
                  ? aValue.localeCompare(bValue, 'ru') 
                  : bValue.localeCompare(aValue, 'ru');
              });
              
              // Обновляем таблицу
              rows.forEach(row => tbody.appendChild(row));
              table.setAttribute('data-sort-direction', newDirection);
              
              // Обновляем заголовки
              const headers = headerRow.querySelectorAll('th');
              headers.forEach((header, index) => {
                const baseText = header.textContent.replace(/ [↑↓↕]/g, ''); // Убираем все стрелки
                if (index === 0) { // Только первый столбец
                  if (index === columnIndex) {
                    header.innerHTML = baseText + (newDirection === 'asc' ? ' ↑' : ' ↓');
                  } else {
                    header.innerHTML = baseText + ' ↕'; // Возвращаем стрелку по умолчанию
                  }
                } else {
                  header.innerHTML = baseText; // Остальные столбцы без стрелок
                }
              });
            }
          </script>
          ` : ''}
        </div>
      `;

    case 'image-gallery':
      // Экспорт галереи изображений с поддержкой colorSettings
      const galleryImages = element.images || element.data?.images || [];
      
      // Получаем цвета из colorSettings
      const galleryColorSettings = element.data?.colorSettings || element.colorSettings || {};
      const galleryTitleColor = galleryColorSettings.textFields?.title || '#333333';
      const galleryDescriptionColor = galleryColorSettings.textFields?.description || '#666666';
      const galleryBackgroundColor = galleryColorSettings.textFields?.background || '#ffffff';
      const galleryBorderColor = galleryColorSettings.textFields?.border || '#e0e0e0';
      
      // Стили контейнера из colorSettings
      let galleryContainerStyles = `
        width: 100%;
        margin: 2rem 0;
        padding: 20px;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
      `;
      
      // Добавляем стили фона если включены
      if (galleryColorSettings.sectionBackground?.enabled) {
        if (galleryColorSettings.sectionBackground.useGradient) {
          galleryContainerStyles += `
            background: linear-gradient(${galleryColorSettings.sectionBackground.gradientDirection}, ${galleryColorSettings.sectionBackground.gradientColor1}, ${galleryColorSettings.sectionBackground.gradientColor2});
            opacity: ${galleryColorSettings.sectionBackground.opacity || 1};
          `;
        } else {
          galleryContainerStyles += `
            background-color: ${galleryColorSettings.sectionBackground.solidColor};
            opacity: ${galleryColorSettings.sectionBackground.opacity || 1};
          `;
        }
      } else {
        galleryContainerStyles += `background-color: ${galleryBackgroundColor};`;
      }
      
      // Добавляем стили границы и отступов
      if (galleryColorSettings.borderColor) {
        galleryContainerStyles += `
          border: ${galleryColorSettings.borderWidth || 1}px solid ${galleryColorSettings.borderColor};
          border-radius: ${galleryColorSettings.borderRadius || 8}px;
        `;
      } else {
        galleryContainerStyles += `border: 1px solid ${galleryBorderColor}; border-radius: 8px;`;
      }
      
      if (galleryColorSettings.padding !== undefined) {
        galleryContainerStyles += `padding: ${galleryColorSettings.padding}px;`;
      }
      
      if (galleryColorSettings.boxShadow) {
        galleryContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }
      
      return `
        <div id="${elementId}" class="content-element image-gallery" style="${galleryContainerStyles}">
          ${element.title ? `
            <h3 style="
              text-align: center;
              color: ${galleryTitleColor};
              margin-bottom: 1rem;
              font-size: 1.8rem;
              font-weight: bold;
            ">${element.title}</h3>
          ` : ''}
          ${element.description ? `
            <p style="
              text-align: center;
              color: ${galleryDescriptionColor};
              margin-bottom: 2rem;
              font-size: 1.1rem;
              line-height: 1.6;
            ">${element.description}</p>
          ` : ''}
          ${galleryImages.length > 0 ? `
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
            ">
              ${galleryImages.map((img, index) => `
                <div style="
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  transition: transform 0.3s ease;
                  background-color: ${galleryBackgroundColor};
                  border: 1px solid ${galleryBorderColor};
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <img src="${img.src || img.url || img}" alt="${img.alt || `Изображение ${index + 1}`}" style="
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                  ">
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f5f5f5;
              color: #666;
              font-style: italic;
              border-radius: 8px;
            ">
              📷 Пока нет изображений
            </div>
          `}
        </div>
      `;

    default:
      return `<div id="${elementId}" class="content-element">Неизвестный тип элемента: ${element.type}</div>`;
  }
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
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
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
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title} - ${siteName}</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, docType)}
        <section class="legal-section">
          <div class="container">
            <h1>${doc.title}</h1>
            <div class="legal-content">
              ${doc.content}
            </div>
          </div>
        </section>
    </main>
    
    ${generateCommonFooter(siteData)}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

const generateMerciPage = (siteData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Спасибо - ${siteName}</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, 'merci')}
        <section class="merci-section">
          <div class="container">
            <h1>Спасибо за ваше обращение!</h1>
            <p>Мы свяжемся с вами в ближайшее время.</p>
          </div>
        </section>
    </main>
    
    ${generateCommonFooter(siteData)}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
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
.site-footer { background: #333; color: #fff; text-align: center; padding: 2rem 0; }

/* ===========================================
   СТИЛИ ДЛЯ ТЕКСТОВЫХ ЭЛЕМЕНТОВ КОНТЕНТА
   =========================================== */

/* Стили для Typography элементов */
.content-element.typography {
  margin: 1rem 0;
}
.content-element.typography h1,
.content-element.typography h2,
.content-element.typography h3,
.content-element.typography h4,
.content-element.typography h5,
.content-element.typography h6 {
  margin: 0;
  line-height: 1.2;
  font-weight: 600;
}

/* Стили для Rich Text элементов */
.content-element.rich-text {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}
.content-element.rich-text h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}
.content-element.rich-text .rich-content {
  line-height: 1.6;
  font-size: 1rem;
}
.content-element.rich-text .rich-content strong {
  font-weight: 600;
}
.content-element.rich-text .rich-content em {
  font-style: italic;
}
.content-element.rich-text .rich-content a {
  color: #1976d2;
  text-decoration: none;
}
.content-element.rich-text .rich-content a:hover {
  text-decoration: underline;
}
.content-element.rich-text .rich-content code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Стили для Blockquote элементов */
.content-element.blockquote {
  margin: 1.5rem 0;
  padding: 1.5rem 2rem;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.content-element.blockquote.border-left {
  border-left: 4px solid #dee2e6;
}
.content-element.blockquote.border-right {
  border-right: 4px solid #dee2e6;
}
.content-element.blockquote.border-top {
  border-top: 4px solid #dee2e6;
}
.content-element.blockquote.border-bottom {
  border-bottom: 4px solid #dee2e6;
}
.content-element.blockquote.border-around {
  border: 4px solid #dee2e6;
}
.content-element.blockquote blockquote {
  margin: 0;
  position: relative;
}
.content-element.blockquote .quote-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}
.content-element.blockquote .quote-author {
  font-size: 0.9rem;
  text-align: right;
  opacity: 0.8;
}
.content-element.blockquote .quote-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Стили для List элементов */
.content-element.list {
  margin: 1.5rem 0;
}
.content-element.list ul,
.content-element.list ol {
  line-height: 1.6;
  padding-left: 2rem;
}
.content-element.list.spacing-compact li {
  margin-bottom: 0.25rem;
}
.content-element.list.spacing-normal li {
  margin-bottom: 0.5rem;
}
.content-element.list.spacing-relaxed li {
  margin-bottom: 1rem;
}
.content-element.list.spacing-loose li {
  margin-bottom: 1.5rem;
}
.content-element.list.bullet-circle ul {
  list-style-type: disc;
}
.content-element.list.bullet-square ul {
  list-style-type: square;
}
.content-element.list.bullet-arrow ul {
  list-style: none;
}
.content-element.list.bullet-arrow ul li:before {
  content: "→";
  margin-right: 0.5rem;
  color: #1976d2;
}
.content-element.list.bullet-dash ul {
  list-style: none;
}
.content-element.list.bullet-dash ul li:before {
  content: "–";
  margin-right: 0.5rem;
  color: #666;
}
.content-element.list.bullet-dot ul {
  list-style: none;
}
.content-element.list.bullet-dot ul li:before {
  content: "•";
  margin-right: 0.5rem;
  color: #1976d2;
}
.content-element.list.number-decimal ol {
  list-style-type: decimal;
}
.content-element.list.number-alpha-lower ol {
  list-style-type: lower-alpha;
}
.content-element.list.number-alpha-upper ol {
  list-style-type: upper-alpha;
}
.content-element.list.number-roman-lower ol {
  list-style-type: lower-roman;
}
.content-element.list.number-roman-upper ol {
  list-style-type: upper-roman;
}

/* Стили для Callout элементов */
.content-element.callout {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.content-element.callout .callout-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.content-element.callout .callout-icon {
  font-size: 1.25rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}
.content-element.callout .callout-content {
  flex: 1;
}
.content-element.callout .callout-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}
.content-element.callout .callout-text {
  margin: 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

/* Callout типы */
.content-element.callout.callout-info {
  background: #e3f2fd;
  border-color: #1976d2;
}
.content-element.callout.callout-info .callout-title {
  color: #1976d2;
}
.content-element.callout.callout-warning {
  background: #fff3e0;
  border-color: #f57c00;
}
.content-element.callout.callout-warning .callout-title {
  color: #f57c00;
}
.content-element.callout.callout-error {
  background: #ffebee;
  border-color: #d32f2f;
}
.content-element.callout.callout-error .callout-title {
  color: #d32f2f;
}
.content-element.callout.callout-success {
  background: #e8f5e8;
  border-color: #388e3c;
}
.content-element.callout.callout-success .callout-title {
  color: #388e3c;
}
.content-element.callout.callout-note {
  background: #f3e5f5;
  border-color: #7b1fa2;
}
.content-element.callout.callout-note .callout-title {
  color: #7b1fa2;
}
.content-element.callout.callout-tip {
  background: #e8f8f5;
  border-color: #00796b;
}
.content-element.callout.callout-tip .callout-title {
  color: #00796b;
}

/* Стили для Code Block элементов */
.content-element.code-block {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.content-element.code-block .code-header {
  background: #333333;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.content-element.code-block .code-content {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-x: auto;
  position: relative;
}
.content-element.code-block .line-numbers {
  position: absolute;
  left: 0;
  top: 1rem;
  bottom: 1rem;
  width: 2.5rem;
  background: #1a1a1a;
  color: #666;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  text-align: right;
  line-height: 1.5;
  border-right: 1px solid #444;
}
.content-element.code-block pre {
  margin: 0;
  padding: 0;
  color: #f8f8f2;
  background: transparent;
}
.content-element.code-block.show-line-numbers pre {
  padding-left: 3rem;
}

/* Стили для элементов typewriter */
.typewriter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.typewriter-text-content {
  white-space: nowrap;
  overflow: hidden;
}

.typewriter-cursor {
  animation: blink 1s infinite;
  margin-left: 2px;
  user-select: none;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Responsive design для текстовых элементов */
@media (max-width: 768px) {
  .content-element.blockquote {
    padding: 1rem;
  }
  .content-element.rich-text {
    padding: 0.75rem;
  }
  .content-element.callout {
    padding: 0.75rem 1rem;
  }
  .content-element.code-block .code-header {
    padding: 0.5rem 0.75rem;
  }
  .content-element.code-block .code-content {
    padding: 0.75rem;
  }
}`;

const generateCommonJS = (siteData) => `// Общий JavaScript для многостраничного сайта
console.log('Multi-page site loaded');

// Инициализация React компонентов
document.addEventListener('DOMContentLoaded', function() {
  console.log('React libraries loaded for multi-page site');
  
  // Глобальные переменные для доступа к библиотекам
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.MaterialUI = MaterialUI;
  window.FramerMotion = FramerMotion;
  window.ReactCountUp = ReactCountUp;
  window.ReactConfetti = ReactConfetti;
  window.QRCodeReact = QRCodeReact;
  window.ReactPlayer = ReactPlayer;
  window.ReactRatingStarsComponent = ReactRatingStarsComponent;
  window.ReactTextTransition = ReactTextTransition;
  window.ReactShare = ReactShare;
  window.ReactCopyToClipboard = ReactCopyToClipboard;
  window.ReactColor = ReactColor;
  window.ReactDatepicker = ReactDatepicker;
  window.ReactSelect = ReactSelect;
  window.ReactScroll = ReactScroll;
  window.ReactRnd = ReactRnd;
  window.ReactImageCrop = ReactImageCrop;
  window.ReactMarkdown = ReactMarkdown;
  window.ReactPlotly = ReactPlotly;
  window.ReactApexcharts = ReactApexcharts;
  window.ReactChartjs2 = ReactChartjs2;
  window.Recharts = Recharts;
  window.ApexCharts = ApexCharts;
  window.Chart = Chart;
  window.Plotly = Plotly;
  window.Swiper = Swiper;
  window.axios = axios;
  window.dayjs = dayjs;
  window.marked = marked;
  window.uuid = uuid;
  window.browserImageCompression = browserImageCompression;
  window.FileSaver = FileSaver;
  window.JSZip = JSZip;
  window.Formik = Formik;
  window.yup = yup;
  window.ReactHookForm = ReactHookForm;
  window.HookformResolvers = HookformResolvers;
  window.Slate = Slate;
  window.SlateReact = SlateReact;
  window.SlateHistory = SlateHistory;
  window.TipTapReact = TipTapReact;
  window.TipTapStarterKit = TipTapStarterKit;
  window.TipTapExtensionColor = TipTapExtensionColor;
  window.TipTapExtensionHighlight = TipTapExtensionHighlight;
  window.TipTapExtensionImage = TipTapExtensionImage;
  window.TipTapExtensionLink = TipTapExtensionLink;
  window.TipTapExtensionTable = TipTapExtensionTable;
  window.TipTapExtensionTextAlign = TipTapExtensionTextAlign;
  window.TipTapExtensionUnderline = TipTapExtensionUnderline;
  window.DndKitCore = DndKitCore;
  window.DndKitSortable = DndKitSortable;
  window.DndKitUtilities = DndKitUtilities;
  window.Visx = Visx;
  window.Victory = Victory;
  window.Zustand = Zustand;
  
  console.log('All React libraries initialized successfully');
  
  // Initialize content elements
  initContentElements();
});

// Function to initialize content elements
function initContentElements() {
  // Initialize animated counters
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const start = parseInt(counter.dataset.start) || 0;
        const end = parseInt(counter.dataset.end) || 100;
        const duration = parseInt(counter.dataset.duration) || 2000;
        
        animateCounter(counter, start, end, duration);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
  
  // Initialize typewriter text
  const typewriters = document.querySelectorAll('.typewriter');
  typewriters.forEach(initTypewriter);
}

// Function to animate counters
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const difference = end - start;
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (difference * easeOut));
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Function to initialize typewriter effect
function initTypewriter(element) {
  const texts = JSON.parse(element.dataset.texts || '["Default text"]');
  const speed = parseInt(element.dataset.speed) || 150;
  const pauseTime = parseInt(element.dataset.pause) || 2000;
  const repeat = element.dataset.repeat !== 'false';
  
  // Find the text content span
  const textContentSpan = element.querySelector('.typewriter-text-content');
  if (!textContentSpan) {
    console.error('Typewriter text content span not found');
    return;
  }
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeText() {
    const fullText = texts[textIndex];
    let displayText = '';
    
    if (isDeleting) {
      displayText = fullText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      displayText = fullText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    // Update only the text content, cursor stays separate
    textContentSpan.textContent = displayText;
    
    let typeSpeed = speed;
    
    if (isDeleting) {
      typeSpeed = speed / 2;
    }
    
    if (!isDeleting && charIndex === fullText.length) {
      // Finished typing, pause before deleting
      typeSpeed = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next text
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      
      // If not repeating and we've gone through all texts, stop
      if (!repeat && textIndex === 0) {
        // Show final text and dim cursor
        textContentSpan.textContent = texts[0];
        const cursor = element.querySelector('.typewriter-cursor');
        if (cursor) cursor.style.opacity = '0.3';
        return;
      }
      
      typeSpeed = speed;
    }
    
    setTimeout(typeText, typeSpeed);
  }
  
  // Start the typewriter effect
  typeText();
}`;

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