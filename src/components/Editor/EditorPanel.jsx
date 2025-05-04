import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Grid, TextField, Button, Collapse, Stack, IconButton, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HeaderEditor from './HeaderEditor';
import HeroEditor from './HeroEditor';
import ContactEditor from './ContactEditor';
import FooterEditor from './FooterEditor';
import LegalDocumentsEditor from './LegalDocumentsEditor';
import AiParser from '../AiParser/AiParser'; // Импорт компонента AiParser
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import { CARD_TYPES } from '../../utils/configUtils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportSite } from '../../utils/siteExporter';
import Slider from '@mui/material/Slider';
import { imageCacheService } from '../../utils/imageCacheService';
import imageCompression from 'browser-image-compression';
import AuthPanel from '../Auth/AuthPanel';


const EditorPanel = ({
  headerData = {
    siteName: 'Мой сайт',
    titleColor: '#000000',
    backgroundColor: '#ffffff',
    linksColor: '#000000',
    siteBackgroundColor: '#f8f9fa',
    siteBackgroundType: 'solid',
    siteGradientColor1: '#ffffff',
    siteGradientColor2: '#f5f5f5',
    siteGradientDirection: 'to right',
    menuItems: [],
    language: 'ru'
  },
  onHeaderChange,
  sectionsData,
  onSectionsChange,
  heroData,
  onHeroChange,
  contactData,
  onContactChange,
  footerData,
  onFooterChange,
  legalDocuments,
  onLegalDocumentsChange
}) => {
  console.log('EditorPanel received props:', {
    headerData,
    heroData,
    sectionsData,
    contactData,
    footerData,
    legalDocuments
  });

  const [expandedSections, setExpandedSections] = React.useState({
    header: false,
    hero: false,
    menu: false,
    menuItems: {
      'about': false
    },
    contact: false,
    footer: false,
    legal: false
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Объединенный useEffect для всех проверок и отслеживаний
  useEffect(() => {
    // Проверка авторизации
    const auth = localStorage.getItem('editorAuth');
    const authTime = localStorage.getItem('editorAuthTime');
    const currentTime = new Date().getTime();
    
    // Проверяем, не истекло ли время авторизации (2 часа = 7200000 миллисекунд)
    if (auth === 'true' && authTime && (currentTime - parseInt(authTime)) < 7200000) {
      setIsAuthenticated(true);
    } else {
      // Если время истекло, очищаем данные авторизации
      localStorage.removeItem('editorAuth');
      localStorage.removeItem('editorAuthTime');
      setIsAuthenticated(false);
    }

    // Обработчик предотвращения навигации
    const handlePreventNavigation = (event) => {
      // Если язык не указан, предотвращаем переход
      if (!headerData.language || (typeof headerData.language === 'string' && headerData.language.trim() === '')) {
        event.preventDefault();
        // Возвращаем секцию шапки в развернутое состояние
        setExpandedSections(prev => ({
          ...prev,
          header: true
        }));
      }
    };

    window.addEventListener('preventNavigation', handlePreventNavigation);

    // Отслеживание изменений в sectionsData
    console.log('sectionsData changed:', sectionsData);
    if (sectionsData.features) {
      console.log('Features section current state:', sectionsData.features);
    }

    return () => {
      window.removeEventListener('preventNavigation', handlePreventNavigation);
    };
  }, [headerData.language, sectionsData]);

  const handleAuth = (success) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('editorAuth', 'true');
      localStorage.setItem('editorAuthTime', new Date().getTime().toString());
    }
  };

  if (!isAuthenticated) {
    return <AuthPanel onAuth={handleAuth} />;
  }

  const toggleSection = (section) => {
    // Проверяем язык перед переключением секции
    if (section !== 'header' && (!headerData.language || (typeof headerData.language === 'string' && headerData.language.trim() === ''))) {
      // Если язык не указан, оставляем секцию шапки развернутой
      setExpandedSections(prev => ({
        ...prev,
        header: true
      }));
      return;
    }

    setExpandedSections(prev => {
      const newState = { ...prev };
      
      // Если это подпункт меню (начинается с menuItem_)
      if (section.startsWith('menuItem_')) {
        const menuItemId = section.replace('menuItem_', '');
        // Создаем новый объект menuItems, где все пункты закрыты
        const newMenuItems = {};
        // Если пункт уже был открыт, просто закрываем его
        if (prev.menuItems[menuItemId]) {
          newState.menuItems = newMenuItems;
        } else {
          // Если пункт был закрыт, закрываем все остальные и открываем его
          newMenuItems[menuItemId] = true;
          newState.menuItems = newMenuItems;
          
          // Прокручиваем к соответствующему разделу на сайте
          setTimeout(() => {
            const targetSection = document.getElementById(menuItemId);
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
        return newState;
      }
      
      // Если это основной раздел
      // Если секция уже открыта, просто закрываем её
      if (newState[section]) {
        newState[section] = false;
        return newState;
      }
      
      // Если секция закрыта, закрываем все остальные и открываем её
      Object.keys(newState).forEach(key => {
        if (key !== 'menuItems') {
          newState[key] = key === section;
        }
      });

      // Прокручиваем к соответствующему разделу на сайте
      setTimeout(() => {
        const targetSection = document.getElementById(section);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return newState;
    });
  };

  const handleChange = (field, value) => {
    console.log('handleChange called in EditorPanel:', { field, value });
    console.log('Current heroData:', heroData);
    
    // Ensure we're working with a fresh copy of the data
    const newHeroData = { ...heroData };
    
    // Handle color fields specifically
    if (field.includes('Color')) {
      console.log('Color field detected:', field);
      // Ensure the color value is properly formatted
      if (!value.startsWith('#')) {
        value = `#${value}`;
      }
      console.log('Formatted color value:', value);
    }
    
    newHeroData[field] = value;
    console.log('New heroData to be set:', newHeroData);
    onHeroChange(newHeroData);
  };

  const handleAddMenuItem = (sectionId) => {
    const newId = `section_${Date.now()}`;
    const newMenuItem = {
      id: newId,
      text: 'Новый пункт меню',
      title: '',
      description: '',
      image: '',
      link: `#${newId}`,
      cardType: CARD_TYPES.NONE,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    // Проверяем, что ID уникален
    const isIdUnique = !headerData.menuItems.some(item => item.id === newId);
    if (!isIdUnique) {
      console.error('ID уже существует, генерируем новый');
      return handleAddMenuItem(sectionId);
    }

    // Добавляем новый пункт меню в headerData
    const updatedMenuItems = [...headerData.menuItems, newMenuItem];
    onHeaderChange({ ...headerData, menuItems: updatedMenuItems });

    // Создаем новую секцию с тем же ID
    const newSection = {
      id: newId,
      title: '',
      description: '',
      cardType: CARD_TYPES.NONE,
      cards: []
    };

    // Обновляем sectionsData как объект
    onSectionsChange({ ...sectionsData, [newId]: newSection });

    // Открываем новый раздел в редакторе
    setExpandedSections(prev => ({
      ...prev,
      menuItems: {
        ...prev.menuItems,
        [newId]: true
      }
    }));
  };

  const handleMenuItemChange = (id, field, value) => {
    console.log('handleMenuItemChange called:', { id, field, value });
    console.log('Current headerData:', headerData);
    
    // Обновляем пункт меню
    const updatedMenuItems = headerData.menuItems.map(item => {
      if (item.id === id) {
        // Если меняется ID, обновляем также и ссылку
        if (field === 'id') {
          return { ...item, [field]: value, link: `#${value}` };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    
    const newHeaderData = { ...headerData, menuItems: updatedMenuItems };
    console.log('New headerData to be set:', newHeaderData);
    onHeaderChange(newHeaderData);

    // Проверяем, существует ли секция
    let sectionExists = sectionsData[id] !== undefined;
    
    if (!sectionExists) {
      // Если секции нет, создаем новую с базовыми параметрами
      const newSection = {
        id: id,
        title: '',
        description: '',
        cardType: CARD_TYPES.NONE,
        cards: [],
        titleColor: '#000000',
        descriptionColor: '#666666'
      };
      onSectionsChange({ ...sectionsData, [id]: newSection });
    }

    // Если меняется ID, обновляем также и ID секции
    if (field === 'id') {
      const { [id]: oldSection, ...restSections } = sectionsData;
      if (oldSection) {
        onSectionsChange({ ...restSections, [value]: { ...oldSection, id: value } });
      }
    }
  };

  const handleDeleteMenuItem = (id) => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      const updatedMenuItems = headerData.menuItems.filter(item => item.id !== sectionToDelete);
      onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
      
      // Удаляем секцию из объекта sectionsData
      const { [sectionToDelete]: deletedSection, ...restSections } = sectionsData;
      onSectionsChange(restSections);
      
      setExpandedSections(prev => {
        const newState = { ...prev };
        delete newState.menuItems[sectionToDelete];
        return newState;
      });
    }
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleSectionChange = (id, field, value) => {
    console.log('handleSectionChange called:', { id, field, value });
    
    // Проверяем, существует ли секция
    let sectionExists = sectionsData[id] !== undefined;
    
    if (!sectionExists) {
      // Если секции нет, создаем новую с базовыми параметрами
      const newSection = {
        id: id,
        title: '',
        description: '',
        cardType: CARD_TYPES.ACCENT,
        cards: [],
        titleColor: '#0d47a1',
        descriptionColor: '#546e7a',
        backgroundType: 'gradient'
      };
      onSectionsChange({ ...sectionsData, [id]: newSection });
    }

    // Обновляем существующую секцию
    onSectionsChange({
      ...sectionsData,
      [id]: {
        ...sectionsData[id],
        [field]: value
      }
    });
  };

  const handleSectionImageUpload = async (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Сжатие изображения
      let compressedFile;
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
          useWebWorker: true
        };
        
        compressedFile = await imageCompression(file, options);
      } catch (compressionError) {
        console.warn('Ошибка сжатия изображения, используем оригинал:', compressionError);
        compressedFile = file;
      }
      
      // Создаем FormData
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('sectionId', id); // Добавляем ID секции для именования файла
      
      // Отправляем запрос на сервер с обработкой ошибок
      let response;
      try {
        response = await fetch('/api/upload-section-image', {
          method: 'POST',
          body: formData
        });
      } catch (networkError) {
        console.error('Ошибка сети при загрузке:', networkError);
        throw new Error('Ошибка соединения. Проверьте подключение к интернету.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка загрузки:', response.status, errorData);
        throw new Error(errorData.message || `Ошибка загрузки: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Ошибка при разборе ответа:', jsonError);
        throw new Error('Ошибка при обработке ответа сервера');
      }
      
      // Сохраняем метаданные изображения в localStorage
      const imageMetadata = {
        filename: data.path.split('/').pop(),
        originalPath: data.path,
        timestamp: Date.now()
      };
      
      console.log('Метаданные изображения секции:', imageMetadata);
      localStorage.setItem(`section_${id}_ImageMetadata`, JSON.stringify(imageMetadata));
      
      // Кешируем изображение
      try {
        // Добавляем временную метку, чтобы избежать кеширования браузером
        const imageUrl = `${data.path}?t=${Date.now()}`;
        const imageBlob = await (await fetch(imageUrl)).blob();
        await imageCacheService.saveImage(imageMetadata.filename, imageBlob);
      } catch (cacheError) {
        console.warn('Ошибка при кешировании изображения:', cacheError);
        // Продолжаем выполнение, кеширование некритично
      }
      
      // Обновляем путь к изображению в данных секции
      onSectionsChange({
        ...sectionsData,
        [id]: {
          ...sectionsData[id],
          imagePath: data.path
        }
      });
      
      // Отправляем сообщение в превью для обновления изображения
      try {
        // Находим iframe с превью
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          // Отправляем сообщение с информацией об обновлении изображения
          previewIframe.contentWindow.postMessage({
            type: 'UPDATE_SECTION_IMAGE',
            sectionId: id,
            imagePath: data.path
          }, '*');
          console.log(`Отправлено сообщение для обновления изображения секции ${id}`);
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
        // Не критичная ошибка, продолжаем выполнение
      }
      
      alert('Изображение успешно загружено');
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert(error.message || 'Произошла ошибка при загрузке изображения');
    }
  };

  const handleCardChange = (sectionId, cardId, field, value) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    // Определяем, является ли поле стилевым
    const isStyleField = [
      'titleColor',
      'contentColor',
      'backgroundType',
      'backgroundColor',
      'gradientColor1',
      'gradientColor2',
      'gradientDirection',
      'borderColor',
      'style'
    ].includes(field);

    const updatedCards = section.cards.map(card => {
      // Если это поле стиля, применяем его ко всем карточкам
      if (isStyleField) {
        return { ...card, [field]: value };
      }
      // Если это поле контента, применяем только к выбранной карточке
      if (card.id === cardId) {
        return { ...card, [field]: value };
      }
      return card;
    });

    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: updatedCards
      }
    });
  };

  const handleAddCard = (sectionId) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    // Проверяем, что секция поддерживает карточки
    if (section.cardType === CARD_TYPES.NONE) {
      console.warn('Нельзя добавить карточку в секцию с типом NONE');
      return;
    }

    // Генерируем новый ID для карточки
    let newCardId;
    if (!section.cards || section.cards.length === 0) {
      newCardId = 1;
      } else {
      // Находим максимальный ID среди существующих карточек
      const maxId = Math.max(...section.cards.map(card => {
        const id = parseInt(card.id);
        return isNaN(id) ? 0 : id;
      }));
      newCardId = maxId + 1;
    }

    console.log('Generating new card with ID:', newCardId);
    
    // Берем стили из первой карточки, если она есть
    const firstCard = (section.cards && section.cards[0]) || {};
    
    // Создаем новую карточку
    const newCard = {
      id: newCardId,
      title: `Карточка ${newCardId}`,
      content: 'Содержимое карточки',
      showTitle: true,
      titleColor: firstCard.titleColor || '#333333',
      contentColor: firstCard.contentColor || '#666666',
      backgroundType: firstCard.backgroundType || 'solid',
      backgroundColor: firstCard.backgroundColor || '#ffffff',
      gradientColor1: firstCard.gradientColor1 || '#ffffff',
      gradientColor2: firstCard.gradientColor2 || '#f5f5f5',
      gradientDirection: firstCard.gradientDirection || 'to right',
      borderColor: firstCard.borderColor || '#e0e0e0',
      style: {
        shadow: firstCard.style?.shadow || '0 2px 4px rgba(0,0,0,0.05)',
        borderRadius: firstCard.style?.borderRadius || '12px'
      }
    };

    // Обновляем секцию с новой карточкой
    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: [...section.cards, newCard]
      }
    });
  };

  const handleDeleteCard = (sectionId, cardId) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    const updatedCards = section.cards.filter(card => card.id !== cardId);
    
    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: updatedCards
      }
    });
  };

  const handleLegalDocumentsSave = (documents) => {
    console.log('Saving legal documents:', documents);
    if (onLegalDocumentsChange) {
      onLegalDocumentsChange(documents);
    }
  };

  const generateHTML = (data) => {
    return `<!DOCTYPE html>
<html lang="${data.headerData.language || 'ru'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headerData.title || data.headerData.siteName}</title>
  <link rel="icon" type="image/png" href="assets/images/Favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta name="description" content="${data.headerData.description || 'Наш сайт предлагает лучшие решения'}">
</head>
<body>
  ${data.headerData.siteBackgroundType === 'image' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('assets/images/fon.jpg');
    background-size: cover;
    background-position: center;
    filter: ${data.headerData.siteBackgroundBlur ? `blur(${data.headerData.siteBackgroundBlur}px)` : 'none'};
    z-index: -2;
  "></div>
  ${data.headerData.siteBackgroundDarkness ? `
  <div class="site-overlay" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, ${data.headerData.siteBackgroundDarkness / 100});
    z-index: -1;
  "></div>
  ` : ''}
  ` : data.headerData.siteBackgroundType === 'gradient' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(${data.headerData.siteGradientDirection || 'to right'}, 
      ${data.headerData.siteGradientColor1 || '#ffffff'}, 
      ${data.headerData.siteGradientColor2 || '#f5f5f5'});
    z-index: -2;
  "></div>
  ` : data.headerData.siteBackgroundType === 'solid' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${data.headerData.siteBackgroundColor || '#ffffff'};
    z-index: -2;
  "></div>
  ` : ''}
  <header>
    <nav style="background-color: ${data.headerData.backgroundColor || '#ffffff'};">
      <div class="nav-container">
        <div class="logo" style="color: ${data.headerData.titleColor || '#000000'}">${data.headerData.siteName || 'Мой сайт'}</div>
        <button class="menu-toggle" aria-label="Меню">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu">
          ${data.headerData.menuItems.map(item => `
            <li>
              <a href="#${item.id}" style="
                color: ${data.headerData.linksColor || '#000000'};
                font-size: ${data.headerData.styles?.menuItemFontSize || '16px'};
                font-weight: ${data.headerData.styles?.menuItemFontWeight || '500'};
                transition: ${data.headerData.styles?.menuItemTransition || '0.3s'};
              ">${item.text}</a>
            </li>
          `).join('')}
          <li>
            <a href="#contact" style="
              color: ${data.headerData.linksColor || '#000000'};
              font-size: ${data.headerData.styles?.menuItemFontSize || '16px'};
              font-weight: ${data.headerData.styles?.menuItemFontWeight || '500'};
              transition: ${data.headerData.styles?.menuItemTransition || '0.3s'};
            ">${data.contactData.title || 'Свяжитесь с нами'}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <main>
    <section id="hero" class="hero" style="
      ${data.heroData.backgroundType === 'solid' ? `background-color: ${data.heroData.backgroundColor || '#ffffff'};` : ''}
      ${data.heroData.backgroundType === 'gradient' ? `background: linear-gradient(${data.heroData.gradientDirection || 'to right'}, ${data.heroData.gradientColor1 || '#ffffff'}, ${data.heroData.gradientColor2 || '#f5f5f5'});` : ''}
      ${data.heroData.backgroundType === 'image' ? `background-image: url('assets/images/hero.jpg'); background-size: cover; background-position: center;` : ''}
    ">
      ${data.heroData.enableOverlay ? `
        <div class="hero-overlay" style="
          background: linear-gradient(rgba(0,0,0,${data.heroData.overlayOpacity / 100 || 0.5}), rgba(0,0,0,${data.heroData.overlayOpacity / 100 || 0.5}));
          backdrop-filter: ${data.heroData.enableBlur ? `blur(${data.heroData.blurAmount || 5}px)` : 'none'};
        "></div>
      ` : ''}
      <div class="hero-content">
        <h1 style="color: ${data.heroData.titleColor || '#ffffff'}">${data.heroData.title || ''}</h1>
        <p style="color: ${data.heroData.subtitleColor || '#ffffff'}">${data.heroData.subtitle || ''}</p>
        <div style="display: flex; gap: 1rem; justify-content: center; align-items: center;">
          ${data.heroData.buttonText ? `
            <button style="
              background-color: ${data.heroData.buttonColor || '#1976d2'};
              color: ${data.heroData.buttonTextColor || '#ffffff'};
            ">${data.heroData.buttonText}</button>
          ` : ''}
          <a href="#contact" style="
            color: ${data.heroData.buttonTextColor || '#ffffff'};
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border: 2px solid ${data.heroData.buttonTextColor || '#ffffff'};
            border-radius: 4px;
            transition: all 0.3s ease;
            font-weight: 500;
          ">${data.contactData.title || 'Свяжитесь с нами'}</a>
        </div>
      </div>
    </section>

    ${data.sectionsData.map(section => {
      // Получаем цвета из карточек секции для градиента рамки
      const getBorderColors = () => {
        if (section.cards && section.cards.length > 0) {
          const firstCard = section.cards[0];
          const lastCard = section.cards[section.cards.length - 1];
          
          // Используем цвет обводки карточки
          const startColor = firstCard.borderColor || '#1976d2';
          const endColor = lastCard.borderColor || '#64b5f6';

          return {
            start: startColor,
            end: endColor
          };
        }
        
        // Если карточек нет, используем цвета по умолчанию
        return {
          start: '#1976d2',
          end: '#64b5f6'
        };
      };

      const borderColors = getBorderColors();

      // Старый блок: если есть карточки, рендерим как раньше
      const cardsCount = (section.cards || []).length;
      let cardsClass = '';
      if (cardsCount === 2) cardsClass = 'cards-2';
      if (cardsCount === 3) cardsClass = 'cards-3';
      return `
        <section id="${section.id}" class="section" style="
          --border-start-color: ${borderColors.start};
          --border-end-color: ${borderColors.end};
          ${section.id === 'about' ? '' : section.backgroundImage ? `background-image: url('${section.backgroundImage}'); background-size: cover; background-position: center;` : ''}
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        ">
          ${section.enableOverlay ? `
            <div class="section-overlay" style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, ${section.overlayOpacity || 0.5});
              z-index: 1;
              border-radius: 20px;
            "></div>
          ` : ''}
          ${section.backgroundImage && section.enableBlur ? `
            <div class="section-background-blur" style="
              position: absolute;
              top: -5%;
              left: -5%;
              right: -5%;
              bottom: -5%;
              background-image: url('${section.backgroundImage}');
              background-size: cover;
              background-position: center;
              filter: blur(${section.blurAmount || 5}px);
              z-index: 0;
              animation: zoomIn 20s ease-in-out infinite alternate;
              border-radius: 20px;
            "></div>
          ` : ''}
          <div class="section-container" style="position: relative; z-index: 2;">
            ${section.id === 'about' ? `
              <div class="about-section">
                <div class="about-image">
                  <img src="assets/images/about.jpg" alt="About us" loading="lazy">
                </div>
                <div class="about-content">
                  <h2 style="color: ${section.titleColor || '#000000'}">${section.title || ''}</h2>
                  ${section.description ? `
                    <p style="color: ${section.descriptionColor || '#666666'}">${section.description}</p>
                  ` : ''}
                </div>
              </div>
            ` : `
              <div class="section-header">
                <h2 style="color: ${section.titleColor || '#000000'}">${section.title || ''}</h2>
                ${section.description ? `
                  <p style="color: ${section.descriptionColor || '#666666'}">${section.description}</p>
                ` : ''}
              </div>
              ${section.imagePath ? `
                <div class="section-image">
                  <img src="assets/images/${section.imagePath.split('/').pop()}" alt="${section.title || 'Section image'}" loading="lazy">
                </div>
              ` : ''}
            `}
            <div class="cards-container${cardsClass ? ' ' + cardsClass : ''}">
              ${(section.cards || []).map(card => `
                <div class="card ${section.cardType}" data-card-id="${card.id}" style="
                  ${card.backgroundType === 'solid' ? `background-color: ${card.backgroundColor || '#ffffff'};` : ''}
                  ${card.backgroundType === 'gradient' ? `background: linear-gradient(${card.gradientDirection || 'to right'}, ${card.gradientColor1 || '#ffffff'}, ${card.gradientColor2 || '#f5f5f5'});` : ''}
                  border: 3px solid ${card.borderColor || '#e0e0e0'};
                  box-shadow: ${card.style?.shadow || '0 2px 4px rgba(0,0,0,0.05)'};
                  border-radius: ${card.style?.borderRadius || '12px'};
                  position: relative;
                  z-index: 2;
                ">
                  ${card.showTitle ? `
                    <div class="card-header">
                      <h3 style="color: ${card.titleColor || '#333333'}">
                        ${card.title.trim()}
                      </h3>
                    </div>
                  ` : ''}
                  <div class="card-content" style="color: ${card.contentColor || '#666666'}">
                    <div class="content-wrapper">
                      ${card.content.trim()}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
    }).join('')}

    <section id="contact" class="contact">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
          <h2 style="
            color: ${contactData.titleColor || '#000000'};
            font-size: 2.5rem;
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
          ">
            ${contactData.title || 'Контакты'}
            <span style="
              content: '';
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 50px;
              height: 3px;
              background-color: ${contactData.titleColor || '#000000'};
            "></span>
          </h2>
          <p style="
            color: ${contactData.descriptionColor || '#666666'};
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          ">
            ${contactData.description || 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время'}
          </p>
        </div>
        <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div class="contact-form" style="
            border: 1px solid ${contactData.formBorderColor || '#1976d2'};
            padding: 2rem;
            border-radius: 8px;
            background-color: ${contactData.formBackgroundColor || '#ffffff'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            <form id="contactForm" onsubmit="handleSubmit(event)">
              <div class="form-group">
                <label for="name" style="color: ${contactData.labelColor || '#333'}">Name</label>
                <input type="text" id="name" class="form-control" placeholder="Enter your name" style="
                  border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                  background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                  color: ${contactData.inputTextColor || '#333'};
                  padding: 0.75rem;
                  width: 100%;
                  border-radius: 4px;
                  margin-bottom: 1rem;
                ">
              </div>
              <div class="form-group">
                <label for="email" style="color: ${contactData.labelColor || '#333'}">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Enter your email" style="
                  border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                  background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                  color: ${contactData.inputTextColor || '#333'};
                  padding: 0.75rem;
                  width: 100%;
                  border-radius: 4px;
                  margin-bottom: 1rem;
                ">
              </div>
              <div class="form-group">
                <label for="phone" style="color: ${contactData.labelColor || '#333'}">Phone Number</label>
                <input type="number" id="phone" class="form-control" placeholder="Enter your phone number" style="
                  border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                  background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                  color: ${contactData.inputTextColor || '#333'};
                  padding: 0.75rem;
                  width: 100%;
                  border-radius: 4px;
                  margin-bottom: 1rem;
                " pattern="[0-9]*" inputmode="numeric">
              </div>
              <div class="form-group">
                <label for="country" style="color: ${contactData.labelColor || '#333'}">Country</label>
                <select id="country" class="form-control" style="
                  border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                  background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                  color: ${contactData.inputTextColor || '#333'};
                  padding: 0.75rem;
                  width: 100%;
                  border-radius: 4px;
                  margin-bottom: 1rem;
                ">
                  <option value="">Select your country</option>
                  <option value="RU">Russia</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="CN">China</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="MX">Mexico</option>
                  <option value="AR">Argentina</option>
                  <option value="ZA">South Africa</option>
                  <option value="EG">Egypt</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SG">Singapore</option>
                  <option value="KR">South Korea</option>
                  <option value="ID">Indonesia</option>
                  <option value="TH">Thailand</option>
                  <option value="VN">Vietnam</option>
                  <option value="MY">Malaysia</option>
                  <option value="PH">Philippines</option>
                  <option value="TR">Turkey</option>
                  <option value="PL">Poland</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="CH">Switzerland</option>
                  <option value="AT">Austria</option>
                  <option value="BE">Belgium</option>
                  <option value="PT">Portugal</option>
                  <option value="GR">Greece</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="HU">Hungary</option>
                  <option value="RO">Romania</option>
                  <option value="UA">Ukraine</option>
                  <option value="KZ">Kazakhstan</option>
                  <option value="BY">Belarus</option>
                </select>
              </div>
              <div class="form-group">
                <label for="message" style="color: ${contactData.labelColor || '#333'}">Message</label>
                <textarea id="message" class="form-control" placeholder="Enter your message" style="
                  border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                  background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                  color: ${contactData.inputTextColor || '#333'};
                  padding: 0.75rem;
                  width: 100%;
                  border-radius: 4px;
                  min-height: 150px;
                  resize: vertical;
                  margin-bottom: 1rem;
                "></textarea>
              </div>
              <button type="submit" class="submit-btn" style="
                background-color: ${contactData.buttonColor || '#1976d2'};
                color: ${contactData.buttonTextColor || '#ffffff'};
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                width: 100%;
              ">Send Message</button>
            </form>
          </div>
          <div class="contact-info" style="
            border: 1px solid ${contactData.infoBorderColor || '#1976d2'};
            border-radius: 8px;
            background-color: ${contactData.infoBackgroundColor || '#ffffff'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          ">
            <div class="company-info" style="
              padding: 2rem;
              border-bottom: 1px solid ${contactData.infoBorderColor || '#1976d2'};
            ">
              <h3 style="
                color: ${contactData.infoTitleColor || '#333'};
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                text-align: center;
              ">${contactData.companyName || 'Наша компания'}</h3>
              <div class="contact-details">
                ${contactData.address ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.address}
                  </p>
                ` : ''}
                ${contactData.phone ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-phone" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.phone}
                  </p>
                ` : ''}
                ${contactData.email ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-envelope" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.email}
                  </p>
                ` : ''}
              </div>
            </div>
            <div class="contact-map" style="height: 300px;">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactData.address || '')}"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer style="
    background-color: ${data.footerData.backgroundColor || '#1a1a1a'};
    color: ${data.footerData.textColor || '#fff'};
    padding: 3rem 0;
    position: relative;
    z-index: 1;
  ">
    <div style="
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    ">
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      ">
        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">${data.contactData.companyName || 'Company Name'}</h3>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-map-marker-alt" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.address || 'Address'}
          </p>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-phone" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.phone || 'Phone'}
          </p>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-envelope" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.email || 'Email'}
          </p>
        </div>

        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">Menu</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          ">
            ${data.headerData.menuItems.map(item => `
              <a href="#${item.id}" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
                padding: 0.25rem 0;
              ">${item.text}</a>
            `).join('')}
            <a href="#contact" style="
              color: ${data.footerData.textColor || '#fff'};
              text-decoration: none;
              transition: color 0.3s;
              padding: 0.25rem 0;
            ">${data.contactData.title || 'Свяжитесь с нами'}</a>
          </div>
        </div>

        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">Legal Information</h3>
          <ul style="
            list-style: none;
            padding: 0;
            margin: 0;
          ">
            <li style="margin-bottom: 0.5rem;">
              <a href="privacy-policy.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.privacyPolicy?.title || 'Privacy Policy'}</a>
            </li>
            <li style="margin-bottom: 0.5rem;">
              <a href="terms-of-service.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.termsOfService?.title || 'Terms of Service'}</a>
            </li>
            <li>
              <a href="cookie-policy.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.cookiePolicy?.title || 'Cookie Policy'}</a>
            </li>
          </ul>
        </div>
      </div>

      <div style="
        text-align: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <p style="
          color: ${data.footerData.textColor || '#fff'};
          font-size: 0.9rem;
        ">
          © ${new Date().getFullYear()} ${data.contactData.companyName || 'Company Name'}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  <!-- Modal for testimonials -->
  <div id="modalOverlay" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modalTitle"></h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-content" id="modalContent"></div>
    </div>
  </div>

  <script src="assets/js/script.js"></script>

  <!-- Cookie consent notification -->
  <div id="cookieConsent" style="
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 1rem;
    display: none;
    z-index: 9999;
    backdrop-filter: blur(5px);
  ">
    <div style="
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    ">
      <div style="flex: 1;">
        <p style="margin: 0;">
          We use cookies to enhance your browsing experience. By continuing to use our site, you agree to our 
          <a href="cookie-policy.html" style="color: #1976d2; text-decoration: underline;">cookie policy</a>.
        </p>
      </div>
      <div style="display: flex; gap: 1rem;">
        <button onclick="acceptCookies()" style="
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        ">Accept</button>
        <button onclick="declineCookies()" style="
          background-color: transparent;
          color: white;
          border: 1px solid white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        ">Decline</button>
      </div>
    </div>
  </div>

  <Dialog
    open={deleteDialogOpen}
    onClose={handleCancelDelete}
    PaperProps={{
      sx: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '400px',
        width: '100%',
        p: 2
      }
    }}
  >

  </body>
</html>`;
  };

  const generateCSS = () => {
    return `* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Roboto', sans-serif;
    }

    header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    nav {
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      margin-right: 2rem;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      flex-wrap: nowrap;
    }

    .nav-menu li {
      margin-left: 2rem;
      white-space: nowrap;
    }

    .nav-menu a {
      text-decoration: none;
      position: relative;
      white-space: nowrap;
    }

    .nav-menu a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: currentColor;
      transition: width 0.3s ease;
    }

    .nav-menu a:hover::after {
      width: 100%;
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .menu-toggle span {
      display: block;
      width: 25px;
      height: 3px;
      background-color: currentColor;
      margin: 5px 0;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
        color: inherit;
        z-index: 1002;
        position: relative;
      }

      .nav-menu {
        display: none !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        padding: 1rem 0;
        flex-direction: column;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 1001;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .nav-menu.active {
        display: flex !important;
      }

      .nav-menu li {
        margin: 0.5rem 0;
        width: 100%;
        text-align: center;
      }

      .nav-menu a {
        display: block;
        padding: 0.75rem 1rem;
        font-size: 1.1rem;
        font-weight: 500;
        color: #1976d2;
      }

      .nav-menu a::after {
        display: none;
      }

      .logo {
        font-size: 1.1rem;
        margin-right: 1rem;
        white-space: nowrap;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        padding: 0 0.5rem;
      }

      .logo {
        font-size: 1rem;
      }

      .nav-menu a {
        font-size: 0.9rem;
      }
    }

    body {
      line-height: 1.6;
      color: #333;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      width: 100%;
    }

    /* Стили для рамок секций */
    section {
      position: relative;
      padding: 6rem 0;
      margin: 2rem 0;
      overflow: hidden;
    }

    section:first-child {
      margin-top: 0;
    }

    section:last-child {
      margin-bottom: 0;
    }

    section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 4px solid transparent;
      border-radius: 20px;
      background: linear-gradient(45deg, var(--border-start-color, #1976d2), var(--border-end-color, #64b5f6)) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      z-index: 1;
      transition: all 0.3s ease-in-out;
      animation: borderPulse 3s infinite, glowPulse 3s infinite;
      pointer-events: none;
    }

    section:hover::before {
      border: 5px solid transparent;
      box-shadow: 0 0 25px 15px var(--border-start-color, #1976d2);
      animation: none;
    }

    @keyframes borderPulse {
      0% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        border-width: 5px;
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
    }

    @keyframes glowPulse {
      0% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
    }

    .site-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      ${headerData.siteEnableOverlay ? `background-color: rgba(0, 0, 0, ${headerData.siteOverlayOpacity / 100 || 0.5}) !important;` : 'background-color: transparent !important;'}
    }

    main {
      flex: 1;
      padding-top: 60px;
      width: 100%;
      overflow-x: hidden;
    }

    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 2rem;
      position: relative;
      overflow: hidden;
    }

    .hero[style*="background-image"] {
      animation: zoomIn 20s ease-in-out infinite alternate;
    }

    @keyframes zoomIn {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.1);
      }
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .hero-content {
      max-width: 800px;
      z-index: 2;
      position: relative;
      animation: slideUp 1s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      animation: fadeIn 1s ease-in-out 0.3s both;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      animation: fadeIn 1s ease-in-out 0.6s both;
    }

    .hero button {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: fadeIn 1s ease-in-out 0.9s both;
    }

    .hero button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .section {
      padding: 6rem 1rem;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }

    @keyframes zoomIn {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.1);
      }
    }

    .section-background-blur {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      z-index: 0;
      animation: zoomIn 20s ease-in-out infinite alternate;
    }

    .section-container {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      position: relative;
    }

    .section-header h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background-color: #1976d2;
      transition: width 0.3s ease-in-out;
    }

    .section-header h2:hover::after {
      width: 100px;
    }

    .section-header p {
      font-size: 1.1rem;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }

    .about-section {
      display: flex;
      align-items: flex-start;
      gap: 2rem;
      padding: 2rem;
      position: relative;
      border-radius: 16px;
      background: linear-gradient(145deg, #ffffff, #f5f5f5);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .about-section::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 16px;
      padding: 2px;
      background: linear-gradient(45deg, #1976d2, #42a5f5);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    .about-image {
      flex: 1;
      position: relative;
    }

    .about-image img {
      width: 100%;
      max-width: 600px;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.3s ease;
    }

    .about-image img:hover {
      transform: scale(1.02);
    }

    .about-image::after {
      content: "";
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      background: linear-gradient(45deg, #1976d2, #42a5f5);
      border-radius: 16px;
      z-index: -1;
      opacity: 0.3;
    }

    .about-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-left: 1rem;
      text-align: left;
      position: relative;
    }

    .about-content::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, #1976d2, #42a5f5);
      border-radius: 2px;
    }

    .about-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-align: left;
      position: relative;
    }

    .about-content h2::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(to right, #1976d2, #42a5f5);
      border-radius: 2px;
    }

    .about-content p {
      font-size: 1.1rem;
      line-height: 1.6;
      text-align: left;
    }

    .section-image {
      width: 100%;
      margin: 2rem auto;
      text-align: center;
      max-width: 800px;
    }

    .section-image img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.3s ease;
    }

    .section-image img:hover {
      transform: scale(1.02);
    }

    @media (max-width: 768px) {
      .about-section {
        flex-direction: column;
      }
      
      .about-content {
        padding-left: 0;
        padding-top: 1rem;
      }
    }

    .section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-align: center;
      position: relative;
    }

    .section h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background-color: #1976d2;
      transition: width 0.3s ease-in-out;
    }

    .section h2:hover::after {
      width: 100px;
    }

    .section p {
      font-size: 1.1rem;
      margin-bottom: 3rem;
      text-align: center;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .cards-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: stretch;
      gap: 2rem;
      padding: 1rem;
      position: relative;
      z-index: 2;
      pointer-events: auto;
    }
    .card {
      flex: 1 1 0;
      min-width: 260px;
      max-width: 100%;
      margin: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
    }
    @media (max-width: 1024px) {
      .card {
        min-width: 220px;
      }
    }
    @media (max-width: 768px) {
      .cards-container {
        flex-direction: column;
        align-items: center;
      }
      .card {
        min-width: 100%;
      }
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .card-header {
      margin-bottom: 1rem;
    }

    .card-header h3 {
      transition: all 0.3s ease-in-out;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
      text-align: center;
    }

    .card:hover .card-header h3 {
      color: #1976d2 !important;
      transform: translateX(4px);
    }

    .card-content {
      transition: all 0.3s ease-in-out;
      font-size: 1rem;
      line-height: 1.6;
      text-align: justify;
    }

    .card:hover .card-content {
      color: #333 !important;
    }

    .card:hover .content-wrapper {
      color: #333 !important;
    }

    /* Стили для разных типов карточек */
    .card.simple {
      border: 3px solid #e0e0e0;
    }

    .card.elevated {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card.outlined {
      border: 3px solid #e0e0e0;
    }

    .card.outlined:hover {
      border-color: #1976d2;
    }

    .card.accent {
      position: relative;
      border-left: 4px solid #1976d2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card.accent::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, #1976d2, #64b5f6);
      transition: width 0.3s ease-in-out;
    }

    .card.accent:hover::before {
      width: 6px;
    }

    .card.gradient {
      background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
      color: white;
    }

    .card.gradient:hover {
      background: linear-gradient(135deg, #1565c0 0%, #42a5f5 100%);
    }

    .card.gradient .card-header h3,
    .card.gradient .card-content,
    .card.gradient .content-wrapper {
      color: white !important;
    }

    .card.gradient:hover .card-header h3,
    .card.gradient:hover .card-content,
    .card.gradient:hover .content-wrapper {
      color: white !important;
    }

    /* Анимации */
    @keyframes borderPulse {
      0% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        border-width: 5px;
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
    }

    @keyframes glowPulse {
      0% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
    }

    /* Контейнер для карточек */
    .cards-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      padding: 1rem;
      position: relative;
      z-index: 2;
      pointer-events: auto;
    }

    @media (max-width: 1024px) {
      .cards-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .cards-container {
        grid-template-columns: 1fr;
      }
    }

    /* Контейнер для секций */
    .section-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Заголовок секции */
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      position: relative;
      display: inline-block;
    }

    .section-header p {
      font-size: 1.2rem;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }
    }

    .section-image img:hover {
      transform: scale(1.02);
    }

    .image-upload-control {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-start;
    }

    .upload-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .upload-button:hover {
      background-color: #1565c0;
    }

    .upload-button i {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 0 0.5rem;
      }

      .logo {
        font-size: 1rem;
      }

      .nav-menu a {
        font-size: 0.9rem;
      }
    }

    .cards-container.cards-2 {
      max-width: 820px;
      margin-left: auto;
      margin-right: auto;
    }
    .cards-container.cards-3 {
      max-width: 1040px;
      margin-left: auto;
      margin-right: auto;
    }
  `;
  };

  const generateJS = () => {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        // Меню-бургер
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Закрываем меню при клике на ссылку
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Закрываем меню при клике вне меню
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Плавная прокрутка к якорям
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Обработчик отправки формы
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Здесь можно добавить отправку данных на сервер
          // Например, через fetch или XMLHttpRequest
          
          // Открываем страницу merci.html в новой вкладке
          window.open('merci.html', '_blank');
        };
      });
    `;
  };

  const handleDownloadSite = async () => {
    try {
      const zip = new JSZip();
      
      // Create main folders
      const assetsFolder = zip.folder('assets');
      const cssFolder = assetsFolder.folder('css');
      const jsFolder = assetsFolder.folder('js');
      const imagesFolder = assetsFolder.folder('images');

      // Add merci.html to root
      const merciResponse = await fetch('/merci.html');
      const merciContent = await merciResponse.text();
      zip.file('merci.html', merciContent);

      // Convert sections from object to array if needed
      const sectionsArray = Object.entries(sectionsData).map(([id, section]) => ({
        ...section,
        id: id,
        title: section.title || '',
        description: section.description || '',
        titleColor: section.titleColor || '#000000',
        descriptionColor: section.descriptionColor || '#666666',
        cards: section.cards || []
      }));

      // Prepare data for HTML generation
      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
          language: headerData.language || 'ru'
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/' + heroData.backgroundImage.split('/').pop() : ''
        },
        sectionsData: sectionsArray,
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: (legalDocuments?.privacyPolicy?.content || '').toString()
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: (legalDocuments?.termsOfService?.content || '').toString()
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: (legalDocuments?.cookiePolicy?.content || '').toString()
          }
        }
      };

      // Add HTML file
      const htmlContent = generateHTML(siteData);
      zip.file('index.html', htmlContent);

      // Add CSS file
      const cssContent = generateCSS();
      cssFolder.file('styles.css', cssContent);
      
      // Add JS file
      const jsContent = generateJS();
      jsFolder.file('script.js', jsContent);

      // Add legal documents
      const legalDocs = [
        {
          id: 'privacy-policy',
          title: siteData.legalDocuments.privacyPolicy.title,
          content: siteData.legalDocuments.privacyPolicy.content
        },
        {
          id: 'terms-of-service',
          title: siteData.legalDocuments.termsOfService.title,
          content: siteData.legalDocuments.termsOfService.content
        },
        {
          id: 'cookie-policy',
          title: siteData.legalDocuments.cookiePolicy.title,
          content: siteData.legalDocuments.cookiePolicy.content
        }
      ];

      legalDocs.forEach(doc => {
        // Обработка контента: первая строка будет отцентрирована и выделена
        const contentLines = doc.content.split('\n');
        const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
        const remainingContent = contentLines.slice(1).join('\n');
        
        // Улучшенная обработка текста для выделения заголовков разделов и форматирования
        let processedContent = firstLine;
        
        // Шаблоны для определения заголовков разделов
        const sectionHeaderPattern = /^\d+\.\s+(.+)/;  // Для формата: "1. Раздел"
        const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/; // Для римских цифр: "I. Раздел"
        const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/; // Для ЗАГОЛОВКОВ ПРОПИСНЫМИ
        
        // Разбиваем текст на абзацы
        const paragraphs = remainingContent.split('\n');
        
        // Обрабатываем каждый абзац
        paragraphs.forEach(paragraph => {
          paragraph = paragraph.trim();
          
          if (!paragraph) {
            // Пустые строки превращаем в разделители
            processedContent += '<br>';
            return;
          }
          
          // Проверяем, является ли строка заголовком раздела
          const match1 = paragraph.match(sectionHeaderPattern);
          const match2 = paragraph.match(sectionHeaderPattern2);
          const match3 = paragraph.match(sectionHeaderPattern3);
          
          if (match1) {
            // Формат "1. Заголовок"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (match2) {
            // Формат "I. Заголовок"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (match3) {
            // Формат "ЗАГОЛОВОК:"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (/^\d+\.\d+\./.test(paragraph)) {
            // Подразделы вида "1.1. Подраздел"
            processedContent += `<h3>${paragraph}</h3>`;
          } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
            // Маркированные списки
            if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
              processedContent += '<ul>';
            }
            processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
            
            // Проверяем, нужно ли закрыть список
            if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
              processedContent += '</ul>';
            }
          } else {
            // Обычные параграфы
            if (paragraph.length > 0) {
              // Выделяем важные термины жирным
              paragraph = paragraph
                .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
                .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
                
              processedContent += `<p>${paragraph}</p>`;
            }
          }
        });
        
        // Дополнительная обработка для улучшения читабельности
        processedContent = processedContent
          .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>') // Выделяем номера подразделов
          .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>') // Выделяем слова ПРОПИСНЫМИ
          .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>') // Выделяем упоминания законов
          .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>'); // Выделяем даты

        const htmlContent = `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;

        zip.file(`${doc.id}.html`, htmlContent);
      });

      // Get hero image from cache
      if (heroData.backgroundImage) {
        try {
          const imageMetadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
          if (imageMetadata.filename) {
            const blob = await imageCacheService.getImage(imageMetadata.filename);
            if (blob) {
              imagesFolder.file(imageMetadata.filename, blob);
              console.log('Hero image successfully added to zip from cache');
            } else {
              console.warn('Hero image not found in cache');
            }
          }
        } catch (error) {
          console.error('Error getting hero image from cache:', error);
        }
      }

      // Get about image from cache
      try {
        const aboutImageMetadata = JSON.parse(localStorage.getItem('aboutImageMetadata') || '{}');
        // Также проверим наличие метаданных для About.jpg с большой буквы (возможно осталось от предыдущей версии)
        const aboutImageMetadataOld = JSON.parse(localStorage.getItem('AboutImageMetadata') || '{}');
        
        // Пробуем сначала найти изображение с маленькой буквы
        if (aboutImageMetadata.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadata.filename);
          if (blob) {
            // Всегда сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image successfully added to zip from cache');
          } else {
            console.warn('About image (lowercase) not found in cache');
          }
        } 
        // Если не нашли с маленькой буквы, проверяем с большой буквы
        else if (aboutImageMetadataOld.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadataOld.filename);
          if (blob) {
            // Всё равно сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image (uppercase) converted to lowercase and added to zip');
          } else {
            console.warn('About image (uppercase) not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting about image from cache:', error);
      }

      // Get section images from cache
      try {
        // Перебираем все пункты меню (секции)
        for (const item of headerData.menuItems) {
          const sectionId = item.id;
          const metadataKey = `section_${sectionId}_ImageMetadata`;
          console.log(`Проверка метаданных для секции ${sectionId}, ключ: ${metadataKey}`);
          
          try {
            const sectionImageMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
            console.log(`Метаданные для секции ${sectionId}:`, sectionImageMetadata);
            
            if (sectionImageMetadata.filename) {
              // Проверяем есть ли файл в кеше
              const blob = await imageCacheService.getImage(sectionImageMetadata.filename);
              
              if (blob) {
                console.log(`Изображение для секции ${sectionId} найдено в кеше:`, sectionImageMetadata.filename);
                imagesFolder.file(sectionImageMetadata.filename, blob);
                console.log(`Section ${sectionId} image successfully added to zip from cache`);
              } else {
                console.warn(`Изображение для секции ${sectionId} не найдено в кеше:`, sectionImageMetadata.filename);
                
                // Пытаемся загрузить изображение по URL
                if (sectionImageMetadata.originalPath) {
                  try {
                    const response = await fetch(sectionImageMetadata.originalPath);
                    if (response.ok) {
                      const blob = await response.blob();
                      imagesFolder.file(sectionImageMetadata.filename, blob);
                      console.log(`Section ${sectionId} image successfully fetched from URL and added to zip`);
                    }
                  } catch (fetchError) {
                    console.error(`Ошибка при загрузке изображения для секции ${sectionId}:`, fetchError);
                  }
                }
              }
            } else {
              console.warn(`Нет метаданных изображения для секции ${sectionId}`);
            }
          } catch (parseError) {
            console.error(`Ошибка при разборе метаданных для секции ${sectionId}:`, parseError);
          }
        }
      } catch (error) {
        console.error('Error getting section images from cache:', error);
      }

      // Get advantages image from cache
      try {
        const advantagesImageMetadata = JSON.parse(localStorage.getItem('advantagesImageMetadata') || '{}');
        if (advantagesImageMetadata.filename) {
          const blob = await imageCacheService.getImage(advantagesImageMetadata.filename);
          if (blob) {
            imagesFolder.file(advantagesImageMetadata.filename, blob);
            console.log('Advantages image successfully added to zip from cache');
          } else {
            console.warn('Advantages image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting advantages image from cache:', error);
      }

      // Get site background image from cache
      try {
        const siteBackgroundMetadata = JSON.parse(localStorage.getItem('siteBackgroundMetadata') || '{}');
        if (siteBackgroundMetadata.filename) {
          const blob = await imageCacheService.getImage(siteBackgroundMetadata.filename);
          if (blob) {
            imagesFolder.file(siteBackgroundMetadata.filename, blob);
            console.log('Site background image successfully added to zip from cache');
          } else {
            console.warn('Site background image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting site background image from cache:', error);
      }

      // Add images from sections
      for (const section of sectionsArray) {
        if (section.backgroundImage || section.imagePath) {
          try {
            const imageFilename = (section.backgroundImage || section.imagePath).split('/').pop();
            // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
            if (imageFilename.toLowerCase() === 'about.jpg') {
              console.log(`Skipping ${imageFilename} as it was already added`);
              continue;
            }
            const blob = await imageCacheService.getImage(imageFilename);
            if (blob) {
              imagesFolder.file(imageFilename, blob);
              console.log(`Section image ${imageFilename} successfully added to zip from cache`);
            } else {
              console.warn(`Section image ${imageFilename} not found in cache`);
            }
          } catch (error) {
            console.error(`Error getting section image from cache:`, error);
          }
        }
      }

      // Get favicon from cache
      try {
        const faviconMetadata = JSON.parse(localStorage.getItem('faviconMetadata') || '{}');
        if (faviconMetadata.filename) {
          const blob = await imageCacheService.getImage(faviconMetadata.filename);
          if (blob) {
            imagesFolder.file(faviconMetadata.filename, blob);
            console.log('Favicon successfully added to zip from cache');
          } else {
            console.warn('Favicon not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting favicon from cache:', error);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/zip'
      });
      saveAs(content, 'site.zip');
    } catch (error) {
      console.error('Error during site download:', error);
      alert('Ошибка при скачивании сайта: ' + error.message);
    }
  };

  const handleDownloadPHP = async () => {
    try {
      const zip = new JSZip();
      
      // Create main folders
      const assetsFolder = zip.folder('assets');
      const cssFolder = assetsFolder.folder('css');
      const jsFolder = assetsFolder.folder('js');
      const imagesFolder = assetsFolder.folder('images');

      // Add merci.html to root
      const merciResponse = await fetch('/merci.html');
      const merciContent = await merciResponse.text();
      zip.file('merci.html', merciContent);

      // Convert sections from object to array if needed
      const sectionsArray = Object.entries(sectionsData).map(([id, section]) => ({
          ...section,
        id: id,
        title: section.title || '',
        description: section.description || '',
        titleColor: section.titleColor || '#000000',
        descriptionColor: section.descriptionColor || '#666666',
        cards: section.cards || []
      }));

      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
          language: headerData.language || 'ru'
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/' + heroData.backgroundImage.split('/').pop() : ''
        },
        sectionsData: sectionsArray,
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: (legalDocuments?.privacyPolicy?.content || '').toString()
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: (legalDocuments?.termsOfService?.content || '').toString()
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: (legalDocuments?.cookiePolicy?.content || '').toString()
          }
        }
      };

      console.log('Generating PHP site with data:', siteData);

      const phpContent = generatePHP(siteData);
      zip.file('index.php', phpContent);

      // Add CSS file
      const cssContent = generateCSS();
      cssFolder.file('styles.css', cssContent);
      
      // Add JS file
      const jsContent = generateJS();
      jsFolder.file('script.js', jsContent);

      // Add legal documents
      const legalDocs = [
        {
          id: 'privacy-policy',
          type: 'privacyPolicy',
          title: siteData.legalDocuments?.privacyPolicy?.title || '',
          content: siteData.legalDocuments?.privacyPolicy?.content || ''
        },
        {
          id: 'terms-of-service',
          type: 'termsOfService',
          title: siteData.legalDocuments?.termsOfService?.title || '',
          content: siteData.legalDocuments?.termsOfService?.content || ''
        },
        {
          id: 'cookie-policy',
          type: 'cookiePolicy',
          title: siteData.legalDocuments?.cookiePolicy?.title || '',
          content: siteData.legalDocuments?.cookiePolicy?.content || ''
        }
      ];

      legalDocs.forEach(doc => {
        const processedContent = (doc.content || '')
          .replace(/(.{80})/g, '$1<br>')
          .replace(/\n/g, '<br>')
          .replace(/([.!?])\s+/g, '$1<br>')
          .replace(/([^.!?])\s+/g, '$1 ');

        const htmlContent = `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;

        zip.file(`${doc.id}.html`, htmlContent);
      });

      // Get hero image from cache
      if (heroData.backgroundImage) {
        try {
          const imageMetadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
          if (imageMetadata.filename) {
            const blob = await imageCacheService.getImage(imageMetadata.filename);
            if (blob) {
              imagesFolder.file(imageMetadata.filename, blob);
              console.log('Hero image successfully added to zip from cache');
            } else {
              console.warn('Hero image not found in cache');
            }
          }
        } catch (error) {
          console.error('Error getting hero image from cache:', error);
        }
      }

      // Get about image from cache
      try {
        const aboutImageMetadata = JSON.parse(localStorage.getItem('aboutImageMetadata') || '{}');
        // Также проверим наличие метаданных для About.jpg с большой буквы (возможно осталось от предыдущей версии)
        const aboutImageMetadataOld = JSON.parse(localStorage.getItem('AboutImageMetadata') || '{}');
        
        // Пробуем сначала найти изображение с маленькой буквы
        if (aboutImageMetadata.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadata.filename);
          if (blob) {
            // Всегда сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image successfully added to zip from cache');
          } else {
            console.warn('About image (lowercase) not found in cache');
          }
        } 
        // Если не нашли с маленькой буквы, проверяем с большой буквы
        else if (aboutImageMetadataOld.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadataOld.filename);
          if (blob) {
            // Всё равно сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image (uppercase) converted to lowercase and added to zip');
          } else {
            console.warn('About image (uppercase) not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting about image from cache:', error);
      }

      // Get section images from cache
      try {
        // Перебираем все пункты меню (секции)
        for (const item of headerData.menuItems) {
          const sectionId = item.id;
          const sectionImageMetadata = JSON.parse(localStorage.getItem(`section_${sectionId}_ImageMetadata`) || '{}');
          
          if (sectionImageMetadata.filename) {
            const blob = await imageCacheService.getImage(sectionImageMetadata.filename);
            if (blob) {
              imagesFolder.file(sectionImageMetadata.filename, blob);
              console.log(`Section ${sectionId} image successfully added to zip from cache`);
            } else {
              console.warn(`Section ${sectionId} image not found in cache`);
            }
          }
        }
      } catch (error) {
        console.error('Error getting section images from cache:', error);
      }

      // Get advantages image from cache
      try {
        const advantagesImageMetadata = JSON.parse(localStorage.getItem('advantagesImageMetadata') || '{}');
        if (advantagesImageMetadata.filename) {
          const blob = await imageCacheService.getImage(advantagesImageMetadata.filename);
          if (blob) {
            imagesFolder.file(advantagesImageMetadata.filename, blob);
            console.log('Advantages image successfully added to zip from cache');
          } else {
            console.warn('Advantages image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting advantages image from cache:', error);
      }

      // Get site background image from cache
      try {
        const siteBackgroundMetadata = JSON.parse(localStorage.getItem('siteBackgroundMetadata') || '{}');
        if (siteBackgroundMetadata.filename) {
          const blob = await imageCacheService.getImage(siteBackgroundMetadata.filename);
          if (blob) {
            imagesFolder.file(siteBackgroundMetadata.filename, blob);
            console.log('Site background image successfully added to zip from cache');
          } else {
            console.warn('Site background image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting site background image from cache:', error);
      }

      // Add images from sections for PHP version
      for (const section of sectionsArray) {
        if (section.backgroundImage || section.imagePath) {
          try {
            const imageFilename = (section.backgroundImage || section.imagePath).split('/').pop();
            // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
            if (imageFilename.toLowerCase() === 'about.jpg') {
              console.log(`Skipping ${imageFilename} as it was already added for PHP version`);
              continue;
            }
            const blob = await imageCacheService.getImage(imageFilename);
            if (blob) {
              imagesFolder.file(imageFilename, blob);
              console.log(`Section image ${imageFilename} successfully added to zip from cache for PHP version`);
            } else {
              console.warn(`Section image ${imageFilename} not found in cache for PHP version`);
            }
          } catch (error) {
            console.error(`Error getting section image from cache for PHP version:`, error);
          }
        }
      }

      // Get favicon from cache
      try {
        const faviconMetadata = JSON.parse(localStorage.getItem('faviconMetadata') || '{}');
        if (faviconMetadata.filename) {
          const blob = await imageCacheService.getImage(faviconMetadata.filename);
          if (blob) {
            imagesFolder.file(faviconMetadata.filename, blob);
            console.log('Favicon successfully added to zip from cache');
          } else {
            console.warn('Favicon not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting favicon from cache:', error);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/zip'
      });
      saveAs(content, 'php-site.zip');
    } catch (error) {
      console.error('Error during PHP site download:', error);
      alert('Ошибка при скачивании PHP сайта: ' + error.message);
    }
  };

  const generatePHP = (data) => {
    console.log('Generating PHP site with data:', data);
    
    // Prepare data for HTML generation
    const siteData = {
      headerData: {
        ...data.headerData,
        siteName: data.headerData.siteName || 'Мой сайт',
        title: data.headerData.siteName || 'Мой сайт',
        description: data.headerData.description || 'Наш сайт предлагает лучшие решения',
        menuItems: data.headerData.menuItems || [],
        siteBackgroundImage: data.headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
        language: data.headerData.language || 'ru'
      },
      heroData: data.heroData,
      sectionsData: data.sectionsData,
      contactData: data.contactData,
      footerData: data.footerData,
      legalDocuments: {
        privacyPolicy: data.legalDocuments?.privacyPolicy || '',
        termsOfService: data.legalDocuments?.termsOfService || '',
        cookiePolicy: data.legalDocuments?.cookiePolicy || ''
      }
    };

    console.log('Prepared data for generation:', siteData);

    // Создаем экземпляр JSZip
    const zip = new JSZip();

    // Генерируем HTML документы
    const legalDocs = [
      {
        id: 'privacy-policy',
        type: 'privacyPolicy',
        title: ''
      },
      {
        id: 'terms-of-service',
        type: 'termsOfService',
        title: ''
      },
      {
        id: 'cookie-policy',
        type: 'cookiePolicy',
        title: ''
      }
    ];

    // Генерируем HTML файлы для документов
    legalDocs.forEach(doc => {
      const htmlContent = generateLegalDocument(data, doc.type);
      zip.file(`${doc.id}.html`, htmlContent);
    });

    // Генерируем основной HTML с данными документов
    const mainHtml = generateHTML(data);
    
    return `<?php
require_once DIR. '/../vendor/autoload.php';
$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$returnPage = !empty($_ENV['WHITE_FORM_RETURN_PAGE']) ? $_ENV['WHITE_FORM_RETURN_PAGE'] : 'merci.html';

if (!str_ends_with($returnPage, '.html')) {
    $returnPage = $returnPage . '.html';
}

if (!empty($_ENV['GA4_MEASUREMENT_ID'])) {
   $gtagId = $_ENV['GA4_MEASUREMENT_ID'];
}

if (!empty($_ENV['GOOGLE_CONVERSION_LABEL'])) {
    $gtagCLabel = $_ENV['GOOGLE_CONVERSION_LABEL'];
}

if (!empty($_ENV['BING_PIXEL_ID'])) {
    $bingPixelId = $_ENV['BING_PIXEL_ID'];
}

if (!empty($_ENV['FB_PIXEL_ID'])) {
    $fbPixelId = $_ENV['FB_PIXEL_ID'];
}

if(!empty($_GET['fbpixelevent']) || !empty($_ENV['FB_EVENT_NAME'])) {
   $facebookPixelEventLeadKey = $_GET['fbpixelevent'] ?? $_ENV['FB_EVENT_NAME'];
}

if (isset($_GET['email']) || isset($_GET['name'])) {
   $email = $_GET['email'] ?? '';
   $name = $_GET['name'] ?? '';
   $phone = ltrim('+', $_GET['phone'] ?? '');
   $lastname = $_GET['lastname'] ?? '';

   if(!empty($fbPixelId)) {
      echo <<<EOL
      <script>
         fbq('track', '$facebookPixelEventLeadKey', {
            em: '$email',
            fn: '$name',
            ln: '$lastname',
            ph: '$phone',
         });
      </script>
EOL;
   }

   if(!empty($gtagId) && !empty($gtagCLabel)) {
      echo <<<EOL
      <script>
         gtag('event', 'conversion', {'send_to': '$gtagId/$gtagCLabel'});
         var head = document.head || document.getElementsByTagName('head')[0];
         var scriptsElement = document.createElement('script');
         scriptsElement.innerHTML = "gtag('event', 'conversion', {'send_to': "$gtagId/$gtagCLabel"});";
         head.appendChild(scriptsElement);
      </script>
EOL;
   }

   if(!empty($bingPixelId)) {
      echo <<<EOL
      <script>
         (function(w, d, t, r, u) {
            var f, n, i;
            w[u] = w[u] || [], f = function() {
                  var o = {
                     ti: '$bingPixelId',
                     enableAutoSpaTracking: true
                  };
                  o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
            }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {
                  var s = this.readyState;
                  s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
            }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
         })(window, document, "script", " //bat.bing.com/bat.js", "uetq");
      </script>
EOL;
   }

   echo <<<EOL
   <script>
      setTimeout( () => {
         window.location.href = '/$returnPage';
      }, 500)
   </script>
EOL;
   exit();
}
?>
<!DOCTYPE html>
<html lang="${data.headerData.language || 'ru'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headerData.title || data.headerData.siteName}</title>
  <link rel="icon" type="image/png" href="assets/images/Favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta name="description" content="${data.headerData.description || 'Наш сайт предлагает лучшие решения'}">
  <?php if(!empty($fbPixelId)): ?>
  <script>
     !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
              n.callMethod ?
                 n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
     }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', '$fbPixelId');
     fbq('track', 'PageView');
  </script>
  <?php endif; ?>

  <?php if(!empty($gtagId)): ?>
  <script src="https://www.googletagmanager.com/gtag/js?id=<?= $gtagId ?>"></script>
  <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());

     gtag('config', '<?= $gtagId ?>');
  </script>
  <?php endif; ?>
</head>
<body>
${mainHtml}`;
  };

  const generateLegalDocument = (siteData, type) => {
    const titles = {
      privacyPolicy: '',
      termsOfService: '',
      cookiePolicy: ''
    };
    
    const content = siteData.legalDocuments?.[type]?.content || '';
    const title = siteData.legalDocuments?.[type]?.title || titles[type];
    
    // Обработка контента: первая строка будет отцентрирована и выделена
    const contentLines = content.split('\n');
    const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
    const remainingContent = contentLines.slice(1).join('\n');
    
    // Улучшенная обработка текста для выделения заголовков разделов и форматирования
    let processedContent = firstLine;
    
    // Шаблоны для определения заголовков разделов
    const sectionHeaderPattern = /^\d+\.\s+(.+)/;  // Для формата: "1. Раздел"
    const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/; // Для римских цифр: "I. Раздел"
    const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/; // Для ЗАГОЛОВКОВ ПРОПИСНЫМИ
    
    // Разбиваем текст на абзацы
    const paragraphs = remainingContent.split('\n');
    
    // Обрабатываем каждый абзац
    paragraphs.forEach(paragraph => {
      paragraph = paragraph.trim();
      
      if (!paragraph) {
        // Пустые строки превращаем в разделители
        processedContent += '<br>';
      return;
    }

      // Проверяем, является ли строка заголовком раздела
      const match1 = paragraph.match(sectionHeaderPattern);
      const match2 = paragraph.match(sectionHeaderPattern2);
      const match3 = paragraph.match(sectionHeaderPattern3);
      
      if (match1) {
        // Формат "1. Заголовок"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (match2) {
        // Формат "I. Заголовок"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (match3) {
        // Формат "ЗАГОЛОВОК:"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (/^\d+\.\d+\./.test(paragraph)) {
        // Подразделы вида "1.1. Подраздел"
        processedContent += `<h3>${paragraph}</h3>`;
      } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
        // Маркированные списки
        if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
          processedContent += '<ul>';
        }
        processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
        
        // Проверяем, нужно ли закрыть список
        if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
          processedContent += '</ul>';
        }
      } else {
        // Обычные параграфы
        if (paragraph.length > 0) {
          // Выделяем важные термины жирным
          paragraph = paragraph
            .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
            .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
            
          processedContent += `<p>${paragraph}</p>`;
        }
      }
    });
    
    // Дополнительная обработка для улучшения читабельности
    processedContent = processedContent
      .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>') // Выделяем номера подразделов
      .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>') // Выделяем слова ПРОПИСНЫМИ
      .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>') // Выделяем упоминания законов
      .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>'); // Выделяем даты
    
    return `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;
  };

  const handleExport = async () => {
    try {
      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/hero/fon.jpg' : '',
          language: headerData.language || 'ru'
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/hero/' + heroData.backgroundImage.split('/').pop() : ''
        },
        sectionsData: sectionsData.map(section => ({
          ...section,
          title: section.title || '',
          description: section.description || '',
          titleColor: section.titleColor || '#000000',
          descriptionColor: section.descriptionColor || '#666666',
          cards: section.cards || []
        })),
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: legalDocuments?.privacyPolicy?.content || ''
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: legalDocuments?.termsOfService?.content || ''
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: legalDocuments?.cookiePolicy?.content || ''
          }
        }
      };

      await exportSite(siteData);
      } catch (error) {
      console.error('Error exporting site:', error);
      alert('Ошибка при экспорте сайта: ' + error.message);
    }
  };

  const handleAboutImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Создаем FormData
      const formData = new FormData();
      formData.append('image', file);

      // Отправляем запрос на сервер
      const response = await fetch('/api/upload-about', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      
      // Сохраняем метаданные изображения в localStorage
      const imageMetadata = {
        filename: 'about.jpg', // Всегда используем about.jpg с маленькой буквы
        originalPath: data.path,
        timestamp: Date.now()
      };
      
      console.log('Метаданные изображения "О нас":', imageMetadata);
      localStorage.setItem('aboutImageMetadata', JSON.stringify(imageMetadata));
      
      // Кешируем изображение
      try {
        // Добавляем временную метку, чтобы избежать кеширования браузером
        const imageUrl = `${data.path}?t=${Date.now()}`;
        const imageBlob = await (await fetch(imageUrl)).blob();
        await imageCacheService.saveImage(imageMetadata.filename, imageBlob);
      } catch (cacheError) {
        console.warn('Ошибка при кешировании изображения "О нас":', cacheError);
        // Продолжаем выполнение, кеширование некритично
      }
      
      // Обновляем путь к изображению в данных секции
      const aboutSection = Object.entries(sectionsData).find(([id, section]) => id === 'about');
      if (aboutSection) {
        const [id, section] = aboutSection;
        onSectionsChange({
          ...sectionsData,
          [id]: {
            ...section,
            imagePath: data.path
          }
        });
      } else {
        console.warn('Секция "О нас" не найдена');
      }
      
      // Отправляем сообщение в превью для обновления изображения
      try {
        // Находим iframe с превью
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          // Отправляем сообщение с информацией об обновлении изображения
          previewIframe.contentWindow.postMessage({
            type: 'UPDATE_SECTION_IMAGE',
            sectionId: 'about',
            imagePath: data.path
          }, '*');
          console.log(`Отправлено сообщение для обновления изображения секции "О нас"`);
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
        // Не критичная ошибка, продолжаем выполнение
      }
      
      alert('Изображение успешно загружено');
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert(error.message || 'Произошла ошибка при загрузке изображения');
    }
  };

  // Функция для удаления изображения секции
  const handleDeleteSectionImage = async (sectionId) => {
    try {
      if (!sectionId) {
        throw new Error('ID секции не указан');
      }

      // Обновляем данные секции, удаляя путь к изображению
      onSectionsChange({
        ...sectionsData,
        [sectionId]: {
          ...sectionsData[sectionId],
          imagePath: null
        }
      });
      
      // Удаляем метаданные изображения из localStorage
      localStorage.removeItem(`section_${sectionId}_ImageMetadata`);
      
      // Отправляем сообщение в превью для обновления отображения
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          previewIframe.contentWindow.postMessage({
            type: 'REMOVE_SECTION_IMAGE',
            sectionId: sectionId
          }, '*');
          console.log(`Отправлено сообщение для удаления изображения секции ${sectionId}`);
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
      }
      
      alert('Изображение успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      alert(error.message || 'Произошла ошибка при удалении изображения');
    }
  };

  // Также добавим функцию для удаления изображения "О нас"
  const handleDeleteAboutImage = async () => {
    try {
      // Ищем секцию about
      const aboutSection = Object.entries(sectionsData).find(([id, section]) => id === 'about');
      if (aboutSection) {
        const [id, section] = aboutSection;
        onSectionsChange({
          ...sectionsData,
          [id]: {
            ...section,
            imagePath: null
          }
        });
      }
      
      // Удаляем метаданные изображения из localStorage
      localStorage.removeItem('aboutImageMetadata');
      localStorage.removeItem('AboutImageMetadata'); // На всякий случай удаляем и старый ключ
      
      // Отправляем сообщение в превью для обновления отображения
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          previewIframe.contentWindow.postMessage({
            type: 'REMOVE_SECTION_IMAGE',
            sectionId: 'about'
          }, '*');
          console.log('Отправлено сообщение для удаления изображения секции "О нас"');
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
      }
      
      alert('Изображение "О нас" успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения "О нас":', error);
      alert(error.message || 'Произошла ошибка при удалении изображения "О нас"');
    }
  };

  // Создаем блоки для разных частей редактора
  const headerEditorBlock = (
        <HeaderEditor 
          headerData={headerData} 
          onHeaderChange={onHeaderChange}
          heroData={heroData}
          expanded={expandedSections.header}
          onToggle={() => toggleSection('header')}
          id="header"
        />
  );

  const heroEditorBlock = (
        <HeroEditor 
          heroData={heroData}
          onHeroChange={onHeroChange}
          expanded={expandedSections.hero}
          onToggle={() => toggleSection('hero')}
          id="hero"
        />
  );

  // Добавляем блок с AI парсером
  const aiParserBlock = (
    <Box sx={{ mb: 4 }}>
      <AiParser 
        sectionsData={sectionsData} 
        onSectionsChange={onSectionsChange}
        headerData={headerData}
        onHeaderChange={onHeaderChange}
        contactData={contactData}
        onContactChange={onContactChange}
        legalDocuments={legalDocuments}
        onLegalDocumentsChange={onLegalDocumentsChange}
        heroData={heroData}
        onHeroChange={onHeroChange}
      />
    </Box>
  );

  const contactEditorBlock = (
    <ContactEditor 
      contactData={contactData} 
      onContactChange={onContactChange}
      expanded={expandedSections.contact}
      onToggle={() => toggleSection('contact')}
      id="contact"
      headerData={headerData}
    />
  );

  const footerEditorBlock = (
    <FooterEditor 
      footerData={footerData} 
      onFooterChange={onFooterChange}
      expanded={expandedSections.footer}
      onToggle={() => toggleSection('footer')}
      id="footer"
    />
  );

  const legalDocumentsEditorBlock = (
    <LegalDocumentsEditor
      documents={legalDocuments}
      onSave={handleLegalDocumentsSave}
      expanded={expandedSections.legal}
      onToggle={() => toggleSection('legal')}
      id="legal"
    />
  );

  const sectionsEditor = (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2,
            backgroundColor: '#f0fff0'
          }}
          id="menu"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ cursor: 'pointer', flexGrow: 1 }}
              onClick={() => toggleSection('menu')}
            >
              Пункты меню
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddMenuItem('menu')}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  mr: 1
                }}
              >
                Добавить
              </Button>
              <IconButton
                onClick={() => toggleSection('menu')}
                aria-expanded={expandedSections.menu}
                aria-label="show more"
                sx={{ cursor: 'pointer' }}
              >
                {expandedSections.menu ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expandedSections.menu} timeout="auto" unmountOnExit>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {headerData.menuItems.map((item) => {
                const section = sectionsData[item.id] || {
                  id: item.id,
                  title: '',
                  description: '',
                  cardType: CARD_TYPES.NONE,
                  cards: []
                };
                
                return (
                  <Paper
                    key={item.id}
                    elevation={2}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 2,
                      backgroundColor: '#bdc5da',
                      borderRadius: 2,
                      border: '1px solid #c5cae9',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSection(`menuItem_${item.id}`)}
                    >
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {item.text}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(`menuItem_${item.id}`);
                        }}
                        aria-expanded={expandedSections.menuItems[item.id]}
                        aria-label="show more"
                        sx={{ cursor: 'pointer' }}
                      >
                        {expandedSections.menuItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    <Collapse in={expandedSections.menuItems[item.id]} timeout="auto" unmountOnExit>
                      <Stack spacing={1} sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Название пункта меню"
                          value={item.text}
                          onChange={(e) => handleMenuItemChange(item.id, 'text', e.target.value)}
                          margin="dense"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Заголовок секции"
                          value={section.title || ''}
                          onChange={(e) => handleSectionChange(item.id, 'title', e.target.value)}
                          margin="dense"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Описание секции"
                          value={section.description || ''}
                          onChange={(e) => handleSectionChange(item.id, 'description', e.target.value)}
                          margin="dense"
                          multiline
                          rows={2}
                        />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                            <Button
                              variant="contained"
                              startIcon={<ImageIcon />}
                              onClick={() => document.getElementById(`section-image-upload-${item.id}`).click()}
                              sx={{ minWidth: '200px' }}
                            >
                              {section.imagePath ? 'Изменить изображение' : 'Загрузить изображение'}
                            </Button>
                            
                            {section.imagePath && (
                              <>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteSectionImage(item.id)}
                                  aria-label="Удалить изображение"
                                >
                                  <DeleteIcon />
                                </IconButton>
                                
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                                  {section.imagePath.split('/').pop()}
                                </Typography>
                              </>
                            )}
                          </Box>
                          
                          <input
                            type="file"
                            id={`section-image-upload-${item.id}`}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleSectionImageUpload(item.id, e)}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Цвет заголовка секции"
                            type="color"
                            value={section.titleColor || '#000000'}
                            onChange={(e) => handleSectionChange(item.id, 'titleColor', e.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Цвет описания секции"
                            type="color"
                            value={section.descriptionColor || '#666666'}
                            onChange={(e) => handleSectionChange(item.id, 'descriptionColor', e.target.value)}
                          />
                        </Box>
                    
                        <FormControl fullWidth size="small">
                          <InputLabel>Тип карточки</InputLabel>
                          <Select
                            value={section.cardType || CARD_TYPES.NONE}
                            label="Тип карточки"
                            onChange={(e) => handleSectionChange(item.id, 'cardType', e.target.value)}
                          >
                            <MenuItem value="none">Без карточек</MenuItem>
                            <MenuItem value="simple">Простая</MenuItem>
                            <MenuItem value="accent">Акцентная</MenuItem>
                            <MenuItem value="elevated">Приподнятая</MenuItem>
                            <MenuItem value="gradient">Градиентная</MenuItem>
                          </Select>
                        </FormControl>

                        {section.cardType !== CARD_TYPES.NONE && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Карточки секции
                            </Typography>
                            <Stack spacing={2}>
                              {(section.cards || []).length > 0 ? (
                                (section.cards || []).map((card) => (
                                  <Paper key={card.id} sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                      <Typography variant="subtitle2">
                                        Карточка {card.id}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteCard(item.id, card.id)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                    <Stack spacing={2}>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Заголовок карточки"
                                        value={card.title || ''}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'title', e.target.value)}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Содержание карточки"
                                        value={card.content || ''}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'content', e.target.value)}
                                        multiline
                                        rows={3}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={card.showTitle !== false}
                                            onChange={(e) => handleCardChange(item.id, card.id, 'showTitle', e.target.checked)}
                                          />
                                        }
                                        label="Показывать заголовок"
                                      />
                                      <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет заголовка"
                                          type="color"
                                          value={card.titleColor || '#1976d2'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'titleColor', e.target.value)}
                                        />
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет текста"
                                          type="color"
                                          value={card.contentColor || '#666666'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'contentColor', e.target.value)}
                                        />
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет обводки"
                                          type="color"
                                          value={card.borderColor || '#e0e0e0'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'borderColor', e.target.value)}
                                        />
                                      </Box>
                                      <FormControl fullWidth size="small">
                                        <InputLabel>Тип фона</InputLabel>
                                        <Select
                                          value={card.backgroundType || 'solid'}
                                          label="Тип фона"
                                          onChange={(e) => handleCardChange(item.id, card.id, 'backgroundType', e.target.value)}
                                        >
                                          <MenuItem value="solid">Сплошной цвет</MenuItem>
                                          <MenuItem value="gradient">Градиент</MenuItem>
                                        </Select>
                                      </FormControl>
                                      {card.backgroundType === 'solid' ? (
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет фона"
                                          type="color"
                                          value={card.backgroundColor || '#ffffff'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'backgroundColor', e.target.value)}
                                        />
                                      ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                          <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Цвет 1"
                                              type="color"
                                              value={card.gradientColor1 || '#ffffff'}
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientColor1', e.target.value)}
                                            />
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Цвет 2"
                                              type="color"
                                              value={card.gradientColor2 || '#f5f5f5'}
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientColor2', e.target.value)}
                                            />
                                          </Box>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>Направление градиента</InputLabel>
                                            <Select
                                              value={card.gradientDirection || 'to right'}
                                              label="Направление градиента"
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientDirection', e.target.value)}
                                            >
                                              <MenuItem value="to right">Слева направо</MenuItem>
                                              <MenuItem value="to left">Справа налево</MenuItem>
                                              <MenuItem value="to bottom">Сверху вниз</MenuItem>
                                              <MenuItem value="to top">Снизу вверх</MenuItem>
                                              <MenuItem value="to bottom right">Сверху слева вниз направо</MenuItem>
                                              <MenuItem value="to bottom left">Сверху справа вниз налево</MenuItem>
                                              <MenuItem value="to top right">Снизу слева вверх направо</MenuItem>
                                              <MenuItem value="to top left">Снизу справа вверх налево</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Box>
                                      )}
                                    </Stack>
                                  </Paper>
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                  Нет добавленных карточек
                                </Typography>
                              )}
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleAddCard(item.id)}
                                sx={{ mt: 1 }}
                              >
                                Добавить карточку
                              </Button>
                            </Stack>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            startIcon={<DeleteIcon fontSize="small" />}
                          >
                            Удалить секцию
                          </Button>
                        </Box>
                      </Stack>
                    </Collapse>
                  </Paper>
                );
              })}
            </Stack>
          </Collapse>
        </Paper>
  );

  // Обработчик сообщений для обновления фона и изображений секций
  function handleMessage(event) {
    if (event.data.type === 'UPDATE_BACKGROUND') {
      const backgroundImage = document.querySelector('.background-image');
      if (backgroundImage) {
        backgroundImage.style.backgroundImage = `url(${event.data.imageUrl})`;
      }
    } else if (event.data.type === 'UPDATE_SECTION_IMAGE') {
      // Обновляем изображение для конкретной секции
      const { sectionId, imagePath } = event.data;
      if (sectionId && imagePath) {
        console.log(`Updating image for section ${sectionId}: ${imagePath}`);
        // Добавляем параметр времени, чтобы избежать кеширования браузером
        const imageUrl = `${imagePath}?t=${Date.now()}`;
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          const imgElement = sectionElement.querySelector('.section-image img');
          if (imgElement) {
            imgElement.src = imageUrl;
          } else if (sectionId === 'about') {
            // Для секции "О нас" структура может быть другой
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              aboutImgElement.src = imageUrl;
            }
          }
        }
      }
    } else if (event.data.type === 'REMOVE_SECTION_IMAGE') {
      // Обрабатываем удаление изображения секции
      const { sectionId } = event.data;
      if (sectionId) {
        console.log(`Removing image for section ${sectionId}`);
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          // В зависимости от структуры секции, ищем разные элементы
          if (sectionId === 'about') {
            // Для секции "О нас"
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              // Можно скрыть или поставить заглушку
              aboutImgElement.style.display = 'none';
              // Или установить заглушку 
              // aboutImgElement.src = '/placeholder.jpg'; 
            }
          } else {
            // Для обычных секций
            const sectionImageDiv = sectionElement.querySelector('.section-image');
            if (sectionImageDiv) {
              sectionImageDiv.style.display = 'none';
            }
          }
        }
      }
    }
  }

  // Блок для редактирования "О нас"
  const aboutEditorBlock = (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2,
        backgroundColor: '#f0f9ff'
      }}
      id="about"
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => toggleSection('about')}
        >
          О нас
        </Typography>
        <IconButton
          onClick={() => toggleSection('about')}
          aria-expanded={expandedSections.about}
          aria-label="show more"
          sx={{ cursor: 'pointer' }}
        >
          {expandedSections.about ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expandedSections.about} timeout="auto" unmountOnExit>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Заголовок секции"
            value={sectionsData.about?.title || ''}
            onChange={(e) => handleSectionChange('about', 'title', e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание секции"
            value={sectionsData.about?.description || ''}
            onChange={(e) => handleSectionChange('about', 'description', e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Цвет заголовка"
              type="color"
              value={sectionsData.about?.titleColor || '#000000'}
              onChange={(e) => handleSectionChange('about', 'titleColor', e.target.value)}
            />
            <TextField
              fullWidth
              label="Цвет описания"
              type="color"
              value={sectionsData.about?.descriptionColor || '#666666'}
              onChange={(e) => handleSectionChange('about', 'descriptionColor', e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<ImageIcon />}
                onClick={() => document.getElementById('about-image-upload').click()}
                sx={{ minWidth: '200px' }}
              >
                {sectionsData.about?.imagePath ? 'Изменить изображение' : 'Загрузить изображение'}
              </Button>
              
              {sectionsData.about?.imagePath && (
                <>
                  <IconButton
                    color="error"
                    onClick={handleDeleteAboutImage}
                    aria-label="Удалить изображение"
                  >
                    <DeleteIcon />
                  </IconButton>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                    {sectionsData.about.imagePath.split('/').pop()}
                  </Typography>
                </>
              )}
            </Box>
            
            <input
              type="file"
              id="about-image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAboutImageUpload}
            />
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3 }}>
        {aiParserBlock} {/* Перемещаем блок AI парсера в начало */}
        {headerEditorBlock}
        {heroEditorBlock}
        {sectionsEditor}
        {contactEditorBlock}
        {footerEditorBlock}
        {legalDocumentsEditorBlock}
        {aboutEditorBlock}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
            startIcon={<DownloadIcon />}
            onClick={handleDownloadSite}
          >
            Скачать сайт
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPHP}
          >
            Скачать PHP версию
        </Button>
      </Box>
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эту секцию? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditorPanel; 