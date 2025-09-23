import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Button, AppBar, Toolbar, Typography } from '@mui/material';
import EditorPanel from '../components/Editor/EditorPanel';
import PagePreview from '../components/Preview/PagePreview';
import Link from 'next/link';

// Очистка localStorage от данных казино
const clearCasinoData = () => {
  const casinoKeys = [
    'sectionsData',
    'advantages',
    'games', 
    'testimonials',
    'casino-stats',
    'bonuses-section',
    'vip-program',
    'faq-section',
    'news-section',
    'advantagesImageMetadata',
    'casinoData',
    'socialCasinoData'
  ];
  
  casinoKeys.forEach(key => {
    // Исключаем ключи изображений hero
    if (key.includes('ImageMetadata') || key.includes('imageMetadata')) {
      console.log(`Skipping image metadata key: ${key}`);
      return;
    }
    
    if (localStorage.getItem(key)) {
      console.log(`Removing casino data key from localStorage: ${key}`);
      localStorage.removeItem(key);
    }
    if (sessionStorage.getItem(key)) {
      console.log(`Removing casino data key from sessionStorage: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  // Также очищаем все ключи, содержащие casino (НО НЕ ИЗОБРАЖЕНИЯ!)
  Object.keys(localStorage).forEach(key => {
    // Исключаем ключи изображений и метаданных
    if (!key.startsWith('site-images-metadata-') && 
        !key.includes('ImageMetadata') &&
        !key.includes('imageMetadata') &&
        (key.toLowerCase().includes('casino') || key.toLowerCase().includes('social'))) {
      console.log(`Removing casino-related key from localStorage: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage).forEach(key => {
    // Исключаем ключи изображений и метаданных
    if (!key.startsWith('site-images-metadata-') && 
        !key.includes('ImageMetadata') &&
        !key.includes('imageMetadata') &&
        (key.toLowerCase().includes('casino') || key.toLowerCase().includes('social'))) {
      console.log(`Removing casino-related key from sessionStorage: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  // Очищаем все предустановленные секции (НО НЕ GALLERY!)
  const predefinedSectionKeys = [
    'about', 'services', 'features', 'testimonials', 'faq', 'news', 
    'portfolio', 'blog', 'team', 'pricing', 'games', 
    'blackjack', 'poker', 'ruleta'
    // 'gallery' исключена, чтобы не затрагивать изображения галереи
  ];
  
  predefinedSectionKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Removing predefined section from localStorage: ${key}`);
      localStorage.removeItem(key);
    }
    if (sessionStorage.getItem(key)) {
      console.log(`Removing predefined section from sessionStorage: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('All casino data and predefined sections cleared from storage');
};

const initialHeaderData = {
  siteName: 'Мой сайт',
  titleColor: '#1976d2',
  backgroundColor: '#ffffff',
  linksColor: '#333333',
  menuItems: [],
  contactLink: {
    show: true,
    text: 'Контакты',
    url: '#contact',
    color: '#1976d2'
  },
  logo: {
    show: true,
    url: '',
    alt: 'Логотип'
  }
};

const initialHeroData = {
  title: 'Добро пожаловать в мир азарта',
  subtitle: 'Откройте для себя увлекательный мир онлайн-казино с лучшими играми, щедрыми бонусами и безопасными транзакциями. Испытайте удачу в рулетке, покере, блэкджеке и слотах. Присоединяйтесь к тысячам игроков уже сегодня!',
  backgroundType: 'image',
  backgroundColor: '#1a1a1a',
  gradientColor1: '#1a1a1a',
  gradientColor2: '#c41e3a',
  gradientDirection: 'to right',
  backgroundImage: '/images/hero/hero.jpg',
  titleColor: '#c41e3a',
  subtitleColor: '#e2e2e2',
  animationType: 'zoom',
  enableOverlay: true,
  overlayOpacity: 0.1,
  enableBlur: true,
  blurAmount: 0.1
};

const initialSectionsData = {};

const initialContactData = {
  title: 'Контакты',
  description: 'Свяжитесь с нами',
    formTitle: 'Отправить сообщение',
  nameLabel: 'Имя',
    emailLabel: 'Email',
    messageLabel: 'Сообщение',
    submitText: 'Отправить',
  backgroundColor: '#ffffff',
  titleColor: '#1976d2',
  descriptionColor: '#666666'
};

const initialFooterData = {
  siteName: 'Мой сайт',
  description: 'Краткое описание',
  backgroundColor: '#f5f5f5',
  textColor: '#333333',
  linkColor: '#1976d2',
  showSocialLinks: false,
    showLegalLinks: true,
    legalLinks: [
      { text: 'Политика конфиденциальности', url: '/privacy-policy' },
    { text: 'Условия использования', url: '/terms-of-service' }
  ],
  menuItems: []
};

const saveDocumentToFile = async (documentName, content) => {
  try {
    if (!content) {
      console.warn(`Empty content for ${documentName}`);
      return;
    }

    const response = await fetch('/api/save-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentName,
        content: content.trim()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to save document: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully saved ${documentName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error saving ${documentName}:`, error);
    throw error;
  }
};

export default function Home() {
  // Очищаем данные казино при загрузке компонента и загружаем hero изображение
  useEffect(() => {
    clearCasinoData();
    
    // Принудительно загружаем hero изображение в кеш при первой загрузке
    const preloadHeroImage = async () => {
      try {
        console.log('🖼️ [Home] Preloading hero image...');
        const { imageCacheService } = await import('../utils/imageCacheService');
        
        // Проверяем, есть ли уже изображение в кеше
        const existingImage = await imageCacheService.getImage('hero.jpg');
        if (existingImage) {
          console.log('✅ [Home] Hero image already in cache');
          return;
        }
        
        // Загружаем изображение с сервера
        const response = await fetch('/images/hero/hero.jpg');
        if (response.ok) {
          const blob = await response.blob();
          await imageCacheService.saveImage('hero.jpg', blob);
          console.log('✅ [Home] Hero image preloaded and cached successfully');
          
          // Сохраняем метаданные
          const metadata = {
            fileName: 'hero.jpg',
            type: 'image/jpeg',
            size: blob.size,
            uploadDate: new Date().toISOString(),
            isHeroImage: true
          };
          await imageCacheService.saveMetadata('site-images-metadata-hero.jpg', metadata);
        } else {
          console.warn('⚠️ [Home] Failed to preload hero image from server');
        }
      } catch (error) {
        console.error('❌ [Home] Error preloading hero image:', error);
      }
    };
    
    preloadHeroImage();
  }, []);

  const [headerData, setHeaderData] = useState(initialHeaderData);
  const [heroData, setHeroData] = useState(initialHeroData);
  const [sectionsData, setSectionsData] = useState(initialSectionsData);
  const [contactData, setContactData] = useState(initialContactData);
  const [footerData, setFooterData] = useState({
    ...initialFooterData,
    menuItems: initialHeaderData.menuItems,
    showSocialLinks: false,
    legalDocuments: {
      privacyPolicyTitle: 'Политика конфиденциальности',
      termsOfServiceTitle: 'Пользовательское соглашение',
      cookiePolicyTitle: 'Политика использования cookie',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Пользовательское соглашение',
      cookiePolicy: 'Политика использования cookie'
    }
  });
  const [liveChatData, setLiveChatData] = useState({
    enabled: false,
    apiKey: ''
  });

  const [constructorMode, setConstructorMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  const handleConstructorModeChange = (newMode) => {
    setConstructorMode(newMode);
    console.log('Constructor mode changed to:', newMode ? 'Constructor' : 'Manual');
  };

  console.log('Home component state:', {
    headerData,
    heroData,
    sectionsData,
    contactData,
    footerData
  });

  const handleHeaderChange = (newHeaderData) => {
    console.log('handleHeaderChange called with:', newHeaderData);
    setHeaderData(newHeaderData);
    
    setFooterData(prev => ({
        ...prev,
        menuItems: newHeaderData.menuItems,
        backgroundColor: newHeaderData.backgroundColor,
      textColor: newHeaderData.titleColor
    }));

    setHeroData(prev => ({
        ...prev,
        titleColor: newHeaderData.titleColor,
        subtitleColor: newHeaderData.linksColor
    }));
  };

  const handleHeroChange = (newHeroData) => {
    console.log('handleHeroChange called with:', newHeroData);
    setHeroData(newHeroData);
  };

  const handleSectionsChange = (newSectionsData) => {
    console.log('handleSectionsChange called with:', newSectionsData);
    if (newSectionsData && newSectionsData.услуги) {
      console.log('Секция услуги в handleSectionsChange:', newSectionsData.услуги);
      console.log('Elements в услугах:', newSectionsData.услуги.elements ? newSectionsData.услуги.elements.length : 'нет elements');
    }
    setSectionsData(newSectionsData);
  };

  const handleContactChange = (newContactData) => {
    console.log('handleContactChange called with:', newContactData);
    setContactData(newContactData);
  };

  const handleFooterChange = (newFooterData) => {
    console.log('handleFooterChange called with:', newFooterData);
    setFooterData(newFooterData);
  };

  const handleLegalDocumentsChange = async (documents) => {
    console.log('handleLegalDocumentsChange called with:', documents);
    
    try {
      setFooterData(prev => ({
          ...prev,
          legalDocuments: {
            ...prev.legalDocuments,
            ...documents
          }
      }));

      const savePromises = [
        saveDocumentToFile('privacy-policy', documents.privacyPolicy),
        saveDocumentToFile('terms-of-service', documents.termsOfService),
        saveDocumentToFile('cookie-policy', documents.cookiePolicy)
      ];

      const results = await Promise.allSettled(savePromises);
      
      const hasErrors = results.some(result => result.status === 'rejected');
      if (hasErrors) {
        console.error('Some documents failed to save:', results);
      }
    } catch (error) {
      console.error('Error in handleLegalDocumentsChange:', error);
    }
  };

  const handleLiveChatChange = (newLiveChatData) => {
    console.log('handleLiveChatChange called with:', newLiveChatData);
    setLiveChatData(newLiveChatData);
  };

  const handleElementSelect = (sectionId, elementId) => {
    console.log('Element selected:', { sectionId, elementId });
    setSelectedElement({ sectionId, elementId });
  };

  const handleElementDeselect = () => {
    setSelectedElement(null);
  };

  const handleElementUpdate = (sectionId, elementId, fieldOrElement, value) => {
    console.log('[index.jsx] Element update:', { sectionId, elementId, fieldOrElement, value });
    
    setSectionsData(prevSections => {
      const updatedSections = { ...prevSections };
      const section = updatedSections[sectionId];
      
      // Если поле 'add', добавляем новый элемент
      if (fieldOrElement === 'add' && typeof value === 'object' && value !== null) {
        if (section) {
          const currentElements = section.contentElements || [];
          const updatedElements = [...currentElements, value];
          
          updatedSections[sectionId] = {
            ...section,
            contentElements: updatedElements
          };
        } else {
          // Создаем новую секцию если она не существует
          updatedSections[sectionId] = {
            id: sectionId,
            title: sectionId === 'hero' ? 'Hero секция' : `Секция ${sectionId}`,
            contentElements: [value]
          };
        }
        return updatedSections;
      }
      
      if (section && section.contentElements) {
        const updatedElements = section.contentElements.map(element => {
          if (element.id === elementId) {
            if (typeof fieldOrElement === 'object' && fieldOrElement !== null && fieldOrElement.id) {
              console.log('🎴 [index.jsx] Updating multiple-cards element:', elementId);
              console.log('🎴 [index.jsx] Old element:', element);
              console.log('🎴 [index.jsx] New element:', fieldOrElement);
              return fieldOrElement;
            }
            else if (fieldOrElement === 'customStyles' && typeof value === 'object' && value !== null) {
              console.log('🎯 [index.jsx] Updating customStyles for element:', elementId, 'with value:', value);
              return { ...element, customStyles: value };
            }
            else if (fieldOrElement === 'data' && typeof value === 'object' && value !== null) {
              console.log('🔧 [index.jsx] Updating element data:', elementId, 'type:', element.type);
              console.log('🔧 [index.jsx] Current element.data:', element.data);
              console.log('🔧 [index.jsx] New value:', value);
              
              // 🔥 ИСПРАВЛЕНИЕ: Для multiple-cards, продвинутых диаграмм, временной шкалы, CTA секции и других элементов с colorSettings обновляем все поля
              if (['advanced-area-chart', 'advanced-pie-chart', 'advanced-line-chart', 'multiple-cards', 'timeline-component', 'accordion', 'qr-code', 'rating', 'progress-bars', 'cta-section'].includes(element.type)) {
                console.log('🔧 [index.jsx] Advanced element - updating all fields');
                const updated = { ...element, ...value };
                console.log('🔧 [index.jsx] Updated advanced element:', updated);
                return updated;
              } else {
                const updated = { ...element, data: { ...element.data, ...value } };
                console.log('🔧 [index.jsx] Updated regular element:', updated);
                return updated;
              }
            } else {
              return { ...element, data: { ...element.data, [fieldOrElement]: value } };
            }
          }
          return element;
        });
        
        updatedSections[sectionId] = {
          ...section,
          contentElements: updatedElements
        };
      }
      
      return updatedSections;
    });
  };

  const handleAddElement = (sectionId, newElement) => {
    console.log('Adding new element to section:', { sectionId, newElement });
    
    setSectionsData(prevSections => {
      const updatedSections = { ...prevSections };
      const section = updatedSections[sectionId];
      
      if (section) {
        const currentElements = section.contentElements || [];
        const updatedElements = [...currentElements, {
          id: Date.now(),
          ...newElement,
          timestamp: new Date().toISOString()
        }];
        
        updatedSections[sectionId] = {
          ...section,
          contentElements: updatedElements
        };
      }
      
      return updatedSections;
    });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Навигационная панель */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏗️ Конструктор сайтов
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href="/" passHref>
              <Button color="inherit">Главная</Button>
            </Link>
            <Link href="/test-image-system" passHref>
              <Button color="inherit" variant="outlined">
                🖼️ Тест изображений
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Основной контент */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        flexGrow: 1,
        height: 'calc(100vh - 64px)'
      }}>
      <Box sx={{ 
        width: isMobile ? '100%' : '400px',
        flexShrink: 0,
        borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
        borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
        overflow: 'auto',
        maxHeight: isMobile ? '50vh' : '100vh',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '2px',
        },
      }}>
        <EditorPanel
          headerData={headerData}
          onHeaderChange={handleHeaderChange}
          sectionsData={sectionsData}
          onSectionsChange={handleSectionsChange}
          heroData={heroData}
          onHeroChange={handleHeroChange}
          contactData={contactData}
          onContactChange={handleContactChange}
          footerData={footerData}
          onFooterChange={handleFooterChange}
          legalDocuments={footerData.legalDocuments}
          onLegalDocumentsChange={handleLegalDocumentsChange}
          liveChatData={liveChatData}
          onLiveChatChange={handleLiveChatChange}
          constructorMode={constructorMode}
          onConstructorModeChange={handleConstructorModeChange}
          selectedElement={selectedElement}
          onElementDeselect={handleElementDeselect}
          onElementUpdate={handleElementUpdate}
        />
      </Box>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        height: isMobile ? '50vh' : '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <PagePreview
          headerData={headerData}
          heroData={heroData}
          sectionsData={sectionsData}
          footerData={footerData}
          contactData={contactData}
          legalDocuments={footerData.legalDocuments}
          liveChatData={liveChatData}
          constructorMode={constructorMode}
          selectedElement={selectedElement}
          onElementSelect={handleElementSelect}
          onElementUpdate={handleElementUpdate}
          onAddElement={handleAddElement}
        />
      </Box>
      </Box>
    </Box>
  );
} 