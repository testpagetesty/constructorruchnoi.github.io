import React, { useState, useRef, useEffect } from 'react';
import { imageCacheService } from '../../utils/imageCacheService';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Tab, 
  Tabs, 
  Container,
  Paper,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  Fade,
  Drawer,
  Button,
  Fab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../Header/Header';
import HeroSection from '../Hero/HeroSection';
import ContactSection from '../Contact/ContactSection';
import FooterSection from '../Footer/FooterSection';
import LiveChatWidget from '../LiveChat/LiveChatWidget';
import { ContentElementsLibrary } from '../ContentLibrary';

// Импорты компонентов библиотеки элементов
import {
  Typography as TypographyElement,
  RichTextEditor,
  CodeBlock,
  Blockquote,
  ListComponent,
  Callout,
  BasicCard,
  ImageCard,
  AccordionComponent,
  DataTable,
  BarChart,
  // Новые расширенные компоненты
  AdvancedLineChart,
  AdvancedBarChart,
  AdvancedPieChart,
  AdvancedAreaChart,
  AdvancedRadarChart,
  ChartJSBarChart,
  ChartJSDoughnutChart,
  ApexLineChart,
  VideoPlayer,
  QRCodeGenerator,
  ColorPicker,
  RatingComponent,
  ConfettiComponent,
  ShareButtons,
  AnimatedBox,
  ProgressBars,
  AdvancedContactForm,
  FormikRegistrationForm,
  ReactSelectComponent,
  DatePickerComponent,
  StepperForm,
  // Продвинутые текстовые элементы
  GradientText,
  AnimatedCounter,
  TypewriterText,
  HighlightText,
  MarkdownEditor,
  CodeEditor,
  // Дополнительные текстовые элементы
  TestimonialCard,
  FAQSection,
  TimelineComponent,
  AlertComponent,
  CTASection,
  ImageGallery
} from '../ContentLibrary';
import CardsGridManager from '../ContentLibrary/CardComponents/CardsGridManager';
import MultipleCardsSection from '../ContentLibrary/CardComponents/MultipleCardsSection';
import CardsGridEditor from '../ContentLibrary/CardComponents/CardsGridEditor';
import MultipleCardsEditor from '../ContentLibrary/CardComponents/MultipleCardsEditor';
import BlockquoteNew from '../ContentLibrary/TextComponents/BlockquoteNew';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  minHeight: '48px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1976d2',
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    minHeight: '48px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
    '&:hover': {
      color: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
    '&.Mui-selected': {
      color: '#1976d2',
      fontWeight: 600,
    },
  },
}));

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
}));

const PageContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const NavigationBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const MultiPagePreview = ({ 
  headerData, 
  heroData, 
  sectionsData, 
  contactData, 
  footerData, 
  legalDocuments,
  liveChatData,
  onElementUpdate = () => {},
  selectedElement = null,
  onElementSelect = () => {}
}) => {
  const [currentPage, setCurrentPage] = useState('index');
  const [fadeKey, setFadeKey] = useState(0);
  const [editingElement, setEditingElement] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  console.log('[MultiPagePreview] 🎯 Component mounted/updated');
  
  // Загрузка hero изображения из кеша
  useEffect(() => {
    const loadHeroImage = async () => {
      console.log('[MultiPagePreview] 🔍 useEffect triggered for hero image loading');
      console.log('[MultiPagePreview] heroData:', heroData);
      console.log('[MultiPagePreview] heroData.backgroundType:', heroData?.backgroundType);
      console.log('[MultiPagePreview] heroData.backgroundImage:', heroData?.backgroundImage);
      
      if (heroData?.backgroundType === 'image' && heroData?.backgroundImage) {
        try {
          console.log('[MultiPagePreview] 🖼️ Loading hero image:', heroData.backgroundImage);
          
          // Извлекаем имя файла из пути
          let imageFilename = heroData.backgroundImage;
          if (imageFilename.includes('/')) {
            imageFilename = imageFilename.split('/').pop();
          }
          
          console.log('[MultiPagePreview] Extracted filename:', imageFilename);
          console.log('[MultiPagePreview] Trying to load from cache...');
          
          // Сначала проверим все доступные ключи в кеше
          const allKeys = await imageCacheService.getAllImageKeys();
          console.log('[MultiPagePreview] All cache keys:', allKeys);
          
          // Пытаемся загрузить из кеша
          const blob = await imageCacheService.getImage(imageFilename);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setHeroImageUrl(url);
            console.log('[MultiPagePreview] ✅ Hero image loaded from cache:', url);
            console.log('[MultiPagePreview] Blob details:', { size: blob.size, type: blob.type });
          } else {
            console.log('[MultiPagePreview] ❌ Hero image not found in cache, trying alternative names...');
            
            // Пробуем альтернативные имена файлов
            const alternativeNames = [
              'hero.jpg',
              'hero.jpeg', 
              'hero.png',
              'hero.webp',
              'fon.jpg',
              'background.jpg'
            ];
            
            let foundImage = false;
            for (const altName of alternativeNames) {
              console.log('[MultiPagePreview] Trying alternative name:', altName);
              const altBlob = await imageCacheService.getImage(altName);
              if (altBlob) {
                const url = URL.createObjectURL(altBlob);
                setHeroImageUrl(url);
                console.log('[MultiPagePreview] ✅ Hero image found with alternative name:', altName, url);
                foundImage = true;
                break;
              }
            }
            
            if (!foundImage) {
              // Пытаемся загрузить изображение с сервера и сохранить в кеш
              console.log('[MultiPagePreview] 🌐 Trying to load and cache hero image from server...');
              try {
                const imageUrl = heroData.backgroundImage.startsWith('/') ? heroData.backgroundImage : `/images/hero/${heroData.backgroundImage}`;
                console.log('[MultiPagePreview] Fetching from URL:', imageUrl);
                const response = await fetch(imageUrl);
                console.log('[MultiPagePreview] Fetch response status:', response.status, response.statusText);
                
                if (response.ok) {
                  const blob = await response.blob();
                  console.log('[MultiPagePreview] Downloaded blob:', { size: blob.size, type: blob.type });
                  await imageCacheService.saveImage(imageFilename, blob);
                  const url = URL.createObjectURL(blob);
                  setHeroImageUrl(url);
                  console.log('[MultiPagePreview] ✅ Hero image loaded from server and cached:', url);
                } else {
                  console.log('[MultiPagePreview] ⚠️ Server response not OK, using direct path');
                  setHeroImageUrl(heroData.backgroundImage);
                  console.log('[MultiPagePreview] Using direct path as fallback:', heroData.backgroundImage);
                }
              } catch (fetchError) {
                console.error('[MultiPagePreview] ❌ Error fetching hero image:', fetchError);
                setHeroImageUrl(heroData.backgroundImage);
                console.log('[MultiPagePreview] Using direct hero image path as final fallback:', heroData.backgroundImage);
              }
            }
          }
        } catch (error) {
          console.error('[MultiPagePreview] ❌ Error in loadHeroImage:', error);
          setHeroImageUrl(heroData.backgroundImage);
        }
      } else {
        setHeroImageUrl(null);
        console.log('[MultiPagePreview] 🚫 Hero background is not image type or no backgroundImage specified');
        if (!heroData) {
          console.log('[MultiPagePreview] heroData is null/undefined');
        } else if (heroData.backgroundType !== 'image') {
          console.log('[MultiPagePreview] backgroundType is not "image", it is:', heroData.backgroundType);
        } else if (!heroData.backgroundImage) {
          console.log('[MultiPagePreview] backgroundImage is empty/null/undefined');
        }
      }
    };

    loadHeroImage();
  }, [heroData?.backgroundType, heroData?.backgroundImage]);

  // Функция для добавления новых элементов
  const handleAddElement = (elementData) => {
    if (!currentSectionId) {
      console.warn('[MultiPagePreview] No section selected for adding element');
      return;
    }
    
    const newElement = {
      id: `element_${Date.now()}`,
      ...elementData,
      timestamp: new Date().toISOString()
    };
    
    console.log('[MultiPagePreview] Adding element to section:', currentSectionId, newElement);
    
    // Используем onElementUpdate для добавления нового элемента
    if (onElementUpdate) {
      onElementUpdate(currentSectionId, newElement.id, 'add', newElement);
    }
    
    // Закрываем панель после добавления
    setDrawerOpen(false);
    setCurrentSectionId(null);
  };
  
  // Функция для открытия библиотеки элементов для конкретной секции
  const handleOpenLibrary = (sectionId) => {
    setCurrentSectionId(sectionId);
    setDrawerOpen(true);
  };

  // Функция для рендеринга элементов контента
  const renderContentElement = (element, sectionId) => {
    if (!element || !element.type) {
      console.warn('[MultiPagePreview] Invalid element:', element);
      return null;
    }
    
    console.log('[MultiPagePreview] Rendering content element:', element.type, element);
    console.log('[MultiPagePreview] Element data structure:', {
      hasData: !!element.data,
      dataKeys: element.data ? Object.keys(element.data) : [],
      elementKeys: Object.keys(element),
      title: element.title,
      content: element.content,
      items: element.items,
      text: element.text,
      author: element.author,
      headers: element.headers,
      rows: element.rows
    });
    
    const isCurrentlyEditing = editingElement?.id === element.id && editingElement?.sectionId === sectionId;
    
    const handleElementUpdate = (newData) => {
      console.log('[MultiPagePreview] Updating element:', element.id, 'with data:', newData);
      
      // Вызываем обработчик обновления с правильными параметрами
      if (onElementUpdate) {
        onElementUpdate(sectionId, element.id, 'data', newData);
      }
    };

    const handleElementClick = (e) => {
      e.stopPropagation();
      if (onElementSelect) {
        onElementSelect(element, sectionId);
      }
    };

    const handleElementDoubleClick = (e) => {
      e.stopPropagation();
      if (['cards-grid', 'multiple-cards'].includes(element.type)) {
        setEditingElement({ id: element.id, sectionId, element });
      }
    };

    const handleElementSave = (newContent) => {
      console.log('[MultiPagePreview] Saving element:', element.id, 'with content:', newContent);
      handleElementUpdate(newContent);
      setEditingElement(null);
    };

    const handleElementCancel = () => {
      setEditingElement(null);
    };

    const elementKey = element.id;
    const elementProps = {
      isPreview: true,
      constructorMode: true, // В MultiPagePreview всегда true, так как это режим превью с редактированием
      onUpdate: handleElementUpdate,
      onSave: handleElementUpdate,
      onCancel: () => {},
      editable: true
    };
    
    // Добавляем базовые данные элемента
    if (element.data) {
      Object.assign(elementProps, element.data);
    } else {
      Object.assign(elementProps, element);
    }
    
    // Всегда приоритезируем title из корня элемента, если он есть
    if (element.title) {
      elementProps.title = element.title;
    }
    
    // Специальная обработка для callout - добавляем недостающие поля
    if (element.type === 'callout') {
      elementProps.title = element.title || element.data?.title || 'Информационный блок';
      elementProps.content = element.content || element.data?.content || 'Содержимое блока';
      elementProps.type = element.calloutType || element.data?.calloutType || 'custom';
      elementProps.calloutType = element.calloutType || element.data?.calloutType || 'custom';
      elementProps.showIcon = element.showIcon !== undefined ? element.showIcon : (element.data?.showIcon !== undefined ? element.data.showIcon : true);
      elementProps.isCustomType = element.isCustomType !== undefined ? element.isCustomType : (element.data?.isCustomType !== undefined ? element.data.isCustomType : true);
      elementProps.customTypeName = element.customTypeName || element.data?.customTypeName || 'Информация';
      elementProps.backgroundColor = element.backgroundColor || element.data?.backgroundColor || '#e3f2fd';
      elementProps.borderColor = element.borderColor || element.data?.borderColor || '#1976d2';
      elementProps.textColor = element.textColor || element.data?.textColor || '#0d47a1';
      elementProps.dismissible = element.dismissible || element.data?.dismissible || false;
      elementProps.size = element.size || element.data?.size || 'medium';
      elementProps.animationSettings = element.animationSettings || element.data?.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: true // ВРЕМЕННО отключаем анимации для отладки callout
      };
      console.log('[MultiPagePreview] 🎯 CALLOUT PROPS PREPARED:', elementProps);
    }
    
    // Специальная обработка для typography - добавляем недостающие поля
    if (element.type === 'typography') {
      elementProps.text = element.text || element.data?.text || element.content || 'Пример текста';
      elementProps.variant = element.variant || element.data?.variant || 'body1';
      elementProps.customStyles = element.customStyles || element.data?.customStyles || {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'inherit',
        color: '#000000',
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: 'none'
      };
    }
    
    // Специальная обработка для animated-counter - добавляем недостающие поля  
    if (element.type === 'animated-counter') {
      elementProps.title = element.title || element.data?.title || 'Счетчик';
      elementProps.startValue = element.startValue || element.data?.startValue || 0;
      elementProps.endValue = element.endValue || element.data?.endValue || element.value || 0;
      elementProps.suffix = element.suffix || element.data?.suffix || element.unit || '';
      elementProps.duration = element.duration || element.data?.duration || 2000;
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#333333';
      elementProps.countColor = element.countColor || element.data?.countColor || '#1976d2';
      elementProps.description = element.description || element.data?.description || '';
      elementProps.animationSettings = element.animationSettings || element.data?.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    // Специальная обработка для accordion - добавляем недостающие поля
    if (element.type === 'accordion') {
      elementProps.title = element.title || element.data?.title || 'Аккордеон';
      elementProps.items = element.items || element.data?.items || [];
      elementProps.showTitle = element.showTitle !== undefined ? element.showTitle : (element.data?.showTitle !== undefined ? element.data.showTitle : true);
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#1976d2';
      elementProps.contentColor = element.contentColor || element.data?.contentColor || '#333333';
      elementProps.borderColor = element.borderColor || element.data?.borderColor || '#e0e0e0';
      elementProps.backgroundType = element.backgroundType || element.data?.backgroundType || 'solid';
      elementProps.backgroundColor = element.backgroundColor || element.data?.backgroundColor || '#ffffff';
    }
    
    // Специальная обработка для faq-section - добавляем недостающие поля
    if (element.type === 'faq-section') {
      elementProps.title = element.title || element.data?.title || 'Вопросы и ответы';
      elementProps.items = element.items || element.data?.items || [];
      elementProps.showTitle = element.showTitle !== undefined ? element.showTitle : (element.data?.showTitle !== undefined ? element.data.showTitle : true);
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#1976d2';
      elementProps.contentColor = element.contentColor || element.data?.contentColor || '#333333';
      elementProps.borderColor = element.borderColor || element.data?.borderColor || '#e0e0e0';
      elementProps.backgroundType = element.backgroundType || element.data?.backgroundType || 'solid';
      elementProps.backgroundColor = element.backgroundColor || element.data?.backgroundColor || '#ffffff';
      elementProps.animationSettings = element.animationSettings || element.data?.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    // Специальная обработка для multiple-cards - добавляем недостающие поля
    if (element.type === 'multiple-cards') {
      elementProps.title = element.title || element.data?.title || 'Карточки';
      elementProps.description = element.description || element.data?.description || 'Секция с карточками';
      elementProps.cards = element.cards || element.data?.cards || [];
      elementProps.cardType = element.cardType || element.data?.cardType || 'image-card';
      elementProps.gridSize = element.gridSize || element.data?.gridSize || 'auto';
      elementProps.sectionStyles = element.sectionStyles || element.data?.sectionStyles || {
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        backgroundColor: 'transparent',
        backgroundType: 'transparent'
      };
    }
    
    // Специальная обработка для qr-code - добавляем недостающие поля
    if (element.type === 'qr-code') {
      elementProps.qrData = element.qrData || element.content || 'https://example.com';
      elementProps.size = element.size || 200;
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.foregroundColor = element.foregroundColor || '#000000';
    }
    
    // Специальная обработка для progress-bars - добавляем недостающие поля
    if (element.type === 'progress-bars') {
      elementProps.progress = element.progress || 45;
      elementProps.caption = element.caption || 'Прогресс загрузки';
    }
    
    // Специальная обработка для bar-chart - копируем данные диаграммы
    if (element.type === 'bar-chart') {
      elementProps.title = element.title || 'Диаграмма';
      elementProps.data = element.data || [];
      elementProps.showValues = element.showValues !== undefined ? element.showValues : true;
      elementProps.showGrid = element.showGrid !== undefined ? element.showGrid : true;
      elementProps.animate = element.animate !== undefined ? element.animate : true;
      elementProps.orientation = element.orientation || 'vertical';
      elementProps.height = element.height || 300;
      elementProps.customStyles = element.customStyles || {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#ffffff',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        titleColor: '#ffffff',
        legendColor: '#ffffff',
        borderColor: 'transparent',
        borderWidth: 0,
        padding: 24
      };
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    // Специальная обработка для advanced-line-chart - копируем данные линейного графика
    if (element.type === 'advanced-line-chart') {
      elementProps.title = element.title || 'Линейный график';
      elementProps.data = element.data || [];
      elementProps.strokeWidth = element.strokeWidth || 2;
      elementProps.showGrid = element.showGrid !== undefined ? element.showGrid : true;
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.lineColors = element.lineColors || ['#8884d8', '#82ca9d'];
      elementProps.lineNames = element.lineNames || ['Линия 1', 'Линия 2'];
      elementProps.gridColor = element.gridColor || '#e0e0e0';
      elementProps.axisColor = element.axisColor || '#666666';
      elementProps.tooltipBg = element.tooltipBg || '#ffffff';
      elementProps.legendColor = element.legendColor || '#333333';
      elementProps.borderRadius = element.borderRadius || 8;
      elementProps.padding = element.padding || 24;
      elementProps.chartHeight = element.chartHeight || 300;
      elementProps.animationSettings = element.animationSettings || {
        type: 'fadeIn',
        duration: 0.8,
        delay: 0.2
      };
    }
    
    // Специальная обработка для advanced-pie-chart - копируем данные круговой диаграммы
    if (element.type === 'advanced-pie-chart') {
      elementProps.title = element.title || 'Круговая диаграмма';
      elementProps.data = element.data || [];
      elementProps.showLabels = element.showLabels !== undefined ? element.showLabels : true;
      elementProps.showPercentage = element.showPercentage !== undefined ? element.showPercentage : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.pieColors = element.pieColors || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
      elementProps.tooltipBg = element.tooltipBg || '#ffffff';
      elementProps.legendColor = element.legendColor || '#333333';
      elementProps.borderRadius = element.borderRadius || 1;
      elementProps.padding = element.padding || 1;
              elementProps.chartSize = element.chartSize || 700;
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    // Специальная обработка для advanced-area-chart - копируем данные диаграммы с областями
    if (element.type === 'advanced-area-chart') {
      elementProps.title = element.title || 'Диаграмма с областями';
      elementProps.data = element.data || [];
      elementProps.showGrid = element.showGrid !== undefined ? element.showGrid : true;
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.stacked = element.stacked !== undefined ? element.stacked : true;
      elementProps.areaNames = element.areaNames || ['Область 1', 'Область 2'];
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    // Специальная обработка для apex-line - копируем данные линейной диаграммы ApexCharts
    if (element.type === 'apex-line') {
      elementProps.title = element.title || 'Линейная диаграмма ApexCharts';
      
      // Адаптируем данные для ApexLineChart
      const chartData = element.data || { labels: [], series: [] };
      elementProps.categories = chartData.labels || ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен'];
      elementProps.chartSeries = chartData.series || [{
        name: "Продажи",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }];
      
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.borderRadius = element.borderRadius || 8;
      elementProps.padding = element.padding || 24;
      elementProps.chartHeight = element.chartHeight || 300;
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    // Специальная обработка для chartjs-bar - копируем данные Chart.js столбчатой диаграммы
    if (element.type === 'chartjs-bar') {
      elementProps.title = element.title || element.data?.title || 'Chart.js Столбчатая диаграмма';
      elementProps.chartData = element.data || element.chartData || {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
        datasets: [{
          label: 'Продажи',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }]
      };
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.borderRadius = element.borderRadius || 8;
      elementProps.padding = element.padding || 24;
      elementProps.chartHeight = element.chartHeight || 500;
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'scaleIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
    }
    
    console.log('[MultiPagePreview] ElementProps for', element.type, ':', elementProps);
    
    // Детальное логирование для всех типов - JSON формат
    console.log(`[MultiPagePreview] Detailed ${element.type} data JSON:`, JSON.stringify({
      title: elementProps.title,
      content: elementProps.content,
      type: elementProps.type,
      calloutType: elementProps.calloutType,
      showIcon: elementProps.showIcon,
      isCustomType: elementProps.isCustomType,
      customTypeName: elementProps.customTypeName,
      borderColor: elementProps.borderColor,
      textColor: elementProps.textColor,
      items: elementProps.items,
      rows: elementProps.rows,
      headers: elementProps.headers,
      text: elementProps.text,
      author: elementProps.author,
      data: elementProps.data,
      chartType: elementProps.chartType,
      quote: elementProps.quote,
      description: elementProps.description,
      imageUrl: elementProps.imageUrl,
      cards: elementProps.cards,
      sectionStyles: elementProps.sectionStyles,
      animationSettings: elementProps.animationSettings,
      // Добавляем поля для QR кода
      qrData: elementProps.qrData,
      size: elementProps.size,
      backgroundColor: elementProps.backgroundColor,
      foregroundColor: elementProps.foregroundColor,
      // Добавляем поля для progress-bars
      progress: elementProps.progress,
      caption: elementProps.caption,
      // Добавляем поля для bar-chart
      showValues: elementProps.showValues,
      showGrid: elementProps.showGrid,
      animate: elementProps.animate,
      orientation: elementProps.orientation,
      height: elementProps.height,
      customStyles: elementProps.customStyles,
      animationSettings: elementProps.animationSettings,
      // Добавляем поля для advanced-line-chart
      strokeWidth: elementProps.strokeWidth,
      showLegend: elementProps.showLegend,
      titleColor: elementProps.titleColor,
      backgroundColor: elementProps.backgroundColor,
      backgroundType: elementProps.backgroundType,
      gradientStart: elementProps.gradientStart,
      gradientEnd: elementProps.gradientEnd,
      gradientDirection: elementProps.gradientDirection,
      lineColors: elementProps.lineColors,
      lineNames: elementProps.lineNames,
      gridColor: elementProps.gridColor,
      axisColor: elementProps.axisColor,
      tooltipBg: elementProps.tooltipBg,
      legendColor: elementProps.legendColor,
      borderRadius: elementProps.borderRadius,
      padding: elementProps.padding,
      chartHeight: elementProps.chartHeight,
      // Добавляем поля для advanced-pie-chart
      showLabels: elementProps.showLabels,
      showPercentage: elementProps.showPercentage,
      pieColors: elementProps.pieColors,
      chartSize: elementProps.chartSize,
      // Добавляем поля для apex-line
      categories: elementProps.categories,
      chartSeries: elementProps.chartSeries
    }, null, 2));
    
    // Специальное логирование для bar-chart
    if (element.type === 'bar-chart') {
      console.log(`[MultiPagePreview] BarChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] BarChart data length: ${elementProps.data?.length || 0}`);
    }
    
    // Специальное логирование для advanced-line-chart
    if (element.type === 'advanced-line-chart') {
      console.log(`[MultiPagePreview] AdvancedLineChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] AdvancedLineChart data length: ${elementProps.data?.length || 0}`);
      console.log(`[MultiPagePreview] AdvancedLineChart lineNames:`, elementProps.lineNames);
    }
    
    // Специальное логирование для advanced-pie-chart
    if (element.type === 'advanced-pie-chart') {
      console.log(`[MultiPagePreview] AdvancedPieChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] AdvancedPieChart data length: ${elementProps.data?.length || 0}`);
      console.log(`[MultiPagePreview] AdvancedPieChart data:`, elementProps.data);
      console.log(`[MultiPagePreview] AdvancedPieChart showLabels:`, elementProps.showLabels);
      console.log(`[MultiPagePreview] AdvancedPieChart showPercentage:`, elementProps.showPercentage);
      console.log(`[MultiPagePreview] AdvancedPieChart pieColors:`, elementProps.pieColors);
    }
    
    // Специальное логирование для chartjs-doughnut
    if (element.type === 'chartjs-doughnut') {
      console.log(`[MultiPagePreview] ChartJSDoughnutChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart data:`, elementProps.data);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart chartData:`, elementProps.chartData);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart chartSize:`, elementProps.chartSize);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart cutout:`, elementProps.cutout);
    }
    
    // Специальное логирование для advanced-area-chart
    if (element.type === 'advanced-area-chart') {
      console.log(`[MultiPagePreview] AdvancedAreaChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] AdvancedAreaChart data length: ${elementProps.data?.length || 0}`);
      console.log(`[MultiPagePreview] AdvancedAreaChart data:`, elementProps.data);
      console.log(`[MultiPagePreview] AdvancedAreaChart showGrid:`, elementProps.showGrid);
      console.log(`[MultiPagePreview] AdvancedAreaChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] AdvancedAreaChart stacked:`, elementProps.stacked);
    }
    
    // Специальное логирование для apex-line
    if (element.type === 'apex-line') {
      console.log(`[MultiPagePreview] ApexLineChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] ApexLineChart categories:`, elementProps.categories);
      console.log(`[MultiPagePreview] ApexLineChart chartSeries:`, elementProps.chartSeries);
      console.log(`[MultiPagePreview] ApexLineChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] ApexLineChart original data:`, element.data);
    }
    
    // Специальное логирование для chartjs-bar
    if (element.type === 'chartjs-bar') {
      console.log(`[MultiPagePreview] ChartJSBarChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] ChartJSBarChart chartData:`, elementProps.chartData);
      console.log(`[MultiPagePreview] ChartJSBarChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] ChartJSBarChart original element.title:`, element.title);
      console.log(`[MultiPagePreview] ChartJSBarChart original element.data:`, element.data);
      console.log(`[MultiPagePreview] ChartJSBarChart element.data?.title:`, element.data?.title);
      console.log(`[MultiPagePreview] ChartJSBarChart final elementProps after special handling:`, elementProps.title);
    }

    switch (element.type) {
      // Базовые текстовые компоненты
      case 'typography':
        try {
          return <TypographyElement {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TypographyElement:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TypographyElement</Typography>
          </Box>;
        }
      case 'rich-text':
        try {
          return <RichTextEditor {...elementProps} isEditing={false} onSave={null} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering RichTextEditor:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга RichTextEditor</Typography>
          </Box>;
        }
      case 'code-block':
        try {
          return <CodeBlock {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering CodeBlock:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга CodeBlock</Typography>
          </Box>;
        }
      case 'blockquote':
        try {
          return <BlockquoteNew {...elementProps} isConstructorMode={true} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering BlockquoteNew:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга BlockquoteNew</Typography>
          </Box>;
        }
      case 'list':
        try {
          return <ListComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ListComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ListComponent</Typography>
          </Box>;
        }
      case 'callout':
        try {
          return <Callout key={elementKey} {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering Callout:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга Callout</Typography>
          </Box>;
        }
        
      // Продвинутые текстовые элементы
      case 'gradient-text':
        try {
          return <GradientText {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering GradientText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга GradientText</Typography>
          </Box>;
        }
      case 'solid-text':
        try {
          return (
            <Typography 
              sx={{
                color: element.data?.color || element.color || '#1976d2',
                fontSize: `${element.data?.fontSize || element.fontSize || 24}px`,
                fontWeight: element.data?.fontWeight || element.fontWeight || 'bold',
                textAlign: 'center',
                margin: '1rem 0'
              }}
            >
              {element.data?.text || element.text || 'Цветной текст'}
            </Typography>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering SolidText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга SolidText</Typography>
          </Box>;
        }
      case 'animated-counter':
        try {
          return <AnimatedCounter {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AnimatedCounter:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AnimatedCounter</Typography>
          </Box>;
        }
      case 'typewriter-text':
        try {
          return <TypewriterText {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TypewriterText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TypewriterText</Typography>
          </Box>;
        }
      case 'highlight-text':
        try {
          return <HighlightText {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering HighlightText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга HighlightText</Typography>
          </Box>;
        }
      case 'markdown-editor':
        try {
          return <MarkdownEditor {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering MarkdownEditor:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга MarkdownEditor</Typography>
          </Box>;
        }
      case 'code-editor':
        try {
          return <CodeEditor {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering CodeEditor:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга CodeEditor</Typography>
          </Box>;
        }
        
      // Дополнительные текстовые элементы
      case 'testimonial-card':
      case 'testimonial':
        try {
          return <TestimonialCard {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TestimonialCard:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TestimonialCard</Typography>
          </Box>;
        }
      case 'faq-section':
        try {
          return <FAQSection {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering FAQSection:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга FAQSection</Typography>
          </Box>;
        }
      case 'timeline-component':
        try {
          return <TimelineComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TimelineComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TimelineComponent</Typography>
          </Box>;
        }
      case 'alert-component':
        try {
          return <AlertComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AlertComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AlertComponent</Typography>
          </Box>;
        }
        
      // CTA секция
      case 'cta-section':
        try {
          return <CTASection {...elementProps} availablePages={pages} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering CTASection:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга CTASection</Typography>
          </Box>;
        }
        
      // Галерея изображений
      case 'image-gallery':
        try {
          return <ImageGallery {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ImageGallery:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ImageGallery</Typography>
          </Box>;
        }
        
      // Карточки
      case 'basic-card':
        try {
          return <BasicCard {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering BasicCard:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга BasicCard</Typography>
          </Box>;
        }
      case 'image-card':
      case 'imagecard':
        try {
          return <ImageCard {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ImageCard:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ImageCard</Typography>
          </Box>;
        }
      case 'cards-grid':
        return isCurrentlyEditing ? (
          <CardsGridEditor
            title={element.data?.title || ''}
            description={element.data?.description || ''}
            cards={element.data?.cards || []}
            cardType={element.data?.cardType || 'image-card'}
            gridSize={element.data?.gridSize || 'medium'}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
            isPreview={true}
          />
        ) : (
          <Box
            onClick={handleElementClick}
            onDoubleClick={handleElementDoubleClick}
            sx={{ 
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                outline: '2px solid #1976d2',
                borderRadius: 1
              }
            }}
          >
            {element.data?.title && (
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                {element.data.title}
              </Typography>
            )}
            {element.data?.description && (
              <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
                {element.data.description}
              </Typography>
            )}
            <CardsGridManager
              cards={element.data?.cards || []}
              onCardsChange={() => {}} // Только для просмотра
              cardType={element.data?.cardType || 'image-card'}
              gridSize={element.data?.gridSize || 'medium'}
              onGridSizeChange={() => {}} // Только для просмотра
              editable={true}
            />
            {/* Подсказка о возможности редактирования */}
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: 'rgba(25, 118, 210, 0.9)',
                color: 'white',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: 10,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              Двойной клик для редактирования
            </Box>
          </Box>
        );
      case 'multiple-cards':
        return isCurrentlyEditing ? (
          <MultipleCardsEditor
            title={element.data?.title || element.title || ''}
            description={element.data?.description || element.description || ''}
            cards={element.data?.cards || element.cards || []}
            cardType={element.data?.cardType || element.cardType || 'image-card'}
            gridSize={element.data?.gridSize || element.gridSize || 'medium'}
            sectionStyles={element.data?.sectionStyles || element.sectionStyles}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
            isPreview={true}
          />
        ) : (
          <Box
            onClick={handleElementClick}
            onDoubleClick={handleElementDoubleClick}
            sx={{ 
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                outline: '2px solid #1976d2',
                borderRadius: 1
              }
            }}
          >
            <MultipleCardsSection
              cards={element.data?.cards || element.cards || []}
              gridSize={element.data?.gridSize || element.gridSize || 'medium'}
              cardType={element.data?.cardType || element.cardType || 'image-card'}
              title={element.data?.title || element.title}
              description={element.data?.description || element.description}
              sectionStyles={element.data?.sectionStyles || element.sectionStyles}
              onEdit={() => {}}
              onDelete={() => {}}
              editable={false}
            />
            {/* Подсказка о возможности редактирования */}
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: 'rgba(25, 118, 210, 0.9)',
                color: 'white',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: 10,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              Двойной клик для редактирования
            </Box>
          </Box>
        );
        
      // Интерактивные элементы
      case 'accordion':
        try {
          // Трансформируем данные для AccordionComponent
          const accordionProps = {
            ...elementProps,
            initialPanels: elementProps.items || elementProps.initialPanels || [
              { id: 1, title: 'Заголовок', content: 'Содержимое' }
            ]
          };
          
          console.log('[MultiPagePreview] AccordionComponent props:', accordionProps);
          
          return <AccordionComponent key={elementKey} {...accordionProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AccordionComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AccordionComponent</Typography>
          </Box>;
        }
      case 'video-player':
        try {
          return <VideoPlayer {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering VideoPlayer:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга VideoPlayer</Typography>
          </Box>;
        }
      case 'qr-code':
        try {
          return <QRCodeGenerator {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering QRCodeGenerator:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга QRCodeGenerator</Typography>
          </Box>;
        }
      case 'color-picker':
        try {
          return <ColorPicker {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ColorPicker:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ColorPicker</Typography>
          </Box>;
        }
      case 'rating':
        try {
          return <RatingComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering RatingComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга RatingComponent</Typography>
          </Box>;
        }
      case 'confetti':
        try {
          return <ConfettiComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ConfettiComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ConfettiComponent</Typography>
          </Box>;
        }
      case 'share-buttons':
        try {
          return <ShareButtons {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ShareButtons:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ShareButtons</Typography>
          </Box>;
        }
      case 'animated-box':
        try {
          return <AnimatedBox {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AnimatedBox:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AnimatedBox</Typography>
          </Box>;
        }
      case 'progress-bars':
        try {
          return <ProgressBars {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ProgressBars:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ProgressBars</Typography>
          </Box>;
        }
        
      // Таблицы
      case 'data-table':
      case 'table':
        try {
          // Трансформируем данные для DataTable
          const tableProps = {
            ...elementProps,
            initialColumns: elementProps.headers ? elementProps.headers.map((header, index) => ({
              id: `col_${index}`,
              label: header,
              sortable: true
            })) : [
              { id: 'col_0', label: 'Название', sortable: true },
              { id: 'col_1', label: 'Значение', sortable: true }
            ],
            initialRows: elementProps.rows ? elementProps.rows.map((row, index) => {
              const rowObj = { id: index };
              row.forEach((cell, cellIndex) => {
                rowObj[`col_${cellIndex}`] = cell;
              });
              return rowObj;
            }) : []
          };
          
          console.log('[MultiPagePreview] DataTable props:', tableProps);
          
          return <DataTable {...tableProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering DataTable:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга DataTable</Typography>
          </Box>;
        }
        
      // Базовые графики
      case 'bar-chart':
      case 'chart':
        try {
          return <BarChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering BarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга BarChart</Typography>
          </Box>;
        }
        
      // Расширенные графики Recharts
      case 'advanced-line-chart':
        try {
          return <AdvancedLineChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedLineChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedLineChart</Typography>
          </Box>;
        }
      case 'advanced-bar-chart':
        try {
          return <AdvancedBarChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedBarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedBarChart</Typography>
          </Box>;
        }
      case 'advanced-pie-chart':
        try {
          // Убеждаемся, что все необходимые props передаются
          const pieChartProps = {
            ...elementProps,
            title: elementProps.title || element.title || 'Круговая диаграмма',
            data: elementProps.data || element.data || [],
            showLabels: elementProps.showLabels !== undefined ? elementProps.showLabels : true,
            showPercentage: elementProps.showPercentage !== undefined ? elementProps.showPercentage : true,
            pieColors: elementProps.pieColors || element.pieColors || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'],
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
                          chartSize: elementProps.chartSize || element.chartSize || 700,
            animationSettings: elementProps.animationSettings || element.animationSettings || {
              animationType: 'fadeIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] AdvancedPieChart props:', pieChartProps);
          
          return <AdvancedPieChart {...pieChartProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedPieChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedPieChart</Typography>
          </Box>;
        }
      case 'advanced-area-chart':
        try {
          // Специальная обработка для AdvancedAreaChart
          const areaChartProps = {
            ...elementProps,
            title: elementProps.title || elementProps.data?.title || 'Диаграмма с областями',
            data: elementProps.data || elementProps.chartData || [],
            showGrid: elementProps.showGrid !== undefined ? elementProps.showGrid : true,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            stacked: elementProps.stacked !== undefined ? elementProps.stacked : true,
            areaNames: elementProps.areaNames || ['Область 1', 'Область 2'],
            animationSettings: elementProps.animationSettings || {
              animationType: 'fadeIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] AdvancedAreaChart props:', areaChartProps);
          
          return <AdvancedAreaChart {...areaChartProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedAreaChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedAreaChart</Typography>
          </Box>;
        }
      case 'advanced-radar-chart':
        try {
          return <AdvancedRadarChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedRadarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedRadarChart</Typography>
          </Box>;
        }
        
      // Chart.js графики
      case 'chartjs-bar':
        try {
          // Специальная обработка для ChartJSBarChart
          const barChartProps = {
            ...elementProps,
            chartData: elementProps.data || elementProps.chartData, // Используем data как chartData
            title: elementProps.title || elementProps.data?.title || elementProps.chartData?.title,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            animationSettings: elementProps.animationSettings || {
              animationType: 'scaleIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] ChartJSBarChart elementProps.title:', elementProps.title);
          console.log('[MultiPagePreview] ChartJSBarChart elementProps.chartData?.title:', elementProps.chartData?.title);
          console.log('[MultiPagePreview] ChartJSBarChart elementProps.data?.title:', elementProps.data?.title);
          console.log('[MultiPagePreview] ChartJSBarChart final title:', barChartProps.title);
          console.log('[MultiPagePreview] ChartJSBarChart props:', barChartProps);
          
          return <ChartJSBarChart {...barChartProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ChartJSBarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ChartJSBarChart</Typography>
          </Box>;
        }
      case 'chartjs-doughnut':
        try {
          // Специальная обработка для ChartJSDoughnutChart
          const doughnutProps = {
            ...elementProps,
            chartData: elementProps.data || elementProps.chartData, // Используем data как chartData
            title: elementProps.title || elementProps.chartData?.title,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            titleColor: elementProps.titleColor || '#1976d2',
            backgroundColor: elementProps.backgroundColor || '#ffffff',
            backgroundType: elementProps.backgroundType || 'solid',
            gradientStart: elementProps.gradientStart || '#f5f5f5',
            gradientEnd: elementProps.gradientEnd || '#e0e0e0',
            gradientDirection: elementProps.gradientDirection || 'to bottom',
            borderRadius: elementProps.borderRadius || 1,
            padding: elementProps.padding || 1,
            chartSize: elementProps.chartSize || 700,
            cutout: elementProps.cutout || '30%',
            centerText: elementProps.centerText || '',
            showCenterText: elementProps.showCenterText || false,
            animationSettings: elementProps.animationSettings || {
              animationType: 'scaleIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] ChartJSDoughnutChart props:', doughnutProps);
          
          return <ChartJSDoughnutChart {...doughnutProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ChartJSDoughnutChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ChartJSDoughnutChart</Typography>
          </Box>;
        }
        
      // ApexCharts графики
      case 'apex-line':
        try {
          return <ApexLineChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ApexLineChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ApexLineChart</Typography>
          </Box>;
        }

        
      // Формы
      case 'advanced-contact-form':
        try {
          return <AdvancedContactForm {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedContactForm:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedContactForm</Typography>
          </Box>;
        }
      case 'formik-registration':
        try {
          return <FormikRegistrationForm {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering FormikRegistrationForm:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга FormikRegistrationForm</Typography>
          </Box>;
        }
      case 'react-select':
        try {
          return <ReactSelectComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ReactSelectComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ReactSelectComponent</Typography>
          </Box>;
        }
      case 'date-picker':
        try {
          return <DatePickerComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering DatePickerComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга DatePickerComponent</Typography>
          </Box>;
        }
      case 'stepper-form':
        try {
          return <StepperForm {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering StepperForm:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга StepperForm</Typography>
          </Box>;
        }
        
      default:
        console.warn(`[MultiPagePreview] Unknown content element type: ${element.type}`);
        console.error(`[MultiPagePreview] Element data:`, element);
        return (
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Неизвестный тип элемента: {element.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Данные элемента: {JSON.stringify(element.data, null, 2)}
            </Typography>
          </Box>
        );
    }
  };

  // Получаем список секций для навигации
  const sections = Object.entries(sectionsData || {}).map(([id, data]) => ({
    id,
    title: data.title || id,
    data
  }));

  // Создаем массив всех страниц
  const pages = [
    { id: 'index', title: 'Главная', icon: <HomeIcon /> },
    ...sections.map(section => ({
      id: section.id,
      title: section.title,
      icon: <MenuBookIcon />,
      data: section.data
    })),
    { id: 'contact', title: 'Контакты', icon: <ContactsIcon /> },
    ...(legalDocuments?.privacyPolicy?.content ? [{ id: 'privacy', title: 'Политика конфиденциальности', icon: <DescriptionIcon /> }] : []),
    ...(legalDocuments?.termsOfService?.content ? [{ id: 'terms', title: 'Условия использования', icon: <DescriptionIcon /> }] : []),
    ...(legalDocuments?.cookiePolicy?.content ? [{ id: 'cookies', title: 'Cookie политика', icon: <DescriptionIcon /> }] : []),
  ];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    setFadeKey(prev => prev + 1);
  };

  const currentPageData = pages.find(page => page.id === currentPage);

  // Функция для отображения хлебных крошек
  const renderBreadcrumbs = () => {
    if (currentPage === 'index') return null;
    
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => { e.preventDefault(); setCurrentPage('index'); }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="inherit" />
          Главная
        </Link>
        <Typography color="textPrimary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {currentPageData?.icon}
          {currentPageData?.title}
        </Typography>
      </Breadcrumbs>
    );
  };

  // Функция для отображения главной страницы (главная)
  const renderIndexPage = () => (
    <PageContainer>
      <Header 
        headerData={headerData} 
        onMenuClick={(id) => setCurrentPage(id)}
        contactData={contactData}
      />
      <PageContent>
        <Container maxWidth="lg">
          {renderBreadcrumbs()}
          <HeroSection 
            title={heroData.title}
            subtitle={heroData.subtitle}
            backgroundType={heroData.backgroundType}
            backgroundImage={heroImageUrl || heroData.backgroundImage}
            backgroundColor={heroData.backgroundColor}
            gradientColor1={heroData.gradientColor1}
            gradientColor2={heroData.gradientColor2}
            gradientDirection={heroData.gradientDirection}
            titleColor={heroData.titleColor}
            subtitleColor={heroData.subtitleColor}
            animationType={heroData.animationType}
            enableOverlay={heroData.enableOverlay}
            overlayOpacity={heroData.overlayOpacity}
            enableBlur={heroData.enableBlur}
            blurAmount={heroData.blurAmount}
          />
          {console.log('[MultiPagePreview] 🏗️ HeroSection rendered with:', {
            backgroundType: heroData.backgroundType,
            backgroundImage: heroImageUrl || heroData.backgroundImage,
            heroImageUrl,
            originalBackgroundImage: heroData.backgroundImage
          })}
          
          {/* Кнопка добавления элементов для Hero секции */}
          <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<LibraryBooksIcon />}
              onClick={() => handleOpenLibrary('hero')}
              sx={{ borderRadius: 2 }}
            >
              Добавить элемент в Hero секцию
            </Button>
          </Box>
          
          {/* Секции */}
          {sections.map((section) => {
            console.log(`[MultiPagePreview] 🔍 Processing section:`, section.id, 'data:', section.data);
            console.log(`[MultiPagePreview] 🔍 Section elements:`, section.data?.elements);
            return (
            <Box key={section.id} sx={{ mt: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', textAlign: 'center' }}>
                {section.title}
              </Typography>
              {section.data?.elements && section.data.elements.length > 0 ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenLibrary(section.id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Добавить элемент
                    </Button>
                  </Box>
                  {section.data.elements.map((element) => (
                    <Box key={element.id} sx={{ mb: 3 }}>
                      {renderContentElement(element, section.id)}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                    Пока нет элементов контента
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<LibraryBooksIcon />}
                    onClick={() => handleOpenLibrary(section.id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Добавить первый элемент
                  </Button>
                </Box>
              )}
            </Box>
            );
          })}
        </Container>
      </PageContent>
      <FooterSection 
        footerData={footerData}
        contactData={contactData}
        legalDocuments={legalDocuments}
        headerData={headerData}
      />
    </PageContainer>
  );

  // Функция для отображения страницы секции
  const renderSectionPage = (sectionData) => (
    <PageContainer>
      <Header 
        headerData={headerData} 
        onMenuClick={(id) => setCurrentPage(id)}
        contactData={contactData}
      />
      <PageContent>
        <Container maxWidth="lg">
          {renderBreadcrumbs()}
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: sectionData?.titleColor || '#1976d2'
            }}
          >
            {sectionData?.title}
          </Typography>
          {sectionData?.description && (
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: sectionData?.descriptionColor || '#666',
                maxWidth: '800px',
                margin: '0 auto 2rem auto'
              }}
            >
              {sectionData.description}
            </Typography>
          )}
          
          {/* Отображение карточек секции */}
          {sectionData?.cards && sectionData.cards.length > 0 && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 3,
              mt: 4 
            }}>
              {sectionData.cards.map((card, index) => (
                <Paper key={card.id || index} sx={{ p: 3, background: card.backgroundColor || sectionData?.backgroundColor || 'rgba(0,0,0,0.85)', color: card.contentColor || sectionData?.contentColor || '#fff' }}>
                  {card.title && (
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        color: card.titleColor || sectionData?.titleColor || '#ffd700' 
                      }}
                    >
                      {card.title}
                    </Typography>
                  )}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: card.contentColor || sectionData?.contentColor || '#fff',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {card.content}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
          
          {/* Отображение элементов контента */}
          {sectionData?.contentElements && sectionData.contentElements.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#1976d2' }}>
                  Элементы контента
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenLibrary(sectionData.id)}
                  sx={{ borderRadius: 2 }}
                >
                  Добавить элемент
                </Button>
              </Box>
              {console.log(`[MultiPagePreview] Section ${sectionData.id} has ${sectionData.contentElements.length} content elements:`, sectionData.contentElements)}
              {sectionData.contentElements.map((element) => (
                <Box key={element.id} sx={{ mb: 3 }}>
                  {renderContentElement(element, sectionData.id)}
                </Box>
              ))}
            </Box>
          )}
          
          {/* Кнопка добавления элементов для секций без элементов */}
          {(!sectionData?.contentElements || sectionData.contentElements.length === 0) && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                Пока нет элементов контента
              </Typography>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LibraryBooksIcon />}
                onClick={() => handleOpenLibrary(sectionData.id)}
                sx={{ borderRadius: 2 }}
              >
                Добавить первый элемент
              </Button>
            </Box>
          )}
        </Container>
      </PageContent>
      <FooterSection 
        footerData={footerData}
        contactData={contactData}
        legalDocuments={legalDocuments}
        headerData={headerData}
      />
    </PageContainer>
  );

  // Функция для отображения страницы контактов
  const renderContactPage = () => (
    <PageContainer>
      <Header 
        headerData={headerData} 
        onMenuClick={(id) => setCurrentPage(id)}
        contactData={contactData}
      />
      <PageContent>
        <Container maxWidth="lg">
          {renderBreadcrumbs()}
          <ContactSection 
            contactData={contactData}
            showBorders={false}
          />
        </Container>
      </PageContent>
      <FooterSection 
        footerData={footerData}
        contactData={contactData}
        legalDocuments={legalDocuments}
        headerData={headerData}
      />
    </PageContainer>
  );

  // Функция для отображения правовых документов
  const renderLegalPage = (docType) => {
    const docs = {
      privacy: legalDocuments?.privacyPolicy,
      terms: legalDocuments?.termsOfService,
      cookies: legalDocuments?.cookiePolicy
    };
    
    const doc = docs[docType];
    if (!doc?.content) return null;

    return (
      <PageContainer>
        <Header 
          headerData={headerData} 
          onMenuClick={(id) => setCurrentPage(id)}
          contactData={contactData}
        />
        <PageContent>
          <Container maxWidth="lg">
            {renderBreadcrumbs()}
            <Paper sx={{ p: 4 }}>
              <Typography variant="h3" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
                {doc.title}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  '& p': { mb: 2 },
                  '& h1, & h2, & h3': { mt: 3, mb: 2 },
                  '& ul, & ol': { ml: 2, mb: 2 }
                }}
                dangerouslySetInnerHTML={{ __html: doc.content.replace(/\n/g, '<br />') }}
              />
            </Paper>
          </Container>
        </PageContent>
        <FooterSection 
          footerData={footerData}
          contactData={contactData}
          legalDocuments={legalDocuments}
          headerData={headerData}
        />
      </PageContainer>
    );
  };

  // Функция для отображения текущей страницы
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'index':
        return renderIndexPage();
      case 'contact':
        return renderContactPage();
      case 'privacy':
        return renderLegalPage('privacy');
      case 'terms':
        return renderLegalPage('terms');
      case 'cookies':
        return renderLegalPage('cookies');
      default:
        const sectionData = sections.find(s => s.id === currentPage)?.data;
        return sectionData ? renderSectionPage(sectionData) : renderIndexPage();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Навигационная панель */}
      <NavigationBar>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          🔧 Режим многостраничного превью
        </Typography>
        <StyledTabs
          value={currentPage}
          onChange={handlePageChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="page navigation"
        >
          {pages.map((page) => (
            <Tab
              key={page.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {page.icon}
                  {page.title}
                </Box>
              }
              value={page.id}
            />
          ))}
        </StyledTabs>
      </NavigationBar>
      
      {/* Содержимое страницы */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Fade key={fadeKey} in={true} timeout={300}>
          <Box>
            {renderCurrentPage()}
          </Box>
        </Fade>
      </Box>
      
      {/* Live Chat Widget */}
      {liveChatData?.enabled && (
        <LiveChatWidget 
          siteName={headerData?.siteName || 'Мой сайт'} 
          apiKey={liveChatData?.apiKey || ''} 
        />
      )}
      
      {/* Floating Action Button для быстрого доступа к библиотеке */}
      <Fab
        color="primary"
        aria-label="add element"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={() => {
          // Если находимся на странице секции, открываем библиотеку для этой секции
          const currentSection = sections.find(s => s.id === currentPage);
          if (currentSection) {
            handleOpenLibrary(currentPage);
          } else {
            // Иначе просто открываем панель
            setDrawerOpen(true);
          }
        }}
      >
        <LibraryBooksIcon />
      </Fab>
      
      {/* Боковая панель с библиотекой элементов */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentSectionId(null);
        }}
        PaperProps={{
          sx: {
            width: '400px',
            maxWidth: '90vw'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              📚 Библиотека элементов
            </Typography>
            <IconButton
              onClick={() => {
                setDrawerOpen(false);
                setCurrentSectionId(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {currentSectionId && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Добавление элемента в секцию:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {currentSectionId === 'hero' ? 'Hero секция' : 
                 sections.find(s => s.id === currentSectionId)?.title || currentSectionId}
              </Typography>
            </Box>
          )}
          
          <ContentElementsLibrary
            onAddElement={handleAddElement}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default MultiPagePreview; 