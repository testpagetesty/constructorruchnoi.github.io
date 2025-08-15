import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Switch,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HeroSection from '../Hero/HeroSection';
import ContactSection from '../Contact/ContactSection';
import FooterSection from '../Footer/FooterSection';
import Header from '../Header/Header';
import TestimonialCard from '../Testimonial/TestimonialCard';
import ReactDOM from 'react-dom/client';
import { imageCacheService } from '../../utils/imageCacheService';
import LiveChatWidget from '../LiveChat/LiveChatWidget';
import MultiPagePreview from './MultiPagePreview';

// Импортируем новые компоненты для отображения изображений
import SimpleImageGallery from './SimpleImageGallery';
import DebugImageDisplay from './DebugImageDisplay';

// Импорты компонентов библиотеки элементов
import {
  Typography as TypographyElement,
  RichTextEditor,
  CodeBlock,
  Blockquote,
  Callout,
  BasicCard,
  ImageCard,
  AccordionComponent,
  DataTable,
  BarChart,

  ImageGallery
} from '../ContentLibrary';
import CardsGridManager from '../ContentLibrary/CardComponents/CardsGridManager';
import MultipleCardsSection from '../ContentLibrary/CardComponents/MultipleCardsSection';
import CardsGridEditor from '../ContentLibrary/CardComponents/CardsGridEditor';
import MultipleCardsEditor from '../ContentLibrary/CardComponents/MultipleCardsEditor';
import BlockquoteNew from '../ContentLibrary/TextComponents/BlockquoteNew';

const SimpleCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'scale(1.2)',
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const ElevatedCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'rotate(3deg) scale(1.05)',
    boxShadow: theme.shadows[8],
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const OutlinedCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#e8f5e9'}, ${card?.gradientColor2 || '#c8e6c9'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'skew(-5deg) translateY(-5px)',
    borderColor: theme.palette.primary.main,
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const AccentCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  position: 'relative',
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  zIndex: 2,
  '&:hover': {
    transform: 'translateX(10px) translateY(-5px)',
    boxShadow: theme.shadows[4],
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    },
    '&::before': {
      width: '6px'
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    transition: 'width 0.3s ease-in-out',
    zIndex: 1
  }
}));

const GradientCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'scale(1.2)',
    boxShadow: theme.shadows[8],
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const CARD_TYPES = {
  NONE: 'none',
  SIMPLE: 'simple',
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  ACCENT: 'accent',
  GRADIENT: 'gradient'
};

const CARD_COMPONENTS = {
  [CARD_TYPES.SIMPLE]: SimpleCard,
  [CARD_TYPES.ELEVATED]: ElevatedCard,
  [CARD_TYPES.OUTLINED]: OutlinedCard,
  [CARD_TYPES.ACCENT]: AccentCard,
  [CARD_TYPES.GRADIENT]: GradientCard
};

