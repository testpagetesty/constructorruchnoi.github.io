import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
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
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import CardModal from './CardModal';
import ColorSettings from '../TextComponents/ColorSettings';

const BasicCard = ({
  title = 'Заголовок карточки',
  content = 'Это содержимое базовой карточки. Здесь можно разместить любой текст или описание.',
  buttonText = '',
  buttonLink = '',
  elevation = 2,
  variant = 'elevated',
  size = 'medium',
  alignment = 'left',
  showActions = false,
  customStyles = {},
  // Настройки цветов через ColorSettings
  colorSettings = {},
  onUpdate,
  onDelete,
  editable = true,
  animationSettings = {},
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  gridSize = 'medium',
  onClick = null,
  maxTitleHeight = 0,
  sx = {} // Добавляем sx пропс
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentButtonText, setCurrentButtonText] = useState(buttonText);
  const [currentButtonLink, setCurrentButtonLink] = useState(buttonLink);
  const [currentElevation, setCurrentElevation] = useState(elevation);
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentAlignment, setCurrentAlignment] = useState(alignment);
  const [showCardActions, setShowCardActions] = useState(showActions);
  // Используем только colorSettings для всех стилей
  const [currentColorSettings, setCurrentColorSettings] = useState(() => {
    // Инициализируем с дефолтными значениями если colorSettings пустые
    if (colorSettings && Object.keys(colorSettings).length > 0) {
      return colorSettings;
    }
    return {
      textFields: {
        title: '#ffd700',
        text: '#ffffff',
        background: 'rgba(0,0,0,0.85)',
        border: '#c41e3a'
      },
      sectionBackground: {
        enabled: false,
        useGradient: false,
        solidColor: 'rgba(0,0,0,0.85)',
        gradientColor1: '#c41e3a',
        gradientColor2: '#ffd700',
        gradientDirection: 'to right',
        opacity: 1
      },
      borderColor: '#c41e3a',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      boxShadow: false
    };
  });
  
  // Получаем цвета из customStyles (приоритет) или colorSettings
  const titleColorFromSettings = customStyles?.titleColor || currentColorSettings.textFields?.title || '#ffd700';
  const textColorFromSettings = customStyles?.textColor || currentColorSettings.textFields?.text || '#ffffff';
  const backgroundColorFromSettings = customStyles?.backgroundColor || currentColorSettings.textFields?.background || 'rgba(0,0,0,0.85)';
  const borderColorFromSettings = customStyles?.borderColor || currentColorSettings.textFields?.border || '#c41e3a';
  const [localEditing, setLocalEditing] = useState(false);
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState(animationSettings || {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });

  // Синхронизируем customStyles с локальным состоянием
  useEffect(() => {
    if (customStyles && Object.keys(customStyles).length > 0) {
      // Обновляем цвета из customStyles
      if (customStyles.titleColor) {
        setCurrentColorSettings(prev => ({
          ...prev,
          textFields: {
            ...prev.textFields,
            title: customStyles.titleColor
          }
        }));
      }
      if (customStyles.textColor) {
        setCurrentColorSettings(prev => ({
          ...prev,
          textFields: {
            ...prev.textFields,
            text: customStyles.textColor
          }
        }));
      }
      if (customStyles.backgroundColor) {
        setCurrentColorSettings(prev => ({
          ...prev,
          textFields: {
            ...prev.textFields,
            background: customStyles.backgroundColor
          }
        }));
      }
      if (customStyles.borderColor) {
        setCurrentColorSettings(prev => ({
          ...prev,
          borderColor: customStyles.borderColor
        }));
      }
    }
  }, [customStyles]);
  const [modalOpen, setModalOpen] = useState(false);

  const variants = [
    { value: 'elevated', label: 'Приподнятая', description: 'С тенью' },
    { value: 'outlined', label: 'С рамкой', description: 'Только граница' },
    { value: 'filled', label: 'Заполненная', description: 'Цветной фон' }
  ];

  const sizes = [
    { value: 'small', label: 'Маленькая', padding: '12px', fontSize: '14px' },
    { value: 'medium', label: 'Средняя', padding: '16px', fontSize: '16px' },
    { value: 'large', label: 'Большая', padding: '24px', fontSize: '18px' },
    { value: 'xl', label: 'Очень большая', padding: '32px', fontSize: '20px' },
    { value: 'xxl', label: 'Огромная', padding: '40px', fontSize: '22px' },
    { value: 'xxxl', label: 'Максимальная', padding: '48px', fontSize: '24px' }
  ];

  const alignments = [
    { value: 'left', label: 'По левому краю' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'По правому краю' }
  ];

  const elevations = [
    { value: 0, label: 'Без тени' },
    { value: 1, label: 'Минимальная' },
    { value: 2, label: 'Слабая' },
    { value: 4, label: 'Средняя' },
    { value: 8, label: 'Сильная' },
    { value: 16, label: 'Максимальная' }
  ];

  const getCardStyles = () => {
    const sizeConfig = sizes.find(s => s.value === currentSize) || sizes[1];
    

    
    const baseStyles = {
      padding: currentColorSettings.padding ? `${currentColorSettings.padding}px` : sizeConfig.padding,
      textAlign: currentAlignment,
      transition: 'all 0.3s ease',
      cursor: editable ? 'pointer' : 'default'
    };

    // Определяем фон карточки
    let backgroundStyle = {};
    
    // Применяем настройки фона из customStyles (приоритет) или colorSettings
    if (customStyles?.backgroundType === 'gradient') {
      backgroundStyle = {
        background: `linear-gradient(${customStyles.gradientDirection || 'to right'}, ${customStyles.gradientColor1 || '#ffffff'}, ${customStyles.gradientColor2 || '#f5f5f5'})`
      };
    } else if (currentColorSettings.sectionBackground?.enabled) {
      const { sectionBackground } = currentColorSettings;
      if (sectionBackground.useGradient) {
        backgroundStyle = {
          background: `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`
        };
      } else {
        backgroundStyle = {
          backgroundColor: sectionBackground.solidColor
        };
      }
      if (sectionBackground.opacity !== undefined) {
        backgroundStyle.opacity = sectionBackground.opacity;
      }
    } else {
      backgroundStyle = {
        backgroundColor: backgroundColorFromSettings
      };
    }

    // Применяем настройки границы из customStyles (приоритет) или colorSettings
    let borderStyle = {};
    if (customStyles?.borderColor) {
      borderStyle = {
        border: `${customStyles.borderWidth || 1}px solid ${customStyles.borderColor}`,
        borderRadius: `${customStyles.borderRadius || 8}px`
      };
    } else if (currentColorSettings.borderColor) {
      borderStyle = {
        border: `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`,
        borderRadius: `${currentColorSettings.borderRadius || 8}px`
      };
    } else if (currentVariant === 'outlined') {
      borderStyle = {
        border: `1px solid ${borderColorFromSettings}`,
        borderRadius: `${customStyles?.borderRadius || currentColorSettings.borderRadius || 8}px`
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
          ...baseStyles,
          ...backgroundStyle,
          ...borderStyle,
          ...additionalStyles,
          boxShadow: 'none'
        };
      case 'filled':
        return {
          ...baseStyles,
          ...backgroundStyle,
          ...additionalStyles,
          border: 'none',
          borderRadius: `${customStyles?.borderRadius || currentColorSettings.borderRadius || 8}px`,
          boxShadow: 'none'
        };
      default: // elevated
        return {
          ...baseStyles,
          ...backgroundStyle,
          ...additionalStyles,
          border: 'none',
          borderRadius: `${customStyles?.borderRadius || currentColorSettings.borderRadius || 8}px`,
          boxShadow: currentElevation
        };
    }
  };

  const handleColorUpdate = (newColorSettings) => {
    // Обновляем colorSettings напрямую
    setCurrentColorSettings(newColorSettings);
  };

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    const newData = {
      title: currentTitle,
      content: currentContent,
      buttonText: currentButtonText,
      buttonLink: currentButtonLink,
      elevation: currentElevation,
      variant: currentVariant,
      size: currentSize,
      alignment: currentAlignment,
      showActions: showCardActions,
      colorSettings: currentColorSettings,
      animationSettings: currentAnimationSettings
    };
    if (onSave) {
      onSave(newData);
    } else if (onUpdate) {
      onUpdate(newData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setCurrentTitle(title);
    setCurrentContent(content);
    setCurrentButtonText(buttonText);
    setCurrentButtonLink(buttonLink);
    setCurrentElevation(elevation);
    setCurrentVariant(variant);
    setCurrentSize(size);
    setCurrentAlignment(alignment);
    setShowCardActions(showActions);
    setCurrentColorSettings(() => {
      if (colorSettings && Object.keys(colorSettings).length > 0) {
        return colorSettings;
      }
      return {
        textFields: {
          title: '#ffd700',
          text: '#ffffff',
          background: 'rgba(0,0,0,0.85)',
          border: '#c41e3a'
        },
        sectionBackground: {
          enabled: false,
          useGradient: false,
          solidColor: 'rgba(0,0,0,0.85)',
          gradientColor1: '#c41e3a',
          gradientColor2: '#ffd700',
          gradientDirection: 'to right',
          opacity: 1
        },
        borderColor: '#c41e3a',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        boxShadow: false
      };
    });
    setCurrentAnimationSettings(animationSettings);
    if (onCancel) {
      onCancel();
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

  const renderCard = () => (
    <Card
      className={`basic-card card-grid-${gridSize}`}
      onClick={handleCardClick}
      sx={{
        ...getCardStyles(),
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': editable ? {
          transform: 'translateY(-4px)',
          boxShadow: currentVariant === 'elevated' ? 
            `0 8px 25px rgba(0,0,0,0.15)` : 
            `0 4px 12px rgba(0,0,0,0.1)`
        } : {},
        '&:hover .card-overlay': {
          opacity: 1
        },
        // Применяем переданные sx стили
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
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Редактировать">
              <IconButton
                size="small"
                onClick={() => setLocalEditing(true)}
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

      <CardContent sx={{ 
        pb: showCardActions ? 1 : 2,
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
              color: titleColorFromSettings,
              fontWeight: 'bold',
              marginBottom: currentContent ? 2 : 0,
              minHeight: maxTitleHeight > 0 ? `${maxTitleHeight}px` : 'auto'
            }}
          >
            {currentTitle}
          </Typography>

          {/* Содержимое */}
          {currentContent && (
            <Box sx={{ position: 'relative' }}>
            <Typography
              variant="body2"
              className="card-content-text"
              sx={{
                color: textColorFromSettings,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 6, // Ограничиваем до 6 строк (примерно 50 слов)
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {currentContent}
            </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Действия */}
      {showCardActions && (currentButtonText || currentButtonLink) && (
        <CardActions sx={{ pt: 0 }}>
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


    </Card>
  );

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <AnimationWrapper {...currentAnimationSettings}>
      <Box>
        {/* Превью */}
        {!isCurrentlyEditing && (
          <Box 
            onDoubleClick={handleDoubleClick}
            onClick={onClick}
            sx={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            {renderCard()}
          </Box>
        )}

        {/* Редактор */}
        {isCurrentlyEditing && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="h6" color="primary">
              Редактирование карточки
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
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
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                value={currentButtonText}
                onChange={(e) => setCurrentButtonText(e.target.value)}
                label="Текст кнопки"
              />
              <TextField
                fullWidth
                value={currentButtonLink}
                onChange={(e) => setCurrentButtonLink(e.target.value)}
                label="Ссылка (необязательно)"
                placeholder="https://example.com"
              />
            </Box>
          )}

          {/* Настройки внешнего вида */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Вариант</InputLabel>
              <Select
                value={currentVariant}
                label="Вариант"
                onChange={(e) => setCurrentVariant(e.target.value)}
              >
                {variants.map(variant => (
                  <MenuItem key={variant.value} value={variant.value}>
                    <Box>
                      <Typography variant="body2">{variant.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {variant.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Размер</InputLabel>
              <Select
                value={currentSize}
                label="Размер"
                onChange={(e) => setCurrentSize(e.target.value)}
              >
                {sizes.map(size => (
                  <MenuItem key={size.value} value={size.value}>
                    {size.label}
                  </MenuItem>
                ))}
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

          {/* Тень */}
          {currentVariant === 'elevated' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Тень</InputLabel>
              <Select
                value={currentElevation}
                label="Тень"
                onChange={(e) => setCurrentElevation(e.target.value)}
              >
                {elevations.map(elevation => (
                  <MenuItem key={elevation.value} value={elevation.value}>
                    {elevation.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}





          {/* Настройки цветов через ColorSettings */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки цветов через ColorSettings:</Typography>
            <ColorSettings
              title="Настройки цветов карточки"
              colorSettings={currentColorSettings}
              onUpdate={handleColorUpdate}
              availableFields={[
                {
                  name: 'title',
                  label: 'Цвет заголовка',
                  description: 'Цвет заголовка карточки',
                  defaultColor: '#ffd700'
                },
                {
                  name: 'text',
                  label: 'Цвет текста',
                  description: 'Цвет основного текста карточки',
                  defaultColor: '#ffffff'
                },
                {
                  name: 'background',
                  label: 'Цвет фона',
                  description: 'Цвет фона карточки',
                  defaultColor: 'rgba(0,0,0,0.85)'
                },
                {
                  name: 'border',
                  label: 'Цвет границы',
                  description: 'Цвет границы карточки',
                  defaultColor: '#c41e3a'
                }
              ]}
              defaultColors={{
                title: '#ffd700',
                text: '#ffffff',
                background: 'rgba(0,0,0,0.85)',
                border: '#c41e3a'
              }}
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

          {/* Настройки анимации */}
          <AnimationControls
            animationSettings={currentAnimationSettings}
            onUpdate={setCurrentAnimationSettings}
            expanded={false}
          />

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Отмена
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Paper>
      )}

      {/* Модальное окно для просмотра карточки */}
      <CardModal
        open={modalOpen}
        onClose={handleCloseModal}
        card={{
          title: currentTitle,
          content: currentContent,
          buttonText: currentButtonText,
          buttonLink: currentButtonLink,
          colorSettings: currentColorSettings
        }}
        cardType="basic-card"
      />
    </Box>
    </AnimationWrapper>
  );
};

export default BasicCard; 