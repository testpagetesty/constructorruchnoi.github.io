import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Tooltip,
  Avatar,
  Alert,
  AlertTitle,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import AnimationWrapper from '../AnimationWrapper';
import { uploadAndSaveImage, generateCardId } from '../../../utils/imageConverter';
import ImageUploadPreview from './ImageUploadPreview';
import AnimationControls from '../AnimationControls';
import PageSelector from './PageSelector';
import ImageCacheStats from './ImageCacheStats';
import { v4 as uuidv4 } from 'uuid';
import CardModal from './CardModal';
import ColorSettings from '../TextComponents/ColorSettings';

const ImageCard = ({
  id,
  title = 'Карточка с изображением',
  content = 'Описание изображения или дополнительная информация к карточке.',
  imageUrl = 'https://via.placeholder.com/300x200?text=Изображение',
  imageAlt = 'Изображение',
  buttonText = '',
  buttonLink = '',
  imagePosition = 'top',
  imageHeight = 200,
  elevation = 2,
  variant = 'elevated',
  size = 'medium',
  alignment = 'left',
  showActions = false,
  customStyles = {},
  // Настройки цветов через ColorSettings
  colorSettings = {},
  titleColor = '#333333',
  contentColor = '#666666',
  backgroundColor = '#ffffff',
  borderColor = '#e0e0e0',
  gradientStart = '#ffffff',
  gradientEnd = '#f5f5f5',
  gradientDirection = 'to right',
  useGradient = false,
  onUpdate,
  onDelete,
  editable = true,
  animationSettings = {},
  onAddElement = null,
  gridSize = 'medium',
  onClick = null,
  maxTitleHeight = 0,
  sx = {} // Добавляем sx пропс
}) => {
  // Генерируем уникальный ID если не передан
  const [cardId] = useState(() => id || generateCardId('card', title));
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [currentImageAlt, setCurrentImageAlt] = useState(imageAlt);
  const [currentButtonText, setCurrentButtonText] = useState(buttonText);
  const [currentButtonLink, setCurrentButtonLink] = useState(buttonLink);
  const [currentImagePosition, setCurrentImagePosition] = useState(imagePosition);
  const [currentImageHeight, setCurrentImageHeight] = useState(imageHeight);
  const [currentElevation, setCurrentElevation] = useState(elevation);
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentAlignment, setCurrentAlignment] = useState(alignment);
  const [showCardActions, setShowCardActions] = useState(showActions);
  const [currentTitleColor, setCurrentTitleColor] = useState(titleColor);
  const [currentContentColor, setCurrentContentColor] = useState(contentColor);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);
  const [currentBorderColor, setCurrentBorderColor] = useState(borderColor);
  const [currentGradientStart, setCurrentGradientStart] = useState(gradientStart);
  const [currentGradientEnd, setCurrentGradientEnd] = useState(gradientEnd);
  const [currentGradientDirection, setCurrentGradientDirection] = useState(gradientDirection);
  const [currentUseGradient, setCurrentUseGradient] = useState(useGradient);
  const [cardGridSize, setCardGridSize] = useState(gridSize); // xs, small, medium, large, xl
  const [showMultipleCardsDialog, setShowMultipleCardsDialog] = useState(false);
  const [multipleCardsData, setMultipleCardsData] = useState({
    count: 3,
    baseTitle: 'Карточка',
    baseContent: 'Описание карточки',
    baseImageUrl: 'https://via.placeholder.com/300x200?text=Изображение',
    gridSize: 'medium',
    variant: 'elevated',
    size: 'medium'
  });
  // Используем только colorSettings для всех стилей
  const [currentColorSettings, setCurrentColorSettings] = useState(() => {
    // Инициализируем с дефолтными значениями если colorSettings пустые
    if (colorSettings && Object.keys(colorSettings).length > 0) {
      return colorSettings;
    }
    return {
      textFields: {
        title: '#333333',
        text: '#666666',
        background: '#ffffff',
        border: '#e0e0e0'
      },
      sectionBackground: {
        enabled: false,
        useGradient: false,
        solidColor: '#ffffff',
        gradientColor1: '#ffffff',
        gradientColor2: '#f5f5f5',
        gradientDirection: 'to right',
        opacity: 1
      },
      borderColor: '#e0e0e0',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      boxShadow: false,
      imageFilter: 'none',
      imageOpacity: 1
    };
  });
  
  // 🔥 ИСПРАВЛЕНИЕ: Приоритет переданных пропсов над currentColorSettings
  const titleColorFromSettings = currentColorSettings?.textFields?.cardTitle || currentColorSettings?.textFields?.title || customStyles?.titleColor || '#333333';
  const textColorFromSettings = currentColorSettings?.textFields?.cardText || currentColorSettings?.textFields?.text || customStyles?.textColor || '#666666';
  const backgroundColorFromSettings = 
    (currentColorSettings?.cardBackground?.enabled
      ? (currentColorSettings.cardBackground.useGradient
          ? `linear-gradient(${currentColorSettings.cardBackground.gradientDirection || 'to right'}, ${currentColorSettings.cardBackground.gradientColor1 || '#ffffff'}, ${currentColorSettings.cardBackground.gradientColor2 || '#f5f5f5'})`
          : currentColorSettings.cardBackground.solidColor || '#ffffff')
      : currentColorSettings?.sectionBackground?.enabled
      ? (currentColorSettings.sectionBackground.useGradient
          ? `linear-gradient(${currentColorSettings.sectionBackground.gradientDirection || 'to right'}, ${currentColorSettings.sectionBackground.gradientColor1 || '#ffffff'}, ${currentColorSettings.sectionBackground.gradientColor2 || '#f5f5f5'})`
          : currentColorSettings.sectionBackground.solidColor || '#ffffff')
      : customStyles?.backgroundColor || '#ffffff');
  const borderColorFromSettings = currentColorSettings?.textFields?.border || customStyles?.borderColor || '#e0e0e0';
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState(animationSettings);
  const [animationExpanded, setAnimationExpanded] = useState(false);
  const [linkType, setLinkType] = useState('external');
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Синхронизируем состояния с пропсами при их изменении
  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  useEffect(() => {
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    setCurrentImageAlt(imageAlt);
  }, [imageAlt]);

  useEffect(() => {
    setCurrentButtonText(buttonText);
  }, [buttonText]);

  useEffect(() => {
    setCurrentButtonLink(buttonLink);
  }, [buttonLink]);

  useEffect(() => {
    setCurrentImagePosition(imagePosition);
  }, [imagePosition]);

  useEffect(() => {
    setCurrentImageHeight(imageHeight);
  }, [imageHeight]);

  useEffect(() => {
    setCurrentVariant(variant);
  }, [variant]);

  useEffect(() => {
    setCurrentSize(size);
  }, [size]);

  useEffect(() => {
    setCardGridSize(gridSize);
  }, [gridSize]);

  useEffect(() => {
    if (animationSettings && Object.keys(animationSettings).length > 0) {
      setCurrentAnimationSettings(animationSettings);
    } else {
      // Устанавливаем настройки анимации по умолчанию, если они не переданы
      setCurrentAnimationSettings({
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      });
    }
  }, [animationSettings]);

  useEffect(() => {
    if (titleColor) {
      setCurrentTitleColor(titleColor);
    }
  }, [titleColor]);

  useEffect(() => {
    if (contentColor) {
      setCurrentContentColor(contentColor);
    }
  }, [contentColor]);

  useEffect(() => {
    setCurrentBackgroundColor(backgroundColor);
  }, [backgroundColor]);

  // Синхронизируем customStyles с currentColorSettings
  useEffect(() => {
    if (customStyles && Object.keys(customStyles).length > 0) {
      // Обновляем цвета из customStyles
      if (customStyles.titleColor) {
        setCurrentTitleColor(customStyles.titleColor);
      }
      if (customStyles.textColor) {
        setCurrentContentColor(customStyles.textColor);
      }
      if (customStyles.backgroundColor) {
        setCurrentBackgroundColor(customStyles.backgroundColor);
      }
      if (customStyles.borderColor) {
        setCurrentBorderColor(customStyles.borderColor);
      }
    }
  }, [customStyles]);

  useEffect(() => {
    setCurrentBorderColor(borderColor);
  }, [borderColor]);

  useEffect(() => {
    setCurrentGradientStart(gradientStart);
  }, [gradientStart]);

  useEffect(() => {
    setCurrentGradientEnd(gradientEnd);
  }, [gradientEnd]);

  useEffect(() => {
    setCurrentGradientDirection(gradientDirection);
  }, [gradientDirection]);

  useEffect(() => {
    setCurrentUseGradient(useGradient);
  }, [useGradient]);

  const imagePositions = [
    { value: 'top', label: 'Сверху', description: 'Изображение над текстом' },
    { value: 'left', label: 'Слева', description: 'Изображение слева от текста' },
    { value: 'right', label: 'Справа', description: 'Изображение справа от текста' },
    { value: 'bottom', label: 'Снизу', description: 'Изображение под текстом' },
    { value: 'background', label: 'Фон', description: 'Изображение как фон' }
  ];

  const variants = [
    { value: 'elevated', label: 'Приподнятая' },
    { value: 'outlined', label: 'С рамкой' },
    { value: 'filled', label: 'Заполненная' }
  ];

  const sizes = [
    { value: 'xs', label: 'Очень маленькая', padding: '8px', fontSize: '12px', gridClass: 'card-xs' },
    { value: 'small', label: 'Маленькая', padding: '12px', fontSize: '14px', gridClass: 'card-small' },
    { value: 'medium', label: 'Средняя', padding: '16px', fontSize: '16px', gridClass: 'card-medium' },
    { value: 'large', label: 'Большая', padding: '24px', fontSize: '18px', gridClass: 'card-large' },
    { value: 'xl', label: 'Очень большая', padding: '32px', fontSize: '20px', gridClass: 'card-xl' },
    { value: 'xxl', label: 'Огромная', padding: '40px', fontSize: '22px', gridClass: 'card-xxl' },
    { value: 'xxxl', label: 'Максимальная', padding: '48px', fontSize: '24px', gridClass: 'card-xxxl' }
  ];

  const alignments = [
    { value: 'left', label: 'По левому краю' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'По правому краю' }
  ];

  const imageFilters = [
    { value: 'none', label: 'Без фильтра' },
    { value: 'grayscale(100%)', label: 'Черно-белое' },
    { value: 'sepia(100%)', label: 'Сепия' },
    { value: 'blur(2px)', label: 'Размытие' },
    { value: 'brightness(1.2)', label: 'Яркость' },
    { value: 'contrast(1.2)', label: 'Контрастность' },
    { value: 'saturate(1.5)', label: 'Насыщенность' }
  ];

  const getCardStyles = () => {
    const sizeConfig = sizes.find(s => s.value === currentSize) || sizes[1];
    
    const baseStyles = {
      textAlign: currentAlignment,
      transition: 'all 0.3s ease',
      cursor: editable ? 'pointer' : 'default'
    };

    const contentStyles = {
      padding: currentColorSettings.padding ? `${currentColorSettings.padding}px` : sizeConfig.padding,
      titleColor: titleColorFromSettings,
      textColor: textColorFromSettings
    };

    // Определяем фон карточки
    let backgroundStyle = {};
    
    // 🔥 ИСПРАВЛЕНИЕ: Приоритет colorSettings над customStyles для фона
    if (currentColorSettings.sectionBackground?.enabled) {
      if (currentColorSettings.sectionBackground.useGradient) {
        backgroundStyle = {
          background: `linear-gradient(${currentColorSettings.sectionBackground.gradientDirection || 'to right'}, ${currentColorSettings.sectionBackground.gradientColor1 || '#ffffff'}, ${currentColorSettings.sectionBackground.gradientColor2 || '#f5f5f5'})`
        };
      } else {
        backgroundStyle = {
          backgroundColor: currentColorSettings.sectionBackground.solidColor || '#ffffff'
        };
      }
      if (currentColorSettings.sectionBackground.opacity !== undefined) {
        backgroundStyle.opacity = currentColorSettings.sectionBackground.opacity;
      }
    } else if (customStyles?.backgroundType === 'gradient') {
      backgroundStyle = {
        background: `linear-gradient(${customStyles.gradientDirection || 'to right'}, ${customStyles.gradientColor1 || '#ffffff'}, ${customStyles.gradientColor2 || '#f5f5f5'})`
      };
    } else if (currentUseGradient) {
      backgroundStyle = {
        background: `linear-gradient(${currentGradientDirection}, ${currentGradientStart}, ${currentGradientEnd})`
      };
    } else {
      backgroundStyle = {
        backgroundColor: backgroundColorFromSettings
      };
    }

    // 🔥 ИСПРАВЛЕНИЕ: Приоритет colorSettings над customStyles для границ
    let borderStyle = {};
    if (currentColorSettings?.textFields?.border) {
      borderStyle = {
        border: `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.textFields.border}`,
        borderRadius: `${currentColorSettings.borderRadius || 8}px`
      };
    } else if (customStyles?.borderColor) {
      borderStyle = {
        border: `${customStyles.borderWidth || 1}px solid ${customStyles.borderColor}`,
        borderRadius: `${customStyles.borderRadius || 8}px`
      };
    } else if (currentVariant === 'outlined') {
      borderStyle = {
        border: `1px solid ${borderColorFromSettings}`,
        borderRadius: `${currentColorSettings?.borderRadius || customStyles?.borderRadius || 8}px`
      };
    }

    // Применяем настройки теней из colorSettings
    let additionalStyles = {};
    if (currentColorSettings.boxShadow) {
      additionalStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }

    switch (currentVariant) {
      case 'outlined':
        return {
          card: {
            ...baseStyles,
            ...backgroundStyle,
            ...borderStyle,
            ...additionalStyles,
            boxShadow: 'none'
          },
          content: contentStyles,
          titleColor: titleColorFromSettings,
          textColor: textColorFromSettings
        };
      case 'filled':
        return {
          card: {
            ...baseStyles,
            ...backgroundStyle,
            ...additionalStyles,
            border: 'none',
            borderRadius: `${customStyles?.borderRadius || currentColorSettings.borderRadius || 8}px`
          },
          content: contentStyles,
          titleColor: titleColorFromSettings,
          textColor: textColorFromSettings
        };
      default: // elevated
        return {
          card: {
            ...baseStyles,
            ...backgroundStyle,
            ...borderStyle,
            ...additionalStyles,
            borderRadius: `${customStyles?.borderRadius || currentColorSettings.borderRadius || 8}px`
          },
          content: contentStyles,
          titleColor: titleColorFromSettings,
          textColor: textColorFromSettings
        };
    }
  };

  const handleColorUpdate = (newColorSettings) => {
    // Обновляем colorSettings напрямую
    setCurrentColorSettings(newColorSettings);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate({
        title: currentTitle,
        content: currentContent,
        imageUrl: currentImageUrl,
        imageAlt: currentImageAlt,
        buttonText: currentButtonText,
        buttonLink: currentButtonLink,
        linkType: linkType,
        imagePosition: currentImagePosition,
        imageHeight: currentImageHeight,
        elevation: currentElevation,
        variant: currentVariant,
        size: currentSize,
        gridSize: cardGridSize,
        alignment: currentAlignment,
        showActions: showCardActions,
        titleColor: currentTitleColor,
        contentColor: currentContentColor,
        backgroundColor: currentBackgroundColor,
        borderColor: currentBorderColor,
        gradientStart: currentGradientStart,
        gradientEnd: currentGradientEnd,
        gradientDirection: currentGradientDirection,
        useGradient: currentUseGradient,
        colorSettings: currentColorSettings,
        animationSettings: currentAnimationSettings
      });
    }
  };

  const handleButtonClick = () => {
    if (currentButtonLink) {
      window.open(currentButtonLink, '_blank');
    }
  };

  const handleCardClick = (event) => {
    // Проверяем, что клик был не по элементам управления
    if (event && (
      event.target.closest('.MuiIconButton-root') ||
      event.target.closest('.MuiButton-root') ||
      event.target.closest('.card-overlay')
    )) {
      return;
    }
    
    // Если есть onClick пропс, вызываем его
    if (onClick) {
      onClick(event);
      return;
    }
    
    // Иначе открываем модальное окно
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Импортируем утилиты для обработки изображений
      const { processImageUpload } = await import('../../../utils/imageConverter');
      const { imageCacheService } = await import('../../../utils/imageCacheService');
      
      // Используем уникальный ID карточки
      const cardTitle = currentTitle || 'image-card';
      
      console.log('Загрузка изображения для карточки:', cardId, 'с названием:', cardTitle);
      
      // Обрабатываем загрузку изображения (конвертация в JPG, оптимизация, уникальное имя)
      const result = await processImageUpload(file, cardId, cardTitle);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Сохраняем изображение в кеш
      await imageCacheService.saveImage(result.fileName, result.file);
      
      // Сохраняем расширенные метаданные с правильным cardId
      const metadata = {
        fileName: result.fileName,
        originalName: result.originalName,
        originalType: result.originalType,
        cardTitle: cardTitle,
        cardId: cardId, // Используем уникальный cardId из состояния
        size: result.size,
        width: result.width,
        height: result.height,
        uploadDate: new Date().toISOString(),
        processed: true,
        format: 'jpg'
      };
      
      console.log('Сохранение метаданных с cardId:', cardId, metadata);
      await imageCacheService.saveMetadata(`site-images-metadata-${result.fileName}`, metadata);
      
      // Получаем blob из кеша для создания URL
      const blob = await imageCacheService.getImage(result.fileName);
      const imageUrl = URL.createObjectURL(blob);
      
      // Обновляем локальное состояние
      setCurrentImageUrl(imageUrl);
      setCurrentImageAlt(cardTitle);
      
      // Обновляем родительский компонент немедленно
      if (onUpdate) {
        onUpdate({
          imageUrl: imageUrl,
          imageAlt: cardTitle,
          fileName: result.fileName,
          cardId: cardId,
          metadata: metadata
        });
      }
      
      // Отправляем событие для обновления ImageUploadPreview
      setTimeout(() => {
        const event = new CustomEvent('imageUploaded', { 
          detail: { 
            fileName: result.fileName, 
            url: imageUrl, 
            metadata,
            cardId: cardId,
            cardTitle: cardTitle
          } 
        });
        window.dispatchEvent(event);
      }, 100);
      
      console.log('Изображение успешно обработано и загружено:', {
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        dimensions: `${result.width}x${result.height}`,
        cardId: cardId
      });
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      setUploadError('Ошибка при загрузке изображения: ' + error.message);
    } finally {
      setIsUploading(false);
      // Очищаем input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (url, fileName, metadata) => {
    const newAlt = metadata.cardTitle || metadata.originalName || currentTitle;
    
    // Обновляем родительский компонент немедленно
    if (onUpdate) {
      onUpdate({
        imageUrl: url,
        imageAlt: newAlt,
        fileName: fileName, // Используем оригинальное имя файла из кеша
        cardId: id || metadata.cardId
      });
    }
    
    // Принудительно обновляем локальное состояние
    setCurrentImageUrl(url);
    setCurrentImageAlt(newAlt);
    
    console.log('Изображение выбрано для карточки:', id, 'файл:', fileName);
  };

  const handleAnimationChange = (newSettings) => {
    setCurrentAnimationSettings(newSettings);
  };

  const handleAnimationToggle = (event, expanded) => {
    setAnimationExpanded(expanded);
  };

  const handleLinkTypeChange = (newLinkType) => {
    setLinkType(newLinkType);
  };

  const handleCreateMultipleCards = () => {
    const cards = [];
    for (let i = 1; i <= multipleCardsData.count; i++) {
      cards.push({
        id: Date.now() + i,
        title: `${multipleCardsData.baseTitle} ${i}`,
        content: `${multipleCardsData.baseContent} ${i}`,
        imageUrl: multipleCardsData.baseImageUrl,
        imageAlt: `Изображение ${i}`,
        buttonText: 'Подробнее',
        buttonLink: '#',
        gridSize: multipleCardsData.gridSize,
        variant: multipleCardsData.variant,
        size: multipleCardsData.size,
        alignment: 'left',
        showActions: false,
        customStyles: {
          backgroundColor: '#ffffff',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          borderRadius: 8,
          textColor: '#333333',
          titleColor: '#1976d2'
        },
        animationSettings: {
          animationType: 'fadeIn',
          delay: i * 0.1,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Создаем новый элемент типа multiple-cards
    const newElement = {
      type: 'multiple-cards',
      data: {
        title: 'Множественные карточки',
        description: 'Секция с несколькими карточками',
        cardType: 'image-card',
        gridSize: 'auto', // Используем 'auto' для автоматического расчета размеров
        cards: cards
      }
    };
    
    // Добавляем новый элемент в секцию
    if (onAddElement) {
      onAddElement(newElement);
    } else if (onUpdate) {
      // Fallback для обратной совместимости
      onUpdate({
        type: 'multiple-cards',
        cards: cards,
        gridSize: multipleCardsData.gridSize,
        cardType: 'image-card'
      });
    }
    
    setShowMultipleCardsDialog(false);
  };

  const renderImage = () => {
    if (!currentImageUrl) return null;

    // Адаптивная высота изображения в зависимости от размера карточки
    const getImageHeight = () => {
      const baseHeight = currentImageHeight;
      switch (currentSize) {
        case 'xxxl': return Math.max(baseHeight * 1.4, 200);
        case 'xxl': return Math.max(baseHeight * 1.2, 180);
        case 'xl': return Math.max(baseHeight * 1.1, 160);
        case 'large': return Math.max(baseHeight * 1.0, 140);
        default: return Math.min(baseHeight, 160); // Ограничиваем максимальную высоту
      }
    };

    const imageStyles = {
      height: getImageHeight(),
      objectFit: 'cover',
      filter: currentColorSettings.imageFilter || 'none',
      opacity: currentColorSettings.imageOpacity || 1,
      transition: 'all 0.3s ease'
    };

    if (currentImagePosition === 'background') {
      return (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${currentImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: currentColorSettings.imageFilter || 'none',
            opacity: currentColorSettings.imageOpacity || 1,
            zIndex: 0
          }}
        />
      );
    }

    return (
      <CardMedia
        component="img"
        image={currentImageUrl}
        alt={currentImageAlt}
        sx={imageStyles}
      />
    );
  };

  const renderContent = () => {
    const styles = getCardStyles();
    
    return (
      <CardContent sx={{ 
        ...styles.content, 
        pb: showCardActions ? 1 : 2,
        position: currentImagePosition === 'background' ? 'relative' : 'static',
        zIndex: currentImagePosition === 'background' ? 1 : 'auto',
        backgroundColor: currentImagePosition === 'background' ? 'rgba(255,255,255,0.9)' : 'transparent',
        backdropFilter: currentImagePosition === 'background' ? 'blur(10px)' : 'none',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          {/* Заголовок */}
          <Typography
            className="card-title"
            variant={currentSize === 'large' ? 'h5' : currentSize === 'small' ? 'h6' : 'h6'}
            component="h2"
            sx={{
              color: styles.titleColor,
              fontWeight: 'bold',
              marginBottom: currentContent ? 2 : 0,
              minHeight: maxTitleHeight > 0 ? `${maxTitleHeight}px` : 'auto'
            }}
          >
            {currentTitle}
          </Typography>

          {/* Содержимое */}
          {currentContent && (
            <Typography
              variant="body2"
              sx={{
                color: styles.textColor,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 6, // Ограничиваем до 6 строк (примерно 50 слов)
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                ...(currentContent.includes('\n') ? { wordBreak: 'break-word' } : {}) // Добавляем wordBreak для переноса слов
              }}
              className="card-content-text"
            >
              {currentContent}
            </Typography>
          )}
        </Box>
      </CardContent>
    );
  };

  const renderCard = () => {
    const styles = getCardStyles();
    const sizeConfig = sizes.find(s => s.value === currentSize) || sizes[1];
    
    return (
      <Card
        className={`image-card ${sizeConfig.gridClass} card-grid-${cardGridSize}`}
        onClick={handleCardClick}
        sx={{
          ...styles.card,
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          // Убираем принудительную ширину для CSS Grid
          width: '100%',
          maxWidth: '100%',
          minWidth: '250px',
          // Применяем размер шрифта и отступы из sizeConfig
          fontSize: sizeConfig.fontSize,
          '& .MuiCardContent-root': {
            padding: sizeConfig.padding,
          },
          '&:hover': editable ? {
            transform: 'translateY(-4px)',
            boxShadow: currentVariant === 'elevated' ? 
              `0 8px 25px rgba(0,0,0,0.15)` : 
              `0 4px 12px rgba(0,0,0,0.1)`
          } : {},
          '&:hover .card-overlay': {
            opacity: 1
          },
          // Применяем переданные sx стили (перезаписывают предыдущие)
          ...sx
        }}
        elevation={currentVariant === 'elevated' ? currentElevation : 0}
        variant={currentVariant === 'outlined' ? 'outlined' : 'elevation'}
      >
        {/* Overlay для редактирования */}
        {editable && (
          <Box
            className="card-overlay"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: 0,
              transition: 'opacity 0.2s ease',
              zIndex: 2
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Загрузить изображение">
                <IconButton
                  size="small"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                  }}
                >
                  {isUploading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CloudUploadIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Редактировать">
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {onDelete && (
                <Tooltip title="Удалить">
                  <IconButton
                    size="small"
                    onClick={onDelete}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: 'error.main',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}

        {/* Скрытый input для загрузки файлов */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {/* Фоновое изображение */}
        {currentImagePosition === 'background' && renderImage()}

        {/* Контент с изображением */}
        {currentImagePosition === 'top' && (
          <>
            {renderImage()}
            {renderContent()}
          </>
        )}

        {currentImagePosition === 'bottom' && (
          <>
            {renderContent()}
            {renderImage()}
          </>
        )}

        {(currentImagePosition === 'left' || currentImagePosition === 'right') && (
          <Box sx={{ display: 'flex', flexDirection: currentImagePosition === 'left' ? 'row' : 'row-reverse' }}>
            <Box sx={{ flex: '0 0 200px' }}>
              {renderImage()}
            </Box>
            <Box sx={{ flex: 1 }}>
              {renderContent()}
            </Box>
          </Box>
        )}

        {currentImagePosition === 'background' && renderContent()}

        {/* Действия */}
        {showCardActions && (currentButtonText || currentButtonLink) && (
          <CardActions 
            sx={{ 
              pt: 0,
              position: currentImagePosition === 'background' ? 'relative' : 'static',
              zIndex: currentImagePosition === 'background' ? 1 : 'auto',
              backgroundColor: currentImagePosition === 'background' ? 'rgba(255,255,255,0.9)' : 'transparent'
            }}
          >
            {currentButtonText && (
              <Button
                size="small"
                variant={currentVariant === 'filled' ? 'outlined' : 'contained'}
                onClick={handleButtonClick}
                startIcon={currentButtonLink ? <LinkIcon /> : null}
                sx={{ color: titleColorFromSettings }}
              >
                {currentButtonText}
              </Button>
            )}
          </CardActions>
        )}

        {/* Индикатор типа - убран по запросу пользователя */}
        {/* <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            zIndex: 2
          }}
        >
          <Chip
            label="Карточка с изображением"
            size="small"
            variant="outlined"
            sx={{
              fontSize: '10px',
              height: '16px',
              backgroundColor: 'rgba(255,255,255,0.9)'
            }}
          />
        </Box> */}
      </Card>
    );
  };

  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(currentColorSettings)) {
      console.log('🔄 [ImageCard] Обновление colorSettings:', colorSettings);
      setCurrentColorSettings(colorSettings || {});
    }
  }, [colorSettings]);

  const handleVariantChange = (e) => {
    console.log('Изменение варианта карточки:', e.target.value);
    setCurrentVariant(e.target.value);
    if (onUpdate) onUpdate({ variant: e.target.value });
  };

  const handleSizeChange = (e) => {
    console.log('Изменение размера карточки:', e.target.value);
    setCurrentSize(e.target.value);
    if (onUpdate) onUpdate({ size: e.target.value });
  };

  const handleGridSizeChange = (e) => {
    console.log('Изменение размера в сетке:', e.target.value);
    setCardGridSize(e.target.value);
    if (onUpdate) onUpdate({ gridSize: e.target.value });
  };

  return (
    <AnimationWrapper {...currentAnimationSettings}>
      <Box sx={{ ...sx }}>
        {/* Превью */}
        {!isEditing && (
          <Box 
            onDoubleClick={handleDoubleClick}
            onClick={onClick}
            sx={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            {renderCard()}
          </Box>
        )}

      {/* Редактор */}
      {isEditing && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ImageIcon color="primary" />
            <Typography variant="h6" color="primary">
              Редактирование карточки с изображением
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Изображение */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Изображение:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                label="URL изображения"
                placeholder="https://example.com/image.jpg"
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                disabled={isUploading}
              >
                {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>

            {/* Отображение ошибки загрузки */}
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}

            {/* Информация о загруженном изображении */}
            {currentImageUrl && currentImageUrl.startsWith('blob:') && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>✅ Изображение обработано и сохранено</AlertTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Формат: JPG (автоматическая конвертация)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Уникальное имя: {currentImageUrl.includes('card_') ? 'Сгенерировано автоматически' : 'Загружено из кеша'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Кеширование: IndexedDB + LocalStorage
                </Typography>
                <Typography variant="body2">
                  • Экспорт: Автоматически включено в архив сайта
                </Typography>
              </Alert>
            )}

            {/* Превью загруженных изображений */}
            <ImageUploadPreview 
              onImageSelect={handleImageSelect}
              selectedImageUrl={currentImageUrl}
              cardId={cardId}
              cardTitle={currentTitle}
            />

            <TextField
              fullWidth
              value={currentImageAlt}
              onChange={(e) => setCurrentImageAlt(e.target.value)}
              label="Альтернативный текст"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Позиция изображения</InputLabel>
                <Select
                  value={currentImagePosition}
                  label="Позиция изображения"
                  onChange={(e) => setCurrentImagePosition(e.target.value)}
                >
                  {imagePositions.map(position => (
                    <MenuItem key={position.value} value={position.value}>
                      <Box>
                        <Typography variant="body2">{position.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {position.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                value={currentImageHeight}
                onChange={(e) => setCurrentImageHeight(parseInt(e.target.value))}
                label="Высота изображения (px)"
                inputProps={{ min: 100, max: 600 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Фильтр изображения</InputLabel>
                <Select
                  value={currentColorSettings.imageFilter || 'none'}
                  label="Фильтр изображения"
                  onChange={(e) => setCurrentColorSettings(prev => ({
                    ...prev,
                    imageFilter: e.target.value
                  }))}
                >
                  {imageFilters.map(filter => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                value={currentColorSettings.imageOpacity || 1}
                label="Прозрачность изображения"
                onChange={(e) => setCurrentColorSettings(prev => ({
                    ...prev,
                    imageOpacity: parseFloat(e.target.value)
                }))}
                inputProps={{ min: 0, max: 1, step: 0.1 }}
              />
            </Box>
          </Box>

          {/* Основное содержимое */}
          <TextField
            fullWidth
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            label="Заголовок"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            label="Содержимое"
            sx={{ mb: 2 }}
          />

          {/* Настройки цветов через ColorSettings */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки цветов через ColorSettings:</Typography>
            <ColorSettings
              title="Настройки цветов карточки с изображением"
              colorSettings={currentColorSettings}
              onUpdate={handleColorUpdate}
              availableFields={[
                {
                  name: 'title',
                  label: 'Цвет заголовка',
                  description: 'Цвет заголовка карточки',
                  defaultColor: '#333333'
                },
                {
                  name: 'text',
                  label: 'Цвет текста',
                  description: 'Цвет основного текста карточки',
                  defaultColor: '#666666'
                },
                {
                  name: 'background',
                  label: 'Цвет фона',
                  description: 'Цвет фона карточки',
                  defaultColor: '#ffffff'
                },
                {
                  name: 'border',
                  label: 'Цвет границы',
                  description: 'Цвет границы карточки',
                  defaultColor: '#e0e0e0'
                }
              ]}
              defaultColors={{
                title: '#333333',
                text: '#666666',
                background: '#ffffff',
                border: '#e0e0e0'
              }}
            />
          </Box>

          {/* Настройки градиента */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              🌈 Градиентный фон
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={currentUseGradient}
                  onChange={(e) => setCurrentUseGradient(e.target.checked)}
                />
              }
              label="Использовать градиентный фон"
              sx={{ mb: 2 }}
            />

            {currentUseGradient && (
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>
                    Начальный цвет:
                  </Typography>
                  <input
                    type="color"
                    value={currentGradientStart}
                    onChange={(e) => setCurrentGradientStart(e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>
                    Конечный цвет:
                  </Typography>
                  <input
                    type="color"
                    value={currentGradientEnd}
                    onChange={(e) => setCurrentGradientEnd(e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </Box>
              </Box>
            )}

            {currentUseGradient && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Направление градиента</InputLabel>
                <Select
                  value={currentGradientDirection}
                  label="Направление градиента"
                  onChange={(e) => setCurrentGradientDirection(e.target.value)}
                >
                  <MenuItem value="to right">Слева направо</MenuItem>
                  <MenuItem value="to left">Справа налево</MenuItem>
                  <MenuItem value="to bottom">Сверху вниз</MenuItem>
                  <MenuItem value="to top">Снизу вверх</MenuItem>
                  <MenuItem value="45deg">По диагонали (45°)</MenuItem>
                  <MenuItem value="-45deg">По диагонали (-45°)</MenuItem>
                  <MenuItem value="to bottom right">В правый нижний угол</MenuItem>
                  <MenuItem value="to bottom left">В левый нижний угол</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Статистика кеша изображений */}
          <ImageCacheStats onRefresh={() => {
            // Обновляем превью изображений при очистке кеша
            if (window.dispatchEvent) {
              const event = new CustomEvent('imageCacheCleared');
              window.dispatchEvent(event);
            }
          }} />

          {/* Настройки кнопки */}
          <FormControlLabel
            control={
              <Switch
                checked={showCardActions}
                onChange={(e) => setShowCardActions(e.target.checked)}
              />
            }
            label="Показывать кнопку действия"
            sx={{ mb: 2 }}
          />

          {showCardActions && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Настройки кнопки:
              </Typography>
              
              <TextField
                fullWidth
                value={currentButtonText}
                onChange={(e) => setCurrentButtonText(e.target.value)}
                label="Текст кнопки"
                placeholder="Нажмите здесь"
                sx={{ mb: 2 }}
              />

              <PageSelector
                currentLink={currentButtonLink}
                onLinkChange={setCurrentButtonLink}
                onLinkTypeChange={handleLinkTypeChange}
                linkType={linkType}
              />
            </Box>
          )}

          {/* Настройки стиля */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Вариант</InputLabel>
              <Select
                value={currentVariant}
                label="Вариант"
                onChange={handleVariantChange}
              >
                {variants.map(variant => (
                  <MenuItem key={variant.value} value={variant.value}>
                    {variant.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Размер</InputLabel>
              <Select
                value={currentSize}
                label="Размер"
                onChange={handleSizeChange}
              >
                {sizes.map(size => (
                  <MenuItem key={size.value} value={size.value}>
                    {size.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Размер в сетке</InputLabel>
              <Select
                value={cardGridSize}
                label="Размер в сетке"
                onChange={handleGridSizeChange}
              >
                <MenuItem value="xs">Очень маленькая (1/6)</MenuItem>
                <MenuItem value="small">Маленькая (1/4)</MenuItem>
                <MenuItem value="medium">Средняя (1/3)</MenuItem>
                <MenuItem value="large">Большая (1/2)</MenuItem>
                <MenuItem value="xl">Очень большая (2/3)</MenuItem>
                <MenuItem value="full">Полная ширина (1/1)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Выравнивание</InputLabel>
              <Select
                value={currentAlignment}
                label="Выравнивание"
                onChange={(e) => setCurrentAlignment(e.target.value)}
              >
                {alignments.map(alignment => (
                  <MenuItem key={alignment.value} value={alignment.value}>
                    {alignment.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>



          {/* Настройки анимации */}
          <Box sx={{ mb: 3 }}>
            <AnimationControls
              animationSettings={currentAnimationSettings}
              onAnimationChange={handleAnimationChange}
              expanded={animationExpanded}
              onToggle={handleAnimationToggle}
            />
          </Box>

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Предварительный просмотр:
            </Typography>
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              {renderCard()}
            </Box>
          </Box>

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => setShowMultipleCardsDialog(true)}
              color="secondary"
            >
              Создать несколько карточек
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                Сохранить
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Диалог создания множественных карточек */}
      <Dialog 
        open={showMultipleCardsDialog} 
        onClose={() => setShowMultipleCardsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            Создать несколько карточек в ряд
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Количество карточек"
                  type="number"
                  value={multipleCardsData.count}
                  onChange={(e) => setMultipleCardsData({ 
                    ...multipleCardsData, 
                    count: parseInt(e.target.value) || 1 
                  })}
                  inputProps={{ min: 1, max: 12 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Размер карточек</InputLabel>
                  <Select
                    value={multipleCardsData.gridSize}
                    onChange={(e) => setMultipleCardsData({ 
                      ...multipleCardsData, 
                      gridSize: e.target.value 
                    })}
                  >
                    <MenuItem value="xs">Очень маленькая (1/6)</MenuItem>
                    <MenuItem value="small">Маленькая (1/4)</MenuItem>
                    <MenuItem value="medium">Средняя (1/3)</MenuItem>
                    <MenuItem value="large">Большая (1/2)</MenuItem>
                    <MenuItem value="xl">Очень большая (2/3)</MenuItem>
                    <MenuItem value="full">Полная ширина (1/1)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Базовый заголовок"
                  value={multipleCardsData.baseTitle}
                  onChange={(e) => setMultipleCardsData({ 
                    ...multipleCardsData, 
                    baseTitle: e.target.value 
                  })}
                  placeholder="Карточка"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Базовое описание"
                  value={multipleCardsData.baseContent}
                  onChange={(e) => setMultipleCardsData({ 
                    ...multipleCardsData, 
                    baseContent: e.target.value 
                  })}
                  multiline
                  rows={2}
                  placeholder="Описание карточки"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL изображения"
                  value={multipleCardsData.baseImageUrl}
                  onChange={(e) => setMultipleCardsData({ 
                    ...multipleCardsData, 
                    baseImageUrl: e.target.value 
                  })}
                  placeholder="https://example.com/image.jpg"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Вариант карточек</InputLabel>
                  <Select
                    value={multipleCardsData.variant}
                    onChange={(e) => setMultipleCardsData({ 
                      ...multipleCardsData, 
                      variant: e.target.value 
                    })}
                  >
                    <MenuItem value="elevated">С тенью</MenuItem>
                    <MenuItem value="outlined">С рамкой</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Размер карточек</InputLabel>
                  <Select
                    value={multipleCardsData.size}
                    onChange={(e) => setMultipleCardsData({ 
                      ...multipleCardsData, 
                      size: e.target.value 
                    })}
                  >
                    <MenuItem value="small">Маленькая</MenuItem>
                    <MenuItem value="medium">Средняя</MenuItem>
                    <MenuItem value="large">Большая</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Предварительный просмотр:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Будет создано {multipleCardsData.count} карточек с заголовками:
                {Array.from({ length: multipleCardsData.count }, (_, i) => (
                  <span key={i} style={{ display: 'block', marginLeft: '10px' }}>
                    • {multipleCardsData.baseTitle} {i + 1}
                  </span>
                ))}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMultipleCardsDialog(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleCreateMultipleCards} 
            variant="contained"
            startIcon={<AddIcon />}
          >
            Создать {multipleCardsData.count} карточек
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно для просмотра карточки */}
      <CardModal
        open={modalOpen}
        onClose={handleCloseModal}
        card={{
          title: currentTitle,
          content: currentContent,
          imageUrl: currentImageUrl,
          imageAlt: currentImageAlt,
          imagePosition: currentImagePosition,
          imageHeight: currentImageHeight,
          buttonText: currentButtonText,
          buttonLink: currentButtonLink,
          colorSettings: currentColorSettings
        }}
        cardType="image-card"
      />
    </Box>
    </AnimationWrapper>
  );
};

export default ImageCard; 