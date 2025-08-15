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
  const gridRef = useRef(null);
  
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
    
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  // Функция для генерации стилей фона секции
  const getSectionBackgroundStyle = () => {
    const styles = {};
    
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
    // Применяем стили из customStyles к основным пропсам карточки
    const cardWithAppliedStyles = {
      ...card,
      // Применяем цвета из customStyles к основным пропсам
      titleColor: card.customStyles?.titleColor || card.titleColor || '#333333',
      contentColor: card.customStyles?.textColor || card.contentColor || '#666666',
      backgroundColor: card.customStyles?.backgroundColor || card.backgroundColor || '#ffffff',
      borderColor: card.customStyles?.borderColor || card.borderColor || '#e0e0e0',
      // Для градиентов
      useGradient: card.customStyles?.backgroundType === 'gradient',
      gradientStart: card.customStyles?.gradientColor1 || card.gradientStart || '#ffffff',
      gradientEnd: card.customStyles?.gradientColor2 || card.gradientEnd || '#f5f5f5',
      gradientDirection: card.customStyles?.gradientDirection || card.gradientDirection || 'to right'
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
        console.log('Карточка обновлена:', card.id, updatedData);
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
      // Добавляем специальные стили для множественных карточек
      sx: {
        height: '280px !important', // Уменьшенная фиксированная высота
        maxHeight: '280px',
        '& .MuiCardContent-root': {
          height: 'calc(280px - 160px)', // Высота контента минус изображение
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
        '& .card-content-text': {
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2, // Уменьшаем до 2 строк
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          position: 'relative',
          '&::after': {
            content: '"..."',
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'inherit',
            padding: '0 4px'
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
    padding: sectionStyles?.padding || '20px',
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
              <Typography variant="h4" gutterBottom sx={{ color: sectionStyles?.titleColor || '#1976d2', fontWeight: 'bold' }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body1" sx={{ color: sectionStyles?.descriptionColor || '#666666', mb: 2 }}>
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