const PagePreview = ({
  headerData,
  heroData,
  sectionsData = {},
  contactData,
  footerData,
  legalDocuments,
  liveChatData = { enabled: false, apiKey: '' },
  constructorMode = true,
  selectedElement = null,
  onElementSelect = () => {},
  onElementUpdate = () => {},
  onAddElement = () => {}
}) => {
  console.log('[PagePreview] Component rendered with sectionsData:', sectionsData);
  console.log('[PagePreview] sectionsData type in render:', typeof sectionsData);
  console.log('[PagePreview] sectionsData is array:', Array.isArray(sectionsData));
  console.log('[PagePreview] sectionsData JSON:', JSON.stringify(sectionsData));
  console.log('[PagePreview] Object.keys(sectionsData):', Object.keys(sectionsData || {}));
  console.log('[PagePreview] Number of sections:', Object.keys(sectionsData || {}).length);
  
  const sectionRefs = useRef({});
  const cardRefs = useRef({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const contactSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [backgroundSettings, setBackgroundSettings] = useState({
    blur: headerData?.siteBackgroundBlur || 0,
    darkness: headerData?.siteBackgroundDarkness || 0
  });
  const [showBorders, setShowBorders] = useState(true);
  const [sectionImages, setSectionImages] = useState({});
  const [editingElement, setEditingElement] = useState(null);
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  // Загрузка hero изображения из кеша
  useEffect(() => {
    const loadHeroImage = async () => {
      if (heroData?.backgroundType === 'image' && heroData?.backgroundImage) {
        try {
          console.log('[PagePreview] Loading hero image:', heroData.backgroundImage);
          
          // Извлекаем имя файла из пути
          let imageFilename = heroData.backgroundImage;
          if (imageFilename.includes('/')) {
            imageFilename = imageFilename.split('/').pop();
          }
          
          console.log('[PagePreview] Trying to load from cache:', imageFilename);
          
          // Пытаемся загрузить из кеша
          const blob = await imageCacheService.getImage(imageFilename);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setHeroImageUrl(url);
            console.log('[PagePreview] ✅ Hero image loaded from cache:', url);
          } else {
            console.log('[PagePreview] ❌ Hero image not found in cache, trying alternatives...');
            
            // Пробуем альтернативные имена
            const alternativeNames = ['hero.jpg', 'hero.jpeg', 'hero.png', 'fon.jpg'];
            let foundImage = false;
            
            for (const altName of alternativeNames) {
              const altBlob = await imageCacheService.getImage(altName);
              if (altBlob) {
                const url = URL.createObjectURL(altBlob);
                setHeroImageUrl(url);
                console.log('[PagePreview] ✅ Hero image found with alternative name:', altName);
                foundImage = true;
                break;
              }
            }
            
            if (!foundImage) {
              // Пытаемся загрузить изображение с сервера и сохранить в кеш
              console.log('[PagePreview] Trying to load and cache hero image from server...');
              try {
                const imageUrl = heroData.backgroundImage.startsWith('/') ? heroData.backgroundImage : `/images/hero/${heroData.backgroundImage}`;
                const response = await fetch(imageUrl);
                if (response.ok) {
                  const blob = await response.blob();
                  await imageCacheService.saveImage(imageFilename, blob);
                  const url = URL.createObjectURL(blob);
                  setHeroImageUrl(url);
                  console.log('[PagePreview] ✅ Hero image loaded from server and cached:', url);
                } else {
                  setHeroImageUrl(heroData.backgroundImage);
                  console.log('[PagePreview] Failed to load from server, using direct path:', heroData.backgroundImage);
                }
              } catch (fetchError) {
                console.error('[PagePreview] Error fetching hero image:', fetchError);
                setHeroImageUrl(heroData.backgroundImage);
                console.log('[PagePreview] Using direct hero image path as fallback:', heroData.backgroundImage);
              }
            }
          }
        } catch (error) {
          console.error('[PagePreview] Error loading hero image:', error);
          setHeroImageUrl(heroData.backgroundImage);
        }
      } else {
        setHeroImageUrl(null);
        console.log('[PagePreview] Hero background is not image type');
      }
    };

    loadHeroImage();
  }, [heroData?.backgroundType, heroData?.backgroundImage]);

  // Добавляем стили для анимации рамки
  const globalStyles = `
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

    .content-element-preview {
      position: relative;
      transition: all 0.3s ease;
    }

    .content-element-preview:hover {
      background-color: rgba(25, 118, 210, 0.02) !important;
      border-color: rgba(25, 118, 210, 0.3) !important;
    }

    .content-element-preview.selected {
      animation: borderPulse 2s infinite;
    }


  `;

  const renderCard = (card, cardType, section) => {
    const CardComponent = CARD_COMPONENTS[cardType] || SimpleCard;
    
    return (
      <CardComponent
        ref={el => {
          if (el) {
            cardRefs.current[`${section.id}-${card.id}`] = el;
          }
        }}
        card={card}
        section={section}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: card.backgroundColor || section.backgroundColor || 'rgba(0,0,0,0.85)',
          color: card.contentColor || section.contentColor || '#fff'
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {card.showTitle && (
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: card.titleColor || section.titleColor || '#ffd700',
                fontWeight: 600
              }}
            >
              {card.title}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: card.contentColor || section.contentColor || '#fff',
              flexGrow: 1
            }}
          >
            {card.content}
          </Typography>
        </CardContent>
      </CardComponent>
    );
  };

  // Функция для рендеринга элементов контента
  const renderContentElement = (element, sectionId) => {
    if (!element || !element.type) {
      console.warn('[PagePreview] Invalid element:', element);
      return null;
    }
    
    console.log('[PagePreview] Rendering content element:', element.type, element);
    
    const isSelected = selectedElement && 
                      selectedElement.sectionId === sectionId && 
                      selectedElement.elementId === element.id;
    
    const elementProps = {
      key: element.id,
      isPreview: true,
      constructorMode: constructorMode,
      isEditing: isCurrentlyEditing,
      onUpdate: handleDirectElementUpdate,
      onSave: handleElementSave,
      onCancel: handleElementCancel
    };
    
    // Добавляем базовые данные элемента
    if (element.data) {
      Object.assign(elementProps, element.data);
    } else {
      Object.assign(elementProps, element);
    }
    
    // Для FAQ элемента данные могут быть в корне элемента
    if (element.type === 'faq-section') {
      elementProps.title = element.title || element.data?.title;
      elementProps.items = element.items || element.data?.items;
    }
    
    // Для progress-bars добавляем недостающие поля
    if (element.type === 'progress-bars') {
      elementProps.progress = element.progress || element.data?.progress || 45;
      elementProps.caption = element.caption || element.data?.caption || 'Прогресс загрузки';
    }
    
    // Для apex-line адаптируем данные
    if (element.type === 'apex-line') {
      elementProps.categories = element.data?.labels || ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен'];
      elementProps.chartSeries = element.data?.series || [{
        name: "Продажи",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }];
    }
    
    // Добавляем настройки анимаций
    elementProps.animationSettings = element.data?.animationSettings || element.animationSettings || {
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    };

    const handleElementClick = (e) => {
      e.stopPropagation();
      onElementSelect(sectionId, element.id);
    };

    const handleElementDoubleClick = (e) => {
      e.stopPropagation();
      console.log('[PagePreview] Double click on element:', element.type, element.id);
      // Для определенных типов элементов запускаем режим редактирования в превью
      if (['rich-text', 'markdown-editor', 'code-editor', 'blockquote', 'gradient-text', 'solid-text', 'animated-counter', 'typewriter-text', 'highlight-text', 'testimonial-card', 'faq-section', 'timeline-component', 'alert-component', 'bar-chart', 'cta-section', 'image-gallery'].includes(element.type)) {
        console.log('[PagePreview] Starting edit mode for element:', element.type, element.id);
        setEditingElement({ sectionId, elementId: element.id });
      }
    };

    const handleElementSave = (newContent) => {
      console.log('[PagePreview] handleElementSave called with:', newContent);
      console.log('[PagePreview] Element type:', element.type);
      console.log('[PagePreview] editingElement:', editingElement);
      
      if (onElementUpdate) {
        // Для rich-text элементов обрабатываем по-особому
        if (element.type === 'rich-text') {
          console.log('[PagePreview] Processing rich-text element save');
          if (typeof newContent === 'object' && newContent !== null) {
            // Если передан объект с данными, обновляем все поля
            const updatedElement = {
              ...element,
              data: {
                ...element.data,
                ...newContent
              }
            };
            console.log('[PagePreview] Updated rich-text element:', updatedElement);
            onElementUpdate(sectionId, element.id, updatedElement);
          } else {
            // Если передана только строка контента
            onElementUpdate(sectionId, element.id, 'content', newContent);
          }
        } else if (editingElement && ['blockquote', 'gradient-text', 'animated-counter', 'typewriter-text', 'highlight-text', 'testimonial-card', 'faq-section', 'timeline-component', 'alert-component', 'bar-chart', 'cards-grid', 'cta-section'].includes(element.type)) {
          // Передаем весь объект данных для обновления
          onElementUpdate(editingElement.sectionId, editingElement.elementId, 'data', newContent);
        } else if (editingElement && element.type === 'multiple-cards') {
          // Для multiple-cards передаем весь объект элемента
          const updatedElement = {
            ...element,
            ...newContent
          };
          console.log('[PagePreview] Updated multiple-cards element:', updatedElement);
          onElementUpdate(editingElement.sectionId, editingElement.elementId, updatedElement);
        }
      }
      setEditingElement(null);
    };

    // Функция для прямого обновления элемента (без editingElement)
    const handleDirectElementUpdate = (newContent) => {
      console.log('[PagePreview] Direct element update:', newContent);
      console.log('[PagePreview] Element before update:', element);
      if (onElementUpdate) {
        // Создаем обновленный элемент
        const updatedElement = {
          ...element,
          data: {
            ...element.data,
            ...newContent
          }
        };
        console.log('[PagePreview] Updated element:', updatedElement);
        console.log('[PagePreview] Calling onElementUpdate with:', sectionId, element.id, updatedElement);
        onElementUpdate(sectionId, element.id, updatedElement);
      } else {
        console.log('[PagePreview] onElementUpdate not available');
      }
    };

    const handleElementCancel = () => {
      setEditingElement(null);
    };

    const isCurrentlyEditing = editingElement && 
                               editingElement.sectionId === sectionId && 
                               editingElement.elementId === element.id;
                               
    console.log('[PagePreview] Element editing state:', {
      elementType: element.type,
      elementId: element.id,
      editingElement,
      isCurrentlyEditing
    });

    const elementStyle = {
      position: 'relative',
      cursor: 'pointer',
      borderRadius: '8px',
      padding: '4px',
      margin: '2px 0',
      transition: 'all 0.3s ease',
      border: isSelected ? '2px solid #1976d2' : '2px solid transparent',
      backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
      boxShadow: isSelected ? '0 0 10px rgba(25, 118, 210, 0.3)' : 'none',
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.02)',
        border: '2px solid rgba(25, 118, 210, 0.3)'
      }
    };

    let renderedElement;
    switch (element.type) {
      // Текстовые компоненты
      case 'typography':
        renderedElement = <TypographyElement {...elementProps} />;
        break;
      case 'rich-text':
        renderedElement = (
          <RichTextEditor 
            title={element.data?.title}
            content={element.data?.content}
            showTitle={element.data?.showTitle}
            titleColor={element.data?.titleColor}
            textColor={element.data?.textColor}
            backgroundColor={element.data?.backgroundColor}
            padding={element.data?.padding}
            borderRadius={element.data?.borderRadius}
            animationSettings={element.data?.animationSettings || {
              animationType: 'fadeIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }}
            isPreview={true}
            isEditing={isCurrentlyEditing}
            constructorMode={constructorMode}
            onUpdate={handleDirectElementUpdate}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
          />
        );
        break;
      case 'code-block':
        renderedElement = <CodeBlock {...elementProps} />;
        break;
      case 'blockquote':
        renderedElement = (
          <BlockquoteNew 
            quote={element.data?.quote}
            author={element.data?.author}
            source={element.data?.source}
            showAuthor={element.data?.showAuthor}
            showSource={element.data?.showSource}
            quoteColor={element.data?.quoteColor}
            authorColor={element.data?.authorColor}
            backgroundColor={element.data?.backgroundColor}
            borderColor={element.data?.borderColor}
            useGradient={element.data?.useGradient}
            gradientColor1={element.data?.gradientColor1}
            gradientColor2={element.data?.gradientColor2}
            gradientDirection={element.data?.gradientDirection}
            fontFamily={element.data?.fontFamily}
            fontWeight={element.data?.fontWeight}
            quoteFontSize={element.data?.quoteFontSize}
            authorFontSize={element.data?.authorFontSize}
            padding={element.data?.padding}
            borderWidth={element.data?.borderWidth}
            textAlign={element.data?.textAlign}
            borderPosition={element.data?.borderPosition}
            italic={element.data?.italic}
            isPreview={true}
            constructorMode={constructorMode}
            isConstructorMode={!constructorMode}
            editable={true}
            onUpdate={handleDirectElementUpdate}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
            animationSettings={element.data?.animationSettings}
          />
        );
        break;
      case 'list':
        renderedElement = <ListComponent {...elementProps} />;
        break;
      case 'callout':
        renderedElement = <Callout {...elementProps} />;
        break;
        
      // Карточки
      case 'basic-card':
        renderedElement = <BasicCard {...elementProps} />;
        break;
      case 'image-card':
        renderedElement = (
          <ImageCard 
            {...elementProps} 
            onAddElement={(newElement) => {
              // Добавляем новый элемент в секцию
              onAddElement(sectionId, newElement);
            }}
          />
        );
        break;
        
      // Интерактивные элементы
      case 'accordion':
        renderedElement = <AccordionComponent {...elementProps} />;
        break;
      case 'video-player':
        renderedElement = <VideoPlayer {...elementProps} />;
        break;
      case 'qr-code':
        renderedElement = <QRCodeGenerator {...elementProps} />;
        break;

      case 'rating':
        renderedElement = <RatingComponent {...elementProps} />;
        break;
      case 'confetti':
        renderedElement = <ConfettiComponent {...elementProps} />;
        break;

      case 'animated-box':
        renderedElement = <AnimatedBox {...elementProps} />;
        break;
      case 'progress-bars':
        renderedElement = <ProgressBars {...elementProps} />;
        break;
      case 'image-gallery':
        renderedElement = <ImageGallery {...elementProps} />;
        break;
        
      // Таблицы
      case 'data-table':
        renderedElement = <DataTable {...elementProps} />;
        break;
        
      // Базовые графики
      case 'bar-chart':
        renderedElement = (
          <BarChart 
            {...elementProps}
            editable={true}
            constructorMode={constructorMode}
            onUpdate={handleDirectElementUpdate}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
          />
        );
        break;
        
      // Расширенные графики Recharts
      case 'advanced-line-chart':
        renderedElement = <AdvancedLineChart {...elementProps} />;
        break;
      case 'advanced-bar-chart':
        renderedElement = <AdvancedBarChart {...elementProps} />;
        break;
      case 'advanced-pie-chart':
        renderedElement = <AdvancedPieChart {...elementProps} />;
        break;
      case 'advanced-area-chart':
        renderedElement = <AdvancedAreaChart {...elementProps} />;
        break;
      case 'advanced-radar-chart':
        renderedElement = <AdvancedRadarChart {...elementProps} />;
        break;
        
      // Chart.js графики
      case 'chartjs-bar':
        // Специальная обработка для ChartJSBarChart
        const barChartProps = {
          ...elementProps,
          chartData: elementProps.data || elementProps.chartData, // Используем data как chartData
          title: elementProps.title || elementProps.chartData?.title,
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
        
        console.log('[PagePreview] ChartJSBarChart elementProps.title:', elementProps.title);
        console.log('[PagePreview] ChartJSBarChart elementProps.chartData?.title:', elementProps.chartData?.title);
        console.log('[PagePreview] ChartJSBarChart final title:', barChartProps.title);
        console.log('[PagePreview] ChartJSBarChart props:', barChartProps);
        
        renderedElement = <ChartJSBarChart {...barChartProps} />;
        break;
      case 'chartjs-doughnut':
        renderedElement = <ChartJSDoughnutChart {...elementProps} />;
        break;
        
      // ApexCharts графики
      case 'apex-line':
        renderedElement = <ApexLineChart {...elementProps} />;
        break;

        
      // Формы
      case 'advanced-contact-form':
        console.log('[PagePreview] Rendering advanced-contact-form with props:', elementProps);
        renderedElement = <AdvancedContactForm {...elementProps} />;
        break;
        
      // Продвинутые текстовые элементы
      case 'gradient-text':
        renderedElement = <GradientText {...elementProps} />;
        break;
      case 'solid-text':
        renderedElement = (
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
        break;
      case 'animated-counter':
        renderedElement = <AnimatedCounter {...elementProps} />;
        break;
      case 'typewriter-text':
        renderedElement = <TypewriterText {...elementProps} />;
        break;
      case 'highlight-text':
        renderedElement = <HighlightText {...elementProps} />;
        break;
      case 'markdown-editor':
        renderedElement = <MarkdownEditor {...elementProps} />;
        break;
      case 'code-editor':
        renderedElement = <CodeEditor {...elementProps} />;
        break;
        
      // Дополнительные текстовые элементы
      case 'testimonial-card':
        renderedElement = <TestimonialCardElement {...elementProps} />;
        break;
      case 'faq-section':
        renderedElement = <FAQSection {...elementProps} />;
        break;
      case 'timeline-component':
        renderedElement = <TimelineComponent {...elementProps} />;
        break;
      case 'alert-component':
        renderedElement = <AlertComponent {...elementProps} />;
        break;
        
      // CTA секция
      case 'cta-section':
        // Создаем базовый список страниц для CTA
        const availablePages = [
          { id: 'index', title: 'Главная' },
          { id: 'contact', title: 'Контакты' },
          ...(legalDocuments?.privacyPolicy?.content ? [{ id: 'privacy', title: 'Политика конфиденциальности' }] : []),
          ...(legalDocuments?.termsOfService?.content ? [{ id: 'terms', title: 'Условия использования' }] : []),
          ...(legalDocuments?.cookiePolicy?.content ? [{ id: 'cookies', title: 'Cookie политика' }] : []),
        ];
        
        renderedElement = (
          <CTASection 
            title={element.data?.title}
            description={element.data?.description}
            buttonText={element.data?.buttonText}
            targetPage={element.data?.targetPage}
            alignment={element.data?.alignment}
            backgroundColor={element.data?.backgroundColor}
            textColor={element.data?.textColor}
            buttonColor={element.data?.buttonColor}
            buttonTextColor={element.data?.buttonTextColor}
            availablePages={availablePages}
            editable={constructorMode}
            onSave={handleElementSave}
            {...elementProps}
          />
        );
        break;
        
      case 'cards-grid':
        renderedElement = (
          <Box>
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
          </Box>
        );
        break;
        
      case 'multiple-cards':
        renderedElement = (
          <MultipleCardsSection
            cards={element.cards || element.data?.cards || []}
            gridSize={element.gridSize || element.data?.gridSize || 'medium'}
            cardType={element.cardType || element.data?.cardType || 'image-card'}
            title={element.title || element.data?.title}
            description={element.description || element.data?.description}
            sectionStyles={element.sectionStyles || element.data?.sectionStyles}
            onEdit={() => {}}
            onDelete={() => {}}
            editable={false}
          />
        );
        break;


        
      default:
        console.warn(`Unknown content element type: ${element.type}`);
        renderedElement = (
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Неизвестный тип элемента: {element.type}
            </Typography>
          </Box>
        );
    }

    return (
      <Box
        onClick={handleElementClick}
        onDoubleClick={handleElementDoubleClick}
        sx={elementStyle}
        data-element-id={element.id}
        data-section-id={sectionId}
        className={`content-element-preview ${isSelected ? 'selected' : ''}`}
      >
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            ✓
          </Box>
        )}
        {isCurrentlyEditing ? (
          // Режим редактирования для разных типов элементов
          element.type === 'rich-text' ? (
            <RichTextEditor
              title={element.data?.title}
              content={element.data?.content}
              showTitle={element.data?.showTitle}
              titleColor={element.data?.titleColor}
              textColor={element.data?.textColor}
              backgroundColor={element.data?.backgroundColor}
              padding={element.data?.padding}
              borderRadius={element.data?.borderRadius}
              animationSettings={element.data?.animationSettings || {
                animationType: 'fadeIn',
                delay: 0,
                triggerOnView: true,
                triggerOnce: true,
                threshold: 0.1,
                disabled: false
              }}
              isPreview={true}
              isEditing={true}
              constructorMode={constructorMode}
              onUpdate={handleDirectElementUpdate}
              onSave={handleElementSave}
              onCancel={handleElementCancel}
            />
          ) : element.type === 'cards-grid' ? (
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
          ) : element.type === 'multiple-cards' ? (
            <MultipleCardsEditor
              title={element.title || element.data?.title || ''}
              description={element.description || element.data?.description || ''}
              cards={element.cards || element.data?.cards || []}
              cardType={element.cardType || element.data?.cardType || 'image-card'}
              gridSize={element.gridSize || element.data?.gridSize || 'medium'}
              sectionStyles={element.sectionStyles || element.data?.sectionStyles}
              onSave={handleElementSave}
              onCancel={handleElementCancel}
              isPreview={true}
            />
          ) : element.type === 'blockquote' ? (
            <BlockquoteNew
              quote={element.data?.quote}
              author={element.data?.author}
              source={element.data?.source}
              showAuthor={element.data?.showAuthor}
              showSource={element.data?.showSource}
              quoteColor={element.data?.quoteColor}
              authorColor={element.data?.authorColor}
              backgroundColor={element.data?.backgroundColor}
              borderColor={element.data?.borderColor}
              useGradient={element.data?.useGradient}
              gradientColor1={element.data?.gradientColor1}
              gradientColor2={element.data?.gradientColor2}
              gradientDirection={element.data?.gradientDirection}
              fontFamily={element.data?.fontFamily}
              fontWeight={element.data?.fontWeight}
              quoteFontSize={element.data?.quoteFontSize}
              authorFontSize={element.data?.authorFontSize}
              padding={element.data?.padding}
              borderWidth={element.data?.borderWidth}
              textAlign={element.data?.textAlign}
              borderPosition={element.data?.borderPosition}
              italic={element.data?.italic}
              isPreview={true}
              isEditing={true}
              onSave={handleElementSave}
              onCancel={handleElementCancel}
              animationSettings={element.data?.animationSettings}
            />
          ) : element.type === 'gradient-text' ? (
            <GradientText
              text={element.data?.text}
              direction={element.data?.direction}
              color1={element.data?.color1}
              color2={element.data?.color2}
              fontSize={element.data?.fontSize}
              fontWeight={element.data?.fontWeight}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'solid-text' ? (
            <Typography 
              sx={{
                color: element.data?.color || element.color || '#1976d2',
                fontSize: `${element.data?.fontSize || element.fontSize || 24}px`,
                fontWeight: element.data?.fontWeight || element.fontWeight || 'bold',
                textAlign: 'center',
                margin: '1rem 0',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Можно добавить простое редактирование текста
                const newText = prompt('Введите новый текст:', element.data?.text || element.text);
                if (newText !== null) {
                  handleElementSave({ text: newText });
                }
              }}
            >
              {element.data?.text || element.text || 'Цветной текст'}
            </Typography>
          ) : element.type === 'animated-counter' ? (
            <AnimatedCounter
              title={element.data?.title}
              startValue={element.data?.startValue}
              endValue={element.data?.endValue}
              suffix={element.data?.suffix}
              duration={element.data?.duration}
              titleColor={element.data?.titleColor}
              countColor={element.data?.countColor}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'typewriter-text' ? (
            <TypewriterText
              texts={element.data?.texts}
              speed={element.data?.speed}
              pauseTime={element.data?.pauseTime}
              repeat={element.data?.repeat}
              textColor={element.data?.textColor}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'highlight-text' ? (
            <HighlightText
              text={element.data?.text}
              highlightColor={element.data?.highlightColor}
              textColor={element.data?.textColor}
              fontSize={element.data?.fontSize}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'markdown-editor' ? (
            <MarkdownEditor
              content={element.data?.content}
              showPreview={element.data?.showPreview}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'code-editor' ? (
            <CodeEditor
              code={element.data?.code}
              language={element.data?.language}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'testimonial-card' ? (
            <TestimonialCardElement
              name={element.data?.name}
              role={element.data?.role}
              company={element.data?.company}
              content={element.data?.content}
              rating={element.data?.rating}
              avatar={element.data?.avatar}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'faq-section' ? (
            <FAQSection
              title={element.title || element.data?.title}
              items={element.items || element.data?.items}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'timeline-component' ? (
            <TimelineComponent
              title={element.data?.title}
              events={element.data?.events}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'alert-component' ? (
            <AlertComponent
              title={element.data?.title}
              message={element.data?.message}
              type={element.data?.type}
              showIcon={element.data?.showIcon}
              isPreview={true}
              isEditing={true}
              onUpdate={handleElementSave}
            />
          ) : element.type === 'bar-chart' ? (
            <BarChart
              title={element.data?.title}
              data={element.data?.data}
              showValues={element.data?.showValues}
              showGrid={element.data?.showGrid}
              animate={element.data?.animate}
              orientation={element.data?.orientation}
              height={element.data?.height}
              customStyles={element.data?.customStyles}
              animationSettings={element.data?.animationSettings}
              isPreview={true}
              isEditing={true}
              constructorMode={false}
              editable={true}
              onUpdate={handleElementSave}
              onSave={handleElementSave}
              onCancel={handleElementCancel}
            />
          ) : element.type === 'cta-section' ? (
            (() => {
              // Создаем базовый список страниц для CTA в режиме редактирования
              const availablePages = [
                { id: 'index', title: 'Главная' },
                { id: 'contact', title: 'Контакты' },
                ...(legalDocuments?.privacyPolicy?.content ? [{ id: 'privacy', title: 'Политика конфиденциальности' }] : []),
                ...(legalDocuments?.termsOfService?.content ? [{ id: 'terms', title: 'Условия использования' }] : []),
                ...(legalDocuments?.cookiePolicy?.content ? [{ id: 'cookies', title: 'Cookie политика' }] : []),
              ];
              
              return (
                <CTASection
                  title={element.data?.title}
                  description={element.data?.description}
                  buttonText={element.data?.buttonText}
                  targetPage={element.data?.targetPage}
                  alignment={element.data?.alignment}
                  backgroundColor={element.data?.backgroundColor}
                  textColor={element.data?.textColor}
                  buttonColor={element.data?.buttonColor}
                  buttonTextColor={element.data?.buttonTextColor}
                  availablePages={availablePages}
                  isPreview={true}
                  editable={true}
                  onSave={handleElementSave}
                  onCancel={handleElementCancel}
                />
              );
            })()
          ) : null
        ) : (
          <Box sx={{ position: 'relative' }}>
            {/* Подсказка о возможности редактирования */}
            {['rich-text', 'blockquote', 'gradient-text', 'animated-counter', 'typewriter-text', 'highlight-text', 'markdown-editor', 'code-editor', 'testimonial-card', 'faq-section', 'timeline-component', 'alert-component', 'bar-chart', 'cards-grid', 'multiple-cards', 'cta-section'].includes(element.type) && (
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
                  '.content-element-preview:hover &': {
                    opacity: 1
                  }
                }}
              >
                Двойной клик для редактирования
              </Box>
            )}
            {renderedElement}
          </Box>
        )}
      </Box>
    );
  };

  const renderSection = (section) => {
    if (!section) return null;
    
    console.log(`[PagePreview] Rendering section ${section.id}:`, section);
    console.log(`[PagePreview] Section has ${section.contentElements ? section.contentElements.length : 0} content elements`);
    
    // Получаем URL изображения, учитывая возможную структуру данных
    const getFirstImageUrl = (images) => {
      console.log('[getFirstImageUrl] Input images:', images);
      if (!images) return null;
      
      // Проверяем, является ли images массивом
      if (Array.isArray(images)) {
        if (images.length === 0) return null;
        
        const img = images[0];
        if (typeof img === 'string') return img;
        return img?.url || img?.path || null;
      }
      
      // Если images - строка, возвращаем её как URL
      if (typeof images === 'string') return images;
      
      // Если images - объект, пытаемся получить url или path
      return images?.url || images?.path || null;
    };
    
    const sectionImgUrl = getFirstImageUrl(sectionImages[section.id]) || section.imagePath;
    console.log('[renderSection] Final sectionImgUrl:', sectionImgUrl);
    
    // Получаем цвета из карточек секции для градиента рамки
    const getBorderColors = () => {
      if (section.cards && section.cards.length > 0) {
        const firstCard = section.cards[0];
        const lastCard = section.cards[section.cards.length - 1];
        
        // Используем только цвет обводки карточки
        const startColor = firstCard.borderColor || theme.palette.primary.main;
        const endColor = lastCard.borderColor || theme.palette.primary.light;

        return {
          start: startColor,
          end: endColor
        };
      }
      
      // Если карточек нет, используем цвета из темы
      return {
        start: theme.palette.primary.main,
        end: theme.palette.primary.light
      };
    };

    const borderColors = getBorderColors();
    
    if (section.cardType === CARD_TYPES.NONE) {
      return (
        <Box sx={{
          background: section.showBackground !== false ? 
            (section.backgroundColor ? section.backgroundColor : 
            (section.gradientStart && section.gradientEnd) ? 
            `linear-gradient(145deg, ${section.gradientStart}, ${section.gradientEnd})` : 
            'rgba(0,0,0,0.85)') : 
            'transparent',
          borderRadius: '20px',
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '1000px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${borderColors.start}, ${borderColors.end})`,
          }
        }}>
          <Box sx={{
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                textAlign: 'left',
                marginBottom: '1rem',
                color: section.titleColor || '#ffd700',
                fontFamily: '"Montserrat", sans-serif',
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                paddingBottom: '0.5rem'
              }}
            >
              {section.title}
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: '2rem',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              <Box sx={{
                flex: 1,
                minWidth: 0 // Для корректного переноса текста
              }}>
                {section.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      textAlign: 'left',
                      color: section.descriptionColor || '#fff',
                      fontFamily: '"Roboto", sans-serif',
                      lineHeight: 1.6,
                      maxWidth: '100%',
                      padding: '0 0.5rem'
                    }}
                  >
                    {section.description}
                  </Typography>
                )}
              </Box>

              {/* Изображение справа */}
              {(section.imagePath || sectionImages[section.id]?.length > 0) && (
                <Box sx={{
                  width: { xs: '100%', md: '300px' },
                  height: { xs: '250px', md: '300px' },
                  flexShrink: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  },
                  '& .simple-image-gallery': {
                    width: '100%',
                    height: '100%',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }
                }}>
                  {sectionImages[section.id]?.length > 0 ? (
                    <SimpleImageGallery 
                      images={sectionImages[section.id]}
                      autoScroll={section.autoScrollEnabled !== undefined ? section.autoScrollEnabled : true}
                      scrollInterval={2000}
                      position="right"
                      maxHeight="100%"
                      fillContainer={true}
                    />
                  ) : sectionImgUrl && (
                    <img 
                      src={sectionImgUrl}
                      alt={section.title || 'Section image'}
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        if (e.target.src !== section.imagePath) {
                          e.target.src = section.imagePath;
                        }
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {section.cards?.map((card, index) => (
                <Box
                  key={card.id}
                  sx={{
                    padding: '1rem',
                    borderLeft: `3px solid ${card.borderColor || theme.palette.primary.main}`,
                    background: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0,0,0,0.02)',
                      paddingLeft: '1.5rem'
                    }
                  }}
                >
                  {card.title && (
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: card.titleColor || section.titleColor || theme.palette.text.primary,
                        fontFamily: '"Montserrat", sans-serif'
                      }}
                    >
                      {card.title}
                    </Typography>
                  )}
                  {card.content && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.6,
                        color: card.contentColor || section.contentColor || theme.palette.text.secondary,
                        fontFamily: '"Roboto", sans-serif',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {card.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        key={section.id}
        id={section.id}
        ref={el => {
          if (el) {
            sectionRefs.current[section.id] = el;
          }
        }}
        sx={{
          py: 8,
          px: 2,
          backgroundColor: section.showBackground !== false ? (section.backgroundColor || 'transparent') : 'transparent',
          color: section.textColor || 'inherit',
          position: 'relative',
          overflow: 'visible',
          borderRadius: '20px',
          '&::before': (showBorders && section.showBackground !== false) ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '4px solid transparent',
            borderRadius: '20px',
            background: `linear-gradient(45deg, ${borderColors.start}, ${borderColors.end}) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 1,
            transition: 'all 0.3s ease-in-out',
            animation: 'borderPulse 3s infinite, glowPulse 3s infinite',
          } : {},
          '&:hover::before': (showBorders && section.showBackground !== false) ? {
            border: '5px solid transparent',
            boxShadow: `0 0 25px 15px ${borderColors.start}`,
            animation: 'none',
          } : {}
        }}
      >
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <Switch
            checked={showBorders}
            onChange={() => setShowBorders(!showBorders)}
            color="primary"
            size="small"
          />
        </Box>
        {/* Фоновое изображение с размытием */}
        {section.backgroundImage && section.showBackground !== false && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${section.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${section.blurAmount || 0}px)`,
              transition: 'filter 0.3s ease-in-out',
              zIndex: 0
            }}
          />
        )}
        
        {/* Затемнение */}
        {section.enableOverlay && section.showBackground !== false && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${Number(section.overlayOpacity)})`,
              transition: 'background-color 0.3s ease-in-out',
              zIndex: 1
            }}
          />
        )}

        <Container maxWidth="lg">
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <Fade in timeout={1000}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  textAlign: 'center',
                  mb: 4,
                  color: section.titleColor || 'inherit',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.01562em',
                  textTransform: 'none',
                  marginBottom: '1.5rem',
                  wordWrap: 'break-word'
                }}
              >
                {section.title}
              </Typography>
            </Fade>
            
            {section.description && (
              <Fade in timeout={1500}>
                <Typography 
                  variant="h6" 
                  component="p" 
                  sx={{ 
                    textAlign: 'center',
                    mb: 4,
                    color: section.descriptionColor || 'inherit',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.5,
                    letterSpacing: '0.00938em',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}
                >
                  {section.description}
                </Typography>
              </Fade>
            )}

            {/* Добавляем отображение изображения секции только если тип секции НЕ "без карточек" */}
            {section.cardType !== CARD_TYPES.NONE && (section.imagePath || sectionImages[section.id]?.length > 0) && (
              <Fade in timeout={1800}>
                <Box className="section-image" sx={{ 
                  mt: 3, 
                  mb: 4,
                  textAlign: 'center',
                  maxWidth: '100%',
                  height: { xs: '300px', sm: '400px', md: '500px' } // Фиксированная высота контейнера
                }}>
                  {/* Используем SimpleImageGallery если есть несколько изображений */}
                  {sectionImages[section.id]?.length > 0 ? (
                    <Box sx={{ 
                      width: '100%',
                      height: '100%', // Занимаем всю высоту родителя
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      <SimpleImageGallery 
                        images={sectionImages[section.id]} 
                        autoScroll={section.autoScrollEnabled !== undefined ? section.autoScrollEnabled : true}
                        scrollInterval={2000}
                        position="right"
                        fillContainer={true} // Заполняем контейнер
                      />
                    </Box>
                  ) : sectionImgUrl && (
                    <img 
                      src={sectionImgUrl}
                      alt={section.title || 'Section image'}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%', // Заполняем всю высоту
                        objectFit: 'cover', // Используем cover для заполнения
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      onError={(e) => {
                        console.error('Image load error:', e);
                        console.log('Current src:', e.target.src);
                        console.log('Section imagePath:', section.imagePath);
                        console.log('SectionImages state:', sectionImages[section.id]);

                        if (e.target.src !== section.imagePath) {
                          console.log('Falling back to direct imagePath');
                          e.target.src = section.imagePath;
                        }
                      }}
                      onLoad={() => console.log('Image loaded successfully:', sectionImgUrl)}
                    />
                  )}
                </Box>
              </Fade>
            )}
          </Box>

          {section.cardType !== CARD_TYPES.NONE && section.cards?.length > 0 ? (
            <Box sx={{ 
              mt: section.description ? 0 : 16,
              pt: section.description ? 8 : 0,
              position: 'relative',
              zIndex: 2
            }} className="cards-container">
              <Grid container spacing={4}>
                {section.cards?.map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} key={card.id}>
                    <Grow in timeout={1000 + index * 200}>
                      <Box sx={{ 
                        position: 'relative',
                        zIndex: 2,
                        '&:hover': {
                          zIndex: 3
                        }
                      }}>
                        {section.id === 'testimonials' ? (
                          <TestimonialCard testimonial={card} />
                        ) : (
                          <Box sx={{ height: '100%' }}>
                            {renderCard(card, section.cardType, section)}
                          </Box>
                        )}
                      </Box>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ 
              mt: 4,
              p: 4,
              borderRadius: '16px',
              background: section.showBackground !== false ? 
                (section.backgroundColor ? section.backgroundColor : 
                (section.gradientStart && section.gradientEnd) ? 
                `linear-gradient(145deg, ${section.gradientStart}, ${section.gradientEnd})` : 
                'rgba(0,0,0,0.85)') : 
                'transparent',
              boxShadow: section.showBackground !== false ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
              position: 'relative',
              '&::before': section.showBackground !== false ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '16px',
                padding: '2px',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                zIndex: 0
              } : {}
            }}>
              {console.log('[PagePreview] Секция без карточек:', section.id, 'Изображения:', sectionImages[section.id], 'ImagePath:', section.imagePath)}
              
              {/* Специальный контейнер для лучшего обтекания текстом в секциях без карточек */}
              <Box sx={{ 
                position: 'relative',
                textAlign: 'left',
                overflow: 'hidden',
                backgroundColor: section.showBackground !== false ? 'transparent' : 'transparent',
                display: 'flow-root', // Решает проблемы с обтеканием floated элементов
              }}>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: section.imagePath ? 'left' : 'center',
                    color: section.titleColor || '#000000',
                    position: 'relative',
                    '&::after': section.showBackground !== false ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: section.imagePath ? 0 : '50%',
                      transform: section.imagePath ? 'none' : 'translateX(-50%)',
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                      borderRadius: '2px'
                    } : {}
                  }}
                >
                  {section.title}
                </Typography>
                {console.log('[PagePreview] Тип карточек:', section.cardType, 'CARD_TYPES.NONE:', CARD_TYPES.NONE, 'Равен:', section.cardType === CARD_TYPES.NONE)}
                {/* Отображаем изображения ТОЛЬКО для секций без карточек */}
                {section.cardType === CARD_TYPES.NONE && (section.imagePath || sectionImages[section.id]?.length > 0) && (
                  <Box sx={{ 
                    float: 'right',
                    margin: '0 0 1rem 1.5rem',
                    maxWidth: { xs: '100%', sm: '300px' },
                    width: { xs: '100%', sm: '40%' },
                    height: { xs: '250px', sm: '300px' }, // Фиксированная высота
                    position: 'relative',
                    display: 'block',
                    '&::after': section.showBackground !== false ? {
                      content: '""',
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      right: '-8px',
                      bottom: '-8px',
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      borderRadius: '16px',
                      zIndex: -1,
                      opacity: 0.3
                    } : {}
                  }}>
                    {sectionImages[section.id]?.length > 0 ? (
                      <Box sx={{ 
                        width: '100%',
                        height: '100%', // Занимаем всю высоту родительского контейнера
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        <SimpleImageGallery 
                          images={sectionImages[section.id]}
                          autoScroll={section.autoScrollEnabled !== undefined ? section.autoScrollEnabled : true}
                          scrollInterval={2000}
                          position="right"
                          maxHeight="100%"
                          fillContainer={true} // Добавляем новый параметр для заполнения контейнера
                        />
                      </Box>
                    ) : sectionImgUrl && (
                      <img 
                        src={sectionImgUrl}
                        alt={section.title || 'Section image'}
                        style={{
                          width: '100%',
                          height: '100%', // Занимаем всю высоту
                          objectFit: 'cover', // Изменено с 'contain' на 'cover'
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transition: 'transform 0.3s ease',
                          display: 'block'
                        }}
                        onError={(e) => {
                          console.error('Image load error:', e);
                          console.log('Current src:', e.target.src);
                          console.log('Section imagePath:', section.imagePath);
                          console.log('SectionImages state:', sectionImages[section.id]);

                          if (e.target.src !== section.imagePath) {
                            console.log('Falling back to direct imagePath');
                            e.target.src = section.imagePath;
                          }
                        }}
                        onLoad={() => console.log('Image loaded successfully:', sectionImgUrl)}
                      />
                    )}
                  </Box>
                )}
                <Box sx={{ overflow: 'hidden', display: 'flow-root' }}> {/* Добавлен display: 'flow-root' для правильного обтекания */}
                  <Box sx={{ pl: section.imagePath ? 2 : 0 }}>
                    {section.description && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          lineHeight: 1.6,
                          textAlign: section.imagePath ? 'left' : 'center',
                          color: section.descriptionColor || '#666666',
                          mb: 2,
                          display: 'block',
                          overflow: 'hidden'
                        }}
                      >
                        {section.description}
                      </Typography>
                    )}
                    {section.cards?.map((card, index) => (
                      <Box key={card.id} sx={{ mb: 2 }}>
                        {card.title && (
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: card.titleColor || section.titleColor || '#1976d2',
                              mb: 1,
                              fontWeight: 600
                            }}
                          >
                            {card.title}
                          </Typography>
                        )}
                        {card.content && (
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              lineHeight: 1.6,
                              textAlign: section.imagePath ? 'left' : 'center',
                              color: card.contentColor || section.contentColor || '#666666'
                            }}
                          >
                            {card.content}
                          </Typography>
                        )}
                      </Box>
                    ))}
                    
                    {/* Рендеринг элементов контента */}
                    {section.contentElements && section.contentElements.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        {console.log(`[PagePreview] Section ${section.id} has ${section.contentElements.length} content elements:`, section.contentElements)}
                        {section.contentElements.map((element) => (
                          <Box key={element.id} sx={{ mb: 2 }}>
                            {renderContentElement(element, section.id)}
                  </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Рендеринг новых элементов из AI парсера */}
                    {section.elements && section.elements.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        {console.log(`[PagePreview] Section ${section.id} has ${section.elements.length} AI elements:`, section.elements)}
                        {section.elements.map((element) => (
                          <Box key={element.id} sx={{ mb: 2 }}>
                            {renderContentElement(element, section.id)}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Рендеринг элементов контента для обычных секций */}
          {section.cardType !== CARD_TYPES.NONE && section.contentElements && section.contentElements.length > 0 && (
            <Fade in timeout={2000}>
              <Box sx={{ mt: 4 }}>
                {console.log(`[PagePreview] Regular section ${section.id} has ${section.contentElements.length} content elements:`, section.contentElements)}
                {section.contentElements.map((element) => (
                  <Box key={element.id} sx={{ mb: 3 }}>
                    {renderContentElement(element, section.id)}
                  </Box>
                ))}
              </Box>
            </Fade>
          )}
          
          {/* Рендеринг новых элементов из AI парсера для обычных секций */}
          {section.cardType !== CARD_TYPES.NONE && section.elements && section.elements.length > 0 && (
            <Fade in timeout={2000}>
              <Box sx={{ mt: 4 }}>
                {console.log(`[PagePreview] Regular section ${section.id} has ${section.elements.length} AI elements:`, section.elements)}
                {section.elements.map((element) => (
                  <Box key={element.id} sx={{ mb: 3 }}>
                    {renderContentElement(element, section.id)}
                  </Box>
                ))}
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
    );
  };

  // Заменяем обработчик сообщений для поддержки нового формата галереи
  const handleMessage = useCallback((event) => {
    console.log('[PagePreview] Received message:', event.data);
    
    switch (event.data.type) {
      case 'UPDATE_SECTION_IMAGE': // Обрабатываем устаревший формат
        const { sectionId, imagePath } = event.data;
        if (sectionId && imagePath) {
          console.log('[PagePreview] Processing UPDATE_SECTION_IMAGE for section:', sectionId);
          setSectionImages(prev => ({
            ...prev,
            [sectionId]: [imagePath]
          }));
        }
        break;
      case 'UPDATE_SECTION_IMAGES': // Новый формат с массивом изображений
        const { sectionId: sid, images } = event.data;
        if (sid && images) {
          console.log('[PagePreview] Processing UPDATE_SECTION_IMAGES for section:', sid, 'with images:', images);
          setSectionImages(prev => {
            // Обрабатываем разные форматы изображений
            const newImageUrls = images.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path;
            });
            
            // Проверяем тип секции для корректной обработки
            const section = Object.values(sectionsData || {}).find(s => s.id === sid);
            console.log('[PagePreview] Section type for', sid, ':', section?.cardType, 'NONE:', CARD_TYPES.NONE);
            
            // Полностью заменяем изображения для секции
            return {
              ...prev,
              [sid]: newImageUrls
            };
          });
        }
        break;
      case 'ADD_SECTION_IMAGES': // Добавление изображений к существующим
        const { sectionId: addSid, images: addImages } = event.data;
        if (addSid && addImages) {
          console.log('[PagePreview] Processing ADD_SECTION_IMAGES for section:', addSid);
          setSectionImages(prev => {
            const currentImages = [...(prev[addSid] || [])];
            // Обрабатываем разные форматы изображений
            const newImageUrls = addImages.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path;
            });
            
            // Добавляем новые изображения к текущим
            const updatedImages = [...currentImages, ...newImageUrls];
            
            return {
              ...prev,
              [addSid]: updatedImages
            };
          });
        }
        break;
      case 'REMOVE_SECTION_IMAGE':
        const { sectionId: removeSid, imageIndex } = event.data;
        if (removeSid && typeof imageIndex === 'number') {
          console.log('[PagePreview] Processing REMOVE_SECTION_IMAGE for section:', removeSid, 'index:', imageIndex);
          setSectionImages(prev => {
            const currentImages = [...(prev[removeSid] || [])];
            currentImages.splice(imageIndex, 1);
            return {
              ...prev,
              [removeSid]: currentImages
            };
          });
        }
        break;
      case 'REORDER_SECTION_IMAGES':
        const { sectionId: reorderSid, images: newImages } = event.data;
        if (reorderSid && newImages) {
          console.log('[PagePreview] Processing REORDER_SECTION_IMAGES for section:', reorderSid);
          setSectionImages(prev => {
            // Обрабатываем разные форматы изображений
            const reorderedUrls = newImages.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path;
            });
            return {
              ...prev,
              [reorderSid]: reorderedUrls
            };
          });
        }
        break;
      case 'UPDATE_AUTOSCROLL_SETTING':
        // Обработка настройки автопрокрутки для галереи изображений
        const { sectionId: autoScrollSectionId, autoScroll } = event.data;
        if (autoScrollSectionId) {
          console.log(`[PagePreview] Updating auto-scroll for section ${autoScrollSectionId}: ${autoScroll}`);
          
          // Находим элемент секции
          const sectionElement = sectionRefs.current[autoScrollSectionId];
          if (sectionElement) {
            console.log(`[PagePreview] Found section element for ${autoScrollSectionId}`);
            
            // Пересылаем событие всем SimpleImageGallery на странице
            // Это необходимо, так как SimpleImageGallery слушает события window
            window.postMessage({
              type: 'UPDATE_AUTOSCROLL_SETTING',
              sectionId: autoScrollSectionId,
              autoScroll: autoScroll
            }, '*');
            
            // Также обновляем состояние при рендеринге секции
            if (sectionsData && sectionsData[autoScrollSectionId]) {
              const section = sectionsData[autoScrollSectionId];
              if (section) {
                // Обновляем секцию с новыми параметрами
                section.autoScrollEnabled = autoScroll;
                console.log(`[PagePreview] Updated section data with autoScrollEnabled=${autoScroll}`);
              }
            }
          } else {
            console.warn(`[PagePreview] Could not find section element for ${autoScrollSectionId}`);
          }
        }
        break;
      case 'SCROLL_TO_SECTION':
        const element = sectionRefs.current[event.data.sectionId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
  }, [sectionsData, renderSection]);

  useEffect(() => {
    console.log('[PagePreview] Current sectionImages state:', sectionImages);
  }, [sectionImages]);

  useEffect(() => {
    const loadSectionImages = async () => {
      console.log('[PagePreview] Loading section images for:', sectionsData);
      const newImages = { ...sectionImages }; // Начинаем с текущего состояния изображений
      const sections = Object.values(sectionsData || {});
      
      for (const section of sections) {
        if (section && section.id) {
          // Проверяем есть ли массив images для нового формата
          if (section.images && section.images.length > 0) {
            console.log('[PagePreview] Found multiple images for section:', section.id, section.images);
            const sectionImageUrls = [];
            
            // Преобразуем каждое изображение в URL
            for (const image of section.images) {
              try {
                const imagePath = typeof image === 'string' ? image : image.path;
                if (!imagePath) {
                  console.warn('[PagePreview] Missing image path in:', image);
                  continue;
                }
                
                // Извлекаем имя файла для поиска в кэше
                const filename = imagePath.split('/').pop();
                
                // Перед созданием нового blob URL, проверяем, не загружено ли уже это изображение
                const existingImages = newImages[section.id] || [];
                const existingImage = Array.isArray(existingImages) 
                  ? existingImages.find(img => img.includes(filename))
                  : (existingImages && existingImages.includes(filename) ? existingImages : null);
                
                if (existingImage) {
                  // Если изображение уже загружено, используем существующий URL
                  console.log('[PagePreview] Using existing URL for image:', existingImage);
                  sectionImageUrls.push(existingImage);
                } else {
                  // Иначе загружаем новое изображение
                  const blob = await imageCacheService.getImage(filename);
                  
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    sectionImageUrls.push(url);
                    console.log('[PagePreview] Created blob URL for image:', url);
                  } else {
                    sectionImageUrls.push(imagePath);
                    console.log('[PagePreview] Using direct image path:', imagePath);
                  }
                }
              } catch (error) {
                console.error('[PagePreview] Error loading section image:', error);
                if (typeof image === 'string') {
                  sectionImageUrls.push(image);
                } else if (image.path) {
                  sectionImageUrls.push(image.path);
                }
              }
            }
            
            // Заменяем изображения для данной секции
            newImages[section.id] = sectionImageUrls;
          } 
          // Проверяем старый формат (один путь)
          else if (section.imagePath) {
            try {
              console.log('[PagePreview] Found single image path for section:', section.id, section.imagePath);
              const filename = section.imagePath.split('/').pop();
              
              // Проверяем, не загружено ли уже это изображение
              const existingImages = newImages[section.id];
              const existingImage = Array.isArray(existingImages) 
                ? existingImages.find(img => img.includes(filename))
                : (existingImages && existingImages.includes(filename) ? existingImages : null);
              
              if (existingImage) {
                // Если изображение уже загружено, используем существующий URL
                console.log('[PagePreview] Using existing URL for single image:', existingImage);
                newImages[section.id] = Array.isArray(existingImages) ? [existingImage] : existingImage;
              } else {
                // Иначе загружаем новое изображение
                const blob = await imageCacheService.getImage(filename);
                
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  newImages[section.id] = [url];
                  console.log('[PagePreview] Created blob URL for image:', url);
                } else {
                  newImages[section.id] = [section.imagePath];
                  console.log('[PagePreview] Using direct image path:', section.imagePath);
                }
              }
            } catch (error) {
              console.error('[PagePreview] Error loading section image:', error);
              newImages[section.id] = [section.imagePath];
            }
          }
        }
      }
      console.log('[PagePreview] Final images data:', newImages);
      setSectionImages(newImages);
    };

    loadSectionImages();

    return () => {
      // Сохраняем текущие URLs, которые мы отозвали, чтобы не отзывать дважды
      const revokedUrls = new Set();
      
      // Очищаем только blob URLs
      Object.values(sectionImages).forEach(urls => {
        if (!urls) return;
        
        // Проверяем, является ли urls массивом
        if (Array.isArray(urls)) {
          urls.forEach(url => {
            if (url && typeof url === 'string' && url.startsWith('blob:') && !revokedUrls.has(url)) {
              console.log('[PagePreview] Revoking blob URL:', url);
              URL.revokeObjectURL(url);
              revokedUrls.add(url);
            }
          });
        } else if (typeof urls === 'string' && urls.startsWith('blob:') && !revokedUrls.has(urls)) {
          console.log('[PagePreview] Revoking blob URL:', urls);
          URL.revokeObjectURL(urls);
          revokedUrls.add(urls);
        }
      });
      
      console.log('[PagePreview] Revoked total blob URLs:', revokedUrls.size);
    };
  }, [sectionsData]);

  useEffect(() => {
    const updateCardHeights = () => {
      Object.entries(sectionsData || {}).forEach(([sectionId, sectionContent]) => {
        if (!sectionContent.cards || sectionContent.cards.length === 0) return;

        // Reset all card heights to auto first
        sectionContent.cards.forEach(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          if (ref) {
            ref.style.height = 'auto';
          }
        });

        // Force reflow
        void document.body.offsetHeight;

        // Get current heights of all cards
        const currentHeights = sectionContent.cards.map(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          return ref ? ref.getBoundingClientRect().height : 0;
        });

        // Find the maximum height
        const maxHeight = Math.max(...currentHeights);

        // Update all cards in this section to match the max height
        sectionContent.cards.forEach(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          if (ref) {
            ref.style.height = `${maxHeight}px`;
          }
        });
      });
    };

    // Initial update
    updateCardHeights();

    // Set up mutation observer to watch for content changes
    const observer = new MutationObserver(updateCardHeights);
    const config = { 
      childList: true, 
      subtree: true, 
      characterData: true
    };

    // Observe all card content
    Object.entries(sectionsData || {}).forEach(([sectionId, sectionContent]) => {
      if (!sectionContent.cards || sectionContent.cards.length === 0) return;
      sectionContent.cards.forEach(card => {
        const ref = cardRefs.current[`${sectionId}-${card.id}`];
        if (ref) {
          observer.observe(ref, config);
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionsData]);

  const scrollToSection = (id) => {
    setTimeout(() => {
      const element = sectionRefs.current[id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Section with id ${id} not found`);
      }
    }, 100);
  };

  const handleMenuClick = (id) => {
    scrollToSection(id);
  };

  // Apply background styles to preview area
  React.useEffect(() => {
    const previewArea = document.querySelector('.preview-area');
    if (!previewArea) return;

    // Remove any existing overlay
    const existingOverlay = previewArea.querySelector('.site-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Apply background only to main content area
    const mainContent = previewArea.querySelector('main');
    if (!mainContent) return;

    if (headerData?.siteBackgroundType === 'solid') {
      mainContent.style.background = 'none';
      mainContent.style.backgroundColor = headerData.siteBackgroundColor || '#ffffff';
    } else if (headerData?.siteBackgroundType === 'gradient') {
      mainContent.style.background = `linear-gradient(${headerData?.siteGradientDirection || 'to right'}, 
        ${headerData?.siteGradientColor1 || '#ffffff'}, 
        ${headerData?.siteGradientColor2 || '#f5f5f5'})`;
      mainContent.style.backgroundColor = 'transparent';
    } else if (headerData?.siteBackgroundType === 'image') {
      // Remove any existing background elements
      const existingBackground = mainContent.querySelector('.background-image');
      if (existingBackground) {
        existingBackground.remove();
      }

      // Create background image element
      const backgroundImage = document.createElement('div');
      backgroundImage.className = 'background-image';
      backgroundImage.style.position = 'absolute';
      backgroundImage.style.top = '0';
      backgroundImage.style.left = '0';
      backgroundImage.style.right = '0';
      backgroundImage.style.bottom = '0';
      backgroundImage.style.background = `url('/images/hero/fon.jpg') no-repeat center center fixed`;
      backgroundImage.style.backgroundSize = 'cover';
      backgroundImage.style.zIndex = '-2';
      
      // Apply blur to background image
      if (headerData?.siteBackgroundBlur > 0) {
        backgroundImage.style.filter = `blur(${headerData.siteBackgroundBlur}px)`;
      }
      
      mainContent.appendChild(backgroundImage);
      
      // Add overlay if enabled
      if (headerData?.siteBackgroundDarkness > 0) {
        const overlay = document.createElement('div');
        overlay.className = 'site-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100})`;
        overlay.style.zIndex = '-1';
        mainContent.appendChild(overlay);
      }

      // Reset main content styles
      mainContent.style.background = 'none';
      mainContent.style.backgroundColor = 'transparent';
      mainContent.style.filter = 'none';
    }
  }, [headerData]);

  useEffect(() => {
    console.log('[PagePreview] Setting up message listener');
    
    // Добавляем небольшую задержку перед установкой обработчика сообщений, 
    // чтобы убедиться, что состояние изображений инициализировано
    const timeoutId = setTimeout(() => {
      console.log('[PagePreview] Message listener activated after delay');
      window.addEventListener('message', handleMessage);
    }, 500);
    
    return () => {
      console.log('[PagePreview] Removing message listener');
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  // Обработчик изменений настроек фона
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const backgroundImage = mainContent.querySelector('.background-image');
    const overlay = mainContent.querySelector('.site-overlay');

    if (backgroundImage) {
      backgroundImage.style.transition = 'filter 0.3s ease-in-out';
      backgroundImage.style.filter = `blur(${backgroundSettings.blur}px)`;
    }

    if (overlay) {
      overlay.style.transition = 'background-color 0.3s ease-in-out';
      overlay.style.backgroundColor = `rgba(0, 0, 0, ${backgroundSettings.darkness / 100})`;
    }
  }, [backgroundSettings]);

  // Обновление настроек при изменении headerData
  useEffect(() => {
    setBackgroundSettings({
      blur: headerData?.siteBackgroundBlur || 0,
      darkness: headerData?.siteBackgroundDarkness || 0
    });
  }, [headerData]);

  // Применяем стили к странице
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Условное отображение в зависимости от режима
  console.log('🎯 [PagePreview] constructorMode:', constructorMode);
  if (!constructorMode) {
    console.log('🔄 [PagePreview] Rendering in MultiPage mode - returning MultiPagePreview');
    return (
      <MultiPagePreview
        headerData={headerData}
        heroData={heroData}
        sectionsData={sectionsData}
        contactData={contactData}
        footerData={footerData}
        legalDocuments={legalDocuments}
        liveChatData={liveChatData}
        onElementUpdate={onElementUpdate}
        selectedElement={selectedElement}
        onElementSelect={onElementSelect}
      />
    );
  }
  
  console.log('✅ [PagePreview] Rendering in Constructor mode - proceeding to main render');

  // Логирование прямо перед return
  console.log('[PagePreview] Before return - sectionsData:', sectionsData);
  console.log('[PagePreview] Before return - typeof sectionsData:', typeof sectionsData);
  console.log('[PagePreview] Before return - sectionsData === null:', sectionsData === null);
  console.log('[PagePreview] Before return - sectionsData === undefined:', sectionsData === undefined);
  console.log('[PagePreview] Before return - Array.isArray(sectionsData):', Array.isArray(sectionsData));
  console.log('[PagePreview] Before return - JSON.stringify(sectionsData):', JSON.stringify(sectionsData));
  console.log('[PagePreview] Before return - Object.keys(sectionsData):', Object.keys(sectionsData || {}));
  console.log('[PagePreview] Before return - Object.entries(sectionsData):', Object.entries(sectionsData || {}));

  console.log('🚨🚨🚨 [PagePreview] MAIN RETURN BLOCK REACHED 🚨🚨🚨');
  console.log('🔥 sectionsData in main return:', sectionsData);

  return (
    <>
      <style>{globalStyles}</style>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
      }} className="preview-area">
        <Box
          ref={el => {
            if (el) {
              sectionRefs.current['header'] = el;
            }
          }}
          id="header"
        >
          <Header 
            headerData={headerData} 
            onMenuClick={handleMenuClick}
            contactData={contactData}
          />
        </Box>
        <Box component="main" sx={{ 
          flexGrow: 1,
          position: 'relative'
        }}>
          <Box
            ref={heroSectionRef}
            id="hero"
          >
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
          </Box>
          {(() => {
            console.log('[PagePreview] About to render sections, sectionsData:', sectionsData);
            console.log('[PagePreview] Object.entries result:', Object.entries(sectionsData || {}));
            const sectionsArray = Object.entries(sectionsData || {});
            console.log('[PagePreview] Sections array length:', sectionsArray.length);
            return null;
          })()}
          {(() => {
            console.log('[PagePreview] Starting sections render');
            console.log('[PagePreview] sectionsData for render:', sectionsData);
            console.log('[PagePreview] Object.entries for render:', Object.entries(sectionsData || {}));
            
            const sectionsEntries = Object.entries(sectionsData || {});
            console.log('[PagePreview] sectionsEntries length:', sectionsEntries.length);
            
            return sectionsEntries.map(([sectionId, sectionContent]) => {
              console.log(`[PagePreview] Mapping section ${sectionId}:`, sectionContent);
              console.log(`[PagePreview] sectionContent type:`, typeof sectionContent);
              console.log(`[PagePreview] sectionContent keys:`, Object.keys(sectionContent || {}));
              
              return (
            <Box
              key={sectionId}
              id={sectionId}
              ref={el => {
                if (el) {
                  sectionRefs.current[sectionId] = el;
                }
              }}
              sx={{
                position: 'relative',
                mb: 4,
                p: 2,
                border: showBorders ? '1px dashed rgba(0, 0, 0, 0.12)' : 'none',
                borderRadius: 1,
                '&:hover': {
                  border: showBorders ? '1px dashed #1976d2' : 'none'
                }
              }}
            >
                  {(() => {
                    console.log(`[PagePreview] About to render section ${sectionId}`);
                    return renderSection(sectionContent);
                  })()}
            </Box>
              );
            });
          })()}
          <Box
            ref={contactSectionRef}
            id="contact"
            sx={{ py: 8 }}
          >
            <ContactSection 
              contactData={contactData}
              showBorders={showBorders}
            />
          </Box>
        </Box>
        <Box
          ref={el => {
            if (el) {
              sectionRefs.current['footer'] = el;
            }
          }}
          id="footer"
        >
          <FooterSection 
            footerData={footerData}
            contactData={contactData}
            legalDocuments={legalDocuments}
            headerData={headerData}
          />
        </Box>
        
        {/* Live Chat Widget */}
        {liveChatData?.enabled && (
          <LiveChatWidget 
            siteName={headerData?.siteName || 'Мой сайт'} 
            apiKey={liveChatData?.apiKey || ''} 
          />
        )}
      </Box>
    </>
  );
};

export default PagePreview; 