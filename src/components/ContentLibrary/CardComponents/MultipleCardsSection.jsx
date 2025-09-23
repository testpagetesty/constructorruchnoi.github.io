import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ImageCard from './ImageCard';
import BasicCard from './BasicCard';
import CardModal from './CardModal';
import AnimationWrapper from '../AnimationWrapper';

const MultipleCardsSection = ({
  cards = [],
  gridSize = 'medium',
  cardType = 'image-card',
  title = 'Секция с карточками',
  description = '',
  colorSettings = {},
  sectionStyles = {
    titleColor: '#1976d2',
    descriptionColor: '#666666',
    backgroundColor: 'transparent',
    backgroundType: 'transparent',
    gradientDirection: 'to right',
    gradientStartColor: '#1976d2',
    gradientEndColor: '#42a5f5',
    padding: '20px',
    borderRadius: '0px'
  },
  sectionAnimationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  onEdit,
  onDelete,
  editable = true,
  onCardUpdate
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [maxTitleHeight, setMaxTitleHeight] = useState(0);
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings || {});
  const gridRef = useRef(null);

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    console.log('🔍 [MultipleCardsSection] useEffect ВЫЗВАН:', {
      'props.colorSettings': colorSettings,
      'state.currentColorSettings': currentColorSettings,
      'props type': typeof colorSettings,
      'props keys': colorSettings ? Object.keys(colorSettings) : [],
      'props textFields': colorSettings?.textFields,
      'equal': JSON.stringify(colorSettings) === JSON.stringify(currentColorSettings)
    });
    
    if (JSON.stringify(colorSettings) !== JSON.stringify(currentColorSettings)) {
      console.log('🔄 [MultipleCardsSection] ОБНОВЛЯЕМ colorSettings:', colorSettings);
      setCurrentColorSettings(colorSettings || {});
    } else {
      console.log('⚠️ [MultipleCardsSection] colorSettings НЕ ИЗМЕНИЛИСЬ');
    }
  }, [colorSettings]);
  
  // Функция для определения количества столбцов на основе размера сетки
  const getColumnsCount = () => {
    // Ограничиваем максимальное количество столбцов до 4
    switch (gridSize) {
      case 'xs':
        return 1;
      case 'small':
        return 2;
      case 'medium':
        return 3;
      case 'large':
        return 4;
      case 'xl':
        return 4; // Максимум 4 столбца
      case 'full':
        return 4; // Максимум 4 столбца
      case 'extra-large':
        return 1;
      default:
        return 4; // По умолчанию 4 столбца (было 3)
    }
  };

  // Функция для определения размера карточки
  const getCardSize = () => {
    // Если gridSize не 'auto', используем переданный размер
    if (gridSize !== 'auto') {
      return gridSize;
    }
    
    // Автоматический расчет размера на основе количества карточек
    const count = cards.length;
    if (count === 1) return 'xxxl';
    if (count === 2) return 'xxl';
    if (count === 3) return 'xl';
    if (count === 4) return 'large';
    return 'medium';
  };

  // Новый расчет стилей карточки
  const getCardStyles = () => {
    const count = cards.length;
    return {
      fontSize: count <= 2 ? '1.2rem' : count === 3 ? '1.1rem' : '1rem',
      padding: count <= 2 ? '24px' : count === 3 ? '20px' : '16px',
      minHeight: count <= 2 ? '320px' : count === 3 ? '280px' : '240px'
    };
  };

  const handleCardClick = (card, event) => {
    // Проверяем, что клик был не по элементам управления
    if (event && (
      event.target.closest('.MuiIconButton-root') ||
      event.target.closest('.MuiButton-root') ||
      event.target.closest('.card-overlay')
    )) {
      return;
    }
    
    // 🔥 ИСПРАВЛЕНИЕ: Применяем стили к карточке перед передачей в модальное окно
    const titleColor = currentColorSettings?.textFields?.cardTitle || colorSettings?.textFields?.cardTitle || '#333333';
    const contentColor = currentColorSettings?.textFields?.cardText || colorSettings?.textFields?.cardText || '#666666';
    const borderColor = currentColorSettings?.textFields?.border || colorSettings?.textFields?.border || '#e0e0e0';
    const backgroundColor = (currentColorSettings?.cardBackground?.enabled || colorSettings?.cardBackground?.enabled) ? 
      ((currentColorSettings?.cardBackground?.useGradient || colorSettings?.cardBackground?.useGradient) ? 
        `linear-gradient(${(currentColorSettings?.cardBackground?.gradientDirection || colorSettings?.cardBackground?.gradientDirection) || 'to right'}, ${(currentColorSettings?.cardBackground?.gradientColor1 || colorSettings?.cardBackground?.gradientColor1) || '#ffffff'}, ${(currentColorSettings?.cardBackground?.gradientColor2 || colorSettings?.cardBackground?.gradientColor2) || '#f0f0f0'})` :
        (currentColorSettings?.cardBackground?.solidColor || colorSettings?.cardBackground?.solidColor) || '#ffffff'
      ) : '#ffffff';
    
    const cardWithStyles = {
      ...card,
      titleColor,
      contentColor,
      backgroundColor,
      borderColor
    };
    
    setSelectedCard(cardWithStyles);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  // Функция для генерации стилей фона секции
  const getSectionBackgroundStyle = () => {
    const styles = {};
    
    // 🔥 ИСПРАВЛЕНИЕ: Приоритет colorSettings над sectionStyles
    // Проверяем наличие sectionBackground в colorSettings, независимо от enabled
    if (currentColorSettings?.sectionBackground) {
      const { sectionBackground } = currentColorSettings;
      console.log('🎨 [MultipleCardsSection] Применяем sectionBackground из colorSettings:', sectionBackground);
      
      if (sectionBackground.useGradient) {
        const direction = sectionBackground.gradientDirection || 'to right';
        const startColor = sectionBackground.gradientColor1 || '#0a0a2e';
        const endColor = sectionBackground.gradientColor2 || '#16213e';
        styles.background = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
        if (sectionBackground.opacity !== undefined) {
          styles.opacity = sectionBackground.opacity;
        }
        console.log('🎨 [MultipleCardsSection] Применили градиент:', styles.background);
      } else {
        styles.backgroundColor = sectionBackground.solidColor || 'transparent';
        if (sectionBackground.opacity !== undefined) {
          styles.opacity = sectionBackground.opacity;
        }
        console.log('🎨 [MultipleCardsSection] Применили сплошной цвет:', styles.backgroundColor);
      }
      return styles;
    }
    
    // Fallback на sectionStyles
    if (!sectionStyles || typeof sectionStyles !== 'object') {
      return { backgroundColor: 'transparent' };
    }
    
    if (sectionStyles.backgroundType === 'gradient') {
      const direction = sectionStyles.gradientDirection || 'to right';
      const startColor = sectionStyles.gradientStartColor || '#1976d2';
      const endColor = sectionStyles.gradientEndColor || '#42a5f5';
      styles.background = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
    } else if (sectionStyles.backgroundType === 'solid') {
      styles.backgroundColor = sectionStyles.backgroundColor || 'transparent';
    } else {
      styles.backgroundColor = 'transparent';
    }
    
    return styles;
  };

  // Функция для вычисления максимальной высоты заголовка
  const calculateMaxTitleHeight = () => {
    if (!gridRef.current || cards.length === 0) return;

    const titleElements = gridRef.current.querySelectorAll('.card-title');
    let maxHeight = 0;

    titleElements.forEach(element => {
      const height = element.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    setMaxTitleHeight(maxHeight);
  };

  // Эффект для пересчета высоты при изменении карточек
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateMaxTitleHeight();
    }, 100); // Небольшая задержка для рендеринга

    return () => clearTimeout(timer);
  }, [cards]);

  // Эффект для пересчета при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      calculateMaxTitleHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderCard = (card) => {
    // 🔥 ИСПРАВЛЕНИЕ: Применяем настройки карточек из colorSettings
    const cardWithAppliedStyles = {
      ...card,
      // Цвета из colorSettings или дефолтные
      titleColor: colorSettings?.textFields?.cardTitle || '#333333',
      contentColor: colorSettings?.textFields?.cardText || '#666666',
      borderColor: colorSettings?.textFields?.border || '#e0e0e0',
      
      // Фон карточки из cardBackground настроек
      backgroundColor: colorSettings?.cardBackground?.enabled ? 
        (colorSettings.cardBackground.useGradient ? 
          `linear-gradient(${colorSettings.cardBackground.gradientDirection || 'to right'}, ${colorSettings.cardBackground.gradientColor1 || '#ffffff'}, ${colorSettings.cardBackground.gradientColor2 || '#f0f0f0'})` :
          colorSettings.cardBackground.solidColor || '#ffffff'
        ) : '#ffffff',
      useGradient: colorSettings?.cardBackground?.enabled && colorSettings.cardBackground.useGradient,
      gradientStart: colorSettings?.cardBackground?.gradientColor1 || '#ffffff',
      gradientEnd: colorSettings?.cardBackground?.gradientColor2 || '#f0f0f0',
      gradientDirection: colorSettings?.cardBackground?.gradientDirection || 'to right',
      opacity: colorSettings?.cardBackground?.opacity || 1
    };
    
    const commonProps = {
      key: card.id,
      id: card.id,
      editable: editable,
      onUpdate: (updatedData) => {
        const updatedCard = { ...card, ...updatedData };
        if (onCardUpdate) {
          const targetCardId = updatedData.cardId || card.id;
          onCardUpdate(targetCardId, updatedData);
        }
      },
      onDelete: () => {},
      gridSize: card.gridSize || gridSize,
      onClick: (event) => handleCardClick(card, event),
      maxTitleHeight: maxTitleHeight,
      size: getCardSize(),
      // Добавляем настройки анимации для карточки
      animationSettings: card.animationSettings || {
        animationType: 'fadeIn',
        delay: 0.1,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      },
      // Передаем customStyles для применения цветов
      customStyles: card.customStyles || {},
      // 🔥 НОВОЕ: Передаем colorSettings для приоритетного применения стилей
      colorSettings: card.colorSettings || {},
      // Добавляем специальные стили для множественных карточек
      sx: {
        height: 'auto !important', // Автоматическая высота
        minHeight: '320px', // Минимальная высота
        maxHeight: 'none', // Убираем ограничение максимальной высоты
        '& .MuiCardContent-root': {
          height: 'auto', // Автоматическая высота контента
          overflow: 'visible', // Показываем весь контент
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        },
        '& .card-content-text': {
          overflow: 'hidden', // Ограничиваем текст
          display: '-webkit-box',
          WebkitLineClamp: 6, // Ограничиваем до 6 строк (примерно 50 слов)
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '40px',
            height: '20px',
            background: 'linear-gradient(transparent, inherit)',
            pointerEvents: 'none'
          }
        }
      },
      ...cardWithAppliedStyles
    };

    if (cardType === 'image-card') {
      return <ImageCard {...commonProps} />;
    } else {
      return <BasicCard {...commonProps} />;
    }
  };

  const sectionBoxStyles = {
    padding: currentColorSettings.padding ? `${currentColorSettings.padding}px` : (sectionStyles?.padding || '20px'),
    borderRadius: sectionStyles?.borderRadius || '0px',
    minHeight: sectionStyles?.backgroundType !== 'transparent' ? '100px' : 'auto',
    ...getSectionBackgroundStyle()
  };

  return (
    <AnimationWrapper {...sectionAnimationSettings}>
      <Box sx={sectionBoxStyles}>
        {/* Заголовок секции */}
        {(title || description) && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            {title && (
              <Typography variant="h4" gutterBottom sx={{ 
                color: (() => {
                  const titleColor = currentColorSettings.textFields?.title || sectionStyles?.titleColor || '#1976d2';
                  console.log('🎯 [MultipleCardsSection] Заголовок секции цвет:', {
                    titleColor,
                    currentColorSettings: currentColorSettings,
                    textFields: currentColorSettings.textFields,
                    sectionStyles: sectionStyles
                  });
                  return titleColor;
                })(),
                fontWeight: 'bold' 
              }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body1" sx={{ 
                color: (() => {
                  const textColor = currentColorSettings.textFields?.text || currentColorSettings.textFields?.description || sectionStyles?.descriptionColor || '#666666';
                  console.log('🎯 [MultipleCardsSection] Описание секции цвет:', {
                    textColor,
                    currentColorSettings: currentColorSettings,
                    textFields: currentColorSettings.textFields,
                    sectionStyles: sectionStyles
                  });
                  return textColor;
                })(),
                mb: 2 
              }}>
                {description}
              </Typography>
            )}
          </Box>
        )}

        {/* Панель управления (только в режиме редактирования) */}
        {editable && (
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewCarouselIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Секция с карточками
                </Typography>
                <Chip label={`${cards.length} карточек`} size="small" color="primary" />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Редактировать секцию">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={onEdit}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить секцию">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={onDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Сетка карточек */}
        {cards.length > 0 && (
          <Box 
            ref={gridRef}
            className={`cards-grid cards-grid-auto`}
            sx={{ 
              mt: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
              '& > *': {
                width: cards.length === 1 ? '300px' : 
                       cards.length === 2 ? 'calc(50% - 12px)' :
                       cards.length === 3 ? 'calc(33.333% - 16px)' : 
                       'calc(25% - 18px)', // 4+ карточек по 25% ширины
                minWidth: '250px',
                maxWidth: cards.length === 1 ? '400px' : '320px'
              }
            }}
          >
            {cards.map(renderCard)}
          </Box>
        )}

        {cards.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" color="text.secondary">
              Карточки не добавлены
            </Typography>
          </Paper>
        )}

        {/* Модальное окно для просмотра карточки */}
        <CardModal
          open={modalOpen}
          onClose={handleCloseModal}
          card={selectedCard}
          cardType={cardType}
        />
      </Box>
    </AnimationWrapper>
  );
};

export default MultipleCardsSection; 