import React, { useState } from 'react';
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
  Tooltip,
  RadioGroup,
  FormControlLabel as MuiFormControlLabel,
  Radio,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import GradientIcon from '@mui/icons-material/Gradient';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import CardModal from './CardModal';

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
  const [cardStyles, setCardStyles] = useState({
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderColor: '#c41e3a',
    borderWidth: 1,
    borderRadius: 8,
    textColor: '#ffffff',
    titleColor: '#ffd700',
    backgroundType: customStyles?.backgroundType || 'solid', // 'solid', 'gradient'
    gradientColor1: customStyles?.gradientColor1 || '#c41e3a',
    gradientColor2: customStyles?.gradientColor2 || '#ffd700',
    gradientDirection: customStyles?.gradientDirection || 'to right',
    ...customStyles
  });
  const [localEditing, setLocalEditing] = useState(false);
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState(animationSettings || {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });
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
      padding: sizeConfig.padding,
      textAlign: currentAlignment,
      transition: 'all 0.3s ease',
      cursor: editable ? 'pointer' : 'default'
    };

    // Определяем фон карточки
    let backgroundStyle = {};
    if (cardStyles.backgroundType === 'gradient') {
      backgroundStyle = {
        background: `linear-gradient(${cardStyles.gradientDirection}, ${cardStyles.gradientColor1}, ${cardStyles.gradientColor2})`
      };
    } else {
      backgroundStyle = {
        backgroundColor: cardStyles.backgroundColor
      };
    }

    switch (currentVariant) {
      case 'outlined':
        return {
          ...baseStyles,
          ...backgroundStyle,
          border: `${cardStyles.borderWidth}px solid ${cardStyles.borderColor}`,
          borderRadius: `${cardStyles.borderRadius}px`,
          boxShadow: 'none'
        };
      case 'filled':
        return {
          ...baseStyles,
          ...backgroundStyle,
          border: 'none',
          borderRadius: `${cardStyles.borderRadius}px`,
          boxShadow: 'none'
        };
      default: // elevated
        return {
          ...baseStyles,
          ...backgroundStyle,
          border: 'none',
          borderRadius: `${cardStyles.borderRadius}px`,
          boxShadow: currentElevation
        };
    }
  };

  const handleStyleChange = (property, value) => {
    setCardStyles(prev => ({ ...prev, [property]: value }));
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
      customStyles: cardStyles,
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
    setCardStyles({
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#c41e3a',
      borderWidth: 1,
      borderRadius: 8,
      textColor: '#ffffff',
      titleColor: '#ffd700',
      backgroundType: 'solid',
      gradientColor1: '#c41e3a',
      gradientColor2: '#ffd700',
      gradientDirection: 'to right',
      ...customStyles
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
              color: cardStyles.titleColor,
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
                color: cardStyles.textColor,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {currentContent}
            </Typography>
              {/* Индикатор для полного содержимого */}
              {currentContent.length > 100 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: cardStyles.textColor,
                    opacity: 0.7,
                    fontStyle: 'italic',
                    mt: 0.5,
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  ...
                </Typography>
              )}
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
              sx={{ color: cardStyles.titleColor }}
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

          {/* Настройки фона */}
          <Typography variant="subtitle2" gutterBottom>
            Настройки фона:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Тип фона
            </Typography>
            <RadioGroup
              row
              value={cardStyles.backgroundType}
              onChange={e => handleStyleChange('backgroundType', e.target.value)}
            >
              <MuiFormControlLabel value="solid" control={<Radio />} label={<><FormatColorFillIcon sx={{ mr: 0.5 }} />Сплошной</>} />
              <MuiFormControlLabel value="gradient" control={<Radio />} label={<><GradientIcon sx={{ mr: 0.5 }} />Градиент</>} />
            </RadioGroup>
          </Box>

          {cardStyles.backgroundType === 'solid' && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Цвет фона"
                type="color"
                value={cardStyles.backgroundColor}
                onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><FormatColorFillIcon /></InputAdornment>
                }}
                sx={{ width: 180 }}
              />
            </Box>
          )}

          {cardStyles.backgroundType === 'gradient' && (
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                label="Цвет 1"
                type="color"
                value={cardStyles.gradientColor1}
                onChange={e => handleStyleChange('gradientColor1', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 120 }}
              />
              <TextField
                label="Цвет 2"
                type="color"
                value={cardStyles.gradientColor2}
                onChange={e => handleStyleChange('gradientColor2', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 120 }}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Направление</InputLabel>
                <Select
                  value={cardStyles.gradientDirection}
                  label="Направление"
                  onChange={e => handleStyleChange('gradientDirection', e.target.value)}
                >
                  <MenuItem value="to right">Справа налево</MenuItem>
                  <MenuItem value="to left">Слева направо</MenuItem>
                  <MenuItem value="to bottom">Сверху вниз</MenuItem>
                  <MenuItem value="to top">Снизу вверх</MenuItem>
                  <MenuItem value="135deg">135° (диагональ)</MenuItem>
                  <MenuItem value="45deg">45° (диагональ)</MenuItem>
                  <MenuItem value="225deg">225° (диагональ)</MenuItem>
                  <MenuItem value="315deg">315° (диагональ)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Цвета текста */}
          <Typography variant="subtitle2" gutterBottom>
            Настройки цветов текста:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              type="color"
              label="Цвет заголовка"
              value={cardStyles.titleColor}
              onChange={(e) => handleStyleChange('titleColor', e.target.value)}
            />
            <TextField
              fullWidth
              type="color"
              label="Цвет текста"
              value={cardStyles.textColor}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
            />
          </Box>

          {currentVariant === 'outlined' && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                type="color"
                label="Цвет границы"
                value={cardStyles.borderColor}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              />
              <TextField
                fullWidth
                type="number"
                label="Толщина границы"
                value={cardStyles.borderWidth}
                onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
                inputProps={{ min: 1, max: 5 }}
              />
            </Box>
          )}

          {/* Скругление углов */}
          <TextField
            fullWidth
            type="number"
            label="Скругление углов (px)"
            value={cardStyles.borderRadius}
            onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
            inputProps={{ min: 0, max: 24 }}
            sx={{ mb: 3 }}
          />

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
          customStyles: cardStyles
        }}
        cardType="basic-card"
      />
    </Box>
    </AnimationWrapper>
  );
};

export default BasicCard; 